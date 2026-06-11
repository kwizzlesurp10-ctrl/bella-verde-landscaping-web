'use client';

import React, { useState } from 'react';
import { 
  Users, Clock, Hammer, BarChart3, Lock, LogOut, RefreshCw, Plus 
} from 'lucide-react';
import { motion } from 'framer-motion';

// Types matching your SwiftData models
interface Client {
  id: string;
  name: string;
  address: string;
  contactPerson: string;
  contactPhone: string;
  gatePIN: string;
  garageCode: string;
  keyLocation: string;
}

interface Job {
  id: string;
  title: string;
  clientId: string;
  budget: number;
  spent: number;
  status: string;
}

interface TimeEntry {
  id: string;
  clientId: string;
  clockIn: string;
  clockOut?: string;
}

const initialClients: Client[] = [
  { 
    id: 'c1', 
    name: 'Maple Grove Residence', 
    address: '1240 Maple Ln, Bloomington, MN', 
    contactPerson: 'Sarah Thompson', 
    contactPhone: '(612) 555-0182', 
    gatePIN: '4821', 
    garageCode: 'A392', 
    keyLocation: 'Under the frog statue by the side gate' 
  },
  { 
    id: 'c2', 
    name: 'Lakeside Estate', 
    address: '8900 Lake Harriet Blvd, Minneapolis, MN', 
    contactPerson: 'Michael Chen', 
    contactPhone: '(612) 555-0291', 
    gatePIN: '7394', 
    garageCode: '', 
    keyLocation: 'Magnetic box on the back fence post' 
  },
];

const initialJobs: Job[] = [
  { id: 'j1', title: 'Spring Cleanup & Mulch', clientId: 'c1', budget: 4850, spent: 3120, status: 'Active' },
  { id: 'j2', title: 'Patio & Hardscape Installation', clientId: 'c2', budget: 12400, spent: 8900, status: 'Active' },
];

const initialTimeEntries: TimeEntry[] = [
  { id: 't1', clientId: 'c1', clockIn: '2026-06-10T08:15:00', clockOut: '2026-06-10T12:45:00' },
  { id: 't2', clientId: 'c2', clockIn: '2026-06-10T09:00:00', clockOut: '2026-06-10T15:30:00' },
];

export default function BellaVerdeDashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'clients' | 'jobs' | 'reports'>('dashboard');
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(initialTimeEntries);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [vaultUnlocked, setVaultUnlocked] = useState(false);
  const [vaultCode, setVaultCode] = useState('');
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');

  // Calculate live totals
  const totalHours = timeEntries.reduce((sum, entry) => {
    if (entry.clockOut) {
      const hours = (new Date(entry.clockOut).getTime() - new Date(entry.clockIn).getTime()) / 3600000;
      return sum + hours;
    }
    return sum;
  }, 0);

  const handleUnlockVault = () => {
    if (vaultCode === 'BEE2026' || vaultCode.toLowerCase() === 'demo') {
      setVaultUnlocked(true);
      setVaultCode('');
    } else {
      alert('Incorrect manager code. Try "BEE2026" or "demo" for this preview.');
    }
  };

  const simulateSync = () => {
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('synced');
      // In production this would call your Supabase edge function or MCP connector
      alert('✅ Synced with iOS Bella Verde app via Supabase (demo mode)');
    }, 1100);
  };

  const BeeMascot = ({ size = 64 }: { size?: number }) => (
    <motion.div
      className="inline-block bee"
      animate={{
        x: [0, 110, 0],
        y: [0, -22, 0],
        rotate: [0, 14, -7, 0],
      }}
      transition={{
        duration: 4.2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <span style={{ fontSize: size }} className="select-none">🐝</span>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#1A1A2E] text-[#171717] dark:text-[#ededed]">
      {/* Top Navbar */}
      <nav className="border-b bg-white/95 dark:bg-[#252A3A]/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <BeeMascot size={42} />
              <div>
                <div className="font-semibold text-3xl tracking-tighter text-[#2D6A4F]">Bella Verde</div>
                <div className="text-[10px] text-[#40916C] -mt-1.5 tracking-[3px]">OPERATIONS DASHBOARD</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium ${syncStatus === 'synced' ? 'bg-[#E8F5E9] text-[#2D6A4F]' : 'bg-amber-100 text-amber-700'}`}>
              <div className={`w-2 h-2 rounded-full ${syncStatus === 'synced' ? 'bg-[#2D6A4F]' : 'bg-amber-500 animate-pulse'}`} />
              {syncStatus === 'synced' ? 'Connected to iOS' : 'Syncing...'}
            </div>
            
            <button 
              onClick={simulateSync}
              className="flex items-center gap-2 px-5 py-2 rounded-2xl border bg-white dark:bg-[#374151] hover:bg-[#F8F9FA] text-sm font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Sync with Field App
            </button>
            
            <div className="flex items-center gap-3 pl-5 border-l">
              <div className="text-right">
                <div className="font-medium">Maria Lopez</div>
                <div className="text-xs text-[#6B7280]">Operations Manager</div>
              </div>
              <button className="p-2.5 rounded-full hover:bg-[#F8F9FA] dark:hover:bg-[#374151]"><LogOut className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="uppercase tracking-[4px] text-xs text-[#40916C] font-medium">JUNE 11, 2026 • MINNEAPOLIS, MN</div>
            <h1 className="text-6xl font-semibold tracking-tighter mt-1">Good afternoon, Maria.</h1>
          </div>
          <BeeMascot size={92} />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b pb-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'clients', label: 'Clients & Properties', icon: Users },
            { id: 'jobs', label: 'Jobs & Budgets', icon: Hammer },
            { id: 'reports', label: 'Labor Reports', icon: Clock },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-8 py-3 flex items-center gap-2.5 text-sm font-medium rounded-t-2xl transition-all ${activeTab === tab.id 
                ? 'bg-white dark:bg-[#252A3A] border border-b-0 shadow-sm text-[#2D6A4F]' 
                : 'text-[#6B7280] hover:text-[#2D6A4F] hover:bg-white/60'}`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 card p-9">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-[#40916C] text-sm tracking-widest font-medium">REAL-TIME OPERATIONS</div>
                  <div className="text-5xl font-semibold tracking-tighter mt-3">Today at a Glance</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
                <div className="p-7 bg-[#E8F5E9] rounded-3xl">
                  <div className="text-6xl font-semibold tabular-nums text-[#2D6A4F]">{totalHours.toFixed(1)}</div>
                  <div className="mt-1 text-[#40916C] font-medium">Hours Logged Today</div>
                </div>
                <div className="p-7 bg-white dark:bg-[#1F2A1F] rounded-3xl border">
                  <div className="text-6xl font-semibold tabular-nums">{jobs.length}</div>
                  <div className="mt-1 text-[#6B7280]">Active Projects</div>
                </div>
                <div className="p-7 bg-white dark:bg-[#1F2A1F] rounded-3xl border">
                  <div className="text-6xl font-semibold tabular-nums text-[#D4A373]">{clients.length}</div>
                  <div className="mt-1 text-[#6B7280]">Properties Under Management</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 card p-8 flex flex-col">
              <div className="font-semibold flex items-center gap-2 text-lg mb-4"><Lock className="w-5 h-5 text-[#D4A373]" /> Secure Access</div>
              <p className="text-[#6B7280] flex-1">Field crews use Face ID protected vaults on iOS. Managers can override here for quick reference.</p>
              <button 
                onClick={() => setActiveTab('clients')}
                className="mt-6 w-full py-4 rounded-2xl bg-[#2D6A4F] hover:bg-[#24543F] active:bg-[#1E4635] text-white font-semibold tracking-wide transition-colors"
              >
                OPEN CLIENT VAULTS
              </button>
            </div>
          </div>
        )}

        {/* CLIENTS TAB */}
        {activeTab === 'clients' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-4xl font-semibold tracking-tight">Properties &amp; Clients</h2>
              <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#2D6A4F] text-white text-sm font-medium hover:bg-[#24543F]">
                <Plus className="w-4 h-4" /> Add New Property
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {clients.map((client) => (
                <div 
                  key={client.id} 
                  onClick={() => { 
                    setSelectedClient(client); 
                    setVaultUnlocked(false); 
                    setVaultCode(''); 
                  }}
                  className="card p-8 cursor-pointer group"
                >
                  <div className="font-semibold text-2xl tracking-tight group-hover:text-[#2D6A4F] transition-colors">{client.name}</div>
                  <div className="text-[#6B7280] mt-2 leading-snug">{client.address}</div>
                  
                  <div className="mt-8 pt-6 border-t flex justify-between text-sm">
                    <div>
                      <div className="text-[#6B7280]">Primary Contact</div>
                      <div className="font-medium">{client.contactPerson}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[#6B7280]">Phone</div>
                      <div className="font-medium">{client.contactPhone}</div>
                    </div>
                  </div>

                  <div className="mt-6 inline-flex items-center text-xs font-medium px-4 py-1.5 rounded-full bg-[#FEF3C7] text-[#92400E]">
                    <Lock className="w-3.5 h-3.5 mr-1.5" /> SECURE VAULT
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* JOBS TAB */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            {jobs.map((job) => {
              const client = clients.find(c => c.id === job.clientId);
              const progress = Math.min(Math.round((job.spent / job.budget) * 100), 100);
              return (
                <div key={job.id} className="card p-9">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-y-4">
                    <div>
                      <div className="font-semibold text-3xl tracking-tight">{job.title}</div>
                      <div className="text-[#6B7280] mt-1 text-lg">{client?.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-semibold tabular-nums tracking-tighter">${job.spent.toLocaleString()}</div>
                      <div className="text-[#6B7280]">of ${job.budget.toLocaleString()} budget</div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <div className="h-2.5 bg-[#E5E7EB] dark:bg-[#374151] rounded-full overflow-hidden">
                      <div 
                        className="h-2.5 bg-[#2D6A4F] rounded-full transition-all duration-700" 
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-[#6B7280] mt-2 font-medium">
                      <div>{progress}% complete</div>
                      <div>Remaining: $${(job.budget - job.spent).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* REPORTS TAB */}
        {activeTab === 'reports' && (
          <div className="card p-10">
            <h3 className="text-3xl font-semibold tracking-tight mb-8">Labor Hours by Property</h3>
            
            <div className="space-y-3">
              {clients.map(client => {
                const clientHours = timeEntries
                  .filter(e => e.clientId === client.id && e.clockOut)
                  .reduce((sum, e) => {
                    const h = (new Date(e.clockOut!).getTime() - new Date(e.clockIn).getTime()) / 3600000;
                    return sum + h;
                  }, 0);
                return (
                  <div key={client.id} className="flex items-center justify-between p-6 bg-[#F8F9FA] dark:bg-[#1F2A1F] rounded-3xl">
                    <div className="font-medium text-lg">{client.name}</div>
                    <div className="font-mono text-3xl font-semibold text-[#2D6A4F] tabular-nums">{clientHours.toFixed(1)} <span className="text-base font-normal text-[#6B7280]">hrs</span></div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-6 border-t flex items-baseline justify-between text-xl font-semibold">
              <div>Total Field Hours Logged</div>
              <div className="font-mono text-[#2D6A4F] tabular-nums">{totalHours.toFixed(1)} hrs</div>
            </div>
          </div>
        )}
      </div>

      {/* Secure Vault Modal */}
      {selectedClient && (
        <div 
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-6" 
          onClick={() => { setSelectedClient(null); setVaultUnlocked(false); }}
        >
          <div 
            className="vault-modal bg-white dark:bg-[#252A3A] rounded-3xl w-full max-w-lg p-9 shadow-2xl" 
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="font-semibold text-3xl tracking-tight">{selectedClient.name}</div>
                <div className="text-[#6B7280] mt-1">Secure Property Access Vault</div>
              </div>
              <button onClick={() => { setSelectedClient(null); setVaultUnlocked(false); }} className="text-4xl leading-none text-[#6B7280] hover:text-black">×</button>
            </div>

            {!vaultUnlocked ? (
              <>
                <p className="text-[#6B7280]">This sensitive information is protected. Enter your manager override code to reveal gate codes and key locations.</p>
                
                <input 
                  type="password" 
                  placeholder="Manager Code (try BEE2026)" 
                  className="mt-6 w-full border-2 focus:border-[#2D6A4F] rounded-2xl px-6 py-4 text-2xl tracking-[6px] font-mono outline-none"
                  value={vaultCode}
                  onChange={(e) => setVaultCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUnlockVault()}
                />
                
                <button 
                  onClick={handleUnlockVault}
                  className="mt-4 w-full py-4 rounded-2xl bg-[#2D6A4F] hover:bg-[#24543F] active:bg-[#1E4635] text-white font-semibold text-lg tracking-wider transition-colors"
                >
                  UNLOCK VAULT
                </button>
                <p className="text-center text-xs text-[#6B7280] mt-4">Demo code: BEE2026 or demo</p>
              </>
            ) : (
              <div className="space-y-7 text-[15px]">
                <div>
                  <div className="uppercase tracking-[2px] text-xs text-[#6B7280] mb-1.5">GATE PIN</div>
                  <div className="font-mono text-4xl font-semibold tracking-[3px] text-[#2D6A4F]">{selectedClient.gatePIN}</div>
                </div>
                <div>
                  <div className="uppercase tracking-[2px] text-xs text-[#6B7280] mb-1.5">GARAGE CODE</div>
                  <div className="font-mono text-4xl font-semibold tracking-[3px] text-[#2D6A4F]">{selectedClient.garageCode || '— Not set —'}</div>
                </div>
                <div>
                  <div className="uppercase tracking-[2px] text-xs text-[#6B7280] mb-1.5">KEY LOCATION</div>
                  <div className="leading-snug text-lg">{selectedClient.keyLocation}</div>
                </div>

                <button 
                  onClick={() => setVaultUnlocked(false)} 
                  className="mt-4 w-full py-3.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-2xl transition-colors"
                >
                  LOCK VAULT
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
