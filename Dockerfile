FROM node:22.12.0-alpine 
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD sh -c "npx prisma migrate deploy && npx prisma db seed && node dist/src/main.js"
