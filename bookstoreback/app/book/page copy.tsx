import styles from '../page.module.css'
import BookList from './bookList'

export default function Home() {
  return (
    <div className={styles.main}>
      <div style={{ marginTop: '50px' }}>
        <BookList />
      </div>
    </div>
  )
}
