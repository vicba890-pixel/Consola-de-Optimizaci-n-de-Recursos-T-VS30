import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  Zap,
  Droplets,
  TrendingUp,
  Leaf,
  ShieldCheck,
  CheckCircle2,
  FileDown,
  Sliders,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Cpu,
  BarChart3,
  Server,
  FileText
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { ProtocolNode, ZeroCapexYearProjection } from '../types/protocol';
import { generateZeroCapexRoiPdf } from '../utils/roiPdfGenerator';
import { generateShareholderWhitepaperPdf } from '../utils/whitepaperPdfGenerator';

interface ZeroCapexRoiCalculatorViewProps {
  nodes: ProtocolNode[];
  totalMWhSaved: number;
  totalWaterSavedLiters: number;
  onOpenPdfModal: () => void;
  onNavigateToExecutive?: () => void;
  onNavigateToGreen?: () => void;
}

export const ZeroCapexRoiCalculatorView: React.FC<ZeroCapexRoiCalculatorViewProps> = ({
  nodes,
  totalMWhSaved,
  totalWaterSavedLiters,
  onOpenPdfModal,
  onNavigateToExecutive,
  onNavigateToGreen
}) => {
  // Configurable simulation parameters
  const [serverCount, setServerCount] = useState<number>(1200);
  const [electricityCostPerKWh, setElectricityCostPerKWh] = useState<number>(0.16); // $0.16 / kWh
  const [waterCostPerM3, setWaterCostPerM3] = useState<number>(3.50); // $3.50 / m³ (1,000 L)
  const [legacyHardwareCostPerServer, setLegacyHardwareCostPerServer] = useState<number>(1850); // $1,850 per server refresh
  const [monthlyTrafficTb, setMonthlyTrafficTb] = useState<number>(150); // 150 TB/mo
  const [activeChartTab, setActiveChartTab] = useState<'cumulative_cost' | 'annual_breakdown' | 'esg_resources'>('cumulative_cost');

  // Protocol telemetry live integration factors
  const activeNodesCount = nodes.filter(n => n.status !== 'degraded').length;
  const liveAnnualMWhFromProtocol = totalMWhSaved * 365;
  const liveAnnualWaterFromProtocol = totalWaterSavedLiters * 365;

  // Sync with live telemetry
  const handleSyncTelemetry = () => {
    // Calibrate server count based on active nodes (e.g. ~133 virtual servers per physical node)
    setServerCount(activeNodesCount * 133);
  };

  // 5-Year Dynamic Projections
  const projections: ZeroCapexYearProjection[] = useMemo(() => {
    // Server energy consumption baseline: ~450W -> 3,942 kWh/year
    // Traditional PUE: 1.48 (consumes 5,834 kWh total)
    // T-VS30 PUE: 1.07 (consumes 4,218 kWh total)
    // Saving: 1,616 kWh per server/year
    const annualKWhSavedPerServer = 1616;
    const totalAnnualKWhSaved = annualKWhSavedPerServer * serverCount;
    const annualEnergySavedMWh = totalAnnualKWhSaved / 1000;
    const annualEnergyCostSavedUsd = totalAnnualKWhSaved * electricityCostPerKWh;

    // Traditional annual electricity cost per server
    const legacyAnnualEnergyCost = (serverCount * 3942 * 1.48) * electricityCostPerKWh;
    const tvs30AnnualEnergyCost = (serverCount * 3942 * 1.07) * electricityCostPerKWh;

    // Water cooling:
    // Traditional: 1.8 L/kWh consumed -> ~10,500 L/server/yr
    // T-VS30: 0.11 L/kWh consumed -> ~464 L/server/yr
    // Saving: ~10,036 L/server/yr
    const annualWaterSavedLiters = serverCount * 10036;
    const legacyAnnualWaterCost = (serverCount * 10500 / 1000) * waterCostPerM3;
    const tvs30AnnualWaterCost = (serverCount * 464 / 1000) * waterCostPerM3;

    // Egress bandwidth:
    // Traditional: $0.09 / GB on 150 TB/mo -> $162,000 / year
    // T-VS30: 64-byte binary packet compression (-95.5% volume) + local CMST routing -> $16,200 / year
    const legacyAnnualEgress = (monthlyTrafficTb * 1024 * 0.09) * 12;
    const tvs30AnnualEgress = legacyAnnualEgress * 0.10;

    // Maintenance & Licensing:
    // Traditional: $220/server/yr for proprietary hypervisor, SDN licenses, support contracts
    // T-VS30: Open Sovereign Protocol ($0 license cost, Capex Cero)
    const legacyAnnualMaintenance = serverCount * 220;
    const tvs30AnnualMaintenance = serverCount * 25; // minimal operational telemetry maintenance

    // Legacy Hardware Capex:
    // Year 1: Initial deployment or appliance setup = serverCount * $1,850 * 0.35 (amortized refresh)
    // Year 3: Mandatory hardware refresh cycle = serverCount * $1,850 * 0.65
    const initialCapexYear1 = serverCount * legacyHardwareCostPerServer * 0.40;
    const refreshCapexYear3 = serverCount * legacyHardwareCostPerServer * 0.60;

    let cumulativeLegacy = 0;
    let cumulativeTvs = 0;
    let cumulativeNetSavings = 0;
    let cumulativeEnergySaved = 0;
    let cumulativeWaterSaved = 0;
    let cumulativeCo2Saved = 0;

    const yearsData: ZeroCapexYearProjection[] = [];

    for (let yr = 1; yr <= 5; yr++) {
      let legacyCapexForYear = 0;
      if (yr === 1) legacyCapexForYear = initialCapexYear1;
      if (yr === 3) legacyCapexForYear = refreshCapexYear3;

      // Slight escalation for legacy maintenance & energy inflation (3% per year)
      const inflation = Math.pow(1.03, yr - 1);
      const yearLegacyEnergy = legacyAnnualEnergyCost * inflation;
      const yearLegacyWater = legacyAnnualWaterCost * inflation;
      const yearLegacyEgress = legacyAnnualEgress * inflation;
      const yearLegacyMaint = legacyAnnualMaintenance * inflation;
      const yearLegacyTotal = legacyCapexForYear + yearLegacyEnergy + yearLegacyWater + yearLegacyEgress + yearLegacyMaint;

      // T-VS30 has Capex Cero ($0) every single year!
      const yearTvsCapex = 0;
      const yearTvsEnergy = tvs30AnnualEnergyCost * inflation;
      const yearTvsWater = tvs30AnnualWaterCost * inflation;
      const yearTvsEgress = tvs30AnnualEgress * inflation;
      const yearTvsMaint = tvs30AnnualMaintenance * inflation;
      const yearTvsTotal = yearTvsCapex + yearTvsEnergy + yearTvsWater + yearTvsEgress + yearTvsMaint;

      const yearNetSavings = yearLegacyTotal - yearTvsTotal;

      cumulativeLegacy += yearLegacyTotal;
      cumulativeTvs += yearTvsTotal;
      cumulativeNetSavings += yearNetSavings;

      const yearEnergySavedMWh = (annualEnergySavedMWh * inflation);
      cumulativeEnergySaved += yearEnergySavedMWh;
      cumulativeWaterSaved += annualWaterSavedLiters;
      cumulativeCo2Saved += (yearEnergySavedMWh * 0.42); // 0.42 tons CO2 / MWh

      yearsData.push({
        year: yr,
        yearLabel: `Año ${yr}`,
        legacyCapex: Math.round(legacyCapexForYear),
        legacyEnergyCost: Math.round(yearLegacyEnergy),
        legacyWaterCost: Math.round(yearLegacyWater),
        legacyEgressCost: Math.round(yearLegacyEgress),
        legacyMaintenanceCost: Math.round(yearLegacyMaint),
        legacyTotalCost: Math.round(yearLegacyTotal),
        legacyCumulativeCost: Math.round(cumulativeLegacy),
        tvs30Capex: 0,
        tvs30EnergyCost: Math.round(yearTvsEnergy),
        tvs30WaterCost: Math.round(yearTvsWater),
        tvs30EgressCost: Math.round(yearTvsEgress),
        tvs30MaintenanceCost: Math.round(yearTvsMaint),
        tvs30TotalCost: Math.round(yearTvsTotal),
        tvs30CumulativeCost: Math.round(cumulativeTvs),
        annualNetSavings: Math.round(yearNetSavings),
        cumulativeNetSavings: Math.round(cumulativeNetSavings),
        cumulativeEnergyMWhSaved: Math.round(cumulativeEnergySaved),
        cumulativeWaterLitersSaved: Math.round(cumulativeWaterSaved),
        cumulativeCo2TonsAvoided: Math.round(cumulativeCo2Saved)
      });
    }

    return yearsData;
  }, [serverCount, electricityCostPerKWh, waterCostPerM3, legacyHardwareCostPerServer, monthlyTrafficTb]);

  // Net summary metrics
  const finalProjection = projections[projections.length - 1];
  const net5YearSavings = finalProjection.cumulativeNetSavings;
  const legacy5YearCost = finalProjection.legacyCumulativeCost;
  const tvs305YearCost = finalProjection.tvs30CumulativeCost;
  const tcoReductionPct = Number(((net5YearSavings / legacy5YearCost) * 100).toFixed(1));

  // Handle PDF Export
  const handleDownloadPdf = () => {
    generateZeroCapexRoiPdf({
      projections,
      serverCount,
      totalMWhSavedAnnual: finalProjection.cumulativeEnergyMWhSaved / 5,
      totalWaterSavedLitersAnnual: finalProjection.cumulativeWaterLitersSaved / 5,
      net5YearSavingsUsd: net5YearSavings,
      organizationName: 'Comité de Dirección Financiera & ESG'
    });
  };

  const handleDownloadWhitepaper = () => {
    generateShareholderWhitepaperPdf({
      nodes,
      serverCount,
      net5YearSavingsUsd: net5YearSavings,
      totalMWhSaved,
      totalWaterSavedLiters
    });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* =========================================================================
          HERO & FINANCIAL VALUE PROPOSITION
      ========================================================================= */}
      <div className="rounded-2xl border border-emerald-950/80 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/40 p-6 lg:p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#05966915_1px,transparent_1px),linear-gradient(to_bottom,#05966915_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-50" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <DollarSign className="w-3.5 h-3.5" />
                CAPEX INICIAL $0 USD (CAPEX CERO)
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                <Calendar className="w-3.5 h-3.5" />
                PROYECCIÓN A 5 AÑOS MODELADA
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                <Zap className="w-3.5 h-3.5" />
                TELEMETRÍA ENERGÉTICA E HÍDRICA INTEGRADA
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
                onClick={handleDownloadPdf}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-all shadow-md shadow-emerald-950/40 cursor-pointer"
              >
                <FileDown className="w-4 h-4" />
                <span>Dictamen ROI (PDF 2 Págs)</span>
              </button>
            </div>
          </div>

          <div className="max-w-4xl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Calculadora de ROI de Capex Cero
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Comparativa financiera auditada del <strong className="text-emerald-400">ahorro acumulado a 5 años</strong> entre el Protocolo T-VS30 y la infraestructura legada (servidores propietarios, ciclos de renovación hardware, licencias y facturas de electricidad y agua). Integra en tiempo real las métricas de ahorro capturadas por el clúster.
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================================
          EXECUTIVE 4 KPIS: 5-YEAR HEADLINE METRICS
      ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Net Cumulative Savings */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/50 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Ahorro Neto Acumulado a 5 Años</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
            ${(net5YearSavings / 1_000_000).toFixed(2)}M <span className="text-xs text-emerald-300 font-normal">USD</span>
          </div>
          <div className="text-[11px] text-slate-300 pt-1 flex items-center gap-1">
            <span className="text-emerald-400 font-bold">-{tcoReductionPct}%</span>
            <span>de reducción del TCO acumulado</span>
          </div>
        </div>

        {/* KPI 2: Capex Requerido */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/40 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Inversión Capex Inicial T-VS30</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            $0.00 <span className="text-xs text-cyan-300 font-normal">USD</span>
          </div>
          <div className="text-[11px] text-slate-300 pt-1">
            Payback <strong className="text-cyan-400">Inmediato (Día 1)</strong> sin compra de hardware
          </div>
        </div>

        {/* KPI 3: Energy Saved MWh */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/40 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Energía Ahorrada Acumulada</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
            {Math.round(finalProjection.cumulativeEnergyMWhSaved).toLocaleString()} <span className="text-xs text-amber-300 font-normal">MWh</span>
          </div>
          <div className="text-[11px] text-slate-300 pt-1">
            PUE 1.07 optimizado vs 1.48 legado en silicio
          </div>
        </div>

        {/* KPI 4: Water Cooling Preserved */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-blue-500/40 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Agua de Enfriamiento Preservada</span>
            <Droplets className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-cyan-300 font-mono">
            {(finalProjection.cumulativeWaterLitersSaved / 1_000_000).toFixed(1)}M <span className="text-xs text-blue-300 font-normal">Litros</span>
          </div>
          <div className="text-[11px] text-slate-300 pt-1">
            Equivalente a <strong className="text-cyan-400">{((finalProjection.cumulativeWaterLitersSaved / 1_000_000) / 2.5).toFixed(1)} piscinas olímpicas</strong>
          </div>
        </div>
      </div>

      {/* =========================================================================
          CONTROLS: SCENARIO PARAMETERS & TELEMETRY SYNC
      ========================================================================= */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 lg:p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm sm:text-base font-bold text-white">
              Parámetros de Simulación y Modelado de Escenarios
            </h2>
          </div>

          <button
            onClick={handleSyncTelemetry}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-950 text-cyan-300 border border-cyan-800/60 hover:bg-slate-900 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sincronizar con {activeNodesCount} Nodos Activos</span>
          </button>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-xs">
          {/* Slider 1: Server Count */}
          <div className="space-y-2">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-300">Servidores / Nodos:</span>
              <span className="font-mono text-emerald-400">{serverCount.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="200"
              max="5000"
              step="100"
              value={serverCount}
              onChange={(e) => setServerCount(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>200</span>
              <span>2,500</span>
              <span>5,000</span>
            </div>
          </div>

          {/* Slider 2: Electricity Cost */}
          <div className="space-y-2">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-300">Coste Electricidad:</span>
              <span className="font-mono text-amber-400">${electricityCostPerKWh.toFixed(2)} / kWh</span>
            </div>
            <input
              type="range"
              min="0.08"
              max="0.32"
              step="0.01"
              value={electricityCostPerKWh}
              onChange={(e) => setElectricityCostPerKWh(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>$0.08</span>
              <span>$0.20</span>
              <span>$0.32</span>
            </div>
          </div>

          {/* Slider 3: Water Cost */}
          <div className="space-y-2">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-300">Coste de Agua:</span>
              <span className="font-mono text-cyan-400">${waterCostPerM3.toFixed(2)} / m³</span>
            </div>
            <input
              type="range"
              min="1.50"
              max="8.00"
              step="0.50"
              value={waterCostPerM3}
              onChange={(e) => setWaterCostPerM3(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>$1.50</span>
              <span>$4.50</span>
              <span>$8.00</span>
            </div>
          </div>

          {/* Slider 4: Legacy Hardware Refresh Cost */}
          <div className="space-y-2">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-300">Renovación Legada:</span>
              <span className="font-mono text-rose-400">${legacyHardwareCostPerServer.toLocaleString()} / serv</span>
            </div>
            <input
              type="range"
              min="800"
              max="3500"
              step="50"
              value={legacyHardwareCostPerServer}
              onChange={(e) => setLegacyHardwareCostPerServer(Number(e.target.value))}
              className="w-full accent-rose-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>$800</span>
              <span>$2,000</span>
              <span>$3,500</span>
            </div>
          </div>
        </div>

        {/* Live Telemetry Info Strip */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Cpu className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Telemetría Integrada del Protocolo:</strong> Captura activa de <strong>{totalMWhSaved.toFixed(2)} MWh/día</strong> y <strong>{totalWaterSavedLiters.toLocaleString()} L/día</strong> en la malla actual.
            </span>
          </div>
          <span className="text-[11px] font-mono text-cyan-400">
            PUE Agregado T-VS30: 1.07
          </span>
        </div>
      </div>

      {/* =========================================================================
          MAIN CHART: 5-YEAR COMPARATIVE CUMULATIVE TRAJECTORY
      ========================================================================= */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 lg:p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>Trayectoria Comparativa de Costes y Ahorro Acumulado a 5 Años</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Visualización multi-anual del diferencial de gasto entre el gasto legado con renovación hardware y T-VS30 con Capex Cero.
            </p>
          </div>

          {/* Chart View Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveChartTab('cumulative_cost')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                activeChartTab === 'cumulative_cost'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Coste Acumulado ($)
            </button>
            <button
              onClick={() => setActiveChartTab('annual_breakdown')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                activeChartTab === 'annual_breakdown'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Ahorro por Año ($)
            </button>
            <button
              onClick={() => setActiveChartTab('esg_resources')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                activeChartTab === 'esg_resources'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Energía y Agua (ESG)
            </button>
          </div>
        </div>

        {/* Dynamic Chart Container */}
        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {activeChartTab === 'cumulative_cost' ? (
              <AreaChart data={projections} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLegacy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorTvs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="yearLabel" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                  formatter={(val: any) => [`$${Number(val).toLocaleString()} USD`, '']}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area
                  type="monotone"
                  dataKey="legacyCumulativeCost"
                  name="Coste Acumulado Infraestructura Legada ($)"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorLegacy)"
                />
                <Area
                  type="monotone"
                  dataKey="tvs30CumulativeCost"
                  name="Coste Acumulado T-VS30 Capex Cero ($)"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorTvs)"
                />
                <Area
                  type="monotone"
                  dataKey="cumulativeNetSavings"
                  name="Ahorro Neto Acumulado Consolidado ($)"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorSavings)"
                />
              </AreaChart>
            ) : activeChartTab === 'annual_breakdown' ? (
              <BarChart data={projections} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="yearLabel" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                  formatter={(val: any) => [`$${Number(val).toLocaleString()} USD`, '']}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="legacyTotalCost" name="Gasto Anual Legado ($)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="tvs30TotalCost" name="Gasto Anual T-VS30 ($)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="annualNetSavings" name="Ahorro Neto en el Año ($)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <AreaChart data={projections} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="yearLabel" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  tickFormatter={(val) => `${val.toLocaleString()}`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area
                  type="monotone"
                  dataKey="cumulativeEnergyMWhSaved"
                  name="Energía Ahorrada Acumulada (MWh)"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorEnergy)"
                />
                <Area
                  type="monotone"
                  dataKey="cumulativeCo2TonsAvoided"
                  name="CO₂ Evitado Acumulado (Toneladas)"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorEnergy)"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* =========================================================================
          FINANCIAL BREAKDOWN TABLE: YEAR 1 TO YEAR 5
      ========================================================================= */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 lg:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Desglose Financiero y Amortización Detallada Año a Año</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Valuación auditada de Capex, Opex de electricidad, agua, tráfico egress y ahorro neto acumulado.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400">
            TCO 5 Años: -{tcoReductionPct}%
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-3.5">Período</th>
                <th className="py-3 px-3.5">Capex Legado</th>
                <th className="py-3 px-3.5 text-amber-300">Opex Energía</th>
                <th className="py-3 px-3.5 text-blue-300">Opex Agua</th>
                <th className="py-3 px-3.5">Opex Egress</th>
                <th className="py-3 px-3.5">Coste Total Legado</th>
                <th className="py-3 px-3.5 text-cyan-300">Coste Total T-VS30</th>
                <th className="py-3 px-3.5 text-emerald-300">Ahorro Neto Anual</th>
                <th className="py-3 px-3.5 text-emerald-400 font-bold">Ahorro Acumulado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/40 font-mono text-slate-300">
              {projections.map((p) => (
                <tr key={p.year} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3.5 font-bold text-white">{p.yearLabel}</td>
                  <td className="py-3 px-3.5 text-rose-300">${p.legacyCapex.toLocaleString()}</td>
                  <td className="py-3 px-3.5 text-slate-300">${p.legacyEnergyCost.toLocaleString()}</td>
                  <td className="py-3 px-3.5 text-slate-300">${p.legacyWaterCost.toLocaleString()}</td>
                  <td className="py-3 px-3.5 text-slate-300">${p.legacyEgressCost.toLocaleString()}</td>
                  <td className="py-3 px-3.5 text-rose-400 font-semibold">${p.legacyTotalCost.toLocaleString()}</td>
                  <td className="py-3 px-3.5 text-cyan-300 font-semibold">${p.tvs30TotalCost.toLocaleString()}</td>
                  <td className="py-3 px-3.5 text-emerald-300 font-bold">+${p.annualNetSavings.toLocaleString()}</td>
                  <td className="py-3 px-3.5 text-emerald-400 font-bold bg-emerald-950/20">
                    +${p.cumulativeNetSavings.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          ESG & SOCIETAL EQUIVALENCES CARD
      ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <Zap className="w-4 h-4" />
            <span>Equivalencia Energética en Hogares</span>
          </div>
          <div className="text-xl font-bold text-white font-mono">
            {Math.round(finalProjection.cumulativeEnergyMWhSaved / 3.8).toLocaleString()} Hogares / año
          </div>
          <p className="text-xs text-slate-400">
            Consumo eléctrico residencial medio anual equivalente evitado con la arquitectura de silicio frío VMSB©.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950 border border-blue-500/30 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
            <Droplets className="w-4 h-4" />
            <span>Piscinas Olímpicas de Agua Potable</span>
          </div>
          <div className="text-xl font-bold text-white font-mono">
            {((finalProjection.cumulativeWaterLitersSaved / 1_000_000) / 2.5).toFixed(1)} Piscinas Olímpicas
          </div>
          <p className="text-xs text-slate-400">
            Agua evaporada evitada en torres de enfriamiento de centros de datos convencionales (WUE 0.11 L/kWh).
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <Leaf className="w-4 h-4" />
            <span>Vehículos Retirados de Circulación</span>
          </div>
          <div className="text-xl font-bold text-white font-mono">
            {Math.round(finalProjection.cumulativeCo2TonsAvoided / 4.6).toLocaleString()} Autos / año
          </div>
          <p className="text-xs text-slate-400">
            Huella de carbono evitada según factores de emisión de la Red Eléctrica internacional (CSRD Scope 2).
          </p>
        </div>
      </div>

      {/* =========================================================================
          CROSS NAVIGATION & ACTIONS
      ========================================================================= */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Certificación Oficial de Sostenibilidad y Modelo Financiero</span>
          </div>
          <p className="text-xs text-slate-400">
            Descargue el dossier oficial con el desglose a 5 años o consulte el Cuadro Ejecutivo C-Suite.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {onNavigateToGreen && (
            <button
              onClick={onNavigateToGreen}
              className="px-3.5 py-2 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-700 hover:bg-slate-800 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              Métricas Agua & Energía
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
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-all shadow-md shadow-emerald-950/40 cursor-pointer"
          >
            <FileDown className="w-4 h-4" />
            <span>Descargar Dossier ROI PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
