require('dotenv').config()

const Discord = require('discord.js')
const rawEmojis = require('node-emoji/lib/emoji.json')

const emojis = Object.keys(rawEmojis)
  .filter(k => !k.startsWith('flag-'))
  .reduce((obj, key) => {
    obj[key] = nemojis[key]
    return obj
  }, {})

const emojiKeys = Object.keys(emojis)

const client = new Discord.Client()

const CUSTOM_NAME_REGEX = /^I\sam\s([^\s]+)man$/

function randomEmoji () {
  const randomIndex = Math.floor(Math.random() * emojiKeys.length)
  const key = emojiKeys[randomIndex]
  return emojis[key]
}

/**
 * @param {import('discord.js').Message} msg
 * @param {string} emoji
 */
async function changeName (msg, emoji) {
  const newName = `${emoji}man`
  console.log(`You shall henceforth be known as ${newName} on ${msg.guild.name}`)
  return msg.guild.me.setNickname(newName)
}

/**
 * @param {import('discord.js').Message} msg
 */
async function handleMessage (msg) {
  // Don't do anything unless there's a guild
  if (!msg.guild) return

  // If there's a list of allowed servers
  if (process.env.ALLOWED_SERVERS) {
    // Check that this server is in the list
    const allowed = process.env.ALLOWED_SERVERS.split(',')
    if (!allowed.includes(msg.guild.id.toString())) return
  }

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
    const random = randomEmoji()
    // Change their nickname
    return changeName(msg, random)
  }
}

client.on('message', handleMessage)
client.login(process.env.DISCORD_TOKEN).then(() => {
  console.log(`Ready to rename you ${client.user.username} 👂`)
})
module.exports = handleMessage
