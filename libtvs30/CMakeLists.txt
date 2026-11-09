cmake_minimum_required(VERSION 3.20)
project(tvs30_protocol_mesh VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 23)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_POSITION_INDEPENDENT_CODE ON)

# Compilador y optimizaciones para ultra-baja latencia
if(CMAKE_CXX_COMPILER_ID MATCHES "GNU|Clang")
    add_compile_options(-O3 -march=native -Wall -Wextra -Wpedantic -pthread)
endif()

# Librería Dinámica MESH (libtvs30_mesh.so)
add_library(tvs30_mesh SHARED
    src/tvs30.cpp
)

target_include_directories(tvs30_mesh PUBLIC
    $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}/include>
    $<INSTALL_INTERFACE:include>
)

target_link_libraries(tvs30_mesh PUBLIC
    pthread
)

# Ejemplo de uso
add_executable(mesh_node_worker
    examples/mesh_node_worker.cpp
)

target_link_libraries(mesh_node_worker PRIVATE
    tvs30_mesh
)

# Instalación
install(TARGETS tvs30_mesh
    LIBRARY DESTINATION lib
    ARCHIVE DESTINATION lib
    RUNTIME DESTINATION bin
)

install(DIRECTORY include/tvs30 DESTINATION include)
