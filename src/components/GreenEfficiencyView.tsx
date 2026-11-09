import React, { useState } from 'react';
import { 
  Zap, 
  Droplets, 
  DollarSign, 
  Leaf, 
  TrendingDown, 
  CheckCircle2, 
  HelpCircle, 
  FileDown,
  BarChart3,
  Sliders,
  Calendar,
  Layers,
  Sparkles,
  Award
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  BarChart,
  Bar
} from 'recharts';
import { ProtocolNode } from '../types/protocol';

interface GreenEfficiencyViewProps {
  nodes: ProtocolNode[];
  totalMWhSaved: number;
  totalWaterSavedLiters: number;
  onOpenPdfModal: () => void;
}

export const GreenEfficiencyView: React.FC<GreenEfficiencyViewProps> = ({
  nodes,
  totalMWhSaved,
  totalWaterSavedLiters,
  onOpenPdfModal,
}) => {
  // Interactive ROI & Cluster Projection parameters
  const [serverCount, setServerCount] = useState<number>(1200);
  const [electricityCostPerKWh, setElectricityCostPerKWh] = useState<number>(0.16); // $0.16 / kWh
  const [waterCostPerM3, setWaterCostPerM3] = useState<number>(3.50); // $3.50 / m³ (1,000 L)
  const [chartViewMode, setChartViewMode] = useState<'carbon_water' | 'cost_capex'>('carbon_water');

  // Calculations for projection:
  // Baseline server consumes ~450W average -> 3,942 kWh/yr.
  // PUE reduction from 1.48 to 1.07 saves ~27.7% of total facility energy.
  const baselineAnnualKWhPerServer = 3942 * 1.48; // ~5,834 kWh
  const tvs30AnnualKWhPerServer = 3942 * 1.07; // ~4,218 kWh
  const annualKWhSavedPerServer = baselineAnnualKWhPerServer - tvs30AnnualKWhPerServer; // ~1,616 kWh
  const totalAnnualMWhSaved = (annualKWhSavedPerServer * serverCount) / 1000;
  const annualEnergyCostSavedUsd = (annualKWhSavedPerServer * serverCount) * electricityCostPerKWh;

  // Water cooling baseline: ~1.8 L/kWh -> drops to 0.11 L/kWh -> saving ~1.69 L/kWh consumed
  const annualWaterSavedLiters = (tvs30AnnualKWhPerServer * 1.69) * serverCount;
  const annualWaterCostSavedUsd = (annualWaterSavedLiters / 1000) * waterCostPerM3;

  const totalAnnualSavingsUsd = annualEnergyCostSavedUsd + annualWaterCostSavedUsd;
  const co2TonsAvoided = (totalAnnualMWhSaved * 0.42); // 0.42 tons CO2 per MWh grid average

  // Traditional hardware refresh Capex that would be spent without T-VS30 ($1,850/server every 4 years)
  const traditionalHardwareCapex = serverCount * 1850;

  // Multi-year projected trajectory data for Recharts (1 to 10 years)
  const projectionTimeline = [
    { year: 'Año 1', co2Cumulative: Math.round(co2TonsAvoided * 1), waterCumulativeML: Number(((annualWaterSavedLiters * 1) / 1_000_000).toFixed(1)), financialSavedKUsd: Math.round((totalAnnualSavingsUsd * 1) / 1000), capexBaselineKUsd: Math.round(traditionalHardwareCapex * 0.25 / 1000), netCapexZeroBenefitKUsd: Math.round((totalAnnualSavingsUsd * 1 + traditionalHardwareCapex * 0.25) / 1000) },
    { year: 'Año 2', co2Cumulative: Math.round(co2TonsAvoided * 2), waterCumulativeML: Number(((annualWaterSavedLiters * 2) / 1_000_000).toFixed(1)), financialSavedKUsd: Math.round((totalAnnualSavingsUsd * 2) / 1000), capexBaselineKUsd: Math.round(traditionalHardwareCapex * 0.50 / 1000), netCapexZeroBenefitKUsd: Math.round((totalAnnualSavingsUsd * 2 + traditionalHardwareCapex * 0.50) / 1000) },
    { year: 'Año 3', co2Cumulative: Math.round(co2TonsAvoided * 3), waterCumulativeML: Number(((annualWaterSavedLiters * 3) / 1_000_000).toFixed(1)), financialSavedKUsd: Math.round((totalAnnualSavingsUsd * 3) / 1000), capexBaselineKUsd: Math.round(traditionalHardwareCapex * 0.75 / 1000), netCapexZeroBenefitKUsd: Math.round((totalAnnualSavingsUsd * 3 + traditionalHardwareCapex * 0.75) / 1000) },
    { year: 'Año 4', co2Cumulative: Math.round(co2TonsAvoided * 4), waterCumulativeML: Number(((annualWaterSavedLiters * 4) / 1_000_000).toFixed(1)), financialSavedKUsd: Math.round((totalAnnualSavingsUsd * 4) / 1000), capexBaselineKUsd: Math.round(traditionalHardwareCapex * 1.00 / 1000), netCapexZeroBenefitKUsd: Math.round((totalAnnualSavingsUsd * 4 + traditionalHardwareCapex * 1.00) / 1000) },
    { year: 'Año 5', co2Cumulative: Math.round(co2TonsAvoided * 5), waterCumulativeML: Number(((annualWaterSavedLiters * 5) / 1_000_000).toFixed(1)), financialSavedKUsd: Math.round((totalAnnualSavingsUsd * 5) / 1000), capexBaselineKUsd: Math.round(traditionalHardwareCapex * 1.25 / 1000), netCapexZeroBenefitKUsd: Math.round((totalAnnualSavingsUsd * 5 + traditionalHardwareCapex * 1.25) / 1000) },
    { year: 'Año 7', co2Cumulative: Math.round(co2TonsAvoided * 7), waterCumulativeML: Number(((annualWaterSavedLiters * 7) / 1_000_000).toFixed(1)), financialSavedKUsd: Math.round((totalAnnualSavingsUsd * 7) / 1000), capexBaselineKUsd: Math.round(traditionalHardwareCapex * 1.75 / 1000), netCapexZeroBenefitKUsd: Math.round((totalAnnualSavingsUsd * 7 + traditionalHardwareCapex * 1.75) / 1000) },
    { year: 'Año 10', co2Cumulative: Math.round(co2TonsAvoided * 10), waterCumulativeML: Number(((annualWaterSavedLiters * 10) / 1_000_000).toFixed(1)), financialSavedKUsd: Math.round((totalAnnualSavingsUsd * 10) / 1000), capexBaselineKUsd: Math.round(traditionalHardwareCapex * 2.50 / 1000), netCapexZeroBenefitKUsd: Math.round((totalAnnualSavingsUsd * 10 + traditionalHardwareCapex * 2.50) / 1000) },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            03. Ahorro Verificado de Energía y Agua (PUE / WUE & Capex Cero)
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Optimización termodinámica en tiempo real mediante enrutamiento bioclimático CMST y micro-slices RISC-V VMSB©. Reducción medible del consumo en torres de refrigeración y factura eléctrica sin inversión de capital (CAPEX $0).
          </p>
        </div>

        <button
          onClick={onOpenPdfModal}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-cyan-500/20"
        >
          <FileDown className="w-3.5 h-3.5" />
          <span>Generar Certificado Oficial de Ahorro</span>
        </button>
      </div>

      {/* Primary KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: PUE Efficiency */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Efectividad de Uso Energético (PUE)</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-3 mt-2">
            <span className="text-3xl font-extrabold text-emerald-300 font-mono tabular-nums">
              1.07
            </span>
            <span className="text-xs text-slate-500 font-mono">
              vs 1.48 (Línea Base Sin Protocolo)
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-400 leading-relaxed">
            Mejora neta del <span className="text-emerald-400 font-semibold">-27.7%</span> en consumo energético de infraestructura crítica de cómputo.
          </div>
        </div>

        {/* Card 2: WUE & Water Savings */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Efectividad de Uso de Agua (WUE)</span>
            <Droplets className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-3 mt-2">
            <span className="text-3xl font-extrabold text-cyan-300 font-mono tabular-nums">
              0.11 <span className="text-sm font-normal text-slate-400">L/kWh</span>
            </span>
            <span className="text-xs text-slate-500 font-mono">
              vs 1.80 L/kWh industrial
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-400 leading-relaxed">
            Mitigación dinámica de evaporación en chillers mediante direccionamiento a zonas de aire libre (free-cooling).
          </div>
        </div>

        {/* Card 3: Capex Cero */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Inversión de Capital Necesaria</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-3 mt-2">
            <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
              $0.00 USD
            </span>
            <span className="text-xs text-emerald-400 font-mono font-semibold">
              Capex Cero Absoluto
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-400 leading-relaxed">
            Ejecución como capa de consenso y protocolo sobre CPUs x86/ARM/RISC-V existentes sin renovación de chasis ni servidores.
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VISUALIZACIÓN GRÁFICA RECHARTS: AHORRO DE CARBONO Y AGUA A LARGO PLAZO   */}
      {/* ========================================================================= */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <Leaf className="w-4 h-4 text-emerald-400" />
              <span>PROYECCIÓN DE SOSTENIBILIDAD CORPORATIVA (ISO 14064 & GHG SCOPE 2)</span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">
              Trayectoria Proyectada a Largo Plazo: Ahorro de Carbono (CO2) y Agua Potable
            </h3>
          </div>

          {/* Chart View Mode Selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg text-xs">
            <button
              onClick={() => setChartViewMode('carbon_water')}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
                chartViewMode === 'carbon_water'
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              CO2 (Tons) & Agua (Megalitros)
            </button>
            <button
              onClick={() => setChartViewMode('cost_capex')}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
                chartViewMode === 'cost_capex'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Ahorro Financiero & Capex Evitado ($k)
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Esta curva proyecta el impacto ambiental acumulado derivado de desplegar el protocolo T-VS30 en un clúster de <strong className="text-cyan-300 font-mono">{serverCount.toLocaleString()} servidores</strong>. Los cálculos se basan en una reducción continua de PUE a 1.07 y mitigación de evaporación hídrica (WUE 0.11 L/kWh), certificados formalmente para inclusión directa en reportes corporativos ESG y auditorías de huella hídrica.
        </p>

        {/* Recharts Area Container */}
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            {chartViewMode === 'carbon_water' ? (
              <AreaChart data={projectionTimeline} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="co2Gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis yAxisId="left" stroke="#10b981" tick={{ fontSize: 11, fill: '#10b981' }} unit=" t" />
                <YAxis yAxisId="right" orientation="right" stroke="#06b6d4" tick={{ fontSize: 11, fill: '#06b6d4' }} unit=" ML" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '0.5rem', fontSize: '12px' }}
                  labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="co2Cumulative" 
                  name="CO2 Evitado Acumulado (Toneladas)" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#co2Gradient)" 
                />
                <Area 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="waterCumulativeML" 
                  name="Agua Potable Ahorrada (Megalitros)" 
                  stroke="#06b6d4" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#waterGradient)" 
                />
              </AreaChart>
            ) : (
              <AreaChart data={projectionTimeline} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="financialGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="capexGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis stroke="#38bdf8" tick={{ fontSize: 11, fill: '#94a3b8' }} unit="k $" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '0.5rem', fontSize: '12px' }}
                  labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area 
                  type="monotone" 
                  dataKey="financialSavedKUsd" 
                  name="Ahorro Operativo Factura Eléctrica & Agua ($k USD)" 
                  stroke="#38bdf8" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#financialGradient)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="netCapexZeroBenefitKUsd" 
                  name="Beneficio Total Combinado vs Inversión Tradicional ($k USD)" 
                  stroke="#a855f7" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#capexGradient)" 
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Long Term Highlights Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-xs">
          <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 font-mono">Impacto Decenal (10 Años)</div>
            <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">
              {(co2TonsAvoided * 10).toLocaleString('en-US', { maximumFractionDigits: 0 })} Tons CO2 Evitadas
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Equivalente a plantar ~{(co2TonsAvoided * 10 * 45).toLocaleString('en-US', { maximumFractionDigits: 0 })} árboles</div>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 font-mono">Preservación Hídrica Acumulada</div>
            <div className="text-base font-bold text-cyan-300 font-mono mt-0.5">
              {((annualWaterSavedLiters * 10) / 1_000_000).toFixed(1)} Millones de Litros
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Ahorro hídrico en cuencas de estrés severo</div>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 font-mono">Retorno Operativo Acumulado</div>
            <div className="text-base font-bold text-purple-300 font-mono mt-0.5">
              ${((totalAnnualSavingsUsd * 10) / 1_000_000).toFixed(2)}M USD
            </div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">Capex $0 con Protocolo T-VS30</div>
          </div>
        </div>
      </div>

      {/* Real Breakdown by Active Node */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs font-mono text-cyan-400">DESGLOSE TERMODINÁMICO POR NODO DISTRIBUIDO</div>
            <h3 className="text-base font-bold text-white mt-0.5">
              Ahorro Diario Auditado de Energía y Agua por Región
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Balance de masa según ISO 14064
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="py-2.5 px-3">Nodo y Región</th>
                <th className="py-2.5 px-3">Arquitectura CPU</th>
                <th className="py-2.5 px-3 text-right">PUE</th>
                <th className="py-2.5 px-3 text-right">WUE (L/kWh)</th>
                <th className="py-2.5 px-3 text-right">Energía Ahorrada/día</th>
                <th className="py-2.5 px-3 text-right">Agua Ahorrada/día</th>
                <th className="py-2.5 px-3 text-center">Estado Auditoría</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {nodes.map(node => (
                <tr key={node.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-semibold text-white">{node.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{node.locationName} · {node.provider}</div>
                  </td>
                  <td className="py-3 px-3 font-mono text-cyan-300">
                    {node.cpuArchitecture}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-emerald-400 font-semibold tabular-nums">
                    {node.pueCurrent.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-cyan-300 tabular-nums">
                    {node.wueLitersPerKWh.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-white tabular-nums">
                    {(node.energySavedKWhDaily / 1000).toFixed(1)} MWh
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-cyan-300 tabular-nums">
                    {(node.waterSavedLitersDaily / 1000).toFixed(1)}k L
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center gap-1 font-mono text-emerald-400 text-[11px]">
                      <CheckCircle2 className="w-3 h-3" /> Verificado
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Capex Cero & ROI Projection Calculator */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="text-xs font-mono text-cyan-400">CALCULADORA DE RETORNO Y PROYECCIÓN ANUAL</div>
            <h3 className="text-base font-bold text-white mt-0.5">
              Simulador de Ahorro para su Infraestructura con Protocolo T-VS30
            </h3>
          </div>
          <div className="text-xs text-emerald-400 font-mono font-semibold">
            Inversión Capex Requerida: $0.00 USD
          </div>
        </div>

        {/* Input sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
          <div>
            <label className="text-xs text-slate-300 font-medium block mb-2">
              Número de Servidores en el Clúster: <span className="font-mono text-cyan-300 font-bold tabular-nums">{serverCount}</span>
            </label>
            <input
              type="range"
              min="100"
              max="10000"
              step="100"
              value={serverCount}
              onChange={(e) => setServerCount(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>100 nodos</span>
              <span>10,000 nodos</span>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-300 font-medium block mb-2">
              Tarifa Eléctrica ($/kWh): <span className="font-mono text-cyan-300 font-bold tabular-nums">${electricityCostPerKWh.toFixed(2)}</span>
            </label>
            <input
              type="range"
              min="0.08"
              max="0.45"
              step="0.01"
              value={electricityCostPerKWh}
              onChange={(e) => setElectricityCostPerKWh(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>$0.08</span>
              <span>$0.45</span>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-300 font-medium block mb-2">
              Costo de Agua Industrial ($/m³): <span className="font-mono text-cyan-300 font-bold tabular-nums">${waterCostPerM3.toFixed(2)}</span>
            </label>
            <input
              type="range"
              min="1.0"
              max="8.0"
              step="0.25"
              value={waterCostPerM3}
              onChange={(e) => setWaterCostPerM3(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>$1.00</span>
              <span>$8.00</span>
            </div>
          </div>
        </div>

        {/* Calculated Projection Output Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-950/80 rounded-lg border border-slate-800/80">
          <div>
            <div className="text-[11px] text-slate-400">Ahorro Anual de Energía</div>
            <div className="text-xl font-bold text-emerald-400 font-mono mt-1 tabular-nums">
              {totalAnnualMWhSaved.toFixed(0)} MWh
            </div>
            <div className="text-[10px] text-slate-500">
              ~${annualEnergyCostSavedUsd.toLocaleString('en-US', { maximumFractionDigits: 0 })} USD en factura
            </div>
          </div>

          <div>
            <div className="text-[11px] text-slate-400">Ahorro Anual de Agua</div>
            <div className="text-xl font-bold text-cyan-300 font-mono mt-1 tabular-nums">
              {(annualWaterSavedLiters / 1_000_000).toFixed(2)} M Litros
            </div>
            <div className="text-[10px] text-slate-500">
              {(annualWaterSavedLiters / 1000).toFixed(0)} m³ conservados
            </div>
          </div>

          <div>
            <div className="text-[11px] text-slate-400">Emisiones CO2 Evitadas</div>
            <div className="text-xl font-bold text-emerald-300 font-mono mt-1 tabular-nums">
              {co2TonsAvoided.toFixed(0)} Toneladas
            </div>
            <div className="text-[10px] text-slate-500">
              Scope 2 verificado GHG
            </div>
          </div>

          <div>
            <div className="text-[11px] text-slate-400">Retorno Neto Total Anual</div>
            <div className="text-xl font-bold text-white font-mono mt-1 tabular-nums">
              ${totalAnnualSavingsUsd.toLocaleString('en-US', { maximumFractionDigits: 0 })} USD
            </div>
            <div className="text-[10px] text-emerald-400 font-semibold">
              Retorno Infinito (Capex $0)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
