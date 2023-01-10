'use strict'
const fs = require('fs');
const fastify = require('fastify')();
const path = require('path');

const Port = 10001;

fastify.register(require('fastify-static'), {
  root: path.join(__dirname + '/docs'),
});

let watcher = null;
fastify.register(require('fastify-websocket'));
fastify.get('/watch', { websocket: true }, function wsHandler (connection, req) {
  connection.socket.on('message', message => {
    try{
      if(watcher)
        watcher.close();

      watcher = fs.watch(`./docs/fragments/${message}.frag`);
      watcher.on('change', () => {
        connection.socket.send('updated');
      });

      console.log('Criado watcher para '+ message);
    }catch(e){
      console.error(e);
      console.log('Erro ao criar watcher');
    }
  })

  connection.socket.on('close', message => {
    if(!watcher)
      return;
    watcher.close();
    console.log('watcher destruido');
  })
})

fastify.listen(Port, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`server listening on ${address}`);
})
