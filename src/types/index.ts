import { ColumnDef } from "@tanstack/react-table";

export type UserData = {
  id: string;
  email: string;
  email_verified: string;
  phone_number: string;
  name: string;
  enabled: boolean;
  user_access: string;
  created_at: string;
  updated_at: string;
};

export type UserAccess = {
  id: string;
  description: string;
  enabled: boolean;
};

export type DictionaryData = {
  title: string;
  description: string;
};

export type DictionaryItem = {
  key: string;
  value: string;
};

export type DocumentItem = {
  id: string;
  name: string;
  file_path: string;
};

export type DocumentData = {
  name: string;
  file: string;
};

export type CustomColumnMeta = {
  width?: string;
  minWidth?: string;
  maxWidth?: string;
};

export type CustomColumnDef<TData, TValue = unknown> = ColumnDef<
  TData,
  TValue
> & {
  meta?: CustomColumnMeta;
};

export type AlarmData = {
  id: number;
  saluran: string;
  pintu: string;
  prioritas: string;
  kondisi: string;
  penerima: Array<string>;
};

export type WaterConditionData = {
  saluran: string;
  tma: string;
  debitAktual: string;
  debitKebutuhan: string;
  status: string;
};

export type ActivityMonitoringData = {
  date: string;
  type: string;
  activity: string;
};

export type ListOfUnfulfilledDoorsData = {
  name: string;
  tma: number;
  actual_debit: number;
  debit_needs: number;
  channel_name: string;
  door_opening: string[] | null;
  status: string;
};

export type RainFallData = {
  id: string;
  nama: string;
  tipe: string;
  manual: number;
  telemetri: number;
  kondisi: string;
  penyedia: string;
  sejak: string;
  tertinggi: string;
  petugas: string;
  no_hp: string;
  elevasi: string;
  coordinates: {
    lat: number;
    long: number;
  };
};

export type AssetsData = {
  id: string;
  name: string;
  pic: string;
  location: string;
};

export type ProjectsData = {
  id: string;
  name: string;
  budget: number;
  status: string;
};

export type JDIHData = {
  id: string;
  Title: string;
  PublishedAt: string;
  Status: string;
};

export type EmployeesData = {
  id: string;
  name: string;
  role: string;
  joined_date: string;
  status: string;
};

export type PermitsData = {
  updated_at: string;
  no_sk: string;
  periode_pengambilan_sda: string;
  koordinat_di_lapangan: {
    type: string;
    coordinates: [number, number];
  };
};

export type RainfallsData = {
  id: string;
  external_id: number;
  name: string;
  officer: string;
  city: string;
  manual: number | null;
  telemetry: number;
  attendance_data: number;
  vendor: string;
  latest_update: string;
};

export type ClimatologyData = {
  id: string;
  external_id: number;
  name: string;
  rainfall: number;
  minimum_temperature: number;
  maximum_temperature: number;
  humidity: number;
  wind_speed: number;
  wind_direction: number;
  sunshine_duration: number | null;
};

export type WaterLevelData = {
  id: string;
  external_id: number;
  name: string;
  river: string;
  officer: string;
  manual: number | null;
  telemetry: number;
  latest_update: string;
};

export type WaterQualityData = {
  id: string;
  external_id: number;
  name: string;
  river: string;
};

export type AlarmConfigData = {
  id: string;
  channel_id: number;
  channel_name: string;
  // door_id?: number;
  // door_name?: string;
  priority: string;
  metric: string;
  condition_operator: string;
  condition_unit: string;
  condition_value: number;
  condition_duration: number;
  receiver_emails?: string[] | null;
  receiver_adam?: boolean;
  receiver_dashboard?: boolean;
  receiver_hawa?: boolean;
  receiver_whatsapps?: string[] | null;
};

export type ChannelData = {
  water_channel_door_id: number;
  name: string;
};

export type DoorData = {
  door_id: number;
  name: string;
};

export type AlarmHistoryData = {
  id: string;
  channel_id: number;
  channel_name: string;
  // door_id: number;
  // door_name: string;
  priority: string;
  metric: string;
  condition_operator: string;
  condition_unit: string;
  condition_value: number;
  condition_duration: number;
  alarm_config_uid: string;
  created_at: string;
  status: string;
  values: number;
};

export type MonitoringActivitiesData = {
  id: string;
  user_name: string;
  category: string;
  ActivityTime: string;
  Description: string;
  CreatedAt: string;
  UpdatedAt: string;
};

export type GeneralInfoData = {
  agricultural_info: string;
  planted_area: string;
  planting_season: string;
  cropping_pattern: string;
  water_requirement: string;
  water_availability: string;
  historical_chart: string;
  total_sensor_online: number;
  total_sensor_offline: number;
  total_cctv: number;
  total_staff: number;
};

export type WeatherForecastData = {
  date: string;
  time: string;
  status: string;
  temperature: string;
  humidity: string;
  wind_direction: string;
  wind_velocity: string;
  dam_upstream: string;
};

export type WaterConditionsData = {
  water_channel_name?: string;
  water_surface_elevation?: number;
  actual_debit?: number;
  required_debit?: number;
  water_channel_door_name?: string;
  status?: string;
};

export type NoPermitsData = {
  id: string;
  date: string;
  coordinates: {
    lat: number;
    long: number;
  };
  image: string;
  type: string;
};

export type RekomtekData = {
  id: string;
  status: string;
  no_sk: string;
  masa_berlaku_sk: string;
  koordinat_di_dalam_sk: {
    type: "Point";
    coordinates: [number, number];
  };
  cara_pengambilan_sda_dalam_sk: string;
  jenis_tipe_konstruksi_dalam_sk: string;
  kuota_air_dalam_sk: number;
  jadwal_pengambilan_dalam_sk: string;
  jadwal_pembangunan_dalam_sk: string;
  ketentuan_teknis_lainnya: string;
  perpanjangan: string;
  tanggal_sk: string;
  jenis_usaha: string;
  kab_kota: string;
  kecamatan: string;
  desa: string;
  sumber_air: string;
  alamat_pemohon: string;
  perusahaan_pemohon: string;
  pemohon: string;
  created_at: string;
  updated_at: string;
};

export type ReportsData = {
  perusahaan: string;
  laporan_perizinan: {
    id: string;
    status: string;
    no_sk: string;
    koordinat_di_lapangan: {
      type: "Point";
      coordinates: [number, number];
    };
    cara_pengambilan_sda_di_lapangan: string;
    jenis_tipe_konstruksi_di_lapangan: string;
    periode_pengambilan_sda: string;
    debit_pengambilan: number;
    laporan_pengambilan_air_bulanan: string | null;
    jadwal_pengambilan_di_lapangan: string;
    jadwal_pembangunan_di_lapangan: string;
    tanggal_pemegang_dilarang_mengambil_air: string;
    realisasi_di_lapangan: string;
    laporan_hasil_pemeriksaan_tim_verifikasi: string | null;
    file_keberadaan_alat_ukur_debit: string | null;
    file_keberadaan_sistem_telemetri: string | null;
    terdapat_air_dibuang_ke_sumber: boolean;
    debit_air_buangan: number;
    laporan_hasil_pemeriksaan_buangan: string | null;
    dokumen_bukti_bayar: string | null;
    dokumen_kewajiban_keuangan_lainnya: string | null;
    bukti_kerusakan_sumber_air: string | null;
    perbaikan_kerusakan: boolean;
    bukti_usaha_pengendalian_pencemaran: string | null;
    bentuk_usaha_pengendalian: string;
    bukti_penggunaan_air: string | null;
    debit_air_dihasilkan: number;
    manfaat_untuk_kegiatan: string;
    kegiatan_op: string;
    koordinasi_bbws_rencana_op: string;
    koordinasi_bbws_konstruksi: string;
    pl_debit_yang_digunakan: number;
    pl_kualitas_air_digunakan: string;
    pl_debit_yang_dikembalikan: number;
    pl_kualitas_air_dikembalikan: string;
    created_at: string;
    updated_at: string;
  };
  id: string;
  status: string;
  no_sk: string;
  masa_berlaku_sk: string;
  koordinat_di_dalam_sk: {
    type: "Point";
    coordinates: [number, number];
  };
  cara_pengambilan_sda_dalam_sk: string;
  jenis_tipe_konstruksi_dalam_sk: string;
  kuota_air_dalam_sk: number;
  jadwal_pengambilan_dalam_sk: string;
  jadwal_pembangunan_dalam_sk: string;
  ketentuan_teknis_lainnya: string;
  perpanjangan: string;
  tanggal_sk: string;
  jenis_usaha: string;
  kab_kota: string;
  kecamatan: string;
  desa: string;
  sumber_air: string;
  alamat_pemohon: string;
  perusahaan_pemohon: string;
  pemohon: string;
  created_at: string;
  updated_at: string;
};

export type AlertData = {
  alarm_config_uid: string;
  channel_id: number;
  channel_name: string;
  condition_duration: number;
  condition_operator: string;
  condition_unit: string;
  condition_value: number;
  created_at: string;
  door_id: number;
  door_name: string;
  id: string;
  metric: string;
  priority: string;
  status: string;
  values: number;
}[];
