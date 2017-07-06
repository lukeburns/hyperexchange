const hyperdiscovery = require('hyperdiscovery')
const events = require('events')

class Exchange extends events.EventEmitter {
  constructor (feed, opts={ download: false }) {
    super()
    this.feed = feed
    this.feed.on('ready', _connect.bind(this, this.feed, opts))
  }

  connect (remote, opts={}) {
    remote.on('ready', _connect.bind(this, remote, opts))
  }

  close (cb) {
    this.feed.close()
    this.feed.on('closed', cb)
  }

  get key () {
    return (this.feed.key) ? this.feed.key.toString('hex') : undefined
  }
}

function _connect (feed, opts) {
  feed.id = new Buffer(this.key, 'hex')
  let connections = []

  let swarm = hyperdiscovery(feed, opts)
  swarm.on('connection', function (socket, info) {
    const key = socket.remoteId.toString('hex')
    if (key !== feed.id && connections.indexOf(key) < 0) {
      connections.push(key)
      feed.emit('connection', key, (info.channel||'').toString('hex'))
    }
  })

  feed.on('close', function () {
    swarm.leave(feed.discoveryKey)
    swarm.destroy(function () {
      feed.emit('closed')
    })
  })

  return feed
}

module.exports = function (feed, opts) { return new Exchange(feed, opts) }
