import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <h1>Login using google</h1>
      <a href="http://localhost:3000/auth/google">Google Login</a>
    </div>
  )
}

export default Home
