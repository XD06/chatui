@echo off
setlocal enabledelayedexpansion

REM Check if .env file exists
if not exist .env (
    echo Creating .env file...
    (
        echo # API Configuration (Server-side only - not exposed to frontend^)
        echo API_KEY=your_api_key_here
        echo API_URL=https://api.openai.com/v1/chat/completions
        echo.
        echo # Frontend Configuration
        echo VITE_DEFAULT_MODEL=gpt-3.5-turbo
        echo VITE_DEFAULT_MAX_TOKENS=4096
        echo VITE_MODELS=gpt-3.5-turbo:GPT-3.5,gpt-4:GPT-4,gpt-4-turbo:GPT-4 Turbo
        echo.
        echo # Server Configuration
        echo PORT=3000
        echo NODE_ENV=production
    ) > .env
    echo Please edit the .env file to add your API key before continuing.
    exit /b 1
)

REM Build the Docker image
echo Building Docker image...
docker build -t yourchat .

REM Run the container
echo Starting YourChat container...
docker run -d ^
  --name yourchat ^
  -p 3000:3000 ^
  --env-file .env ^
  --restart unless-stopped ^
  yourchat

echo YourChat is now running at http://localhost:3000 