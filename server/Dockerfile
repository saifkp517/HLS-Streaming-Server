FROM node:latest
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
RUN npx prisma generate
COPY . .
CMD ["npm", "run", "dev"]