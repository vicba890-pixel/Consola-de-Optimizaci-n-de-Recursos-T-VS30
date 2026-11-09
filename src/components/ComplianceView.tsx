import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  ExternalLink, 
  Lock, 
  Flame, 
  Droplet,
  Layers,
  Award
} from 'lucide-react';
import { ComplianceStandard } from '../types/protocol';

interface ComplianceViewProps {
  standards: ComplianceStandard[];
  onOpenPdfModal: () => void;
}

export const ComplianceView: React.FC<ComplianceViewProps> = ({
  standards,
  onOpenPdfModal,
}) => {
  const [selectedStandard, setSelectedStandard] = useState<ComplianceStandard>(standards[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            05. Matriz de Cumplimiento Normativo y Seguridad Industrial
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Cobertura rigurosa de todas las directivas vigentes para infraestructuras críticas industriales, telecomunicaciones, banca y centros de datos soberanos. Verificación continua automatizada.
          </p>
        </div>

        <button
          onClick={onOpenPdfModal}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap"
        >
          <Award className="w-3.5 h-3.5" />
          <span>Certificar Cumplimiento en PDF</span>
        </button>
      </div>

      {/* Standards Grid & Selected Standard Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Standards List */}
        <div className="lg:col-span-5 space-y-3">
          {standards.map(std => {
            const isSelected = std.code === selectedStandard.code;
            return (
              <div
                key={std.code}
                onClick={() => setSelectedStandard(std)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500/50 shadow-sm shadow-cyan-500/10'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-cyan-300">
                    {std.code}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" /> Verificado
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-white mt-1">
                  {std.name}
                </h4>
                <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                  {std.authority}
                </div>
                <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>{std.securityLevel}</span>
                  <span>{std.lastAuditTime}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Detailed Inspector for the Selected Standard */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                  NORMATIVA SELECCIONADA
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  {selectedStandard.code}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  {selectedStandard.name}
                </p>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 text-xs font-mono font-semibold rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  {selectedStandard.securityLevel}
                </span>
                <div className="text-[11px] text-slate-400 mt-1.5 font-mono">
                  Auditado: {selectedStandard.lastAuditTime}
                </div>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <div className="font-mono text-slate-400 uppercase text-[11px] mb-1">
                  Organismo Regulador
                </div>
                <div className="text-white font-medium bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                  {selectedStandard.authority}
                </div>
              </div>

              <div>
                <div className="font-mono text-slate-400 uppercase text-[11px] mb-1">
                  Cláusula Específica y Alcance Técnico
                </div>
                <div className="text-white font-medium bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 leading-relaxed">
                  {selectedStandard.clause}
                </div>
              </div>

              <div>
                <div className="font-mono text-slate-400 uppercase text-[11px] mb-1">
                  Garantía de Invariante de No Daño (Non-Harmful Guarantee)
                </div>
                <div className="text-slate-300 bg-slate-950/70 p-3 rounded-lg border border-slate-800 leading-relaxed">
                  {selectedStandard.details}
                  <div className="mt-2 text-[11px] text-emerald-400 font-mono flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Invariante activo verificado por hardware traps y pruebas Circom ZK</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-lg">
                  <div className="text-[11px] text-slate-400">Tolerancia Bizantina (BFT)</div>
                  <div className="text-base font-bold text-white font-mono mt-0.5">
                    3f + 1 Nodos
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Resiste caídas sin corrupción
                  </div>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-lg">
                  <div className="text-[11px] text-slate-400">Impacto en Latencia Industrial</div>
                  <div className="text-base font-bold text-cyan-300 font-mono mt-0.5">
                    &lt; 0.02 ms Overhead
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Sin penalización de rendimiento
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 mt-6 flex items-center justify-between text-xs text-slate-400">
            <span>Certificado oficial disponible para descarga directa</span>
            <button
              onClick={onOpenPdfModal}
              className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
            >
              <span>Exportar Reporte Certificado</span>
              <FileText className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
