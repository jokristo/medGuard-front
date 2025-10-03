import React from 'react';

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
      </div>
    </main>
  );
}