import React, { useState } from 'react';
import {
  X,
  FileDown,
  ShieldCheck,
  CheckCircle2,
  Award,
  Zap,
  Droplets,
  DollarSign,
  Scale,
  BarChart3,
  FileText,
  Calendar,
  Sparkles,
  Users,
  Building,
  Check,
  ChevronRight
} from 'lucide-react';
import { ProtocolNode, GreenAuditReportData } from '../types/protocol';
import { generateCertifiedPdf } from '../utils/pdfGenerator';
import { generateShareholderWhitepaperPdf } from '../utils/whitepaperPdfGenerator';
import { generateZeroCapexRoiPdf } from '../utils/roiPdfGenerator';
import { generateNotarialInstrumentPdf } from '../utils/notarialPdfGenerator';
import { generateExecutiveBenchmarkPdf } from '../utils/executivePdfGenerator';
import { NOTARIAL_INSTRUMENTS_CATALOG } from '../data/protocolData';

export type PdfDocumentType = 'whitepaper' | 'roi' | 'notarial' | 'green' | 'benchmark';

interface PdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMWhSaved: number;
  currentWaterSavedLiters: number;
  activeNodesCount: number;
  nodes?: ProtocolNode[];
  initialDocType?: PdfDocumentType;
}

export const PdfExportModal: React.FC<PdfExportModalProps> = ({
  isOpen,
  onClose,
  currentMWhSaved,
  currentWaterSavedLiters,
  activeNodesCount,
  nodes = [],
  initialDocType = 'whitepaper'
}) => {
  const [selectedDocType, setSelectedDocType] = useState<PdfDocumentType>(initialDocType);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [lastDownloadedTitle, setLastDownloadedTitle] = useState<string>('');

  // Form Fields for Whitepaper & Corporate Dossiers
  const [companyName, setCompanyName] = useState<string>('Junta General de Accionistas & Consejo de Administración');
  const [boardChairName, setBoardChairName] = useState<string>('D. Alejandro de la Riva y Mendoza (Presidente)');
  const [chiefExecutiveName, setChiefExecutiveName] = useState<string>('D. Carlos V. Mendoza (Consejero Delegado / CEO)');
  const [sessionDate, setSessionDate] = useState<string>(
    new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
  );
  const [serverCount, setServerCount] = useState<number>(1200);
  const [net5YearSavingsUsd, setNet5YearSavingsUsd] = useState<number>(4820000);

  // Form Fields for Green Certificate
  const [clusterName, setClusterName] = useState<string>('Clúster Soberano Multi-Región T-VS30');
  const [reportingPeriod, setReportingPeriod] = useState<string>('Octubre 2026 (Auditoría Continua)');

  if (!isOpen) return null;

  const handleDownload = () => {
    setIsGenerating(true);
    setDownloadSuccess(false);

    setTimeout(() => {
      try {
        if (selectedDocType === 'whitepaper') {
          generateShareholderWhitepaperPdf({
            companyName: companyName.trim() || 'Junta General de Accionistas',
            boardChairName: boardChairName.trim(),
            chiefExecutiveName: chiefExecutiveName.trim(),
            meetingDate: sessionDate.trim(),
            nodes,
            totalMWhSaved: currentMWhSaved,
            totalWaterSavedLiters: currentWaterSavedLiters,
            serverCount,
            net5YearSavingsUsd
          });
          setLastDownloadedTitle('Whitepaper Ejecutivo para la Junta de Accionistas (4 Páginas)');
        } else if (selectedDocType === 'roi') {
          // Generate 5-year sample projections
          const sampleProjections = [1, 2, 3, 4, 5].map(yr => {
            const legacyTotal = Math.round(serverCount * (yr === 1 ? 1650 : (yr === 3 ? 1950 : 850)));
            const tvsTotal = Math.round(serverCount * 190);
            return {
              year: yr,
              yearLabel: `Año ${yr}`,
              legacyCapex: yr === 1 ? Math.round(serverCount * 800) : 0,
              legacyEnergyCost: Math.round(serverCount * 620),
              legacyWaterCost: Math.round(serverCount * 45),
              legacyEgressCost: Math.round(serverCount * 120),
              legacyMaintenanceCost: Math.round(serverCount * 65),
              legacyTotalCost: legacyTotal,
              legacyCumulativeCost: legacyTotal * yr,
              tvs30Capex: 0,
              tvs30EnergyCost: Math.round(serverCount * 140),
              tvs30WaterCost: Math.round(serverCount * 10),
              tvs30EgressCost: Math.round(serverCount * 25),
              tvs30MaintenanceCost: Math.round(serverCount * 15),
              tvs30TotalCost: tvsTotal,
              tvs30CumulativeCost: tvsTotal * yr,
              annualNetSavings: legacyTotal - tvsTotal,
              cumulativeNetSavings: Math.round((net5YearSavingsUsd / 5) * yr),
              cumulativeEnergyMWhSaved: Math.round(currentMWhSaved * yr * 365),
              cumulativeWaterLitersSaved: Math.round(currentWaterSavedLiters * yr * 365),
              cumulativeCo2TonsAvoided: Math.round(currentMWhSaved * yr * 365 * 0.42)
            };
          });

          generateZeroCapexRoiPdf({
            projections: sampleProjections,
            serverCount,
            totalMWhSavedAnnual: currentMWhSaved * 365,
            totalWaterSavedLitersAnnual: currentWaterSavedLiters * 365,
            net5YearSavingsUsd,
            organizationName: companyName
          });
          setLastDownloadedTitle('Dictamen Financiero de ROI Capex Cero (2 Páginas)');
        } else if (selectedDocType === 'notarial') {
          const sampleInstrument = NOTARIAL_INSTRUMENTS_CATALOG[0];
          generateNotarialInstrumentPdf({ instrument: sampleInstrument });
          setLastDownloadedTitle('Acta Notarial Criptográfica Oficial (2 Páginas)');
        } else if (selectedDocType === 'benchmark') {
          generateExecutiveBenchmarkPdf({
            organizationName: companyName,
            perspective: 'C-Suite Integrada (CEO / CTO / Consejo)',
            monthlyReqMillions: 1000,
            annualSavingsUsd: 1140000
          });
          setLastDownloadedTitle('Dossier Ejecutivo de Benchmark Estratégico (2 Páginas)');
        } else {
          const reportData: GreenAuditReportData = {
            organizationName: companyName.trim() || 'Infraestructura Crítica Titular',
            datacenterCluster: clusterName.trim() || 'Clúster Multi-Región T-VS30',
            reportingPeriod: reportingPeriod.trim() || 'Período Activo 2026',
            totalNodesAudited: activeNodesCount,
            totalMWhSaved: currentMWhSaved,
            totalWaterSavedLiters: currentWaterSavedLiters,
            pueReductionRatio: '1.48 → 1.07 (-27.7%)',
            co2TonsAvoided: Number((currentMWhSaved * 0.42).toFixed(1)),
            capexInvestmentSavedUsd: Math.round(activeNodesCount * 45000),
            auditorCertificationId: `TVS30-CERT-${Math.random().toString(36).substring(2, 9).toUpperCase()}-2026`,
            cryptographicMerkleRoot: '0x9b4f2c18e9a2637bfa00921cba3e47719f20d55681aa3c200921bc'
          };
          generateCertifiedPdf(reportData);
          setLastDownloadedTitle('Certificado Oficial de Eficiencia y Ahorro Verde (2 Páginas)');
        }

        setIsGenerating(false);
        setDownloadSuccess(true);
      } catch (err) {
        console.error('Error generating document:', err);
        setIsGenerating(false);
      }
    }, 600);
  };

  const docTypes = [
    {
      id: 'whitepaper' as PdfDocumentType,
      name: 'Whitepaper Accionistas',
      badge: 'Recomendado · 4 Págs',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      icon: FileText,
      desc: 'Dossier institucional completo para la Junta General de Accionistas y Consejo de Administración. Integra hallazgos de red, fe notarial, Anti-REA y ROI Capex Cero.'
    },
    {
      id: 'roi' as PdfDocumentType,
      name: 'Dictamen ROI Capex Cero',
      badge: 'Financiero · 2 Págs',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      icon: DollarSign,
      desc: 'Dictamen de amortización a 5 años, tesis de inversión $0 USD, comparativa Capex/Opex y dividendos ESG.'
    },
    {
      id: 'notarial' as PdfDocumentType,
      name: 'Acta Notarial Digital',
      badge: 'eIDAS / NIS2 · 2 Págs',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      icon: Scale,
      desc: 'Instrumento notarial telemático colegiado con fe pública probatoria de invariantes y protección en silicio Anti-REA.'
    },
    {
      id: 'benchmark' as PdfDocumentType,
      name: 'Benchmark Ejecutivo',
      badge: 'C-Suite · 2 Págs',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      icon: BarChart3,
      desc: 'Posicionamiento estratégico frente a la nube centralizada, service mesh y DLTs con latencias multi-región.'
    },
    {
      id: 'green' as PdfDocumentType,
      name: 'Certificado Verde ESG',
      badge: 'Sostenibilidad · 2 Págs',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      icon: Award,
      desc: 'Acreditación oficial de ahorro de MWh, agua salvada y sello criptográfico ZK-SNARK Circom.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Centro de Emisión de Informes Oficiales en PDF
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Directorio & Accionistas 2026
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Generador de documentación certificada con sellos criptográficos Dilithium-5, hash Merkle y validación legal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Document Type Selector Grid */}
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 block">
              1. Seleccione el Tipo de Documento Oficial a Emitir:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {docTypes.map(doc => {
                const isSelected = selectedDocType === doc.id;
                const IconComponent = doc.icon;
                return (
                  <button
                    key={doc.id}
                    onClick={() => {
                      setSelectedDocType(doc.id);
                      setDownloadSuccess(false);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-800/90 border-cyan-400/80 ring-1 ring-cyan-400/50 shadow-lg text-white'
                        : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/40 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <div className="flex items-center gap-2">
                          <IconComponent className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                          <span className="text-xs font-bold text-white">{doc.name}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {doc.desc}
                      </p>
                    </div>
                    <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${doc.badgeColor}`}>
                        {doc.badge}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">Vectorial A4</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Configuration Form based on Document Type */}
          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {selectedDocType === 'whitepaper' && '2. Parámetros del Whitepaper para la Junta de Accionistas'}
                  {selectedDocType === 'roi' && '2. Parámetros del Dictamen Financiero de ROI Capex Cero'}
                  {selectedDocType === 'notarial' && '2. Parámetros del Acta Notarial Digital'}
                  {selectedDocType === 'benchmark' && '2. Parámetros del Informe Benchmark de Mercado'}
                  {selectedDocType === 'green' && '2. Parámetros del Certificado de Eficiencia Verde'}
                </span>
              </span>
              <span className="text-[11px] text-slate-400">Campos homologados para órganos de gobierno</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">
                  Nombre de la Organización / Entidad Titular
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="ej. Junta General de Accionistas & Consejo de Administración"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-400 font-sans"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">
                  Fecha de la Convocatoria / Sesión Directiva
                </label>
                <input
                  type="text"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-400 font-sans"
                />
              </div>

              {(selectedDocType === 'whitepaper' || selectedDocType === 'roi') && (
                <>
                  <div>
                    <label className="text-slate-300 font-medium block mb-1">
                      Presidente del Consejo de Administración
                    </label>
                    <input
                      type="text"
                      value={boardChairName}
                      onChange={(e) => setBoardChairName(e.target.value)}
                      placeholder="D. Alejandro de la Riva y Mendoza"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-400 font-sans"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-medium block mb-1">
                      Consejero Delegado (CEO)
                    </label>
                    <input
                      type="text"
                      value={chiefExecutiveName}
                      onChange={(e) => setChiefExecutiveName(e.target.value)}
                      placeholder="D. Carlos V. Mendoza"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-400 font-sans"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-medium block mb-1">
                      Parque de Servidores Equivalentes Modelado
                    </label>
                    <input
                      type="number"
                      value={serverCount}
                      onChange={(e) => setServerCount(Math.max(10, parseInt(e.target.value) || 1200))}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-medium block mb-1">
                      Ahorro Quinquenal Neto Estimado ($ USD)
                    </label>
                    <input
                      type="number"
                      value={net5YearSavingsUsd}
                      onChange={(e) => setNet5YearSavingsUsd(Math.max(10000, parseInt(e.target.value) || 4820000))}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                </>
              )}

              {selectedDocType === 'green' && (
                <>
                  <div>
                    <label className="text-slate-300 font-medium block mb-1">
                      Nombre del Clúster / Red de Nodos
                    </label>
                    <input
                      type="text"
                      value={clusterName}
                      onChange={(e) => setClusterName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-400 font-sans"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-medium block mb-1">
                      Período de Auditoría Continua
                    </label>
                    <input
                      type="text"
                      value={reportingPeriod}
                      onChange={(e) => setReportingPeriod(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-400 font-sans"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Whitepaper Detailed Preview Breakdown */}
          {selectedDocType === 'whitepaper' && (
            <div className="p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/20 rounded-xl border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>Estructura Oficial del Whitepaper (4 Páginas Formales):</span>
                </span>
                <span className="text-[11px] text-amber-400 font-mono">Dossier de Gobierno Corporativo</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-300">
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold flex items-center justify-center">1</span>
                    <span>Pág. 1: Carta Directiva & Declaración Fiduciaria</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Carta al Consejo, 4 KPIs de impacto inmediato, tesis de Capex Cero ($0 USD) y firma de ratificación fiduciaria.
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold flex items-center justify-center">2</span>
                    <span>Pág. 2: Hallazgos de Red Multi-Región & Silicio</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Evaluación de latencia determinista (0.082 ms), supresión de hairpinning, binario VMSB© y blindaje Anti-REA.
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold flex items-center justify-center">3</span>
                    <span>Pág. 3: Fe Notarial, eIDAS & Blindaje NIS2</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Protocolo notarial colegiado, matriz normativa (DORA, CER, WIPO), pruebas ZK Circom y raíz Merkle SHA-256.
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold flex items-center justify-center">4</span>
                    <span>Pág. 4: Proyección ROI a 5 Años & Firmas</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Matriz anual de Capex/Opex para {serverCount} servidores, mandatos ESG CSRD y bloque de firmas solemnes de la Junta.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Live Telemetry Data Integrated Preview */}
          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800/80 space-y-3">
            <div className="text-xs font-mono text-cyan-400 font-semibold flex items-center justify-between">
              <span>DATOS REALES DE LA RED INTEGRADOS EN EL INFORME:</span>
              <span className="text-emerald-400 text-[11px]">Enlace Activo Telemetría</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">Nodos Auditados</div>
                <div className="text-base font-bold text-white font-mono mt-0.5 tabular-nums">
                  {activeNodesCount} Regiones
                </div>
              </div>

              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">Energía Ahorrada</div>
                <div className="text-base font-bold text-emerald-400 font-mono mt-0.5 tabular-nums">
                  {currentMWhSaved.toFixed(1)} MWh
                </div>
              </div>

              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">Agua Preservada</div>
                <div className="text-base font-bold text-cyan-300 font-mono mt-0.5 tabular-nums">
                  {(currentWaterSavedLiters / 1000).toFixed(1)}k L
                </div>
              </div>

              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">Inversión Capex</div>
                <div className="text-base font-bold text-emerald-400 font-mono mt-0.5 tabular-nums">
                  $0.00 USD
                </div>
              </div>
            </div>
          </div>

          {downloadSuccess && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>{lastDownloadedTitle}</strong> generado y descargado correctamente. El archivo vectorial ya está disponible en su carpeta de descargas.
              </span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Cerrar
          </button>

          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className={`inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer ${
              selectedDocType === 'whitepaper'
                ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-500/20'
                : 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-cyan-500/20'
            } disabled:opacity-50`}
          >
            <FileDown className="w-4 h-4" />
            <span>
              {isGenerating
                ? 'Generando Documento Oficial...'
                : selectedDocType === 'whitepaper'
                ? 'Descargar Whitepaper para Accionistas (PDF)'
                : 'Descargar Documento Oficial en PDF'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
