import { runtimeConfig } from '../config'
import BaseApi from '@garpix/base-api'
import { Page, PageModelType } from './interfaces/Page'

const API_URL = runtimeConfig.API_URL

const defaultSerializer = (data: any): any => data

const PAGES: { [key in PageModelType]: (data: any) => any } = {
  Page: defaultSerializer,
  MainPage: defaultSerializer,
  500: defaultSerializer,
  404: defaultSerializer
}

class Api extends BaseApi {
  AUTH_TOKEN_KEY: string

  constructor (MAIN_URL) {
    super(MAIN_URL)
    this.AUTH_TOKEN_KEY = 'auth_token_key'
  }

  getLanguage = (): string => 'ru'

  axiosOverride = (axios): any => {
    axios.defaults.headers.common['Accept-Language'] = this.getLanguage()
    return axios
  }

  getPage = async (pathname: string, queryParams = {}, axiosParams = {}): Promise<{ pageType: string, page: any }> => {
    try {
      const res: { data: Page } = await this.get(
          `/page/${pathname}`,
          queryParams,
          axiosParams
      )
      const page = res.data
      const serializer = PAGES[page.page_model]
      return {
        pageType: page.page_model,
        page: serializer(page)
      }
    } catch (error: any) {
      if (error?.response?.status === 404) {
        const serializer = PAGES['404']
        return {
          pageType: '404',
          page: serializer({})
        }
      }
      const serializer = PAGES['500']
      return {
        pageType: '500',
        page: serializer({})
      }
    }
  }
}

const api = new Api(`${String(API_URL)}`)

export {
  api
}
