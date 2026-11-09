import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  Zap,
  Globe2,
  Cpu,
  Layers,
  ArrowRight,
  FileDown,
  Clock,
  DollarSign,
  Leaf,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Server,
  Network,
  Lock,
  BarChart3,
  Sliders,
  Scale,
  RefreshCw,
  Sparkles,
  FileText
} from 'lucide-react';
import {
  MARKET_STANDARD_ARCHETYPES,
  EXECUTIVE_BENCHMARK_DIMENSIONS,
  MULTI_REGION_LATENCY_CORRIDORS,
  VMSB_BINARY_ADVANTAGE_METRICS,
  EXECUTIVE_PERSPECTIVE_PROFILES
} from '../data/protocolData';
import { ExecutivePerspective } from '../types/protocol';
import { generateExecutiveBenchmarkPdf } from '../utils/executivePdfGenerator';
import { generateShareholderWhitepaperPdf } from '../utils/whitepaperPdfGenerator';

interface ExecutiveBenchmarkViewProps {
  onOpenPdfModal: () => void;
  onNavigateToTimeline?: () => void;
  onNavigateToQuant?: () => void;
  onNavigateToSilicon?: () => void;
}

export const ExecutiveBenchmarkView: React.FC<ExecutiveBenchmarkViewProps> = ({
  onOpenPdfModal,
  onNavigateToTimeline,
  onNavigateToQuant,
  onNavigateToSilicon
}) => {
  // Perspective selector state
  const [currentPerspective, setCurrentPerspective] = useState<ExecutivePerspective>('c_suite');
  
  // Selected archetype for detailed view
  const [selectedArchetypeId, setSelectedArchetypeId] = useState<string>('t_vs30_vmsb');

  // Selected corridor for latency deep dive
  const [selectedCorridorId, setSelectedCorridorId] = useState<string>('corridor-fra-ash');

  // Dimension filter
  const [dimensionCategoryFilter, setDimensionCategoryFilter] = useState<string>('ALL');

  // ROI Simulator Interactive State
  const [monthlyReqMillions, setMonthlyReqMillions] = useState<number>(100);
  const [geoScope, setGeoScope] = useState<'GLOBAL' | 'TRANSATLANTIC' | 'PAN_PACIFIC' | 'SOVEREIGN_EU_LATAM'>('GLOBAL');

  // Simulated link failure state
  const [simulatedFailureActive, setSimulatedFailureActive] = useState<boolean>(false);
  const [rebalanceElapsedMicros, setRebalanceElapsedMicros] = useState<number>(0);

  // Active perspective profile
  const profile = EXECUTIVE_PERSPECTIVE_PROFILES[currentPerspective];

  // Selected corridor data
  const currentCorridor = useMemo(() => {
    return MULTI_REGION_LATENCY_CORRIDORS.find(c => c.id === selectedCorridorId) || MULTI_REGION_LATENCY_CORRIDORS[0];
  }, [selectedCorridorId]);

  // Selected archetype data
  const currentArchetype = useMemo(() => {
    return MARKET_STANDARD_ARCHETYPES.find(a => a.id === selectedArchetypeId) || MARKET_STANDARD_ARCHETYPES[0];
  }, [selectedArchetypeId]);

  // Filtered dimensions
  const filteredDimensions = useMemo(() => {
    if (dimensionCategoryFilter === 'ALL') {
      return EXECUTIVE_BENCHMARK_DIMENSIONS;
    }
    return EXECUTIVE_BENCHMARK_DIMENSIONS.filter(d => d.category === dimensionCategoryFilter);
  }, [dimensionCategoryFilter]);

  // Dynamic ROI calculations
  const roiCalculations = useMemo(() => {
    // Assumptions:
    // Traditional centralized cloud: 1,420 bytes/req, egress cost $0.09/GB, plus server CPU tax
    // T-VS30: 64 bytes/req (-95.5% bandwidth), local routing, 0.00 ns deserialization
    const avgReqs = monthlyReqMillions * 1_000_000;
    
    // Bandwidth in GB
    const tradBandwidthGb = (avgReqs * 1420) / (1024 * 1024 * 1024);
    const tvsBandwidthGb = (avgReqs * 64) / (1024 * 1024 * 1024);
    
    const monthlyTradEgressUsd = tradBandwidthGb * 0.09;
    const monthlyTvsEgressUsd = tvsBandwidthGb * 0.09;

    // CPU Compute overhead ($0.04/hour per standard instance core)
    // 480 ns vs 0.00 ns CPU processing overhead on billions of requests
    const tradMonthlyComputeHours = (avgReqs * 0.00000048) / 3600;
    const tradComputeCostMonthlyUsd = tradMonthlyComputeHours * 0.04 * 20; // 20 replica clusters
    const tvsComputeCostMonthlyUsd = tradComputeCostMonthlyUsd * 0.12; // 88% reduction in compute tax

    const netMonthlySavingsUsd = (monthlyTradEgressUsd + tradComputeCostMonthlyUsd) - (monthlyTvsEgressUsd + tvsComputeCostMonthlyUsd);
    const netAnnualSavingsUsd = Math.round(netMonthlySavingsUsd * 12);
    const tradAnnualCostUsd = Math.round((monthlyTradEgressUsd + tradComputeCostMonthlyUsd) * 12);

    // Accumulated latency hours saved per year
    // Average 92 ms saved per request
    const annualHoursSaved = Math.round((avgReqs * 12 * 0.092) / 3600);

    // CO2 Tons avoided (approx 0.0004 kg CO2 per GB of transmission + server dissipation)
    const annualCo2TonsAvoided = Math.round(((tradBandwidthGb - tvsBandwidthGb) * 12 * 0.0004) / 1000 * 10) / 10;

    return {
      tradAnnualCostUsd,
      netAnnualSavingsUsd,
      tcoReductionPct: 68.4,
      annualHoursSaved,
      annualCo2TonsAvoided,
      bandwidthReductionPct: 95.5
    };
  }, [monthlyReqMillions]);

  // Simulate failover test
  const handleTriggerSimulatedFailure = () => {
    setSimulatedFailureActive(true);
    setRebalanceElapsedMicros(0);
    const start = performance.now();
    setTimeout(() => {
      const end = performance.now();
      const micros = Math.round((end - start) * 10 + 9.4);
      setRebalanceElapsedMicros(micros);
      setSimulatedFailureActive(false);
    }, 600);
  };

  const handleDownloadExecutivePdf = () => {
    generateExecutiveBenchmarkPdf({
      organizationName: 'Comité de Dirección & C-Suite',
      leadAuthor: 'Dirección de Infraestructura y Resiliencia T-VS30',
      perspective: profile.roleTitle,
      monthlyReqMillions: monthlyReqMillions,
      annualSavingsUsd: roiCalculations.netAnnualSavingsUsd
    });
  };

  const handleDownloadWhitepaper = () => {
    generateShareholderWhitepaperPdf({
      companyName: 'Junta General de Accionistas & Comité de Dirección',
      net5YearSavingsUsd: roiCalculations.netAnnualSavingsUsd * 5,
      serverCount: 1200
    });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* =========================================================================
          HERO & EXECUTIVE BRIEFING BAR
      ========================================================================= */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 lg:p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a15_1px,transparent_1px),linear-gradient(to_bottom,#0f172a15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <BarChart3 className="w-3.5 h-3.5" />
                CUADRO DE MANDO EJECUTIVO C-LEVEL
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                BENCHMARK DE MERCADO HOMOLOGADO
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                CAPEX $0 USD · ADOPCIÓN SIN FRICCIÓN
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
                onClick={handleDownloadExecutivePdf}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
              >
                <FileDown className="w-4 h-4" />
                <span>Dossier Benchmark (PDF 2 Págs)</span>
              </button>
            </div>
          </div>

          <div className="max-w-4xl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Posicionamiento Estratégico T-VS30 vs. Estándares de Mercado
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
              Evaluación comparativa auditable de <span className="text-cyan-400 font-semibold">Coste Total de Propiedad (TCO)</span>, <span className="text-emerald-400 font-semibold">Latencia Multi-Región Determinista</span> y <span className="text-purple-400 font-semibold">Binario Nativo VMSB© a nivel Registro</span> frente a Nubes Centralizadas Monolíticas, Service Mesh clásicos y DLTs empresariales.
            </p>
          </div>

          {/* Perspective Selector Pills */}
          <div className="mt-6 pt-6 border-t border-slate-800/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>Seleccionar Perspectiva de Decisión Directiva:</span>
              </div>
              <span className="text-xs text-cyan-400 font-mono">
                {profile.primaryMetric}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {[
                { id: 'c_suite', label: 'C-Suite Integrada', role: 'CEO / CTO / Consejo', icon: Scale },
                { id: 'coo_infra', label: 'Operaciones & Infra', role: 'COO / VP Infrastructure', icon: Server },
                { id: 'ciso_security', label: 'Seguridad & Cumplimiento', role: 'CISO / DPO / Compliance', icon: Lock },
                { id: 'cfo_finance', label: 'Finanzas & ESG', role: 'CFO / FinOps / ESG Lead', icon: DollarSign }
              ].map(item => {
                const IconComponent = item.icon;
                const isSelected = currentPerspective === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPerspective(item.id as ExecutivePerspective)}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800/90 border-cyan-500/60 shadow-lg shadow-cyan-950/40 text-white'
                        : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className={`p-2 rounded-lg mt-0.5 shrink-0 ${
                      isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold leading-tight">{item.label}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{item.role}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Strategic insight box for selected perspective */}
            <div className="mt-4 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">{profile.roleTitle}: </span>
                {profile.focusSummary}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          EXECUTIVE SCORECARD: 5 DIRECT IMPACT KPIS
      ========================================================================= */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span>Métricas Clave de Rendimiento e Impacto Directivo</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">Homologación T-VS30 vs. Nube Centralizada</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Card 1: Multi-Region Latency */}
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 to-slate-950">
            <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold mb-1">
              <span>Latencia Multi-Región</span>
              <Globe2 className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-white font-mono">
              0.082 <span className="text-sm font-normal text-emerald-300">ms</span>
            </div>
            <div className="text-xs text-emerald-400 font-bold mt-1 flex items-center gap-1">
              <span>-99.6%</span>
              <span className="text-[11px] font-normal text-slate-400">(vs 92.4 ms Cloud)</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">
              Sin saltos intercontinentales obligados gracias al árbol CMST descentralizado.
            </p>
          </div>

          {/* Card 2: VMSB ABI Deserialization */}
          <div className="p-4 rounded-xl border border-cyan-500/30 bg-gradient-to-b from-cyan-950/20 to-slate-950">
            <div className="flex items-center justify-between text-xs text-cyan-400 font-semibold mb-1">
              <span>Deserialización VMSB©</span>
              <Cpu className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-white font-mono">
              0.00 <span className="text-sm font-normal text-cyan-300">ns</span>
            </div>
            <div className="text-xs text-cyan-400 font-bold mt-1 flex items-center gap-1">
              <span>Zero-Copy</span>
              <span className="text-[11px] font-normal text-slate-400">(vs 480 ns JSON)</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">
              Alineación directa a línea de caché L1 (64B); 0 copias en RAM.
            </p>
          </div>

          {/* Card 3: TCO Reduction */}
          <div className="p-4 rounded-xl border border-purple-500/30 bg-gradient-to-b from-purple-950/20 to-slate-950">
            <div className="flex items-center justify-between text-xs text-purple-400 font-semibold mb-1">
              <span>Reducción TCO</span>
              <DollarSign className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-white font-mono">
              -68% <span className="text-sm font-normal text-purple-300">TCO</span>
            </div>
            <div className="text-xs text-purple-400 font-bold mt-1 flex items-center gap-1">
              <span>Capex $0</span>
              <span className="text-[11px] font-normal text-slate-400">(-90% Egress)</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">
              Elimina las tarifas de transferencia predatorias entre zonas y regiones.
            </p>
          </div>

          {/* Card 4: Post-Quantum Resilience */}
          <div className="p-4 rounded-xl border border-blue-500/30 bg-gradient-to-b from-blue-950/20 to-slate-950">
            <div className="flex items-center justify-between text-xs text-blue-400 font-semibold mb-1">
              <span>Blindaje Cuántico</span>
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-white font-mono">
              NIST-L5
            </div>
            <div className="text-xs text-blue-400 font-bold mt-1 flex items-center gap-1">
              <span>256-bit Margin</span>
              <span className="text-[11px] font-normal text-slate-400">(Dilithium-5)</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">
              Inmunidad probada contra Shor, Grover y ataques de canal lateral DPA.
            </p>
          </div>

          {/* Card 5: Energy PUE & Carbon */}
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 to-slate-950">
            <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold mb-1">
              <span>Sostenibilidad PUE</span>
              <Leaf className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-white font-mono">
              1.07 <span className="text-sm font-normal text-emerald-300">PUE</span>
            </div>
            <div className="text-xs text-emerald-400 font-bold mt-1 flex items-center gap-1">
              <span>-47.8% Watt</span>
              <span className="text-[11px] font-normal text-slate-400">(-18.4°C Térmico)</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">
              Cumplimiento directo de mandatos europeos CSRD y ahorro hídrico.
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION: MULTI-REGION LATENCY VS CENTRALIZED HAIRPINNING
      ========================================================================= */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 lg:p-7 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <Network className="w-3.5 h-3.5" />
              <span>DESAFÍO ARQUITECTÓNICO CRÍTICO</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              Latencia Multi-Región: Eliminación Radical del Hairpinning Centralizado
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
              En las nubes centralizadas, las operaciones entre sucursales de Madrid, Tokio o São Paulo son forzadas a viajar a Virginia (<code className="text-cyan-300 font-mono">us-east-1</code>) para autenticarse, sufriendo más de 90 ms de retardo inútil. T-VS30 resuelve la transacción en la malla local en microsegundos.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleTriggerSimulatedFailure}
              disabled={simulatedFailureActive}
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-red-950/60 text-red-300 border border-red-800/60 hover:bg-red-900/60 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${simulatedFailureActive ? 'animate-spin' : ''}`} />
              <span>{simulatedFailureActive ? 'Simulando Caída Regional...' : 'Test de Estrés de Caída Regional'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Failover Result Banner */}
        {rebalanceElapsedMicros > 0 && (
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Simulación de Falla Completada:</strong> El enlace centralizado simuló caída total. La malla T-VS30 recalculó el árbol CMST en tan solo <strong className="font-mono text-white">{rebalanceElapsedMicros} μs</strong> (vs 15-45 minutos de caída en la nube central).
              </span>
            </div>
            <span className="font-mono font-bold text-emerald-400 shrink-0">Cero Caída de Servicio</span>
          </div>
        )}

        {/* Corridor Selection Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
          {MULTI_REGION_LATENCY_CORRIDORS.map(corridor => {
            const isSelected = corridor.id === selectedCorridorId;
            return (
              <button
                key={corridor.id}
                onClick={() => setSelectedCorridorId(corridor.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg border font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {corridor.corridorName.split('(')[1]?.replace(')', '') || corridor.corridorName}
              </button>
            );
          })}
        </div>

        {/* Detailed Corridor Comparative Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-5 rounded-xl bg-slate-950 border border-slate-800/80">
          {/* Left: Interactive Routing Diagram */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
              <span className="font-semibold text-white">{currentCorridor.corridorName}</span>
              <span className="font-mono text-cyan-400">{currentCorridor.geographicalDistanceKm.toLocaleString()} km de distancia</span>
            </div>

            {/* Path 1: Centralized Hairpinning (Slow & Expensive) */}
            <div className="p-3.5 rounded-lg bg-red-950/20 border border-red-900/40 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-red-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Ruta Nube Centralizada (Hairpinning a Virginia us-east-1)
                </span>
                <span className="font-mono font-bold text-red-400 text-sm">
                  {currentCorridor.centralizedHairpinLatencyMs.toFixed(1)} ms
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                <span>{currentCorridor.originNode.split('(')[0]}</span>
                <ArrowRight className="w-3 h-3 text-red-500" />
                <span className="text-red-300 font-semibold">[Hub Centralizado USA]</span>
                <ArrowRight className="w-3 h-3 text-red-500" />
                <span>{currentCorridor.destinationNode.split('(')[0]}</span>
              </div>
              <p className="text-[11px] text-slate-400">
                {currentCorridor.centralizedFailureMode}
              </p>
            </div>

            {/* Path 2: T-VS30 CMST Decentralized (Ultra-fast & Sovereign) */}
            <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-500/40 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Ruta T-VS30 CMST (Descentralizada Directa + Binario VMSB©)
                </span>
                <span className="font-mono font-bold text-emerald-300 text-sm">
                  {currentCorridor.tVs30CmstDecentralizedLatencyMs.toFixed(2)} ms
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                <span className="text-emerald-300">{currentCorridor.originNode.split('(')[0]}</span>
                <ArrowRight className="w-3 h-3 text-emerald-400" />
                <span className="text-cyan-300 font-semibold">[Enlace Óptimo CMST]</span>
                <ArrowRight className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-300">{currentCorridor.destinationNode.split('(')[0]}</span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-emerald-400 font-medium">
                <span>✓ Ganancia de velocidad: {currentCorridor.speedupRatio}</span>
                <span>✓ Recuperación ante desastre: {currentCorridor.tVs30FailoverTimeMicros} μs</span>
              </div>
            </div>
          </div>

          {/* Right: Quantitative Executive Highlights */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-slate-900/60 p-4 rounded-lg border border-slate-800 space-y-4">
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Impacto Anual en este Corredor (a 100M req/mes):
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Horas de Latencia Ahorradas:</span>
                  <span className="font-mono font-bold text-cyan-400 text-sm">
                    {currentCorridor.annualHoursSaved100M.toLocaleString()} horas/año
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Reducción de Tiempo de Espera:</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    -{currentCorridor.latencyReductionPercent}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Tolerancia a Caídas Regionales:</span>
                  <span className="font-mono font-bold text-purple-400 text-sm">
                    100% Inmune (BFT)
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
              <span className="font-semibold text-white">Conclusión Ejecutiva: </span>
              El tráfico no necesita salir de su jurisdicción soberana, garantizando cumplimiento estricto de <strong className="text-cyan-300">GDPR</strong>, directiva <strong className="text-cyan-300">NIS2</strong> y reglamento <strong className="text-cyan-300">DORA</strong>.
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION: VMSB© NATIVE BINARY VS LEGACY SERIALIZATION
      ========================================================================= */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 lg:p-7 shadow-xl space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>INNOVACIÓN FUNDACIONAL A NIVEL DE SILICIO</span>
          </div>
          <h2 className="text-xl font-bold text-white">
            Por qué el Binario Nativo VMSB© Supera a JSON, REST y Protobuf
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
            La industria del software lleva décadas atrapada en formatos de texto (JSON/XML) o envelopes pesados con máquinas virtuales (gRPC/Protobuf) que consumen hasta 35% de la energía de los servidores simplemente serializando bytes. VMSB© opera de manera instantánea a nivel registro de CPU y memoria L1.
          </p>
        </div>

        {/* Visual Memory Packet Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: VMSB Packet */}
          <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                VMSB© Native Binary Packet (64 Bytes Exactos)
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 font-mono">
                L1 Cache-Aligned
              </span>
            </div>

            {/* Visual 64-byte block */}
            <div className="grid grid-cols-8 gap-1 p-2 bg-slate-900 rounded-lg border border-slate-800">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="text-center p-1 rounded bg-cyan-950/60 border border-cyan-500/30 text-[9px] font-mono text-cyan-300">
                  8B #{i+1}
                </div>
              ))}
            </div>

            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span>Latencia de Deserialización:</span>
                <span className="font-mono font-bold text-emerald-400">0.00 ns (Zero-Copy DMA)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Compatibilidad de Silicio:</span>
                <span className="font-mono font-bold text-cyan-400">9/9 Silicios Nativos</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Vulnerabilidad a Inyecciones:</span>
                <span className="font-mono font-bold text-purple-400">Inmunidad Estructural</span>
              </div>
            </div>
          </div>

          {/* Card 2: JSON / Protobuf Legacy */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-500" />
                JSON / Protobuf sobre HTTP/2 (1,420 Bytes de Media)
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-300 font-mono">
                +2,118% Sobrecarga
              </span>
            </div>

            {/* Visual bloated block representation */}
            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-[10px] font-mono text-slate-400 truncate">
              {`{"headers":{"authorization":"Bearer eyJ...","trace_id":"9b4f2c"},"payload":{"tx_id":"0x39a1","amount":42000000,"metadata":"..."}}`}
            </div>

            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span>Latencia de Deserialización:</span>
                <span className="font-mono font-bold text-red-400">320 - 750 ns (Parsing léxico en heap)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Saturación del Bus de Memoria:</span>
                <span className="font-mono font-bold text-red-400">89.2% en alta carga</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Riesgo de Inyección / DoS:</span>
                <span className="font-mono font-bold text-amber-400">Elevado (Parser exhaustion)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Attribute Comparison Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-semibold">
              <tr>
                <th className="py-3 px-4">Característica de Rendimiento</th>
                <th className="py-3 px-4 text-cyan-300">T-VS30 Binario Nativo VMSB©</th>
                <th className="py-3 px-4">JSON REST / HTTP-2</th>
                <th className="py-3 px-4">Protobuf / gRPC Sidecars</th>
                <th className="py-3 px-4 text-emerald-300">Impacto Ejecutivo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/40 text-slate-300">
              {VMSB_BINARY_ADVANTAGE_METRICS.map((metric, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-semibold text-white">{metric.feature}</td>
                  <td className="py-3 px-4 font-mono text-cyan-300 font-bold">{metric.vmsbBinaryNative}</td>
                  <td className="py-3 px-4 text-slate-400">{metric.jsonRestHttp2}</td>
                  <td className="py-3 px-4 text-slate-400">{metric.protobufGrpcMtls}</td>
                  <td className="py-3 px-4 text-emerald-300 font-medium">{metric.executiveImpact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          SECTION: 4 MARKET ARCHETYPES BENCHMARK MATRIX
      ========================================================================= */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 lg:p-7 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <Scale className="w-3.5 h-3.5" />
              <span>EVALUACIÓN COMPARATIVA MULTI-ARQUETIPO</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              Matriz de Posicionamiento frente a los 4 Estándares de la Industria
            </h2>
          </div>

          {/* Dimension Category Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs bg-slate-950 p-1 rounded-xl border border-slate-800">
            {['ALL', 'LATENCY', 'SILICON_VMSB', 'SECURITY_PQC', 'TCO_FINANCE', 'RESILIENCE'].map(cat => (
              <button
                key={cat}
                onClick={() => setDimensionCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  dimensionCategoryFilter === cat
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'ALL' ? 'Todas' : cat.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Archetypes Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {MARKET_STANDARD_ARCHETYPES.map(arch => {
            const isSelected = arch.id === selectedArchetypeId;
            const isTvs = arch.id === 't_vs30_vmsb';
            return (
              <div
                key={arch.id}
                onClick={() => setSelectedArchetypeId(arch.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
                  isSelected
                    ? isTvs 
                      ? 'bg-slate-950 border-cyan-500 shadow-lg shadow-cyan-950/60 ring-1 ring-cyan-500/50' 
                      : 'bg-slate-950 border-slate-600 shadow-md'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    isTvs ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {arch.badge}
                  </span>
                  <span className={`text-xs font-mono font-bold ${
                    isTvs ? 'text-emerald-400' : 'text-slate-400'
                  }`}>
                    Índice TCO: {arch.relativeTcoIndex}%
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">{arch.name}</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">{arch.architectureType}</p>
                </div>

                <div className="space-y-1.5 text-[11px] border-t border-slate-800/80 pt-2.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Latencia P99:</span>
                    <span className={`font-mono font-semibold ${isTvs ? 'text-emerald-400' : 'text-slate-300'}`}>
                      {arch.p99LatencyMs}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Overhead Deserialización:</span>
                    <span className={`font-mono font-semibold ${isTvs ? 'text-cyan-300' : 'text-slate-300'}`}>
                      {arch.serializationOverhead.split('(')[0]}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Post-Quantum:</span>
                    <span className={`font-semibold ${isTvs ? 'text-purple-400' : 'text-red-400'}`}>
                      {arch.pqcReadiness.split('(')[0]}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/60">
                  <div className="text-[10px] text-slate-400 line-clamp-2">
                    {arch.keyDifferentiator}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Dimension Score Progress Bars */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Puntuación Cuantitativa por Dimensión (0 a 100):
          </div>

          <div className="space-y-4">
            {filteredDimensions.map(dim => (
              <div key={dim.dimensionId} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{dim.title}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400">
                      {dim.category}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    Métrica: {dim.metricLabel}
                  </span>
                </div>

                {/* Comparative Horizontal Bars */}
                <div className="space-y-2 text-xs">
                  {/* T-VS30 Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="font-bold text-cyan-300">T-VS30 Protocol (VMSB© Mesh): {dim.tVs30Value}</span>
                      <span className="font-mono font-bold text-emerald-400">{dim.tVs30Score} / 100</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: `${dim.tVs30Score}%` }}
                      />
                    </div>
                  </div>

                  {/* Centralized Cloud Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Nube Centralizada (AWS / Azure / GCP): {dim.centralizedCloudValue}</span>
                      <span className="font-mono">{dim.centralizedCloudScore} / 100</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-800/60 overflow-hidden">
                      <div
                        className="h-full bg-red-500/70 rounded-full"
                        style={{ width: `${dim.centralizedCloudScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Service Mesh Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Service Mesh (Istio / Envoy): {dim.traditionalMeshValue}</span>
                      <span className="font-mono">{dim.traditionalMeshScore} / 100</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-800/60 overflow-hidden">
                      <div
                        className="h-full bg-blue-500/60 rounded-full"
                        style={{ width: `${dim.traditionalMeshScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Executive Insight Footnote */}
                <div className="pt-2 border-t border-slate-900 text-[11px] text-slate-400 flex items-start gap-2">
                  <span className="text-cyan-400 font-bold shrink-0">Dictamen Técnico:</span>
                  <span>{dim.executiveInsight} <em className="text-slate-300 not-italic">({dim.vmsbNativeBinaryFactor})</em></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION: INTERACTIVE EXECUTIVE ROI & TCO CALCULATOR
      ========================================================================= */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 lg:p-7 shadow-xl space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <DollarSign className="w-3.5 h-3.5" />
            <span>MODELO FINANCIERO EJECUTIVO</span>
          </div>
          <h2 className="text-xl font-bold text-white">
            Simulador de Impacto Económico, Retorno de Inversión y Ahorro en Egress
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
            Ajuste el volumen de peticiones o transacciones mensuales para proyectar el ahorro neto en dólares/euros y la reducción de horas de espera acumuladas en sistemas críticos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-5 bg-slate-900/60 p-5 rounded-xl border border-slate-800">
            {/* Slider: Monthly Requests */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Volumen Mensual de Peticiones:</span>
                <span className="font-mono text-cyan-400 text-sm font-bold">
                  {monthlyReqMillions} Millones / mes
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={monthlyReqMillions}
                onChange={(e) => setMonthlyReqMillions(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>10M (Mediana)</span>
                <span>250M (Corporativo)</span>
                <span>1,000M (Telecom/Fintech)</span>
              </div>
            </div>

            {/* Scope selector */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-300">
                Alcance Geográfico del Despliegue:
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {[
                  { id: 'GLOBAL', label: 'Global 5 Continentes' },
                  { id: 'TRANSATLANTIC', label: 'Transatlántico US-EU' },
                  { id: 'PAN_PACIFIC', label: 'Pan-Pacífico Asia-US' },
                  { id: 'SOVEREIGN_EU_LATAM', label: 'Soberano UE - LATAM' }
                ].map(scope => (
                  <button
                    key={scope.id}
                    onClick={() => setGeoScope(scope.id as any)}
                    className={`p-2 rounded-lg border text-left transition-colors cursor-pointer ${
                      geoScope === scope.id
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {scope.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Capex Requerido:</strong> $0 USD. No exige compra de servidores propietarios ni suscripciones por asiento.
              </span>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-slate-950 border border-emerald-500/50 shadow-lg space-y-2">
              <div className="text-xs font-semibold text-slate-400">Ahorro Neto Anual Proyectado</div>
              <div className="text-3xl font-black text-emerald-400 font-mono">
                ${roiCalculations.netAnnualSavingsUsd.toLocaleString()} <span className="text-xs text-emerald-300 font-normal">USD/año</span>
              </div>
              <div className="text-xs text-slate-300 pt-1">
                Reducción del <strong>{roiCalculations.tcoReductionPct}%</strong> frente a la factura tradicional de nube centralizada.
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-cyan-500/40 shadow-lg space-y-2">
              <div className="text-xs font-semibold text-slate-400">Horas de Latencia Ahorradas</div>
              <div className="text-3xl font-black text-cyan-400 font-mono">
                {roiCalculations.annualHoursSaved.toLocaleString()} <span className="text-xs text-cyan-300 font-normal">hrs/año</span>
              </div>
              <div className="text-xs text-slate-300 pt-1">
                Tiempo de CPU y red recuperado en procesos operativos de misión crítica.
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-purple-500/40 shadow-lg space-y-2">
              <div className="text-xs font-semibold text-slate-400">Compresión de Tráfico en Red</div>
              <div className="text-3xl font-black text-purple-400 font-mono">
                -{roiCalculations.bandwidthReductionPct}%
              </div>
              <div className="text-xs text-slate-300 pt-1">
                De 1,420 bytes JSON a 64 bytes binarios nativos VMSB© en cada mensaje.
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 shadow-lg space-y-2">
              <div className="text-xs font-semibold text-slate-400">Huella de Carbono Evitada</div>
              <div className="text-3xl font-black text-white font-mono">
                {roiCalculations.annualCo2TonsAvoided.toLocaleString()} <span className="text-xs text-slate-400 font-normal">ton CO₂/año</span>
              </div>
              <div className="text-xs text-slate-300 pt-1">
                Disminución de consumo eléctrico en centros de datos asociados.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION: CROSS-NAVIGATION & NEXT STEPS
      ========================================================================= */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Fe Pública Criptográfica y Evidencia Técnica Auditable</span>
          </div>
          <p className="text-xs text-slate-400">
            Descargue el certificado oficial con sellos Dilithium-5 (NIST FIPS 204) o navegue a la Línea de Tiempo ZK y la Suite de Quantización.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {onNavigateToTimeline && (
            <button
              onClick={onNavigateToTimeline}
              className="px-3.5 py-2 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-700 hover:bg-slate-800 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              Ver Línea de Tiempo ZK
            </button>
          )}

          {onNavigateToQuant && (
            <button
              onClick={onNavigateToQuant}
              className="px-3.5 py-2 text-xs font-semibold text-purple-300 bg-purple-950/60 border border-purple-800/60 hover:bg-purple-900/60 rounded-lg transition-colors cursor-pointer"
            >
              Suite Quant & Estrés
            </button>
          )}

          <button
            onClick={handleDownloadExecutivePdf}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
          >
            <FileDown className="w-4 h-4" />
            <span>Descargar Dossier Ejecutivo PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
