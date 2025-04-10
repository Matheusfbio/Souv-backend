FROM node:18

WORKDIR /app

# Copia o package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia todo o conteúdo do diretório local para dentro do diretório de trabalho
COPY . .

EXPOSE 3000

# Comando para iniciar o servidor
CMD ["npm", "start"]
