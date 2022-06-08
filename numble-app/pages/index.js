import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Grid from '../components/grid'
import Script from 'next/script'
import Page from '../components/next-seo'
import cub3skiGrids from '../src/cub3ski_grids'
import { useNumbleContext} from '../Contexts/numbleContext';
import { useState } from 'react'



export default function Home() {
  const handleRefresh = () => {
    setGrid(prevGrid=> prevGrid = gen_grid());
  }
  
  const gen_grid = () => {
    console.log("Generating grid...");
  
  
    //let new_grid = [9,8,10,9,10,10,9,8,7,8,1,10,9,6,10,10,5,7,10,10,9,7,5,9,1]; //to test game over
    //let new_grid = [9,8,7,6,7,2,3,10,8,10,6,5,10,6,9,10,10,6,10,10,10,10,4,10,10]; //to test scoring
    //let new_grid = [9,8,7,6,7,2,3,10,8,10,6,5,10,6,9,10,10,6,10,10,10,10,4,10,10]; //to test cube swap
    //const new_grid = [1,2,2,3,2,1,2,3,4,3,3,1,4,1,1,3,2,1,3,3,9,8,3,6,5];
  
    const new_grid = cub3skiGrids[Math.floor(Math.random() * (cub3skiGrids.length+1))];
  
    console.log("generate grid!", Math.random() * (cub3skiGrids.length+1));
  
    const grid = <Grid key={grid_key_count.current} numblock_grid = {new_grid} 
    showScore={true} showSidebar={true} tutorialMode={false} swapCount={3} refresh={handleRefresh}> </Grid>;
  
    grid_key_count.current++;
  
    return(grid);
  }

  //DEFINE STATE
  const {grid_key_count} = useNumbleContext();
  const [grid, setGrid] = useState(gen_grid());

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
        
        {grid}

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
          Copyright &copy; 2022 Luke Majeske. All Rights Reserved
        </a>
      </footer>
    </div>
  )
}
