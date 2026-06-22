package com.example.sensores.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import com.example.sensores.model.Esp32Slave;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Esp32SlaveDTO {
    private Integer id;
    private String nodeStatus;
    private LocalDateTime lastSeen;
    private LocalDateTime installationDate;

    // Relación con Master
    private Integer masterId;
    private String masterMac;   // opcional, para mostrar en frontend

    // Relación con Plot
    private Long plotId;
    private String plotName;    // opcional, para mostrar

    // Constructor desde entidad (conveniente para mapear)
    public Esp32SlaveDTO(Esp32Slave slave) {
        this.id = slave.getId();
        this.nodeStatus = slave.getNodeStatus();
        this.lastSeen = slave.getLastSeen();
        this.installationDate = slave.getInstallationDate();

        if (slave.getMaster() != null) {
            this.masterId = slave.getMaster().getId();
            this.masterMac = slave.getMaster().getMac();
        }

        if (slave.getPlot() != null) {
            this.plotId = slave.getPlot().getId();
            this.plotName = slave.getPlot().getName();
        }
    }
}
