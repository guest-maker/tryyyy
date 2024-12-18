import styles from '../page.module.css'
import AccountList from './accountList'

export default function Home() {
  return (
    <div className={styles.main}>
      <div style={{ marginTop: '50px' }}>
        <AccountList />
      </div>
    </div>
  )
}
