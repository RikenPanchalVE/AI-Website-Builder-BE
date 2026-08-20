# AI Website Builder - Server

Express + MongoDB backend.

## Setup

```bash
npm install
cp .env.example .env   # configure MongoDB URI
npm run dev
```

## Stack

- Express 5
- Mongoose (MongoDB)
- Multer (file uploads)
- UUID

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 5000 | Server port |
| MONGODB_URI | mongodb://localhost:27017/ai-website-builder | MongoDB connection |
| AI_PROVIDER | mock | AI provider (mock/claude/gpt/ollama) |
| NODE_ENV | development | Environment |

## Ports

| Service | Port |
|---------|------|
| API Server | 5000 |
