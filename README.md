# App Documentation #

* Application Stack
* Architecture
* How to start and stop the app
* How to setup a dev environment for the app locally
* How to pull and push
* How to build and deploy a new version of the app
* Approach to upgrades


/======================================================================/

### Application Stack ###

**Back end**

- Node.js
- Express js
- Passport.js
- Sequelize ORM
- EJS
- Forever
- Async
- MySQL

**Front end**

- gulp
- SASS
- Require JS
- Bower


/======================================================================/

### Architecture ###

![Screen Shot 2016-11-18 at 15.39.20.png](https://bitbucket.org/repo/5r7E9K/images/1611622685-Screen%20Shot%202016-11-18%20at%2015.39.20.png)

/======================================================================/

### How to start and stop the app ###

Make sure you are root user first and you are connected to the VPN:

```
#!unix
sudo -i

```

SSH to App01:

```
#!unix
ssh -i /PathToPemKeyFile 10.0.100

```


e.g:

```
#!unix
ssh -i /Users/J/Documents/Websites/_Datitude/app01.pem 10.0.0.100

```

Change to the directory where the app lives:

```
#!unix
cd ../var/www/datitude

```

This is the parent directory that holds backups of the app and the latest deployed version. The latest version is always called ‘**datitude-app**’.

To start the service change directory into the ‘**sql-app**’ part of the app (from ‘**datitude**’ directory):

```
#!unix
cd datitude-app/sql-app

```

Trigger ‘**start**’ script:

```
#!unix
./start

```

To stop the service trigger the ‘**stop**’ script:

```
#!unix
./stop

```

/======================================================================/


### How to setup a dev environment for the app locally ###

Firstly, pull the app down from bitbucket into your chosen directory:

```
#!unix
git clone git@bitbucket.org:datitude/datitude-app.git

```

Local development on the app requires a few bits to be setup first. The back end app runs on Node.js. This may work with any version but no upgrade path has been defined yet, so the current versions its running on locally for me is **Node v5.10.1** and **NPM v3.8.3**.

The front end of the app runs on a **gulp** build on **v3.9.0**.

The first thing to do is go into the **sql-app** directory and run:

```
#!unix
npm install

```

This should install all of the node dependencies for the back end. You'll need to change to the **front-end** directory and do the same thing:

```
#!unix
npm install

```

This will install gulp and all of its dependencies, also.

You should now have all of the code and node_modules you need to run the app. The app does also require a local DB to be running to store its local data to, so you will need something like **MAMP** to just run a local MySQL server. You can connect to this and create a local 'datitude_app' table. 

Once all of that is setup, from within the **sql-app** directory you should be able to run the following to start the node app:

```
#!unix
bin/www

```

This will run the app and log continuously to your terminal so you can see the app requests being made in real time.

To start the front end gulp process, you'll just need to change to the **front-end** directory and run:

```
#!unix
gulp

```

This will start the gulp build and monitor for changes.

The app currently runs on localhost port **8080** so put the following into your browser to view the app:

```
#!unix
http://localhost:8080/

```

That should be everything running..!


/======================================================================/

/======================================================================/


### How to setup a docker container environment for the app all evnviroments ###

Firstly, pull the app down from bitbucket into your chosen directory:

```
#!unix
git clone git@bitbucket.org:datitude/datitude-app.git

```

Once oull has completed, if you navigate to the root off the directory that you pull the code to you should see the below files:


```
#!unix
Dockerfile - container build conf
docker-compose.yml - default container conf set to NODE_ENV development
docker-compose.stg.yml - default container conf set to NODE_ENV staging
docker-compose.prod.yml - default container conf set to NODE_ENV production
```
Open a terminal to the root of your pull directory and execute the below to start the app in devlopment container
```
#!unix
docker-compose up
```

This will run the app and log continuously to your terminal so you can see the app requests being made in real time.

To Start the app in docker in other enviroment you just need to supply the correct yml to the docker-compose up command:

```
#!unix
docker-compose -f docker-compose.stg.yml up
docker-compose -f docker-compose.prod.yml up
```

To start the front end gulp process, you'll just need to change to the **front-end** directory and run(will be moved into Dockerfile):

```
#!unix
gulp

```

This will start the gulp build and monitor for changes.

The app currently runs on localhost port **8080** so put the following into your browser to view the app:

```
#!unix
http://localhost:8080/

```

That should be everything running..!


/======================================================================/

### How to pull and push ###

We're using git and bitbucket as a repo. This means you can use standard git push/pull commands after setting up your workspace. I personally use [Atom](https://atom.io/) as my IDE and I have the plugin **git-plus** which makes it super easy to handle all git commands via Atom, but the old school way is also cool.

To push, make sure your working directory is up to date etc. and the changes are in your local version, following the usual process:

```
#!unix
git status
git add (filenames or . for all changes)
git commit -m "Commit message"
git push origin master

```

To pull the latest code, simply:

```
#!unix
git pull

```

If you have unmerged changes etc. I would point you in [this](http://stackoverflow.com/questions/5601931/best-and-safest-way-to-merge-a-git-branch-into-master) direction ;)


/======================================================================/

### How to deploy a new version of the app (from source control) ###

Node.js is a javascript application and by virtue doesn't need compiling or building, so deploying the application just requires pushing the latest version of the application files from the bitbucket repo to the app server.

Follow these steps to deploy the application.

Make sure you are root user first and you are connected to the VPN:

```
#!unix
sudo -i

```

SSH to App01:

```
#!unix
ssh -i /PathToPemKeyFile 10.0.100

```


e.g:

```
#!unix
ssh -i /Users/J/Documents/Websites/_Datitude/app01.pem 10.0.0.100

```

Change to the directory where the app lives:

```
#!unix
cd ../var/www/datitude
```

The first thing to do is **stop** the current application from running (we're not quite at 0 downtime deployments for the app...). **NB: This will stop the app, currently we use application memory as our cache, so this will also clear the cache of all queries**:

Change directory to where the **stop** script lives:

```
#!unix
cd sql-app
```

Run the **stop** script:

```
#!unix
./stop
```

The application is now stopped. You'll need to go back up a directory and then backup the current version of the app and rename/delete any other versions currently living in this directory (we could run out of space quite easily, only keep 1/2 backups):

```
#!unix
cd ..
mv datitude-app datitude-app_(Today's date)_latest

```

No we need to get the latest version of the app from bitbucket:

```
#!unix
git clone https://japhex@bitbucket.org/datitude/datitude-app.git

```

Once the clone process is complete, we'll need to go into the app's directory and change some permissions quickly on the start and stop scripts:

```
#!unix
cd datitude-app
chmod 777 start
chmod 777 stop

```

Now we can start the app:

```
#!unix
./start

```

/======================================================================/

### Approach to upgrades ###

We haven't needed to upgrade any modules within the application yet, and as such everything is running together fine. In the future should we decide to upgrade certain parts, we should at the very least take into consideration:

- Sequelize ORM
- MySQL versioning
- Caching module ('cache-manager')
- Passport.js