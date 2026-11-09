import React from 'react';
import { ShieldCheck, Zap, Droplets, Network, RefreshCw, Cpu, CheckCircle2, Activity, Lock, Layers, BarChart3, Scale, DollarSign, FileText } from 'lucide-react';
import { formatMetric } from '../utils/cmstEngine';

interface ProtocolStatusHeaderProps {
  totalMWhSaved: number;
  totalWaterSavedLiters: number;
  p99LatencyMs: number;
  throughputMOps: number;
  activeNodesCount: number;
  isRebalancing: boolean;
  onTriggerRebalance: () => void;
  onOpenPdfModal: () => void;
  onOpenDilithium?: () => void;
  onOpenSiliconMatrix?: () => void;
  onOpenAuditTimeline?: () => void;
  onOpenQuantumQuantization?: () => void;
  onOpenExecutiveBenchmark?: () => void;
  onOpenNotarialAudit?: () => void;
  onOpenZeroCapexRoi?: () => void;
  onOpenPqcSecurity?: () => void;
}

export const ProtocolStatusHeader: React.FC<ProtocolStatusHeaderProps> = ({
  totalMWhSaved,
  totalWaterSavedLiters,
  p99LatencyMs,
  throughputMOps,
  activeNodesCount,
  isRebalancing,
  onTriggerRebalance,
  onOpenPdfModal,
  onOpenDilithium,
  onOpenSiliconMatrix,
  onOpenAuditTimeline,
  onOpenQuantumQuantization,
  onOpenExecutiveBenchmark,
  onOpenNotarialAudit,
  onOpenZeroCapexRoi,
  onOpenPqcSecurity,
}) => {
  return (
    <div className="border-b border-slate-800 bg-slate-900/40 px-6 py-6">
      <div className="max-w-7xl mx-auto">
        {/* Top title and identity line */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-cyan-400 font-mono mb-1">
              <span>PROTOCOLO DESCENTRALIZADO PO-T-VS30</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>LATTICE BINARIO SOBERANO</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>CONSENSO SUB-MILISEGUNDO</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-emerald-400">CAPEX CERO ($0 USD)</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
              Consola de Optimización de Recursos T-VS30
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Capa de consenso sin intermediarios para infraestructuras críticas multi-región. Aceleración nativa RISC-V VMSB©, árbol CMST de latencia mínima, puente binario heterogéneo (NVIDIA, Intel, AMD, Google TPU, AWS Trainium, Maia, MTIA, Broadcom, TSMC), blindaje Dilithium-5 (NIST FIPS 204) y ZKP Circom.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
            {onOpenZeroCapexRoi && (
              <button
                onClick={onOpenZeroCapexRoi}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/60 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-sm"
              >
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>ROI Capex Cero (5 Años)</span>
              </button>
            )}
            {onOpenNotarialAudit && (
              <button
                onClick={onOpenNotarialAudit}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-300 bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800/60 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-sm"
              >
                <Scale className="w-3.5 h-3.5 text-rose-400" />
                <span>Fe Notarial (Anti-REA)</span>
              </button>
            )}
            {onOpenExecutiveBenchmark && (
              <button
                onClick={onOpenExecutiveBenchmark}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/60 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-sm"
              >
                <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Cuadro Ejecutivo C-Suite</span>
              </button>
            )}
            {onOpenPqcSecurity && (
              <button
                onClick={onOpenPqcSecurity}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/60 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Salud PQC & ZKP</span>
              </button>
            )}
            <button
              onClick={onTriggerRebalance}
              disabled={isRebalancing}
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-200 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isRebalancing ? 'animate-spin' : ''}`} />
              <span>{isRebalancing ? 'Reequilibrando CMST...' : 'Reequilibrar Árbol CMST'}</span>
            </button>
            <button
              onClick={onOpenPdfModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-amber-300 bg-amber-950/60 hover:bg-amber-900/60 border border-amber-800/60 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-sm"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Whitepaper & Certificados PDF</span>
            </button>
          </div>
        </div>

        {/* Banners: Dilithium PQC, Universal Silicon, Audit Timeline & Quantum Stress */}
        <div className="mb-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Banner 1: Dilithium PQC */}
          <div 
            onClick={onOpenPqcSecurity || onOpenDilithium}
            className="px-3 py-2.5 bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 rounded-lg flex items-center justify-between gap-2 text-xs font-mono cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2 text-slate-300 truncate">
              <span className="flex h-2 w-2 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-cyan-300">PQC DILITHIUM:</span>
              <span className="text-slate-400 truncate">NIST FIPS 204</span>
            </div>
            <span className="text-emerald-400 font-bold shrink-0">11.2 μs NTT</span>
          </div>

          {/* Banner 2: Universal Silicon Matrix */}
          <div 
            onClick={onOpenSiliconMatrix}
            className="px-3 py-2.5 bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 rounded-lg flex items-center justify-between gap-2 text-xs font-mono cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2 text-slate-300 truncate">
              <Cpu className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="font-semibold text-cyan-300">SILICIO VMSB©:</span>
              <span className="text-slate-400 truncate">9/9 Heterogéneo</span>
            </div>
            <span className="text-purple-400 font-bold shrink-0">108 ns ABI</span>
          </div>

          {/* Banner 3: Correlated Audit Timeline ZK */}
          <div 
            onClick={onOpenAuditTimeline}
            className="px-3 py-2.5 bg-slate-950/80 border border-slate-800 hover:border-emerald-500/40 rounded-lg flex items-center justify-between gap-2 text-xs font-mono cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2 text-slate-300 truncate">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="font-semibold text-emerald-300">AUDITORÍA ZK:</span>
              <span className="text-slate-400 truncate">Logs ↔ ZKP</span>
            </div>
            <span className="text-cyan-400 font-bold shrink-0">1.64 ms Δ</span>
          </div>

          {/* Banner 4: Quantum Quantization & Stress */}
          <div 
            onClick={onOpenQuantumQuantization}
            className="px-3 py-2.5 bg-slate-950/80 border border-slate-800 hover:border-purple-500/40 rounded-lg flex items-center justify-between gap-2 text-xs font-mono cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2 text-slate-300 truncate">
              <Layers className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span className="font-semibold text-purple-300">QUANT & ESTRÉS:</span>
              <span className="text-slate-400 truncate">VMSB-FQ©</span>
            </div>
            <span className="text-emerald-400 font-bold shrink-0">NIST L5 Inmune</span>
          </div>
        </div>

        {/* Dense telemetry summary strip */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* KPI 1: Latencia p99 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Latencia Global (p99)</span>
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-xl font-bold text-cyan-300 font-mono tabular-nums">
              {p99LatencyMs.toFixed(2)} ms
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Target &lt; 0.40 ms · Óptimo
            </div>
          </div>

          {/* KPI 2: Rendimiento / Throughput */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Throughput Kafka</span>
              <Network className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-xl font-bold text-white font-mono tabular-nums">
              {throughputMOps.toFixed(1)} M
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              ops/seg · Zero-Copy C++
            </div>
          </div>

          {/* KPI 3: Ahorro Energético */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Energía Ahorrada</span>
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-emerald-300 font-mono tabular-nums">
              {totalMWhSaved.toFixed(1)} MWh
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              PUE 1.07 (Base 1.48)
            </div>
          </div>

          {/* KPI 4: Ahorro Hídrico */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Agua Refrigeración</span>
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-xl font-bold text-cyan-300 font-mono tabular-nums">
              {(totalWaterSavedLiters / 1000).toFixed(1)}k L
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              WUE mitigado dinámico
            </div>
          </div>

          {/* KPI 5: Capex Cero */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Inversión Hardware</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-emerald-400 font-mono tabular-nums">
              $0.00 USD
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              100% Algorítmico · Capex Cero
            </div>
          </div>

          {/* KPI 6: Nodos & Arquitectura */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Nodos Activos</span>
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-xl font-bold text-white font-mono tabular-nums">
              {activeNodesCount} / 6
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              RISC-V-vmsb© & BFT
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
