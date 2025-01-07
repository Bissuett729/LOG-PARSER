const chokidar = require("chokidar");
const path = require("path");
const fs = require("fs");
const { processLog } = require("./logProcessor");

const logsDirectory = path.join(__dirname, "logs");

// Verifica si la carpeta existe, si no, la crea
if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory);
}

// Número máximo de archivos a procesar al mismo tiempo
const MAX_CONCURRENT_PROCESSES = 5;
let currentProcessingCount = 0;

// Cola de archivos pendientes de procesamiento
const filesQueue = [];

// Función para procesar los archivos de la cola
const processQueue = async () => {
  if (currentProcessingCount >= MAX_CONCURRENT_PROCESSES || filesQueue.length === 0) {
    return;
  }

  const filePath = filesQueue.shift(); // Extrae el primer archivo de la cola
  currentProcessingCount++;

  console.log();
  console.log();
  console.log('=====================================');
  console.log();
  console.log(`Procesando archivo: ${filePath}`);

  // Lee y procesa el archivo
  try {
    const data = await fs.promises.readFile(filePath, "utf8");
    processLog(data);
  } catch (err) {
    console.error(`Error al leer el archivo ${filePath}:`, err);
  }

  currentProcessingCount--;
  // Procesa el siguiente archivo de la cola
  processQueue();
};

// Configurar el watcher
const watcher = chokidar.watch(logsDirectory, {
  persistent: true,
  ignoreInitial: true, // Ignora archivos existentes al iniciar
  awaitWriteFinish: {
    stabilityThreshold: 100,
    pollInterval: 50,
  },
});

// Evento cuando se agrega un archivo nuevo
watcher.on("add", (filePath) => {
  console.log(`Nuevo archivo detectado: ${filePath}`);

  // Verificar si el archivo tiene la extensión .log
  if (path.extname(filePath) === ".log") {
    // Agregar el archivo a la cola para procesarlo
    filesQueue.push(filePath);
    processQueue(); // Procesar la cola
  } else {
    console.log(`Archivo ignorado: ${filePath} (No es un .log)`);
  }
});