const fs = require('fs')
const path = require('path')
const { Mixin } = require('mixin-node-sdk')
const axios = require('axios')
const instance = axios.create({
  headers: { "content-type": "application/json" }
})


let messageClient = ''
let messageToken = ''

let lastSendTime
module.exports = {
  getMixinClient(p) {
    let s = getFile(p)
    let c = checkKeystore(s)
    return c && new Mixin(c)
  },
  watchFileByClient(p, client, recipient_id, options) {
    let { size, keyword, interval } = options
    fs.watchFile(getPath(p), val => {
      if (size && fileSize > size) {
        let data = getSizeMessage(val.size, interval = 60)
        if (data) client.send_text({ recipient_id, data })
      }
      if (keyword.length) {
        let data = getKeywordMessage(p, keyword, 'client')
        if (data) client.send_text({ recipient_id, data })
      }
    })
  },
  watchFileByToken(p, token, options) {
    let { size, keyword, interval } = options
    fs.watchFile(getPath(p), val => {
      if (size && fileSize > size) {
        let data = getSizeMessage(val.size, interval = 60)
        if (data) sendToHook(token, data)
      }
      if (keyword.length) {
        let data = getKeywordMessage(p, keyword, 'token')
        if (data) sendToHook(token, data)
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

function getSizeMessage(fileSize, interval = 60) {
  interval = interval
  fileSize = fileSize / 1024
  let canSend = true
  let now = new Date()
  if (!lastSendTime) lastSendTime = now
  else canSend = Math.floor((now - lastSendTime) / 1000 / 60) >= interval
  if (!canSend) return false
  lastSendTime = now
  return `${p} size is now ${fileSize} KB. Please check... `
}

function getKeywordMessage(p, keyword, type) {
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
  if (type === 'client') {
    if (messageClient !== tmpMessage) {
      messageClient = tmpMessage
      return messageClient
    }
  }
  if (type === 'token') {
    if (messageToken !== tmpMessage) {
      messageToken = tmpMessage
      return messageToken
    }
  }
  return false
}

function sendToHook(token, data) {
  instance({
    method: 'post',
    url: 'https://webhook.exinwork.com/api/send?access_token=' + token,
    data: { category: "PLAIN_TEXT", data }
  })
}