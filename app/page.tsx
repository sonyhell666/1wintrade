'use client'
import React, { useEffect, useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const ADMIN_EMAIL = 'dogcat1223@list.ru';

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ working: 0, insurance: 0, profit: 0 });
  const [history, setHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getData = async () => {
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return;
    setUser(user);

    const isAdmin = user.email === ADMIN_EMAIL;
    let query = sb.from('transactions').select('*').eq('status', 'Выполнено');
    if (!isAdmin) query = query.eq('user_email', user.email);

    const { data: tx } = await query;

    if (tx) {
      const working = tx.filter(t => t.type === 'Пополнение').reduce((s, x) => s + (Number(x.amount) || 0), 0);
      setStats({ working, insurance: 0, profit: 0 });
      setHistory(tx.filter(t => t.type === 'Пополнение').sort((a, b) => b.id - a.id));
    }
  };

  useEffect(() => {
    getData();
    // Закрытие по клику вне списка
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowHistory(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isAdmin = user?.email === ADMIN_EMAIL;

  return (
    <div className="p-10 bg-slate-50 min-h-screen font-sans uppercase font-black select-none text-slate-900">
      
      <header className="mb-14 text-left max-w-[1400px] mx-auto">
        <div className="flex items-center space-x-1 mb-1 opacity-40">
          <span className="text-[10px] tracking-[0.3em]">ОБЗОР /</span>
          <span className="text-[10px] tracking-[0.3em]">АНАЛИТИКА</span>
        </div>
        <h2 className="text-4xl font-black tracking-tighter text-slate-900 leading-none uppercase">1WINTRADE DASHBOARD</h2>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-[1400px] mx-auto">
        
        {/* КАРТОЧКА: РАБОЧИЙ ДЕПОЗИТ С ВЫПАДАЮЩИМ СПИСКОМ */}
        <div className="bg-white h-48 p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col transition-all relative">
          <div className="flex justify-between items-start w-full relative z-10">
            <p className="text-[10px] font-black text-slate-400 tracking-widest leading-none">Рабочий депозит</p>
            
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setShowHistory(!showHistory)}
                className={`text-[8px] font-black px-2 py-1 rounded-lg transition-all uppercase tracking-widest border ${
                  showHistory ? 'bg-blue-600 text-white border-blue-600' : 'text-slate-300 border-slate-100 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                История
              </button>

              {/* ВЫПАДАЮЩИЙ СПИСОК С АНИМАЦИЕЙ */}
              {showHistory && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 z-[50] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                    <p className="text-[8px] font-black text-slate-400 tracking-widest">ПОСЛЕДНИЕ ДЕПОЗИТЫ</p>
                  </div>
                  <div className="max-h-48 overflow-y-auto no-scrollbar">
                    {history.length > 0 ? (
                      history.map((h) => (
                        <div key={h.id} className="p-4 border-b border-slate-50 last:border-0 flex justify-between items-center hover:bg-slate-50 transition-colors">
                          <div className="flex flex-col">
                            <span className="text-[8px] text-slate-400 leading-none mb-1">{new Date(h.created_at).toLocaleDateString()}</span>
                            <span className="text-[9px] text-blue-600 leading-none">{h.method}</span>
                          </div>
                          <span className="text-sm font-black text-slate-900 tracking-tighter">+${h.amount}</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-slate-300 text-[8px] tracking-widest uppercase">Записей нет</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <p className="text-5xl font-black text-slate-900 tracking-tighter leading-none mt-auto">
            ${stats.working.toLocaleString()}
          </p>
        </div>

        <div className="bg-white h-48 p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
          <p className="text-[10px] font-black text-slate-400 tracking-widest leading-none">Страховой депозит</p>
          <p className="text-5xl font-black text-slate-900 tracking-tighter leading-none mt-auto">$0</p>
        </div>

        <div className="bg-white h-48 p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
          <p className="text-[10px] font-black text-slate-400 tracking-widest leading-none">Общий доход</p>
          <p className="text-5xl font-black text-slate-900 tracking-tighter leading-none mt-auto">$0</p>
        </div>

        <div className="bg-blue-600 h-48 p-10 rounded-[2.5rem] shadow-xl shadow-blue-100 flex flex-col">
          <p className="text-blue-100 text-[10px] font-black tracking-widest leading-none">Ваш статус</p>
          <p className="text-3xl font-[1000] text-white tracking-tighter uppercase leading-none mt-12">VERIFIED PRO</p>
        </div>
      </div>

      <div className="mt-12 max-w-[1400px] mx-auto bg-white rounded-[3rem] border border-slate-100 p-16 text-center shadow-sm">
        <p className="text-slate-200 font-black uppercase tracking-[0.5em] text-[10px]">
          Автоматизированный торговый узел 1WinTrade активен
        </p>
      </div>
    </div>
  );
}