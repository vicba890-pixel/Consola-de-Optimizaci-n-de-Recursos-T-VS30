import React, { useState, useMemo } from 'react';
import { ProtocolNode } from '../types/protocol';
import { 
  computeLinearRegressionForecast, 
  computeExponentialSmoothingForecast,
  PredictiveResult 
} from '../utils/predictiveEngine';
import { 
  TrendingUp, 
  Activity, 
  Zap, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Clock, 
  Sparkles,
  Server,
  Layers,
  ShieldCheck
} from 'lucide-react';

interface PredictiveLoadForecasterProps {
  nodes: ProtocolNode[];
  onTriggerRebalance: () => void;
  isRebalancing: boolean;
}

export const PredictiveLoadForecaster: React.FC<PredictiveLoadForecasterProps> = ({
  nodes,
  onTriggerRebalance,
  isRebalancing,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('all');
  const [algorithm, setAlgorithm] = useState<'linear_regression' | 'exponential_smoothing'>('exponential_smoothing');
  const [horizonMinutes, setHorizonMinutes] = useState<number>(30); // 15, 30, 60
  const [alpha, setAlpha] = useState<number>(0.35);
  const [beta, setBeta] = useState<number>(0.15);
  const [preemptionTriggered, setPreemptionTriggered] = useState<boolean>(false);

  // Generate or sample historical data based on node selection
  const historicalData = useMemo(() => {
    // 12 historical points (past 60 minutes, 5-min intervals)
    if (selectedNodeId === 'all') {
      const base = nodes.reduce((acc, n) => acc + n.currentLoadGbps, 0); // ~1400 Gbps total
      return [
        Math.round(base * 0.86),
        Math.round(base * 0.88),
        Math.round(base * 0.87),
        Math.round(base * 0.91),
        Math.round(base * 0.90),
        Math.round(base * 0.93),
        Math.round(base * 0.95),
        Math.round(base * 0.94),
        Math.round(base * 0.97),
        Math.round(base * 0.96),
        Math.round(base * 0.99),
        base,
      ];
    } else {
      const node = nodes.find(n => n.id === selectedNodeId) || nodes[0];
      const base = node.currentLoadGbps;
      return [
        Math.round(base * 0.84),
        Math.round(base * 0.87),
        Math.round(base * 0.85),
        Math.round(base * 0.89),
        Math.round(base * 0.92),
        Math.round(base * 0.91),
        Math.round(base * 0.94),
        Math.round(base * 0.96),
        Math.round(base * 0.95),
        Math.round(base * 0.98),
        Math.round(base * 0.97),
        base,
      ];
    }
  }, [selectedNodeId, nodes]);

  const stepsCount = Math.round(horizonMinutes / 5);

  const forecastResult: PredictiveResult = useMemo(() => {
    if (algorithm === 'linear_regression') {
      return computeLinearRegressionForecast(historicalData, stepsCount, 5);
    } else {
      return computeExponentialSmoothingForecast(historicalData, alpha, beta, stepsCount, 5);
    }
  }, [historicalData, algorithm, stepsCount, alpha, beta]);

  const handleExecutePreemption = () => {
    setPreemptionTriggered(true);
    onTriggerRebalance();
    setTimeout(() => {
      setPreemptionTriggered(false);
    }, 3500);
  };

  // Find scale maximum for the chart
  const maxCapacity = useMemo(() => {
    if (selectedNodeId === 'all') {
      return nodes.reduce((acc, n) => acc + n.capacityGbps, 0); // ~3400 Gbps
    }
    const node = nodes.find(n => n.id === selectedNodeId) || nodes[0];
    return node.capacityGbps;
  }, [selectedNodeId, nodes]);

  const chartMaxY = Math.max(
    forecastResult.predictedPeakGbps * 1.25,
    maxCapacity * 0.85,
    500
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            09. Predicción de Carga Futura y Pre-Balanceo Anticipatorio
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Proyección estocástica de tráfico y estrés térmico a partir de muestras históricas de telemetría. Modelos de regresión lineal simple y suavizado exponencial doble de Holt para reequilibrar el Árbol CMST antes de que ocurran picos de latencia.
          </p>
        </div>

        {/* Algorithm and Horizon Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Algorithm Toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
            <button
              onClick={() => setAlgorithm('exponential_smoothing')}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
                algorithm === 'exponential_smoothing'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Suavizado Exponencial Holt
            </button>
            <button
              onClick={() => setAlgorithm('linear_regression')}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
                algorithm === 'linear_regression'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Regresión Lineal OLS
            </button>
          </div>

          {/* Horizon Selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
            {[15, 30, 60].map(mins => (
              <button
                key={mins}
                onClick={() => setHorizonMinutes(mins)}
                className={`px-2.5 py-1.5 rounded transition-colors whitespace-nowrap ${
                  horizonMinutes === mins
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                +{mins}m
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Node Selector Strip & Parameters */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Node dropdown */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-300 whitespace-nowrap">
            Objetivo de Predicción:
          </label>
          <select
            value={selectedNodeId}
            onChange={(e) => setSelectedNodeId(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400 font-sans"
          >
            <option value="all">Red Completa (Agregado Multi-Región)</option>
            {nodes.map(node => (
              <option key={node.id} value={node.id}>
                {node.name} ({node.locationName})
              </option>
            ))}
          </select>
        </div>

        {/* Hyperparameters tuning for Exponential Smoothing */}
        {algorithm === 'exponential_smoothing' && (
          <div className="flex flex-wrap items-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-mono">Factor Nivel (α):</span>
              <input
                type="range"
                min="0.10"
                max="0.90"
                step="0.05"
                value={alpha}
                onChange={(e) => setAlpha(Number(e.target.value))}
                className="w-20 accent-cyan-400 cursor-pointer"
              />
              <span className="font-mono text-cyan-300 font-bold tabular-nums">{alpha.toFixed(2)}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-mono">Factor Tendencia (β):</span>
              <input
                type="range"
                min="0.05"
                max="0.50"
                step="0.05"
                value={beta}
                onChange={(e) => setBeta(Number(e.target.value))}
                className="w-20 accent-cyan-400 cursor-pointer"
              />
              <span className="font-mono text-cyan-300 font-bold tabular-nums">{beta.toFixed(2)}</span>
            </div>
          </div>
        )}

        {algorithm === 'linear_regression' && (
          <div className="text-xs text-slate-400 font-mono">
            Pendiente: <span className="text-cyan-300 font-bold">+{forecastResult.slopeOrTrend} Gbps/paso</span> · R²: <span className="text-emerald-400 font-bold">{forecastResult.rSquaredOrMape}</span>
          </div>
        )}
      </div>

      {/* Predictive KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Carga Actual vs Proyectada */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Carga Actual</span>
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono mt-1 tabular-nums">
            {forecastResult.currentLoadGbps} <span className="text-sm font-normal text-slate-400">Gbps</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Muestreo continuo cada 5 min
          </div>
        </div>

        {/* Card 2: Pico Proyectado en Horizonte */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Pico Proyectado (+{horizonMinutes}m)</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-300 font-mono mt-1 tabular-nums">
            {forecastResult.predictedPeakGbps.toFixed(0)} <span className="text-sm font-normal text-slate-400">Gbps</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 font-mono">
            {forecastResult.projectedGrowthPercent >= 0 ? '+' : ''}{forecastResult.projectedGrowthPercent}% de variación
          </div>
        </div>

        {/* Card 3: Calidad del Modelo / Bondad de Ajuste */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{algorithm === 'linear_regression' ? 'Bondad de Ajuste (R²)' : 'Error Absoluto (MAPE)'}</span>
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-300 font-mono mt-1 tabular-nums">
            {algorithm === 'linear_regression' ? forecastResult.rSquaredOrMape : `${forecastResult.rSquaredOrMape}%`}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {algorithm === 'linear_regression' ? 'Ajuste lineal de varianza' : 'Bajo error porcentual medio'}
          </div>
        </div>

        {/* Card 4: Diagnóstico y Riesgo de Cuello de Botella */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Riesgo Preventivo</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-sm font-bold font-mono mt-1">
            {forecastResult.riskStatus === 'nominal' && (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> NOMINAL (SEGURO)
              </span>
            )}
            {forecastResult.riskStatus === 'elevated' && (
              <span className="text-amber-400 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" /> ELEVADO (PREVENCIÓN)
              </span>
            )}
            {forecastResult.riskStatus === 'critical_preemption_required' && (
              <span className="text-red-400 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" /> PRE-BALANCEO REQUERIDO
              </span>
            )}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 truncate">
            Latencia estimada &lt; 0.38 ms
          </div>
        </div>
      </div>

      {/* Main Interactive SVG Forecast Chart */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="text-xs font-mono text-cyan-400">TRAYECTORIA HISTÓRICA Y CONO DE PROYECCIÓN (95% CI)</div>
            <h3 className="text-base font-bold text-white mt-0.5">
              Evolución Temporal de Carga y Predicción (+{horizonMinutes} Minutos)
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-3 h-0.5 bg-cyan-400 inline-block" /> Real Histórico
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-3 h-0.5 bg-emerald-400 border-b border-dashed inline-block" /> Proyección
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-3 h-2 bg-emerald-500/10 border border-emerald-500/20 inline-block" /> Intervalo 95%
            </span>
          </div>
        </div>

        {/* SVG Graphic */}
        <div className="h-72 w-full bg-slate-950/80 rounded-lg border border-slate-800/80 p-3 relative flex items-end">
          <svg viewBox="0 0 800 240" className="w-full h-full overflow-visible select-none">
            {/* Horizontal Grid lines */}
            <line x1="40" y1="50" x2="780" y2="50" stroke="#1e293b" strokeWidth="1" strokeDasharray="3,3" />
            <line x1="40" y1="110" x2="780" y2="110" stroke="#1e293b" strokeWidth="1" strokeDasharray="3,3" />
            <line x1="40" y1="170" x2="780" y2="170" stroke="#1e293b" strokeWidth="1" strokeDasharray="3,3" />

            {/* Capacity Limit indicator line */}
            <line x1="40" y1="35" x2="780" y2="35" stroke="#ef4444" strokeWidth="1" strokeDasharray="4,4" opacity="0.5" />
            <text x="770" y="30" fill="#f87171" fontSize="9" textAnchor="end" fontFamily="monospace">
              Umbral Alerta Capacidad (80% Sat)
            </text>

            {/* Split marker: Past vs Future boundary */}
            {(() => {
              const histCount = historicalData.length;
              const totalCount = forecastResult.forecastPoints.length;
              if (totalCount === 0) return null;
              const splitX = 40 + ((histCount - 1) / (totalCount - 1)) * 740;
              return (
                <g>
                  <line x1={splitX} y1="10" x2={splitX} y2="215" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="2,2" opacity="0.7" />
                  <text x={splitX - 6} y="22" fill="#38bdf8" fontSize="9" textAnchor="end" fontFamily="monospace">
                    AHORA (t₀)
                  </text>
                  <text x={splitX + 6} y="22" fill="#10b981" fontSize="9" textAnchor="start" fontFamily="monospace">
                    PROYECCIÓN FUTURA &gt;
                  </text>
                </g>
              );
            })()}

            {/* Confidence Interval Shaded Band (Future) */}
            {(() => {
              const points = forecastResult.forecastPoints;
              if (points.length < 2) return null;
              const histCount = historicalData.length;

              // build polygon points for future area
              const futurePoints = points.slice(histCount - 1);
              if (futurePoints.length < 2) return null;

              const upperCoords: string[] = [];
              const lowerCoords: string[] = [];

              futurePoints.forEach((pt) => {
                const x = 40 + (pt.step / (points.length - 1)) * 740;
                const yUpper = 200 - (pt.upperBound / chartMaxY) * 170;
                const yLower = 200 - (pt.lowerBound / chartMaxY) * 170;
                upperCoords.push(`${x},${Math.max(15, Math.min(210, yUpper))}`);
                lowerCoords.unshift(`${x},${Math.max(15, Math.min(210, yLower))}`);
              });

              const polyString = [...upperCoords, ...lowerCoords].join(' ');
              return <polygon points={polyString} fill="#10b981" fillOpacity="0.12" />;
            })()}

            {/* Projected Curve (Dashed line) */}
            {(() => {
              const points = forecastResult.forecastPoints;
              if (points.length < 2) return null;
              const histCount = historicalData.length;
              const futurePoints = points.slice(histCount - 1);

              const linePoints = futurePoints
                .map(pt => {
                  const x = 40 + (pt.step / (points.length - 1)) * 740;
                  const y = 200 - (pt.predicted / chartMaxY) * 170;
                  return `${x},${Math.max(15, Math.min(210, y))}`;
                })
                .join(' ');

              return (
                <polyline
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeDasharray="5,4"
                  points={linePoints}
                />
              );
            })()}

            {/* Historical Actual Line (Solid Cyan) */}
            {(() => {
              const points = forecastResult.forecastPoints;
              if (points.length < 2) return null;
              const histCount = historicalData.length;
              const pastPoints = points.slice(0, histCount);

              const linePoints = pastPoints
                .map(pt => {
                  const x = 40 + (pt.step / (points.length - 1)) * 740;
                  const val = pt.actual !== undefined ? pt.actual : pt.predicted;
                  const y = 200 - (val / chartMaxY) * 170;
                  return `${x},${Math.max(15, Math.min(210, y))}`;
                })
                .join(' ');

              return (
                <polyline
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="2.5"
                  points={linePoints}
                />
              );
            })()}

            {/* Render Data Point Markers and Labels */}
            {forecastResult.forecastPoints.map((pt, idx) => {
              const totalCount = forecastResult.forecastPoints.length;
              const x = 40 + (pt.step / (totalCount - 1)) * 740;
              const val = pt.actual !== undefined ? pt.actual : pt.predicted;
              const y = 200 - (val / chartMaxY) * 170;
              const isFuture = pt.actual === undefined;

              // Only draw every 2nd or 3rd label to avoid clutter
              const showLabel = idx % 2 === 0 || idx === totalCount - 1 || idx === historicalData.length - 1;

              return (
                <g key={idx}>
                  <circle
                    cx={x}
                    cy={y}
                    r={isFuture ? 3.5 : 4}
                    fill={isFuture ? '#10b981' : '#22d3ee'}
                    stroke="#090d16"
                    strokeWidth={1.5}
                  />

                  {showLabel && (
                    <text
                      x={x}
                      y={230}
                      textAnchor="middle"
                      fill="#64748b"
                      fontSize="8.5"
                      fontFamily="monospace"
                    >
                      {pt.timeLabel}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Predictive Steering & Preemption Trigger Bar */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">
                Recomendación de Pre-Balanceo T-VS30:
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {forecastResult.preemptiveActionSuggested}
              </p>
            </div>
          </div>

          <button
            onClick={handleExecutePreemption}
            disabled={isRebalancing || preemptionTriggered}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shadow-sm ${
              preemptionTriggered
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-emerald-500/20'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRebalancing ? 'animate-spin' : ''}`} />
            <span>
              {preemptionTriggered
                ? 'Pre-Balanceo CMST Aplicado con Éxito'
                : isRebalancing
                ? 'Rebalanceando Rutas...'
                : 'Ejecutar Pre-Balanceo Anticipatorio'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
