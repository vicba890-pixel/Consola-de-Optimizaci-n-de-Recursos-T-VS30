import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Key, 
  RefreshCw, 
  Cpu, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  Terminal, 
  Layers, 
  Activity, 
  Zap, 
  FileText, 
  FileCheck2, 
  Fingerprint, 
  ArrowRight, 
  History, 
  Sliders,
  Check,
  Download,
  AlertTriangle,
  Radio
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { 
  DilithiumSignatureEvent, 
  ProtocolNode, 
  AuditLogEntry,
  DilithiumRotatingKeyInfo,
  PqcHealthMetric,
  ZeroExposureZkCircuit,
  PqcThreatDefenseVector
} from '../types/protocol';
import { 
  INITIAL_ROTATING_KEYS, 
  PQC_HEALTH_METRICS, 
  ZERO_EXPOSURE_ZK_CIRCUITS, 
  PQC_THREAT_DEFENSE_VECTORS 
} from '../data/protocolData';

interface PqcSecurityDashboardViewProps {
  nodes: ProtocolNode[];
  dilithiumEvents: DilithiumSignatureEvent[];
  auditLogs: AuditLogEntry[];
  onTriggerSignEvent: (targetProcess: DilithiumSignatureEvent['targetProcess']) => void;
  isSigning: boolean;
  onOpenPdfModal: () => void;
  onNavigateToTimeline?: () => void;
  onNavigateToQuant?: () => void;
}

export const PqcSecurityDashboardView: React.FC<PqcSecurityDashboardViewProps> = ({
  nodes,
  dilithiumEvents,
  auditLogs,
  onTriggerSignEvent,
  isSigning,
  onOpenPdfModal,
  onNavigateToTimeline,
  onNavigateToQuant
}) => {
  // Navigation tabs inside the security dashboard
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'key_rotation' | 'zero_exposure_zkp' | 'threat_matrix' | 'event_stream'>('overview');

  // Key rotation state
  const [keys, setKeys] = useState<DilithiumRotatingKeyInfo[]>(INITIAL_ROTATING_KEYS);
  const [isRotatingKey, setIsRotatingKey] = useState<boolean>(false);
  const [autoRotateEnabled, setAutoRotateEnabled] = useState<boolean>(true);
  const [rotationCountdown, setRotationCountdown] = useState<number>(142);
  const [selectedKeyId, setSelectedKeyId] = useState<string>(INITIAL_ROTATING_KEYS[0].keyId);

  // ZKP Zero-Exposure interactive state
  const [selectedCircuitId, setSelectedCircuitId] = useState<string>(ZERO_EXPOSURE_ZK_CIRCUITS[0].circuitId);
  const [isComputingProof, setIsComputingProof] = useState<boolean>(false);
  const [verifiedProofResult, setVerifiedProofResult] = useState<{
    circuitId: string;
    verifiedAt: string;
    proofDigest: string;
    provingTimeMs: number;
    constraintsCount: number;
    zeroExposureValid: boolean;
  } | null>({
    circuitId: ZERO_EXPOSURE_ZK_CIRCUITS[0].circuitId,
    verifiedAt: 'Reciente (Sincronizado)',
    proofDigest: '0x14f989b1c4e7...bn254_verified',
    provingTimeMs: 1.82,
    constraintsCount: 19840,
    zeroExposureValid: true
  });

  // Filter for events stream
  const [eventFilter, setEventFilter] = useState<'ALL' | 'ROTATION' | 'DILITHIUM' | 'PMP_TRAP'>('ALL');

  // Active key
  const activeKey = keys.find(k => k.status === 'ACTIVE') || keys[0];
  const standbyKey = keys.find(k => k.status === 'STANDBY');
  const selectedKey = keys.find(k => k.keyId === selectedKeyId) || activeKey;
  const selectedCircuit = ZERO_EXPOSURE_ZK_CIRCUITS.find(c => c.circuitId === selectedCircuitId) || ZERO_EXPOSURE_ZK_CIRCUITS[0];

  // Automatic countdown timer for rotating keys
  useEffect(() => {
    if (!autoRotateEnabled) return;
    const interval = setInterval(() => {
      setRotationCountdown(prev => {
        if (prev <= 1) {
          // Trigger automatic rotation
          handleExecuteKeyRotation();
          return 300;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [autoRotateEnabled, keys]);

  // Execute Dynamic Dilithium-5 Key Rotation
  const handleExecuteKeyRotation = () => {
    setIsRotatingKey(true);
    setTimeout(() => {
      const currentEpoch = activeKey.epoch;
      const nextEpoch = currentEpoch + 1;
      const newStandbyEpoch = nextEpoch + 1;

      const newActiveKey: DilithiumRotatingKeyInfo = {
        keyId: `pqc-dlt5-epoch-${nextEpoch}`,
        epoch: nextEpoch,
        scheme: 'CRYSTALS-Dilithium-5 (ML-DSA-87)',
        publicKeyFingerprint: `0x${Math.random().toString(16).substring(2, 10)}...dlt5_pk_fips204_epoch${nextEpoch}`,
        privateKeyStatus: 'ENCLAVE_PMP_LOCKED_ZERO_EXPOSURE',
        generatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
        expiresInSeconds: 300,
        rotationIntervalSeconds: 300,
        signaturesIssuedCount: 1,
        maxSignaturesPerEpoch: 50000,
        status: 'ACTIVE',
        hardwareTrapSlot: 'RISC-V-PMP-SLOT-00 (Enclave Ring-0 Pinned)',
        merkleEpochCommitment: `0x${Math.random().toString(16).substring(2, 14)}${Math.random().toString(16).substring(2, 14)}...epoch${nextEpoch}`,
        previousKeyEpochHash: activeKey.merkleEpochCommitment,
        ratchetStep: nextEpoch
      };

      const newStandbyKey: DilithiumRotatingKeyInfo = {
        keyId: `pqc-dlt5-epoch-${newStandbyEpoch}`,
        epoch: newStandbyEpoch,
        scheme: 'CRYSTALS-Dilithium-5 (ML-DSA-87)',
        publicKeyFingerprint: `0x${Math.random().toString(16).substring(2, 10)}...dlt5_prestage_epoch${newStandbyEpoch}`,
        privateKeyStatus: 'ENCLAVE_PMP_LOCKED_ZERO_EXPOSURE',
        generatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
        expiresInSeconds: 600,
        rotationIntervalSeconds: 300,
        signaturesIssuedCount: 0,
        maxSignaturesPerEpoch: 50000,
        status: 'STANDBY',
        hardwareTrapSlot: 'RISC-V-PMP-SLOT-01 (Pre-Staged Slot)',
        merkleEpochCommitment: `0x${Math.random().toString(16).substring(2, 14)}...prestage${newStandbyEpoch}`,
        previousKeyEpochHash: newActiveKey.merkleEpochCommitment,
        ratchetStep: newStandbyEpoch
      };

      const demotedActiveKey: DilithiumRotatingKeyInfo = {
        ...activeKey,
        status: 'GRACE_PERIOD',
        hardwareTrapSlot: 'RISC-V-PMP-SLOT-07 (Grace Read-Only Slot)',
        expiresInSeconds: 30
      };

      const olderKeys = keys
        .filter(k => k.keyId !== activeKey.keyId && k.status !== 'STANDBY')
        .map(k => ({
          ...k,
          status: 'RETIRED' as const,
          hardwareTrapSlot: 'ZEROIZED_IN_SILICON'
        }))
        .slice(0, 5);

      setKeys([newActiveKey, newStandbyKey, demotedActiveKey, ...olderKeys]);
      setSelectedKeyId(newActiveKey.keyId);
      setRotationCountdown(300);
      setIsRotatingKey(false);

      // Trigger Dilithium rotation event on protocol state
      onTriggerSignEvent('PQC_KEY_ROTATION');
    }, 600);
  };

  // Interactive ZKP Proving Simulator (Zero-Exposure)
  const handleGenerateZeroExposureProof = (circuit: ZeroExposureZkCircuit) => {
    setIsComputingProof(true);
    setTimeout(() => {
      const generatedDigest = `0x${Math.random().toString(16).substring(2, 10)}...zero_exposure_${circuit.circuitId}`;
      setVerifiedProofResult({
        circuitId: circuit.circuitId,
        verifiedAt: new Date().toLocaleTimeString(),
        proofDigest: generatedDigest,
        provingTimeMs: Number((circuit.provingTimeMs * (0.95 + Math.random() * 0.1)).toFixed(2)),
        constraintsCount: circuit.constraintsCount,
        zeroExposureValid: true
      });
      setIsComputingProof(false);
    }, 750);
  };

  // Timeline series for cryptographic integrity
  const latticeHealthSeries = [
    { time: '10:00', stability: 99.98, nttLatencyUs: 11.2, sideChannelCorrelation: 0.000 },
    { time: '10:05', stability: 99.99, nttLatencyUs: 11.1, sideChannelCorrelation: 0.000 },
    { time: '10:10', stability: 99.97, nttLatencyUs: 11.3, sideChannelCorrelation: 0.000 },
    { time: '10:15', stability: 99.98, nttLatencyUs: 11.0, sideChannelCorrelation: 0.000 },
    { time: '10:20', stability: 99.99, nttLatencyUs: 11.1, sideChannelCorrelation: 0.000 },
    { time: '10:25', stability: 99.98, nttLatencyUs: 11.2, sideChannelCorrelation: 0.000 },
    { time: '10:30', stability: 100.0, nttLatencyUs: 10.9, sideChannelCorrelation: 0.000 }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Executive Cryptographic Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden">
        {/* Ambient subtle cyber glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="text-cyan-400 font-mono font-bold">CRYPTO-HEALTH DASHBOARD</span>
              <span aria-hidden="true">·</span>
              <span>NIST Level 5 (ML-DSA-87 / Dilithium-5)</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 inline" />
                Zero-Knowledge Blinded (ZKP)
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-cyan-400 shrink-0" />
              <span>Salud Criptográfica Poscuántica & Gestión de Llaves Dilithium-5</span>
            </h1>

            <p className="text-sm text-slate-300 max-w-4xl leading-relaxed">
              Monitoreo determinista de resiliencia cuántica para infraestructuras críticas T-VS30. Supervisión en tiempo real del ciclo de rotación efímera de firmas Dilithium-5 (ML-DSA-87), aceleración NTT en tiempo constante e invariantes verificados mediante circuitos <span className="text-cyan-300 font-medium">ZKP sin exposición de datos o información crítica</span> (Zero-Exposure Witness Isolation).
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap lg:flex-col gap-2.5 shrink-0">
            <button
              onClick={handleExecuteKeyRotation}
              disabled={isRotatingKey}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all shadow-md shadow-cyan-950/40 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRotatingKey ? 'animate-spin' : ''}`} />
              <span>{isRotatingKey ? 'Rotando Llave Dilithium...' : 'Rotar Llave Dilithium-5 Ahora'}</span>
            </button>

            <button
              onClick={onOpenPdfModal}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Dictamen PQC & Whitepaper (PDF)</span>
            </button>
          </div>
        </div>

        {/* Global KPI Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3">
            <div className="text-[11px] text-slate-400 font-medium">Salud Criptográfica Global</div>
            <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">99.98% Nominal</div>
            <div className="text-[10px] text-slate-400 mt-1">Lattice LWE/SIS 0 desviaciones</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3">
            <div className="text-[11px] text-slate-400 font-medium">Época Dilithium Activa</div>
            <div className="text-lg font-bold text-cyan-300 font-mono mt-0.5">Época #{activeKey.epoch}</div>
            <div className="text-[10px] text-slate-400 mt-1">Próxima rotación: {rotationCountdown}s</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3">
            <div className="text-[11px] text-slate-400 font-medium">Latencia NTT Hardware</div>
            <div className="text-lg font-bold text-purple-300 font-mono mt-0.5">11.14 μs</div>
            <div className="text-[10px] text-slate-400 mt-1">Jitter 0.00 ns (Constant-Time)</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3">
            <div className="text-[11px] text-slate-400 font-medium">Exposición de Datos Críticos</div>
            <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">0.00% (Zero-Exposure)</div>
            <div className="text-[10px] text-slate-400 mt-1">Testigo ZK destruido en PMP</div>
          </div>

          <div className="col-span-2 sm:col-span-4 lg:col-span-1 bg-slate-900/60 border border-slate-800/80 rounded-xl p-3">
            <div className="text-[11px] text-slate-400 font-medium">Amenazas Cuánticas Shor/Grover</div>
            <div className="text-lg font-bold text-cyan-400 font-mono mt-0.5">0 Detectadas</div>
            <div className="text-[10px] text-slate-400 mt-1">256-bit seguridad NIST-L5</div>
          </div>
        </div>
      </div>

      {/* Segmented Navigation Controls for Dashboard Sub-Views */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-900/80 border border-slate-800 rounded-xl overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeSubTab === 'overview'
              ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700/60 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Salud PQC & Telemetría</span>
        </button>

        <button
          onClick={() => setActiveSubTab('key_rotation')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeSubTab === 'key_rotation'
              ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700/60 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
          }`}
        >
          <Key className="w-3.5 h-3.5 text-amber-400" />
          <span>Rotación Llaves Dilithium-5</span>
          <span className="text-[10px] font-mono font-bold text-amber-300">Época #{activeKey.epoch}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('zero_exposure_zkp')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeSubTab === 'zero_exposure_zkp'
              ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700/60 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
          }`}
        >
          <EyeOff className="w-3.5 h-3.5 text-emerald-400" />
          <span>ZKP Sin Exposición de Datos</span>
          <span className="text-[10px] font-mono text-emerald-400">Zero-Exposure</span>
        </button>

        <button
          onClick={() => setActiveSubTab('threat_matrix')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeSubTab === 'threat_matrix'
              ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700/60 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          <span>Matriz de Inmunidad Cuántica</span>
        </button>

        <button
          onClick={() => setActiveSubTab('event_stream')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeSubTab === 'event_stream'
              ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700/60 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
          }`}
        >
          <Terminal className="w-3.5 h-3.5 text-purple-400" />
          <span>Auditoría & Firmas en Vivo</span>
          <span className="text-[10px] font-mono text-purple-300">({dilithiumEvents.length})</span>
        </button>
      </div>

      {/* =========================================================================
          SUB-TAB 1: OVERVIEW & PQC HEALTH TELEMETRY
      ========================================================================= */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Main 2-column layout: Lattice Stability Chart + Health Dimensions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart Card */}
            <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span>Estabilidad de Retículo & Latencia de Verificación NTT</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Mapeo en tiempo real de la transformada polinomial para firmas CRYSTALS-Dilithium-5 (ML-DSA-87).
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                    Estabilidad Retículo (%)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                    Latencia NTT (μs)
                  </span>
                </div>
              </div>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={latticeHealthSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="pqcStabilityGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="nttLatencyGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#c084fc" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#c084fc" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="left" domain={[99.9, 100]} stroke="#22d3ee" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="right" orientation="right" domain={[10, 12]} stroke="#c084fc" tick={{ fontSize: 11 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                      labelStyle={{ color: '#94a3b8' }}
                    />
                    <Area yAxisId="left" type="monotone" dataKey="stability" stroke="#22d3ee" strokeWidth={2} fillOpacity={1} fill="url(#pqcStabilityGrad)" name="Estabilidad (%)" />
                    <Area yAxisId="right" type="monotone" dataKey="nttLatencyUs" stroke="#c084fc" strokeWidth={2} fillOpacity={1} fill="url(#nttLatencyGrad)" name="Latencia NTT (μs)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-800 text-center text-xs">
                <div>
                  <div className="text-slate-400">Variación Temporal (Jitter)</div>
                  <div className="font-mono font-bold text-white mt-0.5">0.00 ns</div>
                  <div className="text-[10px] text-emerald-400">Constant-Time verificado</div>
                </div>
                <div>
                  <div className="text-slate-400">Inyección de Fallos (FIA)</div>
                  <div className="font-mono font-bold text-white mt-0.5">0 Éxitos</div>
                  <div className="text-[10px] text-emerald-400">Trampas ALU activas</div>
                </div>
                <div>
                  <div className="text-slate-400">Entropía Cuántica (PUF)</div>
                  <div className="font-mono font-bold text-white mt-0.5">256 bits/ciclo</div>
                  <div className="text-[10px] text-cyan-400">TRNG de silicio nativo</div>
                </div>
              </div>
            </div>

            {/* Quick Status Card: Dilithium Active Epoch Spotlight */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">Estado de Llave en Producción</span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    ACTIVA
                  </span>
                </div>

                <div className="mt-3">
                  <div className="text-xl font-extrabold text-white font-mono">{activeKey.keyId}</div>
                  <div className="text-xs text-slate-400 font-mono mt-1 break-all">
                    Fingerprint: <span className="text-cyan-300">{activeKey.publicKeyFingerprint}</span>
                  </div>
                </div>

                {/* Progress bar to next rotation */}
                <div className="mt-5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>Próxima Rotación Automática</span>
                    <span className="font-mono font-bold text-amber-300">{rotationCountdown} segundos</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-amber-400 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${(rotationCountdown / 300) * 100}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center justify-between">
                    <span>Firmas emitidas: {activeKey.signaturesIssuedCount.toLocaleString()}</span>
                    <span>Límite: {activeKey.maxSignaturesPerEpoch.toLocaleString()}</span>
                  </div>
                </div>

                {/* Hardware slot */}
                <div className="mt-4 p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-1.5 text-xs font-mono">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Hardware Enclave:</span>
                    <span className="text-cyan-300">{activeKey.hardwareTrapSlot}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Aislamiento Clave:</span>
                    <span className="text-emerald-400">Ring-0 Zero-Exposure</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Trinquete Cuántico:</span>
                    <span className="text-purple-300">PFS Paso #{activeKey.ratchetStep}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center gap-2">
                <button
                  onClick={() => setActiveSubTab('key_rotation')}
                  className="flex-1 py-2 text-xs font-semibold text-cyan-300 bg-cyan-950/50 hover:bg-cyan-900/50 border border-cyan-800/60 rounded-xl transition-colors text-center"
                >
                  Gestionar Rotación de Llaves →
                </button>
              </div>
            </div>
          </div>

          {/* Detailed Health Metrics Cards */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Invariantes de Salud Criptográfica y Garantías Formales de Seguridad</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PQC_HEALTH_METRICS.map(metric => (
                <div key={metric.metricId} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">{metric.name}</span>
                    <span className="text-emerald-400 font-semibold font-mono">{metric.status}</span>
                  </div>

                  <div className="text-base font-bold text-white font-mono">
                    {metric.value}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {metric.details}
                  </p>

                  <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-cyan-300 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">{metric.formalGuarantee}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 2: ROTATING KEY STATUS FOR DILITHIUM-5 SIGNATURES
      ========================================================================= */}
      {activeSubTab === 'key_rotation' && (
        <div className="space-y-6">
          {/* Key Rotation Explanation and Controls */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 md:p-6 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
                  <Key className="w-5 h-5 text-amber-400" />
                  <span>Estado de Rotación de Llaves CRYSTALS-Dilithium-5 (ML-DSA-87)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
                  Las firmas de infraestructura crítica se renuevan periódicamente mediante un trinquete poscuántico irreversible (Quantum-Safe Forward Secrecy). La clave privada jamás abandona el silicio protegido por registros PMP RISC-V Ring-0, y la conmutación de épocas se realiza sin descarte de paquetes ni jitter de red.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => setAutoRotateEnabled(!autoRotateEnabled)}
                  className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-colors ${
                    autoRotateEnabled
                      ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/40'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {autoRotateEnabled ? 'Rotación Automática: ACTIVA' : 'Rotación Automática: PAUSADA'}
                </button>

                <button
                  onClick={handleExecuteKeyRotation}
                  disabled={isRotatingKey}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors shadow-md shadow-amber-950/30 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRotatingKey ? 'animate-spin' : ''}`} />
                  <span>{isRotatingKey ? 'Rotando...' : 'Forzar Rotación Inmediata'}</span>
                </button>
              </div>
            </div>

            {/* Visual Lifecycle Pipeline: Active -> Pre-Staged Standby -> Grace Period -> Retired */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
              {/* Box 1: Active Key */}
              <div className="bg-emerald-950/20 border border-emerald-800/60 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-bold font-mono">1. LLAVE ACTIVA</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-base font-bold text-white font-mono">{activeKey.keyId}</div>
                <div className="text-xs text-slate-400">Firma autoritativa de mutaciones CMST y despacho VMSB.</div>
                <div className="pt-2 border-t border-emerald-900/40 text-[11px] font-mono text-emerald-300">
                  {activeKey.signaturesIssuedCount.toLocaleString()} firmas emitidas
                </div>
              </div>

              {/* Box 2: Pre-Staged Standby */}
              <div className="bg-cyan-950/20 border border-cyan-800/60 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-cyan-400 font-bold font-mono">2. PRE-STAGED STANDBY</span>
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                </div>
                <div className="text-base font-bold text-white font-mono">
                  {standbyKey ? standbyKey.keyId : 'Generando...'}
                </div>
                <div className="text-xs text-slate-400">Precalculada en segundo plano; lista para conmutación atómica en 0 ns.</div>
                <div className="pt-2 border-t border-cyan-900/40 text-[11px] font-mono text-cyan-300">
                  Ranura PMP-01 lista
                </div>
              </div>

              {/* Box 3: Grace Period Key */}
              <div className="bg-amber-950/20 border border-amber-800/60 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-amber-400 font-bold font-mono">3. PERIODO DE GRACIA</span>
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                </div>
                <div className="text-base font-bold text-white font-mono">Época #{activeKey.epoch - 1}</div>
                <div className="text-xs text-slate-400">Verificación de paquetes en tránsito (in-flight); rechazo de nuevas firmas.</div>
                <div className="pt-2 border-t border-amber-900/40 text-[11px] font-mono text-amber-300">
                  Ventana residual: 30s
                </div>
              </div>

              {/* Box 4: Zeroized / Retired */}
              <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-bold font-mono">4. RETIRADA & ZEROIZED</span>
                  <span className="w-2 h-2 rounded-full bg-slate-600" />
                </div>
                <div className="text-base font-bold text-slate-300 font-mono">Épocas &lt; #{activeKey.epoch - 1}</div>
                <div className="text-xs text-slate-400">Clave secreta sobrescrita con ceros en silicio. Registro Merkle preservado.</div>
                <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400">
                  Inmune a retroactividad
                </div>
              </div>
            </div>

            {/* Ephemeral Quantum Ratchet Diagram */}
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 font-mono flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  TRINQUETE CRIPTOGRÁFICO CUÁNTICO (QUANTUM-SAFE FORWARD SECRECY)
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Función Unidireccional: SHAKE-256 (FIPS 202)</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono py-2 overflow-x-auto">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-center min-w-[160px]">
                  <div className="text-slate-400 text-[10px]">Semilla de Hardware PUF</div>
                  <div className="font-bold text-purple-300 mt-1">Seed_Root (0x7f2...)</div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-600 shrink-0 hidden sm:block" />

                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-center min-w-[160px]">
                  <div className="text-slate-400 text-[10px]">Época #{activeKey.epoch - 1} (Pasada)</div>
                  <div className="font-bold text-amber-300 mt-1">Key_{activeKey.epoch - 1} [RETIRADA]</div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-600 shrink-0 hidden sm:block" />

                <div className="p-3 bg-slate-900 border border-cyan-800/80 rounded-lg text-center min-w-[160px] shadow-sm shadow-cyan-950">
                  <div className="text-cyan-400 text-[10px] font-semibold">Época #{activeKey.epoch} (ACTIVA)</div>
                  <div className="font-bold text-cyan-300 mt-1">{activeKey.keyId}</div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-600 shrink-0 hidden sm:block" />

                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-center min-w-[160px]">
                  <div className="text-slate-400 text-[10px]">Época #{activeKey.epoch + 1} (Futura)</div>
                  <div className="font-bold text-slate-300 mt-1">Key_{activeKey.epoch + 1} [ENCLAVE]</div>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                <span className="text-white font-medium">Garantía Matemática de Irreversibilidad:</span> Incluso si un atacante obtuviera acceso físico al silicio en el año 2035 y extrajera la clave de la época actual, es matemáticamente imposible derivar hacia atrás las claves de épocas pasadas debido a la preimagen unidireccional de SHAKE-256.
              </p>
            </div>
          </div>

          {/* Key Epochs Registry Table */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <History className="w-4 h-4 text-slate-400" />
                <span>Registro Histórico de Épocas & Compromisos Merkle Dilithium-5</span>
              </h4>
              <span className="text-xs text-slate-400 font-mono">Total {keys.length} Épocas Auditadas</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950/80 text-slate-400 font-mono border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Identificador / Época</th>
                    <th className="py-2.5 px-3">Esquema Criptográfico</th>
                    <th className="py-2.5 px-3">Fingerprint Público (Truncado)</th>
                    <th className="py-2.5 px-3">Enclave Hardware</th>
                    <th className="py-2.5 px-3">Firmas Emitidas</th>
                    <th className="py-2.5 px-3">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-mono">
                  {keys.map(k => (
                    <tr 
                      key={k.keyId}
                      onClick={() => setSelectedKeyId(k.keyId)}
                      className={`cursor-pointer transition-colors ${
                        k.keyId === selectedKeyId ? 'bg-slate-800/60' : 'hover:bg-slate-850/40'
                      }`}
                    >
                      <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                        {k.status === 'ACTIVE' && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                        {k.status === 'STANDBY' && <span className="w-2 h-2 rounded-full bg-cyan-400" />}
                        {k.status === 'GRACE_PERIOD' && <span className="w-2 h-2 rounded-full bg-amber-400" />}
                        {k.status === 'RETIRED' && <span className="w-2 h-2 rounded-full bg-slate-600" />}
                        <span>{k.keyId}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-300">{k.scheme}</td>
                      <td className="py-3 px-3 text-cyan-300 font-mono">{k.publicKeyFingerprint}</td>
                      <td className="py-3 px-3 text-slate-400">{k.hardwareTrapSlot}</td>
                      <td className="py-3 px-3 text-slate-200">
                        {k.signaturesIssuedCount.toLocaleString()} / {k.maxSignaturesPerEpoch.toLocaleString()}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`font-semibold ${
                          k.status === 'ACTIVE' ? 'text-emerald-400' :
                          k.status === 'STANDBY' ? 'text-cyan-400' :
                          k.status === 'GRACE_PERIOD' ? 'text-amber-400' : 'text-slate-500'
                        }`}>
                          {k.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Selected Key Details Inspector */}
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
              <div className="text-xs font-bold text-slate-200">Detalles de Enclave para: {selectedKey.keyId}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono text-slate-400 pt-1">
                <div>
                  <span className="text-slate-400">Compromiso Merkle de Época:</span>
                  <div className="text-cyan-300 break-all text-[11px] mt-0.5">{selectedKey.merkleEpochCommitment}</div>
                </div>
                <div>
                  <span className="text-slate-400">Hash de Época Previa (Encadenado):</span>
                  <div className="text-slate-300 break-all text-[11px] mt-0.5">{selectedKey.previousKeyEpochHash || 'Génesis de Red'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 3: ZERO-KNOWLEDGE PROOFS (ZKP) WITHOUT CRITICAL DATA EXPOSURE
      ========================================================================= */}
      {activeSubTab === 'zero_exposure_zkp' && (
        <div className="space-y-6">
          {/* Conceptual Zero-Exposure Explainer Card */}
          <div className="bg-gradient-to-r from-emerald-950/30 via-slate-900 to-slate-900 border border-emerald-800/40 rounded-2xl p-5 md:p-6 space-y-4">
            <div className="flex items-center gap-3">
              <EyeOff className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Atestación ZKP con Aislamiento Total: Cero Exposición de Datos Críticos
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Garantía matemática formal: La red y los auditores validan que la infraestructura cumple con el 100% de las normas de seguridad y ambientales sin revelar información confidencial de clientes, registros SCADA ni claves privadas.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-emerald-900/40">
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
                <div className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Lo que NUNCA Sale del Silicio</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Claves privadas, registros SCADA de voltaje/frecuencia, cargas de trabajo de clientes corporativos y tablas de enrutamiento internas. Todo se computa en memoria Ring-0 protegida por RISC-V PMP y se destruye tras evaluar las restricciones R1CS.
                </p>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
                <div className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  <span>El Testigo Matemático (Witness)</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  El motor zk-SNARK (Circom / Groth16) genera un polinomio algebraico donde las incógnitas privadas satisfacen la ecuación: <span className="text-cyan-300 font-mono">A(x) · B(x) - C(x) = H(x) · T(x)</span>. El testigo es efímero y se zeroiza en nanosegundos.
                </p>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Lo que la Red y los Auditores Ven</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Únicamente una prueba escalar compacta de 128 bytes: <span className="text-emerald-300 font-mono">(pi_a, pi_b, pi_c)</span> y el hash público de estado. La verificación toma ~1.8 ms con certeza de cero conocimiento.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Circuit Verification Playground */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>Circuitos Circom zk-SNARK Activos en el Protocolo</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Seleccione un circuito para inspeccionar la separación estricta entre el testigo privado y las señales públicas.
                </p>
              </div>

              <button
                onClick={() => handleGenerateZeroExposureProof(selectedCircuit)}
                disabled={isComputingProof}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-colors shrink-0 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isComputingProof ? 'animate-spin' : ''}`} />
                <span>{isComputingProof ? 'Calculando Prueba ZK...' : 'Verificar Prueba ZK en Tiempo Real'}</span>
              </button>
            </div>

            {/* Circuit Selector Pills/Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {ZERO_EXPOSURE_ZK_CIRCUITS.map(circuit => (
                <button
                  key={circuit.circuitId}
                  onClick={() => setSelectedCircuitId(circuit.circuitId)}
                  className={`text-left p-3.5 rounded-xl border transition-all ${
                    circuit.circuitId === selectedCircuitId
                      ? 'bg-slate-850 border-cyan-500/80 shadow-md shadow-cyan-950/40'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-cyan-400">{circuit.provingScheme}</span>
                    <span className="text-slate-400">{circuit.provingTimeMs} ms</span>
                  </div>
                  <div className="font-bold text-white text-sm mt-1">{circuit.name}</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">{circuit.fileName}</div>
                  <div className="text-[10px] text-slate-400 mt-2 font-mono">
                    {circuit.constraintsCount.toLocaleString()} restricciones R1CS
                  </div>
                </button>
              ))}
            </div>

            {/* Side-by-Side Comparison: Protected Private Witness VS Public Visible Proof */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-3 border-t border-slate-800">
              {/* Left Column: Private Witness (Protected / Zero-Exposure) */}
              <div className="bg-slate-950/90 border border-rose-900/40 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-400 font-mono flex items-center gap-1.5">
                    <EyeOff className="w-4 h-4 text-rose-400" />
                    TESTIGO PRIVADO: REDACTADO / EN SILICIO (ZERO-EXPOSURE)
                  </span>
                  <span className="text-[10px] text-rose-400 font-mono">ACCESO DENEGADO A AUDITORES</span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Los siguientes datos se evalúan estrictamente dentro de los registros del procesador local y <span className="text-rose-300 font-semibold">NUNCA son transmitidos por red ni almacenados en disco</span>:
                </p>

                <div className="space-y-1.5">
                  {selectedCircuit.protectedConfidentialData.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-slate-900 border border-rose-950/60 rounded-lg text-xs font-mono">
                      <span className="text-rose-500 font-bold">●</span>
                      <span className="text-slate-300">{item}</span>
                      <span className="ml-auto text-[10px] text-rose-400 bg-rose-950/60 px-1.5 py-0.5 rounded">BLINDADO</span>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-rose-950/20 border border-rose-900/30 rounded-lg text-xs text-rose-300 leading-relaxed">
                  <span className="font-bold">Principio de No Divulgación:</span> El verificador jamás puede reconstruir estos valores, incluso si posee poder de cómputo cuántico ilimitado (teorema de simulación perfecta de ZK).
                </div>
              </div>

              {/* Right Column: Public Visible Signals (Shared Over Network) */}
              <div className="bg-slate-950/90 border border-emerald-900/40 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    SEÑALES PÚBLICAS & PRUEBA SCALAR (AUDITABLE)
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">100% VERIFICABLE</span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Información matemática transmitida al resto de la red descentralizada para verificar la legalidad del estado sin revelar secretos:
                </p>

                <div className="space-y-1.5">
                  {selectedCircuit.publicSignalsShared.map((signal, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-slate-900 border border-emerald-950/60 rounded-lg text-xs font-mono">
                      <span className="text-emerald-400 font-bold">✔</span>
                      <span className="text-slate-300">{signal}</span>
                      <span className="ml-auto text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded">PÚBLICO</span>
                    </div>
                  ))}
                </div>

                {/* Proof Scalar Sample */}
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1.5 text-xs font-mono">
                  <div className="text-slate-400 text-[11px] font-semibold">Tupla Escalar Groth16 Verificada:</div>
                  <div className="text-slate-300 text-[11px] truncate">pi_A = {selectedCircuit.sampleProofScalar.piA}</div>
                  <div className="text-slate-300 text-[11px] truncate">pi_B = {selectedCircuit.sampleProofScalar.piB}</div>
                  <div className="text-slate-300 text-[11px] truncate">pi_C = {selectedCircuit.sampleProofScalar.piC}</div>
                  <div className="text-emerald-400 text-[11px] pt-1 border-t border-slate-800 font-bold">
                    Hash de Estado: {selectedCircuit.sampleProofScalar.publicStateHash}
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Result Feedback Box */}
            {verifiedProofResult && (
              <div className="p-4 bg-emerald-950/30 border border-emerald-800/60 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                <div className="space-y-1">
                  <div className="text-emerald-400 font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>VERIFICACIÓN MATEMÁTICA CONCLUIDA: VÁLIDA (TRUE)</span>
                  </div>
                  <div className="text-slate-300">
                    Circuito: <span className="text-white">{selectedCircuit.fileName}</span> · Restricciones: <span className="text-white">{verifiedProofResult.constraintsCount.toLocaleString()}</span> · Tiempo de prueba: <span className="text-cyan-300">{verifiedProofResult.provingTimeMs} ms</span>
                  </div>
                </div>

                <div className="text-slate-400 text-right">
                  <div>Digest: <span className="text-cyan-300">{verifiedProofResult.proofDigest}</span></div>
                  <div className="text-[10px] text-emerald-400 font-semibold">0 fugas de texto plano garantizadas</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 4: QUANTUM THREAT DEFENSE MATRIX
      ========================================================================= */}
      {activeSubTab === 'threat_matrix' && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 md:p-6 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                <span>Matriz de Inmunidad frente a Vectores de Criptoanálisis Cuántico</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
                Evaluación técnica de resistencia frente a algoritmos de computación cuántica ofensiva (Shor, Grover, BKZ) y ataques físicos de canal lateral en hardware crítico.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {PQC_THREAT_DEFENSE_VECTORS.map(vector => (
                <div key={vector.id} className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span>{vector.threatName}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {vector.riskEvaluation}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                        {vector.mitigationStatus}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                    <div className="space-y-1">
                      <div className="text-slate-400 text-[11px] font-medium">Método de Ataque Cuántico / Físico:</div>
                      <p className="text-slate-300 leading-relaxed">{vector.quantumMethod}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="text-cyan-400 text-[11px] font-medium">Mecanismo de Defensa T-VS30:</div>
                      <p className="text-slate-300 leading-relaxed">{vector.tVs30DefenseMechanism}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Margen de Seguridad: <span className="text-emerald-400">{vector.mathematicalMargin}</span></span>
                    <span className="text-slate-400">IEC 62443 SL-4 Homologado</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 5: LIVE EVENT STREAM & AUDIT LOGS
      ========================================================================= */}
      {activeSubTab === 'event_stream' && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-purple-400" />
                  <span>Flujo en Tiempo Real de Firmas Dilithium-5 y Atestaciones de Silicio</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Cada firma valida mutaciones de topología, rotaciones de claves o telemetría en tiempo constante.
                </p>
              </div>

              {/* Event filter tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setEventFilter('ALL')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    eventFilter === 'ALL' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setEventFilter('ROTATION')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    eventFilter === 'ROTATION' ? 'bg-slate-800 text-amber-300 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Rotaciones
                </button>
                <button
                  onClick={() => setEventFilter('DILITHIUM')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    eventFilter === 'DILITHIUM' ? 'bg-slate-800 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Firmas
                </button>
              </div>
            </div>

            {/* Event List */}
            <div className="space-y-2.5">
              {dilithiumEvents.map(evt => (
                <div key={evt.signatureId} className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-1.5 text-xs font-mono">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{evt.signatureId}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-cyan-300">{evt.targetProcess}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-purple-300">{evt.scheme}</span>
                    </div>

                    <div className="flex items-center gap-3 text-slate-400">
                      <span>{evt.timestamp}</span>
                      <span className="text-emerald-400 font-bold">{evt.status}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-slate-400 text-[11px]">
                    <div>Nodo Firmante: <span className="text-slate-200">{evt.signerNodeId}</span> (Enclave: {evt.hardwareTrapSlot})</div>
                    <div>Latencia NTT: <span className="text-cyan-400">{evt.verificationLatencyMicros} μs</span> (Constant-Time: SÍ)</div>
                  </div>

                  <div className="text-[10px] text-slate-400 truncate pt-1 border-t border-slate-900">
                    Merkle Digest: {evt.merkleDigest}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
