"use client";
import { useEffect, useState } from "react";
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
      const data = res.data;
      setDevices(data.results);
      setNext(data.next);
      setPrevious(data.previous);
      setCount(data.count);
    } catch (err) {
      console.error("Erreur fetch devices", err);
      alert("Impossible de charger les devices");
    } finally {
      setLoading(false);
    }
  };

  const loadPatients = async () => {
    try {
      const res = await api.get("/patients/");
      setPatients(res.data.results);
    } catch (err) {
      console.error("Erreur fetch patients", err);
    }
  };

  useEffect(() => {
    load();
    loadPatients();
  }, []);

  const handleSaved = (d: Device) => {
    load();
    setShowForm(false);
    setEditing(null);
  };

  const handleEdit = (d: Device) => {
    setEditing(d);
    setShowForm(true);
  };

  const handleDeleted = (id: number) => {
    load();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Devices</h1>
        <div>
          <button onClick={() => { setEditing(null); setShowForm(true); }} className="px-4 py-2 bg-green-600 text-white rounded">
            + Nouveau device
          </button>
          <button onClick={() => load()} className="ml-2 px-4 py-2 border rounded">Rafraîchir</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-1">
          {showForm ? (
            <DeviceForm initial={editing ?? undefined} onSaved={handleSaved} onCancel={() => { setShowForm(false); setEditing(null); }} patients={patients} />
          ) : (
            <div className="p-4 border rounded bg-white">
              <p className="text-sm text-gray-600">Cliquez sur « + Nouveau device » pour ajouter.</p>
            </div>
          )}
        </div>

        <div className="col-span-1">
          {loading ? (
            <div>Chargement...</div>
          ) : (
            <DeviceTable devices={devices} onEdit={handleEdit} onDeleted={handleDeleted} patients={patients} />
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-gray-600">Total : {count} devices</p>
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
  );
}
