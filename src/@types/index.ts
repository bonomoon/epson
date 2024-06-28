export interface ScoreFile {
  name?: string;
  type?: string;
  url: string;
}

export interface EpsonAuthToken {
  access_token: string;
  token_type: string;
  subject_id: string;
}

export type Status = 0 | 1 | 2;

export interface EpsonDeviceInfo {
  ec_connected: boolean;
  printer_name: string;
  serial_no: string;
}