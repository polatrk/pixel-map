import styles from '../../css/Loader.module.css'

const Loader = () => {
  return (
    <div style={{backgroundColor: 'white'}}>
        <div className={styles.loader}></div>
    </div>
  )
}

export default Loader