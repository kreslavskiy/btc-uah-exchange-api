<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

An API service that allows you to:
1. Get the current BTC UAH rate.
2. Subscribe/ubsubscribe emails to receive the exchange rate.
3. Send current rate to all subscribed emails.
4. Get daily mailings at 9:30 with current BTC rate
5. Get mailing if BTC rate changes by more than 5%
## Installation

```bash
$ npm install
```

## Before running the app

```bash
# run all migrations
$ npx prisma migrate deploy

# seed the database
$ npx prisma db seed
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Running the app in Docker

```bash
docker-compose up -d --build
```
>**Note**: recommended

Now you have to run migrations manually due to PrismaORM issues

```bash
# run all migrations
$ docker exec service_app npx prisma migrate deploy

# seed the database
$ docker exec service_app npx prisma db seed
```
>**Note**: not recommended

Or you can put migrations commands into start command in Dockerfile like this:
```Dockerfile
CMD sh -c "npx prisma migrate deploy && npx prisma db seed && npm run start:prod"
```
but in that case migrations will run and throw an error when you'll try to run the app again.

## Test

```bash
# unit tests
$ npm run test
```
