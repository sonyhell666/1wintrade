'use client'
import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telegram, setTelegram] = useState(''); // Новое состояние
  const [isRegistering, setIsRegistering] = useState(false);
  const [isPending, setIsPending] = useState(false); 
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.toLowerCase().trim();

    if (isRegistering) {
      // РЕГИСТРАЦИЯ С ПЕРЕДАЧЕЙ TELEGRAM
      const { error } = await sb.auth.signUp({ 
        email: cleanEmail, 
        password,
        options: {
          data: { telegram_username: telegram } // Передаем в метаданные
        }
      });
      if (error) alert('ОШИБКА: ' + error.message);
      else setIsPending(true); 
    } else {
      const { data: authData, error: authError } = await sb.auth.signInWithPassword({ email: cleanEmail, password });
      if (authError) return alert('ОШИБКА ВХОДА: ' + authError.message);

      const { data: profile } = await sb.from('profiles').select('is_approved').eq('id', authData.user.id).single();
      if (profile && !profile.is_approved && cleanEmail !== 'dogcat1223@list.ru') {
        await sb.auth.signOut();
        setIsPending(true); 
      } else {
        router.push('/');
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f172a] p-4 font-sans select-none relative">
      <div className="w-full max-w-md bg-white rounded-[3rem] p-12 shadow-2xl relative overflow-hidden z-10">
        {isPending ? (
          <div className="text-center py-10">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-ping"></div>
            </div>
            <h2 className="text-2xl font-[900] text-slate-900 uppercase tracking-tighter mb-4 leading-none">Ожидайте подтверждения</h2>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-relaxed">Заявка на проверке у администратора.</p>
            <button onClick={() => setIsPending(false)} className="mt-10 text-blue-600 font-black text-[9px] uppercase tracking-[0.3em]">Назад</button>
          </div>
        ) : (
          <>
            <div className="text-center mb-10">
              <h1 className="text-4xl font-[1000] tracking-tighter text-blue-600 uppercase italic">1WINTRADE</h1>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-3">
                {isRegistering ? 'Registration System' : 'Authorization System'}
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <input type="email" placeholder="EMAIL" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 p-5 rounded-2xl outline-none font-black text-xs uppercase" required />
              
              {/* ПОЛЕ TELEGRAM (ТОЛЬКО ПРИ РЕГИСТРАЦИИ) */}
              {isRegistering && (
                <input type="text" placeholder="TELEGRAM USERNAME (НАПР. @USER)" value={telegram} onChange={(e) => setTelegram(e.target.value)} className="w-full bg-slate-50 p-5 rounded-2xl outline-none font-black text-xs uppercase border-2 border-blue-50" required />
              )}

              <input type="password" placeholder="PASSWORD" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-50 p-5 rounded-2xl outline-none font-black text-xs" required />
              
              <button type="submit" className="w-full bg-blue-600 text-white p-6 rounded-2xl font-[900] uppercase text-[11px] tracking-[0.2em] shadow-xl mt-4">
                {isRegistering ? 'Создать аккаунт' : 'Войти в систему'}
              </button>
            </form>

            <button onClick={() => setIsRegistering(!isRegistering)} className="w-full mt-8 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-all">
              {isRegistering ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
            </button>
          </>
        )}
      </div>
      <a href="https://t.me/onewintrade_support" target="_blank" className="fixed bottom-10 right-10 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-900/40 hover:bg-blue-700 transition-all z-50">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 16.66 14.67 14 12 14Z" fill="white"/></svg>
      </a>
    </div>
  );
}