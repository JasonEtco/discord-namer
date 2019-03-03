require('dotenv').config()

const Discord = require('discord.js')
const nemojis = require('node-emoji')
const client = new Discord.Client()

const CUSTOM_NAME_REGEX = /^I\sam\s(:\w+:)man$/

/**
 * @param {import('discord.js').Message} msg
 * @param {string} emoji
 */
async function changeName (msg, emoji) {
  const newName = `${emoji}man`
  console.log(`You shall henceforth be known as ${newName}`)
  return msg.guild.me.setNickname(newName)
}

/**
 * @param {import('discord.js').Message} msg
 */
async function handleMessage (msg) {
  // I did it!
  if (msg.author.id === msg.client.user.id) {
    // Will match `I am :emoji:man`
    const match = msg.cleanContent.match(CUSTOM_NAME_REGEX)
    if (match) {
      // Change their nickname
      return changeName(msg, match[1])
    }
  }

  // The user was mentioned
  if (msg.mentions.users.has(msg.client.user.id)) {
    // Get a random emoji
    const random = nemojis.random()
    // Change their nickname
    return changeName(msg, random.emoji)
  }
}

client.on('message', handleMessage)
client.login(process.env.DISCORD_TOKEN)
module.exports = handleMessage
