# hyperexchange

exchange keys with hyperdiscovery peers

## basic api

```js
let local = hypercore()
let listener = hypercore(remote_key)

let xc = exchange(local) // my feed
xc.connect(listener) // peer feed

local.on('connection', key => console.log(key))
listener.on('connection', key => console.log(key))
```
