'use client'
import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isPending, setIsPending] = useState(false); // Окно ожидания
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.toLowerCase().trim();

    if (isRegistering) {
      const { error } = await sb.auth.signUp({ email: cleanEmail, password });
      if (error) alert('ОШИБКА: ' + error.message);
      else setIsPending(true); // Показываем окно ожидания
    } else {
      const { data: authData, error: authError } = await sb.auth.signInWithPassword({ email: cleanEmail, password });
      if (authError) return alert('ОШИБКА ВХОДА: ' + authError.message);

      // Проверяем одобрение в таблице profiles
      const { data: profile } = await sb.from('profiles').select('is_approved').eq('id', authData.user.id).single();
      
      if (profile && !profile.is_approved && cleanEmail !== 'dogcat1223@list.ru') {
        await sb.auth.signOut();
        setIsPending(true); // Не пускаем и показываем окно
      } else {
        router.push('/');
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f172a] p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
        
        {/* ОКНО ОЖИДАНИЯ ПОДТВЕРЖДЕНИЯ */}
        {isPending ? (
          <div className="text-center py-10 animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-ping"></div>
            </div>
            <h2 className="text-2xl font-[1000] text-slate-900 uppercase tracking-tighter mb-4 leading-none">Ожидайте подтверждения</h2>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-relaxed">
              Ваша заявка на регистрацию в 1WinTrade находится на проверке у администратора.
            </p>
            <button onClick={() => setIsPending(false)} className="mt-10 text-blue-600 font-black text-[9px] uppercase tracking-[0.3em] hover:underline">Вернуться назад</button>
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl font-[1000] tracking-tighter text-blue-600 uppercase italic">1WINTRADE</h1>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-3">
                {isRegistering ? 'Registration System' : 'Authorization System'}
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <input type="email" placeholder="ENTER EMAIL" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 p-5 rounded-2xl outline-none font-black text-xs uppercase" required />
              <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-50 p-5 rounded-2xl outline-none font-black text-xs" required />
              <button type="submit" className="w-full bg-blue-600 text-white p-6 rounded-2xl font-[900] uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-blue-100 mt-4 italic">
                {isRegistering ? 'Зарегистрироваться' : 'Войти в систему'}
              </button>
            </form>

            <button onClick={() => setIsRegistering(!isRegistering)} className="w-full mt-8 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600">
              {isRegistering ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}