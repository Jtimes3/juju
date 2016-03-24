# Saja
Want to track the price that you are getting? 

[Saja](https://mks-juju.herokuapp.com/)

##Introduction

This web application allows a user to keep track the price that she/he wants to get. The user gets the notification via email or text as her preference.

##How to start : Database

- Create Database (from command line)

```
createdb juju
```

- Load Schema (from command line)

```
psql juju < server/db/scripts/schema.sql
```

- Load MockDataSet

```
psql juju < server/db/scripts/mockData.sql
```


- Config Evironment

Create a file in your root path called ```config.js```.

Add the following line to that file.  Note - you need to change or
remove username & password to your system settings.
```
exports.connectionString = 'postgres://username:password@localhost/juju';
```

## Test


- Front End
to start karma from the command line
```sudo npm install -g karma-cli```

to run tests
```npm run tc```

- Back End
to install
```npm install -g jasmine```
to create Database for test //  (from command line)
```
createdb jujutestdb
psql juju < server/db/scripts/schema.sql
psql juju < server/db/scripts/mockData.sql
```

- Usage
stop server

run all tests
    ``` npm test ```
run a specific test
    ``` jasmine spec/server/path/to/your/test.js ```

## API Keys
- put them in the .env file

- this line goes in any file you are trying to require an api key in
require('dotenv').config()
- if you add an api key, add the name of the key variable (but not the key itself) to the dotEnvTemplate file so everyone can see which APIs we are playing with
-add the api key/secret to the slack channel

## GULP

Run jshint
```gulp lint```

## Choice of Thechnologies

For this project, we used AngularJs for our front end and Node.js, Express and postgreSQL for our sever and database.

Also, we used cron job to gather the price of each item daily base. 

For test, we used Karma for client side, and Jasemine for server side.



## Cron Jobs


## Twilio API

- We used Twilio API for text notification [Twilio API](https://www.twilio.com/api). 


## Features

- Users can add a item to keep track the price
- Users get a notification from Saja once it hits their ideal price via email or text message
- Users can log in with their Facebook accout

## Git Workflow

Please refer to the `docs CONTRIBUTING.md` file to see our git workflow.

## Style Guide

Please refer to the `docs STYLE-GUIDE.md` file to see our style guide.

## Contributors
- Joe Ashby ([Joe Ashby](https://github.com/ChiralAlchemist))
- Madison Dunitz ([Madison Dunitz](https://github.com/MDunitz))
- Jessica Park ([Jessica Park](https://github.com/jeehaepark))
- James Youn ([James Youn](https://github.com/eternal44))

