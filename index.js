require('dotenv').config()

const Discord = require('discord.js')
const nemojis = require('node-emoji')
const get = require('get-value')
const client = new Discord.Client()

client.on('message', msg => {
  const members = get(msg, 'mentions.members')
  if (!members) return

  const jason = members.find(member => member.user.username === 'jasonetco')
  if (!jason) return

  const random = nemojis.random()
  return jason.setNickname(`${random.emoji}man`, `${msg.author.username} mentioned Jason, so here we are.`)
})

client.login(process.env.DISCORD_TOKEN)
