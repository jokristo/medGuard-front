"use client";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import { Patient, Device, Mesure, Alert } from "@/utils/types";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Users, HardDrive, Activity, AlertTriangle, BarChart2, Bell, ShieldAlert, ShieldCheck } from "lucide-react";

// --- Types pour les données agrégées ---
type DashboardStats = {
  patients: number;
  devices: number;
  mesures: number;
  alerts: number;
};

// --- Composant Squelette pour un chargement élégant ---
const DashboardSkeleton = () => (
    <div className="p-4 sm:p-6 md:p-8 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-8"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="h-28 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
            <div className="h-28 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
            <div className="h-28 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
            <div className="h-28 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-80 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
            <div className="h-80 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
        </div>
    </div>
);

// --- Le composant principal de la page ---
export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [mesures, setMesures] = useState<Mesure[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // **AMÉLIORATION MAJEURE** : Chargement des données en parallèle
  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [resP, resD, resM, resA] = await Promise.all([
        api.get("/patients/?limit=1"), // On demande juste le "count"
        api.get("/devices/?limit=1"),
        api.get("/mesures/"),
        api.get("/alerts/?ordering=-created_at&limit=5") // On ne charge que les 5 dernières
      ]);
      setStats({
        patients: resP.data.count ?? 0,
        devices: resD.data.count ?? 0,
        mesures: resM.data.count ?? resM.data.length,
        alerts: resA.data.count ?? 0,
      });
      setMesures(resM.data.results ?? resM.data);
      setAlerts(resA.data.results ?? resA.data);
    } catch (err) {
      console.error("Erreur dashboard", err);
      setError("Impossible de charger les données du tableau de bord. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Transformation des données pour le graphique
  const chartData = mesures
    .filter((m) => m.type_donne === "temperature")
    .map((m) => ({
      valeur: m.valeur,
      date: new Date(m.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    }))
    .slice(-12);

  if (loading) return <DashboardSkeleton />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-2">Erreur de chargement</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
        <button onClick={load} className="px-4 py-2 bg-cyan-600 text-white rounded-md font-semibold hover:bg-cyan-700">
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <main className="p-4 sm:p-6 md:p-8 bg-slate-50 dark:bg-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Tableau de bord</h1>

        {/* --- Cartes de statistiques (KPIs) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={<Users className="text-cyan-500"/>} title="Patients" value={stats?.patients ?? 0} />
            <StatCard icon={<HardDrive className="text-emerald-500"/>} title="Appareils Actifs" value={stats?.devices ?? 0} />
            <StatCard icon={<Activity className="text-amber-500"/>} title="Mesures (24h)" value={stats?.mesures ?? 0} />
            <StatCard icon={<AlertTriangle className="text-red-500"/>} title="Alertes Actives" value={stats?.alerts ?? 0} />
        </div>

        {/* --- Grille principale (graphique et alertes) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* --- Graphique --- */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
                    <BarChart2 size={20} /> Dernières mesures de température
                </h2>
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                            <XAxis dataKey="date" tick={{ fill: '#64748b' }} fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis tick={{ fill: '#64748b' }} fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Line type="monotone" dataKey="valeur" stroke="#06b6d4" strokeWidth={2} dot={{ r: 4, fill: '#06b6d4' }} />
                        </LineChart>
                    </ResponsiveContainer>
                ) : <EmptyState message="Aucune donnée de température à afficher." />}
            </div>

            {/* --- Alertes récentes --- */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
                    <Bell size={20} /> Alertes Récentes
                </h2>
                <div className="space-y-4">
                    {alerts.length > 0 ? alerts.map(a => <AlertItem key={a.id} alert={a} />) 
                    : <EmptyState message="Aucune alerte récente." icon={<ShieldCheck className="mx-auto" />} />}
                </div>
            </div>
        </div>
      </div>
    </main>
  );
}

// --- Petits composants pour organiser le code ---

const StatCard = ({ icon, title, value }: { icon: React.ReactNode; title: string; value: number }) => (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-lg shadow-md flex items-center gap-4">
        <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-full">{icon}</div>
        <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        </div>
    </div>
);

const AlertItem = ({ alert }: { alert: Alert }) => {
    const levelInfo = {
        danger: { icon: <ShieldAlert className="text-red-500"/>, style: 'border-l-red-500' },
        warning: { icon: <ShieldAlert className="text-amber-500"/>, style: 'border-l-amber-500' },
        info: { icon: <ShieldCheck className="text-blue-500"/>, style: 'border-l-blue-500' },
    };
    const { icon, style } = levelInfo[alert.niveau] || levelInfo.info;

    return (
        <div className={`p-3 border-l-4 ${style} bg-slate-50 dark:bg-slate-800/50 rounded-r-md flex gap-3`}>
            <div>{icon}</div>
            <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{alert.message}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(alert.created_at).toLocaleString('fr-FR')}</p>
            </div>
        </div>
    );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-700 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-600">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{`Heure: ${label}`}</p>
        <p className="text-sm text-cyan-600 dark:text-cyan-400">{`Température: ${payload[0].value}°C`}</p>
      </div>
    );
  }
  return null;
};

const EmptyState = ({ message, icon }: { message: string, icon?: React.ReactNode }) => (
    <div className="flex flex-col items-center justify-center h-full py-10 text-center">
        {icon}
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{message}</p>
    </div>
);