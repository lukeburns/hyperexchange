const exchange = require('./')
const hypercore = require('hypercore')
const ram = require('random-access-memory')

let local = hypercore(ram)
local.on('ready', function () {
  console.log(': your key is', local.key.toString('hex'))
})

process.stdin.pipe(local.createWriteStream())
local.createReadStream({ live: true }).on('data', function (data) {
  data = data.toString()
  if (data.slice(0,2) === ':a') connect(data.slice(3).trim())
  if (data.slice(0,3) === ':cl') local.close(function () { console.log('closed!') })
})

let keys = []
let ch = exchange(local)
local.on('connection', connect)

function connect (key) {
  if (key.length === 64 && keys.indexOf(key) < 0) {
    console.log(':#', key)
    let feed = hypercore(ram, key)
    feed.createReadStream({ live: true }).on('data', function (data) {
      console.log(key.slice(0, 5)+':', data.toString().trim())
    })
    feed.on('connection', connect)
    ch.connect(feed)
    keys.push(key)
  }
}
