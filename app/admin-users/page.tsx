'use client'
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [editId, setEditId] = useState('');
  const [editVal, setEditVal] = useState('');

  // 1. Загрузка всех профилей из базы
  async function fetchUsers() {
    const { data, error } = await sb.from('profiles').select('*').order('custom_id', { ascending: false });
    if (error) console.error(error);
    if (data) setUsers(data);
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. Сохранение персонального USDT адреса для конкретного юзера
  async function saveUsdt(id: string) {
    const { error } = await sb.from('profiles').update({ personal_usdt: editVal }).eq('id', id);
    if (error) {
      alert('ОШИБКА: ' + error.message);
    } else {
      setEditId('');
      setEditVal('');
      fetchUsers();
      alert('ПЕРСОНАЛЬНЫЙ АДРЕС ОБНОВЛЕН');
    }
  }

  // 3. Одобрение регистрации
  async function approve(id: string) {
    await sb.from('profiles').update({ is_approved: true }).eq('id', id);
    fetchUsers();
  }

  // 4. Блокировка / Разблокировка
  async function toggleBlock(id: string, currentStatus: boolean) {
    await sb.from('profiles').update({ is_blocked: !currentStatus }).eq('id', id);
    fetchUsers();
  }

  return (
    <div className="p-10 bg-slate-50 min-h-screen font-sans uppercase font-black text-slate-900 select-none">
      
      {/* ШАПКА ПО ЛИНЕЙКЕ */}
      <header className="mb-12 max-w-[1400px] mx-auto">
        <div className="flex items-center space-x-2 mb-2 text-slate-400">
          <span className="text-[10px] tracking-[0.4em]">АДМИН /</span>
          <span className="text-[10px] text-slate-900 tracking-[0.4em]">ПОЛЬЗОВАТЕЛИ</span>
        </div>
        <h2 className="text-4xl tracking-tighter leading-none">УПРАВЛЕНИЕ ДОСТУПОМ</h2>
      </header>

      {/* ТАБЛИЦА ПОЛЬЗОВАТЕЛЕЙ */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden max-w-[1400px] mx-auto">
        <table className="w-full text-left font-black">
          <thead className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-400 tracking-widest uppercase">
            <tr>
              <th className="px-8 py-6">ID / EMAIL</th>
              <th className="px-8 py-6">TELEGRAM</th>
              <th className="px-8 py-6">ПЕРСОНАЛЬНЫЙ USDT</th>
              <th className="px-8 py-6">СТАТУС</th>
              <th className="px-8 py-6 text-right">ДЕЙСТВИЯ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                
                {/* ID И ПОЧТА */}
                <td className="px-8 py-8">
                  <p className="text-blue-600 text-xs">#{u.custom_id}</p>
                  <p className="text-[10px] lowercase text-slate-400 font-bold">{u.email}</p>
                </td>

                {/* TELEGRAM */}
                <td className="px-8 py-8">
                  <p className="text-xs font-black text-slate-700 lowercase tracking-tight">
                    {u.telegram_username ? u.telegram_username : '---'}
                  </p>
                </td>

                {/* ИНПУТ ДЛЯ АДРЕСА */}
                <td className="px-8 py-8">
                  <div className="flex items-center gap-2 max-w-xs">
                    <input
                      className="bg-slate-50 p-3 rounded-xl text-[9px] w-full outline-none border border-transparent focus:ring-1 focus:ring-blue-500 font-black"
                      placeholder="АДРЕС НЕ УСТАНОВЛЕН"
                      value={editId === u.id ? editVal : (u.personal_usdt || '')}
                      onChange={(e) => {
                        setEditId(u.id);
                        setEditVal(e.target.value);
                      }}
                    />
                    {editId === u.id && (
                      <button
                        onClick={() => saveUsdt(u.id)}
                        className="bg-blue-600 text-white px-4 py-3 rounded-xl text-[8px] hover:bg-blue-700 transition-all uppercase"
                      >
                        SAVE
                      </button>
                    )}
                  </div>
                </td>

                {/* СТАТУС */}
                <td className="px-8 py-8">
                  {!u.is_approved ? (
                    <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[8px] tracking-widest font-black uppercase">
                      НОВЫЙ / ЖДЕТ
                    </span>
                  ) : (
                    <span className={`text-[8px] font-black uppercase tracking-widest ${u.is_blocked ? 'text-red-500' : 'text-green-500'}`}>
                      {u.is_blocked ? 'ЗАБЛОКИРОВАН' : 'АКТИВЕН'}
                    </span>
                  )}
                </td>

                {/* КНОПКИ ДЕЙСТВИЯ */}
                <td className="px-8 py-8 text-right space-x-2">
                  {!u.is_approved && (
                    <button
                      onClick={() => approve(u.id)}
                      className="bg-blue-600 text-white px-5 py-2 rounded-xl text-[9px] tracking-widest shadow-lg shadow-blue-50 hover:bg-blue-700 transition-all"
                    >
                      ОДОБРИТЬ
                    </button>
                  )}
                  <button
                    onClick={() => toggleBlock(u.id, u.is_blocked)}
                    className={`px-5 py-2 rounded-xl text-[9px] tracking-widest transition-all ${
                      u.is_blocked ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-slate-900 text-white hover:bg-black'
                    }`}
                  >
                    {u.is_blocked ? 'РАЗБЛОКИРОВАТЬ' : 'БЛОКИРОВАТЬ'}
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="p-32 text-center text-slate-300 text-[10px] tracking-[0.5em] font-black uppercase">
            БАЗА ПОЛЬЗОВАТЕЛЕЙ ПУСТА
          </div>
        )}
      </div>
    </div>
  );
}