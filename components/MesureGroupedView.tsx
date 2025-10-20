// components/MesureGroupedView.tsx
"use client";
import { Mesure, Patient, Device } from "@/utils/types";
import { User, HardDrive, Thermometer, HeartPulse, Gauge, Droplets, Clock } from "lucide-react";

type Props = {
  mesures: Mesure[];
  patients: Patient[];
  devices: Device[];
};

// Configuration pour chaque type de mesure
const mesureConfig = {
  temperature: {
    name: "Température",
    unit: "°C",
    icon: <Thermometer className="w-5 h-5" />,
    color: "text-cyan-600",
    bgColor: "bg-cyan-50 dark:bg-cyan-900/20",
    borderColor: "border-cyan-200 dark:border-cyan-800"
  },
  heart_rate: {
    name: "Rythme Cardiaque",
    unit: " BPM",
    icon: <HeartPulse className="w-5 h-5" />,
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-800"
  },
  blood_pressure: {
    name: "Pression Artérielle",
    unit: " mmHg",
    icon: <Gauge className="w-5 h-5" />,
    color: "text-amber-600",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    borderColor: "border-amber-200 dark:border-amber-800"
  },
  glucose: {
    name: "Glucose",
    unit: " mg/dL",
    icon: <Droplets className="w-5 h-5" />,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    borderColor: "border-emerald-200 dark:border-emerald-800"
  }
};

export default function MesureGroupedView({ mesures, patients, devices }: Props) {
  // Fonctions utilitaires
  const getPatientName = (id: number) => patients.find((p) => p.id === id)?.nom ?? `Patient ${id}`;
  const getDeviceName = (id: number) => devices.find((d) => d.id === id)?.device_id ?? `Appareil ${id}`;

  // NOUVELLE APPROCHE : Grouper par patient + appareil + timestamp arrondi à la minute
  const groupedMesures = mesures.reduce((acc, mesure) => {
    // Arrondir le timestamp à la minute pour regrouper les envois simultanés
    const timestamp = new Date(mesure.timestamp);
    const roundedTimestamp = new Date(timestamp);
    roundedTimestamp.setSeconds(0, 0);
    
    const key = `${mesure.Patient}-${mesure.device}-${roundedTimestamp.getTime()}`;
    
    if (!acc[key]) {
      acc[key] = {
        patientId: mesure.Patient,
        deviceId: mesure.device,
        timestamp: mesure.timestamp, // Garder le timestamp original pour l'affichage
        roundedTimestamp: roundedTimestamp.getTime(),
        mesures: {
          temperature: null,
          heart_rate: null,
          blood_pressure: null,
          glucose: null
        }
      };
    }
    
    // Ajouter la mesure au type correspondant
    if (mesure.type_donne in acc[key].mesures) {
      acc[key].mesures[mesure.type_donne] = {
        valeur: mesure.valeur,
        id: mesure.id
      };
    }
    
    return acc;
  }, {} as Record<string, any>);

  // Convertir en tableau et trier par timestamp (plus récent d'abord)
  const groupedArray = Object.values(groupedMesures)
    .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  if (groupedArray.length === 0) {
    return (
      <div className="text-center py-16 px-6 text-slate-500 dark:text-slate-400">
        <Thermometer className="w-16 h-16 mx-auto mb-4 text-slate-300" />
        <p className="text-lg">Aucune mesure groupée trouvée</p>
        <p className="text-sm mt-2">Les mesures apparaîtront ici lorsqu'elles seront envoyées simultanément</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {groupedArray.map((group: any) => (
        <div key={`${group.patientId}-${group.deviceId}-${group.roundedTimestamp}`}>
          {/* En-tête du groupe */}
          <div className="mb-4 p-4 bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {getPatientName(group.patientId)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    {getDeviceName(group.deviceId)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Clock className="w-4 h-4" />
                <span>{new Date(group.timestamp).toLocaleString('fr-FR')}</span>
              </div>
            </div>
          </div>

          {/* Les 4 cartes de mesures */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(mesureConfig).map(([type, config]) => {
              const mesure = group.mesures[type];
              
              return (
                <div
                  key={type}
                  className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg border-2 overflow-hidden transition-all duration-200 hover:shadow-xl ${
                    mesure 
                      ? `${config.borderColor}`
                      : 'border-slate-200 dark:border-slate-600 opacity-80'
                  }`}
                >
                  {/* En-tête de la carte */}
                  <div className={`p-4 border-b ${mesure ? config.bgColor : 'bg-slate-50 dark:bg-slate-700'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${mesure ? config.bgColor : 'bg-slate-100 dark:bg-slate-600'}`}>
                        {config.icon}
                      </div>
                      <div>
                        <h3 className={`font-semibold text-sm ${mesure ? config.color : 'text-slate-500 dark:text-slate-400'}`}>
                          {config.name}
                        </h3>
                        <p className={`text-xs ${mesure ? 'text-slate-600 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                          {mesure ? "✓ Donnée reçue" : "⏳ En attente"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Corps de la carte */}
                  <div className="p-6 text-center">
                    {mesure ? (
                      <>
                        <p className={`text-3xl font-bold ${config.color} mb-2`}>
                          {mesure.valeur}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {config.unit}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-2xl font-bold text-slate-400 dark:text-slate-500 mb-2">
                          --
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {config.unit}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                          Donnée manquante
                        </p>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
