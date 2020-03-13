#!/usr/bin/env node

const program = require('commander');
const tools = require('./tools')

function list(val) {
  return val.split(',');
}

program
  .version('0.1.0')
  .usage('-[options] value')
  .option('-f, --file [value]', '[required] file path', String)
  .option('-t, --token [value]', ' webhook token', String)
  .option('-k, --keystore [value]', ' keystore file path', String)
  .option('-r, --recipient_id [value]', ' recipient_id', String)
  .option('-s, --filesize [value]', 'Notify when file size exceeds. The unit is KB, optional. Default interval is one hour', parseFloat)
  .option('-w, --keyword [value]', 'Notify when keywords are included in the file, optional. eg. keyword or keyword1, keyword2, ...', list)
  .option('-i, --interval [value]', 'Notification interval (Only effective when listening to file size). The unit is minute, optional.', parseInt)
  .parse(process.argv);


let { file, token, keystore, recipient_id, filesize, keyword, interval } = program
if (!file) return console.log('  -f [keystore file path]. missing listen file path')
if (!keystore && !token) return console.log(`  -k [keystore file path]. keystore file path
  -t [token]. webhook token
  These two parameters need to specify at least one.
`)
if (keystore && !recipient_id) return console.log('  -r [recipient_id]. When you specify a keystore, you must specify recipient_id')
if (filesize && isNaN(filesize)) return console.log(' -s [filesize] filesize type is int. The unit is KB')
if (!filesize && !keyword) return console.log(`  -s [Maximum file size]. Maximum file size
 -w [keyword]. the keyword you want to listen to
 These two parameters need to specify at least one
`)
let options = { size: filesize, keyword, interval }

if (keystore) {
  let mixinClient = tools.getMixinClient(keystore)
  if (!mixinClient) return
  tools.watchFileByClient(file, mixinClient, recipient_id, options)
}

if (token) {
  tools.watchFileByToken(file, token, options)
}