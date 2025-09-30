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
  const isEdit = Boolean(initial && initial.id);

  useEffect(() => {
    setNom(initial?.nom ?? "");
    setAge(initial?.age ?? 30);
    setSexe(initial?.sexe ?? "M");
    setEmail(initial?.email ?? "");
  }, [initial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
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
      alert("Erreur lors de l'enregistrement : " + (err?.response?.data ?? err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 bg-white rounded shadow">
      <div>
        <label className="block text-sm font-medium">Nom</label>
        <input className="border px-2 py-1 w-full" value={nom} onChange={(e) => setNom(e.target.value)} required />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium">Âge</label>
          <input type="number" className="border px-2 py-1 w-full" value={age} onChange={(e) => setAge(Number(e.target.value))} min={0} />
        </div>
        <div>
          <label className="block text-sm font-medium">Sexe</label>
          <select className="border px-2 py-1 w-full" value={sexe} onChange={(e) => setSexe(e.target.value)}>
            <option value="M">M</option>
            <option value="F">F</option>
            <option value="Other">Autre</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Email</label>
        <input type="email" className="border px-2 py-1 w-full" value={email} onChange={(e) => setEmail(e.target.value)} required />
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
