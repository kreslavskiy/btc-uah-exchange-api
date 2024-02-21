FROM node:18.10.0 as dependencies
WORKDIR /app
COPY package.json package-lock.json prisma/ ./
RUN npm ci

FROM node:18.10.0 as builder
WORKDIR /app
COPY . .
COPY prisma/ ./prisma
COPY --from=dependencies /app/node_modules ./node_modules
RUN npx prisma generate
RUN npm run build


FROM node:18.10.0
COPY --from=builder /app/node_modules ./app/node_modules
COPY --from=builder /app/dist ./app/dist
COPY --from=builder /app/package.json ./app
COPY --from=builder /app/.env ./app
COPY --from=builder /app/prisma ./app/prisma

ENV PORT=3000
ENV HOST=0.0.0.0

WORKDIR /app

EXPOSE 3000
CMD sh -c "npx prisma migrate deploy && npx prisma db seed && npm run start:prod"
