'use client'
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const ADMIN = 'dogcat1223@list.ru';

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ working: 0, insurance: 0, profit: 0 });

  useEffect(() => {
    async function getData() {
      const { data: { user } } = await sb.auth.getUser();
      setUser(user);
      
      const { data: tx } = await sb.from('transactions').select('amount, type').eq('status', 'Выполнено');
      if (tx) {
        const working = tx.filter(t => t.type === 'Пополнение').reduce((s, x) => s + (Number(x.amount) || 0), 0);
        setStats({ working: working, insurance: 0, profit: 0 });
      }
    }
    getData();
  }, []);

  const isAdmin = user?.email === ADMIN;

  return (
    <div className="p-10 bg-slate-50 min-h-screen font-sans">
      
      {/* ШАПКА */}
      <header className="mb-14 text-left uppercase max-w-[1400px] mx-auto">
        <div className="flex items-center space-x-1 mb-1 opacity-40">
          <span className="text-[10px] font-black tracking-[0.3em]">ОБЗОР /</span>
          <span className="text-[10px] font-black tracking-[0.3em]">АНАЛИТИКА</span>
        </div>
        <h2 className="text-4xl font-black tracking-tighter text-slate-900 leading-none">
          1WINTRADE DASHBOARD
        </h2>
      </header>

      {/* КАРТОЧКИ */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-[1400px] mx-auto">
        
        {/* РАБОЧИЙ ДЕПОЗИТ */}
        <div className="bg-white h-48 p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col transition-all hover:shadow-md">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">
            Рабочий депозит
          </p>
          <p className="text-5xl font-black text-slate-900 tracking-tighter leading-none mt-10">
            ${isAdmin ? stats.working.toLocaleString() : '0.00'}
          </p>
        </div>

        {/* СТРАХОВОЙ ДЕПОЗИТ */}
        <div className="bg-white h-48 p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col transition-all hover:shadow-md">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">
            Страховой депозит
          </p>
          <p className="text-5xl font-black text-slate-900 tracking-tighter leading-none mt-10">
            $0
          </p>
        </div>

        {/* ОБЩИЙ ДОХОД */}
        <div className="bg-white h-48 p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col transition-all hover:shadow-md">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">
            Общий доход
          </p>
          <p className="text-5xl font-black text-slate-900 tracking-tighter leading-none mt-10">
            $0
          </p>
        </div>

        {/* СТАТУС СИСТЕМЫ: ТЕПЕРЬ НАДПИСЬ ВЫШЕ */}
        <div className="bg-blue-600 h-48 p-10 rounded-[2.5rem] shadow-xl shadow-blue-100 flex flex-col transition-all">
          <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest leading-none">
            Ваш статус
          </p>
          <p className="text-3xl font-[1000] text-white tracking-tighter uppercase leading-none mt-12">
            VERIFIED PRO
          </p>
        </div>
      </div>

      {/* НИЖНИЙ БЛОК */}
      <div className="mt-12 max-w-[1400px] mx-auto bg-white rounded-[3rem] border border-slate-100 p-16 text-center shadow-sm">
        <p className="text-slate-300 font-black uppercase tracking-[0.5em] text-[10px]">
          Автоматизированный торговый узел 1WinTrade активен
        </p>
      </div>
    </div>
  );
}