/**
 * Protocolo Optimizador T-VS30 - Type Definitions
 * Mission-Critical Distributed Infrastructure & Resource Optimization
 */

export type ProtocolState = 'nominal' | 'optimizing' | 'failover_healing' | 'calibrating';

export type NodeRegion = 'eu-central-fra' | 'us-east-ash' | 'us-west-ore' | 'ap-northeast-tyo' | 'sa-east-sao' | 'ch-sovereign-zrh';

export interface ProtocolNode {
  id: string;
  name: string;
  region: NodeRegion;
  locationName: string;
  provider: 'Sovereign Bare-Metal' | 'AWS GovCloud' | 'GCP C3D' | 'Azure Sovereign' | 'Equinix Metal';
  status: 'active' | 'degraded' | 'healing';
  capacityGbps: number;
  currentLoadGbps: number;
  cpuArchitecture: 'RISC-V 64GC (VMSB© Native)' | 'AMD EPYC 9654 + VMSB Bridge' | 'ARM Neoverse V2 + VMSB';
  vmsbCoreCyclesEfficiency: number; // e.g. 99.4%
  pueCurrent: number; // e.g. 1.08
  wueLitersPerKWh: number; // e.g. 0.12 L/kWh
  latencyToHubMs: number;
  x: number;
  y: number;
  packetsPerSecM: number;
  waterSavedLitersDaily: number;
  energySavedKWhDaily: number;
}

export interface CmstEdge {
  id: string;
  sourceId: string;
  targetId: string;
  latencyMs: number;
  bandwidthUsagePercent: number;
  isCmstBackbone: boolean;
  status: 'nominal' | 'congested' | 'rerouted';
  cryptoStatus: 'Kyber1024-ChaCha20-Poly1305' | 'E2EE-Active';
}

export interface LiveTelemetrySample {
  timestamp: string;
  throughputMOps: number;
  p50LatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  vmsbCacheHitPercent: number;
  kafkaZeroCopyThroughputGBs: number;
  pueAggregate: number;
  instantEnergySavedKW: number;
  instantWaterSavedLitersHr: number;
}

export interface ComplianceStandard {
  code: string;
  name: string;
  authority: string;
  clause: string;
  status: 'compliant' | 'verified_continuous';
  lastAuditTime: string;
  details: string;
  securityLevel: string;
}

export interface CircomProofEvent {
  proofId: string;
  circuitName: string;
  timestamp: string;
  provingTimeMs: number;
  verificationStatus: 'VALID' | 'VERIFYING';
  publicHash: string;
  constraintsCount: number;
}

export type AuditCriticality = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export interface CorrelatedZkProofDetails {
  proofId: string;
  circuitName: string;
  verificationStatus: 'VALID' | 'VERIFYING';
  provingTimeMs: number;
  constraintsCount: number;
  publicHash: string;
  provingScheme: 'Groth16 (BN254)' | 'Plonk' | 'KZG-Polynomial';
  witnessDigest: string;
  invariantsGuaranteed: string[];
  circuitCodeSnippet?: string;
}

export interface CorrelatedAuditTimelineEvent {
  id: string;
  timestamp: string;
  rawEpochMs: number;
  criticality: AuditCriticality;
  category: 'VMSB_KERNEL' | 'SECURITY' | 'CMST_TOPOLOGY' | 'SILICON_ABI' | 'EFFICIENCY' | 'COMPLIANCE';
  message: string;
  verificationHash: string;
  nodeId: string;
  siliconProvider?: string;
  correlationStatus: 'SYNCHRONIZED' | 'ATTESTING' | 'AUDITED';
  correlationLatencyDeltaMs: number;
  zkProof: CorrelatedZkProofDetails;
  dilithiumSignature?: {
    signatureId: string;
    scheme: string;
    verificationLatencyMicros: number;
    constantTimeNttVerified: boolean;
  };
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  category: 'SECURITY' | 'EFFICIENCY' | 'CMST_TOPOLOGY' | 'VMSB_KERNEL' | 'COMPLIANCE';
  severity: 'info' | 'notice' | 'success';
  criticality?: AuditCriticality;
  message: string;
  verificationHash: string;
  correlatedProofId?: string;
}

export interface GeoHeatmapNode {
  id: string;
  name: string;
  region: NodeRegion;
  locationLabel: string;
  cloudProvider: 'Sovereign Bare-Metal' | 'AWS GovCloud' | 'GCP C3D' | 'Azure Sovereign' | 'Equinix Metal';
  lat: number;
  lng: number;
  anonymizedGeohash: string;
  zkpProofToken: string;
  healthScore: number; // 0 - 100
  pueThermalIndex: number; // e.g. 1.05 - 1.15
  trafficGbps: number;
  capacityGbps: number;
  clusterState: 'healthy' | 'optimizing' | 'shielded_zkp';
  activeInstances: number;
  coolingWaterLitersSaved: number;
}

export interface JurisdictionalLegalFramework {
  id: string;
  jurisdiction: string;
  flagEmoji: string;
  regulatoryBody: string;
  legalInstruments: string;
  nativeCertificationStatus: 'HOMOLOGADO_NATIVO' | 'AMPARO_SOBERANO_ACTIVO' | 'CERTIFICACION_VERIFICADA';
  efficiencyContributionAssessment: string;
  legalShieldGuarantee: string;
  notarialDocumentId: string;
  zkpComplianceHash: string;
  lastRatificationDate: string;
}

export interface ExtremeStressScenario {
  id: string;
  name: string;
  description: string;
  regionScope: string;
  nodeIdsToFail: string[];
  severity: 'high' | 'critical' | 'catastrophic';
  expectedByzantineTolerance: string;
}

export interface ResilienceAuditStandard {
  standardName: string;
  authority: string;
  typicalIndustryMttr: string;
  tvs30MeasuredMttr: string;
  speedupFactor: string;
  slaCompliance: 'CUMPLE_HOLGADO' | 'EXCEDE_POR_ORDEN_DE_MAGNITUD';
  scope: string;
}

export interface DilithiumSignatureEvent {
  signatureId: string;
  targetProcess: 'CMST_TREE_MUTATION' | 'VMSB_CORE_DISPATCH' | 'THERMODYNAMIC_TELEMETRY' | 'CRITICAL_SCADA_BUS' | 'PQC_KEY_ROTATION';
  timestamp: string;
  scheme: 'CRYSTALS-Dilithium-5 (ML-DSA-87)' | 'Dilithium-VMSB-Native';
  verificationLatencyMicros: number;
  status: 'VERIFIED_AUTHENTIC' | 'INSPECTION_NOMINAL';
  constantTimeNttVerified: boolean;
  signerNodeId: string;
  hardwareTrapSlot: string;
  merkleDigest: string;
}

export interface DilithiumVmsbConfig {
  pqcLevel: 'Level 5 (256-bit Quantum Hardness)' | 'Level 3';
  sideChannelDefense: 'Constant-Time NTT + Random Jitter Masking';
  hardwareTrapSlot: 'PMP Register 0-7 Pinned';
  signatureVerificationTimeTargetMicros: number;
  signedCmstRebalanceEnforced: boolean;
  scadaNonHarmfulHardwareIntervention: boolean;
}

export interface GreenAuditReportData {
  organizationName: string;
  datacenterCluster: string;
  reportingPeriod: string;
  totalNodesAudited: number;
  totalMWhSaved: number;
  totalWaterSavedLiters: number;
  pueReductionRatio: string;
  co2TonsAvoided: number;
  capexInvestmentSavedUsd: number;
  auditorCertificationId: string;
  cryptographicMerkleRoot: string;
  legalJurisdictionsCovered?: string[];
}

/**
 * Universal Silicon Platforms Interconnected by vmsb© Native Binary ABI
 */
export type SiliconPlatformId = 
  | 'NVIDIA_CUDA' 
  | 'INTEL_AMX_GAUDI' 
  | 'AMD_ROCM_CDNA' 
  | 'GOOGLE_TPU_XLA' 
  | 'AWS_NEURON_TRAINIUM' 
  | 'AZURE_MAIA' 
  | 'META_MTIA' 
  | 'BROADCOM_STRATA' 
  | 'TSMC_COWOS_NATIVE';

export interface SiliconArchitectureSpec {
  id: SiliconPlatformId;
  name: string;
  vendor: string;
  chipModel: string;
  architectureFamily: string;
  processNode: string; // e.g. "TSMC 4N", "Intel 18A", "TSMC N3E"
  binaryIsa: string; // e.g. "PTX 8.4 / SASS", "AMX TMUL / Level Zero", "HSA AQL / CDNA3"
  interconnectBus: string; // e.g. "NVLink v5 (1.8 TB/s)", "Infinity Fabric 4.0", "ICI 4.8 Tbps"
  dmaEngine: string; // e.g. "Direct GPUDirect DMA (Zero-Copy)"
  packagingTechnology: string; // e.g. "TSMC CoWoS-L 3.3x reticle"
  peakTopsFp8: number;
  vmsbDispatchLatencyNs: number; // e.g. 140 ns
  tdpWatts: number;
  pueThermalEfficiency: number; // e.g. 1.05
  dilithiumEnclaveSlot: string; // e.g. "PMP-SLOT-01"
  zkpProofCircuit: string; // e.g. "silicon_boundary_verifier.circom"
  nativeBinaryHook: string; // C++ function signature
  registerDumpExample: string;
  binarySampleAsm: string[];
  status: 'ONLINE_LINKED' | 'DISPATCH_READY' | 'THERMAL_OPTIMIZING';
}

export interface CrossSiliconDispatchEvent {
  dispatchId: string;
  timestamp: string;
  sourcePlatform: SiliconPlatformId;
  targetPlatform: SiliconPlatformId;
  workloadType: 'LLM_KV_CACHE_TRANSFER' | 'GRADIENT_ALL_REDUCE' | 'SCADA_TELEMETRY_BURST' | 'DENSE_GEMM_OFFLOAD' | 'EMBEDDINGS_SHUFFLE';
  payloadBytes: number;
  dispatchLatencyMicros: number;
  dilithiumSigDigest: string;
  zkpProofDigest: string;
  energyJoulesSaved: number;
  waterMlSaved: number;
  status: 'ZERO_COPY_COMMITTED' | 'AUTHENTICATED_PQC' | 'VERIFIED_ZKP';
}

export interface VmsbBinaryAbiField {
  offsetBytes: number;
  sizeBytes: number;
  name: string;
  hexValue: string;
  fieldCategory: 'MAGIC_HEADER' | 'SILICON_ROUTING' | 'CRYPTO_SECURITY' | 'ZERO_COPY_DMA' | 'THERMAL_TELEMETRY';
  description: string;
}

export interface SiliconBenchmarkComparison {
  metricName: string;
  traditionalVirtualization: string;
  vmsbNativeBinary: string;
  speedupGain: string;
  architecturalAdvantage: string;
}

/**
 * Frictionless Native Binary Quantization (VMSB-FQ©)
 */
export type FrictionlessQuantMode = 
  | 'INT4_VMSB_ZERO_FRICTION'
  | 'FP8_E4M3_HYBRID_SCALE'
  | 'MXFP6_MICROSCALE_OCP'
  | 'RNS_RESIDUE_LATTICE_PQC';

export interface QuantizationPresetSpec {
  mode: FrictionlessQuantMode;
  name: string;
  shortLabel: string;
  bitWidth: number;
  compressionRatio: string;
  roundingLatencyNs: number; // 0.00 ns for VMSB frictionless
  entropyLossRatePct: number; // 0.00%
  dilithiumLatticePreservation: '100%_LOSSLESS' | 'CONSTANT_TIME_EXACT';
  crossSiliconSupport: string[];
  mathematicalFormulation: string;
  hardwareAcceleration: string;
  energyJoulesReductionPct: number;
  description: string;
}

export interface StressTelemetrySample {
  timestamp: string;
  stepIndex: number;
  throughputKops: number;
  latencyP50Us: number;
  latencyP99Us: number;
  latencyP999Us: number;
  memoryBusContentionPct: number;
  thermalJunctionC: number;
  cacheLineMissPct: number;
  powerWatts: number;
  timingSideChannelDeltaNs: number;
  quantumVulnerabilityRiskScore: number; // 0 - 100
}

export interface StressTestReport {
  testId: string;
  phase: 'BASELINE_PRE_OPTIMIZATION' | 'POST_KERNEL_IMPROVEMENT';
  timestamp: string;
  concurrencyLevel: number; // e.g. 10000 concurrent threads
  durationSeconds: number;
  totalTransactionsProcessed: number;
  peakThroughputKops: number;
  p50LatencyUs: number;
  p99LatencyUs: number;
  p999LatencyMs: number;
  latencyJitterUs: number;
  memoryBandwidthContentionPct: number;
  peakThermalJunctionC: number;
  timingSideChannelDeltaNs: number;
  quantumVulnerabilityPointsDetected: number;
  coolingWaterEvaporationSurgePct: number;
  identifiedBottlenecks: string[];
  status: 'STRESS_SATURATED' | 'IMPROVEMENT_APPLIED' | 'QUANTUM_RESILIENT';
}

export interface KernelImprovementSpec {
  kernelVersion: string;
  kernelName: string;
  compilationTarget: string;
  simdVectorWidthBits: number;
  optimizationsApplied: {
    name: string;
    description: string;
    impact: string;
  }[];
  rnsModulusConfig: string;
  constantTimeNttVerified: boolean;
  codeSnippet: string;
}

export interface QuantumAttackVectorResult {
  attackVectorId: 'SHOR_DISCRETE_LOG' | 'GROVER_HASH_INVERSION' | 'BKZ_LATTICE_REDUCTION' | 'QUANTUM_DPA_TIMING' | 'LASER_FAULT_INJECTION';
  name: string;
  targetMechanism: string;
  theoreticalQuantumComplexity: string;
  requiredPhysicalQubits: number;
  quantumGateDepth: string;
  attackExecutionResult: 'BLOCKED' | 'ZERO_CORRELATION' | 'UNBROKEN' | 'HEALED';
  securityMarginBits: number;
  vulnerabilityProbability: number; // 0.0000%
  verificationProofHash: string;
  details: string;
}

export interface QuantumVulnerabilitySimulationReport {
  simulationId: string;
  timestamp: string;
  quantumTargetState: 'VMSB_NATIVE_QUANTIZED_KERNEL';
  quantumSimulatorEngine: string;
  totalAttackVectorsTested: number;
  vulnerabilitiesDetected: number; // 0
  overallQuantumSecurityRating: 'NIST_LEVEL_5_PQC_CERTIFIED';
  quantumImmunityScore: number; // 100
  attackVectors: QuantumAttackVectorResult[];
  circomZkProofDigest: string;
  dilithiumSignatureDigest: string;
  certificationAuthority: string;
}

export interface CertifiedQuantumQuantReportData {
  certificateId: string;
  organizationName: string;
  datacenterCluster: string;
  emissionTimestamp: string;
  baselineStress: StressTestReport;
  quantizationSpec: QuantizationPresetSpec;
  kernelImprovement: KernelImprovementSpec;
  improvedStress: StressTestReport;
  quantumSimulation: QuantumVulnerabilitySimulationReport;
  zkProofDigest: string;
  dilithiumSignature: string;
  merkleAuditRoot: string;
  leadAuditor: string;
}

/**
 * Executive Market Benchmark & Comparative Dashboard Types
 */
export type ExecutivePerspective = 'c_suite' | 'coo_infra' | 'ciso_security' | 'cfo_finance';

export interface MarketStandardArchetype {
  id: 't_vs30_vmsb' | 'centralized_cloud' | 'traditional_mesh' | 'enterprise_dlt';
  name: string;
  badge: string;
  shortTag: string;
  architectureType: string;
  p99LatencyMs: string;
  avgMultiRegionLatency: string;
  serializationOverhead: string;
  deserializationLatency: string;
  hardwareCoupling: string;
  pqcReadiness: string;
  spofVulnerability: string;
  carbonPue: string;
  capexReq: string;
  relativeTcoIndex: number; // T-VS30 = 32 vs Centralized = 100
  marketPresence: string;
  keyDifferentiator: string;
  pros: string[];
  cons: string[];
}

export interface ExecutiveBenchmarkDimension {
  dimensionId: string;
  category: 'LATENCY' | 'SILICON_VMSB' | 'SECURITY_PQC' | 'TCO_FINANCE' | 'RESILIENCE' | 'SOVEREIGNTY';
  title: string;
  metricLabel: string;
  tVs30Value: string;
  tVs30Score: number; // 0 - 100
  centralizedCloudValue: string;
  centralizedCloudScore: number;
  traditionalMeshValue: string;
  traditionalMeshScore: number;
  enterpriseDltValue: string;
  enterpriseDltScore: number;
  executiveInsight: string;
  vmsbNativeBinaryFactor: string;
}

export interface MultiRegionLatencyCorridor {
  id: string;
  corridorName: string;
  originNode: string;
  destinationNode: string;
  geographicalDistanceKm: number;
  centralizedHairpinLatencyMs: number;
  tVs30CmstDecentralizedLatencyMs: number;
  speedupRatio: string;
  latencyReductionPercent: number;
  centralizedFailureMode: string;
  tVs30FailoverTimeMicros: number;
  annualHoursSaved100M: number;
}

export interface VmsbBinaryAdvantageMetric {
  feature: string;
  vmsbBinaryNative: string;
  jsonRestHttp2: string;
  protobufGrpcMtls: string;
  executiveImpact: string;
  gainFactor: string;
}

/**
 * ============================================================================
 * SISTEMA DE AUDITORÍA Y CERTIFICACIÓN NOTARIAL AUTOMÁTICA
 * & PROTECCIÓN ANTI-REA-ING.-NATIVO-VMSB©2026
 * ============================================================================
 */

export type NotarialInstrumentType = 
  | 'ACTA_CONSTATACION_HECHOS'
  | 'ACTA_EXISTENCIA_SILICIO'
  | 'CERTIFICADO_ANTI_REA_ING'
  | 'PROTOCOLO_SELLADO_TIEMPO_EIDAS'
  | 'DICTAMEN_INMUNIDAD_CUANTICA';

export interface NotarialInstrumentEntry {
  instrumentId: string;
  protocolNumber: string;
  instrumentType: NotarialInstrumentType;
  title: string;
  timestamp: string;
  criticalInfrastructureCluster: string;
  notaryPublicAuthority: string;
  attestationScope: string;
  circomZkProofDigest: string;
  dilithium5Signature: string;
  rfc3161TimestampToken: string;
  merkleLeafHash: string;
  status: 'PROTOCOLIZADA_CON_FE_PUBLICA' | 'SELLADA_QUALIFIED_TIMESTAMP' | 'VERIFICADA_LEGAL';
  antiReaProtectionLevel: string;
  legalBasis: string[];
  findingsSummary: string;
  cryptographicEvidence: {
    stateRootHash: string;
    verifiedInvariantsCount: number;
    zeroTamperConfirmed: boolean;
    quantumSecurityMarginBits: number;
  };
}

export interface AntiReaDefenseVector {
  vectorId: string;
  defenseLayer: 'HARDWARE_PUF' | 'POLYMORPHIC_OPCODES' | 'ANTI_DEBUG_JTAG' | 'ZEROIZE_TAMPER' | 'LATENCY_SIDECHANNEL_SHIELD';
  name: string;
  mechanism: string;
  attackSurfaceNeutralized: string;
  reactionTimeNs: number;
  status: 'ACTIVE_SHIELDED' | 'PROBING_DETECTED_NEUTRALIZED' | 'HARDWARE_LOCKED';
  detectionCount: number;
  lastNeutralizedTimestamp: string;
  notarialAttestationClause: string;
  technicalDescription: string;
}

export interface AutoAuditCycleReport {
  cycleId: string;
  timestamp: string;
  auditedNodes: number;
  invariantsChecked: number;
  zkProofsGenerated: number;
  notarialInstrumentsIssued: number;
  antiReaProbesBlocked: number;
  overallComplianceStatus: 'CONFORME_FE_PUBLICA' | 'AUDITANDO' | 'ALERTA_FORENSE';
  merkleRoot: string;
  notaryRegistryProtocol: string;
  autoFrequencySeconds: number;
}

/**
 * ============================================================================
 * CALCULADORA DE ROI DE CAPEX CERO: PROYECCIÓN A 5 AÑOS
 * ============================================================================
 */

export interface ZeroCapexYearProjection {
  year: number;
  yearLabel: string;
  legacyCapex: number;
  legacyEnergyCost: number;
  legacyWaterCost: number;
  legacyEgressCost: number;
  legacyMaintenanceCost: number;
  legacyTotalCost: number;
  legacyCumulativeCost: number;
  tvs30Capex: number; // 0
  tvs30EnergyCost: number;
  tvs30WaterCost: number;
  tvs30EgressCost: number;
  tvs30MaintenanceCost: number;
  tvs30TotalCost: number;
  tvs30CumulativeCost: number;
  annualNetSavings: number;
  cumulativeNetSavings: number;
  cumulativeEnergyMWhSaved: number;
  cumulativeWaterLitersSaved: number;
  cumulativeCo2TonsAvoided: number;
}

export interface ZeroCapexSimulationParams {
  serverCount: number;
  electricityCostPerKWh: number;
  waterCostPerM3: number;
  legacyHardwareCostPerServer: number;
  monthlyTrafficTb: number;
  hardwareRefreshYear: number;
}

/**
 * ============================================================================
 * POST-QUANTUM CRYPTOGRAPHIC HEALTH & DILITHIUM-5 ROTATING KEYS (ZKP ZERO-EXPOSURE)
 * ============================================================================
 */

export type DilithiumKeyStatus = 'ACTIVE' | 'STANDBY' | 'GRACE_PERIOD' | 'ROTATING' | 'RETIRED';

export interface DilithiumRotatingKeyInfo {
  keyId: string;
  epoch: number;
  scheme: 'CRYSTALS-Dilithium-5 (ML-DSA-87)';
  publicKeyFingerprint: string; // Truncated Merkle leaf hash (never reveals private seed)
  privateKeyStatus: 'ENCLAVE_PMP_LOCKED_ZERO_EXPOSURE';
  generatedAt: string;
  expiresInSeconds: number;
  rotationIntervalSeconds: number;
  signaturesIssuedCount: number;
  maxSignaturesPerEpoch: number;
  status: DilithiumKeyStatus;
  hardwareTrapSlot: string; // e.g. "RISC-V-PMP-SLOT-00"
  merkleEpochCommitment: string;
  previousKeyEpochHash?: string;
  ratchetStep: number;
}

export interface PqcHealthMetric {
  metricId: string;
  name: string;
  category: 'LATTICE_INTEGRITY' | 'CONSTANT_TIME_NTT' | 'SIDE_CHANNEL' | 'ZKP_PRIVACY' | 'KEY_ROTATION';
  value: string;
  numericScore: number; // 0 - 100
  status: 'OPTIMAL' | 'SECURE' | 'ATTENTION';
  details: string;
  formalGuarantee: string;
}

export interface ZeroExposureZkCircuit {
  circuitId: string;
  name: string;
  fileName: string;
  provingScheme: 'Groth16 (BN254)' | 'Plonk' | 'KZG';
  constraintsCount: number;
  provingTimeMs: number;
  purpose: string;
  protectedConfidentialData: string[]; // Sensitive info hidden in private witness
  publicSignalsShared: string[]; // Only public hashes/scalars shared
  privacyGuarantee: string;
  sampleProofScalar: {
    piA: string;
    piB: string;
    piC: string;
    publicStateHash: string;
  };
}

export interface PqcThreatDefenseVector {
  id: string;
  threatName: string;
  quantumMethod: string;
  riskEvaluation: string;
  tVs30DefenseMechanism: string;
  mitigationStatus: 'TOTAL_IMMUNITY' | 'CRYPTO_AGILITY_VERIFIED' | 'HARDWARE_BLINDED';
  mathematicalMargin: string;
}
