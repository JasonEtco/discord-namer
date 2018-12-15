require('dotenv').config()

const Discord = require('discord.js')
const nemojis = require('node-emoji')
const client = new Discord.Client()

client.on('message', msg => {
  // Do nothing if the user wasn't mentioned
  if (!msg.mentions.users.has(client.user)) return
  // Get a random emoji
  const random = nemojis.random()
  // Change their nickname
  return msg.guild.me.setNickname(`${random.emoji}man`)
})

client.login(process.env.DISCORD_TOKEN)
