module.exports = {
  name: 'command-delete',
  
  desc: 'Blocks all commands except those explicitly allowed',
  
  allowedCommands: new Set(['help', 'addAllowedCommand', 'removeAllowedCommand', 'listAllowedCommands']),

  async init() {
    const { addCommandListener } = require('../lib/events')
    const config = require('../config')
    
    const prefix = typeof config.PREFIX === 'string' ? config.PREFIX : config.PREFIX[0]
    
    addCommandListener('pre', async (msg, command) => {
      if (this.allowedCommands.has(command.name)) {
        return true
      }
      
      msg.reply(`Command "${prefix}${command.name}" is not allowed.`)
      return false
    })
  },

  async addAllowedCommand(msg, commandName) {
    if (!commandName) return msg.reply('Please specify a command name to allow')
    
    this.allowedCommands.add(commandName)
    return msg.reply(`Command ".${commandName}" is now allowed`)
  },

  async removeAllowedCommand(msg, commandName) {
    if (!commandName) return msg.reply('Please specify a command name to disallow')
    
    if (this.allowedCommands.delete(commandName)) {
      return msg.reply(`Command ".${commandName}" is no longer allowed`)
    }
    return msg.reply(`Command ".${commandName}" was not in the allowed list`)
  },

  async listAllowedCommands(msg) {
    const allowed = Array.from(this.allowedCommands)
    if (allowed.length === 0) {
      return msg.reply('No commands are currently allowed')
    }
    return msg.reply(`Allowed commands:\n${allowed.map(cmd => `.${cmd}`).join('\n')}`)
  }
}