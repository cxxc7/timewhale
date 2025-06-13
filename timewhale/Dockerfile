FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy everything
COPY . .

# Install deps & build
RUN npm install && npm run build

# Expose the port used by `vite preview`
EXPOSE 5173

# Run the preview server
CMD ["npx", "vite", "preview", "--host", "--port", "5173"]
