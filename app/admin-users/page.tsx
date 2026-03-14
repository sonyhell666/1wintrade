'use client'
import React,{useEffect,useState} from 'react';
import {createClient} from '@supabase/supabase-js';

const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function AdminUsers(){
const [users,setUsers]=useState<any[]>([]);

async function fetchUsers(){
 const {data}=await sb.from('profiles').select('*').order('custom_id',{ascending:false});
 if(data) setUsers(data);
}

useEffect(()=>{fetchUsers()},[]);

async function approve(id:string){
 await sb.from('profiles').update({is_approved: true}).eq('id',id);
 fetchUsers();
}

async function toggleBlock(id:string, currentStatus:boolean){
 await sb.from('profiles').update({is_blocked: !currentStatus}).eq('id',id);
 fetchUsers();
}

return (
<div className="p-10 bg-slate-50 min-h-screen font-sans uppercase font-black text-slate-900">
 <header className="mb-12">
  <div className="flex items-center space-x-2 mb-2 text-slate-400">
   <span className="text-[10px] tracking-[0.4em]">АДМИН /</span>
   <span className="text-[10px] text-slate-900 tracking-[0.4em]">ДОСТУП</span>
  </div>
  <h2 className="text-4xl tracking-tighter leading-none">УПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯМИ</h2>
 </header>

 <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
  <table className="w-full text-left font-black">
   <thead className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-400 tracking-widest uppercase">
    <tr>
     <th className="px-10 py-6">ID</th>
     <th className="px-10 py-6">EMAIL</th>
     <th className="px-10 py-6">СТАТУС</th>
     <th className="px-10 py-6 text-right">ДЕЙСТВИЯ</th>
    </tr>
   </thead>
   <tbody className="divide-y divide-slate-50">
    {users.map(u=>(
     <tr key={u.id} className="hover:bg-slate-50/50">
      <td className="px-10 py-8 text-blue-600">#{u.custom_id}</td>
      <td className="px-10 py-8 text-xs lowercase">{u.email}</td>
      <td className="px-10 py-8">
       {!u.is_approved ? (
         <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[8px] tracking-widest">НОВЫЙ / ЖДЕТ</span>
       ) : (
         <span className={u.is_blocked ? "text-red-500 text-[8px]" : "text-green-500 text-[8px]"}>
           {u.is_blocked ? 'ЗАБЛОКИРОВАН' : 'ОДОБРЕН'}
         </span>
       )}
      </td>
      <td className="px-10 py-8 text-right space-x-3">
       {!u.is_approved && (
         <button onClick={()=>approve(u.id)} className="bg-blue-600 text-white px-5 py-2 rounded-xl text-[9px] tracking-widest shadow-lg shadow-blue-100">ОДОБРИТЬ</button>
       )}
       <button onClick={()=>toggleBlock(u.id, u.is_blocked)} 
        className={`px-5 py-2 rounded-xl text-[9px] tracking-widest ${u.is_blocked?'bg-green-500 text-white':'bg-slate-900 text-white'}`}>
        {u.is_blocked ? 'РАЗБЛОК' : 'БЛОК'}
       </button>
      </td>
     </tr>
    ))}
   </tbody>
  </table>
 </div>
</div>
);}