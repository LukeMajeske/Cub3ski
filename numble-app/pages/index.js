import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Grid from './grid'
import Numblock from './numblock'
import Script from 'next/script'
import Instructions from './instructions'
import {useSpring, animated, config, useSprings, useTransition} from "react-spring";
import Page from './next-seo'


export default function Home() {
  let gen_grid = () => {
    console.log("Generating grid...");
    let new_grid = [9,8,7,6,7,10,9,8,7,8,1,10,9,6,10,10,5,7,10,10,9,7,5,8,1];
    //let new_grid = [1,2,2,3,2,1,2,3,4,3,3,1,4,1,1,3,2,1,3,3,9,8,3,6,5];

    return new_grid;
    /*for(var i = 1; i < 26; i++){
        var number = Math.floor(Math.random() * 10) + 1;
        new_grid.push(number);
        {<Component {...pageProps} />}
    }*/
  }

  return (
    <div className={styles.container}>

      {Page()}
      
      <Head>
        <title>Cub3Ski - A fun number matching game!</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <link rel="icon" href="/favicon.ico" />
        <meta property='og:image' content='https://www.cub3ski.com/OG_Cub3Ski_img.png'/>

        <script async src="https://www.googletagmanager.com/gtag/js?id=G-MH7X1SE89W"></script>

      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Cub3Ski
        </h1>
        <p>(cube-skee)</p>

        <Grid numblock_grid = {gen_grid()} showScore={true} showSidebar={true} tutorialMode={false}></Grid>

      </main>

      <div>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-MH7X1SE89W');
          `}
        </Script>
      </div>

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
