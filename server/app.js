const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const app = express();

var request = require("request");
// API file for interacting with MongoDB
// const api = require('./server/routes/api');

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist')));
var cors = require('cors')

app.use(cors());

// Send all other requests to the Angular app
app.get('/', (req, res) => {
  res.send("res from");
});

app.route('/loadData').get((req, res) => {
  res.send({
    cats: [{ name: 'lilly' }, { name: 'lucy' }],
  })
})

app.route('/searchRepositories').get((req, res) => {
  res.send({
    results: [{ name: 'r1' }, { name: 'r2' }]
  })
})


app.post('/saveContents', function (req, res) {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";
    MongoClient.connect(url,{useNewUrlParser:true}, function(err, db) {
      if (err) throw err;
      var dbo = db.db("myDB");
      dbo.collection("importedRepositories").updateOne({repoId: req.body.id}, { $set: { name: req.body.name, devDependenciesList: req.body.devDependenciesList }}, {upsert: true, multi: true}, function(error,doc){
        debugger
        if (error) throw error;
          res.sendStatus(200);
      })
    });
})

app.post('/getTopPackagesList', async function (req, res) {
  debugger
  
  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://localhost:27017/";
  let db = await MongoClient.connect(url,{useNewUrlParser:true});
    
    var dbo = db.db("myDB");
    
  
    let result = (await dbo.collection('importedRepositories').aggregate([
      { "$unwind": "$devDependenciesList" },
      { "$group": { 
        "_id": "$devDependenciesList",
        "count": { "$sum": 1 }
      }},
      { "$match": { "count": { "$gt": 0 } } },
      { "$sort": { "count": -1 } }    
    ]).toArray());
    res.send(result);
})

app.post('/getAllRepoList', function (req, res) {
  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://localhost:27017/";
  MongoClient.connect(url,{useNewUrlParser:true}, function(err, db) {
    if (err) throw err;
    var dbo = db.db("myDB");
    dbo.collection("importedRepositories").find({},{repoId : 1}).toArray( function(error,doc){
      debugger
      if (error) throw error;
        res.send(doc);
    })
  });
})


// app.get('/getMachingPackageList', async function (req, res) {

//   debugger
//   var url = require('url');
//   var url_parts = url.parse(req.url, true);
//   var query = url_parts.query;
  
//   let url2 = "https://api.github.com/" + "search/repositories?q=" + query.q +"&sort=stars&order=desc";

//   let key = req.originalUrl.split("?")[1];
  
//   request(url2, function (error, response, body) {
//     debugger

//       if (!error && response.statusCode == 200) {
//           console.log(body) // Print the google web page.
//       }
//   })

//   var MongoClient = require('mongodb').MongoClient;
//   var url = "mongodb://localhost:27017/";
//   let db = await MongoClient.connect(url,{useNewUrlParser:true});
//   var dbo = db.db("myDB");

//   if (req.body.response) {
//     for (let i = 0; i < req.body.response.length; i++) {
//       req.body.response[i].selected = false;
//       let val = dbo.collection("importedRepositories").findOne({_id: "myId"}, {_id: 1});
//       if (val) {
//         req.body.response[i].selected = true;
//       }
//     }
//   }
// })


//Set Port
const port = process.env.PORT || '3000';

app.listen(port, () => console.log(`Running on localhost:${port}`));
