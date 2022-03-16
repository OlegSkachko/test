import { BrowserRouter } from 'react-router-dom'
import React from 'react'
import { hydrate } from 'react-dom'
import { createStoreon } from 'storeon'
import { StoreContext } from 'storeon/react'
import { applyPolyfills, defineCustomElements } from '@garpix/garpix-web-components/loader'
import { storeonParams } from './store'
import '@garpix/garpix-web-components/dist/garpix-web-components/garpix-web-components.css'
import App from './App'

const store = createStoreon(storeonParams)

hydrate(
  <StoreContext.Provider value={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StoreContext.Provider>,
  document.getElementById('root')
)

applyPolyfills().then(() => {
  defineCustomElements()
})

if (module.hot) {
  module.hot.accept()
}
