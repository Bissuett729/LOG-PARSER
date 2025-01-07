module.exports.processLog = (logContent) => {
    // Expresiones regulares para capturar información
    const finalStatusRegex = /Final status:\s*(.+)/g;
    const startTimeRegex = /Start time\s*:\s*(.+)/g;
    const endTimeRegex = /End time\s*:\s*(.+)/g;
  
    const finalStatuses = [];
    const startTimes = [];
    const endTimes = [];
  
    let match;
  
    // Buscar coincidencias de "Final status"
    while ((match = finalStatusRegex.exec(logContent)) !== null) {
      finalStatuses.push(match[1]); // Captura solo el contenido después de "Final status:"
    }
  
    // Buscar coincidencias de "Start time"
    while ((match = startTimeRegex.exec(logContent)) !== null) {
      startTimes.push(match[1]); // Captura solo el contenido después de "Start time"
    }
  
    // Buscar coincidencias de "End time"
    while ((match = endTimeRegex.exec(logContent)) !== null) {
      endTimes.push(match[1]); // Captura solo el contenido después de "End time"
    }
  
    // Mostrar resultados
    console.log('Estados finales encontrados:');
    finalStatuses.forEach((status, index) => {
      console.log(`${index + 1}: ${status}`);
    });
  
    console.log('\nTiempos de inicio encontrados:');
    startTimes.forEach((time, index) => {
      console.log(`${index + 1}: ${time}`);
    });
  
    console.log('\nTiempos de fin encontrados:');
    endTimes.forEach((time, index) => {
      console.log(`${index + 1}: ${time}`);
    });

    console.log();
    console.log('=====================================');
    console.log();
    console.log();
  
    // Retornar los resultados en caso de querer usarlos en otra parte del código
    return { finalStatuses, startTimes, endTimes };
  };