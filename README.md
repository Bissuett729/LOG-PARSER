# Log Parser

Este proyecto es un *parseador de logs* en Node.js que monitorea una carpeta en busca de nuevos archivos .log, lee su contenido, y extrae información relevante de las líneas que coincidan con un patrón específico. La aplicación está diseñada para manejar grandes volúmenes de logs, procesando múltiples archivos a la vez sin perder ningún dato.

## Características

- Monitoreo en tiempo real de archivos .log dentro de una carpeta específica.
- Capacidad de procesar múltiples archivos simultáneamente con control de concurrencia.
- Extracción de información relevante de los logs mediante expresiones regulares.
- Utilización de una cola para asegurar que todos los logs sean procesados, incluso cuando se agregan muchos archivos al mismo tiempo.
- Lectura asíncrona para mejorar el rendimiento.

## Requisitos

- Node.js (versión recomendada: 16.x o superior).
- npm (gestor de paquetes de Node.js).

## Instalación

1. *Clona el repositorio*:

   ```bash
   git clone https://github.com/Bissuett729/LOG-PARSER.git
   cd log-parser