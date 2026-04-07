package com.example.sensores.service;

import java.time.LocalDateTime;
import java.util.List;

import com.example.sensores.model.SensorData;

public interface SensorService {

    //Obtener todos los sensores
    Iterable<SensorData> findAll();

    //Guardar informacion 
    SensorData save(SensorData sensorData);

    List<Integer> findDistinctNodeIds();

    // ========== Búsquedas por un solo campo ==========

    // Obtener todos los datos de un nodeId específico
    List<SensorData> findByNodeId(Integer nodeId);

    // Obtener datos por temperatura exacta
    List<SensorData> findByTemperature(Float temperature);

    // Obtener datos por humedad exacta
    List<SensorData> findByHumidity(Float humidity);

    // Obtener datos por presión exacta
    List<SensorData> findByPressure(Float pressure);

    // Obtener datos por altitud exacta
    List<SensorData> findByAltitude(Float altitude);

    // Obtener datos por timestamp exacto
    List<SensorData> findByTimestamp(LocalDateTime timestamp);

    // ========== Búsquedas con operadores de comparación ==========

    // Temperatura mayor que un valor
    List<SensorData> findByTemperatureGreaterThan(Float temperature);

    // Temperatura menor que un valor
    List<SensorData> findByTemperatureLessThan(Float temperature);

    // Humedad mayor que
    List<SensorData> findByHumidityGreaterThan(Float humidity);

    // Humedad menor que
    List<SensorData> findByHumidityLessThan(Float humidity);

    // Presión mayor que
    List<SensorData> findByPressureGreaterThan(Float pressure);

    // Presión menor que
    List<SensorData> findByPressureLessThan(Float pressure);

    // Altitud mayor que
    List<SensorData> findByAltitudeGreaterThan(Float altitude);

    // Altitud menor que
    List<SensorData> findByAltitudeLessThan(Float altitude);

    // ========== Búsquedas por rango de fechas ==========

    // Datos entre dos fechas (inclusive)
    List<SensorData> findByTimestampBetween(LocalDateTime start, LocalDateTime end);

    // Datos posteriores a una fecha
    List<SensorData> findByTimestampAfter(LocalDateTime date);

    // Datos anteriores a una fecha
    List<SensorData> findByTimestampBefore(LocalDateTime date);

    // ========== Búsquedas combinadas (And/Or) ==========

    // Datos de un nodeId en un rango de fechas
    List<SensorData> findByNodeIdAndTimestampBetween(Integer nodeId, LocalDateTime start, LocalDateTime end);

    // Datos de un nodeId con temperatura mayor que
    List<SensorData> findByNodeIdAndTemperatureGreaterThan(Integer nodeId, Float temperature);

    // Datos de un nodeId con humedad mayor que
    List<SensorData> findByNodeIdAndHumidityGreaterThan(Integer nodeId, Float humidity);

    // Datos de un nodeId con presión mayor que
    List<SensorData> findByNodeIdAndPressureGreaterThan(Integer nodeId, Float pressure);

    // Datos con temperatura y humedad específicas (puede ser útil para buscar condiciones exactas)
    List<SensorData> findByTemperatureAndHumidity(Float temperature, Float humidity);

    // Datos con temperatura mayor que y humedad menor que
    List<SensorData> findByTemperatureGreaterThanAndHumidityLessThan(Float tempMin, Float humMax);

    // ========== Ordenación (por defecto ascendente o descendente) ==========

    // Obtener datos de un nodeId ordenados por timestamp descendente (los más recientes primero)
    List<SensorData> findByNodeIdOrderByTimestampDesc(Integer nodeId);

    // Obtener datos de un nodeId en un rango de fechas ordenados por timestamp ascendente
    List<SensorData> findByNodeIdAndTimestampBetweenOrderByTimestampAsc(Integer nodeId, LocalDateTime start, LocalDateTime end);

    // Último registro de un nodeId (usando orden descendente y limitando a 1)
    // Nota: Para limitar a 1, usamos `Top` o `First`
    SensorData findFirstByNodeIdOrderByTimestampDesc(Integer nodeId);

    // Últimos N registros de un nodeId
    List<SensorData> findTop10ByNodeIdOrderByTimestampDesc(Integer nodeId);

    // Último registro de toda la tabla
    SensorData findFirstByOrderByTimestampDesc();
    
}
