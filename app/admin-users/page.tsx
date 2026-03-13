'use client'
import React,{useEffect,useState} from 'react';
import {createClient} from '@supabase/supabase-js';

const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function AdminUsers(){
const [users,setUsers]=useState<any[]>([]);

async function fetchUsers(){
 const {data}=await sb.from('profiles').select('*').order('custom_id',{ascending:true});
 if(data) setUsers(data);
}

useEffect(()=>{fetchUsers()},[]);

async function toggleBlock(id:string, currentStatus:boolean){
 await sb.from('profiles').update({is_blocked: !currentStatus}).eq('id',id);
 fetchUsers();
}

return (
<div className="p-10 bg-slate-50 min-h-screen font-sans uppercase">
 <header className="mb-12">
  <div className="flex items-center space-x-2 mb-2">
   <span className="text-[10px] font-black text-slate-400 tracking-[0.4em]">АДМИН /</span>
   <span className="text-[10px] font-black text-slate-900 tracking-[0.4em]">ПОЛЬЗОВАТЕЛИ</span>
  </div>
  <h2 className="text-4xl font-black tracking-tighter text-slate-900">УПРАВЛЕНИЕ ДОСТУПОМ</h2>
 </header>

 <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
  <table className="w-full text-left font-black">
   <thead className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-400 tracking-widest uppercase">
    <tr>
     <th className="px-10 py-6">ID</th>
     <th className="px-10 py-6">EMAIL</th>
     <th className="px-10 py-6">СТАТУС</th>
     <th className="px-10 py-6 text-right">ДЕЙСТВИЕ</th>
    </tr>
   </thead>
   <tbody className="divide-y divide-slate-50">
    {users.map(u=>(
     <tr key={u.id} className="hover:bg-slate-50 transition-colors">
      <td className="px-10 py-8 text-blue-600">#{u.custom_id}</td>
      <td className="px-10 py-8 text-xs lowercase">{u.email}</td>
      <td className="px-10 py-8">
       <span className={`text-[9px] px-3 py-1 rounded-full ${u.is_blocked?'bg-red-100 text-red-600':'bg-green-100 text-green-600'}`}>
        {u.is_blocked ? 'ЗАБЛОКИРОВАН' : 'АКТИВЕН'}
       </span>
      </td>
      <td className="px-10 py-8 text-right">
       <button onClick={()=>toggleBlock(u.id, u.is_blocked)} 
        className={`px-6 py-2 rounded-xl text-[9px] tracking-widest ${u.is_blocked?'bg-green-500 text-white':'bg-slate-900 text-white'}`}>
        {u.is_blocked ? 'РАЗБЛОКИРОВАТЬ' : 'БЛОКИРОВАТЬ'}
       </button>
      </td>
     </tr>
    ))}
   </tbody>
  </table>
 </div>
</div>
);}