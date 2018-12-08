# YouQuity

YouQuity is an app to help small businesses manage their equity structures.  This is something that many privately held small businesses struggle with.  Attorneys are typically used to manage this process, at a cost of thousands of dollars (or more) per year, but with the proper tools this process can be managed by the small business with minimal attorney oversight, greatly reducing costs.

This app is currently in the MVP (minimum viable product) stage, and right now it allows companies to create share classes, and create issued or pending investment records.

*This is the YouQuity API Repo.  The client can be accessed at (https://github.com/amandareilly/youquity-client)
*
**The live api can be accessed at http://youquity-api.amandareilly.me**


## Using Locally
If you would like to run this app on your local development server, you must install NPM and Gulp to build the project.

Once you have installed NPM and Gulp, cd into the project directory, and run 'npm install' (or 'sudo npm install' depending on your environment settings).

Once installed and built, you can access the api at http://localhost:8080.  

Because this is currently an MVP, full user and company creation is not yet available.  In order to use the client, you will first need to manually connect to the API (example: via Postman) and make the following requests:

POST /api/users :
```javascript
{
    "firstName": "User",
    "lastName": "Name",
    "email": "test@test.test",
    "password": "testing123"
}
```

POST /api/auth/login :
```javascript
{
    "email": "test@test.test",
    "password": "testing123"
}
```

POST /api/company (using jwt from second POST request as bearer token):
```javascript
{
    "name": "Test Company"
}
```

## Techology Used

* JavaScript
* jQuery
* Node.js
* MongoDB

### Frameworks and Plugins

* [Express.js](https://expressjs.com/) - Web framework for Node.js
* [Mocha](https://mochajs.org/) - JavaScript test framework
* [Mongoose](https://mongoosejs.com/) - ODM (Object Document Mapper) for Node.js and MongoDB

### Build Tools

* [NPM](https://www.npmjs.com/) - Package Manager
* [git](https://git-scm.com/) - Source Control

### CI and Depoloyment

* [Travis CI](https://travis-ci.org/) - Continuous Integration
* [Heroku](https://www.heroku.com) - Cloud Deployment
* [mLab](https://mlab.com) - Database-as-a-Service for MongoDB

## Author

* **Amanda Reilly** - [amandareilly](https://github.com/amandareilly)

## License

This project is licensed under the MIT License.