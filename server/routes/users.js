const express = require("express");
const User = require('../schemas/user-schema'); 
const jwt = require('jsonwebtoken')

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /users.
const usersRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");
const { db } = require("../schemas/user-schema");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// Async function wrapper to allow for imports
(async function() {
  let { includeLanguages, includeVaccinations, getCountries, getCountryData, createCountriesData } = await import("../travelbriefingRequests.mjs")
  
  // This section will help you get a list of all the users.
  usersRoutes.route("/app/users/").get(function (req, res) {
    let db_connect = dbo.getDb("AdventureAid");
    db_connect
      .collection("users")
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
      });
  });

  // This section will help you get a single user by id
  usersRoutes.route("/app/users/:id/").get(function (req, res) {
    let db_connect = dbo.getDb();
    let myquery = { _id: req.params.id};
    db_connect
        .collection("users")
        .findOne(myquery, function (err, result) {
          if (err) throw err;
          res.json(result);
        });
  });

  // gets all country JSON data for a given user
  usersRoutes.route("/app/getUserCountries/:id/").get(async function (req, res) {
    let db_connect = dbo.getDb();
    let myquery = { _id: req.params.id};
    let countries = await createCountriesData(await getCountries());
    db_connect
        .collection("users")
        .findOne(myquery, function (err, result) {
          if (err) throw err;
          countries = includeLanguages(new Set(result.languages), countries)
          countries = includeVaccinations(result.vaccinations, countries)
          res.json(countries);
        });
  })

  // This section will help you create a new user.
  usersRoutes.route("/app/users/add/").post(async function (req, response) {
    let db_connect = dbo.getDb();
    const user = req.body
    // if email or username is taken, will not allow to be inputted
    const takenUsername = await db_connect.collection("users").findOne({"_id": user.username})
    const takenEmail = await db_connect.collection("users").findOne({"email": user.email})
    if (takenUsername || takenEmail) {
      response.json({"message":"Username or email already taken"})
    } else {
      //creates a newUser document using the User model
      let newUser = new User({
        _id: req.body.username,
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
        vaccinations: { 
        malaria: req.body.malaria,
        hepatitisA: req.body.hepatitisA,
        hepatitisB: req.body.hepatitisB,
        yellowFever: req.body.yellowFever,
        tyfoid: req.body.tyfoid,
        dtp: req.body.dtp,
        cholera: req.body.cholera
        },
      languages: req.body.languages
      });
      db_connect.collection("users").insertOne(newUser, function (err, res) {
        if (err) {
          if (err.name === 'MongoServerError' && err.code === 11000) {
            // Duplicate username
            return response.status(422).send({ success: false, message: 'User already exist!' });
          }
    
          // Some other error
          return response.status(422).send(err);
        }
        response.json(res);
      });
    }
  });

  // This section will help you update a user by id.
  usersRoutes.route("/app/update/").post( async function (req, response) {
    let db_connect = dbo.getDb();  
    const user = await db_connect.collection("users").findOne({"_id": req.body.username})
    // only updates user if the email is the same or not held by another user
    const sameEmail = user.email == req.body.email
    const takenEmail = await db_connect.collection("users").findOne({"email": req.body.email})
    if (!sameEmail && takenEmail) {
      response.json({"message":"Email already taken"})
    } else {
      let myquery = { _id: req.body.username};  
      let newUser = new User({
        _id: req.body.username,
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
        vaccinations: { 
        malaria: req.body.malaria,
        hepatitisA: req.body.hepatitisA,
        hepatitisB: req.body.hepatitisB,
        yellowFever: req.body.yellowFever,
        tyfoid: req.body.tyfoid,
        dtp: req.body.dtp,
        cholera: req.body.cholera
        },
      languages: req.body.languages
      });
      db_connect.collection("users").updateOne(myquery, newUser, function ( err, obj) {
        if (err) throw err;
        console.log("1 document updated");
        response.json(obj);
      })
    }
  });

  // This section will help you delete a user
  usersRoutes.route("/app/:id/").delete((req, response) => {
    let db_connect = dbo.getDb();
    let myquery = { _id: req.params.id};
    db_connect.collection("users").deleteOne(myquery, function (err, obj) {
      if (err) throw err;
      console.log("1 document deleted");
      response.json(obj);
    });
  });

  // login
  usersRoutes.route("/app/login/").post((req, res) => {
    let db_connect = dbo.getDb();
    db_connect.collection("users").findOne({"_id":req.body.username}).then(dbUser => {
      if (!dbUser) {
        return res.json({"message":"Invalid username or Password"})
      }
      if (req.body.password == dbUser.password) {
        const payload = {
          id: dbUser._id
        }
        jwt.sign(
          payload,
          process.env.JWT_Key,
          {expiresIn: 86400},
          (err, token) => {
            if (err) {
              console.log(err)
              return res.json({"message":"err"})
            }
            return res.json({
              message: "success",
              token: "Bearer " + token
            })
          }
        )
      } else {
          return res.json({"message":"Invalid username or Password"})
        }
    })
  })
  
})();
module.exports = usersRoutes;
