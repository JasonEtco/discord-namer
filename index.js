require('dotenv').config()

const Discord = require('discord.js')
const nemojis = require('node-emoji')
const client = new Discord.Client()

client.on('message', msg => {
  if (!msg.mentions.users.has(client.user)) return

  const jason = msg.guild.me
  const random = nemojis.random()
  return jason.setNickname(`${random.emoji}man`)
})

client.login(process.env.DISCORD_TOKEN)
