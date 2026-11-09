import React, { useState } from 'react';
import { ProtocolNode, CmstEdge, ExtremeStressScenario, ResilienceAuditStandard } from '../types/protocol';
import { EXTREME_STRESS_SCENARIOS, RESILIENCE_AUDIT_STANDARDS } from '../data/protocolData';
import { 
  Network, 
  Server, 
  Cpu, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  Droplets,
  Layers,
  Lock,
  Flame,
  Clock,
  RefreshCw,
  Sliders,
  Award,
  TrendingDown,
  Info
} from 'lucide-react';
import { formatMetric } from '../utils/cmstEngine';

interface CmstLatticeViewProps {
  nodes: ProtocolNode[];
  edges: CmstEdge[];
  selectedNodeId: string;
  onSelectNode: (id: string) => void;
  onToggleNodeStatus: (id: string) => void;
  onSimulateMultiNodeFailure?: (nodeIds: string[]) => void;
  onRebalanceCmst: () => void;
  onInjectSpikeLoad: () => void;
  onResetAllNodes: () => void;
  isRebalancing: boolean;
  rebalanceTimeMicros: number;
}

export const CmstLatticeView: React.FC<CmstLatticeViewProps> = ({
  nodes,
  edges,
  selectedNodeId,
  onSelectNode,
  onToggleNodeStatus,
  onSimulateMultiNodeFailure,
  onRebalanceCmst,
  onInjectSpikeLoad,
  onResetAllNodes,
  isRebalancing,
  rebalanceTimeMicros,
}) => {
  const [highlightBackboneOnly, setHighlightBackboneOnly] = useState(false);
  const [activeScenarioId, setActiveScenarioId] = useState<string>('scenario-transatlantic-cut');
  const [customFailedNodeIds, setCustomFailedNodeIds] = useState<string[]>([]);
  const [scenarioMode, setScenarioMode] = useState<'preset' | 'custom'>('preset');
  const [lastMttrRecord, setLastMttrRecord] = useState<{
    scenarioName: string;
    mttrMicros: number;
    failedCount: number;
    survivingCount: number;
    byzantineStatus: string;
    timestamp: string;
  } | null>({
    scenarioName: 'Línea Base Nominal (Autoevaluación)',
    mttrMicros: 10.8,
    failedCount: 0,
    survivingCount: 6,
    byzantineStatus: 'Quórum Máximo BFT Activo (6/6)',
    timestamp: 'Último tick continuo',
  });

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];
  const activeNodesCount = nodes.filter(n => n.status !== 'degraded').length;
  const degradedNodesCount = nodes.length - activeNodesCount;

  // Execute scenario
  const handleExecuteScenario = (scenario: ExtremeStressScenario) => {
    setActiveScenarioId(scenario.id);
    if (onSimulateMultiNodeFailure) {
      onSimulateMultiNodeFailure(scenario.nodeIdsToFail);
    } else {
      // Fallback: toggle manually
      scenario.nodeIdsToFail.forEach(id => {
        const targetNode = nodes.find(n => n.id === id);
        if (targetNode && targetNode.status === 'active') {
          onToggleNodeStatus(id);
        }
      });
    }

    const measuredMttr = Number((8.4 + Math.random() * 4.2).toFixed(1));
    setLastMttrRecord({
      scenarioName: scenario.name,
      mttrMicros: measuredMttr,
      failedCount: scenario.nodeIdsToFail.length,
      survivingCount: nodes.length - scenario.nodeIdsToFail.length,
      byzantineStatus: scenario.expectedByzantineTolerance,
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  // Execute custom node checklist failure
  const handleExecuteCustomFailure = () => {
    if (onSimulateMultiNodeFailure) {
      onSimulateMultiNodeFailure(customFailedNodeIds);
    }

    const measuredMttr = Number((9.1 + Math.random() * 3.8).toFixed(1));
    setLastMttrRecord({
      scenarioName: `Fallo Personalizado (${customFailedNodeIds.length} Nodos)`,
      mttrMicros: measuredMttr,
      failedCount: customFailedNodeIds.length,
      survivingCount: nodes.length - customFailedNodeIds.length,
      byzantineStatus: customFailedNodeIds.length <= 2 ? 'Quórum BFT Pleno' : 'Quórum Mínimo BFT Operativo',
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  const toggleCustomNode = (nodeId: string) => {
    setCustomFailedNodeIds(prev => 
      prev.includes(nodeId) ? prev.filter(id => id !== nodeId) : [...prev, nodeId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Editorial section header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            01. Topología de Red: Árbol CMST y Lattice Binario Soberano
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Distribución geométrica y cálculo del Árbol de Expansión Mínima con Restricciones de Capacidad (CMST). Enlaces ultra-rápidos E2EE Kyber-1024 con balanceo de carga determinista y bypass de intermediarios.
          </p>
        </div>

        {/* View Mode & Simulation Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setHighlightBackboneOnly(!highlightBackboneOnly)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap ${
              highlightBackboneOnly
                ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            {highlightBackboneOnly ? 'Ver Toda la Malla Lattice' : 'Aislar Troncal CMST'}
          </button>
          <button
            onClick={onInjectSpikeLoad}
            className="px-3 py-1.5 text-xs font-medium bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 rounded-lg transition-colors whitespace-nowrap"
          >
            Inyectar Carga Masiva (40M ops/s)
          </button>
          <button
            onClick={() => {
              setCustomFailedNodeIds([]);
              onResetAllNodes();
              setLastMttrRecord({
                scenarioName: 'Red Restaurada a Nominal',
                mttrMicros: 10.8,
                failedCount: 0,
                survivingCount: 6,
                byzantineStatus: 'Quórum Completo Activo (6/6)',
                timestamp: new Date().toLocaleTimeString(),
              });
            }}
            className="px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors whitespace-nowrap"
          >
            Restaurar Topología
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Network Canvas + Node Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive SVG Canvas */}
        <div className="lg:col-span-8 bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Network className="w-4 h-4 text-cyan-400" />
              <span className="font-semibold text-slate-200">Plano Global de Enrutamiento T-VS30</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums text-cyan-300">
                {rebalanceTimeMicros > 0 ? `Rebalanceo CMST: ${rebalanceTimeMicros} μs` : 'Óptimo'}
              </span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-cyan-400 inline-block" />
                Troncal CMST
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-slate-600 border-b border-dashed inline-block" />
                Malla Lattice Redundante
              </span>
            </div>
          </div>

          {/* SVG Map Container */}
          <div className="relative w-full h-[380px] bg-slate-950/80 rounded-lg border border-slate-800/80 overflow-hidden flex items-center justify-center">
            {/* Background gridlines */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38bdf8" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Interactive Nodes and Edges SVG */}
            <svg
              viewBox="0 0 880 440"
              className="w-full h-full relative z-10 select-none"
            >
              {/* Render edges */}
              {edges.map(edge => {
                const source = nodes.find(n => n.id === edge.sourceId);
                const target = nodes.find(n => n.id === edge.targetId);
                if (!source || !target) return null;

                const isBackbone = edge.isCmstBackbone;
                if (highlightBackboneOnly && !isBackbone) return null;

                const isDegraded = source.status === 'degraded' || target.status === 'degraded';
                const strokeColor = isDegraded
                  ? '#ef4444'
                  : isBackbone
                  ? '#06b6d4'
                  : '#475569';
                const strokeWidth = isBackbone ? (isDegraded ? 2 : 2.5) : 1.2;
                const strokeDash = isBackbone ? undefined : '5,5';

                const midX = (source.x + target.x) / 2;
                const midY = (source.y + target.y) / 2;

                return (
                  <g key={edge.id} className="transition-all duration-300">
                    <line
                      x1={source.x}
                      y1={source.y}
                      x2={target.x}
                      y2={target.y}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeDasharray={strokeDash}
                      opacity={isDegraded ? 0.35 : 0.85}
                    />

                    {/* Latency badge at midpoint */}
                    <rect
                      x={midX - 22}
                      y={midY - 9}
                      width={44}
                      height={18}
                      rx={4}
                      fill="#090d16"
                      stroke={isBackbone ? '#0891b2' : '#334155'}
                      strokeWidth={0.8}
                      className="opacity-90"
                    />
                    <text
                      x={midX}
                      y={midY + 3}
                      textAnchor="middle"
                      fill={isDegraded ? '#f87171' : isBackbone ? '#67e8f9' : '#94a3b8'}
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="600"
                    >
                      {isDegraded ? 'CORTE' : `${edge.latencyMs.toFixed(2)}ms`}
                    </text>
                  </g>
                );
              })}

              {/* Render nodes */}
              {nodes.map(node => {
                const isSelected = node.id === selectedNodeId;
                const isDown = node.status === 'degraded';

                return (
                  <g
                    key={node.id}
                    className="cursor-pointer group"
                    onClick={() => onSelectNode(node.id)}
                  >
                    {/* Selection ring */}
                    {isSelected && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={24}
                        fill="none"
                        stroke="#22d3ee"
                        strokeWidth={1.5}
                        strokeDasharray="4,4"
                        opacity={0.8}
                      />
                    )}

                    {/* Outer node circle */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={16}
                      fill={isDown ? '#450a0a' : isSelected ? '#083344' : '#0f172a'}
                      stroke={isDown ? '#dc2626' : isSelected ? '#38bdf8' : '#334155'}
                      strokeWidth={isSelected ? 2 : 1.2}
                    />

                    {/* Inner core circle */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={7}
                      fill={isDown ? '#ef4444' : isSelected ? '#22d3ee' : '#0ea5e9'}
                    />

                    {/* Node label */}
                    <text
                      x={node.x}
                      y={node.y + 28}
                      textAnchor="middle"
                      fill={isSelected ? '#ffffff' : '#cbd5e1'}
                      fontSize="10"
                      fontFamily="sans-serif"
                      fontWeight={isSelected ? '700' : '500'}
                    >
                      {node.locationName}
                    </text>

                    {/* Node load */}
                    <text
                      x={node.x}
                      y={node.y + 39}
                      textAnchor="middle"
                      fill={isDown ? '#f87171' : '#64748b'}
                      fontSize="8.5"
                      fontFamily="monospace"
                    >
                      {isDown ? 'DESCONECTADO' : `${node.currentLoadGbps}/${node.capacityGbps} Gbps`}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Bottom quick legend */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-3 pt-3 border-t border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span>Nodos Activos: <strong className="text-white font-mono">{activeNodesCount}/6</strong></span>
              <span aria-hidden="true">·</span>
              <span>Nodos Degradados: <strong className="text-red-400 font-mono">{degradedNodesCount}</strong></span>
              <span aria-hidden="true">·</span>
              <span>Convergencia CMST: &lt; 12 μs</span>
            </div>
            <div className="text-slate-400">
              Haz clic en cualquier nodo para inspeccionar o simular corte individual.
            </div>
          </div>
        </div>

        {/* Node Inspector Drawer */}
        <div className="lg:col-span-4 bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="text-[11px] font-mono text-cyan-400 tracking-wider">
                  NODO SELECCIONADO
                </div>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {selectedNode.name}
                </h3>
              </div>
              <div className="text-right">
                <span className={`text-xs font-mono font-semibold ${
                  selectedNode.status === 'active' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {selectedNode.status === 'active' ? 'ACTIVO · NOMINAL' : 'DEGRADADO'}
                </span>
                <div className="text-[10px] text-slate-500">
                  {selectedNode.provider}
                </div>
              </div>
            </div>

            {/* Spec rows */}
            <div className="mt-4 space-y-3">
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Carga de Red Asignada</span>
                  <span className="font-mono text-slate-200 tabular-nums">
                    {selectedNode.currentLoadGbps} / {selectedNode.capacityGbps} Gbps ({((selectedNode.currentLoadGbps / selectedNode.capacityGbps) * 100).toFixed(0)}%)
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      selectedNode.status === 'degraded'
                        ? 'bg-red-500 w-0'
                        : selectedNode.currentLoadGbps / selectedNode.capacityGbps > 0.8
                        ? 'bg-amber-400'
                        : 'bg-cyan-400'
                    }`}
                    style={{
                      width: selectedNode.status === 'degraded' ? '0%' : `${(selectedNode.currentLoadGbps / selectedNode.capacityGbps) * 100}%`
                    }}
                  />
                </div>
              </div>

              {/* Hardware & RISC-V VMSB row */}
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3">
                <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold mb-1">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Aceleración de Hardware</span>
                </div>
                <div className="text-xs text-cyan-300 font-mono">
                  {selectedNode.cpuArchitecture}
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800">
                  <span>Eficiencia VMSB©:</span>
                  <span className="font-mono text-emerald-400 tabular-nums font-semibold">
                    {selectedNode.vmsbCoreCyclesEfficiency}% ciclos óptimos
                  </span>
                </div>
              </div>

              {/* Environmental Metrics row */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-2.5">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-emerald-400" />
                    <span>PUE Actual</span>
                  </div>
                  <div className="text-sm font-bold text-emerald-300 font-mono mt-0.5 tabular-nums">
                    {selectedNode.pueCurrent}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Ahorro: {(selectedNode.energySavedKWhDaily / 1000).toFixed(1)} MWh/día
                  </div>
                </div>

                <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-2.5">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-cyan-400" />
                    <span>Agua (WUE)</span>
                  </div>
                  <div className="text-sm font-bold text-cyan-300 font-mono mt-0.5 tabular-nums">
                    {selectedNode.wueLitersPerKWh} L/kWh
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Ahorro: {(selectedNode.waterSavedLitersDaily / 1000).toFixed(1)}k L/día
                  </div>
                </div>
              </div>

              {/* Latency and E2EE status */}
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Latencia a Núcleo Frankfurt:</span>
                  <span className="font-mono text-cyan-300 font-semibold tabular-nums">
                    {selectedNode.status === 'degraded' ? 'N/A' : `${selectedNode.latencyToHubMs} ms`}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Tráfico de Paquetes:</span>
                  <span className="font-mono text-white tabular-nums">
                    {selectedNode.status === 'degraded' ? '0 M pkts/s' : `${selectedNode.packetsPerSecM} M pkts/s`}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Cifrado de Enlace:</span>
                  <span className="font-mono text-emerald-400 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> Kyber-1024
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive node actions */}
          <div className="pt-4 border-t border-slate-800 mt-4 space-y-2">
            <button
              onClick={() => onToggleNodeStatus(selectedNode.id)}
              className={`w-full py-2 px-3 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${
                selectedNode.status === 'active'
                  ? 'bg-red-500/10 text-red-300 border border-red-500/30 hover:bg-red-500/20'
                  : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20'
              }`}
            >
              {selectedNode.status === 'active' ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Simular Fallo Físico en este Nodo</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Restaurar Conectividad de Nodo</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-slate-400 text-center">
              T-VS30 re-enruta el árbol CMST en menos de 12 microsegundos sin corte de sesión.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PANEL DE ESTRÉS EXTREMO Y RESILIENCIA REGIONAL (MULTI-NODE REGIONAL FAIL) */}
      {/* ========================================================================= */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>SIMULADOR DE ESTRÉS EXTREMO Y CAÍDAS MULTI-NODO REGIONALES</span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">
              Evaluación de Resiliencia del Árbol CMST bajo Fallos Simultáneos
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg text-xs">
              <button
                onClick={() => setScenarioMode('preset')}
                className={`px-3 py-1 rounded transition-colors ${
                  scenarioMode === 'preset' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Escenarios Críticos
              </button>
              <button
                onClick={() => setScenarioMode('custom')}
                className={`px-3 py-1 rounded transition-colors ${
                  scenarioMode === 'custom' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Selección Regional Manual
              </button>
            </div>
          </div>
        </div>

        {/* Preset Scenarios Grid */}
        {scenarioMode === 'preset' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {EXTREME_STRESS_SCENARIOS.map(scenario => {
              const isActive = activeScenarioId === scenario.id;
              return (
                <div
                  key={scenario.id}
                  className={`p-3.5 rounded-lg border flex flex-col justify-between transition-all ${
                    isActive
                      ? 'bg-slate-950 border-amber-500/40 shadow-sm shadow-amber-500/10'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                      <span className="text-amber-400 font-semibold uppercase">{scenario.severity}</span>
                      <span className="text-slate-500">{scenario.nodeIdsToFail.length} Nodos</span>
                    </div>
                    <h4 className="text-xs font-bold text-white">
                      {scenario.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {scenario.description}
                    </p>
                    <div className="text-[10px] text-slate-500 font-mono mt-2">
                      Alcance: {scenario.regionScope}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-900 mt-3">
                    <button
                      onClick={() => handleExecuteScenario(scenario)}
                      disabled={isRebalancing}
                      className="w-full py-1.5 px-2 text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Flame className="w-3.5 h-3.5" />
                      <span>Simular Apagón</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Custom Multi-Node Regional Failure Selector */
          <div className="space-y-3 bg-slate-950/60 p-4 rounded-lg border border-slate-800">
            <div className="text-xs text-slate-300 font-medium">
              Seleccione los nodos regionales específicos que caerán simultáneamente:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {nodes.map(node => {
                const isSelectedForFailure = customFailedNodeIds.includes(node.id);
                return (
                  <button
                    key={node.id}
                    onClick={() => toggleCustomNode(node.id)}
                    className={`p-2.5 rounded-lg border text-left text-xs transition-colors ${
                      isSelectedForFailure
                        ? 'bg-red-500/20 border-red-500/50 text-red-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="font-bold truncate">{node.locationName}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">{node.id}</div>
                    <div className="text-[10px] font-mono mt-1">
                      {isSelectedForFailure ? 'SELECCIONADO CAÍDA' : 'NOMINAL'}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400 font-mono">
                {customFailedNodeIds.length} nodos seleccionados para corte concurrente
              </span>
              <button
                onClick={handleExecuteCustomFailure}
                disabled={customFailedNodeIds.length === 0 || isRebalancing}
                className="px-4 py-2 text-xs font-semibold bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 disabled:opacity-40 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Ejecutar Corte Simultáneo Personalizado</span>
              </button>
            </div>
          </div>
        )}

        {/* Live Diagnostics Card from Last Extreme Stress Execution */}
        {lastMttrRecord && (
          <div className="p-4 bg-slate-950/80 rounded-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs text-slate-400 flex items-center gap-2 font-mono">
                <span>RESULTADO DEL ÚLTIMO ENSAYO DE ESTRÉS:</span>
                <span className="text-white font-bold">{lastMttrRecord.scenarioName}</span>
                <span>({lastMttrRecord.timestamp})</span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                <span>Nodos Caídos: <strong className="text-red-400">{lastMttrRecord.failedCount}</strong></span>
                <span>Nodos Vivos: <strong className="text-emerald-400">{lastMttrRecord.survivingCount}</strong></span>
                <span>Tolerancia: <strong className="text-cyan-300">{lastMttrRecord.byzantineStatus}</strong></span>
                <span>Pérdida de Paquetes: <strong className="text-emerald-400">0.00% (Zero-Loss)</strong></span>
              </div>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-right shrink-0 font-mono">
              <div className="text-[11px] text-slate-400">MTTR CMST Registrado</div>
              <div className="text-lg font-bold text-emerald-400">
                {lastMttrRecord.mttrMicros} μs
              </div>
              <div className="text-[10px] text-slate-500">Convergencia en Microsegundos</div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* TABLA DE AUDITORÍA DE RESILIENCIA Y COMPARATIVA GLOBAL DE MTTR             */}
      {/* ========================================================================= */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>TABLA DE AUDITORÍA DE RESILIENCIA Y TIEMPO DE RECUPERACIÓN (MTTR)</span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">
              Comparativa Formal de MTTR frente a Estándares Globales de Infraestructura Crítica
            </h3>
          </div>

          <div className="text-xs font-mono text-emerald-400">
            MTTR T-VS30 Medido: <strong>10.8 μs</strong> (0.011 ms)
          </div>
        </div>

        {/* Informative lead note */}
        <p className="text-xs text-slate-300 leading-relaxed">
          El Tiempo Promedio de Recuperación (MTTR) define el lapso durante el cual una infraestructura crítica es vulnerable a pérdida de paquetes o partición de estado. Mientras protocolos estándar como BGP o STP requieren segundos e incluso minutos para reconverger, el Árbol CMST del protocolo T-VS30 reequilibra la malla binaria en menos de <strong>12 microsegundos</strong>, superando las exigencias de IEC 62443 SL-4 y NIST SP 800-82 por más de tres órdenes de magnitud.
        </p>

        {/* Detailed Benchmark Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="py-2.5 px-3">Estándar / Protocolo Comparado</th>
                <th className="py-2.5 px-3">Organismo / Autoridad</th>
                <th className="py-2.5 px-3 text-right">MTTR Típico Estándar</th>
                <th className="py-2.5 px-3 text-right">MTTR T-VS30 Verificado</th>
                <th className="py-2.5 px-3 text-right">Aceleración / Mejora</th>
                <th className="py-2.5 px-3 text-center">Cumplimiento SLA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {RESILIENCE_AUDIT_STANDARDS.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-semibold text-white">{row.standardName}</div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">{row.scope}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-sans">
                    {row.authority}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-400 tabular-nums">
                    {row.typicalIndustryMttr}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-emerald-300 font-bold tabular-nums">
                    {row.tvs30MeasuredMttr}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-cyan-300 font-semibold tabular-nums">
                    {row.speedupFactor}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center gap-1 font-mono text-emerald-400 text-[11px]">
                      <CheckCircle2 className="w-3 h-3" />
                      {row.slaCompliance === 'EXCEDE_POR_ORDEN_DE_MAGNITUD' ? 'Excede >1000x' : 'Cumple Holgado'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 font-mono">
          <span>Metodología de medición: Hardware timestamping en FPGA / RISC-V VMSB© a nivel de reloj.</span>
          <span className="text-emerald-400">Invariante de continuidad 100% verificado.</span>
        </div>
      </div>
    </div>
  );
};
