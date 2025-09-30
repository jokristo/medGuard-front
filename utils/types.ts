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
