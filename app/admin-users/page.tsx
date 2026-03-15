'use client'
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [editId, setEditId] = useState('');
  const [editVal, setEditVal] = useState('');

  async function fetchUsers() {
    const { data } = await sb.from('profiles').select('*').order('custom_id', { ascending: false });
    if (data) setUsers(data);
  }

  useEffect(() => { fetchUsers(); }, []);

  async function saveUsdt(id: string) {
    await sb.from('profiles').update({ personal_usdt: editVal }).eq('id', id);
    setEditId(''); setEditVal('');
    fetchUsers();
    alert('СОХРАНЕНО');
  }

  async function approve(id: string) { await sb.from('profiles').update({ is_approved: true }).eq('id', id); fetchUsers(); }
  async function toggleBlock(id: string, st: boolean) { await sb.from('profiles').update({ is_blocked: !st }).eq('id', id); fetchUsers(); }

  return (
    <div className="p-10 bg-slate-50 min-h-screen font-sans uppercase font-black text-slate-900">
      <header className="mb-12">
        <div className="flex items-center space-x-2 mb-2 text-slate-400">
          <span className="text-[10px] tracking-[0.4em]">АДМИН /</span>
          <span className="text-[10px] text-slate-900 tracking-[0.4em]">ПОЛЬЗОВАТЕЛИ</span>
        </div>
        <h2 className="text-4xl tracking-tighter">УПРАВЛЕНИЕ ДОСТУПОМ</h2>
      </header>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left font-black">
          <thead className="bg-slate-50 border-b text-[10px] text-slate-400 tracking-widest uppercase">
            <tr>
              <th className="px-8 py-6">ID / EMAIL</th>
              <th className="px-8 py-6">USDT (TRC20)</th>
              <th className="px-8 py-6">СТАТУС</th>
              <th className="px-8 py-6 text-right">ДЕЙСТВИЯ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 uppercase">
            {users.map((u: any) => (
              <tr key={u.id} className="hover:bg-slate-50/50">
                <td className="px-8 py-8">
                  <p className="text-blue-600 text-xs">#{u.custom_id}</p>
                  <p className="text-[10px] lowercase text-slate-400 font-bold">{u.email}</p>
                </td>
                <td className="px-8 py-8">
                  <div className="flex items-center gap-2">
                    <input
                      className="bg-slate-50 p-3 rounded-xl text-[9px] w-full outline-none border border-transparent"
                      placeholder="АДРЕС НЕ УСТАНОВЛЕН"
                      value={editId === u.id ? editVal : (u.personal_usdt || '')}
                      onChange={(e) => { setEditId(u.id); setEditVal(e.target.value); }}
                    />
                    {editId === u.id && (
                      <button onClick={() => saveUsdt(u.id)} className="bg-blue-600 text-white px-4 py-3 rounded-xl text-[8px]">SAVE</button>
                    )}
                  </div>
                </td>
                <td className="px-8 py-8">
                  <span className={`text-[8px] px-3 py-1 rounded-full ${!u.is_approved ? 'bg-orange-100 text-orange-600' : u.is_blocked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    {!u.is_approved ? 'ОЖИДАНИЕ' : u.is_blocked ? 'БЛОК' : 'АКТИВЕН'}
                  </span>
                </td>
                <td className="px-8 py-8 text-right space-x-2">
                  {!u.is_approved && <button onClick={() => approve(u.id)} className="bg-blue-600 text-white px-5 py-2 rounded-xl text-[9px]">ОДОБРИТЬ</button>}
                  <button onClick={() => toggleBlock(u.id, u.is_blocked)} className={`px-5 py-2 rounded-xl text-[9px] ${u.is_blocked ? 'bg-green-500' : 'bg-slate-900'} text-white`}>
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