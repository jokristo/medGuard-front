"use client";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import { Patient } from "@/utils/types";
import PatientTable from "@/components/PatientTable";
import PatientForm from "@/components/PatientForm";
import { PlusCircle, RefreshCw, ArrowLeft, ArrowRight, UserCog, AlertTriangle } from 'lucide-react';

// Squelette pour un chargement élégant
const PatientsPageSkeleton = () => (
    <div className="p-4 sm:p-6 md:p-8 animate-pulse">
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-md w-48"></div>
            </div>
            <div className="bg-slate-200 dark:bg-slate-700 rounded-lg h-[60vh]"></div>
        </div>
    </div>
);

export default function PatientsPage() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Patient | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [next, setNext] = useState<string | null>(null);
    const [previous, setPrevious] = useState<string | null>(null);
    const [count, setCount] = useState<number>(0);

    const load = async (url?: string) => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get(url ?? "/patients/");
            setPatients(res.data.results);
            setNext(res.data.next);
            setPrevious(res.data.previous);
            setCount(res.data.count);
        } catch (err) {
            console.error("Erreur fetch patients", err);
            setError("Impossible de charger la liste des patients.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const handleSaved = (p: Patient) => {
        load();
        setShowForm(false);
        setEditing(null);
    };

    const handleEdit = (p: Patient) => {
        setEditing(p);
        setShowForm(true);
        // Fait défiler la page vers le haut pour voir le formulaire
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditing(null);
    };

    if (loading && patients.length === 0) return <PatientsPageSkeleton />;
    
    if (error) {
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-2">Erreur de chargement</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
            <button onClick={() => load()} className="px-4 py-2 bg-cyan-600 text-white rounded-md font-semibold hover:bg-cyan-700">
              Réessayer
            </button>
          </div>
        );
    }

    return (
        <main className="p-4 sm:p-6 md:p-8 bg-slate-50 dark:bg-slate-900 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* En-tête de la page */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dossiers Patients</h1>
                    <div className="flex items-center gap-2">
                        <button onClick={() => load()} className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-md font-semibold hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors">
                            <RefreshCw size={16} />
                            Rafraîchir
                        </button>
                        <button onClick={() => { setEditing(null); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-md font-semibold hover:bg-cyan-700 transition-colors">
                            <PlusCircle size={16} />
                            Nouveau Patient
                        </button>
                    </div>
                </div>

                {/* Section du Formulaire (conditionnelle) */}
                {showForm && (
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md">
                        <PatientForm initial={editing ?? undefined} onSaved={handleSaved} onCancel={handleCancel} />
                    </div>
                )}

                {/* Section du Tableau */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md">
                    {loading && <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500 animate-pulse"></div>}
                    <PatientTable patients={patients} onEdit={handleEdit} onDeleted={load} />
                    
                    {/* Pagination */}
                    <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-700">
                        <p className="text-sm text-slate-600 dark:text-slate-400">Total : <span className="font-semibold">{count}</span> patients</p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => previous && load(previous.replace(process.env.NEXT_PUBLIC_API_BASE ?? "", ""))}
                                disabled={!previous || loading}
                                className="flex items-center gap-2 px-3 py-1.5 text-sm border border-slate-300 rounded-md disabled:opacity-50 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700 transition-colors"
                            >
                                <ArrowLeft size={14} /> Précédent
                            </button>
                            <button
                                onClick={() => next && load(next.replace(process.env.NEXT_PUBLIC_API_BASE ?? "", ""))}
                                disabled={!next || loading}
                                className="flex items-center gap-2 px-3 py-1.5 text-sm border border-slate-300 rounded-md disabled:opacity-50 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700 transition-colors"
                            >
                                Suivant <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}