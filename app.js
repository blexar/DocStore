var express = require('express');
var redis = require('redis');
var bodyParser=require('body-parser');
const uuid = require('uuid');
var tools=require('./test-node');

// inizializza express
var app=express();

app.use(bodyParser.json());

const PORT=4158;

// attiva Redis e controllo errore
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
               // chiave esiste davvero
               dbname=req.headers["doc-store-id"];
            }
            else
            {
              // chiave cercata non esiste
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

    //console.log("Accodo "+newdoc+" a "+newdb);
    //client.lpush(dbname, newdoc);


});

/*app.post('/elenco/crea/:quanti', function (req, res) {
	db.gestionePersone.creaCasuali(req.params.quanti);
	res.end();
});
 
app.get('/elenco/tutti', function (req, res) {
	res.send(db.gestionePersone.tutti());
});*/

client.exists("eb9c93b1-b0c2-11e6-97e8-df10cc6789f2", function(err, reply)
{
  console.log('');
});
app.listen(PORT, function () {
  console.log('Server in esecuzione sulla porta '+PORT+'...');
});

// ********** prove per app

// 1. inserisci un documento

/*newdb=uuid.v1();

obs=[{"nome":"Carlo", "cognome":"Bianchi", "eta":25},
{"nome":"Carlo", "cognome":"Bianchi", "eta":25},
{"nome":"Carlo", "cognome":"Bianchi", "eta":25},
{"nome":"Carlo", "cognome":"Bianchi", "eta":25},
{"nome":"Carlo", "cognome":"Bianchi", "eta":25}];

obs.forEach(function(entry) {
    newdoc=uuid.v1();
    console.log("Inserisco "+entry+" in "+newdoc);
    client.hmset(newdoc, entry);

    console.log("Accodo "+newdoc+" a "+newdb);
    client.lpush(newdb, newdoc);
});

// recupera terzo elemento

client.lrange(newdb,2,2, function(err, reply) {
    console.log(reply[0]);
    client.hgetall(reply[0], function(err, r)
    {
      console.log(r['nome']);
    });
    
});*/



