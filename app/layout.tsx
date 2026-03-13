'use client'
import React, { useEffect, useState } from "react";
import "./globals.css";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { usePathname, useRouter } from "next/navigation";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const ADMIN = "dogcat1223@list.ru";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const [u, setU] = useState<any>(null);
    const [l, setL] = useState(true);
    const [supportOpen, setSupportOpen] = useState(false);
    const [supportMsg, setSupportMsg] = useState('');
    const [chat, setChat] = useState<any[]>([]);
    
    // Состояние для мобильного меню
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const path = usePathname();
    const router = useRouter();

    // Закрывать мобильное меню при смене страницы
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [path]);

    useEffect(() => {
        const check = async () => {
            const { data: { user } } = await sb.auth.getUser();
            if (user) {
                const { data: p } = await sb.from('profiles').select('is_blocked').eq('id', user.id).single();
                if (p?.is_blocked) { await sb.auth.signOut(); alert('АККАУНТ ЗАБЛОКИРОВАН'); router.push('/login'); return; }
                setU(user);
                const { data: m } = await sb.from('chat_messages').select('*').eq('user_email', user.email).order('id', { ascending: true });
                if (m) setChat(m);
            }
            setL(false);
            if (!user && path !== '/login') router.push('/login');
        };
        check();
        const channel = sb.channel('chat_main').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, (payload) => {
            if (u && payload.new.user_email === u.email) setChat(prev => [...prev, payload.new]);
        }).subscribe();
        const { data: auth } = sb.auth.onAuthStateChange((e, s) => { if (e === 'SIGNED_OUT') { setU(null); router.push('/login') } if (e === 'SIGNED_IN') check(); });
        return () => { auth.subscription.unsubscribe(); sb.removeChannel(channel); };
    }, [path, u?.email]);

    const sendMsg = async () => {
        if (!supportMsg.trim() || !u) return;
        await sb.from('chat_messages').insert([{ user_email: u.email, message: supportMsg, is_admin: false }]);
        setSupportMsg('');
    };

    if (l) return (<html lang="ru"><body><div className="h-screen bg-[#0f172a] flex items-center justify-center text-blue-400 font-[1000] text-4xl tracking-tighter uppercase animate-pulse italic">1WINTRADE...</div></body></html>);
    if (path === '/login') return (<html lang="ru"><body>{children}</body></html>);

    const isAdmin = u?.email === ADMIN;

    return (
        <html lang="ru">
            <body className="antialiased bg-slate-50 font-sans select-none text-slate-900">
                
                {/* МОБИЛЬНАЯ ШАПКА (видна только на мобилках) */}
                <header className="md:hidden bg-[#0f172a] text-white p-4 flex justify-between items-center fixed top-0 w-full z-30 border-b border-white/5">
                    <span className="text-xl font-[1000] italic tracking-tighter uppercase">1WINTRADE</span>
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-blue-600 rounded-lg">
                        {isSidebarOpen ? (
                            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        ) : (
                            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
                        )}
                    </button>
                </header>

                <div className="flex min-h-screen pt-[65px] md:pt-0">
                    
                    {/* ЗАТЕМНЕНИЕ ПРИ ОТКРЫТОМ МЕНЮ (мобильное) */}
                    {isSidebarOpen && (
                        <div 
                            className="fixed inset-0 bg-black/50 z-30 md:hidden" 
                            onClick={() => setIsSidebarOpen(false)}
                        />
                    )}

                    {/* БОКОВАЯ ПАНЕЛЬ (адаптивная) */}
                    <aside className={`
                        w-64 bg-[#0f172a] text-slate-300 flex flex-col fixed h-full z-40 shadow-2xl border-r border-white/5 
                        transition-transform duration-300 ease-in-out
                        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                    `}>
                        <div className="py-12 border-b border-white/5 w-full flex flex-col items-center justify-center">
                            <Link href="/" className="text-white text-3xl font-[1000] italic tracking-[-0.05em] uppercase leading-none hover:text-blue-400 transition-all text-center w-full block">1WINTRADE</Link>
                            <div className="mt-4 flex items-center justify-center space-x-2 w-full">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Online</p>
                            </div>
                        </div>
                        <nav className="flex-1 px-4 mt-8 space-y-1 overflow-y-auto uppercase font-black">
                            {isAdmin ? (
                                <div className="space-y-1 px-2">
                                    {[{ n: 'Дашборд', h: '/' }, { n: 'Проекты', h: '/projects' }, { n: 'Клиенты', h: '/clients' }, { n: 'Транзакции', h: '/admin-transactions' }, { n: 'Обращения', h: '/admin-support' }, { n: 'Пользователи', h: '/admin-users' }, { n: 'Настройка Приема', h: '/banks' }].map(m => (
                                        <Link key={m.h} href={m.h} className={`block p-3 rounded-xl text-[11px] transition-all tracking-widest ${path === m.h ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>{m.n}</Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-1 px-2">
                                    <Link href="/" className="flex items-center justify-center p-4 rounded-2xl bg-blue-600 text-white font-black shadow-xl mb-6 text-[10px] tracking-widest uppercase">ЛИЧНЫЙ КАБИНЕТ</Link>
                                    {[{ n: 'Пополнение', h: '/deposits' }, { n: 'Приём', h: '/banks' }, { n: 'Выплата', h: '/withdrawals' }, { n: 'Обработка обращений', h: '/payment-support' }, { n: 'Реквизиты', h: '/my-wallets' }, { n: 'История', h: '/history' }].map(m => (
                                        <Link key={m.h} href={m.h} className={`block p-4 rounded-2xl text-[10px] font-black tracking-widest transition-all text-center ${path === m.h ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>{m.n}</Link>
                                    ))}
                                    <a href="https://t.me/onewintrade_support" target="_blank" className="block p-4 rounded-2xl text-[10px] font-black tracking-widest transition-all text-center text-slate-500 hover:text-white hover:bg-white/5 uppercase">Поддержка</a>
                                </div>
                            )}
                        </nav>
                        <div className="p-8 border-t border-white/5 space-y-4 text-center">
                            <div className="px-2">
                                <p className="text-[8px] uppercase tracking-[0.3em] mb-1 text-slate-600 font-black">Session Active</p>
                                <p className="text-[10px] truncate lowercase text-slate-400 font-black">{u?.email}</p>
                            </div>
                            <button onClick={() => sb.auth.signOut()} className="w-full text-[11px] font-black text-slate-500 hover:text-red-400 uppercase tracking-widest transition-colors">Выйти</button>
                        </div>
                    </aside>

                    {/* ОСНОВНОЙ КОНТЕНТ (адаптивный отступ) */}
                    <main className="flex-1 md:ml-64 min-h-screen relative p-4 md:p-8">
                        {children}
                    </main>

                    {/* ЖИВОЙ ЧАТ (адаптивный размер) */}
                    {!isAdmin && (
                        <div className="fixed bottom-4 right-4 md:bottom-10 md:right-10 z-50 flex flex-col items-end">
                            {supportOpen && (
                                <div className="bg-white w-[calc(100vw-32px)] md:w-96 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden mb-4 animate-in slide-in-from-bottom-4 duration-300 h-[450px] md:h-[500px]">
                                    <div className="bg-[#0f172a] p-6 text-center border-b border-white/5">
                                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none">Live Support</p>
                                        <p className="text-white text-xs font-black uppercase mt-2 tracking-tighter">Чат с оператором</p>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                                        {chat.map((m, i) => (
                                            <div key={i} className={`flex ${m.is_admin ? 'justify-start' : 'justify-end'}`}>
                                                <div className={`max-w-[85%] p-4 rounded-3xl text-[11px] font-black uppercase tracking-tighter ${m.is_admin ? 'bg-white text-slate-800 shadow-sm border border-slate-100' : 'bg-blue-600 text-white shadow-lg'}`}>{m.message}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-4 bg-white border-t flex gap-2">
                                        <input value={supportMsg} onChange={e => setSupportMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMsg()} placeholder="СООБЩЕНИЕ..." className="flex-1 bg-slate-50 p-4 rounded-2xl text-[10px] font-black outline-none border border-transparent focus:border-blue-100" />
                                        <button onClick={sendMsg} className="bg-blue-600 text-white p-4 rounded-2xl shadow-lg hover:bg-blue-700 transition-all">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
                                        </button>
                                    </div>
                                </div>
                            )}
                            <button onClick={() => setSupportOpen(!supportOpen)} className="w-14 h-14 md:w-16 md:h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-300 hover:bg-blue-700 active:scale-90 transition-all">
                                <svg width="24" height="24" className="md:w-7 md:h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 16.66 14.67 14 12 14Z" fill="white" /></svg>
                            </button>
                        </div>
                    )}
                </div>
            </body>
        </html>
    );
}