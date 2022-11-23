FROM python:3.10-slim-buster as debug
WORKDIR /app
COPY workers/blending/requirements.txt requirements.txt
RUN pip install -r requirements.txt

WORKDIR /shared_lib
COPY /shared_lib .
RUN pip install -e ./workers

WORKDIR /app
COPY . .

#Below is the prod command  #TODO: make these conditional on target ENV somehow (so we don't deploy a debug version)
# CMD [ "python", "-u", "main.py"]

# Below is the debug command for connecting from VScode to a container in debug mode
CMD [ "python", "-u", "-m", "debugpy", "--listen", "0.0.0.0:5678", "main.py"]

# FROM node:19 as prod
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# EXPOSE 3001
# CMD [ "node", "."]