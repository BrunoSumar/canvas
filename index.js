const fastify = require('fastify')()
const path = require('path')


console.log("asdfsdf")
fastify.register(require('fastify-static'), {
    // root: path,
  root: path.join(__dirname, ''),
  // prefix: '/', // optional: default '/'
})

fastify.listen(3000, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // fastify.log.info(`server listening on ${address}`)
  console.log(`server listening on ${address}`)
})

console.log("asdfsdf")
