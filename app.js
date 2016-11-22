var express = require('express');
var redis = require('redis');
var bodyParser=require('body-parser');
const uuid = require('uuid');

// init express
var app=express();

app.use(bodyParser.json());

const PORT=4158;

// initialize the Redis client and check if errors occur
var client = redis.createClient();

client.on('error', function (err) {
    console.log("Errore: Redis ha risposto "+err);
});


app.post('/docstore/add', function (req, res) {

  // todo: add error handling
  console.log(req);
  var dbname;
  if (req.headers["doc-store-id"]==undefined)
    {
        dbname=uuid.v1();
    }
  else
    {
       client.exists(req.headers["doc-store-id"], function(err, reply)
        {
            if (reply==1)
            {
               // the key exists
               dbname=req.headers["doc-store-id"];
            }
            else
            {
              // the key doesn't exist
              res.status(404).end();
            }
        });
    }

    newdoc=uuid.v1();
    console.log(req.body);
    client.hmset(newdoc, req.body, function(err, reply)
    {
       if (err==null)
       {
          client.lpush(dbname, newdoc, function(err, reply)
            {
              if (err==null)
                res.status(200).send({"res":"ok"});
            });
       }
    });


});


app.listen(PORT, function () {
  console.log('Server running on '+PORT+' port...');
});


