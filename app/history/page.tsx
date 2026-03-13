'use client'
import React,{useEffect,useState} from 'react';
import {createClient} from '@supabase/supabase-js';

const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function History(){
const [list,setList]=useState<any[]>([]);

useEffect(()=>{
 const f=async()=>{
  const {data:{user}}=await sb.auth.getUser();
  const {data}=await sb.from('transactions').select('*').eq('user_email',user?.email).order('id',{ascending:false});
  if(data)setList(data);
 };
 f();
},[]);

return (
<div className="p-10 bg-slate-50 min-h-screen font-sans uppercase">
 <header className="mb-14">
  <div className="flex items-center space-x-2 mb-2">
   <span className="text-[10px] font-black text-slate-400 tracking-[0.4em]">ФИНАНСЫ /</span>
   <span className="text-[10px] font-black text-slate-900 tracking-[0.4em]">ИСТОРИЯ</span>
  </div>
  <h2 className="text-4xl font-black tracking-tighter text-slate-900">ИСТОРИЯ ТРАНЗАКЦИЙ</h2>
 </header>
 <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
  <table className="w-full text-left font-black">
   <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 tracking-widest uppercase">
    <tr><th className="px-10 py-6">ДАТА</th><th className="px-10 py-6">ТИП</th><th className="px-10 py-6">СУММА</th><th className="px-10 py-6">СТАТУС</th></tr>
   </thead>
   <tbody className="divide-y divide-slate-50 uppercase">
    {list.map(r=>(
     <tr key={r.id} className="hover:bg-slate-50 transition-colors">
      <td className="px-10 py-8 text-[11px] font-bold text-slate-400">{new Date(r.created_at).toLocaleDateString()}</td>
      <td className={`px-10 py-8 text-[11px] ${r.type==='Пополнение'?'text-blue-600':'text-slate-800'}`}>{r.type}</td>
      <td className="px-10 py-8 text-3xl tracking-tighter text-slate-900">
        {r.type==='Пополнение'?'+':'-'}${r.amount}
      </td>
      <td className="px-10 py-8"><span className="bg-slate-50 px-4 py-2 rounded-full text-[9px] font-black text-slate-500 tracking-tighter uppercase">{r.status}</span></td>
     </tr>
    ))}
   </tbody>
  </table>
 </div>
</div>
);}