// src/components/MesureForm.tsx

"use client";
import { useState, useEffect } from "react";
import { Mesure, Patient, Device } from "@/utils/types";
import api from "@/utils/api";

type Props = {
  onSaved: (m: Mesure) => void;
  onCancel?: () => void;
  initial?: Partial<Mesure>;
  patients: Patient[];
  devices: Device[];
};

export default function MesureForm({ onSaved, onCancel, initial, patients, devices }: Props) {
  const [patientId, setPatientId] = useState(initial?.Patient ?? (patients[0]?.id ?? 0));
  const [deviceId, setDeviceId] = useState(initial?.device ?? (devices[0]?.id ?? 0));
  const [typeDonne, setTypeDonne] = useState(initial?.type_donne ?? "temperature");
  const [valeur, setValeur] = useState(initial?.valeur ?? 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEdit = Boolean(initial && initial.id);

  useEffect(() => {
    setPatientId(initial?.Patient ?? (patients[0]?.id ?? 0));
    setDeviceId(initial?.device ?? (devices[0]?.id ?? 0));
    setTypeDonne(initial?.type_donne ?? "temperature");
    setValeur(initial?.valeur ?? 0);
    setError(null);
  }, [initial, patients, devices]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = { Patient: patientId, device: deviceId, type_donne: typeDonne, valeur };
      const res = isEdit && initial?.id
        ? await api.put(`/mesures/${initial.id}/`, payload)
        : await api.post("/mesures/", payload);
      onSaved(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Erreur lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white";
  const labelClasses = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            {isEdit ? 'Modifier une Mesure' : 'Ajouter une Mesure'}
        </h2>
        {error && <div className="p-4 bg-red-50 text-red-800 rounded-lg border border-red-200">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="patient" className={labelClasses}>Patient</label>
                <select id="patient" className={inputClasses} value={patientId} onChange={(e) => setPatientId(Number(e.target.value))}>
                    {patients.map((p) => (<option key={p.id} value={p.id}>{p.nom}</option>))}
                </select>
            </div>
            <div>
                <label htmlFor="device" className={labelClasses}>Appareil</label>
                <select id="device" className={inputClasses} value={deviceId} onChange={(e) => setDeviceId(Number(e.target.value))}>
                    {devices.map((d) => (<option key={d.id} value={d.id}>{d.device_id}</option>))}
                </select>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="typeDonne" className={labelClasses}>Type de donnée</label>
                <select id="typeDonne" className={inputClasses} value={typeDonne} onChange={(e) => setTypeDonne(e.target.value)}>
                    <option value="temperature">Température</option>
                    <option value="heart_rate">Rythme Cardiaque</option>
                    <option value="blood_pressure">Pression Artérielle</option>
                </select>
            </div>
            <div>
                <label htmlFor="valeur" className={labelClasses}>Valeur</label>
                <input id="valeur" type="number" step="0.1" className={inputClasses} value={valeur} onChange={(e) => setValeur(Number(e.target.value))} />
            </div>
        </div>
        <div className="flex gap-4 justify-end pt-4">
            {onCancel && <button type="button" onClick={onCancel} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md font-semibold hover:bg-slate-50 transition-colors">Annuler</button>}
            <button type="submit" className="px-4 py-2 bg-cyan-600 text-white rounded-md font-semibold hover:bg-cyan-700 disabled:opacity-50 transition-colors" disabled={loading}>
                {loading ? "Enregistrement..." : isEdit ? "Mettre à jour" : "Créer"}
            </button>
        </div>
    </form>
  );
}