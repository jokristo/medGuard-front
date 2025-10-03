// src/components/DeviceForm.tsx

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
  const [error, setError] = useState<string | null>(null);
  const isEdit = Boolean(initial && initial.id);

  useEffect(() => {
    setPatientId(initial?.Patient ?? (patients[0]?.id ?? 0));
    setDeviceId(initial?.device_id ?? "");
    setTypeCapteur(initial?.type_capteur ?? "temperature");
    setStatus(initial?.status ?? true);
    setError(null);
  }, [initial, patients]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) {
      setError("Veuillez sélectionner un patient.");
      return;
    }
    setLoading(true);
    setError(null);
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
      const errorMessage = err?.response?.data?.detail || "Erreur lors de l'enregistrement.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white";
  const labelClasses = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
        {isEdit ? 'Modifier un Appareil' : 'Ajouter un Appareil'}
      </h2>
      
      {error && (
        <div className="p-4 bg-red-50 text-red-800 rounded-lg border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-500/30">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="patient" className={labelClasses}>Patient</label>
        <select id="patient" className={inputClasses} value={patientId} onChange={(e) => setPatientId(Number(e.target.value))}>
          <option value="">-- Sélectionnez un patient --</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>{p.nom} ({p.age} ans)</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="deviceId" className={labelClasses}>Device ID</label>
        <input id="deviceId" className={inputClasses} value={deviceId} onChange={(e) => setDeviceId(e.target.value)} required />
      </div>

      <div>
        <label htmlFor="typeCapteur" className={labelClasses}>Type de capteur</label>
        <input id="typeCapteur" className={inputClasses} value={typeCapteur} onChange={(e) => setTypeCapteur(e.target.value)} required />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <input 
          id="status" 
          type="checkbox" 
          checked={status} 
          onChange={(e) => setStatus(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500" 
        />
        <label htmlFor="status" className="text-sm font-medium text-slate-700 dark:text-slate-300">Actif ?</label>
      </div>

      <div className="flex gap-4 justify-end pt-4">
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md font-semibold hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors">
            Annuler
          </button>
        )}
        <button type="submit" className="px-4 py-2 bg-cyan-600 text-white rounded-md font-semibold hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled={loading}>
          {loading ? "Enregistrement..." : isEdit ? "Mettre à jour" : "Créer l'appareil"}
        </button>
      </div>
    </form>
  );
}