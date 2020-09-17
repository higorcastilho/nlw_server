<h1 align="center">
   <img alt="Proffy" src=".github/logo.svg" height="100px">
   <br>Back-end</br>
</h1>

<p align="center">
  <img alt="Developed by Rocketseat" src="https://img.shields.io/badge/developed%20by-Rocketseat-blueviolet"><br/>
</p>

### :hearts: About

**Proffy** was a project developed from 03/08 to 07/08 by [Rocketseat](https://rocketseat.com.br/) at second Next Level Week edition. It's a web app made to connect teachers and students who love to share and learn about several topics.
The **source code repositories** and the **deployed website** can be found here:

- [Website](https://ecstatic-rosalind-d9b9bc.netlify.app/) :arrow_upper_right:
- [Presentation](https://github.com/higorcastilho/next_level_week_2)
- [Front-end](https://github.com/higorcastilho/nlw_web)

### :wrench: Node version used here is v14.8.0 and npm v6.14.7
- git clone
- run npm install

### :floppy_disk: Configuring the database

- The SGBD used is Postgres. You can configure it either using a container, or using a local database.

#### :whale2: Using Docker

Using docker, you can run the bellow code to create an instance of a database in your machine, making this avaiable on port 5432:

```
docker run --name <container name> -e POSTGRES_PASSWORD=<password> -p <the port to access the container from your machine>:5432 -d postgres
```
For example, you can create an instance of database with a container named 'nlw', with password '123456', on port 5432 and image postgres:

```
docker run --name nlw -e POSTGRES_PASSWORD=123456 -p 5432:5432 -d postgres
```

Note: If you've already used this port (5432) before, you can change it (5431, for example) or, if you're on linux, run the following command:
```
sudo fuser -k 5432/tcp
```
This is gonna kill any process on 5432 port, making this avaiable for you. And if it's necessary, you may have to remove a container created with the same name you choosed (nlw). So run the following:
```
sudo docker container rm <the id of the container you want to remove>
```

Running 'docker ps', you're gonna see your container **nlw** running up.

------------------------------------------------
Now, you gotta have a database client compatible with Postgres.

#### Client for Docker

Beekeeper might be a good choice, but you can use another one. 
Using the following configuration: 

```
docker run --name nlw -e POSTGRES_PASSWORD=123456 -p 5432:5432 -d postgres
```

You're are going to fill the fields: Connection Type (Postgres), Host (localhost), Port (5432), User (postgres) and Password (123456).

- On Query tab, type: **CREATE DABATASE proffy;**
- Now that you have a database, you can go to the step **Modifying the scripts**.
- Note: When the container instance of your database is removed, all data is lost.

#### :computer: Configuring database locally 

If you have postgres installed locally, you can use pgAdmin 4 (it's faster and lighter than Beekeeper to run on Ubuntu) to manage the database configuration. All you gotta do is create a database (you can use psql) and go to pgAdmin 4 to add a server and stablish a connection to your local network postgres.

### :key: Setting environment variables

Open the folder you've just clonned and create a '.env' file on the root of the project. Copy the environment variables from '.env.example' and paste inside the '.env' file you've just created.
Fill the variables with the data information about the database you created.

### :page_facing_up: Modifying the scripts

The scripts on package.json inside this repository is how it's meant to be on production. So, you'll gotta change this to the following to run the migrations on your computer:

- from this:

- {
- "start": "node dist/src/server.js"
- "dev": "tsnd --transpile-only --ignore-watch node_modules --respawn src/server.ts",
- "knex:migrate": "knex --knexfile dist/knexfile.js migrate:latest",
- "knex:rollback": "knex --knexfile dist/knexfile.js migrate:rollback",
- "build": "tsc"
- }

- to this:

- {
- "start": "tsnd --transpile-only --ignore-watch node_modules --respawn src/server.ts",
- "knex:migrate": "knex --knexfile knexfile.ts migrate:latest",
- "knex:rollback": "knex --knexfile knexfile.ts migrate:rollback" 
- }

You'll also have to go to **tsconfig.json** file and comment the 17 line (add //) in front of "outDir": "./dist".

That's all. Now you're all set to run the migration!

### :running: Running the migration

```
npm run knex:migrate
```
Now, run npm start, go ahead and test this API with your preferred API testing tool :) 

