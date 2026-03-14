'use client'
import React,{useEffect,useState} from 'react';
import {createClient} from '@supabase/supabase-js';

const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const ADMIN="dogcat1223@list.ru";

export default function BanksPage(){
const [list,setList]=useState<any[]>([]);
const [user,setUser]=useState<any>(null);
const [editId,setEditId]=useState<number|null>(null);
const[form,setForm]=useState({name:'',number:'',holder:''});

async function getData(){
 const {data:{user}}=await sb.auth.getUser();
 setUser(user);
 const {data}=await sb.from('requisites').select('*').order('id',{ascending:true});
 if(data) setList(data);
}

useEffect(()=>{getData()},[]);

async function save(id:number){
 if(!form.number) return alert('ВВЕДИТЕ АДРЕС/НОМЕР');
 await sb.from('requisites').update(form).eq('id',id);
 setEditId(null);
 getData();
 alert('ДАННЫЕ ОБНОВЛЕНЫ');
}

const isAdmin=user?.email===ADMIN;

return (
<div className="p-10 bg-slate-50 min-h-screen font-sans uppercase">
 <header className="mb-12">
  <div className="flex items-center space-x-2 mb-2 text-slate-400">
   <span className="text-[10px] font-black tracking-[0.4em]">ФИНАНСЫ /</span>
   <span className="text-[10px] font-black text-slate-900 tracking-[0.4em]">РЕКВИЗИТЫ ПРИЕМА</span>
  </div>
  <h2 className="text-4xl font-black tracking-tighter text-slate-900 leading-none">НАШИ РЕКВИЗИТЫ</h2>
 </header>

 <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-10">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
   {list.map((item)=>(
    <div key={item.id} className="relative p-10 rounded-[2.5rem] border border-slate-100 bg-slate-50/30 transition-all hover:bg-white hover:shadow-xl flex flex-col justify-between h-[340px]">
     <div className={`absolute top-0 left-0 w-full h-3 ${item.color||'bg-blue-600'}`}></div>
     
     {editId===item.id ? (
      /* ФОРМА РЕДАКТИРОВАНИЯ ДЛЯ АДМИНА */
      <div className="space-y-4 mt-2">
       <p className="text-[10px] font-black text-blue-600 tracking-widest">РЕДАКТИРОВАНИЕ</p>
       <input className="w-full bg-white border border-slate-200 p-4 rounded-2xl text-[10px] font-black outline-none focus:border-blue-300" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="НАЗВАНИЕ (НАПР. USDT TRC20)"/>
       <input className="w-full bg-white border border-slate-200 p-4 rounded-2xl text-xs font-black outline-none focus:border-blue-300" value={form.number} onChange={e=>setForm({...form,number:e.target.value})} placeholder="АДРЕС / НОМЕР"/>
       <input className="w-full bg-white border border-slate-200 p-4 rounded-2xl text-[10px] font-black outline-none focus:border-blue-300" value={form.holder} onChange={e=>setForm({...form,holder:e.target.value})} placeholder="ПОЛУЧАТЕЛЬ"/>
       <div className="flex gap-2">
        <button onClick={()=>save(item.id)} className="flex-1 bg-blue-600 text-white p-4 rounded-2xl font-black text-[9px] tracking-widest shadow-lg">СОХРАНИТЬ</button>
        <button onClick={()=>setEditId(null)} className="flex-1 bg-slate-200 text-slate-600 p-4 rounded-2xl font-black text-[9px] tracking-widest">ОТМЕНА</button>
       </div>
      </div>
     ) : (
      /* ОБЫЧНЫЙ ВИД ДЛЯ КЛИЕНТА / АДМИНА ДО КЛИКА */
      <>
       <div>
        <p className="text-[10px] font-black text-slate-400 tracking-widest mb-4">{item.name}</p>
        <p className="text-xl font-black text-slate-900 tracking-tight break-all leading-tight">{item.number}</p>
       </div>
       
       <div>
        <p className="text-[9px] font-black text-slate-400 tracking-widest mb-1">ПОЛУЧАТЕЛЬ:</p>
        <p className="text-sm font-black text-slate-800">{item.holder}</p>

        {/* КНОПКА ПОЯВЛЯЕТСЯ ТОЛЬКО У ТЕБЯ */}
        {isAdmin && (
         <button onClick={()=>{setEditId(item.id); setForm({name:item.name,number:item.number,holder:item.holder})}} 
          className="mt-6 w-full text-center bg-slate-100 p-4 rounded-2xl text-[9px] font-black text-blue-600 tracking-widest hover:bg-slate-200 transition-all">
          ИЗМЕНИТЬ ДАННЫЕ
         </button>
        )}
       </div>
      </>
     )}
    </div>
   ))}
  </div>
 </div>
</div>
);
}