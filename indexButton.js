// Supports ES6
// import { create, Whatsapp } from 'venom-bot';

const express = require('express');
const request = require('axios')


var cors = require('cors')
const app = express();
app.use(cors())

const PORT = 3000;
app.use(express.urlencoded({extended: true}));
app.use(express.json())

app.listen(
  PORT,
  () => console.log(`it live on http://localhost:${PORT}`)
)


const venom = require('venom-bot');

venom
  .create({
    session: 'session-name', //name of session
    multidevice: false // for version not multidevice use false.(default: true)
  })
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

  app.get('/wtsp', (req, res) => {
    res.status(200).send({
        number: '555',
        message: 'done'
    })
});




function start(client) {
 
  app.post('/wtsp/:id',(req, res) => {

     var number  = req.body.numero;
     var latitude  = req.body.latitude;
     var longitude  = req.body.longitude;
     var message  = req.body.message;
 
     if(!number){
         res.status(418).send({ message: "number is required."})
     }
 
     //console.log(JSON.parse(JSON.stringify(req.body)))
     //console.log('\n = '+number +" "+ latitude + " "+longitude+" " + message);
 
     if(!latitude || !longitude){
      //   client.sendMessage(number,message);

         client.sendText(number+"@c.us", '👋'+message).then((result) => {
          //console.log('Result: ', result); //return object success
        })
        .catch((erro) => {
          console.error('Error when sending: ', erro); //return object error
        });

     }else{
         // client.sendMessage(number, new Location(latitude, longitude, message));
          client.sendLocation(number+"@c.us",longitude ,latitude , message).then((result) => {
            //console.log('Result: ', result); //return object success
          })
          .catch((erro) => {
            console.error('Error when sending: ', erro); //return object error
          });
  
     } 
     
    // res.setHeader('Content-Type', 'text/plain');
    /* res.send({
             success:'success'
     })*/
     res.status(200).json({
      status: 'succes',
      data: req.body,
    })
 
 
 });

var activeWorks=false;
var activeIncident=false;
  client.onMessage((message) => {
    
    if (message.body === 'Incident' || activeIncident === true) {
      if(activeIncident!=true){
        activeIncident=true
        client
        .sendText(message.from, 'We are waiting for your coordinates')
        .then((result) => {
          //console.log('Result: ', result); //return object success
        })
        .catch((erro) => {
          console.error('Error when sending: ', erro); //return object error
        });
      }else if(activeIncident==true){
        activeIncident=false;
        client
        .sendText(message.from, 'Incident coordinates '+ message.lat + " ; "+message.lng+" has been added successfully. Thank you for your contribution.")
        .then((result) => {
          //console.log('Result: ', result); //return object success
        })
        .catch((erro) => {
          console.error('Error when sending: ', erro); //return object error
        });
      
        var mylatlngComptIn = "{ \"lat\":" +message.lat+" , "+"\"lng\": "+message.lng+"  }";

        //var str_camCoordinatesIn = JSON.stringify(mylatlngComptIn);

        var in_coor = "{\"coordinates\":" + mylatlngComptIn + "}";
        
        let data= {
    
          insert_incident: true,
          nomofgeom: "Incident100",
          titleofgeom: "title incident",
          dataofgeom: "data incident",
          coordinatesofgeom: in_coor
        }
        request.post('http://localhost:80/mdbtemplates/html/dashboards/save.php', data).then(resp =>{
          console.log(resp.data);
          });
      
      }



    }else if (message.body === 'Works' || activeWorks === true) {
      
      if(activeWorks!=true){
        activeWorks=true
        client
        .sendText(message.from, 'We are waiting for works coordinates')
        .then((result) => {
          //console.log('Result: ', result); //return object success
        })
        .catch((erro) => {
          console.error('Error when sending: ', erro); //return object error
        });
      }else if(activeWorks==true && message.lat!=undefined){
        activeWorks=false;
        client
        .sendText(message.from, 'Works coordinates '+ message.lat + " ; "+message.lng+" has been added successfully. Thank you for your contribution.")
        .then((result) => {
          //console.log('Result: ', result); //return object success
        })
        .catch((erro) => {
          console.error('Error when sending: ', erro); //return object error
        });


        var mylatlngComptIn = "{ \"lat\":" +message.lat+" , "+"\"lng\": "+message.lng+"  }";

        //var str_camCoordinatesIn = JSON.stringify(mylatlngComptIn);

        var in_coor = "{\"coordinates\":" + mylatlngComptIn + "}";
        
        let data= {
    
          insert_works: true,
          nomofgeom: "works100",
          titleofgeom: "title works",
          dataofgeom: "data works",
          coordinatesofgeom: in_coor
        }
        request.post('http://localhost:80/mdbtemplates/html/dashboards/save.php', data).then(resp =>{
          console.log(resp.data);
          });
      

      }else if(message.lng==undefined && message.lat==undefined){
        activeWorks=false;
        client
        .sendText(message.from, '!!!You must send location, try again Please!!!')
        .then((result) => {
          //console.log('Result: ', result); //return object success
        })
        .catch((erro) => {
          console.error('Error when sending: ', erro); //return object error
        });
      }

    }else if (message.body === 'traffic info' && message.isGroupMsg === false) {




      client
        .sendText(message.from, 'Thank you.:!')
        .then((result) => {
          //console.log('Result: ', result); //return object success
        })
        .catch((erro) => {
          console.error('Error when sending: ', erro); //return object error
        });





    }else if (message.body === 'info' && message.isGroupMsg === false) {
      client
        .sendText(message.from, "Mourour Project is a new solution for traffic management")
        .then((result) => {
          //console.log('Result: ', message); //return object success
        })
        .catch((erro) => {
          console.error('Error when sending: ', erro); //return object error
        });
    }
    else if (message.body === 'events' && message.isGroupMsg === false) {
      const events = [
        {
          "buttonText": {
            "displayText": "Incident"
            }
          },
        {
          "buttonText": {
            "displayText": "Works"
            }
          }
        ]

      client.sendButtons(message.from, 'Chose one action: ', events, 'click on a button then share the location')
      .then((result) => {
        //console.log('Result: ', message); //return object success
      })
      .catch((erro) => {
        console.error('Error when sending: ', erro); //return object error
      });

    }else{
        // Send Messages with Buttons Reply
const buttons = [
    {
      "buttonText": {
        "displayText": "info"
        }
      },
    {
      "buttonText": {
        "displayText": "traffic info"
        }
      },
      {
        "buttonText": {
          "displayText": "events"
          }
        }
    ]


    
 client.sendButtons(message.from, 'Bonjour merci de choisir : ', buttons, 'cliquer sur votre choix')
    .then((result) => {
      //console.log('Result: ', message); //return object success
    })
    .catch((erro) => {
      console.error('Error when sending: ', erro); //return object error
    });
    }
  });
  
}

function endMission(number){

}