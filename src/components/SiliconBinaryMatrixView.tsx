import React, { useState } from 'react';
import { 
  SiliconPlatformId, 
  SiliconArchitectureSpec, 
  CrossSiliconDispatchEvent,
  VmsbBinaryAbiField
} from '../types/protocol';
import { 
  UNIVERSAL_SILICON_DEVICES, 
  INITIAL_CROSS_SILICON_DISPATCHES, 
  VMSB_BINARY_ABI_LAYOUT, 
  SILICON_BENCHMARK_MATRIX 
} from '../data/protocolData';
import { 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Lock, 
  Layers, 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  Terminal, 
  Flame, 
  FileCheck2, 
  Network, 
  Activity, 
  HelpCircle,
  Copy,
  Check,
  FileDown,
  Gauge,
  Workflow
} from 'lucide-react';

interface SiliconBinaryMatrixViewProps {
  onOpenPdfModal: () => void;
  onNavigateToCpp: () => void;
}

export const SiliconBinaryMatrixView: React.FC<SiliconBinaryMatrixViewProps> = ({
  onOpenPdfModal,
  onNavigateToCpp,
}) => {
  const [selectedSiliconId, setSelectedSiliconId] = useState<SiliconPlatformId>('NVIDIA_CUDA');
  const [activeSubTab, setActiveSubTab] = useState<'matrix' | 'simulator' | 'abi_hex' | 'benchmark'>('matrix');
  
  // Simulator State
  const [simSource, setSimSource] = useState<SiliconPlatformId>('NVIDIA_CUDA');
  const [simTarget, setSimTarget] = useState<SiliconPlatformId>('GOOGLE_TPU_XLA');
  const [simWorkload, setSimWorkload] = useState<CrossSiliconDispatchEvent['workloadType']>('LLM_KV_CACHE_TRANSFER');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [simDispatches, setSimDispatches] = useState<CrossSiliconDispatchEvent[]>(INITIAL_CROSS_SILICON_DISPATCHES);
  const [simResult, setSimResult] = useState<CrossSiliconDispatchEvent | null>(INITIAL_CROSS_SILICON_DISPATCHES[0]);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const selectedSilicon = UNIVERSAL_SILICON_DEVICES.find(d => d.id === selectedSiliconId) || UNIVERSAL_SILICON_DEVICES[0];

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleExecuteSimulation = () => {
    if (simSource === simTarget) return;
    setIsSimulating(true);
    setSimLogs([
      `[vmsb::ABI] Preparando descriptor empaquetado de 64 bytes (Magic 0x564D5342)...`,
      `[vmsb::DMA] Fijando memoria física pinned en 0x00007FFF89000000 para transferencia zero-copy...`
    ]);

    setTimeout(() => {
      setSimLogs(prev => [
        ...prev,
        `[vmsb::CRYPTO] Generando firma CRYSTALS-Dilithium-5 (ML-DSA-87 / NIST FIPS 204) en tiempo constante NTT...`,
        `[vmsb::PMP] Atestación de hardware PMP validada en 11.4 μs en el nodo fuente [${simSource}].`
      ]);
    }, 300);

    setTimeout(() => {
      setSimLogs(prev => [
        ...prev,
        `[vmsb::ZKP] Calculando prueba Circom 2.1.8 de privacidad de pesos y cotas térmicas...`,
        `[vmsb::BUS] Inyectando trama binaria nativa directa hacia registro del silicio destino [${simTarget}]...`
      ]);
    }, 600);

    setTimeout(() => {
      const sourceDev = UNIVERSAL_SILICON_DEVICES.find(d => d.id === simSource)!;
      const targetDev = UNIVERSAL_SILICON_DEVICES.find(d => d.id === simTarget)!;
      const latencyMicros = Number(((sourceDev.vmsbDispatchLatencyNs + targetDev.vmsbDispatchLatencyNs) / 2000).toFixed(3));
      const payloadBytes = simWorkload === 'LLM_KV_CACHE_TRANSFER' ? 16777216 : simWorkload === 'GRADIENT_ALL_REDUCE' ? 33554432 : 8388608;
      const randomHex = Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4, '0');

      const newDispatch: CrossSiliconDispatchEvent = {
        dispatchId: `vmsb-disp-0x${randomHex}`,
        timestamp: new Date().toLocaleTimeString('es-ES', { hour12: false }) + '.' + Math.floor(Math.random() * 900 + 100),
        sourcePlatform: simSource,
        targetPlatform: simTarget,
        workloadType: simWorkload,
        payloadBytes,
        dispatchLatencyMicros: latencyMicros,
        dilithiumSigDigest: `0x${randomHex.toLowerCase()}a8ff...90bc (Dilithium-5 Enclave PMP)`,
        zkpProofDigest: `0x77bb${randomHex.toLowerCase()}...33dd (Circom 2.1.8 ZKP)`,
        energyJoulesSaved: Number((payloadBytes / (1024 * 1024) * 8.5).toFixed(1)),
        waterMlSaved: Number((payloadBytes / (1024 * 1024) * 1.7).toFixed(1)),
        status: 'ZERO_COPY_COMMITTED',
      };

      setSimResult(newDispatch);
      setSimDispatches(prev => [newDispatch, ...prev.slice(0, 9)]);
      setSimLogs(prev => [
        ...prev,
        `[vmsb::OK] Despacho exitoso confirmado por hardware. Latencia: ${latencyMicros} μs (${Math.round(latencyMicros * 1000)} ns).`,
        `[vmsb::SAVINGS] Ahorro termodinámico inmediato: ${newDispatch.energyJoulesSaved} Joules · ${newDispatch.waterMlSaved} ml agua.`
      ]);
      setIsSimulating(false);
    }, 900);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Header */}
      <div className="rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 uppercase">
                Interconexión Nativa de Silicio Heterogéneo VMSB©
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
                Zero-Copy ABI v1.0
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/30 uppercase">
                FIPS 204 Dilithium-5 + ZKP
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Suma de Compatibilidad Binaria Nativa de Silicio VMSB©
            </h1>
            <p className="text-sm text-slate-300 max-w-4xl leading-relaxed">
              Puente físico y de registros de memoria continua (Virtual Machine Silicon Bridge) que unifica el despacho y optimización directa entre <span className="text-white font-semibold">Nvidia-CUDA, Intel-AMX, AMD-ROCm, Alphabet-TPUs, AWS-Trainium/Inferentia, Azure-Maia, Meta-MTIA, Broadcom-ASICs y TSMC-CoWoS</span>. Cero sobrecarga de serialización, latencia en nanosegundos y blindaje criptográfico poscuántico continuo.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <button
              onClick={onNavigateToCpp}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-400 border border-slate-700 transition-colors shadow-sm"
            >
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Ver Header C++23</span>
            </button>
            <button
              onClick={onOpenPdfModal}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-xs font-bold text-slate-950 transition-colors shadow-lg shadow-cyan-500/20"
            >
              <FileDown className="w-4 h-4 text-slate-950" />
              <span>Certificado Notarial PDF</span>
            </button>
          </div>
        </div>

        {/* Global Silicon KPIs Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Latencia Despacho Promedio</span>
              <Gauge className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-xl font-bold text-cyan-400">108 ns</div>
            <div className="text-[11px] text-slate-400 mt-0.5">40,000x más rápido que RPC/Host</div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Ancho de Banda Agregado</span>
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-emerald-400">64.2 TB/s</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Bypass total de la pila TCP/IP</div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Sistemas de Silicio Enlazados</span>
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="text-xl font-bold text-purple-400">9 / 9 Nativo</div>
            <div className="text-[11px] text-slate-400 mt-0.5">ABI empaquetada unificada</div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Seguridad Poscuántica</span>
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div className="text-xl font-bold text-sky-400">Dilithium-5 + ZKP</div>
            <div className="text-[11px] text-slate-400 mt-0.5">NIST FIPS 204 · Enclave PMP</div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('matrix')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            activeSubTab === 'matrix'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Ecosistemas de Silicio & Registros (9/9)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('simulator')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            activeSubTab === 'simulator'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Workflow className="w-3.5 h-3.5" />
          <span>Simulador de Despacho Cruzado Zero-Copy</span>
        </button>

        <button
          onClick={() => setActiveSubTab('abi_hex')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            activeSubTab === 'abi_hex'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Trama Binaria ABI (64 Bytes Layout)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('benchmark')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            activeSubTab === 'benchmark'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Benchmark vs. Virtualización Tradicional</span>
        </button>
      </div>

      {/* Sub-Tab 1: Silicon Catalog & Register Mapping */}
      {activeSubTab === 'matrix' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Silicon Selector List (Left Col 5) */}
          <div className="lg:col-span-5 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
              Plataformas de Silicio Conectadas al Bus VMSB©
            </h2>
            <div className="space-y-2">
              {UNIVERSAL_SILICON_DEVICES.map((device) => {
                const isSelected = device.id === selectedSiliconId;
                return (
                  <button
                    key={device.id}
                    onClick={() => setSelectedSiliconId(device.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-500/50 shadow-md shadow-cyan-500/5'
                        : 'bg-slate-950/80 border-slate-800/80 hover:bg-slate-900/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
                        isSelected 
                          ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300' 
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}>
                        <Cpu className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate flex items-center gap-2">
                          <span>{device.name}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {device.vendor} · {device.chipModel}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                        {device.vmsbDispatchLatencyNs} ns
                      </span>
                      <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                        PUE {device.pueThermalEfficiency}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Silicon Technical Dossier (Right Col 7) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/90 shadow-lg space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                      {selectedSilicon.vendor}
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-300">{selectedSilicon.processNode}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    {selectedSilicon.chipModel}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Nativo Enlazado</span>
                  </span>
                </div>
              </div>

              {/* Hardware Specifications Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">ISA Binaria Nativa</span>
                  <span className="text-xs font-mono font-semibold text-white mt-1 block truncate" title={selectedSilicon.binaryIsa}>
                    {selectedSilicon.binaryIsa}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Bus Interconexión</span>
                  <span className="text-xs font-mono font-semibold text-cyan-400 mt-1 block truncate" title={selectedSilicon.interconnectBus}>
                    {selectedSilicon.interconnectBus}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Motor Zero-Copy DMA</span>
                  <span className="text-xs font-mono font-semibold text-emerald-400 mt-1 block truncate" title={selectedSilicon.dmaEngine}>
                    {selectedSilicon.dmaEngine}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Empaquetado Silicio</span>
                  <span className="text-xs font-mono font-semibold text-white mt-1 block truncate" title={selectedSilicon.packagingTechnology}>
                    {selectedSilicon.packagingTechnology}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Potencia de Cómputo</span>
                  <span className="text-xs font-mono font-semibold text-purple-400 mt-1 block">
                    {selectedSilicon.peakTopsFp8.toLocaleString()} TOPS (FP8)
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Enclave PMP Dilithium</span>
                  <span className="text-xs font-mono font-semibold text-sky-400 mt-1 block truncate" title={selectedSilicon.dilithiumEnclaveSlot}>
                    {selectedSilicon.dilithiumEnclaveSlot}
                  </span>
                </div>
              </div>

              {/* Native Binary Hook in C++23 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">Punto de Inyección ABI Directo en C++23:</span>
                  <button 
                    onClick={() => handleCopy(selectedSilicon.nativeBinaryHook, 'hook')}
                    className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300"
                  >
                    {copiedField === 'hook' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedField === 'hook' ? 'Copiado' : 'Copiar Firma'}</span>
                  </button>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
                  {selectedSilicon.nativeBinaryHook}
                </div>
              </div>

              {/* Hardware Register Mapping */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-300 block">
                  Registros Físicos Fijados (Hardware Memory Pinned):
                </span>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300">
                  {selectedSilicon.registerDumpExample}
                </div>
              </div>

              {/* Sample Microcode / Assembly Dispatch */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">Trazado Microcódigo / Ensamblador de Despacho VMSB:</span>
                  <span className="text-[11px] text-slate-500">Cero sobrecarga de compilación en tiempo de ejecución</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1 overflow-x-auto">
                  {selectedSilicon.binarySampleAsm.map((line, idx) => (
                    <div key={idx} className={line.startsWith('//') ? 'text-slate-500 italic' : line.includes('VMSB') || line.includes('bar.sync') || line.includes('vmsb_') ? 'text-cyan-400 font-bold' : 'text-slate-300'}>
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Interactive Cross-Silicon Dispatch Simulator */}
      {activeSubTab === 'simulator' && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-6">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Workflow className="w-5 h-5 text-cyan-400" />
                <span>Simulador de Despacho Binario Cruzado Zero-Copy</span>
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Transfiera tensores de cómputo, estados de KV-cache o gradientes distribuidos de forma instantánea entre arquitecturas de silicio heterogéneas, avalado por firmas poscuánticas Dilithium-5 y pruebas Circom ZKP.
              </p>
            </div>

            {/* Selection Grid: Source -> Workload -> Target */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* Source Silicon */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">
                  1. Silicio Emisor (Origen):
                </label>
                <select
                  value={simSource}
                  onChange={(e) => setSimSource(e.target.value as SiliconPlatformId)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-medium"
                >
                  {UNIVERSAL_SILICON_DEVICES.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.vendor} - {d.chipModel} ({d.vmsbDispatchLatencyNs} ns)
                    </option>
                  ))}
                </select>
              </div>

              {/* Workload Type */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">
                  2. Tipo de Carga Distribuida:
                </label>
                <select
                  value={simWorkload}
                  onChange={(e) => setSimWorkload(e.target.value as CrossSiliconDispatchEvent['workloadType'])}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-medium"
                >
                  <option value="LLM_KV_CACHE_TRANSFER">LLM KV-Cache Direct Zero-Copy (16 MB)</option>
                  <option value="GRADIENT_ALL_REDUCE">All-Reduce de Gradientes Multi-Cluster (32 MB)</option>
                  <option value="DENSE_GEMM_OFFLOAD">Offload Matricial Denso GEMM (8 MB)</option>
                  <option value="SCADA_TELEMETRY_BURST">Ráfaga Telemetría SCADA OT Tier-1 (2 MB)</option>
                  <option value="EMBEDDINGS_SHUFFLE">Rebarajado de Embeddings Vectoriales (64 MB)</option>
                </select>
              </div>

              {/* Target Silicon */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">
                  3. Silicio Receptor (Destino):
                </label>
                <select
                  value={simTarget}
                  onChange={(e) => setSimTarget(e.target.value as SiliconPlatformId)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-medium"
                >
                  {UNIVERSAL_SILICON_DEVICES.map((d) => (
                    <option key={d.id} value={d.id} disabled={d.id === simSource}>
                      {d.vendor} - {d.chipModel} ({d.vmsbDispatchLatencyNs} ns)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Execution Trigger Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="text-xs text-slate-400">
                Transición: <span className="text-cyan-400 font-bold">{simSource}</span>
                {' '}
                <ArrowRight className="inline w-3 h-3 text-slate-500 mx-1" />
                {' '}
                <span className="text-emerald-400 font-bold">{simTarget}</span>
              </div>

              <button
                onClick={handleExecuteSimulation}
                disabled={isSimulating || simSource === simTarget}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
              >
                {isSimulating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Ejecutando Inyección Zero-Copy...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-slate-950" />
                    <span>Ejecutar Despacho Binario VMSB©</span>
                  </>
                )}
              </button>
            </div>

            {/* Live Execution Console & Output */}
            {simLogs.length > 0 && (
              <div className="rounded-lg bg-slate-950 border border-slate-800 p-4 font-mono text-xs space-y-1.5">
                <div className="flex items-center justify-between text-slate-400 border-b border-slate-800/80 pb-2 mb-2">
                  <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5" />
                    Consola de Kernel VMSB© (DMA Ring Engine)
                  </span>
                  <span className="text-[10px] text-slate-400">C++23 tvs30_silicon_abi.hpp</span>
                </div>
                {simLogs.map((log, index) => (
                  <div key={index} className={log.includes('OK') ? 'text-emerald-400 font-semibold' : log.includes('CRYPTO') || log.includes('PMP') ? 'text-cyan-300' : 'text-slate-300'}>
                    {log}
                  </div>
                ))}
              </div>
            )}

            {/* Simulation Result Card */}
            {simResult && !isSimulating && (
              <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Último Despacho Confirmado:</span>
                    <span className="font-mono text-xs text-cyan-400">{simResult.dispatchId}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                    {simResult.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Latencia Total</span>
                    <span className="font-mono font-bold text-cyan-400 text-sm">{simResult.dispatchLatencyMicros} μs</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Tamaño Carga Útil</span>
                    <span className="font-mono font-bold text-white text-sm">{(simResult.payloadBytes / (1024 * 1024)).toFixed(0)} MB</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Energía Ahorrada</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">{simResult.energyJoulesSaved} J</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Agua Ahorrada</span>
                    <span className="font-mono font-bold text-sky-400 text-sm">{simResult.waterMlSaved} ml</span>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-slate-400 pt-1 space-y-0.5 border-t border-slate-900">
                  <div>Firma PQC: <span className="text-cyan-300">{simResult.dilithiumSigDigest}</span></div>
                  <div>ZKP Hash: <span className="text-purple-300">{simResult.zkpProofDigest}</span></div>
                </div>
              </div>
            )}
          </div>

          {/* Recent Cross-Silicon Dispatches Table */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-lg">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Registro Histórico de Despachos Binarios Directos (Zero-Copy Bus)
              </h3>
              <span className="text-xs text-slate-400 font-mono">100% Inmutables</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-4">ID / Hora</th>
                    <th className="py-2.5 px-4">Origen</th>
                    <th className="py-2.5 px-4">Destino</th>
                    <th className="py-2.5 px-4">Tipo de Carga</th>
                    <th className="py-2.5 px-4">Latencia</th>
                    <th className="py-2.5 px-4">Ahorro Energía</th>
                    <th className="py-2.5 px-4">Atestación PQC / ZKP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                  {simDispatches.map((event) => (
                    <tr key={event.dispatchId} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 px-4">
                        <span className="text-white font-semibold">{event.dispatchId}</span>
                        <div className="text-[10px] text-slate-400">{event.timestamp}</div>
                      </td>
                      <td className="py-2.5 px-4 text-cyan-400 font-bold">{event.sourcePlatform}</td>
                      <td className="py-2.5 px-4 text-emerald-400 font-bold">{event.targetPlatform}</td>
                      <td className="py-2.5 px-4 text-slate-300">{event.workloadType}</td>
                      <td className="py-2.5 px-4 text-sky-400 font-semibold">{event.dispatchLatencyMicros} μs</td>
                      <td className="py-2.5 px-4 text-emerald-300">+{event.energyJoulesSaved} J</td>
                      <td className="py-2.5 px-4 text-[10px] text-slate-400">
                        <div className="text-cyan-400 truncate max-w-[180px]">{event.dilithiumSigDigest}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Binary ABI Hex Inspector */}
      {activeSubTab === 'abi_hex' && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-cyan-400" />
                  <span>Descriptor Binario Empaquetado `vmsb_abi_dispatch_t` (64 Bytes)</span>
                </h2>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  __attribute__((packed))
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Estructura canónica C++23 en memoria contigua. Se carga directamente en los registros DMA del silicio sin necesidad de parser JSON, protobuf o wrappers de virtualización.
              </p>
            </div>

            {/* Field Breakdown Table */}
            <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-4">Offset</th>
                    <th className="py-2.5 px-4">Tamaño</th>
                    <th className="py-2.5 px-4">Campo en C++23</th>
                    <th className="py-2.5 px-4">Muestra Hexadecimal</th>
                    <th className="py-2.5 px-4">Categoría</th>
                    <th className="py-2.5 px-4">Función Arquitectónica</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                  {VMSB_BINARY_ABI_LAYOUT.map((field, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                      <td className="py-3 px-4 text-cyan-400">+{field.offsetBytes.toString().padStart(2, '0')}</td>
                      <td className="py-3 px-4 text-slate-400">{field.sizeBytes} B</td>
                      <td className="py-3 px-4 text-white font-bold">{field.name}</td>
                      <td className="py-3 px-4 text-emerald-400">{field.hexValue}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-semibold ${
                          field.fieldCategory === 'MAGIC_HEADER' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                          field.fieldCategory === 'CRYPTO_SECURITY' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                          field.fieldCategory === 'ZERO_COPY_DMA' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          field.fieldCategory === 'SILICON_ROUTING' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                        }`}>
                          {field.fieldCategory}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-sans text-slate-300 text-xs">{field.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Raw Hex Stream View */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300 block">
                Trama Binaria Bruta en Memoria (Raw Hex Buffer):
              </span>
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-400 leading-relaxed overflow-x-auto">
                <span className="text-slate-400">0000: </span>
                <span className="text-emerald-400 font-bold">56 4D 53 42</span> <span className="text-slate-500">00 01</span> <span className="text-amber-400">01 04</span> <span className="text-cyan-300">00 10 00 00</span> <span className="text-sky-300">18 EA 99 0F 23 BC 10 4A</span>
                <br />
                <span className="text-slate-400">0020: </span>
                <span className="text-purple-400">88 F1 C4 A0 11 22 33 44 55 66 77 88 99 AA BB 0A</span>
                <br />
                <span className="text-slate-400">0036: </span>
                <span className="text-purple-300">14 EA 99 CF 88 77 66 55 44 33 22 11 AA BB CC 21</span>
                <br />
                <span className="text-slate-400">0052: </span>
                <span className="text-cyan-400">00 00 7F FF 89 00 00 00</span> <span className="text-emerald-300 font-bold">00 6A 00 08</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 4: Comparative Benchmark Matrix */}
      {activeSubTab === 'benchmark' && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-6">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                <span>Auditoría de Rendimiento: Virtualización Tradicional vs. Bus Binario Nativo VMSB©</span>
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Comparativa frente a modelos basados en Kubernetes Device Plugins, wrappers de RPC y virtualización por software (SR-IOV con pila TCP).
              </p>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Métrica Operativa</th>
                    <th className="py-3 px-4">Virtualización Tradicional (RPC/Host)</th>
                    <th className="py-3 px-4 text-cyan-400">T-VS30 VMSB© Native Binary</th>
                    <th className="py-3 px-4 text-emerald-400">Ganancia / Speedup</th>
                    <th className="py-3 px-4">Ventaja Arquitectónica</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {SILICON_BENCHMARK_MATRIX.map((bench, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white">{bench.metricName}</td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">{bench.traditionalVirtualization}</td>
                      <td className="py-3.5 px-4 text-cyan-300 font-mono text-[11px] font-bold">{bench.vmsbNativeBinary}</td>
                      <td className="py-3.5 px-4 text-emerald-400 font-bold">{bench.speedupGain}</td>
                      <td className="py-3.5 px-4 text-slate-300 text-xs">{bench.architecturalAdvantage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Sovereign Hardware Invariant Box */}
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Garantía de Invariante de No Daño (IEC 62443 SL-4) & Capex $0
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  El protocolo T-VS30 opera en silicio ya instalado en centros de datos existentes sin sustitución de hardware (Capex $0). Al eliminar los intermediarios de software y despachar en formato binario ABI continuo, se reducen simultáneamente la temperatura de unión del chiplet y el consumo de agua de refrigeración evaporativa.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
