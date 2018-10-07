## About
This is Telegram bot

## Deploy

```
docker run --name redis -p 6379:6379 -d redis:alpine

docker build -t fetch .

docker run -d -p 3000:3000 fetch
```
