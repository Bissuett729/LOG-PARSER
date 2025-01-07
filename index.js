import chokidar from 'chokidar'
import path from 'path'
import fs from "fs"
import { processLog } from './logProcessor.js';
const __dirname = path.dirname(new URL(import.meta.url).pathname)
import chalk from "chalk";

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

  // Mostrar mensaje con formato
  console.log(chalk.yellow("\n====================================="));
  console.log(chalk.blue(`\nPROCESANDO ARCHIVO: ${filePath}`));

  // Lee y procesa el archivo
  try {
    const data = await fs.promises.readFile(filePath, "utf8");
    const { finalStatuses, startTimes, endTimes } = processLog(data);

    // Mostrar resultados con formato
    console.log(chalk.yellow("\nVARIABLES OBTENIDAS:"));
    finalStatuses.forEach((status, index) => {
      console.log(chalk.cyan(`- FINAL STATUS ${index + 1}: ${status}`));
    });
    startTimes.forEach((time, index) => {
      console.log(chalk.cyan(`- START TIME ${index + 1}: ${time}`));
    });
    endTimes.forEach((time, index) => {
      console.log(chalk.cyan(`- FINAL TIME ${index + 1}: ${time}`));
    });
    console.log(chalk.yellow("\n====================================="));
    
  } catch (err) {
    console.error(chalk.red(`Error al leer el archivo ${filePath}:`, err));
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
  console.log(chalk.green(`\nNUEVO ARCHIVO DETECTADO: ${filePath}`));

  // Verificar si el archivo tiene la extensión .log
  if (path.extname(filePath) === ".log") {
    // Agregar el archivo a la cola para procesarlo
    filesQueue.push(filePath);
    processQueue(); // Procesar la cola
  } else {
    console.log(chalk.red(`Archivo ignorado: ${filePath} (No es un .log)`));
  }
});

