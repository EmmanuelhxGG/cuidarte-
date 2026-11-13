FROM node:latest
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --chown=node:node src/ ./src/
RUN mkdir -p uploads/documentos && chown -R node:node uploads
USER node
EXPOSE 4000
CMD ["node", "src/app.js"]
