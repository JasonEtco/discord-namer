jest.mock('discord.js')
const handleMessage = require('..')

describe('handleMessage', () => {
  let msg

  beforeEach(() => {
    msg = {
      mentions: {
        users: new Set()
      },
      guild: {
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
  })

  it('sets the nickname on an @mention', async () => {
    msg.mentions.users.add(msg.client.user.id)
    await handleMessage(msg)
    expect(msg.guild.me.setNickname).toHaveBeenCalled()
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

  it('ignores other users saying "I am ___man"', async () => {
    msg.author.id = msg.client.user.id + 1
    msg.cleanContent = 'I am :jason:man'
    await handleMessage(msg)
    expect(msg.guild.me.setNickname).not.toHaveBeenCalled()
  })
})
