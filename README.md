# Calomeni & Associates, LLC - Astro Hybrid CMS

Este es el sitio web y CMS híbrido de **Calomeni & Associates, LLC** (Firma de abogados desde 1980), construido sobre el framework moderno **Astro**, utilizando **SQLite** como base de datos y **Drizzle ORM** para el modelado de datos.

## 🚀 Arquitectura y Tecnologías
- **Core**: Astro (Modo Node Standalone / Híbrido)
- **Base de Datos**: SQLite (`local.db`)
- **Modelado / ORM**: Drizzle ORM & Drizzle Kit
- **Estilos**: Vanilla CSS con la paleta de colores original (Azul Marino Corporativo `#0f3a62`, dorado, blanco y gris)
- **CMS Interno**: Editor visual TipTap integrado para modificación dinámica de páginas

---

## 💻 Desarrollo Local

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Ejecutar en desarrollo** (con el servidor de desarrollo en segundo plano según reglas del proyecto):
   ```bash
   npm run dev
   ```

3. **Compilar para producción**:
   ```bash
   npm run build
   ```

---

## 🐳 Despliegue en Easypanel

Este repositorio está preparado con un `Dockerfile` optimizado y un script de inicio para que el despliegue en **Easypanel** (o cualquier panel basado en Docker) sea directo y automático.

### Pasos para desplegar:

1. **Crear Servicio en Easypanel**:
   - Crea un nuevo servicio tipo **App**.
   - Conecta el repositorio de GitHub: `https://github.com/Nelocode/calomeni.git`
   - Rama: `main` (o la que utilices por defecto).

2. **Configurar Puerto**:
   - Configura el puerto expuesto del contenedor en Easypanel como **`4321`**.

3. **Configurar un Volumen Persistente (CRÍTICO para SQLite)**:
   - Dado que la base de datos de páginas está en SQLite, para evitar que se borren los cambios del CMS cuando se reinicie el contenedor, debes crear un volumen persistente.
   - En la pestaña **Volumes** de tu App en Easypanel, agrega uno con:
     - **Path en el contenedor**: `/app/data`

4. **Configurar Variables de Entorno (Environment Variables)**:
   - En la pestaña **Env** de Easypanel, agrega las siguientes variables de entorno:
     - `DATABASE_URL`: `file:/app/data/local.db` (Apunta la base de datos al volumen persistente).
     - `PORT`: `4321`
     - `HOST`: `0.0.0.0` (Requerido para que el contenedor escuche conexiones externas).

### ⚙️ Inicialización Automática de Base de Datos
El proyecto cuenta con un script de inicio (`scripts/start-server.js`) que se ejecuta al levantar el contenedor:
* Si el volumen `/app/data/` está vacío (primer despliegue), **el script copiará automáticamente** la base de datos pre-cargada con el contenido scraped y adaptado al inglés de la firma desde la raíz del proyecto hacia `/app/data/local.db`.
* En reinicios posteriores, utilizará la base de datos del volumen persistente, conservando todos los cambios y ediciones realizados desde el editor visual del CMS.
