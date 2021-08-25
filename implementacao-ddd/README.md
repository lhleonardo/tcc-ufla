# GoBarber - API

Aplicação construída com técnicas mostradas no DDD. 

## Contextualização

Esse repositório teve sua base implementada no bootcamp que realizei pela Rocketseat, adaptando algumas regras e refatorando alguns códigos, para adequá-lo ao DDD.

Algumas integrações com Docker e melhorias de testes foram adicionados.

## Estrutura

Na pasta raiz do projeto (`src`), contem 4 principais pastas:

* `@types` - definição de tipos para bibliotecas ou recursos não tipados;
* `config` - abstração das configurações de serviços, bibliotecas, funcionalidades, etc;
* `shared` - recursos utilizados como meio compartilhado, com alguns aspectos que remetem o _shared kernel_;
* `modules` - contém os domínios da aplicação (usuários, agendamentos e notificações).

## Requisitos

Você pode ver um resumo dos requisitos elaborados para essa API clicando [aqui](./REQUIREMENTS.md).

## Domínios

Os principais domínios são descritos como:

### Usuários
As principais funcionalidades realizadas pelo domínio de usuários são:
- Cadastro;
- Autenticação;
- Modificação de dados pessoais;
- Definição de Avatar;
- Recuperação de senha.

### Agendamentos
As principais operações feitas pelo domínio de agendamentos são:
- Gerenciar horários reservados e livres para um prestador;
- Permitir agendamento de um usuário para um prestador;
- Listar os prestadores disponíveis;
- Mostrar os horários livres de um prestador;
- Controlar agendamentos dentro de um dia, com cada atendimento durando 1 (uma) hora;
- Mostrar os agendamentos marcados para um prestador.

### Notificações
Tratado como um domínio de suporte, as operações presentes em notificações são:
- Criar uma notificação para um usuário
- Listar as notificações de um usuário
- Marcar uma notificação como lida

## Tecnologias

Para desenvolver essa API as seguintes tecnologias foram utilizadas:

- NodeJS
- Typescript
- Jest
- Express
- Celebrate
- JWT
- Multer
- Nodemailer

Relacionado a infraestrutura, persistência e rastreamento foram utilizados:

- PostgreSQL
- MongoDB
- Redis
- Sentry
- Amazon SES / Ethereal
- Amazon S3 / Armazenamento em disco
- Docker & Docker Compose

## Startup

Para iniciar a aplicação (exemplo com `yarn` mas pode ser facilmente convertido para `npm`) basta executar os comandos:

```bash
# baixar as dependências
yarn

# iniciar os containers de infraestrutura
docker-compose up -d

# criar o banco com as migrations e seeds
# NOTA: apenas na primeira vez
yarn typeorm migration:run

#iniciar a aplicação
yarn dev:server 
```

Caso queira executar os testes do sistema:

```bash
yarn test
```

Caso queira executar as migrations do banco de dados:

```bash
yarn typeorm migration:run
```

Caso queira gerar o código JS equivalente:

```bash
yarn build
```

## Autor
 | [<img src="https://github.com/lhleonardo.png" width=115><br><sub>Leonardo Braz</sub>](https://github.com/lhleonardo) <br><sub>Aluno de Graduação</sub>|
| :---: |