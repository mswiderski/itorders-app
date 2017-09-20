# IT order application - case app in jBPM 7
Complete application for IT orders to showcase case management in jBPM 7

This application illustrates how jBPM 7 provides knowledge driven application with tailored UI for the domain. Application is composed of:

- itorders project (kjar) that includes processes and data model for the application
- WildFly Swarm s runtime environment
- KIE Server for knowledge execution (processes, rules, etc)
- PatterFly and AngularJS for UI


How to run it
--------------------

Application by default runs with H2 in memory data base but can be reconfigured to use other dbs like PostrgeSQL or MySQL.

1. clone this repository
2. build with maven (mvn clean install) on the root of cloned repo
3. go into itorders-web
4. start WildFly Swarm with:

```
java -Dorg.kie.server.location=http://localhost:8180/rest/server -Dswarm.port.offset=100 -jar target/itorders-web-1.0.0-swarm.jar
```

Wait a while and once the server is up ... will see the following messages:
```
2017-01-09 14:27:26,612 INFO  [stdout] (main) 	SUCCESS :: IT Orders application ready!!!
2017-01-09 14:27:26,615 INFO  [org.wildfly.swarm] (main) WFSWARM99999: WildFly Swarm is Ready
```
then go to browser and open link: http://localhost:8180

How to run it with controller
--------------------

Start workbench and create new server template with following information:
1. server template name - itorders
2. create new container
name: itorders
alias: itorders
groupid: org.jbpm.demo.apps
artifactid: itorders
version: 1.0.0
3. start WildFly Swarm with:

```
java -Dorg.kie.server.location=http://localhost:8180/rest/server -Dswarm.port.offset=100 -Dorg.kie.server.id=itorders -Dorg.kie.server.controller=http://localhost:8080/kie-wb/rest/controller -jar target/itorders-web-1.0.0-swarm.jar
```

Make sure that same users are defined in workbench security as they are in this application so workbench can be used to load data.

How to logon
----------------
There are few predefined users that can be changed:

User name | Password
------------ | -------------
maciek | maciek1!
tihomir | tihomir1!
krisv | krisv1!

All users can be changes in application-users.properties file that can be found in itorders-web/src/main/config/security folder.

Here you can find a [screencast](https://www.youtube.com/watch?v=GIak-6YpyaA) of this application in action in case you'd like to see what it can do. In nutshell:

- application handles IT Orders for hardware
- there are three main roles in this domain
  - owner - person who creates the order
  - manager - person who approves the order
  - supplier - group that is resposnible for dealing with actual hardware
  
You can find out what user has what roles in application-roles.properties file that can be found in itorders-web/src/main/config/security 

User name | Role
------------ | -------------
maciek | 
tihomir | apple, lenovo, dell, others
krisv | manager

What is important here is that groups for tihomir corresponds to available hardware suppliers that are represented as groups in business processes.


How to change data base
-----------------------

1. Uncomment driver dependencies in itorders-web/pom.xml for db that you want to use
  - H2
  - PostgreSQL
  MySQL
2. Edit KieServerMain class end uncomment or add section for data source of your selected db. By default it comes with H2 and PostgreSQL
3. Rebuild the application and start again

