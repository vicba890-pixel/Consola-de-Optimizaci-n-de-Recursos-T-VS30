/**
 * @file tvs30.hpp
 * @brief T-VS30 Sovereign Dynamic Mesh Client Library
 * @version 1.0.0
 * 
 * Protocolo Optimizador T-VS30 para sistemas distribuidos de infraestructura crítica.
 * Arquitectura Dynamic Mesh en estado latente de consumo cero, aceleración RISC-V VMSB©,
 * enrutamiento determinista por Árbol CMST y consenso sub-milisegundo no dañino.
 * 
 * Cumplimiento: IEC 62443 SL-4, NIST SP 800-82 Rev 3, ISO 27001, NIS2 EU.
 */

#ifndef TVS30_PROTOCOL_HPP
#define TVS30_PROTOCOL_HPP

#include <cstdint>
#include <cstddef>
#include <string_view>
#include <functional>
#include <span>
#include <memory>
#include <chrono>
#include "tvs30_silicon_abi.hpp"

namespace tvs30 {

/**
 * @brief Códigos de estado y diagnóstico deterministas del protocolo T-VS30.
 */
enum class Status : int32_t {
    OK = 0,
    ERR_ALREADY_INITIALIZED = -1,
    ERR_NOT_INITIALIZED = -2,
    ERR_INVALID_CONFIGURATION = -3,
    ERR_CONNECTION_REFUSED = -4,
    ERR_TIMEOUT = -5,
    ERR_QUEUE_FULL = -6,
    ERR_CMST_NO_ROUTE = -7,
    ERR_CRYPTO_VERIFICATION_FAILED = -8,
    ERR_SAFETY_INTERVENTION = -9, // Activación de salvaguarda de no daño (IEC 62443)
    ERR_CONSENSUS_REJECTED = -10
};

/**
 * @brief Modos de operación del nodo en la malla dinámica.
 */
enum class NodeOperationMode : uint8_t {
    LATENT = 0,      ///< Modo latente: consumo cero CPU (<0.01% core), despierta por interrupción DMA/red
    ACTIVE_ROUTER = 1, ///< Modo activo de reenvío CMST y consenso continuo
    ISOLATED_EDGE = 2  ///< Nodo de borde soberano con verificación local
};

/**
 * @brief Parámetros de configuración del nodo dinámico en malla.
 */
struct NodeConfig {
    const char* node_id{ "node-mesh-local" };
    const char* cluster_hub_address{ "127.0.0.1:8930" };
    uint16_t listen_port{ 8930 };
    uint32_t ring_buffer_capacity_kb{ 4096 };      ///< Capacidad de anillo zero-copy (4MB default)
    uint32_t latent_timeout_ms{ 250 };             ///< Tiempo antes de entrar en reposo latente
    bool enable_riscv_vmsb_acceleration{ true };   ///< Habilitar micro-slice hardware trap
    bool enable_kyber_postquantum_e2ee{ true };    ///< Cifrado poscuántico Kyber-1024
    bool enable_dilithium_native_vmsb{ true };     ///< Firma CRYSTALS-Dilithium-5 (ML-DSA-87) en enclave PMP
    bool enable_universal_silicon_bridge{ true };  ///< Puente binario nativo heterogeneous (NVIDIA/Intel/AMD/TPU/AWS/Maia/MTIA/Broadcom/TSMC)
    bool enforce_non_harmful_invariant{ true };    ///< Garantía formal IEC 62443 de no daño
};

/**
 * @brief Paquete de datos transmitido con soporte Zero-Copy.
 */
struct Packet {
    uint64_t sequence_id{ 0 };
    uint64_t timestamp_ns{ 0 };
    uint32_t payload_size{ 0 };
    const uint8_t* payload{ nullptr };
    uint8_t flags{ 0 };                          ///< Bit 0: Consenso, Bit 1: CMST Sync, Bit 2: Urgente
    uint8_t merkle_digest[32]{ 0 };              ///< Firma SHA-256 / Circom ZK hash
};

/**
 * @brief Voto de consenso distribuido ultra-rápido.
 */
struct ConsensusProposal {
    uint64_t round_id{ 0 };
    uint32_t epoch{ 0 };
    uint8_t state_merkle_root[32]{ 0 };
    bool approve{ true };
};

/**
 * @brief Métricas de telemetría de microsegundos del nodo en malla.
 */
struct NodeMetrics {
    double latency_p50_us{ 0.0 };       ///< Latencia mediana en microsegundos
    double latency_p99_us{ 0.0 };       ///< Latencia percentil 99
    uint64_t packets_sent{ 0 };
    uint64_t packets_received{ 0 };
    uint64_t zero_copy_bytes{ 0 };
    double current_pue_estimated{ 1.07 };
    double vmsb_core_hit_rate{ 99.8 };
    bool in_latent_standby{ false };
};

// Callback para recepción de datos en cero copias
using PacketReceivedCallback = std::function<void(const Packet& packet)>;

// Callback para solicitudes de votación de consenso
using ConsensusVoteCallback = std::function<bool(const ConsensusProposal& proposal)>;

/**
 * @class DynamicMeshClient
 * @brief Cliente C++23 universal para integración nativa de nodos en el protocolo T-VS30.
 */
class DynamicMeshClient {
public:
    DynamicMeshClient();
    ~DynamicMeshClient();

    // No copiable para garantizar seguridad de buffers zero-copy
    DynamicMeshClient(const DynamicMeshClient&) = delete;
    DynamicMeshClient& operator=(const DynamicMeshClient&) = delete;

    // Movible
    DynamicMeshClient(DynamicMeshClient&&) noexcept;
    DynamicMeshClient& operator=(DynamicMeshClient&&) noexcept;

    /**
     * @brief Inicializa el cliente de malla y reserva buffers lock-free en memoria.
     * @param config Configuración del nodo.
     * @return Status::OK o código de error correspondiente.
     */
    Status init(const NodeConfig& config);

    /**
     * @brief Conecta el nodo al clúster soberano más cercano y sincroniza la topología CMST.
     * Permanece en forma latente si no hay tráfico activo.
     */
    Status connect_mesh();

    /**
     * @brief Desconecta el nodo limpiamente sin alterar la integridad del clúster (failover transparente).
     */
    Status disconnect();

    /**
     * @brief Envía datos a través del árbol CMST con latencia mínima (< 0.20 ms) en zero-copy.
     * @param data Buffer de datos a enviar.
     * @param urgent Bandera de prioridad de alta tolerancia a fallos.
     */
    Status send_zerocopy(std::span<const uint8_t> data, bool urgent = false);

    /**
     * @brief Registra el manejador de eventos para recepción de paquetes.
     */
    Status set_receive_callback(PacketReceivedCallback cb);

    /**
     * @brief Registra el manejador para participar en la ronda de consenso distribuido sin intermediarios.
     */
    Status set_consensus_callback(ConsensusVoteCallback cb);

    /**
     * @brief Emite un voto en la ronda de consenso distribuido actual.
     * @param round_id Identificador de la ronda.
     * @param approve true para aprobar el bloque de estado de red.
     */
    Status vote_consensus(uint64_t round_id, bool approve);

    /**
     * @brief Pone al cliente manualmente en modo latente (zero CPU) hasta nuevo paquete.
     */
    Status enter_latent_mode();

    /**
     * @brief Obtiene la telemetría del nodo en tiempo real.
     */
    NodeMetrics get_metrics() const;

    /**
     * @brief Comprueba si el nodo está actualmente activo o en modo latente.
     */
    bool is_latent() const;

private:
    class Impl;
    std::unique_ptr<Impl> pimpl_;
};

} // namespace tvs30

#endif // TVS30_PROTOCOL_HPP
