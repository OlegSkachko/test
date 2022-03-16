import App from './App'
import React from 'react'
import { StaticRouter } from 'react-router-dom/server'
import express from 'express'
import { renderToNodeStream } from 'react-dom/server'
import {FilledContext, HelmetProvider} from 'react-helmet-async'
import serialize from 'serialize-javascript' // Safer stringify, prevents XSS attacks
import { runtimeConfig } from './config'
import { createStoreon } from 'storeon'
import { storeonParams } from './store'
import { StoreContext } from 'storeon/react'
import { PATHS } from 'const'
import { api } from '@/api'
import { matchPath } from 'react-router-dom'

const store = createStoreon(storeonParams)

// @ts-ignore
const assets = require(process.env.RAZZLE_ASSETS_MANIFEST)

const cssLinksFromAssets = (assets, entrypoint) => {
  return assets[entrypoint]
    ? assets[entrypoint].css
      ? assets[entrypoint].css.map(asset =>
          `<link rel="stylesheet" href="${asset}">`
      ).join('')
      : ''
    : ''
}

const jsScriptTagsFromAssets = (assets, entrypoint, ...extra) => {
  return assets[entrypoint]
    ? assets[entrypoint].js
      ? assets[entrypoint].js.map(asset =>
          `<script src="${asset}" ${extra.join(' ')}></script>`
      ).join('')
      : ''
    : ''
}

const server = express()
server
  .disable('x-powered-by')
  // @ts-ignore
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res) => {
    const url = req.originalUrl
    const { query } = req
    const auth_token = req.cookies?.[api.AUTH_TOKEN_KEY]
    const axiosParams = auth_token
      ? { headers: { Authorization: `Bearer ${auth_token}` } }
      : {}
    const promise = PATHS.ALL.fetchInitialData(
      matchPath(PATHS.ALL, url)!.pathname,
      query,
      axiosParams
    )
    promise.then((initData) => {
      const context: any = { initData }
      const componentStream = renderToNodeStream(
        <StoreContext.Provider value={store}>
          <StaticRouter location={req.url}>
            <App context={context} />
          </StaticRouter>
        </StoreContext.Provider>
      )
      if (context?.url) {
        res.redirect(context.url)
      } else {
        // Получаем все дерево компонентов, чтобы получить данные в helmet
        new Promise((resolve, reject) => {
          const helmetContext: any | FilledContext = {};
          let body = '';
          renderToNodeStream(
            <StoreContext.Provider value={store}>
              <HelmetProvider context={helmetContext}>
                <StaticRouter location={req.url}>
                  <App context={context} />
                </StaticRouter>
              </HelmetProvider>
            </StoreContext.Provider>,
          ).on('data', (chunk) => {
                body += chunk;
              })
              .on('error', (err) => {
                reject(err);
              })
              .on('end', () => {
                resolve({
                  body,
                  helmet: helmetContext?.helmet,
                });
              });
        }).then(({body, helmet}) => {
          const html = `
            <!doctype html>
            <html>
              <head>
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta charset="utf-8" />
                ${helmet.title.toString()}
                ${helmet.meta.toString()}
                ${helmet.link.toString()}
                <meta name="viewport" content="width=device-width, initial-scale=1">
                ${cssLinksFromAssets(assets, 'client')}
                <script>window.env = ${serialize(runtimeConfig)};</script>
                <script>window.__INITIAL_DATA__ = ${serialize(initData)};</script>
              </head>
              <body>
                <div id="root">${body}</div>
                ${jsScriptTagsFromAssets(assets, 'client', 'defer', 'crossorigin')}
              </body>
            </html>`;
          res.write(html);
          res.end();
        });
      }
    })
      .catch((error) => {
        return res.status(500).send(`got error ${error.stack}, ${error}`)
      })
  })

export default server
