const db = require("quick.db"),
  Discord = require("discord.js");

exports.run = async (client, message, args, tools) => {
  if (!message.member.hasPermission("ADMINISTRATOR")) {
    const embed = new Discord.MessageEmbed().setTitle("You do not have the proper permissions to do this.");

    return tools.send(message.channel, embed, {
      color: true,
      name: "Invalid Permissions",
      icon: "https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/bookshelf-128.png",
    });
  }

  let mentionedChannel = message.mentions.channels.first();
  if (!mentionedChannel) {
    const embed = new Discord.MessageEmbed().setTitle("Please mention a text channel following the command.");

    return tools.send(message.channel, embed, {
      color: true,
      name: "Invalid Channel",
      icon: "https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/bookshelf-128.png",
    });
  }

  // Check if channel is already an auto-create channel
  let channel = await db.fetch(`autoCreate_${message.guild.id}`);

  if (channel !== null && client.channels.cache.get(channel.id)) {
    await db.delete(`autoCreate_${message.guild.id}`);

    const embed = new Discord.MessageEmbed().setTitle(`Disabling ${message.guild.name}'s auto create channel.`);

    return tools.send(message.channel, embed, {
      color: true,
      name: "Feature Disabled",
      icon: "https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/bookshelf-128.png",
    });
  } else {
    args = args.join(" ").replace(mentionedChannel.toString(), "").trim().toLowerCase();

    let obj = {
      channelID: mentionedChannel.id,
      message: args || null,
    };

    await db.set(`autoCreate_${message.guild.id}`, obj);

    const embed = new Discord.MessageEmbed().setTitle(`Successfully set ${mentionedChannel.name} as an auto create channel.`);

    return tools.send(message.channel, embed, {
      color: true,
      name: "Feature Enabled",
      icon: "https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/bookshelf-128.png",
    });
  }
};
