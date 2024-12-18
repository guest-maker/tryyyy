import styles from '../page.module.css'
import LikeList from './likeList'

export default function Home() {
  return (
    <div className={styles.main}>
      <div style={{ marginTop: '50px' }}>
        <LikeList />
      </div>
    </div>
  )
}
