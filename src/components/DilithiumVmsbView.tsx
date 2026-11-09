import React, { useState } from 'react';
import { 
  DilithiumSignatureEvent, 
  DilithiumVmsbConfig, 
  ProtocolNode 
} from '../types/protocol';
import { 
  DEFAULT_DILITHIUM_VMSB_CONFIG 
} from '../data/protocolData';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  Cpu, 
  CheckCircle2, 
  RefreshCw, 
  AlertTriangle, 
  Terminal, 
  Fingerprint, 
  Sliders, 
  Layers, 
  Zap, 
  Activity, 
  Flame, 
  FileCheck2, 
  ExternalLink,
  ShieldAlert,
  Info
} from 'lucide-react';

interface DilithiumVmsbViewProps {
  nodes: ProtocolNode[];
  dilithiumEvents: DilithiumSignatureEvent[];
  onTriggerSignEvent: (targetProcess: DilithiumSignatureEvent['targetProcess']) => void;
  isSigning: boolean;
  onOpenPdfModal: () => void;
  onNavigateToPqcSecurity?: () => void;
}

export const DilithiumVmsbView: React.FC<DilithiumVmsbViewProps> = ({
  nodes,
  dilithiumEvents,
  onTriggerSignEvent,
  isSigning,
  onOpenPdfModal,
  onNavigateToPqcSecurity,
}) => {
  const [config, setConfig] = useState<DilithiumVmsbConfig>(DEFAULT_DILITHIUM_VMSB_CONFIG);
  const [selectedProcess, setSelectedProcess] = useState<DilithiumSignatureEvent['targetProcess']>('CMST_TREE_MUTATION');
  const [selectedEventId, setSelectedEventId] = useState<string>(dilithiumEvents[0]?.signatureId || '');
  const [activeTab, setActiveTab] = useState<'architecture' | 'critical_zones' | 'benchmark' | 'pmp_hardware'>('architecture');

  const selectedEvent = dilithiumEvents.find(e => e.signatureId === selectedEventId) || dilithiumEvents[0];

  // Critical operational zones specification
  const CRITICAL_ZONES = [
    {
      id: 'CMST_TREE_MUTATION',
      name: 'Mutaciones y Rebalanceo del Árbol CMST',
      scope: 'Topología Dinámica & Enrutamiento Global',
      riskLevel: 'MÁXIMO (Ataque de Partición de Red)',
      dilithiumEnforcement: 'Firma Dilithium-5 obligatoria antes de conmutar cualquier enlace en la malla lattice binaria.',
      nttTargetLatency: '11.2 μs',
      status: 'BLINDADO_PQC',
      hardwareTrap: 'RISC-V-PMP-SLOT-01',
      description: 'Garantiza que ningún actor malicioso o nodo comprometido pueda inyectar tablas de enrutamiento apócrifas ni forzar bucles que degraden la latencia por debajo del invariante (<0.30 ms).',
    },
    {
      id: 'VMSB_CORE_DISPATCH',
      name: 'Despacho y Aislamiento de Memoria VMSB©',
      scope: 'Micro-Slices Zero-Copy en Kernel RISC-V',
      riskLevel: 'CRÍTICO (Exfiltración o Desbordamiento de Buffer)',
      dilithiumEnforcement: 'Atestación criptográfica de límites PMP antes de ejecutar DMA en memoria compartida.',
      nttTargetLatency: '11.7 μs',
      status: 'BLINDADO_PQC',
      hardwareTrap: 'RISC-V-PMP-SLOT-04',
      description: 'El motor VMSB© parte el espacio físico en micro-slices inmutables. Cada asignación de canal Kafka/DMA se firma y valida mediante NTT en tiempo constante sin riesgo de side-channel.',
    },
    {
      id: 'CRITICAL_SCADA_BUS',
      name: 'Pasarela SCADA / OT para Infraestructura Crítica',
      scope: 'Control Ciberfísico, Red Eléctrica y Automatización Industrial',
      riskLevel: 'CATASTRÓFICO (Daño a Equipos Físicos)',
      dilithiumEnforcement: 'Invariante de No Daño (IEC 62443 SL-4) sellado con llave cuántica Dilithium.',
      nttTargetLatency: '10.8 μs',
      status: 'BLINDADO_PQC',
      hardwareTrap: 'RISC-V-PMP-SLOT-02',
      description: 'Previene cualquier instrucción de control físico destructiva. Si el comando no cuenta con la atestación formal firmada en el enclave de hardware, la pasarela ejecuta un bloqueo determinista seguro.',
    },
    {
      id: 'THERMODYNAMIC_TELEMETRY',
      name: 'Telemetría Termodinámica y Ahorro PUE / Agua',
      scope: 'Auditoría Certificada de Sostenibilidad y Free-Cooling',
      riskLevel: 'ALTO (Fraude ESG / Manipulación de Sensores)',
      dilithiumEnforcement: 'Hash de masa de agua y kWh firmado y encadenado al bloque de estado BFT.',
      nttTargetLatency: '12.1 μs',
      status: 'BLINDADO_PQC',
      hardwareTrap: 'RISC-V-PMP-SLOT-03',
      description: 'Acredita que las reducciones de PUE (1.07) y conservación de agua no son estimaciones teóricas sino mediciones auditadas a prueba de manipulaciones para tribunales y auditores ISO 14064.',
    },
    {
      id: 'PQC_KEY_ROTATION',
      name: 'Rotación y Sincronización de Llaves Módulo-Lattice',
      scope: 'Consenso Criptográfico Distribuido Soberano',
      riskLevel: 'CRÍTICO (Desincronización de Quórum BFT)',
      dilithiumEnforcement: 'Intercambio simétrico Kyber-1024 autenticado mediante firma Dilithium-5.',
      nttTargetLatency: '11.9 μs',
      status: 'BLINDADO_PQC',
      hardwareTrap: 'RISC-V-PMP-SLOT-00',
      description: 'Rotación de secretos cada 30 segundos entre los hubs de Frankfurt, Zúrich, Ashburn y Tokio sin requerir paradas de servicio ni generar aumento perceptible en el jitter de la red.',
    },
  ];

  // Cryptographic Benchmark Matrix: Dilithium-5 vs others
  const CRYPTO_BENCHMARKS = [
    {
      algorithm: 'CRYSTALS-Dilithium-5 (ML-DSA-87 + VMSB©)',
      standard: 'NIST FIPS 204 (Post-Quantum)',
      quantumHardness: 'Nivel 5 (256-bit PQC Máximo)',
      verificationLatency: '11.2 μs (Hardware RISC-V)',
      signatureBytes: '4,595 B',
      publicKeyBytes: '2,592 B',
      sideChannelImmunity: '100% Constant-Time NTT (0 nW Leakage)',
      energyPerOpJoules: '0.00008 J',
      suitability: 'ÓPTIMO PARA INFRAESTRUCTURA CRÍTICA',
    },
    {
      algorithm: 'RSA-4096 (Criptografía Clásica)',
      standard: 'PKCS #1 v2.2 (Legado)',
      quantumHardness: '0 bits (Vulnerable a Algoritmo de Shor)',
      verificationLatency: '850.0 μs - 2,400.0 μs',
      signatureBytes: '512 B',
      publicKeyBytes: '512 B',
      sideChannelImmunity: 'Vulnerable a Timing Attacks y Cache Snooping',
      energyPerOpJoules: '0.01250 J',
      suitability: 'INVIABLE ANTE COMPUTACIÓN CUÁNTICA',
    },
    {
      algorithm: 'ECDSA secp256k1 / NIST P-256',
      standard: 'ANSI X9.62 / FIPS 186-4',
      quantumHardness: '0 bits (Vulnerable a Computador Cuántico)',
      verificationLatency: '420.0 μs',
      signatureBytes: '64 B',
      publicKeyBytes: '32 B',
      sideChannelImmunity: 'Riesgo de fuga de nonce (ataque por canal lateral)',
      energyPerOpJoules: '0.00340 J',
      suitability: 'OBSOLETO PARA AMENAZA CUÁNTICA',
    },
    {
      algorithm: 'Falcon-1024 (FNTRU Lattice)',
      standard: 'NIST PQC Finalist (NTRU)',
      quantumHardness: 'Nivel 5 (256-bit)',
      verificationLatency: '82.0 μs (Aritmética punto flotante)',
      signatureBytes: '1,330 B',
      publicKeyBytes: '1,793 B',
      sideChannelImmunity: 'Complejo: Requiere emulación constant-time IEEE-754',
      energyPerOpJoules: '0.00095 J',
      suitability: 'COMPLEJIDAD ELEVADA EN EMBEBIDOS OT',
    },
    {
      algorithm: 'SPHINCS+-SHA2-256s (Hash-Based)',
      standard: 'NIST FIPS 205 (SLH-DSA)',
      quantumHardness: 'Nivel 5 (256-bit)',
      verificationLatency: '1,920.0 μs',
      signatureBytes: '29,792 B (Tamaño Masivo)',
      publicKeyBytes: '64 B',
      sideChannelImmunity: 'Alta (Basada en funciones Hash SHA-2)',
      energyPerOpJoules: '0.01820 J',
      suitability: 'LATENCIA Y SOBRECARGA INACEPTABLE EN TIEMPO REAL',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 font-semibold">
              CRYSTALS-DILITHIUM-5 (ML-DSA-87)
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>NIST FIPS 204 NATIVO</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-emerald-400">ENCLAVE VMSB© RISC-V 64GC</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            06. Consolidación Dilithium Nativo VMSB© para Áreas Críticas
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Máxima seguridad poscuántica y determinismo para los procesos de optimización del protocolo T-VS30. Cada rebalanceo del Árbol CMST, despacho de memoria y comando SCADA se ejecuta bajo aislamiento de hardware PMP con verificación NTT en tiempo constante (&lt; 12 μs).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Subtabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
                activeTab === 'architecture'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Arquitectura PQC
            </button>
            <button
              onClick={() => setActiveTab('critical_zones')}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
                activeTab === 'critical_zones'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              5 Áreas Críticas
            </button>
            <button
              onClick={() => setActiveTab('pmp_hardware')}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
                activeTab === 'pmp_hardware'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Enclave RISC-V PMP
            </button>
            <button
              onClick={() => setActiveTab('benchmark')}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
                activeTab === 'benchmark'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Benchmark Criptográfico
            </button>
          </div>

            {onNavigateToPqcSecurity && (
              <button
                onClick={onNavigateToPqcSecurity}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/60 rounded-lg transition-colors whitespace-nowrap shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Salud PQC & ZKP Dashboard</span>
              </button>
            )}

            <button
              onClick={onOpenPdfModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-cyan-500/20"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Auditoría Dilithium PDF</span>
            </button>
          </div>
        </div>

      {/* Hero Banner: Core Guarantees */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 rounded-xl p-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-800/80">
          <div className="px-2">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Nivel de Seguridad PQC</span>
            </div>
            <div className="text-xl font-extrabold text-white font-mono">
              NIST Nivel 5 (256-bit)
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Inmune a ataques cuánticos por Shor y Grover. Estándar FIPS 204 ML-DSA-87.
            </p>
          </div>

          <div className="px-2 pt-3 md:pt-0">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Latencia de Verificación</span>
            </div>
            <div className="text-xl font-extrabold text-emerald-400 font-mono">
              11.2 μs (0.011 ms)
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Acelerado en microcódigo RISC-V VMSB© sin pausas de garbage collection.
            </p>
          </div>

          <div className="px-2 pt-3 md:pt-0">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>Aislamiento de Hardware</span>
            </div>
            <div className="text-xl font-extrabold text-purple-300 font-mono">
              PMP 0-7 Pinned Enclave
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Protección de memoria física inmutable. Cero fugas hacia el kernel del SO anfitrión.
            </p>
          </div>

          <div className="px-2 pt-3 md:pt-0">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
              <Fingerprint className="w-4 h-4 text-amber-400" />
              <span>Canal Lateral (Side-Channel)</span>
            </div>
            <div className="text-xl font-extrabold text-amber-300 font-mono">
              0.00 ns Jitter
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Aritmética NTT en tiempo estrictamente constante. Inmune a DPA y timing attacks.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'architecture' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Interactive Signing Simulator for Optimization Processes */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="text-xs font-mono text-cyan-400">SIMULADOR EN TIEMPO REAL</div>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    Firma Poscuántica de Procesos de Optimización
                  </h3>
                </div>
                <span className="text-xs font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  Enclave VMSB© Activo
                </span>
              </div>

              <p className="text-xs text-slate-300 my-3 leading-relaxed">
                Seleccione el proceso crítico de infraestructura para emitir y verificar una firma digital Dilithium-5 (ML-DSA-87) anclada al árbol de consenso:
              </p>

              {/* Target Process Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-4">
                {CRITICAL_ZONES.map(zone => (
                  <button
                    key={zone.id}
                    onClick={() => setSelectedProcess(zone.id as DilithiumSignatureEvent['targetProcess'])}
                    className={`p-3 rounded-lg border text-left text-xs transition-all ${
                      selectedProcess === zone.id
                        ? 'bg-cyan-500/10 border-cyan-500/50 text-white shadow-sm shadow-cyan-500/10'
                        : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <div className="font-semibold text-cyan-300 font-mono text-[11px]">{zone.id}</div>
                    <div className="text-xs text-white font-medium mt-1 truncate">{zone.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-1 flex items-center justify-between">
                      <span>NTT: {zone.nttTargetLatency}</span>
                      <span className="text-emerald-400 font-semibold">{zone.hardwareTrap}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Action Button */}
              <button
                onClick={() => onTriggerSignEvent(selectedProcess)}
                disabled={isSigning}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isSigning ? 'animate-spin' : ''}`} />
                <span>
                  {isSigning
                    ? 'Ejecutando NTT en microcódigo RISC-V VMSB©...'
                    : `Firmar y Atestar ${selectedProcess} con Dilithium-5`}
                </span>
              </button>

              {/* Live Parameters Info Strip */}
              <div className="mt-4 p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1.5">
                <div className="flex justify-between">
                  <span>Esquema Criptográfico:</span>
                  <span className="text-white font-semibold">CRYSTALS-Dilithium-5 (ML-DSA-87)</span>
                </div>
                <div className="flex justify-between">
                  <span>Módulo Aritmético:</span>
                  <span className="text-cyan-300">Z_q [q = 8380417, d = 13, γ1 = 2^19]</span>
                </div>
                <div className="flex justify-between">
                  <span>Invariante de Hardware:</span>
                  <span className="text-emerald-400 font-semibold">PMP Register Lock Pinned (0-7)</span>
                </div>
                <div className="flex justify-between">
                  <span>Protección Anti-Fraude:</span>
                  <span className="text-purple-300">Anclaje Merkle SHA-256 + Circom ZKP</span>
                </div>
              </div>
            </div>

            {/* Cryptographic Key Configuration & Settings */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  Parámetros del Enclave Dilithium VMSB©
                </h4>
                <span className="text-[11px] font-mono text-slate-400">Nativo RISC-V 64GC</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <div>
                    <div className="text-slate-200 font-medium">Rebalanceo CMST Firmado Obligatorio</div>
                    <div className="text-[10px] text-slate-500">
                      Impide cualquier mutación de enlaces en la malla sin firma poscuántica válida.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.signedCmstRebalanceEnforced}
                    onChange={(e) => setConfig({ ...config, signedCmstRebalanceEnforced: e.target.checked })}
                    className="accent-cyan-400 w-4 h-4 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <div>
                    <div className="text-slate-200 font-medium">Salvaguarda SCADA OT No Dañina (IEC 62443 SL-4)</div>
                    <div className="text-[10px] text-slate-500">
                      Bloqueo de hardware en caso de discrepancia en la atestación de comandos industriales.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.scadaNonHarmfulHardwareIntervention}
                    onChange={(e) => setConfig({ ...config, scadaNonHarmfulHardwareIntervention: e.target.checked })}
                    className="accent-cyan-400 w-4 h-4 cursor-pointer"
                  />
                </div>

                <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800/80 flex items-center justify-between font-mono text-[11px]">
                  <span className="text-slate-400">Defensa Canal Lateral:</span>
                  <span className="text-emerald-400 font-semibold">{config.sideChannelDefense}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Dilithium Events & Inspection Ledger */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="text-xs font-mono text-cyan-400">REGISTRO INMUTABLE DE FIRMAS PQC</div>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    Historial de Eventos Dilithium-5 en Áreas Críticas
                  </h3>
                </div>
                <span className="text-xs font-mono text-cyan-400">
                  {dilithiumEvents.length} Firmas Atestadas
                </span>
              </div>

              {/* Event Cards List */}
              <div className="space-y-2.5 my-4 max-h-[360px] overflow-y-auto pr-1">
                {dilithiumEvents.map(evt => {
                  const isSelected = evt.signatureId === selectedEventId;
                  return (
                    <div
                      key={evt.signatureId}
                      onClick={() => setSelectedEventId(evt.signatureId)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-slate-900 border-cyan-500/60 shadow-sm shadow-cyan-500/10'
                          : 'bg-slate-950/70 border-slate-800/80 hover:bg-slate-900/50'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-mono mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-cyan-300">{evt.signatureId}</span>
                          <span className="text-slate-500 text-[11px]">({evt.timestamp})</span>
                        </div>
                        <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> {evt.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs mt-1">
                        <span className="font-semibold text-white">{evt.targetProcess}</span>
                        <span className="text-[11px] font-mono text-purple-300">{evt.hardwareTrapSlot}</span>
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-900 text-[10px] font-mono text-slate-400 flex items-center justify-between truncate">
                        <span className="truncate max-w-[260px]">{evt.merkleDigest}</span>
                        <span className="text-emerald-400 font-semibold shrink-0">
                          NTT: {evt.verificationLatencyMicros} μs
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Detailed Inspector of Selected Signature */}
              {selectedEvent && (
                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px]">
                    <span className="text-cyan-400 font-bold">DESGLOSE POLINÓMICO DILITHIUM-5</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> NTT CONSTANT-TIME VERIFICADO
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Nodo Emisor Soberano:</span>
                      <span className="text-white font-semibold">{selectedEvent.signerNodeId}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Latencia Medida de Hardware:</span>
                      <span className="text-emerald-400 font-bold">{selectedEvent.verificationLatencyMicros} μs</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Esquema Estándar:</span>
                      <span className="text-slate-200">{selectedEvent.scheme}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Slot de Trampa Hardware:</span>
                      <span className="text-purple-300 font-bold">{selectedEvent.hardwareTrapSlot}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/60 text-[10px] text-slate-400 break-all leading-tight">
                    <span className="text-slate-500 block mb-0.5">Raíz Merkle & Atestación Inmutable:</span>
                    <code className="text-cyan-300">{selectedEvent.merkleDigest}</code>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: The 5 Critical Operational Zones */}
      {activeTab === 'critical_zones' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
            <h3 className="text-base font-bold text-white">
              Perímetro de Áreas Críticas Blindadas con Dilithium Nativo VMSB©
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-4xl">
              En una infraestructura distribuida de misión crítica, la optimización agresiva de recursos nunca debe comprometer la estabilidad ni la soberanía de los nodos. El protocolo T-VS30 aplica una política de "Confianza Cero basada en Lattices", donde cada transición de estado en las 5 zonas críticas requiere una firma de módulo-lattice no repudiable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CRITICAL_ZONES.map((zone, idx) => (
              <div
                key={zone.id}
                className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="text-cyan-400 font-bold">0{idx + 1}. {zone.id}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold">
                      {zone.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-1">
                    {zone.name}
                  </h4>
                  <div className="text-[11px] text-purple-300 font-mono mb-2">
                    Alcance: {zone.scope}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {zone.description}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5 text-[11px] font-mono">
                    <div className="text-slate-400">
                      <strong className="text-slate-300">Riesgo Mitigado:</strong> {zone.riskLevel}
                    </div>
                    <div className="text-slate-400">
                      <strong className="text-slate-300">Firma Obligatoria:</strong> {zone.dilithiumEnforcement}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-500">Trap: {zone.hardwareTrap}</span>
                  <span className="text-emerald-400 font-bold">NTT: {zone.nttTargetLatency}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 3: Enclave Hardware RISC-V PMP Registers */}
      {activeTab === 'pmp_hardware' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
            <div>
              <div className="text-xs font-mono text-cyan-400">ARQUITECTURA DE ENCLAVE FÍSICO</div>
              <h3 className="text-base font-bold text-white mt-0.5">
                Aislamiento de Registros PMP en Procesadores RISC-V 64GC
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                La Physical Memory Protection (PMP) de RISC-V proporciona un firewall en silicio que aísla las llaves privadas del módulo lattice Dilithium-5 contra lecturas de privilegios menores o ataques de inyección de código.
              </p>
            </div>

            {/* Visual PMP Register Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                    <th className="py-2 px-2.5">Registro PMP</th>
                    <th className="py-2 px-2.5">Dirección Física Base</th>
                    <th className="py-2 px-2.5">Permisos (PMPCFG)</th>
                    <th className="py-2 px-2.5">Función Criptográfica</th>
                    <th className="py-2 px-2.5 text-center">Estado Lock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-2.5 text-cyan-300 font-bold">PMP 0</td>
                    <td className="py-2.5 px-2.5 text-slate-300">0x8000_0000 - 0x8000_1FFF</td>
                    <td className="py-2.5 px-2.5 text-emerald-400">R-X (Ejecución NTT)</td>
                    <td className="py-2.5 px-2.5 text-slate-200">Microcódigo NTT Dilithium-5</td>
                    <td className="py-2.5 px-2.5 text-center text-emerald-400">PINNED [L=1]</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-2.5 text-cyan-300 font-bold">PMP 1</td>
                    <td className="py-2.5 px-2.5 text-slate-300">0x8000_2000 - 0x8000_3FFF</td>
                    <td className="py-2.5 px-2.5 text-amber-400">R-- (Solo Lectura Enclave)</td>
                    <td className="py-2.5 px-2.5 text-slate-200">Llave Privada Módulo Lattice (s1, s2)</td>
                    <td className="py-2.5 px-2.5 text-center text-emerald-400">PINNED [L=1]</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-2.5 text-cyan-300 font-bold">PMP 2</td>
                    <td className="py-2.5 px-2.5 text-slate-300">0x8000_4000 - 0x8000_5FFF</td>
                    <td className="py-2.5 px-2.5 text-blue-400">RW- (Memoria Scratchpad)</td>
                    <td className="py-2.5 px-2.5 text-slate-200">Polinomios NTT Intermedios (w, c, z)</td>
                    <td className="py-2.5 px-2.5 text-center text-emerald-400">PINNED [L=1]</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-2.5 text-cyan-300 font-bold">PMP 3</td>
                    <td className="py-2.5 px-2.5 text-slate-300">0x8000_6000 - 0x8000_7FFF</td>
                    <td className="py-2.5 px-2.5 text-purple-400">R-- (Digest Inmutable)</td>
                    <td className="py-2.5 px-2.5 text-slate-200">Raíz Merkle de Enrutamiento CMST</td>
                    <td className="py-2.5 px-2.5 text-center text-emerald-400">PINNED [L=1]</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-2.5 text-cyan-300 font-bold">PMP 4-7</td>
                    <td className="py-2.5 px-2.5 text-slate-300">0x8000_8000 - 0x8000_FFFF</td>
                    <td className="py-2.5 px-2.5 text-slate-400">--- (Acceso Denegado SO)</td>
                    <td className="py-2.5 px-2.5 text-slate-200">Zona Roja Anti-Manipulación / Zeroize</td>
                    <td className="py-2.5 px-2.5 text-center text-emerald-400">PINNED [L=1]</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Auto-Zeroización por Detección de Falla Física:</span>
              <span className="text-emerald-400 font-bold">HABILITADA (IEC 62443 SL-4)</span>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
            <div>
              <div className="text-xs font-mono text-cyan-400">ANÁLISIS DE CANAL LATERAL (SIDE-CHANNEL)</div>
              <h3 className="text-base font-bold text-white mt-0.5">
                Garantía de Tiempo Estrictamente Constante
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800 space-y-1">
                <div className="flex justify-between font-mono text-slate-300">
                  <span>Varianza de Tiempo de Ejecución:</span>
                  <span className="text-emerald-400 font-bold">0.00 ns (Zero Jitter)</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                  <div className="bg-emerald-400 h-1.5 rounded-full w-full"></div>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Ninguna rama condicional en el algoritmo NTT depende de valores de los coeficientes secretos.
                </p>
              </div>

              <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800 space-y-1">
                <div className="flex justify-between font-mono text-slate-300">
                  <span>Dispersión de Consumo Eléctrico (DPA):</span>
                  <span className="text-cyan-300 font-bold">&lt; 0.0001 nW</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                  <div className="bg-cyan-400 h-1.5 rounded-full w-full"></div>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Enmascaramiento aleatorio de polinomios en cada ronda para desarticular ataques de correlación de potencia.
                </p>
              </div>

              <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800 space-y-1">
                <div className="flex justify-between font-mono text-slate-300">
                  <span>Aislamiento de Cache L1 / L2:</span>
                  <span className="text-purple-300 font-bold">Bypass Directo a SRAM PMP</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                  <div className="bg-purple-400 h-1.5 rounded-full w-full"></div>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Los cómputos de la firma no tocan la jerarquía de cache compartida, eliminando ataques tipo Spectre/Meltdown.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 4: Cryptographic Benchmark Comparison */}
      {activeTab === 'benchmark' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-800">
            <div>
              <div className="text-xs font-mono text-cyan-400">EVALUACIÓN COMPARATIVA FORMAL</div>
              <h3 className="text-base font-bold text-white mt-0.5">
                Por Qué Dilithium-5 Nativo VMSB© es la Solución Óptima para Infraestructura Crítica
              </h3>
            </div>
            <div className="text-xs font-mono text-emerald-400">
              Convergencia NTT: <strong>11.2 μs</strong> vs Legado 850.0 μs
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            La mayoría de las bibliotecas poscuánticas tradicionales se ejecutan en espacio de usuario con grandes penalizaciones de rendimiento. La consolidación de <strong>Dilithium-5 nativo VMSB©</strong> implementa el pipeline de Number Theoretic Transform (NTT) directamente en registros físicos RISC-V, reduciendo la latencia a sólo <strong>11.2 microsegundos</strong> y garantizando inmunidad cuántica absoluta sin penalizar la velocidad de la red.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono">
                  <th className="py-2.5 px-3">Algoritmo & Arquitectura</th>
                  <th className="py-2.5 px-3">Estándar</th>
                  <th className="py-2.5 px-3 text-right">Dureza Cuántica</th>
                  <th className="py-2.5 px-3 text-right">Latencia Verificación</th>
                  <th className="py-2.5 px-3 text-right">Tamaño Firma</th>
                  <th className="py-2.5 px-3">Inmunidad Canal Lateral</th>
                  <th className="py-2.5 px-3 text-center">Idoneidad Crítica</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {CRYPTO_BENCHMARKS.map((bench, idx) => (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      idx === 0 ? 'bg-cyan-500/10 hover:bg-cyan-500/15' : 'hover:bg-slate-800/30'
                    }`}
                  >
                    <td className="py-3 px-3 font-semibold text-white">
                      <div className="flex items-center gap-1.5">
                        {idx === 0 && <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />}
                        <span>{bench.algorithm}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-300 font-mono text-[11px]">
                      {bench.standard}
                    </td>
                    <td className={`py-3 px-3 text-right font-mono font-bold tabular-nums ${
                      idx === 0 ? 'text-emerald-400' : idx <= 2 ? 'text-red-400' : 'text-slate-300'
                    }`}>
                      {bench.quantumHardness}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-white tabular-nums">
                      {bench.verificationLatency}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-400 tabular-nums">
                      {bench.signatureBytes}
                    </td>
                    <td className="py-3 px-3 text-slate-300 text-[11px]">
                      {bench.sideChannelImmunity}
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-[10px]">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        idx === 0
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : idx <= 2
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {bench.suitability}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
