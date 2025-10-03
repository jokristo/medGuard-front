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
    // La confirmation est une bonne pratique, on la garde.
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce patient ?")) return;
    
    setDeleting(id);
    try {
      await api.delete(`/patients/${id}/`);
      // Appelle la fonction de mise à jour dans le composant parent
      if (onDeleted) {
        onDeleted(id);
      }
    } catch (err) {
      console.error("Erreur suppression", err);
      // Remplacer l'alerte par un système de notification serait idéal à l'avenir
      alert("Impossible de supprimer le patient.");
    } finally {
      setDeleting(null);
    }
  };

  // Le JSX modernisé commence ici
  return (
    // Conteneur principal qui ajoute le style "card" et gère le scroll sur mobile
    <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-lg shadow-md">
      <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
        
        {/* En-tête du tableau avec un style moderne */}
        <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
          <tr>
            <th scope="col" className="px-6 py-3">ID</th>
            <th scope="col" className="px-6 py-3">Nom du Patient</th>
            <th scope="col" className="px-6 py-3">Âge</th>
            <th scope="col" className="px-6 py-3">Sexe</th>
            <th scope="col" className="px-6 py-3">Email</th>
            <th scope="col" className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        
        <tbody>
          {/* Si aucune donnée, afficher un message */}
          {patients.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-10 px-6 text-slate-500 dark:text-slate-400">
                Aucun patient trouvé.
              </td>
            </tr>
          ) : (
            patients.map((p) => (
              <tr 
                key={p.id} 
                className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-700/50"
              >
                {/* Cellules de données avec un meilleur espacement */}
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{p.id}</td>
                <td className="px-6 py-4">{p.nom}</td>
                <td className="px-6 py-4">{p.age}</td>
                <td className="px-6 py-4">{p.sexe}</td>
                <td className="px-6 py-4">{p.email}</td>
                <td className="px-6 py-4 flex gap-4 justify-end">
                  {/* Boutons d'action stylisés comme des liens pour un look plus propre */}
                  <button
                    onClick={() => onEdit(p)}
                    className="font-medium text-cyan-600 dark:text-cyan-500 hover:underline"
                  >
                    Éditer
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="font-medium text-red-600 dark:text-red-500 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={deleting === p.id}
                  >
                    {deleting === p.id ? "Suppression..." : "Supprimer"}
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