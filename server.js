// Require Packages
const Discord = require("discord.js"),
  db = require("quick.db"),
  client = new Discord.Client(),
  tools = require("./functions.js"),
  prefix = "~",
  { token } = require("./config");

// client.on("createTimer", (data) => {
//   // data = { timer: <seconds>, function: <function> }
//   data.function = data.function.toString();
//   data.timer = Math.floor(new Date().getTime() / 1000 + data.timer);
//   if (isNaN(data.timer)) return console.log("Timer input isn't seconds.");
//   db.push("timers", data.function, {
//     target: data.timer,
//   });
// });

client.on("message", async (message) => {
  // Return Statement
  if (message.author.bot || !message.guild) return;

  // Variable
  let args = message.content.slice(prefix.length).trim().split(" "),
    cmd = args.shift().toLowerCase(),
    completed = true;

  let delList = await db.fetch(`autoDelete_${message.guild.id}`);
  if (delList === null) delList = [];
  else if (typeof delList === "number") delList = [delList];
  else if (delList !== null) delList = [...delList];

  if (delList.includes(message.channel.id))
    message.delete({
      timeout: 1000,
    });

  if (!message.content.startsWith(prefix)) return;

  // Aliases
  let aliases = {
    // cmd: target
    channeldescription: "channeldesc",
    mods: "moderators",
    mod: "addmod",
    delmod: "removemod",
    help: "channel",
    commands: "channel",
    cmdlist: "channel",
    setname: "channelname",
    setdesc: "channeldesc",
    statistics: "stats",
    newchannel: "create",
    delete: "purge",
    clear: "purge",
    inviteurl: "invitelink",
  };

  // Set Alias
  if (aliases[cmd] !== undefined) cmd = aliases[cmd];

  // Command Handler
  try {
    // Initialize

    let commandFile = require(`./commands/${cmd}.js`);
    commandFile.run(client, message, args, tools);
  } catch (e) {
    // Catch Errors

    console.log(e.stack);
    completed = false;
  } finally {
    // Run Last

    // Log Commands
    if (completed) {
      //console.log(`[${message.guild.name}] ${message.author.tag} ran the command: ${message.content}`);
      db.add(`commands`, 1, {
        target: "total",
      });
      db.add(`commands`, 1, {
        target: `${cmd}`,
      });
    } else console.log(`[${message.guild.name}] ${message.author.tag} attempted to run the command: ${message.content}`);
  }
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.username}!`);
  setInterval(async function () {
    let timer = Math.floor(new Date().getTime() / 1000);
    let fetched = await db.fetch("timers", {
      target: timer,
    });
    if (!fetched || !fetched instanceof Array) return;
    db.delete("timers", {
      target: timer,
    });
    for (var i in fetched) eval(fetched[i]);
  }, 1000);
});

// Login
client.login(token);
