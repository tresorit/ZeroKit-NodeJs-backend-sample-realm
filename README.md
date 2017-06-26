# ZeroKit Node sample backend
[![Build Status](https://travis-ci.org/tresorit/ZeroKit-NodeJs-backend-sample-realm.svg?branch=master)](https://travis-ci.org/tresorit/ZeroKit-NodeJs-backend-sample-realm)
[![Coverage Status](https://coveralls.io/repos/github/tresorit/ZeroKit-NodeJs-backend-sample-realm/badge.svg?branch=master)](https://coveralls.io/github/tresorit/ZeroKit-NodeJs-backend-sample-realm?branch=master)

This is an example that can be used for reference when developing the backend service of your own ZeroKit using application.
It provides a fully functional REST api that is used by our other examples. This is version of the backend sample uses
an offline realm to store data.

If you are using it with our examples, you only need to enter your configuration in config.json. It was designed with
reusability in mind, but there are some preparations to make if you want to use it in your own app.

This runs on Node.js > 6.0

## Configuration
Before you can start the server you have to configure it by editing [config.json](./config.json). It's important to note,
that you will need IDP configured on your tenant as we recommend for all applications that need server side authorization.

You can see an example in [./config.example.json].

In config.json: 
- baseUrl: where your site will be hosted. This is used to check incoming requests for dns rebinding and to  calculate some callback urls for the idp code login (although this can be overwritten)
- appOrigins: the origins where the server should accept CORS calls (Web) from, basically where your client app is hosted. 
    This isn't necessary for Realm or mobile only applications.  
- zeroKit: This object contains all the ZeroKit related configurations
  - serviceUrl: The service url displayed on the management portal
  - adminKey: The either one of the admin keys that you can copy from the portal
  - sdkVersion: The version of the sdk your app uses. This is currently made for v4. 
  Please keep in mind, that this may need to be updated as well as your client code for different versions.
  - idp: List of IDP clients configured. More information will be provided in the documentation of the 
  example clients and [below](#server-side-authentication---idp).
    - clientId: The ID of the client 
    - clientSecret: The client secret of the client 
    - callbackURL: Where the IDP process redirects to, overriding the automatic calculation.
                    Required for hybrid flow (mobile) clients and optional for code flow (web) clients.
                    If this is an SDK client you can find this on the IDP client's settings page, along with the above two. 

Please keep in mind, that many of these settings are used for strict, case-sensitive character matching, so they should be the same as on the management portal character-to-character.

If you want to use it with your own application you also need to modify app.js and customize the application logic
through the callbackConfig.

### Server side authentication - IDP
To make full use of the server you need to enable the Identity Provider on your tenant and configure a client for each
of your client applications.

You can enable the Identity Provider by clicking the switch next to the Identity Provider header. It is enabled if it's blue.

#### Mobile/Realm app
To add a client that will be used in a mobile app:
- Click Add SDK client
- Enter the name of the client e.g.: Mobile App 1
- Click Apply
- Now you need to add the client to the IDP portion of your config.json    
    See [above](#configuration) for details or see an example in [./config.example.json].
    
Please keep in mind, that all the settings will be used for strict, case-sensitive matching, so you should take care that the settings on the management portal and the settings in the config match character-to-character.

## Running
You need to first install dependencies by ```npm install```

Then, if it's configured, you can run it simply by ```npm start``` 

This will start a server listening on port 3000, your application can make request to this, a full documentation is on it's way.   

### Environmental variables
Some of the applications behaviour can be controlled by environmental variables:
- ZKIT_CONFIG_FILE: if you want to use a different configuration file (i.e. for testing) you can set up a path relative to the project root here
- DEBUG: verbose logging can be controlled by setting this to different values, turning on all logging by "ZeroKit-backend-sample:*"
- PORT: defines the port the server is listening on (3000 by default)

## Testing
If you want to run the tests included in the application you will need to run ```npm test``` with a few environmental variables set:
- BROWSERSTACK_USERNAME: a browserstack username that can run the automated tests
- BROWSERSTACK_ACCESS_KEY: your access key on browserstack

Cross browser testing provided by <a href="https://www.browserstack.com"><image alt="BrowserStack" src="https://cdn.rawgit.com/tresorit/ZeroKit-simple-example/master/BrowserStackLogo.svg" width="150px" /></a>
