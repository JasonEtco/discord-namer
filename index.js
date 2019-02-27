require('dotenv').config()

const Discord = require('discord.js')
const nemojis = require('node-emoji')
const client = new Discord.Client()

const CUSTOM_NAME_REGEX = /^I\sam\s(?<emoji>.*)man$/

client.on('message', msg => {
  // I did it!
  if (msg.author.id === client.user.id) {
    // Will match `I am :emoji:man`
    const match = msg.cleanContent.match(CUSTOM_NAME_REGEX)
    // No matches found
    if (!match || !match.groups.emoji) return
    // Change their nickname
    return msg.guild.me.setNickname(`${match.groups.emoji}man`)
  }

  // The user wasn't mentioned
  if (msg.mentions.users.has(client.user.id)) {
    // Get a random emoji
    const random = nemojis.random()
    // Change their nickname
    return msg.guild.me.setNickname(`${random.emoji}man`)
  }
})

client.login(process.env.DISCORD_TOKEN)
