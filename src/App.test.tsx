import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { StoreContext } from 'storeon/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'
import { createStoreon } from 'storeon'
import { storeonParams } from './store'

const store = createStoreon(storeonParams)

test('renders learn react link', async () => {
  const { container } = render(
    <StoreContext.Provider value={store}>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </StoreContext.Provider>
  )
  await waitFor(() => {
    expect(container.childElementCount).toEqual(0)
  })
})
