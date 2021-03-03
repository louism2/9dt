# 9dt
Node JS application written in [Express](https://expressjs.com/) for the 98point6 Drop Token game.

## How to run
There are two ways to run the application:

**1. Docker Compose** - The application is dockerized and has a `docker-compose.yml` file that will automatically spin up an instance of the Postgres DB, connect to it, and run the migrations to set up the database schema.  If you have Docker/Docker Compose installed then from the root of the project you can just run:
```
> docker-compose up
```
This will start a container for the API which will bind locally to `127.0.0.1:9000`, and a container for the database which will bind locally to `127.0.0.1:5432`.  Check to make sure you don't have anything running locally on those ports before trying to run `docker-compose` or it won't work.

**2. Run locally using Node and Postgres** - You can also run the application using you local install of Node and Postgres.  The application was developed against **Node 15.1** and **Postgres 12.6**.  The only configuration you'll need to update is the *development* portion of the [database configuration](https://github.com/louism2/9dt/blob/main/config/config.json).  

You'll need to create the database in your local postgres instance as well as install npm/npx:
```
# install npm using homebrew
> brew install npm

# install npx package
> npm install -g npx
```
Once you have the configuration updated and npm/npx installed you can start the application from the root of the project by running:
```
# install dependencies
> npm install

# create db schema
> npx sequelize db:migrate

# start application
> npm run start
```
## Assumptions
The main assumption I made was related to whether the data model in the database should be relational or document-oriented.  For the most part, the data *seems* to be fairly well structured and realtional in nature but there were some clues around extending the game(creating a game with an array of players rather than two discreet player names and providing a row/column count when creating the game) that lead me to think that the flexibility of a document-oriented db might more well-suited.  Luckily, Postgres gives you both... relational data models with referential integrity and unstructured data types that provide flexibility.  