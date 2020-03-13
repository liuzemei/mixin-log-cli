const fs = require('fs')
const path = require('path')
const { Mixin } = require('mixin-node-sdk')
let message = ''
let lastSendTime
module.exports = {
  getMixinClient(p) {
    let s = getFile(p)
    let c = checkKeystore(s)
    return c && new Mixin(c)
  },
  watchFile(p, client, recipient_id, options) {
    fs.watchFile(getPath(p), val => {
      let { size, keyword, interval } = options
      if (size) {
        interval = interval || 60
        let fileSize = val.size / 1024
        let canSend = true
        let now = new Date()
        if (!lastSendTime) lastSendTime = now
        else canSend = Math.floor((now - lastSendTime) / 1000 / 60) >= interval
        if (canSend && fileSize > size) {
          lastSendTime = now
          client.send_text({
            recipient_id,
            data: ` ${p} size is now ${fileSize} KB. Please check... `
          })
        }
      }
      if (keyword.length) {
        let log = getFile(p).toString('utf-8')
        let regStr = ''
        let result = {}
        for (let i = 0, len = keyword.length; i < len; i++) {
          result[keyword[i]] = 0
          regStr += i == len - 1 ? `(${keyword[i]})` : `(${keyword[i]})|`
        }
        let reg = new RegExp(regStr, 'gim')
        for (; ;) {
          let t = reg.exec(log)
          if (t === null) break
          result[t[0]]++
        }
        let tmpMessage = ''
        for (let key in result) {
          if (result[key]) tmpMessage += `${key} was found ${result[key]} times. Please check...\n`
        }
        if (message !== tmpMessage) {
          message = tmpMessage
          client.send_text({ recipient_id, data: message })
        }
      }
    })
  }
}
function getFile(p) {
  return fs.readFileSync(getPath(p))
}
function getPath(p) {
  return p.startsWith('/') ? p : path.resolve('./', p)
}

function checkKeystore(s) {
  try {
    let o = JSON.parse(s)
    let c = true
    if (!o.client_id) {
      c = false
      console.error('keystore file format error, without: ["client_id"]')
    }
    if (!o.session_id) {
      c = false
      console.error('keystore file format error, without: ["session_id"]')
    }
    if (!o.private_key) {
      c = false
      console.error('keystore file format error, without: ["private_key"]')
    }
    return c && o
  } catch (e) {
    console.error('keystore is JSON file. Format error')
    console.error(e)
    return false
  }
}