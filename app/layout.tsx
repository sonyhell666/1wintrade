'use client'
import React,{useEffect,useState} from "react";
import "./globals.css";
import Link from "next/link";
import {createClient} from "@supabase/supabase-js";
import {usePathname,useRouter} from "next/navigation";

const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const ADMIN="dogcat1223@list.ru";

export default function RootLayout({children}:{children:React.ReactNode}){
const [u,setU]=useState<any>(null);
const [l,setL]=useState(true);
const [supportOpen,setSupportOpen]=useState(false);
const [supportMsg,setSupportMsg]=useState('');
const [chat,setChat]=useState<any[]>([]);
const path=usePathname();
const router=useRouter();

useEffect(()=>{
 const check=async()=>{
  const {data:{user}}=await sb.auth.getUser();
  if(user){
   const {data:p}=await sb.from('profiles').select('is_blocked').eq('id',user.id).single();
   if(p?.is_blocked){ await sb.auth.signOut(); alert('АККАУНТ ЗАБЛОКИРОВАН'); router.push('/login'); return; }
   setU(user);
   const {data:m}=await sb.from('chat_messages').select('*').eq('user_email',user.email).order('id',{ascending:true});
   if(m) setChat(m);
  }
  setL(false);
  if(!user && path!=='/login') router.push('/login');
 };
 check();
 const channel = sb.channel('chat_main').on('postgres_changes',{event:'INSERT',schema:'public',table:'chat_messages'},(payload)=>{
  if(u && payload.new.user_email === u.email) setChat(prev=>[...prev, payload.new]);
 }).subscribe();
 const {data:auth}=sb.auth.onAuthStateChange((e,s)=>{ if(e==='SIGNED_OUT'){setU(null);router.push('/login')} if(e==='SIGNED_IN')check(); });
 return ()=>{ auth.subscription.unsubscribe(); sb.removeChannel(channel); };
},[path,u?.email]);

const sendMsg=async()=>{
 if(!supportMsg.trim()||!u) return;
 await sb.from('chat_messages').insert([{user_email:u.email,message:supportMsg,is_admin:false}]);
 setSupportMsg('');
};

if(l) return ( <html lang="ru"><body className="bg-[#0f172a] flex items-center justify-center min-h-screen font-sans"><div className="text-blue-400 font-[1000] text-4xl tracking-tighter uppercase animate-pulse italic">1WINTRADE...</div></body></html> );
if(path==='/login') return ( <html lang="ru"><body>{children}</body></html> );

const isAdmin=u?.email===ADMIN;

return (
<html lang="ru">
<body className="antialiased bg-slate-50 font-sans select-none">
<div className="flex min-h-screen">
 <aside className="w-64 bg-[#0f172a] text-slate-300 flex flex-col fixed h-full z-20 shadow-2xl border-r border-white/5">
  <div className="py-12 border-b border-white/5 w-full flex flex-col items-center justify-center">
   <Link href="/" className="text-white text-3xl font-[1000] italic tracking-[-0.05em] uppercase leading-none hover:text-blue-400 transition-all text-center w-full block">1WINTRADE</Link>
   <div className="mt-4 flex items-center justify-center space-x-2 w-full">
    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">System Online</p>
   </div>
  </div>
  <nav className="flex-1 px-4 mt-8 space-y-1 overflow-y-auto uppercase font-black">
   {isAdmin?(
    <div className="space-y-1 px-2">
     {[ {n:'Дашборд',h:'/'},{n:'Проекты',h:'/projects'},{n:'Клиенты',h:'/clients'},{n:'Транзакции',h:'/admin-transactions'},{n:'Обращения',h:'/admin-support'},{n:'Пользователи',h:'/admin-users'},{n:'Настройка Приема',h:'/banks'} ].map(m=>(
      <Link key={m.h} href={m.h} className={`block p-3 rounded-xl text-[11px] transition-all tracking-widest ${path===m.h?'bg-blue-600 text-white shadow-lg shadow-blue-900/20':'text-slate-500 hover:text-white hover:bg-white/5'}`}>{m.n}</Link>
     ))}
    </div>
   ):(
    <div className="space-y-1 px-2">
     <Link href="/" className="flex items-center justify-center p-4 rounded-2xl bg-blue-600 text-white font-black shadow-xl mb-6 text-[10px] tracking-widest uppercase">ЛИЧНЫЙ КАБИНЕТ</Link>
     {[ 
      {n:'Пополнение',h:'/deposits'},
      {n:'Приём',h:'/banks'},
      {n:'Выплата',h:'/withdrawals'},
      // НОВЫЕ КНОПКИ
      {n:'БТ',h:'/bt'},
      {n:'Ферма',h:'/farm'},
      {n:'Внутренний трафик',h:'/internal-traffic'},
      {n:'Заказать отчет',h:'/order-report'},
      // ---
      {n:'Обработка обращений',h:'/payment-support'},
      {n:'Реквизиты',h:'/my-wallets'},
      {n:'История',h:'/history'},
      {n:'Мои операторы',h:'/my-operators'}
     ].map(m=>(
      <Link key={m.h} href={m.h} className={`block p-4 rounded-2xl text-[10px] font-black tracking-widest transition-all text-center ${path===m.h ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40 hover:bg-blue-700' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>{m.n}</Link>
     ))}
     <a href="https://t.me/onewintrade_support" target="_blank" className="block p-4 rounded-2xl text-[10px] font-black tracking-widest transition-all text-center text-slate-500 hover:text-white hover:bg-white/5">ПОДДЕРЖКА</a>
    </div>
   )}
  </nav>
  <div className="p-8 border-t border-white/5 space-y-4 text-center">
   <div className="px-2"><p className="text-[8px] uppercase tracking-[0.3em] mb-1 text-slate-600 font-black">Session Active</p><p className="text-[10px] truncate lowercase text-slate-400 font-black">{u?.email}</p></div>
   <button onClick={()=>sb.auth.signOut()} className="w-full text-[11px] font-black text-slate-500 hover:text-red-400 uppercase tracking-widest transition-colors">Выйти</button>
  </div>
 </aside>
 <main className="flex-1 ml-64 min-h-screen relative">{children}</main>
</div>
</body>
</html>
);
}