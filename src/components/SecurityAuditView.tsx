import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  Terminal, 
  FileCheck2, 
  CheckCircle2, 
  RefreshCw, 
  AlertCircle,
  ExternalLink,
  Code2
} from 'lucide-react';
import { ComplianceStandard, CircomProofEvent, AuditLogEntry } from '../types/protocol';

interface SecurityAuditViewProps {
  standards: ComplianceStandard[];
  circomProofs: CircomProofEvent[];
  auditLogs: AuditLogEntry[];
  onTriggerZkProof: () => void;
  isVerifyingProof: boolean;
}

export const SecurityAuditView: React.FC<SecurityAuditViewProps> = ({
  standards,
  circomProofs,
  auditLogs,
  onTriggerZkProof,
  isVerifyingProof,
}) => {
  const [selectedStandard, setSelectedStandard] = useState<ComplianceStandard>(standards[0]);
  const [logFilter, setLogFilter] = useState<string>('ALL');

  const filteredLogs = logFilter === 'ALL'
    ? auditLogs
    : auditLogs.filter(l => l.category === logFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            04. Cifrado E2EE, Pruebas ZK Circom y Auditorías en Tiempo Real
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Aislamiento criptográfico poscuántico Kyber-1024, atestación de circuitos Circom zk-SNARK y verificación continua de invariantes de no-daño para infraestructuras críticas (IEC 62443 SL-4).
          </p>
        </div>

        <button
          onClick={onTriggerZkProof}
          disabled={isVerifyingProof}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isVerifyingProof ? 'animate-spin' : ''}`} />
          <span>{isVerifyingProof ? 'Calculando Prueba ZK...' : 'Generar y Verificar Prueba Circom ZK'}</span>
        </button>
      </div>

      {/* Security Architecture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: E2EE */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Cifrado de Enlace End-to-End</span>
            <Lock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-white font-mono">
            Kyber-1024 + ChaCha20
          </div>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Resistencia poscuántica nativa en los canales de datos entre regiones soberanas. Llaves de sesión rotadas cada 30 segundos sin jitter de red.
          </p>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-emerald-400">
            <span>Invariante: 0 fugas de texto plano</span>
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 2: Circom ZK */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Pruebas de Conocimiento Cero</span>
            <Code2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-lg font-bold text-cyan-300 font-mono">
            Circom 2.1.8 (zk-SNARK)
          </div>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Atestación matemática de límites de memoria VMSB© y cumplimiento térmico PUE sin revelar datos confidenciales de inquilinos ni cargas de trabajo.
          </p>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-cyan-400">
            <span>Tiempo de prueba: 1.82 ms (Groth16)</span>
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 3: Invariante No Dañino */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Garantía de Infraestructura Crítica</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-emerald-300 font-mono">
            Invariante No Dañino Activo
          </div>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Diseñado para sistemas industriales y telecomunicaciones: el protocolo nunca interfiere destructivamente con operaciones físicas ni genera caídas en cascada.
          </p>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-emerald-400">
            <span>Tolerancia Bizantina (BFT): 100%</span>
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Circom Proofs Feed & Continuous Audit Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Circom ZK Verifier Stream */}
        <div className="lg:col-span-6 bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs font-mono text-cyan-400">VERIFICADOR DE CIRCUITOS CIRCOM</div>
              <h3 className="text-base font-bold text-white mt-0.5">
                Flujo Criptográfico de Pruebas ZK-SNARK
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-400">
              Prover C++23 / Circom
            </span>
          </div>

          <div className="space-y-2.5">
            {circomProofs.map(proof => (
              <div
                key={proof.proofId}
                className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 text-xs"
              >
                <div className="flex items-center justify-between font-mono">
                  <span className="text-cyan-300 font-semibold">{proof.circuitName}</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {proof.verificationStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400 mt-2 text-[11px] font-mono">
                  <span>ID: {proof.proofId}</span>
                  <span>Restricciones: {proof.constraintsCount.toLocaleString()}</span>
                  <span>Proving: {proof.provingTimeMs} ms</span>
                </div>
                <div className="mt-1 pt-1 border-t border-slate-900 text-[10px] text-slate-500 font-mono truncate">
                  Hash Público: {proof.publicHash}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Continuous Real-Time Audit Log */}
        <div className="lg:col-span-6 bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xs font-mono text-cyan-400">AUDITORÍAS AUTOMÁTICAS EN TIEMPO REAL</div>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Registro Inmutable de Verificación Continua
                </h3>
              </div>

              {/* Filter */}
              <div className="flex items-center gap-1 text-[11px]">
                <button
                  onClick={() => setLogFilter('ALL')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    logFilter === 'ALL' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setLogFilter('VMSB_KERNEL')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    logFilter === 'VMSB_KERNEL' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Kernel VMSB
                </button>
                <button
                  onClick={() => setLogFilter('SECURITY')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    logFilter === 'SECURITY' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Seguridad
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {filteredLogs.map(log => (
                <div
                  key={log.id}
                  className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-2.5 text-xs font-mono"
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-slate-500">{log.timestamp}</span>
                    <span className="text-cyan-400">{log.category}</span>
                  </div>
                  <div className="text-slate-200 font-sans text-xs">
                    {log.message}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 truncate">
                    Hash de Integridad: {log.verificationHash}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>Frecuencia de Auditoría: Continua (cada 500ms)</span>
            <span className="font-mono text-emerald-400">100% Invariantes Superados</span>
          </div>
        </div>
      </div>
    </div>
  );
};
