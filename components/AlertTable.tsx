// src/components/AlertTable.tsx

"use client";
import { Alert, Patient, Device } from "@/utils/types";
import { ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";

type Props = {
  alerts: Alert[];
  patients: Patient[];
  devices: Device[];
};

export default function AlertTable({ alerts, patients, devices }: Props) {
  const getPatientName = (id?: number) =>
    patients.find((p) => p.id === id)?.nom ?? (id ? `Patient ${id}` : "-");
  const getDeviceName = (id?: number) =>
    devices.find((d) => d.id === id)?.device_id ?? (id ? `Device ${id}` : "-");
  
  // Fonction pour les badges de niveau avec des couleurs modernes et support du dark mode
  const LevelBadge = ({ niveau }: { niveau: string }) => {
    let styles = "";
    switch (niveau) {
      case "danger":
        styles = "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300";
        break;
      case "warning":
        styles = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300";
        break;
      default:
        styles = "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300";
        break;
    }
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles}`}>
        {niveau}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
        <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
          <tr>
            <th scope="col" className="px-6 py-3">Patient / Appareil</th>
            <th scope="col" className="px-6 py-3">Type d'Alerte</th>
            <th scope="col" className="px-6 py-3">Message</th>
            <th scope="col" className="px-6 py-3">Niveau</th>
            <th scope="col" className="px-6 py-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {alerts.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-10 px-6">
                <div className="flex flex-col items-center gap-2">
                    <ShieldCheck className="h-12 w-12 text-green-500" />
                    <span className="font-medium text-slate-900 dark:text-white">Aucune alerte à signaler</span>
                    <span className="text-slate-500 dark:text-slate-400">Tout est sous contrôle.</span>
                </div>
              </td>
            </tr>
          ) : (
            alerts.map((a) => (
              <tr key={a.id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-700/50">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900 dark:text-white">{getPatientName(a.Patient)}</div>
                  <div className="text-xs text-slate-500">{getDeviceName(a.device)}</div>
                </td>
                <td className="px-6 py-4 font-semibold">{a.type_alerte}</td>
                <td className="px-6 py-4">{a.message}</td>
                <td className="px-6 py-4">
                  <LevelBadge niveau={a.niveau} />
                </td>
                <td className="px-6 py-4">{new Date(a.created_at).toLocaleString('fr-FR')}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}