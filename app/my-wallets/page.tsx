'use client'
import React,{useEffect,useState} from 'react';
import {createClient} from '@supabase/supabase-js';

const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function MyWallets(){
const [list,setList]=useState<any[]>([]);
const [bankName,setBankName]=useState('');
const [cardNumber,setCardNumber]=useState('');

const fetch=async()=>{
 const {data:{user}}=await sb.auth.getUser();
 if(user){
  const {data}=await sb.from('client_wallets').select('*').eq('user_email',user.email);
  if(data) setList(data);
 }
};

useEffect(()=>{fetch()},[]);

const add=async(e:any)=>{
 e.preventDefault();
 if(!bankName || !cardNumber) return alert('ЗАПОЛНИТЕ ВСЕ ПОЛЯ');
 
 const {data:{user}}=await sb.auth.getUser();
 
 await sb.from('client_wallets').insert([{
   user_email: user?.email,
   name: bankName.trim(),
   number: cardNumber.trim()
 }]);
 
 setBankName(''); 
 setCardNumber('');
 fetch();
};

const del=async(id:number)=>{
 if(confirm('УДАЛИТЬ КАРТУ?')){
   await sb.from('client_wallets').delete().eq('id',id);
   fetch();
 }
};

return (
<div className="p-10 bg-slate-50 min-h-screen font-sans uppercase">
 <header className="mb-12">
  <div className="flex items-center space-x-2 mb-2 text-slate-400">
   <span className="text-[10px] font-black tracking-[0.4em]">ФИНАНСЫ /</span>
   <span className="text-[10px] font-black text-slate-900 tracking-[0.4em]">РЕКВИЗИТЫ КАРТ</span>
  </div>
  <h2 className="text-4xl font-black tracking-tighter text-slate-900 leading-none">ВАШИ СЧЕТА</h2>
 </header>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
  {/* ФОРМА ДОБАВЛЕНИЯ КАРТЫ */}
  <form onSubmit={add} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6 h-fit">
   <div className="space-y-4">
    <p className="text-[10px] font-black text-blue-600 tracking-[0.2em]">НОВАЯ КАРТА</p>
    
    <input 
      value={bankName} 
      onChange={e=>setBankName(e.target.value)} 
      placeholder="НАЗВАНИЕ БАНКА" 
      className="w-full bg-slate-50 p-5 rounded-3xl outline-none font-black text-xs tracking-widest border border-transparent focus:border-blue-100 uppercase"
    />
    
    <input 
      value={cardNumber} 
      onChange={e=>setCardNumber(e.target.value)} 
      placeholder="НОМЕР КАРТЫ" 
      className="w-full bg-slate-50 p-5 rounded-3xl outline-none font-black text-xs tracking-widest border border-transparent focus:border-blue-100 uppercase"
    />
   </div>

   <button className="w-full bg-blue-600 text-white p-6 rounded-3xl font-black text-[10px] tracking-[0.3em] shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">
    СОХРАНИТЬ КАРТУ
   </button>
  </form>

  {/* СПИСОК КАРТОЧЕК (БАНКОВСКИЙ СТИЛЬ) */}
  <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
   {list.map(w=>(
    <div key={w.id} className="bg-[#0f172a] p-10 rounded-[2.5rem] text-white relative group overflow-hidden shadow-2xl border border-white/5 flex flex-col justify-between h-56 transition-all hover:scale-[1.02]">
     {/* Акцентная полоска */}
     <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
     
     <div>
      <p className="text-[10px] font-black text-slate-500 tracking-widest mb-4 uppercase">{w.name}</p>
      <p className="text-xl font-black tracking-[0.1em] leading-none">
        {w.number}
      </p>
     </div>

     <div className="flex justify-between items-end">
       <p className="text-[8px] font-black text-slate-600 tracking-widest uppercase">Verified Account</p>
       <button 
        onClick={()=>del(w.id)} 
        className="text-red-500 font-black text-[9px] tracking-widest opacity-0 group-hover:opacity-100 transition-all uppercase hover:underline"
       >
        УДАЛИТЬ
       </button>
     </div>
    </div>
   ))}

   {list.length === 0 && (
     <div className="col-span-full bg-white border-2 border-dashed border-slate-100 rounded-[2.5rem] p-20 text-center">
       <p className="text-slate-300 font-black text-[10px] tracking-widest uppercase">У ВАС НЕТ СОХРАНЕННЫХ КАРТ</p>
     </div>
   )}
  </div>
 </div>
</div>
);}