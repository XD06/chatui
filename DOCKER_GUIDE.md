# YourChat Docker Deployment Guide

This guide explains how to build and run YourChat in a Docker container, which enables testing of the backend API proxy functionality.

## Prerequisites

- [Docker](https://www.docker.com/get-started) installed on your system
- An API key from OpenAI or a compatible API provider

## Quick Start

### Using the provided scripts

1. For Linux/macOS:
   ```bash
   chmod +x build-and-run.sh
   ./build-and-run.sh
   ```

2. For Windows:
   ```
   build-and-run.bat
   ```

3. Edit the generated `.env` file to add your API key, then run the script again.

### Manual Setup

1. Create a `.env` file in the project root with the following content:
   ```
   # API Configuration (Server-side only - not exposed to frontend)
   API_KEY=your_api_key_here
   API_URL=https://api.openai.com/v1/chat/completions

   # Frontend Configuration
   VITE_DEFAULT_MODEL=gpt-3.5-turbo
   VITE_DEFAULT_MAX_TOKENS=4096
   VITE_MODELS=gpt-3.5-turbo:GPT-3.5,gpt-4:GPT-4,gpt-4-turbo:GPT-4 Turbo

   # Server Configuration
   PORT=3000
   NODE_ENV=production
   ```

2. Build the Docker image:
   ```bash
   docker build -t yourchat .
   ```

3. Run the container:
   ```bash
   docker run -d --name yourchat -p 3000:3000 --env-file .env --restart unless-stopped yourchat
   ```

4. Access the application at http://localhost:3000

## Testing Backend Functionality

With the Docker container running:

1. The backend API proxy will handle all requests securely using the API key from your `.env` file
2. API calls will be made from the server, protecting your API key
3. Test the chat functionality, model selection, and prompt optimization features
4. Message regeneration and other features will use the backend API

## Managing the Container

- View container logs:
  ```bash
  docker logs yourchat
  ```

- Stop the container:
  ```bash
  docker stop yourchat
  ```

- Remove the container:
  ```bash
  docker rm yourchat
  ```

- Remove the image:
  ```bash
  docker rmi yourchat
  ```

## Troubleshooting

- If you're having connection issues, ensure the API_URL in the `.env` file is correct
- Make sure your API key has permission to access the models specified in VITE_MODELS
- Check the container logs for any error messages:
  ```bash
  docker logs yourchat
  ```

## Using Docker Compose

Alternatively, you can use the provided `docker-compose.yml` file:

```bash
docker-compose up -d
```

For production use:

```bash
docker-compose -f docker-compose.prod.yml up -d
``` 