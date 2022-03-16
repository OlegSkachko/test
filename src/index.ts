import express from 'express'

let app = require('./server').default

if (module.hot != null) {
  module.hot.accept('./server', function () {
    console.log('🔁  HMR Reloading `./server`...')
    try {
      app = require('./server').default
    } catch (error) {
      console.error(error)
    }
  })
  console.info('✅  Server-side HMR Enabled!')
}

const port = process.env.PORT || 3000

export default express()
  .use((req, res) => app.handle(req, res))
  // @ts-expect-error
  .listen(port, function (err: Error) {
    if (err) {
      console.error(err)
      return
    }
    console.log(`> Started on port ${port}`)
  })
