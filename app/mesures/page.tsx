// src/app/mesures/page.tsx

"use client";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import { Mesure, Patient, Device } from "@/utils/types";
import MesureTable from "@/components/MesureTable";
import MesureForm from "@/components/MesureForm";
import MesureChart from "@/components/MesureChart";
import MesureGroupedView from "@/components/MesureGroupedView";
import { PlusCircle, RefreshCw, ArrowLeft, ArrowRight, AlertTriangle } from "lucide-react";

const MesuresPageSkeleton = () => (
    <div className="p-4 sm:p-6 md:p-8 animate-pulse">
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-md w-48"></div>
            </div>
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="bg-slate-200 dark:bg-slate-700 rounded-lg h-72"></div>
                <div className="bg-slate-200 dark:bg-slate-700 rounded-lg h-72"></div>
                <div className="bg-slate-200 dark:bg-slate-700 rounded-lg h-72"></div>
            </div>
            <div className="bg-slate-200 dark:bg-slate-700 rounded-lg h-[40vh]"></div>
        </div>
    </div>
);

export default function MesuresPage() {
  const [mesures, setMesures] = useState<Mesure[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Mesure | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [next, setNext] = useState<string | null>(null);
  const [previous, setPrevious] = useState<string | null>(null);
  const [count, setCount] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'grouped' | 'table'>('grouped');

  const loadMesures = async (url?: string) => {
    try {
        const res = await api.get(url ?? "/mesures/");
        setMesures(res.data.results);
        setNext(res.data.next);
        setPrevious(res.data.previous);
        setCount(res.data.count);
    } catch { 
        throw new Error("Impossible de charger les mesures"); 
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
        setLoading(true);
        setError(null);
        try {
            await Promise.all([
                loadMesures(),
                api.get("/patients/").then(res => setPatients(res.data.results)),
                api.get("/devices/").then(res => setDevices(res.data.results))
            ]);
        } catch (err: any) { 
            setError(err.message || "Une erreur est survenue."); 
        } finally { 
            setLoading(false); 
        }
    };
    loadInitialData();
  }, []);

  const handleSaved = (m: Mesure) => { 
    loadMesures(); 
    setShowForm(false); 
    setEditing(null); 
  };

  const handleEdit = (m: Mesure) => { 
    setEditing(m); 
    setShowForm(true); 
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const handleCancel = () => { 
    setShowForm(false); 
    setEditing(null); 
  };

  if (loading && mesures.length === 0) return <MesuresPageSkeleton />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-2">Erreur de chargement</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-cyan-600 text-white rounded-md font-semibold hover:bg-cyan-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <main className="p-4 sm:p-6 md:p-8 bg-slate-50 dark:bg-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* En-tête de la page avec sélecteur de vue */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Suivi des Mesures</h1>
          <div className="flex items-center gap-2">
            {/* Sélecteur de vue */}
            <div className="flex border border-slate-300 dark:border-slate-600 rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode('grouped')}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  viewMode === 'grouped' 
                    ? 'bg-cyan-600 text-white' 
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                Vue Groupée
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  viewMode === 'table' 
                    ? 'bg-cyan-600 text-white' 
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                Tableau
              </button>
            </div>

            <button 
              onClick={() => loadMesures()} 
              className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-md font-semibold hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <RefreshCw size={16} /> Rafraîchir
            </button>
            <button 
              onClick={() => { setEditing(null); setShowForm(true); }} 
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-md font-semibold hover:bg-cyan-700 transition-colors"
            >
              <PlusCircle size={16} /> Nouvelle Mesure
            </button>
          </div>
        </div>

        {/* Formulaire de création/édition */}
        {showForm && (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md">
            <MesureForm 
              initial={editing ?? undefined} 
              onSaved={handleSaved} 
              onCancel={handleCancel} 
              patients={patients} 
              devices={devices} 
            />
          </div>
        )}

        {/* Section des graphiques */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Visualisations</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <MesureChart mesures={mesures} type="temperature" />
                <MesureChart mesures={mesures} type="heart_rate" />
                <MesureChart mesures={mesures} type="blood_pressure" />
            </div>
        </div>

        {/* Section des données (vue groupée ou tableau) */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white p-6">
              {viewMode === 'grouped' ? 'Mesures Groupées par Patient' : 'Historique des Mesures'}
            </h2>
            
            {viewMode === 'grouped' ? (
              <div className="p-6">
                <MesureGroupedView mesures={mesures} patients={patients} devices={devices} />
              </div>
            ) : (
              <>
                <MesureTable 
                  mesures={mesures} 
                  onEdit={handleEdit} 
                  onDeleted={loadMesures} 
                  patients={patients} 
                  devices={devices} 
                />
                <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Total : <span className="font-semibold">{count}</span> mesures
                    </p>
                    <div className="flex gap-2">
                        <button 
                          onClick={() => previous && loadMesures(previous.replace(process.env.NEXT_PUBLIC_API_BASE ?? "", ""))} 
                          disabled={!previous || loading} 
                          className="flex items-center gap-2 px-3 py-1.5 text-sm border border-slate-300 rounded-md disabled:opacity-50 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700 transition-colors"
                        >
                          <ArrowLeft size={14} /> Précédent
                        </button>
                        <button 
                          onClick={() => next && loadMesures(next.replace(process.env.NEXT_PUBLIC_API_BASE ?? "", ""))} 
                          disabled={!next || loading} 
                          className="flex items-center gap-2 px-3 py-1.5 text-sm border border-slate-300 rounded-md disabled:opacity-50 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700 transition-colors"
                        >
                          Suivant <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
              </>
            )}
        </div>
      </div>
    </main>
  );
}
