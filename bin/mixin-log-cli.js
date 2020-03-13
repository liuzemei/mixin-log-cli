#!/usr/bin/env node

const program = require('commander');
const tools = require('./tools')

function list(val) {
  return val.split(',');
}

program
  .version('0.1.0')
  .usage('-[options] value')
  .option('-k, --keystore [value]', '[required] keystore file path', String)
  .option('-r, --recipient_id [value]', '[required] recipient_id', String)
  .option('-f, --file [value]', '[required] file path', String)
  .option('-s, --filesize [value]', 'Notify when file size exceeds. The unit is KB, optional. Default interval is one hour', parseFloat)
  .option('-w, --keyword [value]', 'Notify when keywords are included in the file, optional. eg. keyword or keyword1, keyword2, ...', list)
  .option('-i, --interval [value]', 'Notification interval (Only effective when listening to file size). The unit is minute, optional.', parseInt)
  .parse(process.argv);

let { keystore, file, recipient_id, filesize, keyword, interval } = program
if (!keystore) return console.log('  -k [keystore file path]. missing keystore file path')
if (!recipient_id) return console.log('  -k [recipient_id]. missing recipient_id')
if (!file) return console.log('  -k [keystore file path]. missing listen file path')
if (filesize && isNaN(filesize)) return console.log(' -s [filesize] filesize type is int. The unit is KB')
if (!filesize && !keyword) return console.log(`  -s [Maximum file size]. Maximum file size
 -w [keyword]. the keyword you want to listen to
 These two parameters need to specify at least one`)
let options = { size: filesize, keyword, interval }
let mixinClient = tools.getMixinClient(keystore)
if (!mixinClient) return

tools.watchFile(file, mixinClient, recipient_id, options)