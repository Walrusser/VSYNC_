const express = require("express");
var sse = require("simple-sse");
var favicon = require('serve-favicon');
var bodyParser = require("body-parser");
const app = express();

app.use(express.static(__dirname + "/public"));
app.use(favicon(__dirname + '/public/img/tabLogo.png'));

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.get("/player.html/sync/:roomId", (req, res) => {

    var client = sse.add(req, res);
    sse.join(client, parseInt(req.params.roomId));
    console.log("new user joined in room: " + req.params.roomId);


});

app.post("/player.html/sync/:roomId", (req, res) => {

    var syncUpdate = req.query.video + " " + req.query.status + " " + req.query.time;
    //Get status, video and time
    console.log("sync from room " + req.params.roomId + "  video:" + req.query.video + "  status:" + req.query.status + "  time:" + req.query.time);
    
    res.send(req.body);

    sse.broadcast(parseInt(req.params.roomId), syncUpdate);

});

app.listen(8080);
console.log("listening on port 8080");