import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Projects a latitude and longitude to a point on the Mercator projection.
 *
 * @param {google.maps.LatLng} latLng - The latitude and longitude to project.
 * @returns {google.maps.Point} - The projected point.
 */
function project(latLng: google.maps.LatLng): google.maps.Point {
  const TILE_SIZE = 256;

  let siny = Math.sin((latLng.lat() * Math.PI) / 180);

  // Truncating to 0.9999 effectively limits latitude to 89.189. This is
  // about a third of a tile past the edge of the world tile.
  siny = Math.min(Math.max(siny, -0.9999), 0.9999);

  return new google.maps.Point(
    TILE_SIZE * (0.5 + latLng.lng() / 360),
    TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI))
  );
}

/**
 * Handy functions to project lat/lng to pixel
 * Extracted from: https://developers.google.com/maps/documentation/javascript/examples/map-coordinates
 * @param {google.maps.LatLng} latLng - The latitude and longitude to project.
 * @param {number} zoom - The zoom to project to.
 * @returns {google.maps.Point} - The projected point.
 **/
function getPixel(latLng: google.maps.LatLng, zoom: number): google.maps.Point {
  const scale = 1 << zoom;
  const worldCoordinate = project(latLng);
  return new google.maps.Point(
    Math.floor(worldCoordinate.x * scale),
    Math.floor(worldCoordinate.y * scale)
  );
}

/**
 * Given a Google Map, return the map dimension (width and height) in pixels.
 *
 * @param {google.maps.Map} map - The map to get the dimensions from.
 * @returns {{ width: number, height: number }} - The dimensions of the map.
 */
function getMapDimenInPixels(map: google.maps.Map): {
  width: number;
  height: number;
} {
  const zoom = map.getZoom();
  const bounds = map.getBounds();
  if (!bounds || !zoom) return { width: 0, height: 0 };

  const southWestPixel = getPixel(bounds.getSouthWest(), zoom);
  const northEastPixel = getPixel(bounds.getNorthEast(), zoom);
  return {
    width: Math.abs(southWestPixel.x - northEastPixel.x),
    height: Math.abs(southWestPixel.y - northEastPixel.y),
  };
}

/**
 * Given a map and a destLatLng returns true if calling
 * map.panTo(destLatLng) will be smoothly animated or false
 * otherwise.
 *
 * @param {google.maps.Map} map - The map to check.
 * @param {google.maps.LatLng} destLatLng - The latitude and longitude to check.
 * @param {number} [optionalZoomLevel] - The zoom level to check at.
 * @returns {boolean} - True if the pan to will be smoothly animated.
 */
function willAnimatePanTo(
  map: google.maps.Map,
  destLatLng: google.maps.LatLng,
  optionalZoomLevel?: number
): boolean {
  const dimen = getMapDimenInPixels(map);

  const mapCenter = map.getCenter();
  const zoomLevel = optionalZoomLevel ?? map.getZoom();

  if (!mapCenter || !zoomLevel) return false;

  const destPixel = getPixel(destLatLng, zoomLevel);
  const mapPixel = getPixel(mapCenter, zoomLevel);
  const diffX = Math.abs(destPixel.x - mapPixel.x);
  const diffY = Math.abs(destPixel.y - mapPixel.y);

  return diffX < dimen.width && diffY < dimen.height;
}

/**
 * Returns the optimal zoom value when animating
 * the zoom out.
 *
 * The maximum change will be `currentZoom - 3`.
 * Changing the zoom with a difference greater than
 * 3 levels will cause the map to "jump" and not
 * smoothly animate.
 *
 * Unfortunately the magical number "3" was empirically
 * determined as we could not find any official docs
 * about it.
 *
 * @param {google.maps.Map} map - The map to animate the zoom out on.
 * @param {google.maps.LatLng} latLng - The latitude and longitude to pan to.
 * @param {number} currentZoom - The current zoom level of the map.
 * @returns {number} - The optimal zoom value for the smooth animation.
 */
function getOptimalZoomOut(
  map: google.maps.Map,
  latLng: google.maps.LatLng,
  currentZoom: number
): number {
  if (willAnimatePanTo(map, latLng, currentZoom - 1)) {
    return currentZoom - 1;
  } else if (willAnimatePanTo(map, latLng, currentZoom - 2)) {
    return currentZoom - 2;
  } else {
    return currentZoom - 3;
  }
}

/**
 * Given a map and a destLatLng, smoothly animates the map center to
 * destLatLng by zooming out until distance (in pixels) between map center
 * and destLatLng are less than map width and height, then panTo to destLatLng
 * and finally animate to restore the initial zoom.
 *
 * @param {google.maps.Map} map - The map to animate on.
 * @param {google.maps.LatLng} destLatLng - The latitude and longitude to pan to.
 * @param {() => void} [optionalAnimationEndCallback] - Optional callback to call when the animation ends.
 */
function smoothlyAnimatePanToWorkarround(
  map: google.maps.Map,
  destLatLng: google.maps.LatLng,
  optionalZoomLevel?: number,
  optionalAnimationEndCallback?: () => void
): void {
  const initialZoom = map.getZoom();
  let listener: google.maps.MapsEventListener;

  optionalZoomLevel = optionalZoomLevel ? optionalZoomLevel : initialZoom;

  function zoomIn() {
    const zoom = map.getZoom();
    if (!zoom || !optionalZoomLevel) return;

    if (zoom < optionalZoomLevel) {
      map.setZoom(Math.min(zoom + 3, optionalZoomLevel));
    } else {
      google.maps.event.removeListener(listener);

      // here you should (re?)enable only the ui controls that make sense to your app
      map.setOptions({
        draggable: true,
        zoomControl: true,
        scrollwheel: true,
        disableDoubleClickZoom: false,
      });

      if (optionalAnimationEndCallback) {
        optionalAnimationEndCallback();
      }
    }
  }

  function zoomOut() {
    const zoom = map.getZoom();
    if (!zoom) return;
    if (willAnimatePanTo(map, destLatLng)) {
      google.maps.event.removeListener(listener);
      listener = google.maps.event.addListener(map, "idle", zoomIn);
      map.panTo(destLatLng);
    } else {
      map.setZoom(getOptimalZoomOut(map, destLatLng, zoom));
    }
  }

  // here you should disable all the ui controls that your app uses
  map.setOptions({
    draggable: false,
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
  });
  if (!initialZoom) return;
  map.setZoom(getOptimalZoomOut(map, destLatLng, initialZoom));
  listener = google.maps.event.addListener(map, "idle", zoomOut);
}

/**
 * If the map will smoothly animate a pan to the given destination, just call
 * `map.panTo(destLatLng)`. Otherwise, smoothly animate the map center to
 * `destLatLng` by zooming out until distance (in pixels) between map center
 * and `destLatLng` are less than map width and height, then pan to `destLatLng`
 * and finally animate to restore the initial zoom.
 *
 * @param {google.maps.Map} map - The map to animate on.
 * @param {{lat: number, lng: number}} destLatLng - The latitude and longitude to pan to.
 */

/**
 * If the map will smoothly animate a pan to the given destination, just call
 * `map.panTo(destLatLng)`. Otherwise, smoothly animate the map center to
 * `destLatLng` by zooming out until distance (in pixels) between map center
 * and `destLatLng` are less than map width and height, then pan to `destLatLng`
 * and finally animate to restore the initial zoom.
 *
 * @param {google.maps.Map} map - The map to animate on.
 * @param {{lat: number, lng: number}} destLatLng - The latitude and longitude to pan to.
 * @param {number} [optionalZoomLevel] - The zoom level to pan to.
 * @returns {Promise<void>} - A promise that resolves when the animation is complete.
 */
export async function smoothlyAnimatePanTo(
  map: google.maps.Map,
  destLatLng: google.maps.LatLng,
  optionalZoomLevel?: number
): Promise<void> {
  const adjustedLatLng = new google.maps.LatLng(
    destLatLng.lat(),
    destLatLng.lng()
  );
  // if (willAnimatePanTo(map, destLatLng, optionalZoomLevel)) {
  //   map.panTo(adjustedLatLng);
  //   if (optionalZoomLevel) {
  //     map.setZoom(optionalZoomLevel);
  //   }
  // } else {
  smoothlyAnimatePanToWorkarround(map, adjustedLatLng, optionalZoomLevel);
  // }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

export const getErrorMessage = (
  errorCode: number,
  action: "create" | "read" | "delete" | "update",
  type: string
) => {
  let actionText = "";
  switch (action) {
    case "create":
      actionText = "membuat";
      break;
    case "read":
      actionText = "membaca";
      break;
    case "delete":
      actionText = "menghapus";
      break;
    case "update":
      actionText = "memperbarui";
      break;
    default:
      actionText = "melakukan aksi pada";
  }
  switch (errorCode) {
    case 400:
      return `Terjadi kesalahan saat ${actionText} ${type}.`;
    case 401:
      return `Anda tidak memiliki izin untuk ${actionText} ${type}.`;
    case 403:
      return `Anda tidak memiliki izin untuk ${actionText} ${type}.`;
    case 404:
      return `${type} tidak ditemukan.`;
    case 500:
      return `Terjadi kesalahan pada server saat ${actionText} ${type}.`;
    default:
      return "Terjadi kesalahan.";
  }
};

export const checkWaterChannelStatus = (waterChannelProperties: {
  status_tma: boolean;
  garbage_detected: boolean;
  status_debit: string;
}) => {
  if (!waterChannelProperties.status_tma) {
    return "offline";
  }

  if (waterChannelProperties.garbage_detected) {
    return "warning";
  }

  if (waterChannelProperties.status_debit === "Tidak Terpenuhi") {
    return "warning";
  }

  return "default";
};
