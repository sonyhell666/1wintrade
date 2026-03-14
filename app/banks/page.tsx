'use client'
import React,{useEffect,useState} from 'react';
import {createClient} from '@supabase/supabase-js';

const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const ADMIN="dogcat1223@list.ru";

export default function BanksPage(){
const [list,setList]=useState<any[]>([]);
const [user,setUser]=useState<any>(null);
const [editId,setEditId]=useState<number|null>(null);
const [form,setForm]=useState({name:'',number:'',holder:'',color:'bg-blue-600'});
const [addForm,setAddForm]=useState({name:'',number:'',holder:'',color:'bg-blue-600'});

async function getData(){
 const {data:{user}}=await sb.auth.getUser();
 setUser(user);
 const {data}=await sb.from('requisites').select('*').order('id',{ascending:true});
 if(data) setList(data);
}

useEffect(()=>{getData()},[]);

// ФУНКЦИЯ СОЗДАНИЯ
async function createNew(){
 if(!addForm.name || !addForm.number) return alert('ЗАПОЛНИТЕ НАЗВАНИЕ И НОМЕР');
 await sb.from('requisites').insert([addForm]);
 setAddForm({name:'',number:'',holder:'',color:'bg-blue-600'});
 getData();
 alert('РЕКВИЗИТ ДОБАВЛЕН');
}

// ФУНКЦИЯ СОХРАНЕНИЯ ИЗМЕНЕНИЙ
async function save(id:number){
 await sb.from('requisites').update(form).eq('id',id);
 setEditId(null);
 getData();
}

// ФУНКЦИЯ УДАЛЕНИЯ
async function del(id:number){
 if(confirm('УДАЛИТЬ ЭТОТ РЕКВИЗИТ?')){
  await sb.from('requisites').delete().eq('id',id);
  getData();
 }
}

const isAdmin=user?.email===ADMIN;

return (
<div className="p-8 bg-slate-50 min-h-screen font-sans uppercase font-black text-slate-900">
 <header className="mb-10">
  <div className="flex items-center space-x-2 mb-2">
   <span className="text-[10px] text-slate-400 tracking-[0.4em]">ФИНАНСЫ /</span>
   <span className="text-[10px] tracking-[0.4em]">НАСТРОЙКА ПРИЕМА</span>
  </div>
  <h2 className="text-4xl tracking-tighter leading-none">УПРАВЛЕНИЕ РЕКВИЗИТАМИ</h2>
 </header>

 {isAdmin && (
  /* ФОРМА ДОБАВЛЕНИЯ ДЛЯ АДМИНА */
  <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm mb-10">
   <p className="text-[10px] text-blue-600 tracking-[0.2em] mb-6">ДОБАВИТЬ НОВЫЙ АДРЕС ИЛИ КАРТУ</p>
   <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    <input className="bg-slate-50 p-4 rounded-2xl outline-none text-[10px] tracking-widest" placeholder="НАЗВАНИЕ (НАПР. USDT TRC20)" value={addForm.name} onChange={e=>setAddForm({...addForm,name:e.target.value})}/>
    <input className="bg-slate-50 p-4 rounded-2xl outline-none text-[10px] tracking-widest" placeholder="АДРЕС ИЛИ НОМЕР КАРТЫ" value={addForm.number} onChange={e=>setAddForm({...addForm,number:e.target.value})}/>
    <input className="bg-slate-50 p-4 rounded-2xl outline-none text-[10px] tracking-widest" placeholder="ФИО ПОЛУЧАТЕЛЯ (ЕСЛИ ЕСТЬ)" value={addForm.holder} onChange={e=>setAddForm({...addForm,holder:e.target.value})}/>
    <button onClick={createNew} className="bg-blue-600 text-white p-4 rounded-2xl text-[10px] tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">СОЗДАТЬ</button>
   </div>
  </div>
 )}

 <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
  <div className="p-8 border-b border-slate-50">
   <h3 className="text-xs text-slate-800 tracking-widest uppercase">СПИСОК АКТИВНЫХ РЕКВИЗИТОВ</h3>
  </div>

  <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
   {list.map((item)=>(
    <div key={item.id} className="relative p-8 rounded-[2.5rem] border border-slate-100 bg-slate-50/30 flex flex-col justify-between h-72 group transition-all hover:bg-white hover:shadow-xl">
     <div className={`absolute top-0 left-0 w-full h-3 ${item.color||'bg-blue-600'}`}></div>
     
     {editId===item.id ? (
      /* РЕДАКТИРОВАНИЕ */
      <div className="space-y-3 mt-4">
       <input className="w-full bg-white border border-slate-200 p-3 rounded-xl text-[10px]" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
       <input className="w-full bg-white border border-slate-200 p-3 rounded-xl text-xs" value={form.number} onChange={e=>setForm({...form,number:e.target.value})}/>
       <input className="w-full bg-white border border-slate-200 p-3 rounded-xl text-[10px]" value={form.holder} onChange={e=>setForm({...form,holder:e.target.value})}/>
       <div className="flex gap-2">
        <button onClick={()=>save(item.id)} className="flex-1 bg-green-500 text-white p-2 rounded-xl text-[9px]">СОХРАНИТЬ</button>
        <button onClick={()=>setEditId(null)} className="flex-1 bg-slate-200 text-slate-500 p-2 rounded-xl text-[9px]">ОТМЕНА</button>
       </div>
      </div>
     ) : (
      /* ПРОСМОТР */
      <>
       <div>
        <p className="text-[9px] text-slate-400 tracking-widest mb-4">{item.name}</p>
        <p className="text-xl tracking-tighter break-all leading-tight">{item.number}</p>
       </div>
       <div>
        <p className="text-[9px] text-slate-400 tracking-widest mb-1">ПОЛУЧАТЕЛЬ:</p>
        <p className="text-sm uppercase mb-4">{item.holder || '---'}</p>
        {isAdmin && (
         <div className="flex justify-between items-center pt-4 border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-all">
          <button onClick={()=>{setEditId(item.id); setForm({name:item.name,number:item.number,holder:item.holder,color:item.color})}} className="text-[9px] text-blue-600 hover:underline">ИЗМЕНИТЬ</button>
          <button onClick={()=>del(item.id)} className="text-[9px] text-red-500 hover:underline">УДАЛИТЬ</button>
         </div>
        )}
       </div>
      </>
     )}
    </div>
   ))}
   {list.length === 0 && <div className="col-span-3 py-20 text-center text-slate-300 text-[10px] tracking-widest uppercase">РЕКВИЗИТЫ НЕ ДОБАВЛЕНЫ</div>}
  </div>
 </div>
</div>
);
}