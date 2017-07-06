# hyperexchange

exchange hypercore keys with peers

## basic api

```js
let local = hypercore()
let listener = hypercore(remote_key)

let ch = exchange(local) // my feed
ch.connect(listener) // peer feed

local.on('connection', (key) => console.log(key))
listener.on('connection', (key) => console.log(key))
```
