'use client'
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function Deposits() {
  const [amt, setAmt] = useState('');
  const [list, setList] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [network, setNetwork] = useState('TRC20'); // По умолчанию TRC20
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return;
    
    // История
    const { data: tx } = await sb.from('transactions').select('*').eq('user_email', user.email).eq('type', 'Пополнение').order('id', { ascending: false });
    if (tx) setList(tx);

    // Личные адреса
    const { data: p } = await sb.from('profiles').select('*').eq('id', user.id).maybeSingle();
    if (p) setProfile(p);
  };

  useEffect(() => { fetchData(); }, []);

  const handleOpenModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amt || Number(amt) <= 0) return alert('УКАЖИТЕ СУММУ');
    setShowModal(true);
  };

  const confirmDeposit = async () => {
    const { data: { user } } = await sb.auth.getUser();
    await sb.from('transactions').insert([{
      user_email: user?.email, 
      type: 'Пополнение', 
      amount: Number(amt), 
      status: 'Ожидание', 
      method: `USDT (${network})`
    }]);
    setAmt(''); setShowModal(false); fetchData();
    alert('ЗАЯВКА ОТПРАВЛЕНА');
  };

  // Выбираем какой адрес показать в зависимости от сети
  const currentAddress = network === 'TRC20' ? profile?.personal_usdt : profile?.personal_bnb;

  return (
    <div className="p-10 bg-slate-50 min-h-screen font-sans uppercase font-black">
      <header className="mb-14 max-w-[1400px] mx-auto">
        <div className="flex items-center space-x-1 mb-2 opacity-40"><span className="text-[10px] tracking-[0.3em]">ФИНАНСЫ /</span><span className="text-[10px] tracking-[0.3em]">ПОПОЛНЕНИЕ</span></div>
        <h2 className="text-4xl font-black tracking-tighter text-slate-900 leading-none">ЗАПРОСЫ НА ПРИЁМ</h2>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-[1400px] mx-auto">
        {/* ФОРМА С ВЫБОРОМ СЕТИ */}
        <form onSubmit={handleOpenModal} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6 h-fit text-center">
          <div className="flex gap-2 p-1 bg-slate-50 rounded-2xl">
            <button type="button" onClick={() => setNetwork('TRC20')} className={`flex-1 py-3 rounded-xl text-[9px] transition-all ${network === 'TRC20' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>USDT TRC20</button>
            <button type="button" onClick={() => setNetwork('BNB')} className={`flex-1 py-3 rounded-xl text-[9px] transition-all ${network === 'BNB' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>USDT BEP20</button>
          </div>
          
          <input type="number" value={amt} onChange={e => setAmt(e.target.value)} placeholder="СУММА $" className="w-full bg-slate-50 p-5 rounded-3xl outline-none text-xl text-center font-black"/>
          
          <button type="submit" className="w-full bg-blue-600 text-white p-6 rounded-3xl text-[10px] tracking-[0.3em] shadow-xl hover:bg-blue-700 uppercase">Подтвердить</button>
        </form>

        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden text-left">
          <table className="w-full">
            <thead className="bg-slate-50 border-b text-[10px] text-slate-400 tracking-widest uppercase">
              <tr><th className="px-10 py-6">МЕТОД</th><th className="px-10 py-6">СУММА</th><th className="px-10 py-6 text-right">СТАТУС</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-black">
              {list.map(r => (
                <tr key={r.id}><td className="px-10 py-8 text-[10px] text-slate-500">{r.method}</td><td className="px-10 py-8 text-2xl text-slate-900 tracking-tighter">${r.amount}</td><td className="px-10 py-8 text-right text-[10px] text-blue-600">{r.status}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#0f172a]/90 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white w-full max-w-lg rounded-[3rem] p-12 shadow-2xl space-y-8">
            <div className="text-center">
              <p className="text-[10px] font-black text-blue-600 tracking-[0.4em] mb-2 uppercase">СЕТЬ: {network === 'TRC20' ? 'TRON (TRC20)' : 'BNB SMART CHAIN (BEP20)'}</p>
              <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Переведите средства</h3>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 text-center">
                <p className="text-[9px] font-black text-slate-400 tracking-widest mb-3 uppercase">АДРЕС ПОПОЛНЕНИЯ</p>
                <p className="text-[11px] font-black text-slate-900 break-all leading-relaxed uppercase">
                  {currentAddress || "АДРЕС НЕ НАЗНАЧЕН. ОБРАТИТЕСЬ В ПОДДЕРЖКУ."}
                </p>
                {currentAddress && (
                  <button onClick={() => {navigator.clipboard.writeText(currentAddress); alert('СКОПИРОВАНО')}} className="mt-4 text-[9px] font-black text-blue-600 hover:underline uppercase tracking-widest">Скопировать адрес</button>
                )}
              </div>
              <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 text-center font-black">
                <p className="text-[10px] font-black text-blue-900 mb-1 uppercase">Сумма к зачислению</p>
                <p className="text-3xl tracking-tighter text-blue-600">${amt}</p>
              </div>
            </div>

            <button onClick={confirmDeposit} className="w-full bg-blue-600 text-white p-6 rounded-3xl font-black text-[10px] tracking-[0.3em] uppercase shadow-xl hover:bg-blue-700 transition-all">Я отправил средства</button>
            <button onClick={() => setShowModal(false)} className="w-full text-slate-400 text-[9px] font-black tracking-widest hover:text-slate-900 transition-all uppercase">Отменить</button>
          </div>
        </div>
      )}
    </div>
  );
}