'use client'
import React,{useEffect,useState} from 'react';
import {createClient} from '@supabase/supabase-js';

const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function AdminSupport(){
const [list,setList]=useState<any[]>([]);

const fetch=async()=>{
 const {data}=await sb.from('support_messages').select('*').order('id',{ascending:false});
 if(data)setList(data);
};

useEffect(()=>{fetch()},[]);

const deleteMsg=async(id:number)=>{
 if(confirm('УДАЛИТЬ ОБРАЩЕНИЕ?')){
  await sb.from('support_messages').delete().eq('id',id);
  fetch();
 }
};

return (
<div className="p-10 bg-slate-50 min-h-screen font-sans uppercase">
 <header className="mb-12">
  <div className="flex items-center space-x-2 mb-2 text-slate-400">
   <span className="text-[10px] font-black tracking-[0.4em]">АДМИН /</span>
   <span className="text-[10px] font-black text-slate-900 tracking-[0.4em]">ПОДДЕРЖКА</span>
  </div>
  <h2 className="text-4xl font-black tracking-tighter text-slate-900 leading-none">ОБРАЩЕНИЯ КЛИЕНТОВ</h2>
 </header>

 <div className="grid grid-cols-1 gap-6">
  {list.map(m=>(
   <div key={m.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all hover:shadow-md">
    <div className="flex-1">
     <p className="text-[9px] font-black text-blue-600 tracking-widest mb-2 lowercase">{m.user_email}</p>
     <p className="text-sm font-black text-slate-800 tracking-tight normal-case leading-relaxed">{m.message}</p>
    </div>
    <div className="flex items-center gap-4">
     <p className="text-[10px] font-black text-slate-300">{new Date(m.created_at).toLocaleDateString()}</p>
     <button onClick={()=>deleteMsg(m.id)} className="bg-slate-100 text-slate-400 p-4 rounded-2xl font-black text-[9px] tracking-widest hover:bg-red-500 hover:text-white transition-all">УДАЛИТЬ</button>
    </div>
   </div>
  ))}
  {list.length === 0 && <div className="p-20 text-center text-slate-300 font-black text-[10px] tracking-widest uppercase">НЕТ НОВЫХ СООБЩЕНИЙ</div>}
 </div>
</div>
);}