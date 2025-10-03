// src/app/devices/page.tsx

"use client";
import { useEffect, useState } from "react";
import { PlusCircle, RefreshCw, MessageSquarePlus, ArrowLeft, ArrowRight } from 'lucide-react';
import api from "@/utils/api";
import { Device, Patient } from "@/utils/types";
import DeviceTable from "@/components/DeviceTable";
import DeviceForm from "@/components/DeviceForm";

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Device | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [next, setNext] = useState<string | null>(null);
  const [previous, setPrevious] = useState<string | null>(null);
  const [count, setCount] = useState<number>(0);

  const load = async (url?: string) => {
    setLoading(true);
    try {
      const res = await api.get(url ?? "/devices/");
      setDevices(res.data.results);
      setNext(res.data.next);
      setPrevious(res.data.previous);
      setCount(res.data.count);
    } catch (err) {
      console.error("Erreur fetch devices", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
        setLoading(true);
        try {
            const [devicesRes, patientsRes] = await Promise.all([
                api.get("/devices/"),
                api.get("/patients/")
            ]);
            setDevices(devicesRes.data.results);
            setNext(devicesRes.data.next);
            setPrevious(devicesRes.data.previous);
            setCount(devicesRes.data.count);
            setPatients(patientsRes.data.results);
        } catch (err) {
            console.error("Erreur lors du chargement initial", err);
        } finally {
            setLoading(false);
        }
    };
    loadAll();
  }, []);

  const handleSaved = (d: Device) => {
    load();
    setShowForm(false);
    setEditing(null);
  };

  const handleEdit = (d: Device) => {
    setEditing(d);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleCancel = () => {
    setShowForm(false);
    setEditing(null);
  };

  return (
    // Conteneur principal de la page
    <main className="p-4 sm:p-6 md:p-8 bg-slate-50 dark:bg-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* En-tête de la page */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Gestion des Appareils</h1>
          <div className="flex items-center gap-2">
            <button onClick={() => load()} className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-md font-semibold hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors">
              <RefreshCw size={16} />
              Rafraîchir
            </button>
            <button onClick={() => { setEditing(null); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-md font-semibold hover:bg-cyan-700 transition-colors">
              <PlusCircle size={16} />
              Nouveau appareil
            </button>
          </div>
        </div>

        {/* Section du Formulaire (conditionnelle) */}
        {showForm && (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md">
            <DeviceForm initial={editing ?? undefined} onSaved={handleSaved} onCancel={handleCancel} patients={patients} />
          </div>
        )}
        
        {/* Section du Tableau */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md">
            {loading ? (
                <div className="text-center p-12">Chargement des données...</div>
            ) : (
                <>
                    <DeviceTable devices={devices} onEdit={handleEdit} onDeleted={load} patients={patients} />
                    {/* Pagination */}
                    <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-700">
                        <p className="text-sm text-slate-600 dark:text-slate-400">Total : <span className="font-semibold">{count}</span> appareils</p>
                        <div className="flex gap-2">
                        <button
                            onClick={() => previous && load(previous.replace(process.env.NEXT_PUBLIC_API_BASE ?? "", ""))}
                            disabled={!previous}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm border border-slate-300 rounded-md disabled:opacity-50 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700 transition-colors"
                        >
                            <ArrowLeft size={14} /> Précédent
                        </button>
                        <button
                            onClick={() => next && load(next.replace(process.env.NEXT_PUBLIC_API_BASE ?? "", ""))}
                            disabled={!next}
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