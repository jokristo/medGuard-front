// src/components/DeviceTable.tsx

"use client";
import { useState } from "react";
import { Device, Patient } from "@/utils/types";
import api from "@/utils/api";

type Props = {
  devices: Device[];
  onEdit: (d: Device) => void;
  onDeleted?: (id: number) => void;
  patients: Patient[];
};

export default function DeviceTable({ devices, onEdit, onDeleted, patients }: Props) {
  const [deleting, setDeleting] = useState<number | null>(null);

  const getPatientName = (id: number) => {
    return patients.find((x) => x.id === id)?.nom ?? `Patient ${id}`;
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cet appareil ?")) return;
    setDeleting(id);
    try {
      await api.delete(`/devices/${id}/`);
      onDeleted && onDeleted(id);
    } catch (err) {
      console.error("Erreur suppression", err);
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
                    <th scope="col" className="px-6 py-3">Device ID</th>
                    <th scope="col" className="px-6 py-3">Patient Assigné</th>
                    <th scope="col" className="px-6 py-3">Type</th>
                    <th scope="col" className="px-6 py-3">Statut</th>
                    <th scope="col" className="px-6 py-3 text-right">Actions</th>
                </tr>
            </thead>
            <tbody>
                {devices.length === 0 ? (
                    <tr>
                        <td colSpan={5} className="text-center py-10 px-6">Aucun appareil trouvé.</td>
                    </tr>
                ) : (
                    devices.map((d) => (
                        <tr key={d.id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-700/50">
                            <td className="px-6 py-4 font-mono text-slate-900 dark:text-white">{d.device_id}</td>
                            <td className="px-6 py-4">{getPatientName(d.Patient)}</td>
                            <td className="px-6 py-4">{d.type_capteur}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    d.status 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                                    : 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300'
                                }`}>
                                    {d.status ? "Actif" : "Inactif"}
                                </span>
                            </td>
                            <td className="px-6 py-4 flex gap-4 justify-end">
                                <button onClick={() => onEdit(d)} className="font-medium text-cyan-600 dark:text-cyan-500 hover:underline">
                                    Éditer
                                </button>
                                <button onClick={() => handleDelete(d.id)} className="font-medium text-red-600 dark:text-red-500 hover:underline disabled:opacity-50" disabled={deleting === d.id}>
                                    {deleting === d.id ? "..." : "Supprimer"}
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