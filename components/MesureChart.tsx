// src/components/MesureChart.tsx

"use client";
import { Mesure } from "@/utils/types";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { Thermometer, HeartPulse, Gauge } from "lucide-react";

type Props = {
  mesures: Mesure[];
  type: "temperature" | "heart_rate" | "blood_pressure";
};

// Configuration pour chaque type de mesure
const chartConfig = {
  temperature: {
    name: "Température",
    unit: "°C",
    stroke: "#06b6d4", // cyan
    icon: <Thermometer size={20} />,
  },
  heart_rate: {
    name: "Rythme Cardiaque",
    unit: " BPM",
    stroke: "#ef4444", // red
    icon: <HeartPulse size={20} />,
  },
  blood_pressure: {
    name: "Pression Artérielle",
    unit: " mmHg",
    stroke: "#f59e0b", // amber
    icon: <Gauge size={20} />,
  },
};

const CustomTooltip = ({ active, payload, label, config }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-700 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-600">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{`Heure: ${label}`}</p>
          <p className="text-sm" style={{ color: config.stroke }}>{`${config.name}: ${payload[0].value}${config.unit}`}</p>
        </div>
      );
    }
    return null;
};

export default function MesureChart({ mesures, type }: Props) {
  const config = chartConfig[type];
  const data = mesures
    .filter((m) => m.type_donne === type)
    .map((m) => ({
      valeur: m.valeur,
      date: new Date(m.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    }))
    .slice(-15); // On prend les 15 dernières

  if (data.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-full py-10 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">Aucune donnée pour {config.name}.</p>
        </div>
    );
  }

  return (
    <div className="h-full">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
            {config.icon} {config.name}
        </h3>
        <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: '#64748b' }} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: '#64748b' }} fontSize={12} tickLine={false} axisLine={false} unit={config.unit} />
                <Tooltip content={<CustomTooltip config={config} />} />
                <Line type="monotone" dataKey="valeur" stroke={config.stroke} strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
            </LineChart>
        </ResponsiveContainer>
    </div>
  );
}