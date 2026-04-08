'use client'
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  
  // Состояния для редактирования
  const [editUsdt, setEditUsdt] = useState<{ id: string; val: string } | null>(null);
  const [editBnb, setEditBnb] = useState<{ id: string; val: string } | null>(null);

  async function fetchUsers() {
    const { data } = await sb.from('profiles').select('*').order('custom_id', { ascending: false });
    if (data) setUsers(data);
  }

  useEffect(() => { fetchUsers(); }, []);

  // Сохранение TRC20
  async function saveUsdt(id: string) {
    if (!editUsdt) return;
    await sb.from('profiles').update({ personal_usdt: editUsdt.val }).eq('id', id);
    setEditUsdt(null);
    fetchUsers();
    alert('TRC20 ОБНОВЛЕН');
  }

  // Сохранение BEP20
  async function saveBnb(id: string) {
    if (!editBnb) return;
    await sb.from('profiles').update({ personal_bnb: editBnb.val }).eq('id', id);
    setEditBnb(null);
    fetchUsers();
    alert('BEP20 ОБНОВЛЕН');
  }

  async function approve(id: string) {
    await sb.from('profiles').update({ is_approved: true }).eq('id', id);
    fetchUsers();
  }

  async function toggleBlock(id: string, st: boolean) {
    await sb.from('profiles').update({ is_blocked: !st }).eq('id', id);
    fetchUsers();
  }

  return (
    <div className="p-10 bg-slate-50 min-h-screen font-sans uppercase font-black text-slate-900 select-none">
      
      <header className="mb-12 max-w-[1600px] mx-auto">
        <div className="flex items-center space-x-2 mb-2 text-slate-400">
          <span className="text-[10px] tracking-[0.4em]">АДМИН /</span>
          <span className="text-[10px] text-slate-900 tracking-[0.4em]">ПОЛЬЗОВАТЕЛИ</span>
        </div>
        <h2 className="text-4xl tracking-tighter">УПРАВЛЕНИЕ ДОСТУПОМ</h2>
      </header>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-x-auto max-w-[1600px] mx-auto">
        <table className="w-full text-left font-black border-collapse">
          <thead className="bg-slate-50 border-b text-[10px] text-slate-400 tracking-widest uppercase">
            <tr>
              <th className="px-6 py-6">ID / EMAIL / TG</th>
              <th className="px-6 py-6">USDT (TRC20)</th>
              <th className="px-6 py-6">USDT (BEP20)</th>
              <th className="px-6 py-6">СТАТУС</th>
              <th className="px-6 py-6 text-right">ДЕЙСТВИЯ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                
                {/* КОЛОНКА 1: ИНФО */}
                <td className="px-6 py-8">
                  <p className="text-blue-600 text-xs">#{u.custom_id}</p>
                  <p className="text-[10px] lowercase text-slate-900 mb-1">{u.email}</p>
                  <p className="text-[9px] lowercase text-blue-400">{u.telegram_username || '@нет_тг'}</p>
                </td>

                {/* КОЛОНКА 2: TRC20 */}
                <td className="px-6 py-8">
                  <div className="flex items-center gap-2">
                    <input
                      className="bg-slate-50 p-3 rounded-xl text-[9px] w-48 outline-none focus:ring-1 focus:ring-blue-500 border border-transparent"
                      placeholder="TRC20 НЕ ЗАДАН"
                      value={editUsdt?.id === u.id ? editUsdt.val : (u.personal_usdt || '')}
                      onChange={(e) => setEditUsdt({ id: u.id, val: e.target.value })}
                    />
                    {editUsdt?.id === u.id && (
                      <button onClick={() => saveUsdt(u.id)} className="bg-blue-600 text-white p-3 rounded-xl text-[8px]">OK</button>
                    )}
                  </div>
                </td>

                {/* КОЛОНКА 3: BEP20 */}
                <td className="px-6 py-8">
                  <div className="flex items-center gap-2">
                    <input
                      className="bg-slate-50 p-3 rounded-xl text-[9px] w-48 outline-none focus:ring-1 focus:ring-blue-500 border border-transparent"
                      placeholder="BEP20 НЕ ЗАДАН"
                      value={editBnb?.id === u.id ? editBnb.val : (u.personal_bnb || '')}
                      onChange={(e) => setEditBnb({ id: u.id, val: e.target.value })}
                    />
                    {editBnb?.id === u.id && (
                      <button onClick={() => saveBnb(u.id)} className="bg-blue-600 text-white p-3 rounded-xl text-[8px]">OK</button>
                    )}
                  </div>
                </td>

                {/* КОЛОНКА 4: СТАТУС */}
                <td className="px-6 py-8">
                  <span className={`text-[8px] px-3 py-1 rounded-full font-black ${
                    !u.is_approved ? 'bg-orange-100 text-orange-600' : (u.is_blocked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600')
                  }`}>
                    {!u.is_approved ? 'ОЖИДАНИЕ' : (u.is_blocked ? 'БЛОК' : 'АКТИВЕН')}
                  </span>
                </td>

                {/* КОЛОНКА 5: КНОПКИ */}
                <td className="px-6 py-8 text-right space-x-2">
                  {!u.is_approved && (
                    <button onClick={() => approve(u.id)} className="bg-green-500 text-white px-4 py-2 rounded-xl text-[9px]">ОДОБРИТЬ</button>
                  )}
                  <button onClick={() => toggleBlock(u.id, u.is_blocked)} className={`px-4 py-2 rounded-xl text-[9px] ${u.is_blocked ? 'bg-blue-600' : 'bg-slate-900'} text-white`}>
                    {u.is_blocked ? 'РАЗБЛОК' : 'БЛОК'}
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}