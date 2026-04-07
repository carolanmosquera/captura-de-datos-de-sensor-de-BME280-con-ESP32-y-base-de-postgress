package com.example.sensores.service.serviceImpl;

import com.example.sensores.model.SensorData;
import com.example.sensores.repository.SensorDataRepository;
import com.example.sensores.service.SensorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SensorServiceImp implements SensorService {

    private final SensorDataRepository sensorDataRepository;

    @Override
    public SensorData save(SensorData sensorData) {
        return sensorDataRepository.save(sensorData);
    }

    @Override
    public Iterable<SensorData> findAll() {
        return sensorDataRepository.findAll();
    }

    @Override
    public List<SensorData> findByNodeId(Integer nodeId) {
        return sensorDataRepository.findByNodeId(nodeId);
    }

    @Override
    public List<SensorData> findByTemperature(Float temperature) {
        return sensorDataRepository.findByTemperature(temperature);
    }

    @Override
    public List<SensorData> findByHumidity(Float humidity) {
        return sensorDataRepository.findByHumidity(humidity);
    }

    @Override
    public List<SensorData> findByPressure(Float pressure) {
        return sensorDataRepository.findByPressure(pressure);
    }

    @Override
    public List<SensorData> findByAltitude(Float altitude) {
        return sensorDataRepository.findByAltitude(altitude);
    }

    @Override
    public List<SensorData> findByTimestamp(LocalDateTime timestamp) {
        return sensorDataRepository.findByTimestamp(timestamp);
    }

    @Override
    public List<SensorData> findByTemperatureGreaterThan(Float temperature) {
        return sensorDataRepository.findByTemperatureGreaterThan(temperature);
    }

    @Override
    public List<SensorData> findByTemperatureLessThan(Float temperature) {
        return sensorDataRepository.findByTemperatureLessThan(temperature);
    }

    @Override
    public List<SensorData> findByHumidityGreaterThan(Float humidity) {
        return sensorDataRepository.findByHumidityGreaterThan(humidity);
    }

    @Override
    public List<SensorData> findByHumidityLessThan(Float humidity) {
        return sensorDataRepository.findByHumidityLessThan(humidity);
    }

    @Override
    public List<SensorData> findByPressureGreaterThan(Float pressure) {
        return sensorDataRepository.findByPressureGreaterThan(pressure);
    }

    @Override
    public List<SensorData> findByPressureLessThan(Float pressure) {
        return sensorDataRepository.findByPressureLessThan(pressure);
    }

    @Override
    public List<SensorData> findByAltitudeGreaterThan(Float altitude) {
        return sensorDataRepository.findByAltitudeGreaterThan(altitude);
    }

    @Override
    public List<SensorData> findByAltitudeLessThan(Float altitude) {
        return sensorDataRepository.findByAltitudeLessThan(altitude);
    }

    @Override
    public List<SensorData> findByTimestampBetween(LocalDateTime start, LocalDateTime end) {
        return sensorDataRepository.findByTimestampBetween(start, end);
    }

    @Override
    public List<SensorData> findByTimestampAfter(LocalDateTime date) {
        return sensorDataRepository.findByTimestampAfter(date);
    }

    @Override
    public List<SensorData> findByTimestampBefore(LocalDateTime date) {
        return sensorDataRepository.findByTimestampBefore(date);
    }

    @Override
    public List<SensorData> findByNodeIdAndTimestampBetween(Integer nodeId, LocalDateTime start, LocalDateTime end) {
        return sensorDataRepository.findByNodeIdAndTimestampBetween(nodeId, start, end);
    }

    @Override
    public List<SensorData> findByNodeIdAndTemperatureGreaterThan(Integer nodeId, Float temperature) {
        return sensorDataRepository.findByNodeIdAndTemperatureGreaterThan(nodeId, temperature);
    }

    @Override
    public List<SensorData> findByNodeIdAndHumidityGreaterThan(Integer nodeId, Float humidity) {
        return sensorDataRepository.findByNodeIdAndHumidityGreaterThan(nodeId, humidity);
    }

    @Override
    public List<SensorData> findByNodeIdAndPressureGreaterThan(Integer nodeId, Float pressure) {
        return sensorDataRepository.findByNodeIdAndPressureGreaterThan(nodeId, pressure);
    }

    @Override
    public List<SensorData> findByTemperatureAndHumidity(Float temperature, Float humidity) {
        return sensorDataRepository.findByTemperatureAndHumidity(temperature, humidity);
    }

    @Override
    public List<SensorData> findByTemperatureGreaterThanAndHumidityLessThan(Float tempMin, Float humMax) {
        return sensorDataRepository.findByTemperatureGreaterThanAndHumidityLessThan(tempMin, humMax);
    }

    @Override
    public List<SensorData> findByNodeIdOrderByTimestampDesc(Integer nodeId) {
        return sensorDataRepository.findByNodeIdOrderByTimestampDesc(nodeId);
    }

    @Override
    public List<SensorData> findByNodeIdAndTimestampBetweenOrderByTimestampAsc(Integer nodeId, LocalDateTime start, LocalDateTime end) {
        return sensorDataRepository.findByNodeIdAndTimestampBetweenOrderByTimestampAsc(nodeId, start, end);
    }

    @Override
    public SensorData findFirstByNodeIdOrderByTimestampDesc(Integer nodeId) {
        return sensorDataRepository.findFirstByNodeIdOrderByTimestampDesc(nodeId);
    }

    @Override
    public List<SensorData> findTop10ByNodeIdOrderByTimestampDesc(Integer nodeId) {
        return sensorDataRepository.findTop10ByNodeIdOrderByTimestampDesc(nodeId);
    }

    @Override
    public SensorData findFirstByOrderByTimestampDesc() {
        return sensorDataRepository.findFirstByOrderByTimestampDesc();
    }

    @Override
    public List<Integer> findDistinctNodeIds() {
        return sensorDataRepository.findDistinctNodeIds();
    }
}