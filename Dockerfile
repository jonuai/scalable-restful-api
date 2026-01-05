FROM node:20-alpine
WORKDIR /app
COPY package*.json .
RUN npm ci --only=production
COPY server.js ./
EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000
USER node
CMD ["node" , "server.js"]
