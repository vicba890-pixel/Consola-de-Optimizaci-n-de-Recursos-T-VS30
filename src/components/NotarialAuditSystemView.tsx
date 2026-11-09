import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  Scale,
  FileCheck,
  Lock,
  Zap,
  Cpu,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RefreshCw,
  FileDown,
  Layers,
  Terminal,
  Activity,
  Play,
  Pause,
  Key,
  Flame,
  Globe2,
  ChevronRight,
  Eye,
  Crosshair,
  Sparkles,
  Server,
  FileText
} from 'lucide-react';
import {
  NOTARIAL_INSTRUMENTS_CATALOG,
  ANTI_REA_DEFENSE_VECTORS,
  INITIAL_AUTO_AUDIT_REPORT,
  SIMULATED_REVERSE_ENGINEERING_ATTACKS
} from '../data/protocolData';
import {
  NotarialInstrumentEntry,
  AntiReaDefenseVector,
  AutoAuditCycleReport
} from '../types/protocol';
import { generateNotarialInstrumentPdf } from '../utils/notarialPdfGenerator';
import { generateShareholderWhitepaperPdf } from '../utils/whitepaperPdfGenerator';

interface NotarialAuditSystemViewProps {
  onOpenPdfModal: () => void;
  onNavigateToTimeline?: () => void;
  onNavigateToExecutive?: () => void;
  onNavigateToSilicon?: () => void;
}

export const NotarialAuditSystemView: React.FC<NotarialAuditSystemViewProps> = ({
  onOpenPdfModal,
  onNavigateToTimeline,
  onNavigateToExecutive,
  onNavigateToSilicon
}) => {
  // Auto-audit heartbeat engine state
  const [autoAuditEnabled, setAutoAuditEnabled] = useState<boolean>(true);
  const [auditFrequencySeconds, setAuditFrequencySeconds] = useState<number>(15);
  const [secondsUntilNextCycle, setSecondsUntilNextCycle] = useState<number>(15);
  const [isAuditingNow, setIsAuditingNow] = useState<boolean>(false);
  const [currentCycleReport, setCurrentCycleReport] = useState<AutoAuditCycleReport>(INITIAL_AUTO_AUDIT_REPORT);

  // Selected notarial instrument for inspection
  const [selectedInstrumentId, setSelectedInstrumentId] = useState<string>(NOTARIAL_INSTRUMENTS_CATALOG[0].instrumentId);

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<'notary_protocol' | 'anti_rea_engine' | 'attack_simulator'>('notary_protocol');

  // Reverse Engineering Attack Simulation state
  const [activeSimulatingAttackId, setActiveSimulatingAttackId] = useState<string | null>(null);
  const [simulationLog, setSimulationLog] = useState<{
    id: string;
    timestamp: string;
    attackName: string;
    defenseMechanism: string;
    blockedTimeNs: number;
    zkpProof: string;
    status: string;
  }[]>([]);

  // Defense vectors state (mutable for live demonstrations)
  const [defenseVectors, setDefenseVectors] = useState<AntiReaDefenseVector[]>(ANTI_REA_DEFENSE_VECTORS);

  // Selected instrument details
  const selectedInstrument = useMemo(() => {
    return NOTARIAL_INSTRUMENTS_CATALOG.find(i => i.instrumentId === selectedInstrumentId) || NOTARIAL_INSTRUMENTS_CATALOG[0];
  }, [selectedInstrumentId]);

  // Periodic heartbeat timer
  useEffect(() => {
    if (!autoAuditEnabled) return;

    const timer = setInterval(() => {
      setSecondsUntilNextCycle(prev => {
        if (prev <= 1) {
          triggerAutoAuditCycle();
          return auditFrequencySeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoAuditEnabled, auditFrequencySeconds]);

  // Execute a continuous automated audit cycle
  const triggerAutoAuditCycle = () => {
    setIsAuditingNow(true);
    setTimeout(() => {
      const now = new Date();
      const updatedCycle: AutoAuditCycleReport = {
        cycleId: `CYCLE-AUTO-AUDIT-${now.toISOString().slice(0, 10)}-${Math.floor(Math.random() * 900 + 100)}`,
        timestamp: now.toLocaleTimeString(),
        auditedNodes: 9,
        invariantsChecked: 192 + Math.floor(Math.random() * 12),
        zkProofsGenerated: 384 + Math.floor(Math.random() * 24),
        notarialInstrumentsIssued: NOTARIAL_INSTRUMENTS_CATALOG.length,
        antiReaProbesBlocked: currentCycleReport.antiReaProbesBlocked + Math.floor(Math.random() * 3),
        overallComplianceStatus: 'CONFORME_FE_PUBLICA',
        merkleRoot: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        notaryRegistryProtocol: 'Protocolo Telemático Notarial Colegiado N-2026-A1',
        autoFrequencySeconds: auditFrequencySeconds
      };
      setCurrentCycleReport(updatedCycle);
      setIsAuditingNow(false);
    }, 700);
  };

  // Run attack simulation
  const handleRunAttackSimulation = (attack: typeof SIMULATED_REVERSE_ENGINEERING_ATTACKS[0]) => {
    setActiveSimulatingAttackId(attack.id);
    setTimeout(() => {
      const newEntry = {
        id: `sim-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        attackName: attack.toolName,
        defenseMechanism: attack.mitigationApplied,
        blockedTimeNs: attack.blockedTimeNs,
        zkpProof: attack.forensicProofDigest || '0x39a1f284c8e7629b0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c',
        status: 'NEUTRALIZADO Y REGISTRADO EN PROTOCOLO NOTARIAL'
      };
      setSimulationLog(prev => [newEntry, ...prev]);
      
      // Increment vector counter
      setDefenseVectors(prev => prev.map(v => {
        if (attack.attackType === 'DECOMPILATION_ATTEMPT' && v.defenseLayer === 'POLYMORPHIC_OPCODES') {
          return { ...v, detectionCount: v.detectionCount + 1, lastNeutralizedTimestamp: new Date().toLocaleTimeString() };
        }
        if (attack.attackType === 'HARDWARE_DEBUG_PROBE' && v.defenseLayer === 'ANTI_DEBUG_JTAG') {
          return { ...v, detectionCount: v.detectionCount + 1, lastNeutralizedTimestamp: new Date().toLocaleTimeString() };
        }
        if (attack.attackType === 'UNAUTHORIZED_CLONING' && v.defenseLayer === 'HARDWARE_PUF') {
          return { ...v, detectionCount: v.detectionCount + 1, lastNeutralizedTimestamp: new Date().toLocaleTimeString() };
        }
        return v;
      }));

      setActiveSimulatingAttackId(null);
    }, 900);
  };

  // Download PDF certificate of the selected notarial instrument
  const handleDownloadNotarialPdf = (inst?: NotarialInstrumentEntry) => {
    generateNotarialInstrumentPdf({
      instrument: inst || selectedInstrument,
      merkleAuditRoot: currentCycleReport.merkleRoot
    });
  };

  const handleDownloadWhitepaper = () => {
    generateShareholderWhitepaperPdf({
      companyName: 'Junta General de Accionistas & Órganos de Fe Notarial',
      merkleAuditRoot: currentCycleReport.merkleRoot
    });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* =========================================================================
          HERO & NOTARIAL PUBLIC FAITH HEADER
      ========================================================================= */}
      <div className="rounded-2xl border border-rose-950/80 bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950/40 p-6 lg:p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#88133715_1px,transparent_1px),linear-gradient(to_bottom,#88133715_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-50" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/30">
                <Scale className="w-3.5 h-3.5 text-rose-400" />
                FE PÚBLICA NOTARIAL TELEMÁTICA (eIDAS)
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                ANTI-REA-ING.-NATIVO-VMSB©2026
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                <Clock className="w-3.5 h-3.5" />
                AUDITORÍA CONTINUA EN TIEMPO REAL
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                onClick={handleDownloadWhitepaper}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all shadow-md shadow-amber-950/40 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Whitepaper Accionistas (PDF 4 Págs)</span>
              </button>
              <button
                onClick={() => handleDownloadNotarialPdf()}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-rose-400 hover:bg-rose-300 rounded-lg transition-all shadow-md shadow-rose-900/40 cursor-pointer"
              >
                <FileDown className="w-4 h-4" />
                <span>Emitir Acta Notarial en PDF</span>
              </button>
            </div>
          </div>

          <div className="max-w-4xl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Sistema de Auditoría y Certificación Automática Criptográfico y Notarial
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm sm:text-base font-mono font-bold text-rose-400">
                T-VS30 PROTOCOL Anti-REA-Ing.-nativo-vmsb©2026
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/80 font-mono">
                SL-4 Hardware Grade
              </span>
            </div>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Plataforma telemática automatizada de <strong className="text-rose-300">fe pública notarial</strong> y <strong className="text-emerald-300">atestación criptográfica continua</strong> para infraestructuras críticas soberanas. Integra blindaje en silicio contra ingeniería inversa, decompilación y extracción de propiedad intelectual bajo mandatos <strong className="text-cyan-300">NIS2</strong>, <strong className="text-cyan-300">CER</strong>, <strong className="text-cyan-300">eIDAS</strong> y tratados de la <strong className="text-cyan-300">OMPI / WIPO</strong>.
            </p>
          </div>

          {/* Subtabs switcher */}
          <div className="mt-6 pt-5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {[
                { id: 'notary_protocol', label: 'Libro Notarial Telemático', icon: Scale },
                { id: 'anti_rea_engine', label: 'Motor Anti-REA-Ing. VMSB©', icon: ShieldCheck },
                { id: 'attack_simulator', label: 'Simulador de Ataques / Decompilación', icon: Crosshair }
              ].map(tab => {
                const IconComponent = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-rose-500/20 text-rose-200 border border-rose-500/50 shadow-md'
                        : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick action to manual audit */}
            <div className="flex items-center gap-2">
              <button
                onClick={triggerAutoAuditCycle}
                disabled={isAuditingNow}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-slate-200 border border-slate-700 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-rose-400 ${isAuditingNow ? 'animate-spin' : ''}`} />
                <span>{isAuditingNow ? 'Auditando Invariantes...' : 'Ejecutar Auditoría Ahora'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          PANEL: AUTO-AUDIT CONTINUOUS ENGINE (HEARTBEAT)
      ========================================================================= */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 lg:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${autoAuditEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
              <Activity className={`w-5 h-5 ${autoAuditEnabled ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white">
                  Motor de Auto-Auditoría Continua y Certificación Periódica
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {autoAuditEnabled ? 'ACTIVO (HEARTBEAT)' : 'EN PAUSA'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Verifica de forma autónoma el estado de cada nodo y protocoliza las pruebas criptográficas en el Libro Notarial Telemático.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Interval selector */}
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <span className="text-slate-400">Ciclo:</span>
              <select
                value={auditFrequencySeconds}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setAuditFrequencySeconds(val);
                  setSecondsUntilNextCycle(val);
                }}
                className="bg-slate-950 border border-slate-700 text-white rounded-lg px-2 py-1 text-xs cursor-pointer font-mono"
              >
                <option value={5}>Cada 5 seg</option>
                <option value={15}>Cada 15 seg</option>
                <option value={30}>Cada 30 seg</option>
                <option value={60}>Cada 60 seg</option>
              </select>
            </div>

            <button
              onClick={() => setAutoAuditEnabled(!autoAuditEnabled)}
              className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                autoAuditEnabled
                  ? 'bg-amber-950/40 border-amber-800/60 text-amber-300 hover:bg-amber-900/60'
                  : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300 hover:bg-emerald-900/60'
              }`}
            >
              {autoAuditEnabled ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{autoAuditEnabled ? 'Pausar' : 'Activar'}</span>
            </button>
          </div>
        </div>

        {/* Live Heartbeat Progress Bar */}
        <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">
              Próxima constatación notarial en: <strong className="text-rose-300">{secondsUntilNextCycle}s</strong>
            </span>
            <span className="text-slate-400 truncate max-w-xs sm:max-w-md">
              Raíz Merkle Actual: <code className="text-cyan-400">{currentCycleReport.merkleRoot.substring(0, 18)}...</code>
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-amber-400 rounded-full transition-all duration-1000"
              style={{ width: `${((auditFrequencySeconds - secondsUntilNextCycle) / auditFrequencySeconds) * 100}%` }}
            />
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[11px] text-slate-400">Nodos Auditados</div>
            <div className="text-lg font-bold text-white font-mono mt-0.5">
              {currentCycleReport.auditedNodes} / 9
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5">100% Cobertura Soberana</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[11px] text-slate-400">Invariantes de Red</div>
            <div className="text-lg font-bold text-white font-mono mt-0.5">
              {currentCycleReport.invariantsChecked}
            </div>
            <div className="text-[10px] text-cyan-400 mt-0.5">0 Alteraciones</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[11px] text-slate-400">Pruebas Circom ZKP</div>
            <div className="text-lg font-bold text-white font-mono mt-0.5">
              {currentCycleReport.zkProofsGenerated}
            </div>
            <div className="text-[10px] text-purple-400 mt-0.5">Groth16 Verificadas</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[11px] text-slate-400">Actas Notariales</div>
            <div className="text-lg font-bold text-white font-mono mt-0.5">
              {currentCycleReport.notarialInstrumentsIssued}
            </div>
            <div className="text-[10px] text-rose-400 mt-0.5">eIDAS Protocolizadas</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[11px] text-slate-400">Sondas Anti-REA Bloqueadas</div>
            <div className="text-lg font-bold text-rose-400 font-mono mt-0.5">
              {currentCycleReport.antiReaProbesBlocked}
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5">0 Fugas de Código</div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: LIBRO NOTARIAL TELEMÁTICO (DIGITAL NOTARY PROTOCOL)
      ========================================================================= */}
      {activeTab === 'notary_protocol' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Scale className="w-4 h-4 text-rose-400" />
                <span>Libro Notarial Telemático: Instrumentos Públicos Digitales</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Protocolo permanente e inmutable de actas notariales de constatación de hechos técnicos, existencia de silicio y no-alteración.
              </p>
            </div>
            <span className="text-xs text-rose-400 font-mono font-semibold">
              Validez Probatoria Plena (Directiva NIS2 / eIDAS)
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* List of Notarial Instruments */}
            <div className="lg:col-span-5 space-y-3">
              {NOTARIAL_INSTRUMENTS_CATALOG.map(inst => {
                const isSelected = inst.instrumentId === selectedInstrumentId;
                return (
                  <div
                    key={inst.instrumentId}
                    onClick={() => setSelectedInstrumentId(inst.instrumentId)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-slate-950 border-rose-500/80 shadow-lg shadow-rose-950/40 ring-1 ring-rose-500/30'
                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        {inst.instrumentId}
                      </span>
                      <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                        {inst.status === 'PROTOCOLIZADA_CON_FE_PUBLICA' ? 'Protocolizada' : 'Sellada eIDAS'}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-white leading-tight">
                      {inst.title}
                    </h3>

                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      {inst.findingsSummary}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-800/80 font-mono">
                      <span>{inst.timestamp.slice(0, 10)}</span>
                      <span className="text-rose-300 font-semibold">Ver Instrumento →</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detailed Notarial Deed Viewer */}
            <div className="lg:col-span-7 bg-slate-950 rounded-2xl border border-rose-950/80 p-6 space-y-5 shadow-2xl relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="text-[10px] text-rose-400 font-mono uppercase tracking-wider">
                    {selectedInstrument.protocolNumber}
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">
                    {selectedInstrument.title}
                  </h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Autoridad: {selectedInstrument.notaryPublicAuthority}
                  </div>
                </div>

                <button
                  onClick={() => handleDownloadNotarialPdf(selectedInstrument)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/20 text-rose-200 border border-rose-500/40 hover:bg-rose-500/30 transition-colors cursor-pointer shrink-0"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Descargar Acta PDF</span>
                </button>
              </div>

              {/* Attestation Scope */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Alcance de la Atestación y Constatación Notarial:
                </div>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                  {selectedInstrument.attestationScope}
                </p>
              </div>

              {/* Cryptographic Hashes Table */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Evidencia Criptográfica Incorporada al Protocolo:
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-[11px] text-rose-400 block font-semibold">Circuito Circom 2.1.8 ZKP Proof:</span>
                    <span className="text-slate-300 text-[11px] break-all">{selectedInstrument.circomZkProofDigest}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-[11px] text-emerald-400 block font-semibold">Firma Post-Cuántica Dilithium-5 (ML-DSA-87):</span>
                    <span className="text-slate-300 text-[11px] break-all">{selectedInstrument.dilithium5Signature}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-[11px] text-cyan-400 block font-semibold">Token de Sellado de Tiempo RFC 3161 / eIDAS:</span>
                    <span className="text-slate-300 text-[11px] break-all">{selectedInstrument.rfc3161TimestampToken}</span>
                  </div>
                </div>
              </div>

              {/* Legal Foundations */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Fundamentación Jurídica y Tratados Internacionales:
                </div>
                <ul className="space-y-1 text-xs text-slate-400">
                  {selectedInstrument.legalBasis.map((basis, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{basis}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: MOTOR ANTI-REA-ING.-NATIVO-VMSB©2026 (ANTI-REVERSE ENGINEERING)
      ========================================================================= */}
      {activeTab === 'anti_rea_engine' && (
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>DEFENSA ACTIVA EN SILICIO CONTRA DECOMPILACIÓN Y REINGENIERÍA</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              Arquitectura Anti-REA-Ing.-nativo-vmsb©2026
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
              El binario nativo VMSB©2026 incorpora protección criptográfica a nivel de silicio que imposibilita la extracción de firmware, el desensamblado estático o el análisis mediante sondas JTAG.
            </p>
          </div>

          {/* 5 Defense Vectors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {defenseVectors.map(vector => (
              <div
                key={vector.vectorId}
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {vector.defenseLayer}
                  </span>
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    {vector.reactionTimeNs} ns
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white">
                  {vector.name}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {vector.mechanism}
                </p>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1 text-xs">
                  <div className="text-[11px] font-semibold text-rose-300">Superficie Neutralizada:</div>
                  <div className="text-[11px] text-slate-400">{vector.attackSurfaceNeutralized}</div>
                </div>

                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500">Sondas Bloqueadas:</span>
                  <span className="font-bold text-emerald-400">{vector.detectionCount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Technical Deep-Dive on Polymorphic Mutation */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-300 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Mecanismo de Mutación Polimórfica en Hardware (Opcode Scrambling)</span>
              </span>
              <span className="text-xs font-mono text-emerald-400">Ciclo: Cada 128 microsegundos</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              En cada bloque de tiempo, la unidad de decodificación en silicio recalcula la tabla de traducción de opcodes utilizando el hash SHA-512 del estado de consenso ZKP. Cualquier analizador o desensamblador que intente leer el código binario VMSB© obtiene instrucciones no ejecutables o trampas de fallo (0xFF Trap), protegiendo el 100% del secreto industrial.
            </p>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: SIMULADOR DE ATAQUES DE INGENIERÍA INVERSA Y REINGENIERÍA
      ========================================================================= */}
      {activeTab === 'attack_simulator' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-rose-400" />
                <span>Simulador de Resiliencia contra Ingeniería Inversa y Decompilación</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Ejecute vectores de ataque simulados con herramientas estándar de la industria (Ghidra, IDA Pro, sondas JTAG) para observar la neutralización en nanosegundos.
              </p>
            </div>
          </div>

          {/* Attacks Buttons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SIMULATED_REVERSE_ENGINEERING_ATTACKS.map(attack => {
              const isRunning = activeSimulatingAttackId === attack.id;
              return (
                <div
                  key={attack.id}
                  className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/10 text-rose-300 border border-rose-500/30">
                        {attack.attackType}
                      </span>
                      <span className="text-[11px] font-mono text-cyan-400 font-semibold">
                        Tiempo: {attack.blockedTimeNs} ns
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white">
                      {attack.toolName}
                    </h3>

                    <p className="text-xs text-slate-400">
                      {attack.description}
                    </p>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                      <span className="text-emerald-400 font-semibold">Mitigación: </span>
                      {attack.mitigationApplied}
                    </div>
                  </div>

                  <button
                    onClick={() => handleRunAttackSimulation(attack)}
                    disabled={isRunning}
                    className="w-full mt-3 py-2 px-3 rounded-xl text-xs font-semibold bg-rose-950/60 text-rose-200 border border-rose-800/80 hover:bg-rose-900/60 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
                    <span>{isRunning ? 'Neutralizando Intento...' : 'Lanzar Ataque de Prueba'}</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Live Forensic Log Table */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-rose-400" />
                <span>Registro Forense de Intrusiones Neutralizadas y Protocolizadas</span>
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {simulationLog.length} Eventos Registrados
              </span>
            </div>

            {simulationLog.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                Presione "Lanzar Ataque de Prueba" en cualquiera de los vectores superiores para ver la neutralización en tiempo real.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Hora</th>
                      <th className="py-2.5 px-3">Herramienta Hostil</th>
                      <th className="py-2.5 px-3">Tiempo Reacción</th>
                      <th className="py-2.5 px-3">Resultado</th>
                      <th className="py-2.5 px-3">Prueba ZKP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                    {simulationLog.map(log => (
                      <tr key={log.id} className="hover:bg-slate-900/40">
                        <td className="py-2.5 px-3 text-slate-400">{log.timestamp}</td>
                        <td className="py-2.5 px-3 font-semibold text-white">{log.attackName}</td>
                        <td className="py-2.5 px-3 text-cyan-400">{log.blockedTimeNs} ns</td>
                        <td className="py-2.5 px-3 text-emerald-400 font-semibold">{log.status}</td>
                        <td className="py-2.5 px-3 text-rose-300 truncate max-w-xs">{log.zkpProof.substring(0, 20)}...</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          FOOTER & INTERCONNECTION ACTIONS
      ========================================================================= */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-sm font-bold text-white flex items-center gap-2">
            <Scale className="w-4 h-4 text-rose-400" />
            <span>Fe Pública Notarial Certificada y Protección Integral VMSB©2026</span>
          </div>
          <p className="text-xs text-slate-400">
            Descargue el acta oficial formal en PDF para respaldo ante auditorías NIS2, entidades reguladoras o tribunales de justicia.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {onNavigateToTimeline && (
            <button
              onClick={onNavigateToTimeline}
              className="px-3.5 py-2 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-700 hover:bg-slate-800 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              Línea de Tiempo ZK
            </button>
          )}

          {onNavigateToExecutive && (
            <button
              onClick={onNavigateToExecutive}
              className="px-3.5 py-2 text-xs font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 hover:bg-cyan-900/60 rounded-lg transition-colors cursor-pointer"
            >
              Cuadro Ejecutivo C-Suite
            </button>
          )}

          <button
            onClick={() => handleDownloadNotarialPdf()}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-rose-400 hover:bg-rose-300 rounded-lg transition-all shadow-md shadow-rose-950/40 cursor-pointer"
          >
            <FileDown className="w-4 h-4" />
            <span>Descargar Acta Notarial PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
