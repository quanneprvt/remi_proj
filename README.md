## Prerequisites

- MongoDB installed (https://www.mongodb.com/docs/manual/administration/install-community/)
- NodeJS ( required version 16 for newly Next13 in frontend )

## Getting Started

- Run MongoDB Instance:

```bash
# create dbpath to store data
mkdir data
cd data
mkdir db
# Navigate back
cd ..
cd ..
# Run mongodb instance
mongod --bind_ip 127.0.0.1 --dbpath ./data/db
# Or add sudo if there's permission error
sudo mongod ...
```

- Navigate to Frontend folder:

```bash
# install dep
yarn install
# run
yarn dev
```

- Navigate to Backend folder:

```bash
# install dep
yarn install
# run
yarn dev
```

Note: Please mind the env file as there's example file to look up for

## Testing

- To be added ....

## Notice

- You might want to look up for `config` folder in the backend to change config
- Mind the .env as there's `.env.exmple`
- `schema` folder in the backend is for checking the `input` that is send from frontend
- `model` folder in the backend is the database model / type that is use in the backend

## Structure

- The backend project use [Basic router-controller-service model](https://devtut.github.io/nodejs/route-controller-service-structure-for-expressjs.html)
- The frontend project use NextJS 13 basic structure

## Deploy on Vercel

- Change setting in `vercel.json`
- Go to vercel platform and change `env` variables base on `env.exmaple`
- For more, read [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)
