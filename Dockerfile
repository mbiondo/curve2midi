FROM node:20

# Instala FluidSynth y FFmpeg
RUN apt-get update && \
    apt-get install -y fluidsynth ffmpeg && \
    rm -rf /var/lib/apt/lists/*

# Crea directorio de trabajo
WORKDIR /app

# Copia package.json y package-lock.json
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia el resto del código
COPY . .

# Crea carpeta de salida para los archivos generados
RUN mkdir -p output

# Expone el directorio de salida como volumen (opcional)
VOLUME ["/app/output"]

# Comando por defecto: build y ejecuta la app principal
RUN npm run build

CMD ["npm", "run", "start"]
