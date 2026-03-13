'use client'
import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // Состояние для переключения
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.toLowerCase().trim();

    if (isRegistering) {
      // РЕГИСТРАЦИЯ
      const { error } = await sb.auth.signUp({ email: cleanEmail, password });
      if (error) alert('ОШИБКА РЕГИСТРАЦИИ: ' + error.message);
      else alert('РЕГИСТРАЦИЯ УСПЕШНА! ТЕПЕРЬ ВОЙДИТЕ.');
    } else {
      // ВХОД
      const { error } = await sb.auth.signInWithPassword({ email: cleanEmail, password });
      if (error) alert('ОШИБКА ВХОДА: ' + error.message);
      else router.push('/');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f172a] p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-[3rem] p-12 shadow-2xl animate-in fade-in zoom-in duration-500">
        
        {/* ЛОГОТИП */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-[1000] tracking-tighter text-blue-600 uppercase leading-none italic">
            1WINTRADE
          </h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-3">
            {isRegistering ? 'Registration System' : 'Authorization System'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-1">
            <p className="text-[9px] font-black text-slate-400 ml-4 uppercase tracking-widest">User Email</p>
            <input 
              type="email" placeholder="ENTER EMAIL" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border-none p-5 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-black text-xs uppercase" 
              required
            />
          </div>

          <div className="space-y-1">
            <p className="text-[9px] font-black text-slate-400 ml-4 uppercase tracking-widest">Password</p>
            <input 
              type="password" placeholder="••••••••" value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border-none p-5 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-black text-xs" 
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white p-6 rounded-2xl font-[900] uppercase text-[11px] tracking-[0.2em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 mt-6 active:scale-[0.98]"
          >
            {isRegistering ? 'Создать аккаунт' : 'Войти в систему'}
          </button>
        </form>

        {/* КНОПКА ПЕРЕКЛЮЧЕНИЯ */}
        <button 
          onClick={() => setIsRegistering(!isRegistering)}
          className="w-full mt-8 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-all"
        >
          {isRegistering ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
        </button>

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