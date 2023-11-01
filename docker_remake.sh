docker container stop frontend_container
docker container rm frontend_container
docker build -t frontend_image .
docker run -d --name frontend_container -p 3000:3000 frontend_image