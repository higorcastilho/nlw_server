
- run git clone
- npm install

- The SGBD used is Postgres. Using docker, you can run the bellow code to create an instance of a database in your machine, making this avaiable on port 5432:

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

Now, running 'docker ps', you're gonna see your container nlw running up.

------------------------------------------------
Now, you gotta have a database client compatible with Postgres. I'm using Beekeeper on Ubuntu, but you can use another one. 
Open this and create a database with a name you want.

Open the folder you've just clonned and create a '.env' file on the root of the project. Copy the environment variables from '.env.example' and paste inside the '.env' file you've just created.
Fill the variables with the data information about the database you created.

------------------------------------------------

Change the scripts on package.json file to the following: 
"start": "tsnd --transpile-only --ignore-watch node_modules --respawn src/server.ts",
"knex:migrate": "knex --knexfile knexfile.ts migrate:latest",
"knex:rollback": "knex --knexfile knexfile.ts migrate:rollback" 


### Running the migration

```
npm run knex:migrate
```

Now go ahead and test this API with your preferred API testing tool :) 
