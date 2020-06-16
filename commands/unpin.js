const db = require("quick.db");
const Discord = require("discord.js");

exports.run = async (bot, message, args, tools) => {
  let owner = await db.fetch(`channelOwner_${message.channel.id}`),
    moderators = await db.fetch(`moderators_${message.channel.id}`);

  if (moderators === null) moderators = [];

  if (owner !== message.author.id && !moderators.includes(message.author.id) && !message.member.hasPermission("ADMINISTRATOR")) {
    const embed = new Discord.MessageEmbed().setTitle("You do not have the proper permissions to do this.");

    return tools.send(message.channel, embed, {
      color: true,
      name: "Invalid Permissions",
      icon: "https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/pin-128.png",
    });
  }

  // Fetch Message
  let msg = await message.channel.messages.fetch(args[0]);

  if (!msg || !msg.pinned || !args[0]) {
    const embed = new Discord.MessageEmbed().setTitle("Please input a pinned messageID following the command.");

    return tools.send(message.channel, embed, {
      color: true,
      name: "Invalid MessageID",
      icon: "https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/pin-128.png",
    });
  }

  msg.unpin();

  const embed = new Discord.MessageEmbed().setTitle(`Successfully unpinned message.`);

  return tools.send(message.channel, embed, {
    color: true,
    name: "Message Unpinned",
    icon: "https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/pin-128.png",
  });
};
