"use client";
import { useState, useEffect } from "react";
import { Patient } from "@/utils/types";
import api from "@/utils/api";

type Props = {
  onSaved: (p: Patient) => void;
  onCancel?: () => void;
  initial?: Partial<Patient>;
};

export default function PatientForm({ onSaved, onCancel, initial }: Props) {
  const [nom, setNom] = useState(initial?.nom ?? "");
  const [age, setAge] = useState(initial?.age ?? 30);
  const [sexe, setSexe] = useState(initial?.sexe ?? "M");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // State pour l'erreur
  const isEdit = Boolean(initial && initial.id);

  // Mettre à jour les champs si le patient initial change
  useEffect(() => {
    setNom(initial?.nom ?? "");
    setAge(initial?.age ?? 30);
    setSexe(initial?.sexe ?? "M");
    setEmail(initial?.email ?? "");
    setError(null); // Réinitialiser l'erreur quand le formulaire change
  }, [initial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Réinitialiser l'erreur avant chaque soumission
    try {
      const payload = { nom, age, sexe, email };
      let res;
      if (isEdit && initial?.id) {
        res = await api.put(`/patients/${initial.id}/`, payload);
      } else {
        res = await api.post("/patients/", payload);
      }
      onSaved(res.data);
    } catch (err: any) {
      console.error("Erreur save patient", err?.response?.data ?? err);
      // **AMÉLIORATION** : On met l'erreur dans l'état au lieu d'une alerte
      const errorMessage = err?.response?.data?.detail || "Une erreur inconnue est survenue.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Le JSX modernisé commence ici
  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-8 bg-white dark:bg-slate-800 rounded-lg shadow-md max-w-2xl mx-auto">
      
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 border-b pb-4 border-slate-200 dark:border-slate-700">
        {isEdit ? 'Modifier le Dossier Patient' : 'Nouveau Dossier Patient'}
      </h2>

      {error && (
        <div className="p-4 bg-red-50 text-red-800 rounded-lg border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-500/30">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="nom" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Nom complet
        </label>
        <input
          id="nom"
          type="text"
          className="block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Âge
          </label>
          <input
            id="age"
            type="number"
            className="block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            min={0}
          />
        </div>
        <div>
          <label htmlFor="sexe" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Sexe
          </label>
          <select
            id="sexe"
            className="block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            value={sexe}
            onChange={(e) => setSexe(e.target.value)}
          >
            <option value="M">Masculin</option>
            <option value="F">Féminin</option>
            <option value="Other">Autre</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="flex gap-4 justify-end pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md font-semibold hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Annuler
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-cyan-600 text-white rounded-md font-semibold hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          disabled={loading}
        >
          {loading ? "Enregistrement..." : isEdit ? "Mettre à jour" : "Créer le dossier"}
        </button>
      </div>
    </form>
  );
}