docker build --rm -f Dockerfile -t facebot:latest ./

docker run --rm -d -p 5000:5000 --name facebot facebot:latest
