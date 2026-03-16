'use client'
import React from 'react';

export default function MyOperators() {
  return (
    <div className="p-10 bg-slate-50 min-h-screen font-sans uppercase font-black">
      
      {/* ШАПКА ПО ЛИНЕЙКЕ */}
      <header className="mb-14 max-w-[1400px] mx-auto">
        <div className="flex items-center space-x-1 mb-2 opacity-40">
          <span className="text-[10px] font-black tracking-[0.3em]">ФИНАНСЫ /</span>
          <span className="text-[10px] font-black tracking-[0.3em]">УПРАВЛЕНИЕ</span>
        </div>
        <h2 className="text-4xl font-black tracking-tighter text-slate-900 leading-none">
          МОИ ОПЕРАТОРЫ
        </h2>
      </header>

      {/* БЕЛЫЙ БЛОК - ЗАГЛУШКА */}
      <div className="bg-white rounded-[3rem] border border-slate-100 p-20 text-center shadow-sm max-w-[1400px] mx-auto">
        <p className="text-slate-300 font-black uppercase tracking-[0.5em] text-[10px]">
          Раздел находится в разработке
        </p>
      </div>

    </div>
  );
}