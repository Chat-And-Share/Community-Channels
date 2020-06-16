// Require Packages
const db = require("quick.db"),
  Discord = require("discord.js");

// Command Handler
exports.run = async (bot, message, args, tools) => {
  // Fetch Channel Owner
  let owner = await db.fetch(`channelOwner_${message.channel.id}`);

  // Return if sender isn't owner & doesn't have admin perms
  if (owner !== message.author.id && !message.member.hasPermission("ADMINISTRATOR")) {
    const embed = new Discord.MessageEmbed().setTitle("You do not have the proper permissions to do this.");

    return tools.send(message.channel, embed, {
      color: true,
      name: "Invalid Permissions",
      icon: "https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/stop-128.png",
    });
  }

  // Return if sender didn't mention user
  if (!message.mentions.members.first()) {
    const embed = new Discord.MessageEmbed().setTitle("Please specify a member to add.");

    return tools.send(message.channel, embed, {
      color: true,
      name: "Invalid Member",
      icon: "https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/contacts-128.png",
    });
  }

  // Fetch first mentioned & moderators
  let member = message.mentions.members.first(),
    moderators = await db.fetch(`moderators_${message.channel.id}`);
  if (moderators === null) moderators = [];
  else if (typeof moderators === "number") moderators = [moderators];
  else moderators = [...moderators];

  // Return if user is already a moderator
  if (moderators.includes(member.id)) {
    const embed = new Discord.MessageEmbed().setTitle("This member is already a moderator.");

    return tools.send(message.channel, embed, {
      color: true,
      name: "Invalid Member",
      icon: "https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/contacts-128.png",
    });
  }

  // Push mentioned user to moderators array
  db.set(`moderators_${message.channel.id}`, [...moderators, member.id]);

  // Final Output
  const embed = new Discord.MessageEmbed().setTitle(`Successfully added ${member.user.username} as a moderator.`);

  tools.send(message.channel, embed, {
    color: true,
    name: "Moderator Added",
    icon: "https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/contacts-128.png",
  });
};
