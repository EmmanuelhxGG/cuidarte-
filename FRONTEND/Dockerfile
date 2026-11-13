FROM node:24.15.0-alpine AS builder
WORKDIR /app
ARG VITE_API_URL=http://localhost:4445
COPY package.json package-lock.json ./
RUN npm ci && npm cache clean --force
COPY . .
RUN VITE_API_URL="$VITE_API_URL" npm run build

FROM nginx:1.28.0-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
