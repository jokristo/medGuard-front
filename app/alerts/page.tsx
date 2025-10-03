// src/app/alerts/page.tsx

"use client";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import { Alert, Patient, Device } from "@/utils/types";
import AlertTable from "@/components/AlertTable";
import { RefreshCw, ArrowLeft, ArrowRight, AlertTriangle } from "lucide-react";

// Squelette pour un chargement élégant
const AlertsPageSkeleton = () => (
    <div className="p-4 sm:p-6 md:p-8 animate-pulse">
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-md w-32"></div>
            </div>
            <div className="bg-slate-200 dark:bg-slate-700 rounded-lg h-[60vh]"></div>
        </div>
    </div>
);

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [next, setNext] = useState<string | null>(null);
  const [previous, setPrevious] = useState<string | null>(null);
  const [count, setCount] = useState<number>(0);

  const loadAlerts = async (url?: string) => {
    try {
      const res = await api.get(url ?? "/alerts/");
      setAlerts(res.data.results);
      setNext(res.data.next);
      setPrevious(res.data.previous);
      setCount(res.data.count);
    } catch (err) {
      throw new Error("Impossible de charger les alertes");
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Chargement de toutes les données en parallèle
            await Promise.all([
                loadAlerts(),
                api.get("/patients/").then(res => setPatients(res.data.results)),
                api.get("/devices/").then(res => setDevices(res.data.results))
            ]);
        } catch (err: any) {
            console.error("Erreur fetch alerts page", err);
            setError(err.message || "Une erreur est survenue.");
        } finally {
            setLoading(false);
        }
    };
    loadInitialData();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    await loadAlerts();
    setLoading(false);
  }

  if (loading) return <AlertsPageSkeleton />;
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-2">Erreur de chargement</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-cyan-600 text-white rounded-md font-semibold hover:bg-cyan-700">
          Recharger la page
        </button>
      </div>
    );
  }

  return (
    <main className="p-4 sm:p-6 md:p-8 bg-slate-50 dark:bg-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Centre d'Alertes</h1>
          <button onClick={handleRefresh} className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-md font-semibold hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors">
            <RefreshCw size={16} />
            Rafraîchir
          </button>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md">
          <AlertTable alerts={alerts} patients={patients} devices={devices} />
          
          <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-400">Total : <span className="font-semibold">{count}</span> alertes</p>
            <div className="flex gap-2">
              <button
                onClick={() => previous && loadAlerts(previous.replace(process.env.NEXT_PUBLIC_API_BASE ?? "", ""))}
                disabled={!previous}
                className="flex items-center gap-2 px-3 py-1.5 text-sm border border-slate-300 rounded-md disabled:opacity-50 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700 transition-colors"
              >
                <ArrowLeft size={14} /> Précédent
              </button>
              <button
                onClick={() => next && loadAlerts(next.replace(process.env.NEXT_PUBLIC_API_BASE ?? "", ""))}
                disabled={!next}
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