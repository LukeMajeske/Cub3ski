import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Grid from './grid'
import Numblock from './numblock'
import Instructions from './instructions'
import {useSpring, animated, config, useSprings, useTransition} from "react-spring";


export default function Home() {
  let gen_grid = () => {
    console.log("Generating grid...");
    let new_grid = [1,2,2,3,2,1,2,3,4,3,3,1,4,1,1,3,2,1,3,3,9,8,3,6,5];

    return new_grid;
    /*for(var i = 1; i < 26; i++){
        var number = Math.floor(Math.random() * 10) + 1;
        new_grid.push(number);
        {<Component {...pageProps} />}
    }*/
  }


  return (
    <div className={styles.container}>
      
      <Head>
        <title>Cub3Ski</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Cub3Ski
        </h1>
        <p>(cube-skee)</p>

        <Grid numblock_grid = {gen_grid()}></Grid>




      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <img src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
