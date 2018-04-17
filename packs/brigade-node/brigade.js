const {events, Job} = require("brigadier");

events.on("exec", (e, project) => {
  console.log("exec hook fired");
});