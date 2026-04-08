'use client'
import React,{useEffect,useState} from 'react';
import {createClient} from '@supabase/supabase-js';

const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function AdminTransactions(){
const [list,setList]=useState<any[]>([]);

const fetch=async()=>{
 const {data}=await sb.from('transactions').select('*').order('id',{ascending:false});
 if(data)setList(data);
};

useEffect(()=>{fetch()},[]);

const status=async(id:number,st:string)=>{
 await sb.from('transactions').update({status:st}).eq('id',id);
 fetch();
};

return (
<div className="p-10 bg-slate-50 min-h-screen font-sans uppercase">
 <header className="mb-12 italic">
  <div className="flex items-center space-x-2 mb-2">
   <span className="text-[10px] font-black text-slate-400 tracking-[0.4em]">АДМИН /</span>
   <span className="text-[10px] font-black text-slate-900 tracking-[0.4em]">ТРАНЗАКЦИИ</span>
  </div>
  <h2 className="text-4xl font-black italic tracking-tighter text-slate-900">УПРАВЛЕНИЕ ВЫПЛАТАМИ</h2>
 </header>
 <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden font-black italic">
  <table className="w-full text-left">
   <thead className="bg-slate-50 border-b text-[10px] text-slate-400 tracking-widest">
    <tr><th className="px-10 py-6">КЛИЕНТ</th><th className="px-10 py-6">ТИП</th><th className="px-10 py-6">СУММА</th><th className="px-10 py-6">СТАТУС</th><th className="px-10 py-6 text-center">ДЕЙСТВИЕ</th></tr>
   </thead>
   <tbody className="divide-y divide-slate-50">
    {list.map(i=>(
     <tr key={i.id} className="hover:bg-slate-50/50">
      <td className="px-10 py-8 text-[10px] text-slate-400 lowercase">{i.user_email}</td>
      <td className={`px-10 py-8 text-[11px] ${i.type==='Пополнение'?'text-blue-600':'text-red-500'}`}>{i.type}</td>
      <td className="px-10 py-8 text-2xl tracking-tighter">${i.amount}</td>
      <td className="px-10 py-8"><span className={`text-[9px] px-3 py-1 rounded-full ${i.status==='Ожидание'?'bg-orange-100 text-orange-600':'bg-slate-100 text-slate-400'}`}>{i.status}</span></td>
      <td className="px-10 py-8 text-center space-x-2">
       {i.status==='Ожидание' && (
        <>
         <button onClick={()=>status(i.id,'Выполнено')} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[9px] tracking-widest">ОДОБРИТЬ</button>
         <button onClick={()=>status(i.id,'Отклонено')} className="bg-slate-200 text-slate-500 px-4 py-2 rounded-xl text-[9px] tracking-widest">ОТКАЗ</button>
        </>
       )}
      </td>
     </tr>
    ))}
   </tbody>
  </table>
 </div>
</div>
);
}