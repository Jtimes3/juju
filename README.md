# juju

=====
## DB

- Create Database (from command line)

```
createdb juju
```

- Load Schema (from command line)

```
psql juju < server/db/preloadedSchemas/schema.sql
```

- Load MockDataSet

```
psql juju < server/db/preloadedSchemas/mockData.sql
```


- Config Evironment

Create a file in your root path called ```config.js```.

Add the following line to that file.  Note - you need to change or
remove username & password to your system settings.
```
exports.connectionString = 'postgres://username:password@localhost/juju';
```

============================================
## Testing


### Front End
to start karma from the command line
    sudo npm install -g karma-cli

to run tests
    npm run tc

### Back End
install
    ```npm install -g jasmine```
- Create Database for test //  (from command line)
```
createdb jujutestdb
psql juju < server/db/preloadedSchemas/schema.sql
psql juju < server/db/preloadedSchemas/mockData.sql
```

# Usage
stop server

run all tests
    ``` npm test ```

run a specific test
    ``` jasmine spec/server/path/to/your/test.js ```

=======================================
## API Keys
- put them in the .env file

- this line goes in any file you are trying to require an api key in
require('dotenv').config()
- if you add an api key, add the name of the key variable (but not the key itself) to the dotEnvTemplate file so everyone can see which APIs we are playing with
-add the api key/secret to the slack channel

=======
## GULP

Run jshint
    gulp lint

