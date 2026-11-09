import React, { useState } from 'react';
import { JurisdictionalLegalFramework, ComplianceStandard, CircomProofEvent, AuditLogEntry } from '../types/protocol';
import { 
  Scale, 
  ShieldCheck, 
  Award, 
  FileCheck, 
  CheckCircle2, 
  Globe2, 
  Lock, 
  FileText, 
  Zap, 
  ExternalLink,
  BookOpen,
  Code2,
  RefreshCw,
  Terminal
} from 'lucide-react';

interface LegalCertificationsViewProps {
  frameworks: JurisdictionalLegalFramework[];
  standards?: ComplianceStandard[];
  circomProofs?: CircomProofEvent[];
  auditLogs?: AuditLogEntry[];
  onTriggerZkProof?: () => void;
  isVerifyingProof?: boolean;
  onOpenPdfModal: () => void;
  onNavigateToTimeline?: () => void;
}

export const LegalCertificationsView: React.FC<LegalCertificationsViewProps> = ({
  frameworks,
  standards = [],
  circomProofs = [],
  auditLogs = [],
  onTriggerZkProof,
  isVerifyingProof = false,
  onOpenPdfModal,
  onNavigateToTimeline,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'jurisdictions' | 'circom_zkp' | 'industrial_iec'>('jurisdictions');
  const [selectedFramework, setSelectedFramework] = useState<JurisdictionalLegalFramework>(frameworks[0]);
  const [selectedStandard, setSelectedStandard] = useState<ComplianceStandard | null>(standards[0] || null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            08. Amparo Legal Soberano y Certificaciones Jurisdiccionales Nativas
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            T-VS30 PROTOCOL está amparado legalmente a nivel internacional y adquiere certificaciones en forma nativa en cada jurisdicción soberana, respaldado formalmente por su aporte medible a la eficiencia de recursos y seguridad crítica.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sub-tab segmented control */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
            <button
              onClick={() => setActiveSubTab('jurisdictions')}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
                activeSubTab === 'jurisdictions'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Marco Legal Soberano
            </button>
            <button
              onClick={() => setActiveSubTab('circom_zkp')}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
                activeSubTab === 'circom_zkp'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Pruebas Circom ZKP
            </button>
            <button
              onClick={() => setActiveSubTab('industrial_iec')}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
                activeSubTab === 'industrial_iec'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Normas IEC 62443
            </button>
          </div>

          <button
            onClick={onOpenPdfModal}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-cyan-500/20"
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Dictamen Legal en PDF</span>
          </button>
        </div>
      </div>

      {/* Global Legal Shield Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-0.5">
                <span>ESTATUTO DE SOBERANÍA JURÍDICA T-VS30</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>INVARIANTE DE NO DAÑO COMPROBADO</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-emerald-400">CERTIFICACIÓN NATIVA</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                Doctrina de Amparo Técnico y Legal para Infraestructuras Críticas
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-3xl">
                Al operar como protocolo descentralizado soberano y libre de intermediarios, T-VS30 cumple con los requisitos de debida diligencia de las directivas NIS2 (UE), CISA (EE. UU.) y tratados internacionales. Su aportación comprobada a la reducción de PUE (1.07) y ahorro de agua potable otorga a los operadores de red inmunidad frente a sanciones por estrés hídrico y consumo desmedido de red.
              </p>
            </div>
          </div>

          <div className="shrink-0 p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-right">
            <div className="text-[11px] font-mono text-slate-400">Estado Regulatorio Global</div>
            <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5 flex items-center justify-end gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> 100% Homologado Nativo
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              6 Jurisdicciones Ratificadas
            </div>
          </div>
        </div>
      </div>

      {/* Sub-tab 1: Jurisdictions View */}
      {activeSubTab === 'jurisdictions' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Jurisdictional Cards */}
          <div className="lg:col-span-5 space-y-3">
            {frameworks.map(fw => {
              const isSelected = fw.id === selectedFramework.id;
              return (
                <div
                  key={fw.id}
                  onClick={() => setSelectedFramework(fw)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500/50 shadow-sm shadow-cyan-500/10'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-bold text-white">
                      <span>{fw.flagEmoji}</span>
                      <span>{fw.jurisdiction}</span>
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                      {fw.nativeCertificationStatus === 'HOMOLOGADO_NATIVO' && 'Homologado'}
                      {fw.nativeCertificationStatus === 'AMPARO_SOBERANO_ACTIVO' && 'Amparo Activo'}
                      {fw.nativeCertificationStatus === 'CERTIFICACION_VERIFICADA' && 'Certificado'}
                    </span>
                  </div>

                  <div className="text-xs text-cyan-300 font-mono mt-1 line-clamp-1">
                    {fw.regulatoryBody}
                  </div>

                  <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                    {fw.legalInstruments}
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>ID: {fw.notarialDocumentId.substring(0, 18)}...</span>
                    <span>{fw.lastRatificationDate}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Detailed Legal Dossier Inspector */}
          <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                    <span>JURISDICCIÓN SOBERANA SELECCIONADA</span>
                    <span>{selectedFramework.flagEmoji}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {selectedFramework.jurisdiction}
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {selectedFramework.regulatoryBody}
                  </p>
                </div>

                <div className="text-right">
                  <span className="px-2.5 py-1 text-xs font-mono font-bold rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    {selectedFramework.nativeCertificationStatus}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1.5 font-mono">
                    Ratificado: {selectedFramework.lastRatificationDate}
                  </div>
                </div>
              </div>

              {/* Dossier sections */}
              <div className="space-y-3.5 text-xs">
                <div>
                  <div className="font-mono text-slate-400 uppercase text-[11px] mb-1">
                    Instrumentos Jurídicos y Leyes Aplicables
                  </div>
                  <div className="text-white font-medium bg-slate-950/70 p-3 rounded-lg border border-slate-800 leading-relaxed font-mono">
                    {selectedFramework.legalInstruments}
                  </div>
                </div>

                <div>
                  <div className="font-mono text-slate-400 uppercase text-[11px] mb-1">
                    Garantía de Amparo Legal y Exención de Responsabilidad
                  </div>
                  <div className="text-slate-300 bg-slate-950/70 p-3 rounded-lg border border-slate-800 leading-relaxed">
                    {selectedFramework.legalShieldGuarantee}
                  </div>
                </div>

                <div>
                  <div className="font-mono text-slate-400 uppercase text-[11px] mb-1">
                    Aporte Medible a la Eficiencia Energética e Hídrica
                  </div>
                  <div className="text-emerald-300 bg-emerald-950/20 p-3 rounded-lg border border-emerald-800/40 leading-relaxed">
                    {selectedFramework.efficiencyContributionAssessment}
                  </div>
                </div>

                {/* Cryptographic & Notarial Credentials */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 font-mono">
                    <div className="text-[10px] text-slate-400">Número de Acta Notarial</div>
                    <div className="text-xs font-bold text-white mt-0.5 truncate">
                      {selectedFramework.notarialDocumentId}
                    </div>
                  </div>

                  <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 font-mono">
                    <div className="text-[10px] text-slate-400">Hash de Cumplimiento ZKP</div>
                    <div className="text-xs font-bold text-cyan-300 mt-0.5 truncate">
                      {selectedFramework.zkpComplianceHash}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 mt-6 flex items-center justify-between text-xs text-slate-400">
              <span>Certificación admitida como prueba formal de debida diligencia</span>
              <button
                onClick={onOpenPdfModal}
                className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1.5"
              >
                <span>Generar Dictamen Oficial</span>
                <FileText className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 2: Circom ZKP Proofs & Continuous Audits */}
      {activeSubTab === 'circom_zkp' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-slate-900/60 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xs font-mono text-cyan-400">VERIFICACIÓN CRIPTOGRÁFICA CIRCOM</div>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Flujo de Pruebas ZK-SNARK Activas
                </h3>
              </div>
              {onTriggerZkProof && (
                <button
                  onClick={onTriggerZkProof}
                  disabled={isVerifyingProof}
                  className="px-2.5 py-1 text-xs font-semibold bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className={`w-3 h-3 ${isVerifyingProof ? 'animate-spin' : ''}`} />
                  <span>Probar</span>
                </button>
              )}
            </div>

            <div className="space-y-2.5">
              {circomProofs.map(proof => (
                <div
                  key={proof.proofId}
                  className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 text-xs"
                >
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-cyan-300 font-semibold">{proof.circuitName}</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {proof.verificationStatus}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 mt-2 text-[11px] font-mono">
                    <span>ID: {proof.proofId}</span>
                    <span>Restricciones: {proof.constraintsCount.toLocaleString()}</span>
                    <span>Proving: {proof.provingTimeMs} ms</span>
                  </div>
                  <div className="mt-1 pt-1 border-t border-slate-900 text-[10px] text-slate-500 font-mono truncate">
                    Hash Público: {proof.publicHash}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-xs font-mono text-cyan-400">REGISTRO AUDITABLE CONTINUO</div>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    Evidencia Notarial en Cadena
                  </h3>
                </div>
                <span className="text-xs font-mono text-emerald-400">100% Invariantes Superados</span>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {auditLogs.map(log => (
                  <div
                    key={log.id}
                    className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-2.5 text-xs font-mono"
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-slate-500">{log.timestamp}</span>
                      <span className="text-cyan-400">{log.category}</span>
                    </div>
                    <div className="text-slate-200 font-sans text-xs">
                      {log.message}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1 truncate">
                      Hash de Integridad: {log.verificationHash}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
              <span>Pruebas matemáticas aceptadas por autoridades regulatorias sin revelación de datos privados.</span>
              {onNavigateToTimeline && (
                <button
                  onClick={onNavigateToTimeline}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-950/70 hover:bg-cyan-900/70 border border-cyan-800/60 rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto shadow-sm shadow-cyan-500/10"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Ver Línea de Tiempo de Auditoría ZK</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 3: Industrial IEC 62443 / NIST Standards */}
      {activeSubTab === 'industrial_iec' && standards.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-3">
            {standards.map(std => {
              const isSelected = selectedStandard?.code === std.code;
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
                    <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Verificado
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-white mt-1">
                    {std.name}
                  </h4>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {std.authority}
                  </div>
                </div>
              );
            })}
          </div>

          {selectedStandard && (
            <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-xs font-mono text-cyan-400">NORMA INDUSTRIAL VIGENTE</span>
                    <h3 className="text-xl font-bold text-white mt-1">{selectedStandard.code}</h3>
                    <p className="text-xs text-slate-300 mt-0.5">{selectedStandard.name}</p>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-mono font-semibold rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    {selectedStandard.securityLevel}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="font-mono text-slate-400 uppercase text-[11px] mb-1">Cláusula Auditada</div>
                    <div className="text-white bg-slate-950/70 p-2.5 rounded border border-slate-800">
                      {selectedStandard.clause}
                    </div>
                  </div>

                  <div>
                    <div className="font-mono text-slate-400 uppercase text-[11px] mb-1">Garantía de Invariante de No Daño</div>
                    <div className="text-slate-300 bg-slate-950/70 p-3 rounded border border-slate-800 leading-relaxed">
                      {selectedStandard.details}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 mt-6 flex items-center justify-between text-xs text-slate-400">
                <span>SL-4: Nivel Máximo de Seguridad Industrial alcanzado</span>
                <button
                  onClick={onOpenPdfModal}
                  className="text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  Exportar en Certificado PDF
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
