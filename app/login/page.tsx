'use client'
import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Переводим email в нижний регистр для исключения ошибок
    const { error } = await sb.auth.signInWithPassword({ 
      email: email.toLowerCase().trim(), 
      password 
    });
    
    if (error) {
      alert('ОШИБКА: ' + error.message);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f172a] p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-[3rem] p-12 shadow-2xl animate-in fade-in zoom-in duration-500">
        
        {/* НОВОЕ НАЗВАНИЕ: 1WINTRADE */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-[1000] tracking-tighter text-blue-600 uppercase leading-none italic">
            1WINTRADE
          </h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-3">
            Authorization System
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <p className="text-[9px] font-black text-slate-400 ml-4 uppercase tracking-widest">User Email</p>
            <input 
              type="email" 
              placeholder="ENTER EMAIL" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border-none p-5 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-black text-xs uppercase transition-all" 
              required
            />
          </div>

          <div className="space-y-1">
            <p className="text-[9px] font-black text-slate-400 ml-4 uppercase tracking-widest">Password</p>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border-none p-5 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-black text-xs transition-all" 
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white p-6 rounded-2xl font-[900] uppercase text-[11px] tracking-[0.2em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 mt-6 active:scale-[0.98]"
          >
            Войти в систему
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-50 text-center">
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-relaxed">
            Protected by BaseMind Cloud Security<br/>
            All sessions are encrypted
          </p>
        </div>
      </div>
    </div>
  );
}