import React from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Fetcher } from '@garpix/fetcher/fetcher/storeon'
import Home from '../Home'
import { PageModelType } from '@/api/interfaces/Page'

const PAGE_TYPES: { [key in PageModelType]: React.FC } = {
  Page: Home,
  MainPage: Home,
  500: () => <div>500</div>,
  404: () => <div>404</div>
}

const Combine = (props): React.ReactElement => {
  const params = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const match = {
    params
  }
  return (
    <Fetcher
      match={match}
      navigate={navigate}
      location={location}
      paramsKey='*'
      {...props}
    >
      {(data = {} as any) => {
        const pageType = data?.pageType
        const page = data?.page
        if (pageType === undefined) {
          return null
        }
        const Page = PAGE_TYPES[pageType]
        return <Page {...page} />
      }}
    </Fetcher>
  )
}

export default Combine
