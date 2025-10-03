// src/components/MesureTable.tsx

"use client";
import { useState } from "react";
import { Mesure, Patient, Device } from "@/utils/types";
import api from "@/utils/api";

type Props = {
  mesures: Mesure[];
  onEdit: (m: Mesure) => void;
  onDeleted?: (id: number) => void;
  patients: Patient[];
  devices: Device[];
};

export default function MesureTable({ mesures, onEdit, onDeleted, patients, devices }: Props) {
  const [deleting, setDeleting] = useState<number | null>(null);

  const getPatientName = (id: number) => patients.find((p) => p.id === id)?.nom ?? `Patient ${id}`;
  const getDeviceName = (id: number) => devices.find((d) => d.id === id)?.device_id ?? `Device ${id}`;

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cette mesure ?")) return;
    setDeleting(id);
    try {
      await api.delete(`/mesures/${id}/`);
      onDeleted && onDeleted(id);
    } catch (err) {
      alert("Impossible de supprimer");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
        <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
          <tr>
            <th scope="col" className="px-6 py-3">Patient</th>
            <th scope="col" className="px-6 py-3">Appareil</th>
            <th scope="col" className="px-6 py-3">Type</th>
            <th scope="col" className="px-6 py-3">Valeur</th>
            <th scope="col" className="px-6 py-3">Date</th>
            <th scope="col" className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {mesures.length === 0 ? (
            <tr><td colSpan={6} className="text-center py-10">Aucune mesure trouvée.</td></tr>
          ) : (
            mesures.map((m) => (
              <tr key={m.id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50/50">
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{getPatientName(m.Patient)}</td>
                <td className="px-6 py-4">{getDeviceName(m.device)}</td>
                <td className="px-6 py-4">{m.type_donne}</td>
                <td className="px-6 py-4 font-semibold">{m.valeur}</td>
                <td className="px-6 py-4">{new Date(m.timestamp).toLocaleString('fr-FR')}</td>
                <td className="px-6 py-4 flex gap-4 justify-end">
                  <button onClick={() => onEdit(m)} className="font-medium text-cyan-600 hover:underline">Éditer</button>
                  <button onClick={() => handleDelete(m.id)} className="font-medium text-red-600 hover:underline" disabled={deleting === m.id}>
                    {deleting === m.id ? "..." : "Supprimer"}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}