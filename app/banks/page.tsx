'use client'
import React from 'react';

export default function Withdrawals() {
  return (
    <div className="p-10 bg-slate-50 min-h-screen font-sans uppercase font-black">
      
      {/* ШАПКА: ТЕПЕРЬ КАК НА 2 СКРИНЕ (ВЫШЕ БЛОКА) */}
      <header className="mb-14">
        <div className="flex items-center space-x-1 mb-2 opacity-40">
          <span className="text-[10px] font-black tracking-[0.3em]">ФИНАНСЫ /</span>
          <span className="text-[10px] font-black tracking-[0.3em]">ПРИЁМ</span>
        </div>
        <h2 className="text-4xl font-black tracking-tighter text-slate-900 leading-none">
          ЗАПРОСЫ НА ПРИЁМ
        </h2>
      </header>

      {/* ПУСТОЙ БЕЛЫЙ БЛОК ДЛЯ СОБЛЮДЕНИЯ СТИЛЯ */}
      <div className="bg-white rounded-[3rem] border border-slate-100 p-20 text-center shadow-sm">
        <p className="text-slate-300 font-black uppercase tracking-[0.5em] text-[10px]">
          История запросов на приём пуста
        </p>
      </div>

    </div>
  );
}