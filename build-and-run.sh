#!/bin/bash

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOL
# API Configuration (Server-side only - not exposed to frontend)
API_KEY=sk-UewQx0oIiesvSVAGCuqSYZVlkGwiYnwLXJ4pVqlTUxj8DS6E
API_URL=https://api.chatanywhere.tech/v1/chat/completions

# Frontend Configuration
VITE_DEFAULT_MODEL=gpt-3.5-turbo
VITE_DEFAULT_MAX_TOKENS=4096
VITE_MODELS=gpt-3.5-turbo:GPT-3.5,gpt-4:GPT-4,gpt-4-turbo:GPT-4 Turbo

# Server Configuration
PORT=3000
NODE_ENV=production
EOL
    echo "Please edit the .env file to add your API key before continuing."
    exit 1
fi

# Build the Docker image
echo "Building Docker image..."
docker build -t yourchat .

# Run the container
echo "Starting YourChat container..."
docker run -d \
  --name yourchat \
  -p 3000:3000 \
  --env-file .env \
  --restart unless-stopped \
  yourchat

echo "YourChat is now running at http://localhost:3000" 