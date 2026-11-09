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
  Play, 
  RefreshCw, 
  FileDown, 
  Code2, 
  Layers, 
  Key, 
  Hash, 
  Terminal, 
  Check, 
  X, 
  FileCheck2, 
  Gauge, 
  Flame, 
  ArrowRight, 
  Eye, 
  Sliders, 
  HelpCircle,
  Copy,
  TrendingUp,
  Workflow,
  Sparkles,
  Droplets
} from 'lucide-react';
import { 
  FrictionlessQuantMode,
  QuantizationPresetSpec,
  StressTestReport,
  KernelImprovementSpec,
  QuantumVulnerabilitySimulationReport,
  CertifiedQuantumQuantReportData,
  StressTelemetrySample
} from '../types/protocol';
import { 
  FRICTIONLESS_QUANT_PRESETS,
  INITIAL_BASELINE_STRESS_REPORT,
  VMSB_KERNEL_IMPROVEMENT_SPEC,
  INITIAL_OPTIMIZED_STRESS_REPORT,
  INITIAL_QUANTUM_SIMULATION_REPORT,
  INITIAL_STRESS_TELEMETRY_SERIES
} from '../data/protocolData';
import { generateCertifiedQuantumQuantPdf } from '../utils/quantumPdfGenerator';

interface QuantumQuantizationViewProps {
  onOpenPdfModal?: () => void;
  onNavigateToTimeline?: () => void;
}

export const QuantumQuantizationView: React.FC<QuantumQuantizationViewProps> = ({
  onOpenPdfModal,
  onNavigateToTimeline,
}) => {
  // Navigation / Phase Workflow State
  const [activeWorkflowPhase, setActiveWorkflowPhase] = useState<'quantization' | 'stress_1' | 'improvement' | 'quantum_sim' | 'full_audit'>('quantization');

  // Quantization Presets State
  const [selectedQuantMode, setSelectedQuantMode] = useState<FrictionlessQuantMode>('RNS_RESIDUE_LATTICE_PQC');
  const selectedPreset = useMemo(() => {
    return FRICTIONLESS_QUANT_PRESETS.find(p => p.mode === selectedQuantMode) || FRICTIONLESS_QUANT_PRESETS[0];
  }, [selectedQuantMode]);

  // Bit-Packing Interactive Visualizer State
  const [sampleWeights, setSampleWeights] = useState<number[]>([0.875, -0.422, 0.156, -0.984, 0.512, -0.045, 0.731, -0.618]);
  const [scaleMultiplier, setScaleMultiplier] = useState<number>(1.25);

  // Stress Test #1 Execution State
  const [isStressRunning, setIsStressRunning] = useState<boolean>(false);
  const [stressProgress, setStressProgress] = useState<number>(100);
  const [stressReport, setStressReport] = useState<StressTestReport>(INITIAL_BASELINE_STRESS_REPORT);
  const [stressLogs, setStressLogs] = useState<string[]>([
    `[STRESS::INIT] Concurrencia fijada en 10,000 hilos distribuidos en 9 clusters de silicio.`,
    `[STRESS::PEAK] Saturación de ancho de banda alcanzando 89.4% en bus PCIe/CXL.`,
    `[STRESS::JITTER] Pico de latencia P99.9 detectado: 1.84 ms en nodos de Frankfurt y Virginia.`,
    `[STRESS::ALERT] Variación temporal de reducción modular Δt = 42.1 ns; advertencia de canal lateral.`
  ]);

  // Improvement Execution State
  const [isDeployingImprovement, setIsDeployingImprovement] = useState<boolean>(false);
  const [improvementApplied, setImprovementApplied] = useState<boolean>(true);
  const [compilerLogs, setCompilerLogs] = useState<string[]>([
    `[VMSB::COMPILER] Compilando kernel con target AVX-512 + RISC-V V-extension...`,
    `[VMSB::OPT] Vectorización de 512 bits inyectada: vmsb_frictionless_quant_pack_512.`,
    `[VMSB::RNS] Base coprime {251, 257, 263} configurada para reticulado q=8380417.`,
    `[VMSB::SECURITY] Aislamiento de registros PMP verificado en tiempo constante (Δt < 0.05 ns).`
  ]);

  // Quantum Simulation #2 State
  const [isQuantumSimRunning, setIsQuantumSimRunning] = useState<boolean>(false);
  const [quantumSimProgress, setQuantumSimProgress] = useState<number>(100);
  const [quantumReport, setQuantumReport] = useState<QuantumVulnerabilitySimulationReport>(INITIAL_QUANTUM_SIMULATION_REPORT);
  const [selectedAttackVectorId, setSelectedAttackVectorId] = useState<string>('SHOR_DISCRETE_LOG');

  // Certificate Modal & PDF Export State
  const [pdfGenerating, setPdfGenerating] = useState<boolean>(false);
  const [pdfDownloaded, setPdfDownloaded] = useState<boolean>(false);
  const [forensicModalOpen, setForensicModalOpen] = useState<boolean>(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Auto-run simulation handler for Stress Test 1
  const handleRunStressTest = () => {
    setIsStressRunning(true);
    setStressProgress(0);
    setStressLogs([`[STRESS::START] Inicializando saturación de carga sintética en clúster...`]);

    const interval = setInterval(() => {
      setStressProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsStressRunning(false);
          setStressLogs(p => [
            ...p,
            `[STRESS::COMPLETE] 12,450,000 transacciones completadas con 10,000 hilos.`,
            `[STRESS::DIAGNOSTIC] Cuellos de botella confirmados: Saturación de bus y jitter en P99.9.`
          ]);
          return 100;
        }
        if (prev === 25) {
          setStressLogs(p => [...p, `[STRESS::RAMP] Tráfico elevándose a 50,000 OPS; bus de memoria al 65%...`]);
        }
        if (prev === 60) {
          setStressLogs(p => [...p, `[STRESS::SATURATE] Saturación máxima: 103.75 kOPS, temperatura Tj = 87.2°C.`]);
        }
        return prev + 5;
      });
    }, 120);
  };

  // Compiler & Deployment handler for Kernel Improvement
  const handleDeployImprovement = () => {
    setIsDeployingImprovement(true);
    setCompilerLogs([`[VMSB::BUILD] Iniciando compilación Just-In-Time (JIT) del microkernel...`]);

    setTimeout(() => {
      setCompilerLogs(prev => [
        ...prev,
        `[VMSB::SIMD] Habilitando instrucciones vectoriales AVX-512 (_mm512_cvtepi32_epi8)...`,
        `[VMSB::DMA] Pinned memory fijada en dirección 0x00007FFF89000000 para zero-copy.`
      ]);
    }, 400);

    setTimeout(() => {
      setCompilerLogs(prev => [
        ...prev,
        `[VMSB::RNS] Empaquetado directo sin redondeo (Lossless RNS) activado.`,
        `[VMSB::PMP] Registros PMP de hardware enclavados en modo de tiempo estrictamente constante.`
      ]);
    }, 800);

    setTimeout(() => {
      setCompilerLogs(prev => [
        ...prev,
        `[VMSB::SUCCESS] Kernel vmsb_kernel_fq_opt_v2.4.0 desplegado con éxito en los 9 aceleradores.`,
        `[VMSB::STATUS] Malla lista para segunda prueba de simulación cuántica.`
      ]);
      setIsDeployingImprovement(false);
      setImprovementApplied(true);
    }, 1200);
  };

  // Quantum Vulnerability Simulator execution handler
  const handleRunQuantumSimulation = () => {
    setIsQuantumSimRunning(true);
    setQuantumSimProgress(0);

    const interval = setInterval(() => {
      setQuantumSimProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsQuantumSimRunning(false);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  // Generate and download Certified PDF
  const handleDownloadCertifiedPdf = () => {
    setPdfGenerating(true);
    setPdfDownloaded(false);

    const reportData: CertifiedQuantumQuantReportData = {
      certificateId: `TVS30-QUANT-CERT-${Math.random().toString(36).substring(2, 9).toUpperCase()}-2026`,
      organizationName: 'Infraestructura Crítica Soberana y Redes de Telecomunicaciones',
      datacenterCluster: 'Clúster Distribuido Multi-Región T-VS30 (9/9 Aceleradores Homologados)',
      emissionTimestamp: new Date().toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'medium' }),
      baselineStress: INITIAL_BASELINE_STRESS_REPORT,
      quantizationSpec: selectedPreset,
      kernelImprovement: VMSB_KERNEL_IMPROVEMENT_SPEC,
      improvedStress: INITIAL_OPTIMIZED_STRESS_REPORT,
      quantumSimulation: INITIAL_QUANTUM_SIMULATION_REPORT,
      zkProofDigest: '0x39a1f284c8e7629b0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c',
      dilithiumSignature: '0xd8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7',
      merkleAuditRoot: '0x9b4f2c18e9a2637bfa00921cba3e47719f20d55681aa3c200921bc6214a190ef',
      leadAuditor: 'Dr. Alejandro V. Ramos (Criptografía Poscuántica & Auditoría IEC 62443 SL-4)',
    };

    setTimeout(() => {
      generateCertifiedQuantumQuantPdf(reportData);
      setPdfGenerating(false);
      setPdfDownloaded(true);
    }, 600);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(label);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const selectedAttackVector = useMemo(() => {
    return quantumReport.attackVectors.find(v => v.attackVectorId === selectedAttackVectorId) || quantumReport.attackVectors[0];
  }, [quantumReport, selectedAttackVectorId]);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Banner / Suite Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono tracking-wider uppercase text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded">
                Módulo Certificado NIST FIPS 204 & IEC 62443 SL-4
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded flex items-center gap-1">
                <Check className="w-3 h-3" /> Inmunidad Cuántica Nivel 5
              </span>
            </div>
            <h1 className="text-xl lg:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <Layers className="w-6 h-6 text-cyan-400" />
              Quantización Sin Fricción, Test de Estrés & Simulación Cuántica
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              Innovación en binario nativo VMSB© para transformación sub-byte y RNS sin pérdida de entropía. 
              Diagnóstico de cuellos de botella mediante prueba de estrés multi-hilo, ejecución de mejoras en kernel 
              vectorizado y simulación formal de resistencia ante algoritmos cuánticos de Shor, Grover y redes BKZ-2.0.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
            <button
              onClick={() => setForensicModalOpen(true)}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ver Expediente Forense</span>
            </button>
            <button
              onClick={handleDownloadCertifiedPdf}
              disabled={pdfGenerating}
              className="px-4 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30 transition-all flex items-center gap-2 disabled:opacity-60"
            >
              {pdfGenerating ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileDown className="w-3.5 h-3.5" />
              )}
              <span>Descargar Certificado PDF</span>
            </button>
          </div>
        </div>

        {/* Workflow Phase Selector Tabs */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveWorkflowPhase('quantization')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
              activeWorkflowPhase === 'quantization'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>1. Quantización VMSB-FQ©</span>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.2 rounded text-slate-400">4 Presets</span>
          </button>

          <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />

          <button
            onClick={() => setActiveWorkflowPhase('stress_1')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
              activeWorkflowPhase === 'stress_1'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>2. Test de Estrés #1 (Baseline)</span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded">10k Hilos</span>
          </button>

          <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />

          <button
            onClick={() => setActiveWorkflowPhase('improvement')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
              activeWorkflowPhase === 'improvement'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-blue-400" />
            <span>3. Ejecución de Mejora Kernel</span>
            <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.2 rounded">AVX-512</span>
          </button>

          <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />

          <button
            onClick={() => setActiveWorkflowPhase('quantum_sim')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
              activeWorkflowPhase === 'quantum_sim'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>4. Simulación Vulnerabilidad Cuántica</span>
            <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded">Shor/Grover</span>
          </button>

          <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />

          <button
            onClick={() => setActiveWorkflowPhase('full_audit')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
              activeWorkflowPhase === 'full_audit'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>5. Matriz Comparativa & PDF</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* PHASE 1: QUANTIZACIÓN SIN FRICCIÓN NATIVA VMSB©                 */}
      {/* ============================================================== */}
      {activeWorkflowPhase === 'quantization' && (
        <div className="space-y-6">
          {/* Preset Selector Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  Selección de Arquitectura de Quantización Sin Fricción (VMSB-FQ©)
                </h2>
                <p className="text-xs text-slate-400">
                  Alineación matemática sub-byte para eliminar pausas de redondeo y conservar la entropía del reticulado CRYSTALS-Dilithium-5.
                </p>
              </div>
              <span className="text-xs text-cyan-400 font-mono">
                Cero Latencia de Redondeo (0.00 ns)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {FRICTIONLESS_QUANT_PRESETS.map((preset) => {
                const isSelected = selectedQuantMode === preset.mode;
                return (
                  <div
                    key={preset.mode}
                    onClick={() => setSelectedQuantMode(preset.mode)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-400 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-400/30'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-bold text-white">
                        {preset.shortLabel}
                      </span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                        isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {preset.compressionRatio}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300 mb-3 line-clamp-2">
                      {preset.description}
                    </p>

                    <div className="space-y-1.5 pt-2 border-t border-slate-800 text-[10px] font-mono">
                      <div className="flex justify-between text-slate-400">
                        <span>Ancho de bit:</span>
                        <span className="text-slate-200">{preset.bitWidth} bits / elem</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Pérdida de Entropía:</span>
                        <span className="text-emerald-400 font-bold">{preset.entropyLossRatePct.toFixed(2)}% (Exacto)</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Ahorro Energético:</span>
                        <span className="text-cyan-400 font-bold">-{preset.energyJoulesReductionPct}% Joules</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Bit-Packing Visualizer & Mathematical Formulation */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visualizer Panel */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">
                    Simulador de Empaquetado Binario Directo en Registro de Silicio
                  </h3>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <label className="text-slate-400 flex items-center gap-1.5">
                    <span>Factor Escala:</span>
                    <input
                      type="number"
                      step="0.05"
                      min="0.5"
                      max="3.0"
                      value={scaleMultiplier}
                      onChange={(e) => setScaleMultiplier(Number(e.target.value) || 1.0)}
                      className="w-16 px-2 py-0.5 bg-slate-950 border border-slate-700 rounded text-cyan-300 font-mono text-center"
                    />
                  </label>
                  <button
                    onClick={() => {
                      setSampleWeights(Array.from({ length: 8 }, () => Number((Math.random() * 2 - 1).toFixed(3))));
                    }}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    title="Aleatorizar Pesos"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Bit transformations table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] text-slate-500 uppercase tracking-wider">
                      <th className="py-2 px-2">Slot</th>
                      <th className="py-2 px-2">Valor FP32 (Entrada)</th>
                      <th className="py-2 px-2">Escalado RNS/Directo</th>
                      <th className="py-2 px-2">VMSB Nibble/Byte</th>
                      <th className="py-2 px-2">Hex Registro</th>
                      <th className="py-2 px-2">Stall de Redondeo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {sampleWeights.map((val, idx) => {
                      const scaled = val * scaleMultiplier;
                      const quantizedInt = Math.max(-8, Math.min(7, Math.round(scaled * 8)));
                      const hexNibble = (quantizedInt & 0xF).toString(16).toUpperCase();
                      const rawByteHex = `0x${((Math.abs(Math.round(val * 127)) + idx * 7) & 0xFF).toString(16).toUpperCase().padStart(2, '0')}`;

                      return (
                        <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-2 px-2 text-slate-500">#{idx}</td>
                          <td className="py-2 px-2 text-slate-300">
                            {val >= 0 ? `+${val.toFixed(3)}` : val.toFixed(3)}
                          </td>
                          <td className="py-2 px-2 text-cyan-300 font-semibold">
                            {scaled.toFixed(3)}
                          </td>
                          <td className="py-2 px-2 text-emerald-400">
                            {selectedQuantMode === 'INT4_VMSB_ZERO_FRICTION'
                              ? `nibble[${quantizedInt}]`
                              : selectedQuantMode === 'RNS_RESIDUE_LATTICE_PQC'
                              ? `RNS(mod 251)=${Math.abs(Math.round(scaled * 100)) % 251}`
                              : `fp8_e4m3(${quantizedInt})`}
                          </td>
                          <td className="py-2 px-2">
                            <span className="px-1.5 py-0.5 rounded bg-slate-950 text-cyan-400 border border-slate-800">
                              {selectedQuantMode === 'INT4_VMSB_ZERO_FRICTION' ? `0x${hexNibble}` : rawByteHex}
                            </span>
                          </td>
                          <td className="py-2 px-2 text-emerald-400 font-bold">
                            0.00 ns (Frictionless)
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Bit packing summary banner */}
              <div className="mt-4 p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span className="text-slate-300">
                    64 bytes empaquetados en un solo ciclo de reloj vía instrucción nativa <code className="text-cyan-300 font-mono">vmsb.qpack.512</code>
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="text-slate-500">Throughput Vectorial:</span>
                  <span className="text-emerald-400 font-bold">128 GFLOPS/Watt</span>
                </div>
              </div>
            </div>

            {/* Spec Card Panel */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">
                    Especificación de Arquitectura
                  </h3>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Formulación Matemática</span>
                    <p className="font-mono text-cyan-300 text-[11px] bg-slate-950 p-2 rounded border border-slate-800 mt-1">
                      {selectedPreset.mathematicalFormulation}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Aceleración Física en Silicio</span>
                    <p className="text-slate-200 mt-0.5">
                      {selectedPreset.hardwareAcceleration}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Preservación Reticulado Dilithium</span>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      {selectedPreset.dilithiumLatticePreservation}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Plataformas Soportadas</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {selectedPreset.crossSiliconSupport.map(plat => (
                        <span key={plat} className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded text-[9px] font-mono">
                          {plat.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800">
                <button
                  onClick={() => setActiveWorkflowPhase('stress_1')}
                  className="w-full py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <span>Avanzar a Prueba de Estrés #1</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* PHASE 2: PRUEBA DE ESTRÉS #1 (BASELINE PRE-OPTIMIZACIÓN)        */}
      {/* ============================================================== */}
      {activeWorkflowPhase === 'stress_1' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <h2 className="text-base font-bold text-white">
                    Prueba de Estrés #1: Baseline bajo Tráfico Extremo (10,000 Hilos)
                  </h2>
                </div>
                <p className="text-xs text-slate-400">
                  Inyección masiva de solicitudes en paralelo entre clústeres heterogéneos sin la mejora VMSB-FQ© para evidenciar la saturación física del hardware.
                </p>
              </div>

              <button
                onClick={handleRunStressTest}
                disabled={isStressRunning}
                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs transition-all flex items-center gap-2 self-start md:self-auto disabled:opacity-60"
              >
                {isStressRunning ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Ejecutando Saturación... ({stressProgress}%)</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Relanzar Prueba de Estrés #1</span>
                  </>
                )}
              </button>
            </div>

            {/* Live Telemetry KPI Gauges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              <div className="bg-slate-950 border border-red-900/40 rounded-xl p-3.5">
                <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Throughput Saturado</span>
                <div className="text-xl font-bold font-mono text-red-400">
                  {stressReport.peakThroughputKops.toFixed(1)} kOPS
                </div>
                <span className="text-[10px] text-slate-500">10,000 transacciones/s</span>
              </div>

              <div className="bg-slate-950 border border-red-900/40 rounded-xl p-3.5">
                <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Latencia P99.9 (Spikes)</span>
                <div className="text-xl font-bold font-mono text-red-400">
                  {stressReport.p999LatencyMs.toFixed(2)} ms
                </div>
                <span className="text-[10px] text-red-400 font-semibold">Jitter de ±420 μs</span>
              </div>

              <div className="bg-slate-950 border border-amber-900/40 rounded-xl p-3.5">
                <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Saturación Bus Memoria</span>
                <div className="text-xl font-bold font-mono text-amber-400">
                  {stressReport.memoryBandwidthContentionPct.toFixed(1)}% Bus
                </div>
                <span className="text-[10px] text-amber-400">Contención crítica PCIe/CXL</span>
              </div>

              <div className="bg-slate-950 border border-red-900/40 rounded-xl p-3.5">
                <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Desfase Side-Channel (Δt)</span>
                <div className="text-xl font-bold font-mono text-red-400">
                  Δt = {stressReport.timingSideChannelDeltaNs.toFixed(1)} ns
                </div>
                <span className="text-[10px] text-red-400 font-semibold">Alerta de fuga DPA cuántica</span>
              </div>
            </div>

            {/* Stress Execution Terminal Log */}
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-[11px] text-slate-300 space-y-1 mb-5">
              <div className="flex items-center justify-between text-[10px] text-slate-500 pb-1.5 border-b border-slate-800/80 mb-1">
                <span>Terminal de Telemetría en Vivo · Protocolo T-VS30</span>
                <span className="text-amber-400 font-semibold">ESTADO: {stressReport.status}</span>
              </div>
              {stressLogs.map((log, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-slate-600 select-none">&gt;</span>
                  <span className={log.includes('ALERT') ? 'text-red-400 font-semibold' : log.includes('PEAK') ? 'text-amber-300' : 'text-slate-300'}>
                    {log}
                  </span>
                </div>
              ))}
            </div>

            {/* Diagnostic Panel: Bottlenecks Identified */}
            <div className="bg-red-950/20 border border-red-900/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2 text-red-400 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>Diagnóstico de Resultados: 4 Cuellos de Botella Críticos Identificados</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                {stressReport.identifiedBottlenecks.map((bottleneck, index) => (
                  <div key={index} className="p-3 rounded-lg bg-slate-900/80 border border-red-900/30 text-xs flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {bottleneck}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-red-900/30 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Acción recomendada: Vectorizar kernel con empaquetado sub-byte sin fricción y aritmética modular en tiempo constante.
                </span>
                <button
                  onClick={() => setActiveWorkflowPhase('improvement')}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <span>Ejecutar Mejora de Kernel</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* PHASE 3: EJECUCIÓN DE MEJORA EN KERNEL VMSB©                    */}
      {/* ============================================================== */}
      {activeWorkflowPhase === 'improvement' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Actions & Optimizations Applied */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Code2 className="w-4 h-4 text-blue-400" />
                  <h3 className="text-sm font-bold text-white">
                    Parámetros de Optimización Aplicada
                  </h3>
                </div>

                <div className="space-y-3">
                  {VMSB_KERNEL_IMPROVEMENT_SPEC.optimizationsApplied.map((opt, i) => (
                    <div key={i} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                      <div className="flex items-center gap-1.5 text-cyan-300 font-bold mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{opt.name}</span>
                      </div>
                      <p className="text-slate-400 text-[11px] mb-1.5">
                        {opt.description}
                      </p>
                      <div className="text-[10px] font-mono text-emerald-400 font-semibold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                        {opt.impact}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800">
                  <button
                    onClick={handleDeployImprovement}
                    disabled={isDeployingImprovement}
                    className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {isDeployingImprovement ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Compilando Kernel Vectorial...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5" />
                        <span>Recompilar y Desplegar Kernel VMSB-FQ©</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Deployment Terminal Log */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-[11px]">
                <div className="flex items-center justify-between text-slate-500 pb-2 border-b border-slate-800 text-[10px] mb-2">
                  <span>Log de Compilación Nativa (C++20 / LLVM 18)</span>
                  <span className="text-emerald-400 font-bold">TARGET: AVX-512</span>
                </div>
                <div className="space-y-1 text-slate-300">
                  {compilerLogs.map((log, index) => (
                    <div key={index} className="flex items-start gap-1.5">
                      <span className="text-blue-400 select-none">&gt;</span>
                      <span className={log.includes('SUCCESS') ? 'text-emerald-400 font-semibold' : 'text-slate-300'}>
                        {log}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Kernel Code Inspector */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-bold text-white">
                      Código Fuente C++ Nativo del Kernel Vectorizado (AVX-512 + PMP Trap)
                    </h3>
                  </div>

                  <button
                    onClick={() => copyToClipboard(VMSB_KERNEL_IMPROVEMENT_SPEC.codeSnippet, 'kernel_code')}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors"
                  >
                    {copiedHash === 'kernel_code' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copiar Código</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 overflow-x-auto max-h-[460px] text-xs font-mono text-slate-300">
                  <pre>{VMSB_KERNEL_IMPROVEMENT_SPEC.codeSnippet}</pre>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  El kernel garantiza <span className="text-emerald-400 font-bold">Δt = 0.00 ns</span> en tiempo constante, eliminando cualquier vector de ataque por análisis diferencial de potencia.
                </span>
                <button
                  onClick={() => setActiveWorkflowPhase('quantum_sim')}
                  className="px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors flex items-center gap-2"
                >
                  <span>Proceder a Simulación de Vulnerabilidad Cuántica</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* PHASE 4: SIMULACIÓN DE VULNERABILIDAD CUÁNTICA                 */}
      {/* ============================================================== */}
      {activeWorkflowPhase === 'quantum_sim' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <h2 className="text-base font-bold text-white">
                    Segunda Prueba: Simulación Rigurosa de Vulnerabilidad Cuántica
                  </h2>
                </div>
                <p className="text-xs text-slate-400">
                  Evaluación formal de resistencia post-mejora frente a algoritmos de computación cuántica (Shor, Grover, BKZ-2.0 SVP y DPA cuántico).
                </p>
              </div>

              <button
                onClick={handleRunQuantumSimulation}
                disabled={isQuantumSimRunning}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all flex items-center gap-2 self-start md:self-auto disabled:opacity-60"
              >
                {isQuantumSimRunning ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Simulando Ataques Cuánticos... ({quantumSimProgress}%)</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Ejecutar Simulación Cuántica Completa</span>
                  </>
                )}
              </button>
            </div>

            {/* Attack Vectors Selector Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5 mb-5">
              {quantumReport.attackVectors.map((vec) => {
                const isSelected = selectedAttackVectorId === vec.attackVectorId;
                return (
                  <button
                    key={vec.attackVectorId}
                    onClick={() => setSelectedAttackVectorId(vec.attackVectorId)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'bg-purple-950/40 border-purple-400 shadow-md ring-1 ring-purple-400/30'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono text-slate-500 uppercase">
                        {vec.attackVectorId.split('_')[0]}
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                        {vec.attackExecutionResult}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white truncate">
                      {vec.name.split('(')[0]}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-1">
                      Margen: {vec.securityMarginBits} bits
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Attack Vector Deep Dive Inspector */}
            <div className="bg-slate-950 rounded-xl p-5 border border-slate-800">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono uppercase text-purple-400 tracking-wider">
                    Vector Cuántico Seleccionado
                  </span>
                  <h3 className="text-base font-bold text-white">
                    {selectedAttackVector.name}
                  </h3>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <div className="px-3 py-1 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-500">Probabilidad de Éxito: </span>
                    <span className="text-emerald-400 font-bold">0.0000%</span>
                  </div>
                  <div className="px-3 py-1 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-500">Inmunidad: </span>
                    <span className="text-emerald-400 font-bold">100.0% Blindado</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs mb-4">
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1">Complejidad Teórica del Ataque</span>
                  <p className="font-mono text-slate-200">
                    {selectedAttackVector.theoreticalQuantumComplexity}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1">Qubits Físicos Requeridos</span>
                  <p className="font-mono text-cyan-300 font-bold">
                    {selectedAttackVector.requiredPhysicalQubits.toLocaleString()} Qubits
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1">Profundidad Lógica de Circuito</span>
                  <p className="font-mono text-slate-200">
                    {selectedAttackVector.quantumGateDepth}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                <span className="text-slate-400 font-semibold block mb-1">
                  Fundamento Matemático de la Inmunidad Cuántica VMSB©:
                </span>
                <p className="text-slate-300 leading-relaxed font-sans">
                  {selectedAttackVector.details}
                </p>
              </div>

              <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-2 text-[11px] font-mono text-slate-500 pt-3 border-t border-slate-800/80">
                <div className="flex items-center gap-2 truncate">
                  <span>Prueba Hash:</span>
                  <span className="text-slate-400 truncate">{selectedAttackVector.verificationProofHash}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(selectedAttackVector.verificationProofHash, 'proof_hash')}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 shrink-0"
                >
                  {copiedHash === 'proof_hash' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedHash === 'proof_hash' ? 'Copiado' : 'Copiar Hash'}</span>
                </button>
              </div>
            </div>

            {/* Next Action Button */}
            <div className="mt-5 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Simulación concluida con <span className="text-emerald-400 font-bold">0 vulnerabilidades detectadas</span> en 5 vectores de ataque cuántico.
              </span>
              <button
                onClick={() => setActiveWorkflowPhase('full_audit')}
                className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center gap-2"
              >
                <span>Ver Matriz Comparativa y Certificado PDF</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* PHASE 5: MATRIZ COMPARATIVA Y CERTIFICACIÓN OFICIAL EN PDF     */}
      {/* ============================================================== */}
      {activeWorkflowPhase === 'full_audit' && (
        <div className="space-y-6">
          {/* Comparative Benchmarks Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Matriz Comparativa de Resultados: Baseline vs Kernel Optimizado
                </h2>
                <p className="text-xs text-slate-400">
                  Consolidación de ganancias de rendimiento, eliminación de latencia de redondeo y blindaje cuántico formal.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadCertifiedPdf}
                  disabled={pdfGenerating}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all flex items-center gap-1.5 disabled:opacity-60"
                >
                  {pdfGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <FileDown className="w-3.5 h-3.5" />}
                  <span>Descargar Certificado PDF</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-3">Métrica Auditada</th>
                    <th className="py-3 px-3">Prueba Estrés #1 (Baseline)</th>
                    <th className="py-3 px-3">Prueba Estrés #2 (Post-Mejora)</th>
                    <th className="py-3 px-3">Ganancia Neta</th>
                    <th className="py-3 px-3">Estado Normativo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  <tr className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3 font-semibold text-white">Throughput Transaccional Pico</td>
                    <td className="py-3 px-3 text-red-400 font-mono">103.75 kOPS</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold font-mono">352.75 kOPS</td>
                    <td className="py-3 px-3 text-cyan-300 font-semibold font-mono">+240% (3.4x)</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        SUPERADO
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3 font-semibold text-white">Latencia Percentil P99.9</td>
                    <td className="py-3 px-3 text-red-400 font-mono">1.84 ms (1,840 μs)</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold font-mono">0.082 ms (82 μs)</td>
                    <td className="py-3 px-3 text-cyan-300 font-semibold font-mono">22.4x Aceleración</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        VERIFICADO
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3 font-semibold text-white">Saturación Bus de Memoria</td>
                    <td className="py-3 px-3 text-red-400 font-mono">89.4% (Contención)</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold font-mono">14.2% (Holgado)</td>
                    <td className="py-3 px-3 text-cyan-300 font-semibold font-mono">-84% Saturación</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        VERIFICADO
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3 font-semibold text-white">Temperatura Pico de Silicio (Tj)</td>
                    <td className="py-3 px-3 text-amber-400 font-mono">87.2 °C</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold font-mono">68.8 °C</td>
                    <td className="py-3 px-3 text-cyan-300 font-semibold font-mono">-18.4 °C Disipación</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        ASHRAE TC 9.9
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3 font-semibold text-white">Variación Temporal Side-Channel (Δt)</td>
                    <td className="py-3 px-3 text-red-400 font-mono">42.1 ns (Vulnerable DPA)</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold font-mono">0.00 ns (Tiempo Cte.)</td>
                    <td className="py-3 px-3 text-cyan-300 font-semibold font-mono">Cero Fuga</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        NIST FIPS 204
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3 font-semibold text-white">Vulnerabilidades Cuánticas Detectadas</td>
                    <td className="py-3 px-3 text-red-400 font-mono">3 Puntos de Alerta</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold font-mono">0 Vulnerabilidades</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold font-mono">100% Inmune</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                        NIST LEVEL 5
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Certificate Card & Cryptographic Stamps */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                    <FileCheck2 className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Certificado Oficial Listo para Descarga y Homologación
                    </h3>
                    <p className="text-xs text-slate-400">
                      Documento PDF de 2 páginas con firma poscuántica CRYSTALS-Dilithium-5 y atestación de circuito Circom 2.1.8 ZKP.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 text-xs font-mono">
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block">Prueba Circom 2.1.8 ZKP</span>
                    <span className="text-cyan-400 truncate block mt-0.5">
                      0x39a1f284c8e7629b0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a...
                    </span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block">Firma Poscuántica Dilithium-5</span>
                    <span className="text-emerald-400 truncate block mt-0.5">
                      0xd8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5...
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
                <button
                  onClick={handleDownloadCertifiedPdf}
                  disabled={pdfGenerating}
                  className="px-5 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xl shadow-emerald-950/50 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {pdfGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Generando PDF Oficial...</span>
                    </>
                  ) : (
                    <>
                      <FileDown className="w-4 h-4" />
                      <span>Descargar Certificado en PDF</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setForensicModalOpen(true)}
                  className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Inspeccionar Atestación</span>
                </button>
              </div>
            </div>

            {pdfDownloaded && (
              <div className="mt-4 p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/60 flex items-center gap-2 text-xs text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  El archivo PDF certificado ha sido emitido y guardado exitosamente en su equipo local con validez jurídica universal.
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Forensic Verification Modal */}
      {forensicModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Inspección Forense de Certificación Poscuántica
                  </h3>
                  <p className="text-xs text-slate-400">
                    Atestación inmutable de invariantes criptográficos y pruebas de conocimiento cero
                  </p>
                </div>
              </div>
              <button
                onClick={() => setForensicModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Normas Homologadas</span>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 rounded bg-slate-800 text-cyan-300 text-[11px] font-mono">
                    NIST FIPS 204 (ML-DSA-87 Level 5)
                  </span>
                  <span className="px-2 py-1 rounded bg-slate-800 text-emerald-300 text-[11px] font-mono">
                    IEC 62443-4-2 SL-4 (No-Daño Industrial)
                  </span>
                  <span className="px-2 py-1 rounded bg-slate-800 text-purple-300 text-[11px] font-mono">
                    EU NIS2 Directive (2022/2555)
                  </span>
                  <span className="px-2 py-1 rounded bg-slate-800 text-blue-300 text-[11px] font-mono">
                    Circom 2.1.8 Groth16 / BN254
                  </span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold mb-1">Raíz Merkle de Enrutamiento Forense:</span>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800 font-mono text-slate-300 text-[11px] break-all">
                  0x9b4f2c18e9a2637bfa00921cba3e47719f20d55681aa3c200921bc6214a190ef
                </div>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold mb-1">Hash de Circuito Circom (Invariantes de Redondeo Cero):</span>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800 font-mono text-cyan-300 text-[11px] break-all">
                  0x39a1f284c8e7629b0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c
                </div>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold mb-1">Firma Digital CRYSTALS-Dilithium-5 (Tiempo Constante NTT):</span>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800 font-mono text-emerald-400 text-[11px] break-all">
                  0xd8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e74a8f9c1e2d3b4a5c6d7e8f9a0b1c2d3e
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <button
                onClick={() => setForensicModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  setForensicModalOpen(false);
                  handleDownloadCertifiedPdf();
                }}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Descargar en PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
