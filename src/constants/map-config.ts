import { MapProps } from "@vis.gl/react-google-maps";

export const GOOGLE_MAPS_OPTIONS: MapProps = {  
  tilt: 0,
  heading: 0,
  defaultCenter: {
    lat: -7.518564,
    lng: 108.78803,
  },
  defaultZoom: 13,
  mapId: "fd14d0564358b590",
  mapTypeId: "satellite",
  mapTypeControl: false,
  isFractionalZoomEnabled: false,
  fullscreenControl: false,
  zoomControl: true,
  gestureHandling: "greedy",
  disableDefaultUI: true,
  rotateControl: true,
};


export const WATER_GATE_MAPS_OPTIONS = {
  lat: -7.548564,
  lng: 108.85803,
  zoom: 12,
} as const;

export const SIHKA_MAPS_OPTIONS = {
  lat: -7.388564,
  lng: 108.55803,
  zoom: 11,
} as const;

export const SIJAGACAI_MAPS_OPTIONS = {
  lat: -7.388564,
  lng: 108.55803,
  zoom: 11,
}as const;

export const INFRASTRUKTUR_MAPS_OPTIONS = {
  lat: -7.388564,
  lng: 108.55803,
  zoom: 11,
}as const;

export const MASTER_DATA_MAPS_OPTIONS = {
  lat: -7.388564,
  lng: 108.55803,
  zoom: 11,
}as const;