package com.example.sensores.service.serviceImpl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.sensores.dto.Esp32SlaveDTO;
import com.example.sensores.model.Esp32Slave;
import com.example.sensores.model.Plot;
import com.example.sensores.repository.Esp32SlaveRepository;
import com.example.sensores.repository.PlotRepository;
import com.example.sensores.service.Esp32SlaveService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class Esp32SlaveServiceImpl implements Esp32SlaveService {

    private final Esp32SlaveRepository slaveRepo;

    private final PlotRepository plotRepository;

    @Override
    public List<Esp32SlaveDTO> getSlavesByMaster(Integer masterId) {
        return slaveRepo.findByMaster_Id(masterId)
        .stream()
            .map(Esp32SlaveDTO::new)
            .collect(Collectors.toList());
    }

    @Override
    public List<Esp32SlaveDTO> getAvailableSlaves() {
        // Esclavos sin plot asignado (plot_id IS NULL) y activos
        return slaveRepo.findByPlotIsNullAndNodeStatus("activo")
        .stream()
            .map(Esp32SlaveDTO::new)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public Esp32SlaveDTO assignSlaveToPlot(Integer slaveId, Long plotId) {
        Esp32Slave slave = slaveRepo.findById(slaveId)
                .orElseThrow(() -> new EntityNotFoundException("Esclavo no encontrado: " + slaveId));
        Plot plot = plotRepository.findById(plotId)
                .orElseThrow(() -> new EntityNotFoundException("Plot no encontrado: " + plotId));
        slave.setPlot(plot);
        Esp32Slave saved = slaveRepo.save(slave);
        return new Esp32SlaveDTO(saved);
    }

    @Override
    public List<Esp32SlaveDTO> getSlavesByPlot(Long plotId) {
        return slaveRepo.findByPlotId(plotId)
                .stream()
                .map(Esp32SlaveDTO::new)
                .collect(Collectors.toList());
    }
}
