import { createContext, useContext, useState,useRef } from "react";
import { useMediaQuery } from 'react-responsive'
import cub3skiGrids from '../src/cub3ski_grids'
import useSound from 'use-sound'
import soundSpriteMap from '../public/sounds/Cub3Ski_SpriteMapWNotes.mp3';



export const Cub3skiContext = createContext();
export const Cub3skiUpdateContext = createContext();

export function Cub3skiProvider({ children }) {
    const [activeCube, setActiveCube] = useState({index:-1,num:0,x:-10,y:-10});
    const [tutorialMode, setTutorialMode] = useState(false);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [puzzleEnd, setPuzzleEnd] = useState(false);
    const [showGameOver, setShowGameOver] = useState(false);
    const [showPuzzleEnd, setShowPuzzleEnd] = useState(false);
    const [step,setStep] = useState(1);//Keeps track of what step of the tutorial user is on.
    const [soundEnable, setSoundEnable] = useState(false);
    const gameMode = useRef(1)//0=endless, 1=puzzle
    const level = useRef(1);//Represents the current level for puzzle mode.
    const score = useRef(0);
    const key_count = useRef(1);//For cubes
    const grid_key_count = useRef(10);//For grids
    const match_anim_status = useRef(false); //True = match animation is in process
    
    //CHANGE CUBE ANIMATIONS BASED ON MEDIA QUERY
    const isMobile = useMediaQuery({ query: '(max-width: 467px)' });
    const isTinyMobile = useMediaQuery({ query: '(max-width: 330px)' })

    //SOUNDS
    const[playbackRate, setPlaybackRate] = useState(1);

    const spriteMap = {
        disableSound: [0,503],
        swapSound: [503,578],
        enableSound: [1081,501],
        matchSound:[1582,59],
        deselectSound:[1641,240],
        selectSound1:[1641,240],
        selectSound2:[1881,240],
        selectSound3:[2122,240],
        selectSound4:[2362,240],
        selectSound5:[2602,240],
        selectSound6:[2843,240],
        selectSound7:[3083,240],
        selectSound8:[3324,240],
        selectSound9:[3564,240],
        selectSound10:[3804,240],
        selectSound11:[4045,240],


    }
    const[playSound,sound] = useSound(soundSpriteMap,
        {volume:0.25,
        playbackRate:playbackRate,
        soundEnabled:soundEnable,
        sprite:spriteMap,interrupt:true
    });
    const[playUnmutableSound] = useSound(soundSpriteMap,{volume:0.25,sprite:{disableSound: [0,503],enableSound: [1081,501],matchSound:[1582,59]}});
    
    const getCubeWidth = () =>{
        if(isTinyMobile){
            return 55;
        }
        else if(isMobile){
            return 60;
        }
        return 80;
    }

    const setGameMode = (mode) =>{
        gameMode.current = mode;
    }

    const setLevel = (newLevel) =>{
        level.current = newLevel;
    }

    const incrementLevel = () => {
        if(level.current+1 <= cub3skiGrids[1].length){
            level.current++;
            let levelState = JSON.parse(localStorage.getItem('levelState'));
            levelState.currentLevel = level.current;
            localStorage.setItem('levelState',JSON.stringify(levelState));
        }
        else{
            alert("There are no more levels :(");
        }

    }

    const decrementLevel = () => {
        if(level.current-1 > 0){
            level.current--;
            let levelState = JSON.parse(localStorage.getItem('levelState'));
            levelState.currentLevel = level.current;
            localStorage.setItem('levelState',JSON.stringify(levelState));
        }
        else{
            alert("There is no 0th level.");
        }

    }
    

    let selectCube = (cube,soundToPlay) =>{
        playSound({id:soundToPlay});
        
        //setPlaybackRate(prevRate => prevRate = 1);
        setActiveCube(prevCube => prevCube = cube);
    }

    let deSelectCube = (doSound=true) => {
        console.log("Do deselect sound",doSound);
        doSound?playSound({id:'deselectSound'}):null;
        setActiveCube(prevCube => prevCube = {index:-1,num:0,x:-10,y:-10});
    }

    let handleTutorial = (...args) => {
        if(tutorialMode & args.includes(step)){
            setStep(step + 1);
            console.log("Next Step");
        }
    }

    const handleGameOver = (gameOver) => {
        setGameOver(gameOver);
        setShowGameOver(gameOver);
        localStorage.setItem("gameState",JSON.stringify({score:0,swaps:3,gridState:[],gameStatus:"gameOver"}));
    }

    const handlePuzzleComplete = (puzzleComplete) => {
        if(puzzleComplete){
            let levelState = JSON.parse(localStorage.getItem("levelState"));
            levelState.levelsCompleted[level.current-1] = 1;
            localStorage.setItem("levelState",JSON.stringify(levelState));
            setShowPuzzleEnd(true);
            setPuzzleEnd(true);
        }
    }

    const handleAddToScore = (addToScore) =>{
        score.current += addToScore;
    }

    const setScore= (newScore) =>{
        score.current = newScore;
    }

    let updateCubeGrid = (new_grid) => {
        setCubeGrid(prevGrid => prevGrid = new_grid);
    }

  
    return (
      <Cub3skiContext.Provider value={{activeCube, key_count, 
      tutorialMode, step, match_anim_status,gameOver,showGameOver,score, level, showLeaderboard, grid_key_count, gameMode,soundEnable, showPuzzleEnd}}>
          <Cub3skiUpdateContext.Provider value={{selectCube, deSelectCube, 
            updateCubeGrid,setTutorialMode,handleTutorial, setStep,handleGameOver, handlePuzzleComplete,setShowGameOver, 
            handleAddToScore, setScore,setShowLeaderboard, getCubeWidth, setGameMode, 
            setLevel, setShowPuzzleEnd,setPuzzleEnd, 
            decrementLevel, incrementLevel, setSoundEnable,playSound,playUnmutableSound, setPlaybackRate}}>
            {children}
          </Cub3skiUpdateContext.Provider>
      </Cub3skiContext.Provider>
    );
}

export function useCub3skiContext() {
    return useContext(Cub3skiContext);
}

export function useCub3skiUpdateContext() {
    return useContext(Cub3skiUpdateContext);
}