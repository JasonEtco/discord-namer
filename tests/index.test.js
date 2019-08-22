jest.mock('discord.js')
jest.mock('dotenv')
const Discord = require('discord.js')

Discord.Client = class {
  constructor () {
    this.user = { username: 'test-runner' }
    this.login = jest.fn(() => Promise.resolve({}))
    this.on = jest.fn()
  }
}

describe('handleMessage', () => {
  let msg, handleMessage

  beforeEach(() => {
    msg = {
      mentions: {
        users: new Set()
      },
      guild: {
        id: 123,
        name: 'dope-server',
        me: {
          setNickname: jest.fn()
        }
      },
      author: {
        id: 123
      },
      client: {
        user: { id: 123 }
      },
      cleanContent: ''
    }

    console.log = jest.fn()

    handleMessage = require('..')
  })

  it('sets the nickname on an @mention', async () => {
    msg.mentions.users.add(msg.client.user.id)
    await handleMessage(msg)
    expect(msg.guild.me.setNickname).toHaveBeenCalled()
  })

  it('ignores activity in non-allowed servers', async () => {
    process.env.ALLOWED_SERVERS = '1234'
    msg.mentions.users.add(msg.client.user.id)
    await handleMessage(msg)
    expect(msg.guild.me.setNickname).not.toHaveBeenCalled()
    delete process.env.ALLOWED_SERVERS
  })

  it('sets the nickname in allowed servers', async () => {
    process.env.ALLOWED_SERVERS = msg.guild.id.toString()
    msg.mentions.users.add(msg.client.user.id)
    await handleMessage(msg)
    expect(msg.guild.me.setNickname).toHaveBeenCalled()
    delete process.env.ALLOWED_SERVERS
  })

  it('ignores @mentions for other users', async () => {
    msg.mentions.users.add(1234)
    await handleMessage(msg)
    expect(msg.guild.me.setNickname).not.toHaveBeenCalled()
  })

  it('sets the nickname when the client says "I am ___man"', async () => {
    msg.author.id = msg.client.user.id
    const newName = ':jason:man'
    msg.cleanContent = `I am ${newName}`
    await handleMessage(msg)
    expect(msg.guild.me.setNickname).toHaveBeenCalled()
    expect(msg.guild.me.setNickname).toHaveBeenCalledWith(newName)
  })

  it('sets the nickname when the client says "I am ___man" with a real emoji', async () => {
    msg.author.id = msg.client.user.id
    const newName = '🤖man'
    msg.cleanContent = `I am ${newName}`
    await handleMessage(msg)
    expect(msg.guild.me.setNickname).toHaveBeenCalled()
    expect(msg.guild.me.setNickname).toHaveBeenCalledWith(newName)
  })

  it('ignores other users saying "I am ___man"', async () => {
    msg.author.id = msg.client.user.id + 1
    msg.cleanContent = 'I am :jason:man'
    await handleMessage(msg)
    expect(msg.guild.me.setNickname).not.toHaveBeenCalled()
  })
})
