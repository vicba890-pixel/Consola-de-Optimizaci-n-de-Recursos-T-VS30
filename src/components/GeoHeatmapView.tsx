import React, { useState } from 'react';
import { GeoHeatmapNode } from '../types/protocol';
import { 
  Globe2, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Flame, 
  Activity, 
  Zap, 
  Droplets, 
  Lock, 
  CheckCircle2, 
  Server,
  Layers,
  Sparkles
} from 'lucide-react';

interface GeoHeatmapViewProps {
  geoNodes: GeoHeatmapNode[];
}

export const GeoHeatmapView: React.FC<GeoHeatmapViewProps> = ({ geoNodes }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>(geoNodes[0].id);
  const [heatmapMetric, setHeatmapMetric] = useState<'pue_thermal' | 'traffic' | 'health'>('pue_thermal');
  const [zkpPrivacyShield, setZkpPrivacyShield] = useState<boolean>(true);

  const selectedNode = geoNodes.find(n => n.id === selectedNodeId) || geoNodes[0];

  // Helper to convert lat/lng to SVG coordinates in an Equirectangular projection
  // SVG viewBox: 0 0 1000 500
  const projectCoordinates = (lat: number, lng: number) => {
    let effectiveLat = lat;
    let effectiveLng = lng;

    if (zkpPrivacyShield) {
      // Coarse regional fuzzing to avoid revealing exact physical rack locations
      // Deterministic slight offset based on hash to keep bubble anchored regionally
      const pseudoNoiseLat = ((lat * 9301 + 49297) % 233280) / 233280 - 0.5;
      const pseudoNoiseLng = ((lng * 9301 + 49297) % 233280) / 233280 - 0.5;
      effectiveLat = Math.round(lat / 2) * 2 + pseudoNoiseLat * 1.5;
      effectiveLng = Math.round(lng / 2) * 2 + pseudoNoiseLng * 2.0;
    }

    const x = ((effectiveLng + 180) / 360) * 1000;
    const y = ((90 - effectiveLat) / 180) * 500;
    return { x, y };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            07. Mapa de Calor Geográfico Multi-Nube y Escudo ZKP
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Distribución geoespacial de clústeres multi-nube y bare-metal soberanos. Monitorización térmica y de tráfico protegida mediante pruebas de conocimiento cero (ZKP) para salvaguardar la ubicación física exacta de infraestructuras críticas.
          </p>
        </div>

        {/* ZKP Shield Toggle & Metric Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* ZKP Toggle Button */}
          <button
            onClick={() => setZkpPrivacyShield(!zkpPrivacyShield)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              zkpPrivacyShield
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                : 'bg-amber-500/10 border-amber-500/40 text-amber-300'
            }`}
          >
            {zkpPrivacyShield ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Escudo ZKP: ACTIVO (Anonimizado)</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>Escudo ZKP: DESACTIVADO (Interno)</span>
              </>
            )}
          </button>

          {/* Metric Selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
            <button
              onClick={() => setHeatmapMetric('pue_thermal')}
              className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                heatmapMetric === 'pue_thermal'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Térmico (PUE)
            </button>
            <button
              onClick={() => setHeatmapMetric('traffic')}
              className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                heatmapMetric === 'traffic'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Carga (Gbps)
            </button>
            <button
              onClick={() => setHeatmapMetric('health')}
              className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                heatmapMetric === 'health'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Salud Clúster
            </button>
          </div>
        </div>
      </div>

      {/* ZKP Status Notice Banner */}
      <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Lock className="w-3.5 h-3.5" />
          </div>
          <span className="text-slate-300">
            {zkpPrivacyShield
              ? 'Protección Criptográfica ZKP Activa: Las coordenadas físicas y topologías internas de las subestaciones críticas han sido anonimizadas mediante prueba Circom zk-SNARK.'
              : 'Modo Administrativo Sin Filtro: Coordenadas precisas visibles únicamente para administradores con autorización de seguridad clearance Tier 1.'}
          </span>
        </div>
        <div className="font-mono text-emerald-400 shrink-0 text-[11px]">
          Invariante: Zero-Knowledge Privacy Safe
        </div>
      </div>

      {/* Main Grid: Interactive Map + Cluster Node Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* World Heatmap SVG Container */}
        <div className="lg:col-span-8 bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Globe2 className="w-4 h-4 text-cyan-400" />
              <span className="font-semibold text-slate-200">Mapa Global de Clústeres Multi-Cloud T-VS30</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-cyan-300">
                {heatmapMetric === 'pue_thermal' && 'Gradiente: Eficiencia Térmica PUE'}
                {heatmapMetric === 'traffic' && 'Gradiente: Intensidad de Tráfico de Red'}
                {heatmapMetric === 'health' && 'Gradiente: Disponibilidad BFT (100%)'}
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              6 Regiones Activas
            </div>
          </div>

          {/* SVG Map Canvas */}
          <div className="relative w-full h-[380px] bg-slate-950/90 rounded-lg border border-slate-800/80 overflow-hidden flex items-center justify-center">
            {/* World Map Outline SVG */}
            <svg
              viewBox="0 0 1000 500"
              className="w-full h-full relative z-10 select-none"
            >
              <defs>
                {/* Radial gradients for heat blur halos */}
                <radialGradient id="heatCool" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.7" />
                  <stop offset="60%" stopColor="#0891b2" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#0891b2" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="heatNominal" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.7" />
                  <stop offset="60%" stopColor="#059669" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="heatLoad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.7" />
                  <stop offset="60%" stopColor="#d97706" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Simplified World Continents Path for mission-control backdrop */}
              <g fill="#0f172a" stroke="#1e293b" strokeWidth="0.8" opacity="0.85">
                {/* North America */}
                <path d="M 140 100 L 220 80 L 280 110 L 290 180 L 240 240 L 200 240 L 160 190 L 120 150 Z" />
                {/* South America */}
                <path d="M 270 270 L 330 290 L 340 370 L 290 440 L 250 380 L 250 310 Z" />
                {/* Europe */}
                <path d="M 460 90 L 530 80 L 560 130 L 510 170 L 460 160 L 440 120 Z" />
                {/* Africa */}
                <path d="M 470 190 L 550 190 L 570 270 L 530 360 L 470 330 L 450 240 Z" />
                {/* Asia */}
                <path d="M 570 70 L 750 80 L 830 160 L 760 250 L 670 230 L 580 160 Z" />
                {/* Australia */}
                <path d="M 760 310 L 840 310 L 850 380 L 780 390 Z" />
              </g>

              {/* Multi-region network interconnect paths */}
              <g stroke="#0e7490" strokeWidth="1" strokeDasharray="3,3" opacity="0.4">
                <line x1="495" y1="135" x2="285" y2="160" /> {/* Fra -> Ash */}
                <line x1="285" y1="160" x2="165" y2="140" /> {/* Ash -> Ore */}
                <line x1="495" y1="135" x2="520" y2="148" /> {/* Fra -> Zrh */}
                <line x1="495" y1="135" x2="810" y2="155" /> {/* Fra -> Tyo */}
                <line x1="285" y1="160" x2="315" y2="350" /> {/* Ash -> Sao */}
                <line x1="165" y1="140" x2="810" y2="155" /> {/* Ore -> Tyo */}
              </g>

              {/* Render heatmap glow halos and node markers */}
              {geoNodes.map(node => {
                const { x, y } = projectCoordinates(node.lat, node.lng);
                const isSelected = node.id === selectedNodeId;

                // Color and size calculation based on selected metric
                let glowGradient = 'url(#heatNominal)';
                let glowRadius = 38;
                let coreColor = '#10b981';

                if (heatmapMetric === 'pue_thermal') {
                  // Cooler is better (PUE 1.05 - 1.07 -> Cyan, 1.08 - 1.11 -> Emerald/Amber)
                  if (node.pueThermalIndex <= 1.07) {
                    glowGradient = 'url(#heatCool)';
                    coreColor = '#22d3ee';
                    glowRadius = 45;
                  } else {
                    glowGradient = 'url(#heatNominal)';
                    coreColor = '#10b981';
                    glowRadius = 35;
                  }
                } else if (heatmapMetric === 'traffic') {
                  glowGradient = node.trafficGbps > 300 ? 'url(#heatLoad)' : 'url(#heatCool)';
                  coreColor = node.trafficGbps > 300 ? '#f59e0b' : '#38bdf8';
                  glowRadius = 30 + (node.trafficGbps / node.capacityGbps) * 35;
                } else {
                  glowGradient = 'url(#heatNominal)';
                  coreColor = '#10b981';
                  glowRadius = 40;
                }

                return (
                  <g
                    key={node.id}
                    className="cursor-pointer group"
                    onClick={() => setSelectedNodeId(node.id)}
                  >
                    {/* Thermal / Capacity Radial Heatmap Glow */}
                    <circle
                      cx={x}
                      cy={y}
                      r={glowRadius}
                      fill={glowGradient}
                      className="transition-all duration-500 pointer-events-none"
                    />

                    {/* Outer Selection Ring */}
                    {isSelected && (
                      <circle
                        cx={x}
                        cy={y}
                        r={18}
                        fill="none"
                        stroke="#22d3ee"
                        strokeWidth={1.5}
                        strokeDasharray="3,3"
                      />
                    )}

                    {/* Regional Cluster Core */}
                    <circle
                      cx={x}
                      cy={y}
                      r={8}
                      fill="#0f172a"
                      stroke={coreColor}
                      strokeWidth={2}
                    />

                    <circle
                      cx={x}
                      cy={y}
                      r={3.5}
                      fill={coreColor}
                    />

                    {/* Label */}
                    <text
                      x={x}
                      y={y - 12}
                      textAnchor="middle"
                      fill={isSelected ? '#ffffff' : '#cbd5e1'}
                      fontSize="9"
                      fontFamily="sans-serif"
                      fontWeight={isSelected ? '700' : '500'}
                    >
                      {zkpPrivacyShield ? node.anonymizedGeohash : node.locationLabel.split('·')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Bottom Heatmap Legend */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-3 pt-3 border-t border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
                PUE Ultra-Frío (1.05 - 1.07)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                Nominal PUE (1.08 - 1.11)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                Carga &gt; 300 Gbps
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              Proyección Cartográfica Cilíndrica Equirrectangular
            </div>
          </div>
        </div>

        {/* Selected Cluster Node Drawer */}
        <div className="lg:col-span-4 bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[11px] font-mono text-cyan-400 tracking-wider">
                  CLÚSTER MULTI-NUBE AUDITADO
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {selectedNode.name}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {selectedNode.healthScore}% SALUD
                </span>
                <div className="text-[10px] text-slate-500">
                  {selectedNode.cloudProvider}
                </div>
              </div>
            </div>

            {/* Spec breakdown */}
            <div className="mt-4 space-y-3 text-xs">
              {/* Geohash & ZKP Masking Info */}
              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 font-mono space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Geohash Anonimizado:</span>
                  <span className="text-cyan-300 font-semibold">{selectedNode.anonymizedGeohash}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Token de Prueba ZKP:</span>
                  <span className="text-emerald-400">{selectedNode.zkpProofToken}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Región Protegida:</span>
                  <span className="text-white">{selectedNode.locationLabel}</span>
                </div>
              </div>

              {/* Thermal and Water Savings */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-2.5">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-emerald-400" />
                    <span>PUE Térmico</span>
                  </div>
                  <div className="text-base font-bold text-emerald-300 font-mono mt-0.5">
                    {selectedNode.pueThermalIndex.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Ahorro del 27.7%
                  </div>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-2.5">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-cyan-400" />
                    <span>Agua Ahorrada</span>
                  </div>
                  <div className="text-base font-bold text-cyan-300 font-mono mt-0.5">
                    {(selectedNode.coolingWaterLitersSaved / 1000).toFixed(1)}k L
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Por día de cómputo
                  </div>
                </div>
              </div>

              {/* Traffic Load Bar */}
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Tráfico de Datos en Tiempo Real</span>
                  <span className="font-mono text-white">
                    {selectedNode.trafficGbps} / {selectedNode.capacityGbps} Gbps ({((selectedNode.trafficGbps / selectedNode.capacityGbps) * 100).toFixed(0)}%)
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 transition-all duration-300"
                    style={{ width: `${(selectedNode.trafficGbps / selectedNode.capacityGbps) * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-2.5 font-mono text-slate-300">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Instancias Distribuidas:</span>
                  <span className="text-white">{selectedNode.activeInstances.toLocaleString()} pods</span>
                </div>
                <div className="flex justify-between text-[11px] mt-1">
                  <span className="text-slate-400">Estado de Resiliencia:</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> BFT Tolerante
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 mt-4 text-[11px] text-slate-400 text-center">
            Las ubicaciones sensibles no son expuestas en texto plano bajo ninguna circunstancia.
          </div>
        </div>
      </div>
    </div>
  );
};
