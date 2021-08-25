# caso queira hospedar a aplicação dentro do docker, evitando
# instalar alguma dependência na máquina local, fazendo o VSCode
# acessar o código na máquina local e executar no Docker
FROM node:14.15.4-alpine3.12

RUN apk add --no-cache bash

USER node

WORKDIR /home/node/app