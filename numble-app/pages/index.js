import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Grid from '../components/grid'
import Script from 'next/script'
import Page from '../components/next-seo'
import cub3skiGrids from '../src/cub3ski_grids'
import { useNumbleContext, useNumbleUpdateContext} from '../Contexts/numbleContext';
import { useEffect, useState, useRef } from 'react'



export default function Home() {
  //DEFINE STATE
  const {grid_key_count,gameMode, level} = useNumbleContext();
  const {setScore, setLevel, setGameMode} = useNumbleUpdateContext();
  const generatedGrid = useRef();
  


  const handleRefresh = (changeMode=false) => {
    if(gameMode === 0 && changeMode === false){
      setScore(0);
      localStorage.setItem("gameState",JSON.stringify({score:0,swaps:3,gridState:generatedGrid.current,gameStatus:"start"}));
    }
    localStorage.setItem("gameMode",JSON.stringify(gameMode.current));
    setGrid(prevGrid=> prevGrid = gen_grid());
  }
  
  const gen_grid = () => {
    //console.log("Generating grid...");\
  
    //let new_grid = [9,8,10,9,10,10,9,8,7,8,1,10,9,6,10,10,5,7,10,10,9,7,5,9,1]; //to test game over
    //let new_grid = [9,8,7,6,7,2,3,10,8,10,6,5,10,6,9,10,10,6,10,10,10,10,4,10,10]; //to test scoring
    //let new_grid = [9,8,7,6,7,2,3,10,8,10,6,5,10,6,9,10,10,6,10,10,10,10,4,10,10]; //to test cube swap
    //const new_grid = [1,2,2,3,2,1,2,3,4,3,3,1,4,1,1,3,2,1,3,3,9,8,3,6,5];
    /*generatedGrid = [3,2,10,2,2,
                      3,9,8,7,6,
                      2,1,3,1,1,
                      3,2,1,3,3,
                      3,8,3,6,5];*/
    
    let gridNumber = 0;
    let showScore = false;
    let showLevel = false;
    let swapCount = 3;
    let levelName = ""
    let gameState = JSON.parse(localStorage.getItem("gameState"));
    switch(gameMode.current){
      case 0:
        gridNumber = Math.floor(Math.random() * (cub3skiGrids[0].length));
        showScore = true;
        generatedGrid.current = gameState.gameStatus === "inProgress" ? gameState.gridState : [...cub3skiGrids[gameMode.current][gridNumber]];
        break;
      case 1:
        gridNumber = level.current - 1;
        showLevel = true;
        const levelObj = cub3skiGrids[gameMode.current][gridNumber];
        generatedGrid.current = [...levelObj.levelGrid];
        swapCount = levelObj.swapCount;
        levelName = levelObj.levelName;
        break;
    }
    console.log("Grid Number", gridNumber);   
  
    console.log("generated grid!", generatedGrid.current);
  
    const grid = <Grid key={grid_key_count.current} gameMode={gameMode.current} numblock_grid = {generatedGrid.current} 
    showScore={showScore} showLevel={showLevel} showSidebar={true} tutorialMode={false} swapCount={swapCount} levelName={levelName} refresh={handleRefresh}> </Grid>;
  
    grid_key_count.current++;
  
    return(grid);
  }

  const [grid, setGrid] = useState();

  const createLevelLocalStorage = () => {
    const levelLocalStorage = JSON.parse(localStorage.getItem("levelState"));
    if(levelLocalStorage === null){
      localStorage.setItem("levelState",JSON.stringify({currentLevel:1,levelsCompleted:Array(100).fill(0)}));
    }
    else{
      setLevel(levelLocalStorage.currentLevel);
    }
  }

  useEffect(()=>{
    createLevelLocalStorage();

    let gameState = JSON.parse(localStorage.getItem("gameState"));
    let mode = JSON.parse(localStorage.getItem("gameMode"));

    if(gameState === null){
      localStorage.setItem("gameState",JSON.stringify({score:0,swaps:3,gridState:[],gameStatus:"start"}));
      gameState = {score:0,swaps:3,gridState:[],gameStatus:"start"};
    }
    if(mode === null){
      setGameMode(0);
      localStorage.setItem("gameMode",JSON.stringify(0));
    }
    if(gameState.gameStatus === "inProgress"){
      setScore(gameState.score);

      setGameMode(mode);
      if(mode === 0){
        setGrid(<Grid key={grid_key_count.current} gameMode={mode} numblock_grid = {gameState.gridState} 
        showScore={true} showSidebar={true} tutorialMode={false} swapCount={gameState.swaps} refresh={handleRefresh}> </Grid>);
        grid_key_count.current++;
      }
      else{
        setGrid(gen_grid());
      }
    }
    else{
      setGrid(gen_grid());
    }
  },[])

  return (
    <div className={styles.container}>
      {Page()}
      
      <Head>
        <title>Cub3Ski - A fun number matching game!</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <link rel="icon" href="/favicon.ico" />
        <meta property='og:image' content='https://www.cub3ski.com/OG_Cub3Ski_img.png'/>

        <script async src="https://www.googletagmanager.com/gtag/js?id=G-MH7X1SE89W"></script>

        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4854069519190418"
        crossOrigin="anonymous"></script>

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
