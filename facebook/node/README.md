docker build --rm -f Dockerfile -t facebot:latest ./

docker run --rm -d -p 5000:5000 --env-file=config/dev.env --name facebot facebot:latest

docker logs facebot