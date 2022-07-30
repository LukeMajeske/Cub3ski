import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Grid from '../components/grid'
import Script from 'next/script'
import Page from '../components/next-seo'
import cub3skiGrids from '../src/cub3ski_grids'
import { useCub3skiContext, useCub3skiUpdateContext} from '../Contexts/cub3skiContext';
import { useEffect, useState, useRef } from 'react'
import{FaFacebookSquare} from 'react-icons/fa'



export default function Home() {
  const {grid_key_count,gameMode, level} = useCub3skiContext();
  const {setScore, setLevel, setGameMode, setSoundEnable} = useCub3skiUpdateContext();
  const generatedGrid = useRef();
  const [grid, setGrid] = useState();

  const handleRefresh = (changeMode=false) => {
    setGrid(prevGrid=> prevGrid = gen_grid());
    if(gameMode.current === 0 && changeMode === false){
      console.log("reset");
      setScore(0);
      localStorage.setItem("gameState",JSON.stringify({score:0,swaps:3,gridState:generatedGrid.current,gameStatus:"start"}));
    }
    localStorage.setItem("gameMode",JSON.stringify(gameMode.current));
  }
  
  const gen_grid = () => {    
    let gridNumber = 0;
    let showScore = false;
    let showLevel = false;
    let swapCount = 3;
    let levelName = "";
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
  
    const grid = <Grid key={grid_key_count.current} 
    gameMode={gameMode.current} 
    cube_grid = {generatedGrid.current} 
    showScore={showScore} 
    showLevel={showLevel} 
    showSidebar={true} 
    tutorialMode={false} 
    swapCount={swapCount} 
    levelName={levelName} 
    refresh={handleRefresh}>
    </Grid>;
  
    grid_key_count.current++;
  
    return(grid);
  }

  

  const createLevelLocalStorage = () => {
    const levelLocalStorage = JSON.parse(localStorage.getItem("levelState"));
    if(levelLocalStorage === null){
      localStorage.setItem("levelState",JSON.stringify({currentLevel:1,levelsCompleted:Array(100).fill(0)}));
    }
    else{
      setLevel(levelLocalStorage.currentLevel);
    }
  }

  const createSoundLocalStorage = () => {
    let soundEnableLocalStorage = JSON.parse(localStorage.getItem("soundEnable"));

    if (soundEnableLocalStorage  === null){
        localStorage.setItem("soundEnable","true");
        setSoundEnable(true);
    }
    if(soundEnableLocalStorage === true){
        setSoundEnable(true);
    }
  }

  useEffect(()=>{
    createLevelLocalStorage();
    createSoundLocalStorage();

    let gameState = JSON.parse(localStorage.getItem("gameState"));
    let mode = JSON.parse(localStorage.getItem("gameMode"));

    //Check Local Storage, initialize local storage if game state or mode is null;
    if(gameState === null){
      localStorage.setItem("gameState",JSON.stringify({score:0,swaps:3,gridState:[],gameStatus:"start"}));
      gameState = {score:0,swaps:3,gridState:[],gameStatus:"start"};
    }
    //If game mode is null, start the game in Puzzle Mode
    if(mode === null){
      setGameMode(1);
      localStorage.setItem("gameMode",JSON.stringify(1));
    }
    //If there was a game in progress, generate grid from gameState in local storage.
    if(gameState.gameStatus === "inProgress"){
      setScore(gameState.score);

      setGameMode(mode);
      //If game mode in local storage is set to Endless mode "0", generate grid from gameState in localStorage.
      if(mode === 0){
        setGrid(<Grid key={grid_key_count.current} gameMode={mode} cube_grid = {gameState.gridState} 
        showScore={true} showSidebar={true} tutorialMode={false} swapCount={gameState.swaps} refresh={handleRefresh}> </Grid>);
        grid_key_count.current++;
      }
      //Else use gen_grid() to generate grid for puzzle mode.
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
      <nav className={styles.navbar}>
        <a href='https://www.facebook.com/Cub3Ski-114386264612649'>
          <FaFacebookSquare className={styles.mediaIcon} color='#4267B2'size='1.5em'/>
        </a>
      </nav>
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
