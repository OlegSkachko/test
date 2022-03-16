import React from 'react'
import logo from './react.svg'
import styles from './Home.module.scss'
import { GxButton } from '@garpix/garpix-web-components-react'
import { Link } from 'react-router-dom'
import { useStoreon } from 'storeon/react'

const Home = (): React.ReactElement => {
  const { page } = useStoreon('page')
  const title = page.data.page.init_state.object.title
  return (
    <div className={styles.home}>
      <div className={styles['home-header']}>
        <img src={logo} className={styles['home-logo']} alt='logo' />
        <h2>Welcome to {title}</h2>
      </div>
      <p className={styles['home-intro']}>
        To get started, edit <code>src/App.js</code> or{' '}
        <code>src/Home.js</code> and save to reload.
      </p>
      <ul className={styles['home-resources']}>
        <li>
          <a href='https://github.com/jaredpalmer/razzle'>Docs</a>
        </li>
        <li>
          <a href='https://github.com/jaredpalmer/razzle/issues'>Issues</a>
        </li>
        <li>
          <a href='https://palmer.chat'>Community Slack</a>
        </li>
        <li>
          <Link to='/'>Home</Link>
        </li>
        <li>
          <Link to='/about'>About</Link>
        </li>
        <li>
          <GxButton>GX Button</GxButton>
        </li>
      </ul>
    </div>
  )
}

export default Home
