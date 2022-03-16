export const runtimeConfig =
    typeof window === 'undefined'
      ? {
          // server
          API_URL: process?.env?.RAZZLE_API_URL ?? ''
        }
      : {
          // client
          // @ts-expect-error
          API_URL: window?.env?.API_URL === undefined ? window?.env?.API_URL : ''
        }
