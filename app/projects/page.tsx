'use client'
import React,{useEffect,useState} from 'react';
import {createClient} from '@supabase/supabase-js';

const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function ProjectsPage(){
const [list,setList]=useState<any[]>([]);
const [f,setF]=useState({n:'',c:'',b:''});

const fetch=async()=>{
 const {data}=await sb.from('projects').select('*').order('id',{ascending:false});
 if(data)setList(data);
};

useEffect(()=>{fetch()},[]);

const add=async(e:any)=>{
 e.preventDefault();
 if(!f.n||!f.b)return;
 await sb.from('projects').insert([{id:f.n,client:f.c,budget:Number(f.b)}]);
 setF({n:'',c:'',b:''}); fetch();
};

const del=async(id:string)=>{
 if(confirm('УДАЛИТЬ?')){await sb.from('projects').delete().eq('id',id);fetch();}
};

return (
<div className="p-10 bg-slate-50 min-h-screen font-sans uppercase">
 <header className="mb-12 italic">
  <div className="flex items-center space-x-2 mb-2">
   <span className="text-[10px] font-black text-slate-400 tracking-[0.4em]">АДМИН /</span>
   <span className="text-[10px] font-black text-slate-900 tracking-[0.4em]">ПРОЕКТЫ</span>
  </div>
  <h2 className="text-4xl font-black italic tracking-tighter text-slate-900">УПРАВЛЕНИЕ КОНТРАКТАМИ</h2>
 </header>
 <form onSubmit={add} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm mb-10 flex gap-4">
  <input value={f.n} onChange={e=>setF({...f,n:e.target.value})} placeholder="НАЗВАНИЕ" className="flex-1 bg-slate-50 p-5 rounded-3xl outline-none font-black italic text-xs tracking-widest"/>
  <input value={f.c} onChange={e=>setF({...f,c:e.target.value})} placeholder="КЛИЕНТ" className="flex-1 bg-slate-50 p-5 rounded-3xl outline-none font-black italic text-xs tracking-widest"/>
  <input value={f.b} onChange={e=>setF({...f,b:e.target.value})} type="number" placeholder="БЮДЖЕТ $" className="w-40 bg-slate-50 p-5 rounded-3xl outline-none font-black italic text-xs tracking-widest text-blue-600"/>
  <button className="bg-blue-600 text-white px-10 rounded-3xl font-black text-[10px] tracking-[0.3em] shadow-xl hover:bg-blue-700">СОЗДАТЬ</button>
 </form>
 <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden font-black italic">
  <table className="w-full text-left">
   <thead className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-400 tracking-widest">
    <tr><th className="px-10 py-6">ПРОЕКТ</th><th className="px-10 py-6">КЛИЕНТ</th><th className="px-10 py-6">БЮДЖЕТ</th><th className="px-10 py-6 text-center">ДЕЙСТВИЕ</th></tr>
   </thead>
   <tbody className="divide-y divide-slate-50">
    {list.map(p=>(<tr key={p.id} className="hover:bg-slate-50/50"><td className="px-10 py-8 text-blue-600">{p.id}</td><td className="px-10 py-8 text-slate-600">{p.client}</td><td className="px-10 py-8 font-black text-2xl tracking-tighter">${p.budget}</td><td className="px-10 py-8 text-center"><button onClick={()=>del(p.id)} className="text-red-500 text-[10px] tracking-widest">УДАЛИТЬ</button></td></tr>))}
   </tbody>
  </table>
 </div>
</div>
);
}