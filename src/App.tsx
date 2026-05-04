
import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Ticket as TicketIcon, 
  Settings, 
  Users, 
  Plus, 
  Trash2, 
  ChevronRight, 
  Filter, 
  Search,
  AlertCircle,
  CheckCircle2,
  Clock,
  MoreVertical,
  X,
  AlertTriangle,
  Bell,
  HelpCircle,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { Project, User, Ticket, Priority, TicketStatus, TimeRange } from './types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Initial Mock Data
const INITIAL_PROJECTS: Project[] = [
  { id: 'p1', name: 'Cloud Migration', description: 'Enterprise AWS move', slaHours: 24, users: ['u1', 'u2'] },
  { id: 'p2', name: 'Internal HR Portal', description: 'Staff payroll system', slaHours: 48, users: ['u1', 'u3'] },
  { id: 'p3', name: 'Legacy ERP Support', description: 'SAP maintenance', slaHours: 12, users: ['u2'] },
];

const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'Sarah Jenkins', email: 'sarah@org.com', projects: ['p1', 'p2'], role: 'Admin' },
  { id: 'u2', name: 'Marcus Chen', email: 'marcus@org.com', projects: ['p1', 'p3'], role: 'Agent' },
  { id: 'u3', name: 'Elena Rodriguez', email: 'elena@org.com', projects: ['p2'], role: 'Agent' },
];

const INITIAL_TICKETS: Ticket[] = [
  { id: 't1', title: 'VPN Connection Failure', description: 'Cannot connect to US-East region', projectId: 'p1', createdById: 'u1', priority: 'High', status: 'In Progress', createdAt: '2024-05-01', updatedAt: '2024-05-02' },
  { id: 't2', title: 'Payroll Sync Error', description: 'Discrepancy in June data', projectId: 'p2', createdById: 'u3', priority: 'Critical', status: 'Open', createdAt: '2024-05-03', updatedAt: '2024-05-03' },
  { id: 't3', title: 'UI Glitch on Dashboard', description: 'Overlap in mobile view', projectId: 'p1', createdById: 'u2', priority: 'Low', status: 'Resolved', createdAt: '2024-04-20', updatedAt: '2024-04-22' },
  { id: 't4', title: 'API Authentication Latency', description: 'Intermittent 503 errors', projectId: 'p3', createdById: 'u1', priority: 'Medium', status: 'Open', createdAt: '2024-05-04', updatedAt: '2024-05-04' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tickets' | 'config'>('dashboard');
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  
  // Dashboard Filters
  const [dashProject, setDashProject] = useState<string>('all');
  const [dashTimeRange, setDashTimeRange] = useState<TimeRange>('Monthly');

  // Ticket Operations State
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Stats Logic
  const stats = useMemo(() => {
    const filteredTickets = dashProject === 'all' 
      ? tickets 
      : tickets.filter(t => t.projectId === dashProject);
    
    return {
      total: filteredTickets.length,
      open: filteredTickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length,
      resolved: filteredTickets.filter(t => t.status === 'Resolved').length,
      critical: filteredTickets.filter(t => t.priority === 'Critical').length,
      chartData: filteredTickets.reduce((acc: any[], t) => {
        const date = t.createdAt;
        const existing = acc.find(a => a.name === date);
        if (existing) existing.value++;
        else acc.push({ name: date, value: 1 });
        return acc;
      }, []).sort((a, b) => a.name.localeCompare(b.name))
    };
  }, [tickets, dashProject]);

  // Actions
  const handleDeleteTicket = () => {
    if (confirmDeleteId) {
      setTickets(prev => prev.filter(t => t.id !== confirmDeleteId));
      setConfirmDeleteId(null);
    }
  };

  const handleCreateOrUpdateTicket = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const ticketData: any = Object.fromEntries(formData);
    
    if (editingTicket) {
      setTickets(prev => prev.map(t => t.id === editingTicket.id ? { ...t, ...ticketData, updatedAt: new Date().toISOString().split('T')[0] } : t));
    } else {
      const newTicket: Ticket = {
        id: `t${Date.now().toString().slice(-6)}`,
        ...ticketData,
        createdById: users[0].id,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      } as Ticket;
      setTickets(prev => [...prev, newTicket]);
    }
    setIsTicketModalOpen(false);
    setEditingTicket(null);
  };

  return (
    <div className="flex h-screen bg-[#F9FAFB] text-slate-900 font-sans overflow-hidden">
      {/* Navigation Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Layers className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900">Nexus</h1>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none">Support System</p>
            </div>
          </div>
          
          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18}/> },
              { id: 'tickets', label: 'Tickets', icon: <TicketIcon size={18}/> },
              { id: 'config', label: 'Configuration', icon: <Settings size={18}/> },
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={cn(
                  "flex items-center gap-3 w-full px-4 py-3 text-sm font-medium transition-all rounded-lg group",
                  activeTab === item.id 
                    ? "bg-indigo-50 text-indigo-700 shadow-sm" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <span className={cn(
                  "transition-colors",
                  activeTab === item.id ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                )}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-6">
          <div className="bg-indigo-600 rounded-2xl p-5 text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-80 mb-1">Upgrade</p>
            <h4 className="text-sm font-bold mb-3 italic">Enterprise SLA</h4>
            <button className="w-full bg-white text-indigo-600 py-2 rounded-lg text-xs font-bold shadow-sm hover:bg-slate-50 transition-colors">
              Manage Billing
            </button>
          </div>

          <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-100">
            <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs ring-2 ring-white">
              SJ
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">Sarah Jenkins</p>
              <p className="text-[10px] font-medium text-slate-500 truncate">Administrator</p>
            </div>
            <button className="text-slate-400 hover:text-slate-600"><Settings size={14} /></button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto flex flex-col outline-none">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4 flex-1">
             <div className="relative w-full max-w-sm hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search tickets, groups, projects..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:border-indigo-500 border rounded-xl text-sm outline-none transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 italic md:not-italic">
            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <HelpCircle size={20} />
            </button>
            <div className="h-6 w-[1px] bg-slate-200 mx-2 hidden sm:block"></div>
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all active:translate-y-0"
              onClick={() => { setEditingTicket(null); setIsTicketModalOpen(true); }}
            >
              <Plus size={18} /> <span className="hidden sm:inline">New Ticket</span>
            </button>
          </div>
        </header>

        {/* Content Tabs */}
        <div className="p-8">
          {activeTab === 'dashboard' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard Overview</h2>
                  <p className="text-sm font-medium text-slate-500">Track and manage service activity across nodes.</p>
                </div>
                <div className="flex gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                  <select 
                    value={dashProject}
                    onChange={(e) => setDashProject(e.target.value)}
                    className="text-xs font-bold text-slate-600 px-4 py-2 bg-transparent outline-none cursor-pointer border-r border-slate-100 rounded-l-lg hover:bg-slate-50"
                  >
                    <option value="all">All Projects</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  <div className="flex gap-1">
                    {['Weekly', 'Monthly', 'Quarterly'].map((range) => (
                      <button 
                        key={range}
                        onClick={() => setDashTimeRange(range as TimeRange)}
                        className={cn(
                          "px-4 py-2 text-xs font-bold rounded-lg transition-all",
                          dashTimeRange === range ? "bg-indigo-50 text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                        )}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Tickets', value: stats.total, trend: '+12%', icon: <TicketIcon size={20} className="text-indigo-600"/>, bg: 'bg-indigo-50' },
                  { label: 'Active Issues', value: stats.open, trend: '-2%', icon: <AlertCircle size={20} className="text-orange-600"/>, bg: 'bg-orange-50' },
                  { label: 'Critical Escalations', value: stats.critical, trend: '0%', icon: <AlertTriangle size={20} className="text-red-600"/>, bg: 'bg-red-50' },
                  { label: 'Resolution Rate', value: `${stats.total ? Math.round((stats.resolved/stats.total)*100) : 0}%`, trend: '+5%', icon: <CheckCircle2 size={20} className="text-emerald-600"/>, bg: 'bg-emerald-50' },
                ].map((s, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm group hover:shadow-xl hover:shadow-indigo-50/50 transition-all hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className={cn("p-3 rounded-xl", s.bg)}>
                        {s.icon}
                      </div>
                      <span className={cn("text-[10px] font-bold px-2 py-1 rounded-lg", 
                        s.trend.startsWith('+') ? "bg-emerald-50 text-emerald-600" : 
                        s.trend.startsWith('-') ? "bg-rose-50 text-rose-600" : "bg-slate-50 text-slate-500")}>
                        {s.trend}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{s.label}</p>
                    <p className="text-3xl font-bold tracking-tight text-slate-900">{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Data Visualization */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Volume Trend</h3>
                    <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                      <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> Current</div>
                      <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-slate-200"></span> Previous</div>
                    </div>
                  </div>
                  <div className="h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stats.chartData}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} tick={{ fill: '#94A3B8' }} />
                        <YAxis fontSize={10} axisLine={false} tickLine={false} tick={{ fill: '#94A3B8' }} />
                        <Tooltip 
                          contentStyle={{ fontSize: '12px', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Area type="monotone" dataKey="value" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-8">
                  <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-8">Quick Actions</h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Generate SLA Report', color: 'bg-indigo-50 text-indigo-700' },
                        { label: 'Review Escalations', color: 'bg-rose-50 text-rose-700' },
                        { label: 'Archive Resolved', color: 'bg-emerald-50 text-emerald-700' },
                      ].map((action, i) => (
                        <button key={i} className={cn("w-full py-3 px-4 rounded-xl text-xs font-bold transition-all hover:scale-[1.02] active:scale-100 text-left flex items-center justify-between group", action.color)}>
                          {action.label}
                          <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group shadow-2xl shadow-indigo-200">
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
                    <div className="relative z-10">
                      <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">Live Support</p>
                      <h4 className="text-xl font-bold mb-4">Need technical assistance?</h4>
                      <p className="text-xs text-slate-400 leading-relaxed mb-6">Our senior engineers are available 24/7 for critical enterprise escalation support.</p>
                      <button className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl text-xs font-bold transition-colors">
                        Open Chat
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'tickets' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">Service Queue</h2>
                  <p className="text-sm font-medium text-slate-500">Comprehensive log of all active and historical nodes.</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex bg-white rounded-xl border border-slate-200 p-1 shadow-sm">
                    <button className="px-4 py-2 text-xs font-bold bg-indigo-50 text-indigo-600 rounded-lg">Active</button>
                    <button className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-600 rounded-lg">Archived</button>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ticket ID</th>
                        <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Project</th>
                        <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Issue Subject</th>
                        <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status / Phase</th>
                        <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Priority</th>
                        <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {tickets.map(t => (
                        <tr key={t.id} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="p-5">
                            <span className="text-xs font-mono font-bold text-slate-400">#{t.id}</span>
                          </td>
                          <td className="p-5">
                            <p className="text-xs font-bold text-slate-900">{projects.find(p => p.id === t.projectId)?.name}</p>
                            <p className="text-[10px] font-medium text-slate-400">Node: {t.projectId}</p>
                          </td>
                          <td className="p-5">
                            <p className="text-xs font-bold text-slate-900 max-w-xs truncate">{t.title}</p>
                            <p className="text-[10px] font-medium text-slate-400 mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">{t.description}</p>
                          </td>
                          <td className="p-5">
                            <span className={cn(
                              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap",
                              t.status === 'Open' ? "bg-blue-50 text-blue-600" :
                              t.status === 'In Progress' ? "bg-orange-50 text-orange-600" :
                              t.status === 'Resolved' ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                            )}>
                              <div className={cn("w-1.5 h-1.5 rounded-full", 
                                t.status === 'Open' ? "bg-blue-500" :
                                t.status === 'In Progress' ? "bg-orange-500" :
                                t.status === 'Resolved' ? "bg-emerald-500" : "bg-slate-400"
                              )} />
                              {t.status}
                            </span>
                          </td>
                          <td className="p-5">
                            <span className={cn(
                              "text-[10px] font-bold uppercase tracking-widest",
                              t.priority === 'Critical' ? "text-rose-600" :
                              t.priority === 'High' ? "text-orange-500" :
                              t.priority === 'Medium' ? "text-indigo-500" : "text-slate-400"
                            )}>
                              {t.priority}
                            </span>
                          </td>
                          <td className="p-5 text-right">
                             <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                               <button 
                                onClick={() => { setEditingTicket(t); setIsTicketModalOpen(true); }}
                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg shadow-sm border border-transparent hover:border-slate-100 transition-all"
                               >
                                 <Settings size={14} />
                               </button>
                               <button 
                                onClick={() => setConfirmDeleteId(t.id)}
                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg shadow-sm border border-transparent hover:border-slate-100 transition-all"
                               >
                                 <Trash2 size={14} />
                               </button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center italic md:not-italic">
                  <p className="text-xs font-bold text-slate-400">Displaying {tickets.length} total entries</p>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-400 cursor-not-allowed">Previous</button>
                    <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-indigo-600 shadow-sm border-indigo-100">Next Page</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'config' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-20">
               <div className="flex justify-between items-end border-b border-slate-200 pb-8">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">Platform Configuration</h2>
                  <p className="text-sm font-medium text-slate-500">Onboard new projects, users, and define SLA benchmarks.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Projects Column */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Active Projects</h3>
                    <button className="p-1 px-3 bg-indigo-600 text-white rounded-lg text-[10px] font-bold hover:bg-indigo-700 transition-colors">Add New</button>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-3xl p-4 space-y-3">
                    {projects.map(p => (
                      <div key={p.id} className="p-4 rounded-2xl border border-slate-50 hover:border-indigo-100 hover:bg-indigo-50/20 transition-all group cursor-pointer">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-sm font-bold text-slate-900">{p.name}</h4>
                          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">{p.slaHours}h SLA</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed mb-4">{p.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex -space-x-2">
                            {p.users.map((u, i) => (
                              <div key={u} className="w-6 h-6 rounded-lg bg-slate-200 border-2 border-white flex items-center justify-center text-[8px] font-bold uppercase">{users.find(usr => usr.id === u)?.name[0] || '?'}</div>
                            ))}
                          </div>
                          <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Users Column */}
                <div className="space-y-6">
                   <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">User Personnel</h3>
                    <button className="p-1 px-3 bg-indigo-600 text-white rounded-lg text-[10px] font-bold hover:bg-indigo-700 transition-colors">Invite</button>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-3xl p-2 space-y-1">
                    {users.map(u => (
                      <div key={u.id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all group">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs ring-4 ring-white shadow-sm transition-transform group-hover:scale-110">
                          {u.name.split(' ').map(n=>n[0]).join('')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">{u.name}</p>
                          <p className="text-[10px] font-medium text-slate-500 truncate">{u.email}</p>
                        </div>
                        <div className="text-right">
                          <p className={cn("text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg inline-block", 
                            u.role === 'Admin' ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-500")}>
                            {u.role}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Global Rules / SLA Matrix */}
                <div className="space-y-6">
                   <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Priority Mapping</h3>
                   <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-100">
                     <div className="absolute top-0 right-0 p-8 opacity-20"><Settings size={80}/></div>
                     <h4 className="text-xl font-bold mb-6 italic">SLA Matrix</h4>
                     <div className="space-y-4 relative z-10">
                        {[
                          { p: 'Critical', t: '2 Hours' },
                          { p: 'High', t: '6 Hours' },
                          { p: 'Medium', t: '12 Hours' },
                          { p: 'Low', t: '24 Hours' },
                        ].map(row => (
                          <div key={row.p} className="flex justify-between items-center py-3 border-b border-white/10 last:border-0 italic text-sm">
                            <span className="font-sans not-italic font-bold text-[10px] uppercase text-indigo-200 tracking-widest">{row.p}</span>
                            <span className="font-bold">{row.t}</span>
                          </div>
                        ))}
                     </div>
                     <button className="w-full mt-8 bg-white/10 hover:bg-white/20 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all border border-white/10">
                       Recalibrate Matrix
                     </button>
                   </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Modern Centered Modal */}
      <AnimatePresence>
        {isTicketModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white max-w-md w-full rounded-[32px] overflow-hidden shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="bg-indigo-600 px-8 py-10 text-white relative">
                 <button 
                  onClick={() => setIsTicketModalOpen(false)}
                  className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                ><X size={20}/></button>
                <div className="p-3 bg-white/10 w-fit rounded-2xl mb-6">
                  <TicketIcon size={32} />
                </div>
                <h3 className="text-3xl font-bold tracking-tight mb-2">
                  {editingTicket ? "Modify Record" : "Support Request"}
                </h3>
                <p className="text-indigo-100 text-sm font-medium opacity-80">
                  {editingTicket ? `Editing entry log ID #${editingTicket.id}` : "Initiate a new service sequence"}
                </p>
              </div>

              <form onSubmit={handleCreateOrUpdateTicket} className="p-8 space-y-6">
                <div className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Issue Identifier</label>
                    <input 
                      name="title" 
                      defaultValue={editingTicket?.title} 
                      required 
                      placeholder="e.g. Database Connectivity Fault"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 rounded-xl text-sm font-medium outline-none transition-all placeholder:text-slate-300"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Project Cluster</label>
                      <select 
                        name="projectId" 
                        defaultValue={editingTicket?.projectId} 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none cursor-pointer hover:bg-slate-100 transition-all appearance-none"
                      >
                        {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Urgency Node</label>
                      <select 
                        name="priority" 
                        defaultValue={editingTicket?.priority || 'Low'} 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none cursor-pointer hover:bg-slate-100 transition-all appearance-none"
                      >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                        <option>Critical</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Technical Brief</label>
                    <textarea 
                      name="description" 
                      defaultValue={editingTicket?.description} 
                      required
                      placeholder="Specify the divergence parameters..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 rounded-xl text-sm font-medium outline-none transition-all placeholder:text-slate-300 h-28 resize-none"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3 italic md:not-italic">
                  <button type="button" onClick={() => setIsTicketModalOpen(false)} className="flex-1 py-4 bg-slate-50 text-slate-500 rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-slate-100 transition-colors">Abort</button>
                  <button type="submit" className="flex-[2] bg-indigo-600 text-white py-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                    {editingTicket ? "Commit Archive" : "Deploy Ticket"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {confirmDeleteId && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white max-w-sm w-full rounded-[32px] p-10 text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-8 border-4 border-white shadow-xl shadow-rose-100/50">
                <AlertTriangle className="text-rose-600" size={36} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2 whitespace-nowrap">Expunge Entry?</h4>
              <p className="text-xs text-slate-500 mb-10 leading-relaxed px-4">
                You are about to remove record <span className="font-mono font-bold text-slate-900">#{confirmDeleteId}</span> from the core ledger. This node will be permanently archived.
              </p>
              <div className="flex gap-4 italic md:not-italic">
                <button 
                  onClick={() => setConfirmDeleteId(null)}
                  className="flex-1 py-4 bg-slate-50 text-slate-500 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-100 transition-colors"
                >Cancel</button>
                <button 
                  onClick={handleDeleteTicket}
                  className="flex-1 bg-rose-600 text-white py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-rose-100 hover:bg-rose-700 transition-colors"
                >Purge</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
