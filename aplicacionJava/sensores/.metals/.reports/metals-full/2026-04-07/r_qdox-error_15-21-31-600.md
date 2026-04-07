error id: file:///C:/Users/carol/Desktop/PROYETOS/PROYECTO_SENSORES_FABRICA/sensores/src/main/java/com/example/sensores/repository/SensorDataRepository.java
file:///C:/Users/carol/Desktop/PROYETOS/PROYECTO_SENSORES_FABRICA/sensores/src/main/java/com/example/sensores/repository/SensorDataRepository.java
### com.thoughtworks.qdox.parser.ParseException: syntax error @[17,5]

error in qdox parser
file content:
```java
offset: 513
uri: file:///C:/Users/carol/Desktop/PROYETOS/PROYECTO_SENSORES_FABRICA/sensores/src/main/java/com/example/sensores/repository/SensorDataRepository.java
text:
```scala
package com.example.sensores.repository;

import com.example.sensores.model.SensorData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SensorDataRepository extends JpaRepository<SensorData, Integer> {

    findDistinctNodeIds()

    // ========== Búsquedas por un solo campo ==========

    // Obtener todos los datos de un nodeId específico
    L@@ist<SensorData> findByNodeId(Integer nodeId);

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
```

```



#### Error stacktrace:

```
com.thoughtworks.qdox.parser.impl.Parser.yyerror(Parser.java:2025)
	com.thoughtworks.qdox.parser.impl.Parser.yyparse(Parser.java:2147)
	com.thoughtworks.qdox.parser.impl.Parser.parse(Parser.java:2006)
	com.thoughtworks.qdox.library.SourceLibrary.parse(SourceLibrary.java:232)
	com.thoughtworks.qdox.library.SourceLibrary.parse(SourceLibrary.java:190)
	com.thoughtworks.qdox.library.SourceLibrary.addSource(SourceLibrary.java:94)
	com.thoughtworks.qdox.library.SourceLibrary.addSource(SourceLibrary.java:89)
	com.thoughtworks.qdox.library.SortedClassLibraryBuilder.addSource(SortedClassLibraryBuilder.java:162)
	com.thoughtworks.qdox.JavaProjectBuilder.addSource(JavaProjectBuilder.java:174)
	scala.meta.internal.mtags.JavaMtags.indexRoot(JavaMtags.scala:49)
	scala.meta.internal.metals.SemanticdbDefinition$.foreachWithReturnMtags(SemanticdbDefinition.scala:99)
	scala.meta.internal.metals.Indexer.indexSourceFile(Indexer.scala:560)
	scala.meta.internal.metals.Indexer.$anonfun$reindexWorkspaceSources$3(Indexer.scala:691)
	scala.meta.internal.metals.Indexer.$anonfun$reindexWorkspaceSources$3$adapted(Indexer.scala:688)
	scala.collection.IterableOnceOps.foreach(IterableOnce.scala:630)
	scala.collection.IterableOnceOps.foreach$(IterableOnce.scala:628)
	scala.collection.AbstractIterator.foreach(Iterator.scala:1313)
	scala.meta.internal.metals.Indexer.reindexWorkspaceSources(Indexer.scala:688)
	scala.meta.internal.metals.MetalsLspService.$anonfun$onChange$2(MetalsLspService.scala:940)
	scala.runtime.java8.JFunction0$mcV$sp.apply(JFunction0$mcV$sp.scala:18)
	scala.concurrent.Future$.$anonfun$apply$1(Future.scala:691)
	scala.concurrent.impl.Promise$Transformation.run(Promise.scala:500)
	java.base/java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1144)
	java.base/java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:642)
	java.base/java.lang.Thread.run(Thread.java:1583)
```
#### Short summary: 

QDox parse error in file:///C:/Users/carol/Desktop/PROYETOS/PROYECTO_SENSORES_FABRICA/sensores/src/main/java/com/example/sensores/repository/SensorDataRepository.java