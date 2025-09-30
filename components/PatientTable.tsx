"use client";
import { useState } from "react";
import { Patient } from "@/utils/types";
import api from "@/utils/api";

type Props = {
  patients: Patient[];
  onEdit: (p: Patient) => void;
  onDeleted?: (id: number) => void;
};

export default function PatientTable({ patients, onEdit, onDeleted }: Props) {
  const [deleting, setDeleting] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce patient ?")) return;
    setDeleting(id);
    try {
      await api.delete(`/patients/${id}/`);
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
          <th className="p-2 border">Nom</th>
          <th className="p-2 border">Âge</th>
          <th className="p-2 border">Sexe</th>
          <th className="p-2 border">Email</th>
          <th className="p-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {patients.map((p) => (
          <tr key={p.id}>
            <td className="p-2 border">{p.id}</td>
            <td className="p-2 border">{p.nom}</td>
            <td className="p-2 border">{p.age}</td>
            <td className="p-2 border">{p.sexe}</td>
            <td className="p-2 border">{p.email}</td>
            <td className="p-2 border">
              <button onClick={() => onEdit(p)} className="px-2 py-1 mr-2 bg-yellow-400 rounded">Éditer</button>
              <button onClick={() => handleDelete(p.id)} className="px-2 py-1 bg-red-500 text-white rounded" disabled={deleting === p.id}>
                {deleting === p.id ? "Suppression..." : "Supprimer"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
