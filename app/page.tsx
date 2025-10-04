'use client'
import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    // Conteneur principal qui centre tout verticalement et horizontalement
    // et définit un fond clair et professionnel pour la page.
    <main className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold tracking-tight md:text-7xl lg:text-8xl">
          <span className="
                text-transparent 
                bg-clip-text 
                bg-gradient-to-r 
                from-cyan-500 
                via-teal-500 
                to-emerald-600
                dark:from-cyan-400
                dark:to-emerald-500
                bg-[size:200%_auto] // Important pour l'animation
                animate-gradient-flow // Applique l'animation
              ">
            MedGuard
          </span>
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
          Votre santé, notre priorité.
        </p>
        <span>
          <Link href="/dashboard">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
              DashBoard
            </button>
          </Link>

          <Link href="/mesures">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
              Mesures
            </button>
          </Link>

          <Link href="/devices">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
              Devices
            </button>
          </Link>

          <Link href="/patients">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
              Patients
            </button>
          </Link>

          <Link href="/alerts">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
              Alerts
            </button>
          </Link>
        </span>
      </div>
    </main>
  );
}