package com.example.sensores.service;

import java.util.List;

import com.example.sensores.dto.Esp32SlaveDTO;
import com.example.sensores.model.Esp32Slave;

public interface Esp32SlaveService {

    public List<Esp32SlaveDTO>  getSlavesByMaster(Integer masterId);
    List<Esp32SlaveDTO> getAvailableSlaves();
    Esp32SlaveDTO  assignSlaveToPlot(Integer slaveId, Long plotId);
    List<Esp32SlaveDTO> getSlavesByPlot(Long plotId);
    
}
