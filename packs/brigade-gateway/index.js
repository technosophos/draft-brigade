const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const convict = require("convict");
const { Event } = require("./brigade-event")

const app = express();
app.use(bodyParser.raw({type: "*/*"}));

// ==== CONFIGURATION ====
// To learn more about Convict, go here:
//   https://github.com/mozilla/node-convict
var config = convict({
    port: {
        doc: "Port number",
        default: 8080,
        format: "port",
        env: "GATEWAY_PORT"
    },
    namespace: {
        doc: "The Kubernetes namespace. Usually passed via downward API.",
        default: "default",
        env: "GATEWAY_NAMESPACE"
    }
});
config.validate({allowed: 'strict'});
const namespace = config.get("namespace");


// ==== REGISTER YOUR WEBHOOKS ====
// This is an example, and it is unauthenticated.
// It allows the user to specify the event (hook) and
// the project ID (brigade-XXXXXXXXXXXXXXXX)
app.post("/v1/webhook/:hook/:project", (req, res) => {
    const eventName = req.params.hook;
    const project = req.params.project;
    const payload = req.body

    // The main thing to do is transform the incomming request into
    // a new brigade event. Calling 'brigEvent.create()' will
    // create the event, and the Brigade controller will take over
    // from there.
    brigEvent = new Event(namespace);
    brigEvent.create(eventName, project, payload).then(() => {
        // At this point, we know the event was created.
        res.json({"status": "accepted"});
    }).catch((e) => {
        console.error(e);
        res.sendStatus(500);
    });
});

// ==== BOILERPLATE ====
// Kubernetes health probe.
app.get("/healthz", (req, res)=> {
    res.send("OK");
})
// Start the server.
http.createServer(app).listen(config.get('port'), () => {
    console.log("Running")
})