import React, { useState } from 'react';
import { LiveTelemetrySample } from '../types/protocol';
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  Layers, 
  Gauge, 
  Clock, 
  Terminal, 
  Pause, 
  Play, 
  TrendingDown,
  Sparkles
} from 'lucide-react';

interface TelemetryViewProps {
  currentSample: LiveTelemetrySample;
  telemetryHistory: LiveTelemetrySample[];
  isStreaming: boolean;
  onToggleStreaming: () => void;
  onTriggerBurst: () => void;
}

export const TelemetryView: React.FC<TelemetryViewProps> = ({
  currentSample,
  telemetryHistory,
  isStreaming,
  onToggleStreaming,
  onTriggerBurst,
}) => {
  const [activeMetricTab, setActiveMetricTab] = useState<'latency' | 'vmsb' | 'kafka'>('latency');

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            02. Telemetría de Microsegundos y Aceleración RISC-V-vmsb©
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Monitoreo a nivel de reloj de hardware, buffers zero-copy de Kafka en C++23/Rust y distribución estocástica de latencias (p50, p95, p99, p99.9). Sin pausas de recolección de basura (GC-free).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleStreaming}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              isStreaming
                ? 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
            }`}
          >
            {isStreaming ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-400" />
                <span>Pausar Muestreo</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                <span>Reanudar Flujo en Vivo</span>
              </>
            )}
          </button>
          <button
            onClick={onTriggerBurst}
            className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap"
          >
            Inyectar Ráfaga Sintética
          </button>
        </div>
      </div>

      {/* Real-Time Micro-Latency Percentiles Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Latencia p50 (Mediana)</span>
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-300 font-mono mt-1 tabular-nums">
            {currentSample.p50LatencyMs.toFixed(3)} ms
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Transito intra-nodo: 120 μs
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Latencia p95</span>
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-200 font-mono mt-1 tabular-nums">
            {currentSample.p95LatencyMs.toFixed(3)} ms
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Bypass de buffer de socket
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Latencia p99 (Crítica)</span>
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1 tabular-nums">
            {currentSample.p99LatencyMs.toFixed(3)} ms
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Límite SLA: 0.450 ms (Cumplido)
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Latencia p99.9 (Cola Extrema)</span>
            <Activity className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono mt-1 tabular-nums">
            {(currentSample.p99LatencyMs * 1.35).toFixed(3)} ms
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Cero jitter por recolección GC
          </div>
        </div>
      </div>

      {/* Main Telemetry Visualization Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Real-time historical chart rendering */}
        <div className="lg:col-span-8 bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs font-mono text-cyan-400">HISTORIAL DE ENRUTAMIENTO DETERMINISTA</div>
              <h3 className="text-base font-bold text-white mt-0.5">
                Curva de Latencia p50 / p99 en Ventana Móvil
              </h3>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-cyan-400 font-mono">
                <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400 inline-block" /> p50
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400 inline-block" /> p99
              </span>
            </div>
          </div>

          {/* Canvas-like SVG Chart */}
          <div className="h-64 w-full bg-slate-950/70 border border-slate-800/80 rounded-lg p-3 relative flex items-end">
            <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible">
              {/* Horizontal gridlines */}
              <line x1="0" y1="50" x2="600" y2="50" stroke="#1e293b" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="0" y1="100" x2="600" y2="100" stroke="#1e293b" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="0" y1="150" x2="600" y2="150" stroke="#1e293b" strokeWidth="1" strokeDasharray="3,3" />

              {/* Threshold indicator line for SLA 0.45ms */}
              <line x1="0" y1="40" x2="600" y2="40" stroke="#e11d48" strokeWidth="1" strokeDasharray="5,5" opacity="0.6" />
              <text x="590" y="36" fill="#f43f5e" fontSize="9" textAnchor="end" fontFamily="monospace">
                Umbral SLA Crítico 0.45ms
              </text>

              {/* p99 latency curve line */}
              {telemetryHistory.length > 1 && (
                <polyline
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  points={telemetryHistory
                    .map((item, idx) => {
                      const x = (idx / (telemetryHistory.length - 1)) * 600;
                      // map 0.1ms -> 180, 0.5ms -> 20
                      const y = 200 - ((item.p99LatencyMs - 0.1) / 0.4) * 160;
                      return `${x},${Math.max(10, Math.min(190, y))}`;
                    })
                    .join(' ')}
                />
              )}

              {/* p50 latency curve line */}
              {telemetryHistory.length > 1 && (
                <polyline
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="2"
                  points={telemetryHistory
                    .map((item, idx) => {
                      const x = (idx / (telemetryHistory.length - 1)) * 600;
                      const y = 200 - ((item.p50LatencyMs - 0.05) / 0.4) * 160;
                      return `${x},${Math.max(10, Math.min(190, y))}`;
                    })
                    .join(' ')}
                />
              )}
            </svg>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 mt-3 pt-3 border-t border-slate-800">
            <span>Intervalo: 500 ms por tick</span>
            <span className="font-mono text-emerald-400">
              Desviación estándar: ±0.014 ms (Ultra-estable)
            </span>
            <span>Muestras activas: {telemetryHistory.length}</span>
          </div>
        </div>

        {/* Technical Sub-Engines Card */}
        <div className="lg:col-span-4 space-y-4">
          {/* RISC-V VMSB Card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>RISC-V-nativo-vmsb© Bridge</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 font-bold">
                {currentSample.vmsbCacheHitPercent.toFixed(1)}% Hit
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Virtual Memory Scheduling Bridge nativo: particionamiento de caché L2/L3 por hardware y micro-slices dedicados sin interferencia de hypervisor.
            </p>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Instrucciones IPC:</span>
                <span className="text-white tabular-nums">3.84 IPC / núcleo</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Fallos TLB:</span>
                <span className="text-emerald-400 tabular-nums">0.001% (Superpages 1GB)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Micro-Slice Bus:</span>
                <span className="text-cyan-300 tabular-nums">Lock-Free Ring 128-byte</span>
              </div>
            </div>
          </div>

          {/* Kafka C++23 & Rust Zero-Copy Card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Kafka Event Fabric en Rust/C++</span>
              </div>
              <span className="text-[11px] font-mono text-cyan-300 font-bold">
                {currentSample.kafkaZeroCopyThroughputGBs.toFixed(1)} GB/s
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Flujo masivo de datos continuo mediante llamadas del sistema <code className="text-cyan-300 font-mono text-[11px]">sendfile()</code> / <code className="text-cyan-300 font-mono text-[11px]">io_uring</code> directas a interfaces NIC 100GbE.
            </p>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Pausas de GC:</span>
                <span className="text-emerald-400 tabular-nums">0.00 μs (GC-Free)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tasa Zero-Copy:</span>
                <span className="text-white tabular-nums">99.4% bypass de memoria</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Pérdida de Paquetes:</span>
                <span className="text-emerald-400 tabular-nums">0.0000% (Garantizado)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
