const exchange = require('./')
const hypercore = require('hypercore')
const ram = require('random-access-memory')

let remote = hypercore(ram)
let rxc = exchange(remote)

let local = hypercore(ram)
let lxc = exchange(local)

remote.on('connection', function (key) {
  console.log(shorten(remote.key), '<-', shorten(key))
  let listener = hypercore(ram, key)
  rxc.connect(listener)
  listener.on('connection', function (key) {
    console.log(shorten(remote.key), '->', shorten(key))
  })
})
remote.on('ready', function () {
  console.log('remote key', rxc.key.toString('hex'))
  console.log('local key', lxc.key.toString('hex'))
  console.log()

  local.on('connection', function (key) {
    console.log(shorten(local.key), '<-', shorten(key))
  })

  let listener = hypercore(ram, remote.key)
  lxc.connect(listener)
  listener.on('connection', function (key) {
    console.log(shorten(local.key), '->', shorten(key))
  })
})

function shorten (key, len=6) {
  return key.toString('hex').slice(0, len)
}
