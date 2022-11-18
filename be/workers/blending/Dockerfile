FROM python:3.10-slim-buster as debug
WORKDIR /app
COPY workers/blending/requirements.txt requirements.txt
RUN pip install -r requirements.txt

WORKDIR /shared_lib
COPY /shared_lib .
RUN pip install -e ./workers

WORKDIR /app
COPY . .
CMD [ "python", "-u", "main.py"]

# FROM node:19 as prod
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# EXPOSE 3001
# CMD [ "node", "."]