'use client'
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function Deposits() {
  const [amt, setAmt] = useState('');
  const [list, setList] = useState<any[]>([]);
  const [usdtAddress, setUsdtAddress] = useState('Загрузка...');
  const [showModal, setShowModal] = useState(false);

  const fetchHistory = async () => {
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return;
    const { data } = await sb.from('transactions')
      .select('*')
      .eq('user_email', user.email)
      .eq('type', 'Пополнение')
      .order('id', { ascending: false });
    if (data) setList(data);
  };

  const fetchAddress = async () => {
    // Ищем адрес USDT в таблице реквизитов
    const { data } = await sb.from('requisites')
      .select('number')
      .eq('name', 'USDT (TRC20)')
      .single();
    if (data) setUsdtAddress(data.number);
  };

  useEffect(() => {
    fetchHistory();
    fetchAddress();
  }, []);

  const handleOpenModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amt || Number(amt) <= 0) return alert('УКАЖИТЕ КОРРЕКТНУЮ СУММУ');
    setShowModal(true);
  };

  const confirmDeposit = async () => {
    const { data: { user } } = await sb.auth.getUser();
    await sb.from('transactions').insert([{
      user_email: user?.email,
      type: 'Пополнение',
      amount: Number(amt),
      status: 'Ожидание',
      method: 'USDT (TRC20)'
    }]);
    
    setAmt('');
    setShowModal(false);
    fetchHistory();
    alert('ЗАЯВКА ОТПРАВЛЕНА НА ПРОВЕРКУ');
  };

  return (
    <div className="p-10 bg-slate-50 min-h-screen font-sans uppercase">
      <header className="mb-12">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-[10px] font-black text-slate-400 tracking-[0.4em]">ФИНАНСЫ /</span>
          <span className="text-[10px] font-black text-slate-900 tracking-[0.4em]">ПОПОЛНЕНИЕ</span>
        </div>
        <h2 className="text-4xl font-black tracking-tighter text-slate-900">ДЕПОЗИТ СРЕДСТВ</h2>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* ФОРМА (ТОЛЬКО СУММА) */}
        <form onSubmit={handleOpenModal} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6 h-fit">
          <p className="text-[10px] font-black text-blue-600 tracking-[0.2em]">МЕТОД: USDT (TRC20)</p>
          <input 
            type="number" 
            value={amt} 
            onChange={e => setAmt(e.target.value)} 
            placeholder="СУММА ПОПОЛНЕНИЯ $" 
            className="w-full bg-slate-50 p-5 rounded-3xl outline-none font-black text-xl border border-transparent focus:border-blue-100 transition-all"
          />
          <button type="submit" className="w-full bg-blue-600 text-white p-6 rounded-3xl font-black text-[10px] tracking-[0.3em] shadow-xl hover:bg-blue-700 transition-all">
            ПОДТВЕРДИТЬ
          </button>
        </form>

        {/* ТАБЛИЦА ИСТОРИИ */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-[10px] font-black text-slate-400 tracking-widest uppercase">
                <th className="px-10 py-6">МЕТОД</th>
                <th className="px-10 py-6">СУММА</th>
                <th className="px-10 py-6 text-right">СТАТУС</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-black">
              {list.map(r => (
                <tr key={r.id} className="hover:bg-slate-50/50">
                  <td className="px-10 py-8 text-[10px] text-slate-500 uppercase tracking-tighter">{r.method}</td>
                  <td className="px-10 py-8 text-2xl tracking-tighter text-slate-900 underline decoration-blue-100 decoration-4">${r.amount}</td>
                  <td className="px-10 py-8 text-right text-[10px] text-orange-400 uppercase tracking-tighter">{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* МОДАЛЬНОЕ ОКНО ОПЛАТЫ */}
      {showModal && (
        <div className="fixed inset-0 bg-[#0f172a]/90 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white w-full max-w-lg rounded-[3rem] p-12 shadow-2xl space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="text-center">
              <p className="text-[10px] font-black text-blue-600 tracking-[0.4em] mb-2">ИНСТРУКЦИЯ ПО ОПЛАТЕ</p>
              <h3 className="text-2xl font-[1000] text-slate-900 tracking-tighter uppercase">ПЕРЕВЕДИТЕ СРЕДСТВА</h3>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center">
                <p className="text-[9px] font-black text-slate-400 tracking-widest mb-3">АДРЕС USDT (TRC20)</p>
                <p className="text-sm font-black text-slate-900 break-all text-center tracking-tight leading-relaxed">
                  {usdtAddress}
                </p>
                <button 
                  onClick={() => {navigator.clipboard.writeText(usdtAddress); alert('СКОПИРОВАНО')}}
                  className="mt-4 text-[9px] font-black text-blue-600 hover:underline tracking-widest"
                >
                  СКОПИРОВАТЬ АДРЕС
                </button>
              </div>

              <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 text-center">
                <p className="text-[10px] font-black text-blue-900 mb-1">СУММА К ЗАЧИСЛЕНИЮ</p>
                <p className="text-3xl font-black text-blue-600 tracking-tighter">${amt}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={confirmDeposit}
                className="w-full bg-blue-600 text-white p-6 rounded-3xl font-black text-[10px] tracking-[0.3em] uppercase shadow-xl hover:bg-blue-700 transition-all"
              >
                Я ОТПРАВИЛ СРЕДСТВА
              </button>
              <button 
                onClick={() => setShowModal(false)}
                className="w-full text-slate-400 p-2 font-black text-[9px] tracking-widest hover:text-slate-900 transition-all"
              >
                ОТМЕНИТЬ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}