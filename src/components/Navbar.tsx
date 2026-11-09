import React from 'react';
import { ShieldCheck, FileDown, Activity, Cpu, TreePine, Droplet, Layers, Lock, Sparkles, BarChart3, Scale, DollarSign } from 'lucide-react';

interface NavbarProps {
  activeTab: 'topology' | 'executive_benchmark' | 'zero_capex_roi' | 'pqc_security' | 'predictive' | 'heatmap' | 'telemetry' | 'green' | 'dilithium' | 'silicon_matrix' | 'audit_timeline' | 'quantum_quantization' | 'notarial_audit' | 'legal' | 'cpp_mesh';
  setActiveTab: (tab: 'topology' | 'executive_benchmark' | 'zero_capex_roi' | 'pqc_security' | 'predictive' | 'heatmap' | 'telemetry' | 'green' | 'dilithium' | 'silicon_matrix' | 'audit_timeline' | 'quantum_quantization' | 'notarial_audit' | 'legal' | 'cpp_mesh') => void;
  onOpenPdfModal: () => void;
  onOpenController: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenPdfModal,
  onOpenController,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/95 backdrop-blur-md">
      <div className="flex items-center justify-between gap-6 px-6 py-3.5 max-w-7xl mx-auto">
        {/* Zone 1: Wordmark in single text element */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-sm tracking-wider">
            30
          </div>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('topology');
            }}
            className="text-base font-bold tracking-tight text-white whitespace-nowrap hover:text-cyan-400 transition-colors"
          >
            T-VS30 PROTOCOL
          </a>
        </div>

        {/* Zone 2: Navigation links */}
        <nav className="hidden lg:flex items-center gap-4 text-xs font-medium text-slate-400 overflow-x-auto">
          <button
            onClick={() => setActiveTab('topology')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'topology'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            Topología CMST
          </button>
          <button
            onClick={() => setActiveTab('executive_benchmark')}
            className={`whitespace-nowrap transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'executive_benchmark'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'hover:text-cyan-300 text-slate-300'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold text-white">Cuadro Ejecutivo</span>
            <span className="px-1 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">C-Suite</span>
          </button>
          <button
            onClick={() => setActiveTab('zero_capex_roi')}
            className={`whitespace-nowrap transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'zero_capex_roi'
                ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                : 'hover:text-emerald-300 text-slate-300'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-white">Calculadora ROI</span>
            <span className="px-1 py-0.2 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">Capex $0</span>
          </button>
          <button
            onClick={() => setActiveTab('predictive')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'predictive'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            Predicción Carga
          </button>
          <button
            onClick={() => setActiveTab('heatmap')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'heatmap'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            Mapa Calor (ZKP)
          </button>
          <button
            onClick={() => setActiveTab('pqc_security')}
            className={`whitespace-nowrap transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'pqc_security'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'hover:text-cyan-300 text-slate-300'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold text-white">Seguridad PQC & ZKP</span>
            <span className="px-1 py-0.2 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">NIST-L5</span>
          </button>
          <button
            onClick={() => setActiveTab('dilithium')}
            className={`whitespace-nowrap transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'dilithium'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'hover:text-cyan-300 text-slate-300'
            }`}
          >
            <Lock className="w-3 h-3 text-cyan-400" />
            <span>Dilithium VMSB©</span>
          </button>
          <button
            onClick={() => setActiveTab('silicon_matrix')}
            className={`whitespace-nowrap transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'silicon_matrix'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'hover:text-cyan-300 text-slate-300'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold text-white">Silicio VMSB©</span>
            <span className="px-1 py-0.2 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">9/9</span>
          </button>
          <button
            onClick={() => setActiveTab('audit_timeline')}
            className={`whitespace-nowrap transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'audit_timeline'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'hover:text-cyan-300 text-slate-300'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-white">Línea Auditoría ZK</span>
          </button>
          <button
            onClick={() => setActiveTab('quantum_quantization')}
            className={`whitespace-nowrap transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'quantum_quantization'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'hover:text-cyan-300 text-slate-300'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold text-white">Quant & Estrés</span>
            <span className="px-1 py-0.2 rounded text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">NIST-L5</span>
          </button>
          <button
            onClick={() => setActiveTab('notarial_audit')}
            className={`whitespace-nowrap transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'notarial_audit'
                ? 'text-rose-400 border-b-2 border-rose-400 font-semibold'
                : 'hover:text-rose-300 text-slate-300'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-rose-400" />
            <span className="font-semibold text-white">Auditoría Notarial</span>
            <span className="px-1 py-0.2 rounded text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">Anti-REA</span>
          </button>
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'telemetry'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            Telemetría Micro
          </button>
          <button
            onClick={() => setActiveTab('green')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'green'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            Ahorro Agua & Energía
          </button>
          <button
            onClick={() => setActiveTab('legal')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'legal'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            Amparo Legal
          </button>
          <button
            onClick={() => setActiveTab('cpp_mesh')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'cpp_mesh'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            Librería C++
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenController}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-800 hover:text-white transition-colors whitespace-nowrap"
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Motor VMSB©</span>
          </button>

          <button
            onClick={onOpenPdfModal}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-amber-500/20 cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Whitepaper & Certificados PDF</span>
          </button>
        </div>
      </div>

      {/* Mobile nav bar row */}
      <div className="lg:hidden flex items-center justify-between overflow-x-auto px-4 py-2 border-t border-slate-900 text-xs text-slate-400 gap-4">
        <button
          onClick={() => setActiveTab('topology')}
          className={`whitespace-nowrap ${activeTab === 'topology' ? 'text-cyan-400 font-semibold' : ''}`}
        >
          Topología CMST
        </button>
        <button
          onClick={() => setActiveTab('executive_benchmark')}
          className={`whitespace-nowrap flex items-center gap-1 ${activeTab === 'executive_benchmark' ? 'text-cyan-400 font-semibold' : 'text-slate-300'}`}
        >
          <BarChart3 className="w-3 h-3 text-cyan-400" />
          <span>Cuadro Ejecutivo</span>
        </button>
        <button
          onClick={() => setActiveTab('zero_capex_roi')}
          className={`whitespace-nowrap flex items-center gap-1 ${activeTab === 'zero_capex_roi' ? 'text-emerald-400 font-semibold' : 'text-slate-300'}`}
        >
          <DollarSign className="w-3 h-3 text-emerald-400" />
          <span>Calculadora ROI</span>
        </button>
        <button
          onClick={() => setActiveTab('predictive')}
          className={`whitespace-nowrap ${activeTab === 'predictive' ? 'text-cyan-400 font-semibold' : ''}`}
        >
          Predicción
        </button>
        <button
          onClick={() => setActiveTab('heatmap')}
          className={`whitespace-nowrap ${activeTab === 'heatmap' ? 'text-cyan-400 font-semibold' : ''}`}
        >
          Mapa Calor
        </button>
        <button
          onClick={() => setActiveTab('pqc_security')}
          className={`whitespace-nowrap flex items-center gap-1 ${activeTab === 'pqc_security' ? 'text-cyan-400 font-semibold' : 'text-slate-300'}`}
        >
          <ShieldCheck className="w-3 h-3 text-cyan-400" />
          <span>Seguridad PQC & ZKP</span>
        </button>
        <button
          onClick={() => setActiveTab('dilithium')}
          className={`whitespace-nowrap flex items-center gap-1 ${activeTab === 'dilithium' ? 'text-cyan-400 font-semibold' : 'text-slate-300'}`}
        >
          <Lock className="w-3 h-3 text-cyan-400" />
          <span>Dilithium</span>
        </button>
        <button
          onClick={() => setActiveTab('silicon_matrix')}
          className={`whitespace-nowrap flex items-center gap-1 ${activeTab === 'silicon_matrix' ? 'text-cyan-400 font-semibold' : 'text-slate-300'}`}
        >
          <Cpu className="w-3 h-3 text-cyan-400" />
          <span>Silicio VMSB© (9/9)</span>
        </button>
        <button
          onClick={() => setActiveTab('audit_timeline')}
          className={`whitespace-nowrap flex items-center gap-1 ${activeTab === 'audit_timeline' ? 'text-cyan-400 font-semibold' : 'text-slate-300'}`}
        >
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>Auditoría ZK</span>
        </button>
        <button
          onClick={() => setActiveTab('quantum_quantization')}
          className={`whitespace-nowrap flex items-center gap-1 ${activeTab === 'quantum_quantization' ? 'text-cyan-400 font-semibold' : 'text-slate-300'}`}
        >
          <Layers className="w-3 h-3 text-cyan-400" />
          <span>Quant & Estrés</span>
        </button>
        <button
          onClick={() => setActiveTab('notarial_audit')}
          className={`whitespace-nowrap flex items-center gap-1 ${activeTab === 'notarial_audit' ? 'text-rose-400 font-semibold' : 'text-slate-300'}`}
        >
          <Scale className="w-3 h-3 text-rose-400" />
          <span>Auditoría Notarial</span>
        </button>
        <button
          onClick={() => setActiveTab('telemetry')}
          className={`whitespace-nowrap ${activeTab === 'telemetry' ? 'text-cyan-400 font-semibold' : ''}`}
        >
          Telemetría
        </button>
        <button
          onClick={() => setActiveTab('green')}
          className={`whitespace-nowrap ${activeTab === 'green' ? 'text-cyan-400 font-semibold' : ''}`}
        >
          Agua & Energía
        </button>
        <button
          onClick={() => setActiveTab('legal')}
          className={`whitespace-nowrap ${activeTab === 'legal' ? 'text-cyan-400 font-semibold' : ''}`}
        >
          Amparo Legal
        </button>
        <button
          onClick={() => setActiveTab('cpp_mesh')}
          className={`whitespace-nowrap ${activeTab === 'cpp_mesh' ? 'text-cyan-400 font-semibold' : ''}`}
        >
          Librería C++
        </button>
      </div>
    </header>
  );
};
