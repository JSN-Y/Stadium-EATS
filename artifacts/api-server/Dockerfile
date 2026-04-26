FROM node:22-alpine
WORKDIR /app
COPY dist ./dist
COPY frontend-dist ./frontend-dist
EXPOSE 3000
CMD ["node", "dist/index.mjs"]