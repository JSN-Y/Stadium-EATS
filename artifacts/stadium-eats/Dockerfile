FROM node:22-alpine
RUN npm install -g serve
WORKDIR /app
COPY dist/public ./dist/public
EXPOSE 8080
CMD ["serve", "dist/public", "-p", "8080"]