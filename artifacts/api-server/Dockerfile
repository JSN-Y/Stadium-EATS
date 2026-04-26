FROM node:22-alpine
WORKDIR /app
COPY dist ./dist
COPY ../stadium-eats/dist/public ./stadium-eats/dist/public
EXPOSE 3000
CMD ["node", "dist/index.mjs"]