export interface Patient {
  id: number;
  nom: string;
  age: number;
  sexe: string;
  email: string;
  created_at?: string;
}

export interface Device {
  id: number;
  Patient: number;   // relation ForeignKey → id du patient
  device_id: string;
  type_capteur: string;
  status: boolean;
}

export interface Mesure {
  id: number;
  Patient: number;
  device: number;
  type_donne: string;  // ex: temperature, heart_rate
  valeur: number;
  timestamp: string;
}

export interface Alert {
  id: number;
  type_alerte: string;
  niveau: "danger" | "warning" | "info";
  message: string;
  created_at: string;
  Patient?: number;
  device?: number;
}
