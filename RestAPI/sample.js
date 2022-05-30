var express = require('express');
  
var app = express();

app.use(express.json()); // built-in middleware for express

const ID = 'ASDJKLJAKLSDJLASJKLDKL';
const SECRET = 'JKLSDKJKLSJKLDJASKLDJKLASJDKLJASKLDAASJLDKJ';
const fs = require('fs');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET
});


var FileURL = '';
//const params = {
//  Bucket: 'biota',
//  Key: `${filename}`,
//  Body: fileContent
//}
//import { MongoClient } from "mongodb";
var client = require('mongodb').MongoClient;
const uri = "mongodb+srv://biotadev:ASNLUyiDySG8dfwV@biota-nfts.9ppjb.mongodb.net/?retryWrites=true&w=majority";


client.uri = uri;

app.post("/", (req, res, next) => {
    const { spawn } = require('child_process');
    const pyProg = spawn('python', ['imagesplit.py']);

        pyProg.stdout.on('data', function(data) {
          console.log(data);
        pyProg.stderr.on('data', (data) => {
          console.log(data);
        });
        
        //this.child.kill();

    const { spawn } = require('child_process');
    const pyProg1 = spawn('python', ['maketiles.py']);
        pyProg1.stdout.on('data', function(data) {
          console.log(data);
        });
        pyProg1.stderr.on('data', (data) => {
          console.log(data);
        });
    
    const dir = __dirname
    const fs = require("fs");
    let openedDir = fs.opendirSync(dir);
    console.log("Files Present in directory:");
      
    let filesLeft = true;
    
    while (filesLeft) {
      let fileDirent = openedDir.readSync();
      
      if (fileDirent != null)
        {
        let filename =fileDirent.name
        if(filename.includes("Tile"))
        {
          console.log("Name:", fileDirent.name);
          const fileContent = fs.readFileSync(filename)
          const params = {
            Bucket: 'biota',
            Key: `${filename}`,
            Body: fileContent
          }
          s3.upload(params, (err, data) => {
          if (err) {
            console.log("err")
          }
          FileURL = data.Location
          console.log(`File uploaded successfully. ${data.Location}`);
          });
          client.connect(uri, function (err, client) {
          if (err) throw err;
          var db = client.db('db_maps');
          var map = { URL: FileURL };
          db.collection("coll_maps").insertOne(map, function (err, result) {
          if (err) throw err;
          console.log("1 Recorded Inserted");
          client.close();
          }); 
        });
        }
    }
    else filesLeft = false;
  }

    res.end('end')
  });
 app.listen(3000, () => {
 console.log("Server running on port 3000");
});