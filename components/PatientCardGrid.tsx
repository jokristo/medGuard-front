// components/PatientCardGrid.tsx
"use client";
import { useState } from "react";
import { Patient } from "@/utils/types";
import api from "@/utils/api";
import { Edit3, Trash2, User, Mail, Calendar, VenusAndMars } from 'lucide-react';

type Props = {
  patients: Patient[];
  onEdit: (p: Patient) => void;
  onDeleted?: (id: number) => void;
};

export default function PatientCardGrid({ patients, onEdit, onDeleted }: Props) {
  const [deleting, setDeleting] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce patient ?")) return;
    
    setDeleting(id);
    try {
      await api.delete(`/patients/${id}/`);
      if (onDeleted) {
        onDeleted(id);
      }
    } catch (err) {
      console.error("Erreur suppression", err);
      alert("Impossible de supprimer le patient.");
    } finally {
      setDeleting(null);
    }
  };

  // Fonction pour générer une couleur basée sur l'ID du patient
  const getPatientColor = (id: number) => {
    const colors = [
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500', 
      'from-green-500 to-emerald-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-purple-500',
      'from-teal-500 to-cyan-500'
    ];
    return colors[id % colors.length];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {patients.length === 0 ? (
        <div className="col-span-full text-center py-16 px-6 text-slate-500 dark:text-slate-400">
          <User className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <p className="text-lg">Aucun patient trouvé</p>
          <p className="text-sm mt-2">Commencez par ajouter votre premier patient</p>
        </div>
      ) : (
        patients.map((patient) => (
          <div
            key={patient.id}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* En-tête avec gradient coloré */}
            <div className={`h-3 bg-gradient-to-r ${getPatientColor(patient.id)}`}></div>
            
            {/* Contenu de la carte */}
            <div className="p-6">
              {/* ID et nom */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded">
                    ID: {patient.id}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2">
                    {patient.nom}
                  </h3>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                </div>
              </div>

              {/* Informations du patient */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{patient.age} ans</span>
                </div>
                
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <VenusAndMars className="w-4 h-4" />
                  <span className="text-sm capitalize">{patient.sexe}</span>
                </div>
                
                <div className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="text-sm break-all">{patient.email}</span>
                </div>
              </div>

              {/* Date de création si disponible */}
              {patient.created_at && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Créé le {new Date(patient.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-700/50 border-t border-slate-200 dark:border-slate-700">
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(patient)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg hover:bg-cyan-100 dark:hover:bg-cyan-900/30 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Éditer
                </button>
                <button
                  onClick={() => handleDelete(patient.id)}
                  disabled={deleting === patient.id}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                  {deleting === patient.id ? "..." : "Supprimer"}
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
