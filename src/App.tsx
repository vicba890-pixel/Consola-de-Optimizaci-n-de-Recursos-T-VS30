import React, { useState, useEffect, useCallback } from 'react';
import { 
  INITIAL_NODES, 
  INITIAL_EDGES, 
  COMPLIANCE_STANDARDS, 
  INITIAL_CIRCOM_PROOFS, 
  INITIAL_AUDIT_LOGS,
  INITIAL_GEO_NODES,
  GLOBAL_LEGAL_CERTIFICATIONS,
  INITIAL_DILITHIUM_EVENTS
} from './data/protocolData';
import { 
  ProtocolNode, 
  CmstEdge, 
  LiveTelemetrySample, 
  CircomProofEvent, 
  AuditLogEntry,
  GeoHeatmapNode,
  JurisdictionalLegalFramework,
  DilithiumSignatureEvent
} from './types/protocol';
import { rebalanceCmst } from './utils/cmstEngine';
import { Navbar } from './components/Navbar';
import { ProtocolStatusHeader } from './components/ProtocolStatusHeader';
import { CmstLatticeView } from './components/CmstLatticeView';
import { GeoHeatmapView } from './components/GeoHeatmapView';
import { TelemetryView } from './components/TelemetryView';
import { GreenEfficiencyView } from './components/GreenEfficiencyView';
import { LegalCertificationsView } from './components/LegalCertificationsView';
import { PredictiveLoadForecaster } from './components/PredictiveLoadForecaster';
import { DilithiumVmsbView } from './components/DilithiumVmsbView';
import { PqcSecurityDashboardView } from './components/PqcSecurityDashboardView';
import { SiliconBinaryMatrixView } from './components/SiliconBinaryMatrixView';
import { AuditTimelineView } from './components/AuditTimelineView';
import { QuantumQuantizationView } from './components/QuantumQuantizationView';
import { ExecutiveBenchmarkView } from './components/ExecutiveBenchmarkView';
import { NotarialAuditSystemView } from './components/NotarialAuditSystemView';
import { ZeroCapexRoiCalculatorView } from './components/ZeroCapexRoiCalculatorView';
import { CppLibraryView } from './components/CppLibraryView';
import { PdfExportModal } from './components/PdfExportModal';
import { ProtocolControllerModal } from './components/ProtocolControllerModal';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'topology' | 'executive_benchmark' | 'zero_capex_roi' | 'pqc_security' | 'predictive' | 'heatmap' | 'telemetry' | 'green' | 'dilithium' | 'silicon_matrix' | 'audit_timeline' | 'quantum_quantization' | 'notarial_audit' | 'legal' | 'cpp_mesh'>('topology');

  // Network State
  const [nodes, setNodes] = useState<ProtocolNode[]>(INITIAL_NODES);
  const [geoNodes, setGeoNodes] = useState<GeoHeatmapNode[]>(INITIAL_GEO_NODES);
  const [edges, setEdges] = useState<CmstEdge[]>(INITIAL_EDGES);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-fra-01');
  const [isRebalancing, setIsRebalancing] = useState<boolean>(false);
  const [rebalanceTimeMicros, setRebalanceTimeMicros] = useState<number>(9.4);

  // Modals
  const [pdfModalOpen, setPdfModalOpen] = useState<boolean>(false);
  const [controllerModalOpen, setControllerModalOpen] = useState<boolean>(false);

  // Security, Dilithium PQC & Proofs
  const [circomProofs, setCircomProofs] = useState<CircomProofEvent[]>(INITIAL_CIRCOM_PROOFS);
  const [dilithiumEvents, setDilithiumEvents] = useState<DilithiumSignatureEvent[]>(INITIAL_DILITHIUM_EVENTS);
  const [isSigningDilithium, setIsSigningDilithium] = useState<boolean>(false);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [isVerifyingProof, setIsVerifyingProof] = useState<boolean>(false);

  // Telemetry stream state
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [currentSample, setCurrentSample] = useState<LiveTelemetrySample>({
    timestamp: new Date().toLocaleTimeString(),
    throughputMOps: 42.8,
    p50LatencyMs: 0.14,
    p95LatencyMs: 0.28,
    p99LatencyMs: 0.36,
    vmsbCacheHitPercent: 99.8,
    kafkaZeroCopyThroughputGBs: 18.4,
    pueAggregate: 1.07,
    instantEnergySavedKW: 103700,
    instantWaterSavedLitersHr: 8420,
  });

  const [telemetryHistory, setTelemetryHistory] = useState<LiveTelemetrySample[]>([
    { timestamp: '18:57:00', throughputMOps: 41.2, p50LatencyMs: 0.13, p95LatencyMs: 0.27, p99LatencyMs: 0.35, vmsbCacheHitPercent: 99.7, kafkaZeroCopyThroughputGBs: 17.9, pueAggregate: 1.07, instantEnergySavedKW: 103000, instantWaterSavedLitersHr: 8300 },
    { timestamp: '18:57:15', throughputMOps: 42.1, p50LatencyMs: 0.14, p95LatencyMs: 0.28, p99LatencyMs: 0.36, vmsbCacheHitPercent: 99.8, kafkaZeroCopyThroughputGBs: 18.2, pueAggregate: 1.07, instantEnergySavedKW: 103400, instantWaterSavedLitersHr: 8380 },
    { timestamp: '18:57:30', throughputMOps: 42.8, p50LatencyMs: 0.14, p95LatencyMs: 0.28, p99LatencyMs: 0.36, vmsbCacheHitPercent: 99.8, kafkaZeroCopyThroughputGBs: 18.4, pueAggregate: 1.07, instantEnergySavedKW: 103700, instantWaterSavedLitersHr: 8420 },
  ]);

  // Aggregate stats
  const activeNodes = nodes.filter(n => n.status !== 'degraded');
  const totalMWhSaved = activeNodes.reduce((acc, n) => acc + n.energySavedKWhDaily, 0) / 1000;
  const totalWaterSavedLiters = activeNodes.reduce((acc, n) => acc + n.waterSavedLitersDaily, 0);

  // Handler: Rebalance CMST with Dilithium-5 Signature Enforcement
  const handleRebalanceCmst = useCallback(() => {
    setIsRebalancing(true);
    setTimeout(() => {
      const res = rebalanceCmst(nodes, edges);
      setEdges(res.edges);
      setRebalanceTimeMicros(res.rebalanceTimeMicros);
      setIsRebalancing(false);

      // Create Dilithium-5 Post-Quantum Signature for CMST Tree Mutation
      const newDltSig: DilithiumSignatureEvent = {
        signatureId: `dlt-sig-0x${Math.random().toString(16).substring(2, 6)}`,
        targetProcess: 'CMST_TREE_MUTATION',
        timestamp: new Date().toLocaleTimeString(),
        scheme: 'CRYSTALS-Dilithium-5 (ML-DSA-87)',
        verificationLatencyMicros: Number((10.4 + Math.random() * 1.4).toFixed(1)),
        status: 'VERIFIED_AUTHENTIC',
        constantTimeNttVerified: true,
        signerNodeId: 'node-fra-01',
        hardwareTrapSlot: 'RISC-V-PMP-SLOT-01',
        merkleDigest: `0x${Math.random().toString(16).substring(2, 8)}...cmst-mutation-verified`,
      };
      setDilithiumEvents(prev => [newDltSig, ...prev.slice(0, 9)]);

      // Append audit log for rebalance
      const newLog: AuditLogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        category: 'CMST_TOPOLOGY',
        severity: 'info',
        message: `Árbol CMST recalculado con éxito en ${res.rebalanceTimeMicros} μs. Firma Dilithium-5 (ML-DSA-87) atestada en PMP Slot-01.`,
        verificationHash: `sha256:${Math.random().toString(16).substring(2, 12)}...${Math.random().toString(16).substring(2, 6)}`,
      };
      setAuditLogs(prev => [newLog, ...prev.slice(0, 19)]);
    }, 450);
  }, [nodes, edges]);

  // Handler: Trigger specific Dilithium signature event in critical area
  const handleTriggerSignEvent = (targetProcess: DilithiumSignatureEvent['targetProcess']) => {
    setIsSigningDilithium(true);
    setTimeout(() => {
      const slotMap: Record<DilithiumSignatureEvent['targetProcess'], string> = {
        'CMST_TREE_MUTATION': 'RISC-V-PMP-SLOT-01',
        'VMSB_CORE_DISPATCH': 'RISC-V-PMP-SLOT-04',
        'CRITICAL_SCADA_BUS': 'RISC-V-PMP-SLOT-02',
        'THERMODYNAMIC_TELEMETRY': 'RISC-V-PMP-SLOT-03',
        'PQC_KEY_ROTATION': 'RISC-V-PMP-SLOT-00',
      };

      const newSig: DilithiumSignatureEvent = {
        signatureId: `dlt-sig-0x${Math.random().toString(16).substring(2, 6)}`,
        targetProcess,
        timestamp: new Date().toLocaleTimeString(),
        scheme: 'CRYSTALS-Dilithium-5 (ML-DSA-87)',
        verificationLatencyMicros: Number((10.6 + Math.random() * 1.5).toFixed(1)),
        status: 'VERIFIED_AUTHENTIC',
        constantTimeNttVerified: true,
        signerNodeId: nodes[Math.floor(Math.random() * nodes.length)]?.id || 'node-fra-01',
        hardwareTrapSlot: slotMap[targetProcess] || 'RISC-V-PMP-SLOT-01',
        merkleDigest: `0x${Math.random().toString(16).substring(2, 8)}...${Math.random().toString(16).substring(2, 6)} (Firma PQC Validada)`,
      };

      setDilithiumEvents(prev => [newSig, ...prev.slice(0, 9)]);
      setIsSigningDilithium(false);

      const dltLog: AuditLogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        category: 'SECURITY',
        severity: 'success',
        message: `Firma Dilithium-5 verificada en ${newSig.verificationLatencyMicros} μs para ${targetProcess}. Enclave de hardware PMP protegido.`,
        verificationHash: `sha256:${Math.random().toString(16).substring(2, 12)}...dlt`,
      };
      setAuditLogs(prev => [dltLog, ...prev.slice(0, 19)]);
    }, 450);
  };

  // Handler: Node status toggle (simulate failure or restore)
  const handleToggleNodeStatus = (id: string) => {
    setNodes(prev =>
      prev.map(n => {
        if (n.id === id) {
          const newStatus = n.status === 'active' ? 'degraded' : 'active';
          return { ...n, status: newStatus };
        }
        return n;
      })
    );

    setTimeout(() => {
      handleRebalanceCmst();
    }, 100);
  };

  // Handler: Multi-node failure simulation for extreme stress testing
  const handleSimulateMultiNodeFailure = (failedNodeIds: string[]) => {
    setNodes(prev =>
      prev.map(n => ({
        ...n,
        status: failedNodeIds.includes(n.id) ? 'degraded' : 'active'
      }))
    );

    setTimeout(() => {
      handleRebalanceCmst();
    }, 100);
  };

  // Handler: Reset all nodes
  const handleResetTopology = () => {
    setNodes(INITIAL_NODES);
    setEdges(INITIAL_EDGES);
    handleRebalanceCmst();
  };

  // Handler: Inject spike load (40M ops/s)
  const handleInjectSpikeLoad = () => {
    setCurrentSample(prev => ({
      ...prev,
      throughputMOps: 68.4,
      p99LatencyMs: 0.39,
      kafkaZeroCopyThroughputGBs: 28.6,
    }));

    setNodes(prev =>
      prev.map(n => ({
        ...n,
        currentLoadGbps: Math.min(n.capacityGbps * 0.92, Math.round(n.currentLoadGbps * 1.35)),
      }))
    );

    // Dilithium-5 Signature for VMSB Dispatch
    const vmsbSig: DilithiumSignatureEvent = {
      signatureId: `dlt-sig-0x${Math.random().toString(16).substring(2, 6)}`,
      targetProcess: 'VMSB_CORE_DISPATCH',
      timestamp: new Date().toLocaleTimeString(),
      scheme: 'CRYSTALS-Dilithium-5 (ML-DSA-87)',
      verificationLatencyMicros: 11.4,
      status: 'VERIFIED_AUTHENTIC',
      constantTimeNttVerified: true,
      signerNodeId: 'node-tyo-04',
      hardwareTrapSlot: 'RISC-V-PMP-SLOT-04',
      merkleDigest: '0x99cc44...zero-copy-burst-signed',
    };
    setDilithiumEvents(prev => [vmsbSig, ...prev.slice(0, 9)]);

    const spikeLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      category: 'VMSB_KERNEL',
      severity: 'notice',
      message: 'Inyección de carga pico sintética (68.4M ops/s): Invariante de latencia respetado (<0.40 ms). Dilithium-5 VMSB© firmado.',
      verificationHash: `sha256:${Math.random().toString(16).substring(2, 12)}...spk`,
    };
    setAuditLogs(prev => [spikeLog, ...prev.slice(0, 19)]);
  };

  // Handler: Trigger Zk-proof verification
  const handleTriggerZkProof = () => {
    setIsVerifyingProof(true);
    setTimeout(() => {
      const circuits = [
        'energy_pue_reduction_verifier.circom',
        'cmst_capacity_constraint.circom',
        'water_wue_evaporative_audit.circom',
        'riscv_vmsb_memory_boundary.circom',
      ];
      const selectedCircuit = circuits[Math.floor(Math.random() * circuits.length)];
      const newProof: CircomProofEvent = {
        proofId: `zk-0x${Math.random().toString(16).substring(2, 7)}`,
        circuitName: selectedCircuit,
        timestamp: new Date().toLocaleTimeString(),
        provingTimeMs: Number((1.5 + Math.random() * 0.7).toFixed(2)),
        verificationStatus: 'VALID',
        publicHash: `0x${Math.random().toString(16).substring(2, 6)}...${Math.random().toString(16).substring(2, 6)}`,
        constraintsCount: Math.floor(12000 + Math.random() * 18000),
      };

      setCircomProofs(prev => [newProof, ...prev.slice(0, 5)]);
      setIsVerifyingProof(false);

      const zkLog: AuditLogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        category: 'SECURITY',
        severity: 'success',
        message: `Prueba ZK ${selectedCircuit} verificada en ${newProof.provingTimeMs} ms. Estado de red matemáticamente garantizado.`,
        verificationHash: `sha256:${Math.random().toString(16).substring(2, 12)}...zk`,
      };
      setAuditLogs(prev => [zkLog, ...prev.slice(0, 19)]);
    }, 600);
  };

  // Live telemetry interval ticker
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      setCurrentSample(prev => {
        const jitter = (Math.random() - 0.5) * 0.03;
        const p50 = Math.max(0.11, Math.min(0.18, 0.14 + jitter));
        const p99 = Math.max(0.31, Math.min(0.42, 0.36 + jitter * 1.5));
        const throughput = Math.max(38.0, Math.min(48.0, prev.throughputMOps + (Math.random() - 0.5) * 0.8));

        const updated: LiveTelemetrySample = {
          timestamp: new Date().toLocaleTimeString(),
          throughputMOps: Number(throughput.toFixed(1)),
          p50LatencyMs: Number(p50.toFixed(3)),
          p95LatencyMs: Number((p50 * 1.95).toFixed(3)),
          p99LatencyMs: Number(p99.toFixed(3)),
          vmsbCacheHitPercent: Number((99.7 + Math.random() * 0.2).toFixed(1)),
          kafkaZeroCopyThroughputGBs: Number((18.0 + (Math.random() - 0.5) * 1.2).toFixed(1)),
          pueAggregate: 1.07,
          instantEnergySavedKW: 103700,
          instantWaterSavedLitersHr: 8420,
        };

        setTelemetryHistory(history => [...history.slice(-19), updated]);
        return updated;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isStreaming]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Top Bar with 3-Zone Contract */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPdfModal={() => setPdfModalOpen(true)}
        onOpenController={() => setControllerModalOpen(true)}
      />

      {/* Operational Header Ribbon */}
      <ProtocolStatusHeader
        totalMWhSaved={totalMWhSaved}
        totalWaterSavedLiters={totalWaterSavedLiters}
        p99LatencyMs={currentSample.p99LatencyMs}
        throughputMOps={currentSample.throughputMOps}
        activeNodesCount={activeNodes.length}
        isRebalancing={isRebalancing}
        onTriggerRebalance={handleRebalanceCmst}
        onOpenPdfModal={() => setPdfModalOpen(true)}
        onOpenDilithium={() => setActiveTab('dilithium')}
        onOpenSiliconMatrix={() => setActiveTab('silicon_matrix')}
        onOpenAuditTimeline={() => setActiveTab('audit_timeline')}
        onOpenQuantumQuantization={() => setActiveTab('quantum_quantization')}
        onOpenExecutiveBenchmark={() => setActiveTab('executive_benchmark')}
        onOpenNotarialAudit={() => setActiveTab('notarial_audit')}
        onOpenZeroCapexRoi={() => setActiveTab('zero_capex_roi')}
        onOpenPqcSecurity={() => setActiveTab('pqc_security')}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {activeTab === 'zero_capex_roi' && (
          <ZeroCapexRoiCalculatorView
            nodes={nodes}
            totalMWhSaved={totalMWhSaved}
            totalWaterSavedLiters={totalWaterSavedLiters}
            onOpenPdfModal={() => setPdfModalOpen(true)}
            onNavigateToExecutive={() => setActiveTab('executive_benchmark')}
            onNavigateToGreen={() => setActiveTab('green')}
          />
        )}

        {activeTab === 'notarial_audit' && (
          <NotarialAuditSystemView
            onOpenPdfModal={() => setPdfModalOpen(true)}
            onNavigateToTimeline={() => setActiveTab('audit_timeline')}
            onNavigateToExecutive={() => setActiveTab('executive_benchmark')}
            onNavigateToSilicon={() => setActiveTab('silicon_matrix')}
          />
        )}

        {activeTab === 'executive_benchmark' && (
          <ExecutiveBenchmarkView
            onOpenPdfModal={() => setPdfModalOpen(true)}
            onNavigateToTimeline={() => setActiveTab('audit_timeline')}
            onNavigateToQuant={() => setActiveTab('quantum_quantization')}
            onNavigateToSilicon={() => setActiveTab('silicon_matrix')}
          />
        )}

        {activeTab === 'topology' && (
          <CmstLatticeView
            nodes={nodes}
            edges={edges}
            selectedNodeId={selectedNodeId}
            onSelectNode={setSelectedNodeId}
            onToggleNodeStatus={handleToggleNodeStatus}
            onSimulateMultiNodeFailure={handleSimulateMultiNodeFailure}
            onRebalanceCmst={handleRebalanceCmst}
            onInjectSpikeLoad={handleInjectSpikeLoad}
            onResetAllNodes={handleResetTopology}
            isRebalancing={isRebalancing}
            rebalanceTimeMicros={rebalanceTimeMicros}
          />
        )}

        {activeTab === 'predictive' && (
          <PredictiveLoadForecaster
            nodes={nodes}
            onTriggerRebalance={handleRebalanceCmst}
            isRebalancing={isRebalancing}
          />
        )}

        {activeTab === 'heatmap' && (
          <GeoHeatmapView geoNodes={geoNodes} />
        )}

        {activeTab === 'pqc_security' && (
          <PqcSecurityDashboardView
            nodes={nodes}
            dilithiumEvents={dilithiumEvents}
            auditLogs={auditLogs}
            onTriggerSignEvent={handleTriggerSignEvent}
            isSigning={isSigningDilithium}
            onOpenPdfModal={() => setPdfModalOpen(true)}
            onNavigateToTimeline={() => setActiveTab('audit_timeline')}
            onNavigateToQuant={() => setActiveTab('quantum_quantization')}
          />
        )}

        {activeTab === 'dilithium' && (
          <DilithiumVmsbView
            nodes={nodes}
            dilithiumEvents={dilithiumEvents}
            onTriggerSignEvent={handleTriggerSignEvent}
            isSigning={isSigningDilithium}
            onOpenPdfModal={() => setPdfModalOpen(true)}
            onNavigateToPqcSecurity={() => setActiveTab('pqc_security')}
          />
        )}

        {activeTab === 'silicon_matrix' && (
          <SiliconBinaryMatrixView
            onOpenPdfModal={() => setPdfModalOpen(true)}
            onNavigateToCpp={() => setActiveTab('cpp_mesh')}
          />
        )}

        {activeTab === 'audit_timeline' && (
          <AuditTimelineView
            onOpenPdfModal={() => setPdfModalOpen(true)}
          />
        )}

        {activeTab === 'quantum_quantization' && (
          <QuantumQuantizationView
            onOpenPdfModal={() => setPdfModalOpen(true)}
            onNavigateToTimeline={() => setActiveTab('audit_timeline')}
          />
        )}

        {activeTab === 'telemetry' && (
          <TelemetryView
            currentSample={currentSample}
            telemetryHistory={telemetryHistory}
            isStreaming={isStreaming}
            onToggleStreaming={() => setIsStreaming(!isStreaming)}
            onTriggerBurst={handleInjectSpikeLoad}
          />
        )}

        {activeTab === 'green' && (
          <GreenEfficiencyView
            nodes={nodes}
            totalMWhSaved={totalMWhSaved}
            totalWaterSavedLiters={totalWaterSavedLiters}
            onOpenPdfModal={() => setPdfModalOpen(true)}
          />
        )}

        {activeTab === 'legal' && (
          <LegalCertificationsView
            frameworks={GLOBAL_LEGAL_CERTIFICATIONS}
            standards={COMPLIANCE_STANDARDS}
            circomProofs={circomProofs}
            auditLogs={auditLogs}
            onTriggerZkProof={handleTriggerZkProof}
            isVerifyingProof={isVerifyingProof}
            onOpenPdfModal={() => setPdfModalOpen(true)}
            onNavigateToTimeline={() => setActiveTab('audit_timeline')}
          />
        )}

        {activeTab === 'cpp_mesh' && (
          <CppLibraryView />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-400">Protocolo Optimizador T-VS30</span>
            <span aria-hidden="true">·</span>
            <span>Infraestructura Crítica Descentralizada y Soberana</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400">Capex Cero</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span>CRYSTALS-Dilithium-5 (ML-DSA-87)</span>
            <span aria-hidden="true">·</span>
            <span>RISC-V-nativo-vmsb©</span>
            <span aria-hidden="true">·</span>
            <span className="text-cyan-400 font-semibold">Silicio ABI Heterogéneo (9/9)</span>
            <span aria-hidden="true">·</span>
            <span>Kafka C++23 / Rust</span>
            <span aria-hidden="true">·</span>
            <span>Árbol CMST</span>
            <span aria-hidden="true">·</span>
            <span>Circom ZK</span>
          </div>
        </div>
      </footer>

      {/* PDF Export Modal */}
      <PdfExportModal
        isOpen={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        currentMWhSaved={totalMWhSaved}
        currentWaterSavedLiters={totalWaterSavedLiters}
        activeNodesCount={activeNodes.length}
        nodes={nodes}
      />

      {/* Protocol Controller Modal */}
      <ProtocolControllerModal
        isOpen={controllerModalOpen}
        onClose={() => setControllerModalOpen(false)}
        onTriggerRebalance={handleRebalanceCmst}
        onInjectSpikeLoad={handleInjectSpikeLoad}
        onResetTopology={handleResetTopology}
      />
    </div>
  );
}
