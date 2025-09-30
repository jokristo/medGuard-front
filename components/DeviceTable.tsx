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
    const p = patients.find((x) => x.id === id);
    return p ? p.nom : `Patient ${id}`;
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce device ?")) return;
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
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 border">ID</th>
          <th className="p-2 border">Patient</th>
          <th className="p-2 border">Device ID</th>
          <th className="p-2 border">Type</th>
          <th className="p-2 border">Status</th>
          <th className="p-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {devices.map((d) => (
          <tr key={d.id}>
            <td className="p-2 border">{d.id}</td>
            <td className="p-2 border">{getPatientName(d.Patient)}</td>
            <td className="p-2 border">{d.device_id}</td>
            <td className="p-2 border">{d.type_capteur}</td>
            <td className="p-2 border">{d.status ? "✅ Actif" : "❌ Inactif"}</td>
            <td className="p-2 border">
              <button onClick={() => onEdit(d)} className="px-2 py-1 mr-2 bg-yellow-400 rounded">Éditer</button>
              <button onClick={() => handleDelete(d.id)} className="px-2 py-1 bg-red-500 text-white rounded" disabled={deleting === d.id}>
                {deleting === d.id ? "Suppression..." : "Supprimer"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
