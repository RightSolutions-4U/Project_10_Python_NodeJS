var express = require('express');
  
var app = express();

app.use(express.json()); // built-in middleware for express

const ID = 'AKIA5HYOICKIJ5RW2BHA';
const SECRET = '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';
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
//const uri = "mongodb://biotadev:ASNLUyiDySG8dfwV@biota.cluster-coamfz5qcfwm.us-east-1.docdb.amazonaws.com:27017/?ssl=true&ssl_ca_certs=rds-combined-ca-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false";

client.uri = uri;

//var MongoClient = require('mongodb').MongoClient;

app.get("/url", (req, res, next) => {
    res.json(["Tony"]);
   });
app.post("/", (req, res, next) => {
    /*const { spawn } = require('child_process');
    const pyProg = spawn('python', ['imagesplit.py']);

        pyProg.stdout.on('data', function(data) {
          //const filename = 'cropped.png'
          //const fileContent = fs.readFileSync(filename)
          console.log(data);
        pyProg.stderr.on('data', (data) => {
          console.log(data);
        });*/
        
        //this.child.kill();

    const { spawn } = require('child_process');
    const pyProg1 = spawn('python', ['maketiles.py']);
        pyProg1.stdout.on('data', function(data) {
          console.log(data);
        });
        pyProg1.stderr.on('data', (data) => {
          console.log(data);
        });
        //res.write(data);
      //});
    
    //const filename = 'cropped.png'
    //const fileContent = fs.readFileSync(filename)
    /*s3.upload(params, (err, data) => {
      if (err) {
        //reject(err)
        res.write(data)
        URL = data.uri  
      }
      res.write(data.Location)
      //resolve(data.Location)
    })*/
    
    const dir = __dirname
    const fs = require("fs");
    let openedDir = fs.opendirSync(dir);
    console.log("Files Present in directory:");
      
    let filesLeft = true;
    
    while (filesLeft) {
      let fileDirent = openedDir.readSync();
      
      //console.log(filename.includes("Tile"))
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
          //console.log(data.uri)
          console.log(FileURL);
          });
          //res.write(data.Location)
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
app.get("/picture", (req, res, next) => {
    AWS.config.update({
      accessKeyId: ID,
      secretAccessKey: SECRET
    });
    let s3 = new AWS.S3();
    async function getImage(){
      const data =  s3.getObject(
        {
            Bucket: 'biota',
            Key: 'https://biota.s3.amazonaws.com/Tile100_200.png'
          }
        
      ).promise();
      return data;
    }
    getImage()
      .then((img)=>{
        let image="<img src='data:image/jpeg;base64," + encode(img.Body) + "'" + "/>";
        let startHTML="<html><body></body>";
        let endHTML="</body></html>";
        let html=startHTML + image + endHTML;
        console.log(html)
        //res.send(html)
    }).catch((e)=>{
      console.log(e)
    })
    function encode(data){
        let buf = Buffer.from(data);
        let base64 = buf.toString('base64');
        return base64
    }  
  });
app.get("/pictures", (req, res, next) => {
  client.connect(uri, function (err, client) {
    if (err) throw new Error(err);
    var db = client.db('db_maps');
    var cursor = db.collection('coll_maps').find(); // Read method 'find'
    db.collection('coll_maps').find().toArray(function(err, docs) {
      console.log(docs);
    });
    //console.log(cursor);
    /*cursor.each(function (err, doc) {
      if (err) throw new Error(err);
      if (doc != null) {
        console.log(doc); // Print all documents
      } 
      else {
        console.log('error');
        db.close(); // Don't forget to close the connection when you are done
      }
    });*/
  });

    //console.log(data)
    res.end('end')
    });    
   app.listen(3000, () => {
 console.log("Server running on port 3000");
});