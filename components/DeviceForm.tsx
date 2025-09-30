"use client";
import { useState, useEffect } from "react";
import { Device, Patient } from "@/utils/types";
import api from "@/utils/api";

type Props = {
  onSaved: (d: Device) => void;
  onCancel?: () => void;
  initial?: Partial<Device>;
  patients: Patient[];
};

export default function DeviceForm({ onSaved, onCancel, initial, patients }: Props) {
  const [patientId, setPatientId] = useState(initial?.Patient ?? (patients[0]?.id ?? 0));
  const [deviceId, setDeviceId] = useState(initial?.device_id ?? "");
  const [typeCapteur, setTypeCapteur] = useState(initial?.type_capteur ?? "temperature");
  const [status, setStatus] = useState(initial?.status ?? true);
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(initial && initial.id);

  useEffect(() => {
    setPatientId(initial?.Patient ?? (patients[0]?.id ?? 0));
    setDeviceId(initial?.device_id ?? "");
    setTypeCapteur(initial?.type_capteur ?? "temperature");
    setStatus(initial?.status ?? true);
  }, [initial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { Patient: patientId, device_id: deviceId, type_capteur: typeCapteur, status };
      let res;
      if (isEdit && initial?.id) {
        res = await api.put(`/devices/${initial.id}/`, payload);
      } else {
        res = await api.post("/devices/", payload);
      }
      onSaved(res.data);
    } catch (err: any) {
      console.error("Erreur save device", err?.response?.data ?? err);
      alert("Erreur lors de l'enregistrement : " + (err?.response?.data ?? err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 bg-white rounded shadow">
      <div>
        <label className="block text-sm font-medium">Patient</label>
        <select className="border px-2 py-1 w-full" value={patientId} onChange={(e) => setPatientId(Number(e.target.value))}>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>{p.nom} ({p.age} ans)</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Device ID</label>
        <input className="border px-2 py-1 w-full" value={deviceId} onChange={(e) => setDeviceId(e.target.value)} required />
      </div>

      <div>
        <label className="block text-sm font-medium">Type de capteur</label>
        <input className="border px-2 py-1 w-full" value={typeCapteur} onChange={(e) => setTypeCapteur(e.target.value)} required />
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" checked={status} onChange={(e) => setStatus(e.target.checked)} />
        <span>Actif ?</span>
      </div>

      <div className="flex gap-2 justify-end">
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-3 py-1 border rounded">
            Annuler
          </button>
        )}
        <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded" disabled={loading}>
          {loading ? "Enregistrement..." : isEdit ? "Mettre à jour" : "Créer"}
        </button>
      </div>
    </form>
  );
}
