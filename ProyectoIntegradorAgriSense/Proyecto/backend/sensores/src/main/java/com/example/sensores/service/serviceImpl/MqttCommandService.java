package com.example.sensores.service.serviceImpl;

import org.eclipse.paho.client.mqttv3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;

@Service
public class MqttCommandService {

    @Value("${mqtt.broker.url}")
    private String brokerUrl;

    @Value("${mqtt.client.id}")
    private String clientId;

    @Value("${mqtt.topic.commands}")
    private String commandTopic;

    private MqttClient client;

    @PostConstruct
    public void connect() throws MqttException {
        client = new MqttClient(brokerUrl, clientId + "-pub");
        MqttConnectOptions options = new MqttConnectOptions();
        options.setCleanSession(true);
        options.setAutomaticReconnect(true);
        client.connect(options);
    }

    // nodeId = null → comando a TODOS los nodos
    public void sendCommand(Integer nodeId, String command) throws MqttException {
        String topic = nodeId == null
            ? commandTopic + "/all"
            : commandTopic + "/" + nodeId;

        MqttMessage message = new MqttMessage(command.getBytes());
        message.setQos(1);
        message.setRetained(true); // retained = el broker guarda el último estado
        client.publish(topic, message);
    }

    @PreDestroy
    public void disconnect() throws MqttException {
        if (client != null && client.isConnected()) client.disconnect();
    }
    
}
