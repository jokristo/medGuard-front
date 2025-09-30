"use client";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import { Patient } from "@/utils/types";
import PatientTable from "@/components/PatientTable";
import PatientForm from "@/components/PatientForm";

export default function PatientsPage() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(true);
    const [next, setNext] = useState<string | null>(null);
    const [editing, setEditing] = useState<string | null>(null);
    const [previous, setPrevious] = useState<string | null>(null);
    const [count, setCount] = useState<number>(0);

    const load = async (url?: string) => {
        setLoading(true);
        try {
            const res = await api.get(url ?? "/patients/");
            // DRF pagination → data.results
            const data = res.data;
            setPatients(data.results);
            setNext(data.next);
            setPrevious(data.previous);
            setCount(data.count);
        } catch (err) {
            console.error("Erreur fetch patients", err);
            alert("Impossible de charger les patients");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const handleSaved = (p: Patient) => {
        load(); // recharge la première page
        setShowForm(false);
        setEditing(null);
    };



    const handleEdit = (p: Patient) => {
        setEditing(p);
        setShowForm(true);
    };

    const handleDeleted = (id: number) => {
        load(); // recharge après suppression
    };
    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Patients</h1>
                <div>
                    <button onClick={() => { setEditing(null); setShowForm(true); }} className="px-4 py-2 bg-green-600 text-white rounded">
                        + Nouveau patient
                    </button>
                    <button onClick={load} className="ml-2 px-4 py-2 border rounded">Rafraîchir</button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="col-span-1">
                    {showForm ? (
                        <PatientForm initial={editing ?? undefined} onSaved={handleSaved} onCancel={() => { setShowForm(false); setEditing(null); }} />
                    ) : (
                        <div className="p-4 border rounded bg-white">
                            <p className="text-sm text-gray-600">Cliquez sur « + Nouveau patient » pour ajouter.</p>
                        </div>
                    )}
                </div>

                <div className="col-span-1">
                    {loading ? (
                        <div>Chargement...</div>
                    ) : (
                        <PatientTable patients={patients} onEdit={handleEdit} onDeleted={handleDeleted} />
                    )}
                </div>
                <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-gray-600">
                        Total : {count} patients
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => previous && load(previous.replace(process.env.NEXT_PUBLIC_API_BASE ?? "", ""))}
                            disabled={!previous}
                            className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                            ← Précédent
                        </button>
                        <button
                            onClick={() => next && load(next.replace(process.env.NEXT_PUBLIC_API_BASE ?? "", ""))}
                            disabled={!next}
                            className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                            Suivant →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
