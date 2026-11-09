import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Clock, 
  Zap, 
  Cpu, 
  Search, 
  Filter, 
  RefreshCw, 
  Play, 
  Pause, 
  FileDown, 
  Code2, 
  Layers, 
  Key, 
  Hash, 
  ChevronRight, 
  Eye, 
  Sparkles,
  Terminal,
  Check,
  X,
  FileCheck2,
  Database
} from 'lucide-react';
import { 
  CorrelatedAuditTimelineEvent, 
  AuditCriticality 
} from '../types/protocol';
import { INITIAL_CORRELATED_TIMELINE_EVENTS } from '../data/protocolData';

interface AuditTimelineViewProps {
  onOpenPdfModal?: () => void;
}

export const AuditTimelineView: React.FC<AuditTimelineViewProps> = ({
  onOpenPdfModal,
}) => {
  // Timeline events state
  const [events, setEvents] = useState<CorrelatedAuditTimelineEvent[]>(INITIAL_CORRELATED_TIMELINE_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<CorrelatedAuditTimelineEvent | null>(INITIAL_CORRELATED_TIMELINE_EVENTS[0]);
  const [inspectorOpen, setInspectorOpen] = useState<boolean>(false);

  // Filters
  const [selectedCriticality, setSelectedCriticality] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'timeline' | 'matrix'>('timeline');

  // Real-time live streaming simulation
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [isInjecting, setIsInjecting] = useState<boolean>(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events.filter(evt => {
      // Criticality filter
      if (selectedCriticality !== 'ALL' && evt.criticality !== selectedCriticality) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'ALL' && evt.category !== selectedCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesMsg = evt.message.toLowerCase().includes(query);
        const matchesCircuit = evt.zkProof.circuitName.toLowerCase().includes(query);
        const matchesProofId = evt.zkProof.proofId.toLowerCase().includes(query);
        const matchesHash = evt.verificationHash.toLowerCase().includes(query);
        const matchesNode = evt.nodeId.toLowerCase().includes(query);
        const matchesSilicon = (evt.siliconProvider || '').toLowerCase().includes(query);
        return matchesMsg || matchesCircuit || matchesProofId || matchesHash || matchesNode || matchesSilicon;
      }
      return true;
    });
  }, [events, selectedCriticality, selectedCategory, searchQuery]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = events.length;
    const criticalCount = events.filter(e => e.criticality === 'CRITICAL').length;
    const highCount = events.filter(e => e.criticality === 'HIGH').length;
    const mediumCount = events.filter(e => e.criticality === 'MEDIUM').length;
    const lowCount = events.filter(e => e.criticality === 'LOW' || e.criticality === 'INFO').length;
    const avgLatency = (
      events.reduce((acc, curr) => acc + curr.correlationLatencyDeltaMs, 0) / (total || 1)
    ).toFixed(2);
    const zkVerifiedPercent = (
      (events.filter(e => e.zkProof.verificationStatus === 'VALID').length / (total || 1)) * 100
    ).toFixed(1);

    return {
      total,
      criticalCount,
      highCount,
      mediumCount,
      lowCount,
      avgLatency,
      zkVerifiedPercent,
    };
  }, [events]);

  // Copy hash helper
  const handleCopyHash = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  // Inject critical event simulation
  const handleInjectCriticalEvent = () => {
    setIsInjecting(true);

    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString() + '.' + String(now.getMilliseconds()).padStart(3, '0');
      const randomProofHex = Math.random().toString(16).substring(2, 7);
      const latency = Number((1.35 + Math.random() * 0.5).toFixed(2));
      const constraints = Math.floor(13000 + Math.random() * 15000);

      const criticalSimulations = [
        {
          category: 'VMSB_KERNEL' as const,
          message: 'RISC-V VMSB© Enclave: Detección y bloqueo atómico de desbordamiento de buffer en PMP Slot 02. Invariante de aislamiento micro-slice matemáticamente preservado.',
          circuit: 'riscv_vmsb_memory_boundary.circom',
          silicon: 'RISC-V Soberano Core-01',
          invariants: ['Límite PMP Slot 02 preservado', 'Cero fuga de memoria compartida', 'IEC 62443 SL-4 verificado'],
          snippet: `template RiscvBufferOverflowGuard() {
    signal input bufferPtr;
    signal input allocationSize;
    signal input boundaryRegister;
    signal output isContained;

    isContained <== (bufferPtr + allocationSize) <= boundaryRegister;
}`
        },
        {
          category: 'SECURITY' as const,
          message: 'Ataque de Jitter Poscuántico Mitigado: Algoritmo de rotación de llaves Kyber-1024 ejecutado en tiempo constante (NTT) con enmascaramiento aleatorio.',
          circuit: 'dilithium_pqc_attestation.circom',
          silicon: 'Enclave Criptográfico PQC Multi-Región',
          invariants: ['Resistencia a análisis de canal lateral', 'NIST FIPS 204 cumplido', '0 bits de clave filtrados'],
          snippet: `template KyberJitterDefense() {
    signal input executionTimeJitter;
    signal input constantTimeTarget;
    signal output isSideChannelImmune;

    isSideChannelImmune <== (executionTimeJitter === constantTimeTarget);
}`
        },
        {
          category: 'SILICON_ABI' as const,
          message: 'Violación de Alineación DMA Prevenida: Tensor inter-chip transferido entre NVIDIA H100 y Gaudi3 bloqueado por desalineación y re-empaquetado a 64 bytes zero-copy.',
          circuit: 'cross_silicon_abi_integrity.circom',
          silicon: 'Puente Universal VMSB© ABI',
          invariants: ['Alineación estricta 64-byte lograda', 'Cero sobrecarga de serialización', 'Latencia de bus 112 ns'],
          snippet: `template DmaAlignmentCheck() {
    signal input payloadSizeBytes;
    signal output isAligned64;

    isAligned64 <== (payloadSizeBytes % 64 === 0);
}`
        }
      ];

      const chosen = criticalSimulations[Math.floor(Math.random() * criticalSimulations.length)];

      const newCriticalEvent: CorrelatedAuditTimelineEvent = {
        id: `evt-corr-${Date.now()}`,
        timestamp: timeStr,
        rawEpochMs: Date.now(),
        criticality: 'CRITICAL',
        category: chosen.category,
        message: chosen.message,
        verificationHash: `sha256:${Math.random().toString(16).substring(2, 14)}${Math.random().toString(16).substring(2, 14)}...crit`,
        nodeId: 'node-fra-01',
        siliconProvider: chosen.silicon,
        correlationStatus: 'SYNCHRONIZED',
        correlationLatencyDeltaMs: latency,
        zkProof: {
          proofId: `zk-0x${randomProofHex}`,
          circuitName: chosen.circuit,
          verificationStatus: 'VALID',
          provingTimeMs: latency,
          constraintsCount: constraints,
          publicHash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
          provingScheme: 'Groth16 (BN254)',
          witnessDigest: `0x${Math.random().toString(16).substring(2, 8)}...witness_authenticated`,
          invariantsGuaranteed: chosen.invariants,
          circuitCodeSnippet: chosen.snippet
        },
        dilithiumSignature: {
          signatureId: `dlt-sig-0x${Math.random().toString(16).substring(2, 6)}`,
          scheme: 'CRYSTALS-Dilithium-5 (ML-DSA-87)',
          verificationLatencyMicros: 11.2,
          constantTimeNttVerified: true,
        }
      };

      setEvents(prev => [newCriticalEvent, ...prev]);
      setSelectedEvent(newCriticalEvent);
      setIsInjecting(false);
    }, 500);
  };

  // Real-time ticker
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString() + '.' + String(now.getMilliseconds()).padStart(3, '0');
      const randomHex = Math.random().toString(16).substring(2, 7);
      const latency = Number((1.2 + Math.random() * 0.7).toFixed(2));
      const constraints = Math.floor(10000 + Math.random() * 18000);

      const backgroundEvents: Array<{
        criticality: AuditCriticality;
        category: CorrelatedAuditTimelineEvent['category'];
        message: string;
        circuit: string;
        silicon: string;
        invariants: string[];
      }> = [
        {
          criticality: 'HIGH',
          category: 'CMST_TOPOLOGY',
          message: 'Micro-fluctuación de latencia en enlace transatlántico: Árbol CMST balanceado preventivamente en 6.4 μs.',
          circuit: 'cmst_capacity_constraint.circom',
          silicon: 'Broadcom Tomahawk 5 Terabit ASIC',
          invariants: ['Topología acíclica verificada', 'Latencia p99 < 0.35ms']
        },
        {
          criticality: 'MEDIUM',
          category: 'EFFICIENCY',
          message: 'Desvío de calor dinámico ASHRAE TC 9.9: Migración de 24 micro-procesos a nodo con free-cooling eólico.',
          circuit: 'energy_pue_reduction_verifier.circom',
          silicon: 'TSMC CoWoS Interposer Shunt',
          invariants: ['PUE certificado 1.07', 'Temperatura < 67°C']
        },
        {
          criticality: 'LOW',
          category: 'COMPLIANCE',
          message: 'Verificación continua IEC 62443 SL-4: 142/142 invariantes de integridad de firmware confirmados.',
          circuit: 'iec62443_sl4_anti_tamper.circom',
          silicon: 'AWS Trainium2 NeuronCore',
          invariants: ['Firma de arranque segura', 'Cero alteración de memoria']
        },
        {
          criticality: 'INFO',
          category: 'VMSB_KERNEL',
          message: 'Sincronización PTP IEEE 1588 de reloj atómico: Deriva de sincronización confirmada en 42 picosegundos.',
          circuit: 'ptp_clock_drift_verifier.circom',
          silicon: 'Google TPU v5p ICI Bus',
          invariants: ['Desfase temporal < 1ns', 'Consenso determinista']
        }
      ];

      const item = backgroundEvents[Math.floor(Math.random() * backgroundEvents.length)];

      const newEvt: CorrelatedAuditTimelineEvent = {
        id: `evt-corr-${Date.now()}`,
        timestamp: timeStr,
        rawEpochMs: Date.now(),
        criticality: item.criticality,
        category: item.category,
        message: item.message,
        verificationHash: `sha256:${Math.random().toString(16).substring(2, 14)}${Math.random().toString(16).substring(2, 14)}`,
        nodeId: 'node-fra-01',
        siliconProvider: item.silicon,
        correlationStatus: 'SYNCHRONIZED',
        correlationLatencyDeltaMs: latency,
        zkProof: {
          proofId: `zk-0x${randomHex}`,
          circuitName: item.circuit,
          verificationStatus: 'VALID',
          provingTimeMs: latency,
          constraintsCount: constraints,
          publicHash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
          provingScheme: 'Groth16 (BN254)',
          witnessDigest: `0x${Math.random().toString(16).substring(2, 8)}...witness_sync`,
          invariantsGuaranteed: item.invariants,
          circuitCodeSnippet: `template RealtimeAuditVerifier() {
    signal input timestamp;
    signal input stateDigest;
    signal output isVerified;
    isVerified <== 1;
}`
        },
        dilithiumSignature: {
          signatureId: `dlt-sig-0x${Math.random().toString(16).substring(2, 6)}`,
          scheme: 'CRYSTALS-Dilithium-5 (ML-DSA-87)',
          verificationLatencyMicros: 11.2,
          constantTimeNttVerified: true,
        }
      };

      setEvents(prev => [newEvt, ...prev.slice(0, 39)]); // keep max 40 items in memory
    }, 3200);

    return () => clearInterval(interval);
  }, [isStreaming]);

  // Helper for criticality badge
  const renderCriticalityBadge = (crit: AuditCriticality) => {
    switch (crit) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
            CRÍTICO
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <AlertTriangle className="w-2.5 h-2.5 text-amber-400" />
            ALTO
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            MEDIO
          </span>
        );
      case 'LOW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            BAJO
          </span>
        );
      case 'INFO':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
            INFO
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Quick Deck */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>PIPELINE CRIPTOGRÁFICO DE CORRELACIÓN FORMAL</span>
            <span className="text-slate-600">·</span>
            <span className="text-emerald-400">IEC 62443 SL-4 / NIST FIPS 204</span>
          </div>
          <h2 className="text-xl lg:text-2xl font-bold text-white tracking-tight">
            Línea de Tiempo de Auditoría & Correlación ZK-SNARK
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Correlación matemática determinista entre logs de auditoría en tiempo real y pruebas de conocimiento cero (Circom zk-SNARK) con firma poscuántica Dilithium-5. Garantiza no-repudio, integridad de microkernel VMSB© y cumplimiento normativo soberano con CAPEX cero.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleInjectCriticalEvent}
            disabled={isInjecting}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-rose-950 bg-rose-400 hover:bg-rose-300 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-rose-500/20"
          >
            <AlertCircle className={`w-3.5 h-3.5 ${isInjecting ? 'animate-spin' : ''}`} />
            <span>{isInjecting ? 'Generando Witness ZK...' : 'Disparar Evento Crítico & Atestación ZK'}</span>
          </button>

          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
              isStreaming
                ? 'bg-slate-900 border-emerald-500/40 text-emerald-300 hover:bg-slate-800'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            {isStreaming ? (
              <>
                <Pause className="w-3.5 h-3.5 text-emerald-400" />
                <span>Streaming Activo</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-slate-400" />
                <span>Streaming Pausado</span>
              </>
            )}
          </button>

          {onOpenPdfModal && (
            <button
              onClick={onOpenPdfModal}
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-cyan-500/20"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Certificado Forense</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Top Metric Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Metric 1 */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Tasa de Correlación ZK</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono flex items-baseline gap-1.5">
            <span>{stats.zkVerifiedPercent}%</span>
            <span className="text-[10px] text-emerald-400 font-sans font-normal">Atestación Total</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 truncate">
            {stats.total} eventos atestados matemáticamente
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Latencia Log→ZK (Groth16)</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-cyan-300 font-mono flex items-baseline gap-1.5">
            <span>{stats.avgLatency} ms</span>
            <span className="text-[10px] text-cyan-400 font-sans font-normal">Curva BN254</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 truncate">
            Atestación sub-2ms en tiempo de ciclo
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Eventos Críticos / SL-4</span>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl font-bold text-rose-300 font-mono flex items-baseline gap-1.5">
            <span>{stats.criticalCount}</span>
            <span className="text-[10px] text-emerald-400 font-sans font-normal">100% Protegidos</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 truncate">
            0% fugas de memoria o ciclo
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Firma Poscuántica VMSB©</span>
            <Lock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-purple-300 font-mono flex items-baseline gap-1.5">
            <span>11.2 μs</span>
            <span className="text-[10px] text-purple-400 font-sans font-normal">Dilithium-5</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 truncate">
            NIST FIPS 204 PMP Slot 0-7 Pinned
          </p>
        </div>
      </div>

      {/* 3. Filter Bar & Search Deck */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Criticality Segmented Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5 text-cyan-400" />
              Criticidad:
            </span>
            <button
              onClick={() => setSelectedCriticality('ALL')}
              className={`px-2.5 py-1 text-xs rounded-lg transition-colors font-medium ${
                selectedCriticality === 'ALL'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                  : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Todas ({stats.total})
            </button>
            <button
              onClick={() => setSelectedCriticality('CRITICAL')}
              className={`px-2.5 py-1 text-xs rounded-lg transition-colors font-medium ${
                selectedCriticality === 'CRITICAL'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-semibold'
                  : 'bg-slate-950/60 text-slate-400 hover:text-rose-300 border border-slate-800'
              }`}
            >
              Crítica ({stats.criticalCount})
            </button>
            <button
              onClick={() => setSelectedCriticality('HIGH')}
              className={`px-2.5 py-1 text-xs rounded-lg transition-colors font-medium ${
                selectedCriticality === 'HIGH'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                  : 'bg-slate-950/60 text-slate-400 hover:text-amber-300 border border-slate-800'
              }`}
            >
              Alta ({stats.highCount})
            </button>
            <button
              onClick={() => setSelectedCriticality('MEDIUM')}
              className={`px-2.5 py-1 text-xs rounded-lg transition-colors font-medium ${
                selectedCriticality === 'MEDIUM'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                  : 'bg-slate-950/60 text-slate-400 hover:text-cyan-300 border border-slate-800'
              }`}
            >
              Media ({stats.mediumCount})
            </button>
            <button
              onClick={() => setSelectedCriticality('LOW')}
              className={`px-2.5 py-1 text-xs rounded-lg transition-colors font-medium ${
                selectedCriticality === 'LOW'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                  : 'bg-slate-950/60 text-slate-400 hover:text-emerald-300 border border-slate-800'
              }`}
            >
              Baja / Info ({stats.lowCount})
            </button>
          </div>

          {/* View toggle & Category dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filtrar por categoría de evento"
              className="bg-slate-950 text-slate-300 border border-slate-800 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">Todas las Categorías</option>
              <option value="VMSB_KERNEL">Kernel VMSB</option>
              <option value="SECURITY">Seguridad & Cripto</option>
              <option value="CMST_TOPOLOGY">Topología CMST</option>
              <option value="SILICON_ABI">Silicio ABI Heterogéneo</option>
              <option value="EFFICIENCY">Eficiencia Térmica & Agua</option>
              <option value="COMPLIANCE">Cumplimiento IEC / NIST</option>
            </select>

            {/* Segmented view switch */}
            <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  viewMode === 'timeline' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Línea Visual
              </button>
              <button
                onClick={() => setViewMode('matrix')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  viewMode === 'matrix' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Matriz Forense
              </button>
            </div>
          </div>
        </div>

        {/* Live Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por mensaje forense, circuito Circom (.circom), hash SHA-256 o ID de prueba ZK..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/80 text-slate-200 placeholder-slate-500 border border-slate-800/80 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-cyan-500 font-mono transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 4. Timeline Viewport */}
      {filteredEvents.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-12 text-center">
          <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-slate-300">No se encontraron eventos coincidentes</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Ajusta los filtros de criticidad o limpia la búsqueda para visualizar los registros de la línea de tiempo.
          </p>
          <button
            onClick={() => {
              setSelectedCriticality('ALL');
              setSelectedCategory('ALL');
              setSearchQuery('');
            }}
            className="mt-3 px-3 py-1.5 text-xs text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 rounded-lg hover:bg-cyan-900/40 transition-colors"
          >
            Restablecer Filtros
          </button>
        </div>
      ) : viewMode === 'timeline' ? (
        <div className="relative space-y-4">
          {/* Vertical Timeline Guide Line */}
          <div className="absolute left-[19px] sm:left-6 top-4 bottom-4 w-0.5 bg-gradient-to-b from-cyan-500/50 via-emerald-500/40 to-slate-800 pointer-events-none hidden sm:block" />

          {filteredEvents.map((evt, idx) => {
            const isSelected = selectedEvent?.id === evt.id;

            return (
              <div
                key={evt.id}
                onClick={() => {
                  setSelectedEvent(evt);
                }}
                className={`relative sm:pl-14 transition-all duration-200 cursor-pointer ${
                  isSelected ? 'scale-[1.005]' : 'opacity-95 hover:opacity-100'
                }`}
              >
                {/* Timeline Dot Node on Line */}
                <div
                  className={`hidden sm:flex absolute left-4 top-5 w-4 h-4 rounded-full border-2 items-center justify-center -translate-x-1/2 transition-colors z-10 ${
                    evt.criticality === 'CRITICAL'
                      ? 'border-rose-400 bg-rose-950 shadow-md shadow-rose-500/50'
                      : evt.criticality === 'HIGH'
                      ? 'border-amber-400 bg-amber-950'
                      : 'border-cyan-400 bg-slate-950'
                  }`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      evt.criticality === 'CRITICAL'
                        ? 'bg-rose-400 animate-ping'
                        : evt.criticality === 'HIGH'
                        ? 'bg-amber-400'
                        : 'bg-cyan-400'
                    }`}
                  />
                </div>

                {/* Correlated Event Card (Dual Track: Log on Top -> Bus -> ZK Proof) */}
                <div
                  className={`rounded-xl border transition-all overflow-hidden ${
                    isSelected
                      ? 'bg-slate-900/90 border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Track 1: Audit Log Event Banner */}
                  <div className="p-4 bg-slate-950/60 border-b border-slate-800/80">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {renderCriticalityBadge(evt.criticality)}
                        <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {evt.timestamp}
                        </span>
                        <span className="text-slate-600">·</span>
                        <span className="text-xs font-mono text-cyan-400 font-semibold">
                          {evt.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                          {evt.nodeId}
                        </span>
                        {evt.siliconProvider && (
                          <span className="px-2 py-0.5 rounded bg-cyan-950/40 text-cyan-300 border border-cyan-800/40">
                            {evt.siliconProvider}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-100 font-sans leading-relaxed">
                      {evt.message}
                    </p>

                    <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-slate-500">
                      <div className="flex items-center gap-1.5 truncate max-w-md">
                        <Hash className="w-3 h-3 text-slate-600 shrink-0" />
                        <span className="truncate">Hash: {evt.verificationHash}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyHash(evt.verificationHash);
                          }}
                          className="hover:text-cyan-400 transition-colors ml-1"
                          title="Copiar hash SHA-256"
                        >
                          {copiedHash === evt.verificationHash ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <CopyIcon className="w-3 h-3 text-slate-500" />
                          )}
                        </button>
                      </div>

                      <span className="text-emerald-400 flex items-center gap-1 shrink-0">
                        <CheckCircle2 className="w-3 h-3" /> Integridad de Kernel Verificada
                      </span>
                    </div>
                  </div>

                  {/* Middle Correlation Bridge (Direct Linkage Indicator) */}
                  <div className="px-4 py-2 bg-gradient-to-r from-cyan-950/30 via-slate-900 to-emerald-950/30 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      <span className="text-slate-400">CORRELACIÓN FORMAL:</span>
                      <span className="text-cyan-300 font-bold">
                        Δ {evt.correlationLatencyDeltaMs} ms
                      </span>
                      <span className="text-slate-500 text-[10px]">
                        (Tiempo de atestación matemática)
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="text-purple-300 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-purple-400" />
                        {evt.dilithiumSignature?.scheme.replace('CRYSTALS-', '')} ({evt.dilithiumSignature?.verificationLatencyMicros} μs)
                      </span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {evt.zkProof.provingScheme}
                      </span>
                    </div>
                  </div>

                  {/* Track 2: Correlated Zero-Knowledge Proof (Circom) */}
                  <div className="p-4 bg-slate-900/40">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Code2 className="w-4 h-4 text-cyan-400" />
                          <span className="text-xs font-mono text-cyan-300 font-bold">
                            {evt.zkProof.circuitName}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                            {evt.zkProof.verificationStatus}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-400 mt-1.5">
                          <span>Proof ID: <strong className="text-white">{evt.zkProof.proofId}</strong></span>
                          <span className="text-slate-600">·</span>
                          <span>Restricciones R1CS: <strong className="text-cyan-400">{evt.zkProof.constraintsCount.toLocaleString()}</strong></span>
                          <span className="text-slate-600">·</span>
                          <span>Proving: <strong className="text-emerald-400">{evt.zkProof.provingTimeMs} ms</strong></span>
                        </div>

                        {/* Invariants Chips */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                          {evt.zkProof.invariantsGuaranteed.map((inv, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded text-[10px] bg-slate-950 text-slate-300 border border-slate-800 flex items-center gap-1"
                            >
                              <Check className="w-2.5 h-2.5 text-emerald-400" />
                              {inv}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Right button: Forensic inspect */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(evt);
                          setInspectorOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/60 rounded-lg transition-colors whitespace-nowrap self-start md:self-center"
                      >
                        <Eye className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Inspección Forense ZK</span>
                        <ChevronRight className="w-3 h-3 text-cyan-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Matrix View (Dense Table) */
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3">Timestamp / Criticidad</th>
                  <th className="p-3">Categoría / Nodo</th>
                  <th className="p-3">Mensaje Forense de Auditoría</th>
                  <th className="p-3">Prueba ZK Vinculada</th>
                  <th className="p-3">Firma PQC Dilithium</th>
                  <th className="p-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredEvents.map((evt) => (
                  <tr
                    key={evt.id}
                    onClick={() => setSelectedEvent(evt)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                  >
                    <td className="p-3 whitespace-nowrap">
                      <div className="text-white font-bold">{evt.timestamp}</div>
                      <div className="mt-1">{renderCriticalityBadge(evt.criticality)}</div>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <div className="text-cyan-300 font-semibold">{evt.category}</div>
                      <div className="text-slate-400 text-[11px]">{evt.nodeId}</div>
                    </td>
                    <td className="p-3 font-sans text-slate-300 max-w-md text-xs">
                      {evt.message}
                      <div className="text-[10px] font-mono text-slate-500 mt-0.5 truncate">
                        {evt.verificationHash}
                      </div>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <div className="text-cyan-400 font-semibold flex items-center gap-1">
                        <Code2 className="w-3 h-3" />
                        {evt.zkProof.circuitName}
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        ID: {evt.zkProof.proofId} · {evt.zkProof.provingTimeMs} ms ({evt.zkProof.constraintsCount.toLocaleString()} c)
                      </div>
                    </td>
                    <td className="p-3 whitespace-nowrap text-purple-300 text-[11px]">
                      <div>{evt.dilithiumSignature?.scheme.replace('CRYSTALS-', '')}</div>
                      <div className="text-slate-500">{evt.dilithiumSignature?.verificationLatencyMicros} μs (NTT Válido)</div>
                    </td>
                    <td className="p-3 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(evt);
                          setInspectorOpen(true);
                        }}
                        className="px-2.5 py-1 text-xs text-cyan-300 bg-cyan-950/60 border border-cyan-800/50 rounded hover:bg-cyan-900/60 transition-colors"
                      >
                        Inspeccionar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Forensic Inspection Drawer / Modal */}
      {inspectorOpen && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Inspección Forense Criptográfica ZK-SNARK</span>
                    {renderCriticalityBadge(selectedEvent.criticality)}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Atestación matemática de no-repudio · NIST FIPS 204 & IEC 62443 SL-4
                  </p>
                </div>
              </div>

              <button
                onClick={() => setInspectorOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs font-mono">
              {/* Event Summary Box */}
              <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>Evento ID: {selectedEvent.id}</span>
                  <span className="text-cyan-300 font-bold">{selectedEvent.timestamp}</span>
                </div>
                <div className="text-sm font-sans text-white font-medium">
                  {selectedEvent.message}
                </div>
                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-slate-400 text-[11px]">
                  <span>Nodo: <strong className="text-slate-200">{selectedEvent.nodeId}</strong></span>
                  <span>Silicio: <strong className="text-cyan-300">{selectedEvent.siliconProvider}</strong></span>
                  <span>Categoría: <strong className="text-emerald-400">{selectedEvent.category}</strong></span>
                </div>
              </div>

              {/* Hashes & Cripto Rigor Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Box 1: SHA-256 Block Integrity */}
                <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3">
                  <div className="text-[11px] text-slate-400 flex items-center justify-between mb-1">
                    <span>Hash SHA-256 de Registro Inmutable</span>
                    <Hash className="w-3 h-3 text-cyan-400" />
                  </div>
                  <div className="text-slate-200 text-[10px] break-all bg-slate-900 p-2 rounded border border-slate-800/80 font-mono">
                    {selectedEvent.verificationHash}
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-emerald-400">
                    <span>Estado: Sellado en Memoria PMP</span>
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                </div>

                {/* Box 2: Post-Quantum Dilithium-5 Signature */}
                <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3">
                  <div className="text-[11px] text-purple-300 flex items-center justify-between mb-1">
                    <span>Firma Dilithium-5 (ML-DSA-87)</span>
                    <Lock className="w-3 h-3 text-purple-400" />
                  </div>
                  <div className="text-slate-200 text-[10px] break-all bg-slate-900 p-2 rounded border border-slate-800/80 font-mono">
                    ID: {selectedEvent.dilithiumSignature?.signatureId} · Scheme: {selectedEvent.dilithiumSignature?.scheme}
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-purple-300">
                    <span>Latencia NTT: {selectedEvent.dilithiumSignature?.verificationLatencyMicros} μs</span>
                    <span>Constant-Time: Verificado</span>
                  </div>
                </div>
              </div>

              {/* Circom Circuit & Witness Parameters */}
              <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white">
                      Circuito Circom: {selectedEvent.zkProof.circuitName}
                    </span>
                  </div>
                  <span className="text-xs text-emerald-400 font-bold">
                    Esquema: {selectedEvent.zkProof.provingScheme}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] text-slate-300">
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <div className="text-slate-500 text-[10px]">Proof ID</div>
                    <div className="font-bold text-white truncate">{selectedEvent.zkProof.proofId}</div>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <div className="text-slate-500 text-[10px]">Restricciones R1CS</div>
                    <div className="font-bold text-cyan-300">{selectedEvent.zkProof.constraintsCount.toLocaleString()}</div>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <div className="text-slate-500 text-[10px]">Tiempo Prover</div>
                    <div className="font-bold text-emerald-300">{selectedEvent.zkProof.provingTimeMs} ms</div>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <div className="text-slate-500 text-[10px]">Δ Correlación</div>
                    <div className="font-bold text-purple-300">{selectedEvent.correlationLatencyDeltaMs} ms</div>
                  </div>
                </div>

                {/* Witness & Invariants */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-slate-400 text-[11px]">Invariantes Matemáticos Demostrados:</div>
                  <div className="flex flex-col gap-1">
                    {selectedEvent.zkProof.invariantsGuaranteed.map((inv, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-slate-200 text-xs">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{inv}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Circom Code Snippet */}
                {selectedEvent.zkProof.circuitCodeSnippet && (
                  <div className="pt-2">
                    <div className="text-slate-400 text-[10px] mb-1 flex items-center justify-between">
                      <span>Definición de Restricciones Circom 2.1.8 (R1CS):</span>
                      <span className="text-cyan-400">bn254_scalar_field</span>
                    </div>
                    <pre className="bg-slate-900/90 text-cyan-200 p-3 rounded-lg border border-slate-800 text-[11px] overflow-x-auto leading-relaxed font-mono">
                      {selectedEvent.zkProof.circuitCodeSnippet}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Atestación formal con valor pericial legal según EU eIDAS & NIS2.
              </span>

              <button
                onClick={() => setInspectorOpen(false)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors"
              >
                Cerrar Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function CopyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}
