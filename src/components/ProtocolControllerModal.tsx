import React, { useState } from 'react';
import { X, Cpu, Sliders, ShieldCheck, Flame, RefreshCw, Zap, Layers, AlertCircle } from 'lucide-react';

interface ProtocolControllerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerRebalance: () => void;
  onInjectSpikeLoad: () => void;
  onResetTopology: () => void;
}

export const ProtocolControllerModal: React.FC<ProtocolControllerModalProps> = ({
  isOpen,
  onClose,
  onTriggerRebalance,
  onInjectSpikeLoad,
  onResetTopology,
}) => {
  const [vmsbMode, setVmsbMode] = useState<'aggressive' | 'balanced' | 'free_cooling'>('aggressive');
  const [cmstToleranceMicros, setCmstToleranceMicros] = useState(12);
  const [kafkaBufferMB, setKafkaBufferMB] = useState(256);
  const [rekeyIntervalSec, setRekeyIntervalSec] = useState(30);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Controlador del Motor T-VS30 y Núcleo VMSB©
              </h3>
              <p className="text-xs text-slate-400">
                Parámetros de kernel de bajo nivel, micro-slices RISC-V y tolerancia bizantina
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {toastMessage && (
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-xs text-cyan-300 font-mono">
              {toastMessage}
            </div>
          )}

          {/* VMSB Scheduling Mode */}
          <div className="space-y-2">
            <label className="text-xs text-slate-300 font-semibold block">
              Modo de Planificación RISC-V-nativo-vmsb©:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  setVmsbMode('aggressive');
                  showToast('Modo VMSB configurado a: Micro-Slice Ultra-Latency (0.12ms)');
                }}
                className={`p-3 rounded-lg border text-left text-xs transition-colors ${
                  vmsbMode === 'aggressive'
                    ? 'bg-cyan-500/10 border-cyan-500 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-bold text-cyan-300">Micro-Slice Máximo</div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Latencia mínima &lt; 0.20ms, partición total de L3
                </div>
              </button>

              <button
                onClick={() => {
                  setVmsbMode('balanced');
                  showToast('Modo VMSB configurado a: Balanceado Multi-Región');
                }}
                className={`p-3 rounded-lg border text-left text-xs transition-colors ${
                  vmsbMode === 'balanced'
                    ? 'bg-cyan-500/10 border-cyan-500 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-bold text-white">Balanceado</div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Equilibrio de latencia y throughput sostenido
                </div>
              </button>

              <button
                onClick={() => {
                  setVmsbMode('free_cooling');
                  showToast('Modo VMSB configurado a: Máximo Ahorro Hídrico/Térmico');
                }}
                className={`p-3 rounded-lg border text-left text-xs transition-colors ${
                  vmsbMode === 'free_cooling'
                    ? 'bg-cyan-500/10 border-cyan-500 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-bold text-emerald-300">Bioclimático Verde</div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Prioriza desvío a nodos con free-cooling ambiental
                </div>
              </button>
            </div>
          </div>

          {/* Sliders and Kernel controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
              <label className="text-slate-300 font-medium block mb-1">
                Tolerancia de Rebalanceo CMST (μs): <span className="font-mono text-cyan-300 font-bold">{cmstToleranceMicros} μs</span>
              </label>
              <input
                type="range"
                min="5"
                max="50"
                step="1"
                value={cmstToleranceMicros}
                onChange={(e) => setCmstToleranceMicros(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer mt-2"
              />
              <div className="text-[10px] text-slate-500 mt-1">
                Convergencia rápida del Árbol de Expansión Mínima
              </div>
            </div>

            <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
              <label className="text-slate-300 font-medium block mb-1">
                Buffer Zero-Copy Kafka/Rust: <span className="font-mono text-cyan-300 font-bold">{kafkaBufferMB} MB</span>
              </label>
              <input
                type="range"
                min="64"
                max="1024"
                step="64"
                value={kafkaBufferMB}
                onChange={(e) => setKafkaBufferMB(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer mt-2"
              />
              <div className="text-[10px] text-slate-500 mt-1">
                Anillo de memoria circular sin interrupciones DMA
              </div>
            </div>

            <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800 md:col-span-2">
              <label className="text-slate-300 font-medium block mb-1">
                Intervalo de Rotación de Llaves Kyber-1024: <span className="font-mono text-cyan-300 font-bold">{rekeyIntervalSec} seg</span>
              </label>
              <input
                type="range"
                min="10"
                max="120"
                step="5"
                value={rekeyIntervalSec}
                onChange={(e) => setRekeyIntervalSec(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer mt-2"
              />
              <div className="text-[10px] text-slate-500 mt-1">
                Rotación poscuántica efímera en segundo plano sin interrupción de flujo
              </div>
            </div>
          </div>

          {/* Quick Disaster Recovery and Chaos Triggers */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-300">
              Inyección de Pruebas de Resiliencia en Vivo (Chaos Engineering):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => {
                  onTriggerRebalance();
                  showToast('Rebalanceo CMST forzado ejecutado');
                }}
                className="px-3 py-2 text-xs font-medium bg-slate-950 border border-slate-700 hover:border-cyan-400 text-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                <span>Forzar Rebalanceo CMST</span>
              </button>

              <button
                onClick={() => {
                  onInjectSpikeLoad();
                  showToast('Pico de carga sintética 40M ops/s inyectado');
                }}
                className="px-3 py-2 text-xs font-medium bg-slate-950 border border-amber-600/50 hover:bg-amber-950/20 text-amber-300 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Simular Pico de Carga</span>
              </button>

              <button
                onClick={() => {
                  onResetTopology();
                  showToast('Topología restaurada a condiciones nominales');
                }}
                className="px-3 py-2 text-xs font-medium bg-slate-950 border border-slate-700 hover:border-slate-500 text-slate-300 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Restaurar Invariantes</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 font-mono">
            T-VS30 Kernel Daemon v4.12-sovereign · RISC-V 64GC
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors"
          >
            Aplicar y Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
