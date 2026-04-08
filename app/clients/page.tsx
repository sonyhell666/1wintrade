'use client'
import React,{useEffect,useState} from 'react';
import {createClient} from '@supabase/supabase-js';

const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function ClientsPage(){
const [list,setList]=useState<any[]>([]);
const [f,setF]=useState({n:'',e:'',p:''});

const fetch=async()=>{
 const {data}=await sb.from('clients').select('*').order('id',{ascending:false});
 if(data)setList(data);
};

useEffect(()=>{fetch()},[]);

const add=async(e:any)=>{
 e.preventDefault();
 if(!f.n)return;
 await sb.from('clients').insert([{name:f.n,email:f.e,phone:f.p}]);
 setF({n:'',e:'',p:''}); fetch();
};

return (
<div className="p-10 bg-slate-50 min-h-screen font-sans uppercase">
 <header className="mb-12 italic">
  <div className="flex items-center space-x-2 mb-2">
   <span className="text-[10px] font-black text-slate-400 tracking-[0.4em]">АДМИН /</span>
   <span className="text-[10px] font-black text-slate-900 tracking-[0.4em]">КЛИЕНТЫ</span>
  </div>
  <h2 className="text-4xl font-black italic tracking-tighter text-slate-900">БАЗА КОНТРАГЕНТОВ</h2>
 </header>
 <form onSubmit={add} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm mb-10 flex gap-4">
  <input value={f.n} onChange={e=>setF({...f,n:e.target.value})} placeholder="ФИО / КОМПАНИЯ" className="flex-1 bg-slate-50 p-5 rounded-3xl outline-none font-black italic text-xs tracking-widest uppercase"/>
  <input value={f.e} onChange={e=>setF({...f,e:e.target.value})} placeholder="EMAIL" className="flex-1 bg-slate-50 p-5 rounded-3xl outline-none font-black italic text-xs tracking-widest lowercase"/>
  <button className="bg-blue-600 text-white px-10 rounded-3xl font-black text-[10px] tracking-[0.3em] shadow-xl">ДОБАВИТЬ</button>
 </form>
 <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden font-black italic">
  <table className="w-full text-left">
   <thead className="bg-slate-50 border-b text-[10px] text-slate-400 tracking-widest">
    <tr><th className="px-10 py-6">ИМЯ</th><th className="px-10 py-6">КОНТАКТЫ</th><th className="px-10 py-6">ДАТА</th></tr>
   </thead>
   <tbody className="divide-y divide-slate-50">
    {list.map(c=>(<tr key={c.id} className="hover:bg-slate-50/50"><td className="px-10 py-8 text-blue-600">{c.name}</td><td className="px-10 py-8 text-slate-400 lowercase">{c.email}</td><td className="px-10 py-8 text-slate-900 text-xs tracking-widest">{new Date(c.created_at).toLocaleDateString()}</td></tr>))}
   </tbody>
  </table>
 </div>
</div>
);
}