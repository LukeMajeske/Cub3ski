import { createContext, useContext, useState,useRef } from "react";
import { useMediaQuery } from 'react-responsive'
import cub3skiGrids from '../src/cub3ski_grids'


export const NumbleContext = createContext();
export const NumbleUpdateContext = createContext();

export function NumbleProvider({ children }) {
    const [activeNumblock, setActiveNumblock] = useState({index:-1,num:0,x:-10,y:-10});
    const [tutorialMode, setTutorialMode] = useState(false);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [puzzleEnd, setPuzzleEnd] = useState(false);
    const [showGameOver, setShowGameOver] = useState(false);
    const [showPuzzleEnd, setShowPuzzleEnd] = useState(false);
    const [step,setStep] = useState(1);//Keeps track of what step of the tutorial user is on.
    const [numblock_grid, setNumblockGrid] = useState([]);
    //const [score, setScore] = useState(0);
    const gameMode = useRef(0)//0=endless, 1=puzzle
    const level = useRef(1);//Represents the current level for puzzle mode.
    const score = useRef(0);
    const key_count = useRef(1);//For cubes
    const grid_key_count = useRef(1);//For grids
    const match_anim_status = useRef(false); //True = match animation is in process
    //CHANGE CUBE ANIMATIONS BASED ON MEDIA QUERY
    const isMobile = useMediaQuery({ query: '(max-width: 467px)' });
    const isTinyMobile = useMediaQuery({ query: '(max-width: 330px)' })
    
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
        if(level.current+1 >= 0){
            level.current--;
            let levelState = JSON.parse(localStorage.getItem('levelState'));
            levelState.currentLevel = level.current;
            localStorage.setItem('levelState',JSON.stringify(levelState));
        }
        else{
            alert("There is no 0th level.");
        }

    }

    

    let selectNumblock = (numblock) =>{ 
        /*if(tutorialMode){
            setActiveTutorialNumblock(prevNumblock => prevNumblock = numblock);
            return;
        }*/
        setActiveNumblock(prevNumblock => prevNumblock = numblock);
    }

    let deSelectNumblock = () => {
        /*if(tutorialMode){
            setActiveTutorialNumblock(prevNumblock => prevNumblock = {index:-1,num:0,x:-10,y:-10});
            return;
        }*/
        setActiveNumblock(prevNumblock => prevNumblock = {index:-1,num:0,x:-10,y:-10});

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
            levelState.levelsCompleted[level.current] = 1;
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

    let updateNumblockGrid = (new_grid) => {
        setNumblockGrid(prevGrid => prevGrid = new_grid);
    }


  
    return (
      <NumbleContext.Provider value={{activeNumblock, numblock_grid, key_count, 
      tutorialMode, step, match_anim_status,gameOver,showGameOver,score, level, showLeaderboard, grid_key_count, gameMode, showPuzzleEnd}}>
          <NumbleUpdateContext.Provider value={{selectNumblock, deSelectNumblock, 
            updateNumblockGrid,setTutorialMode,handleTutorial, setStep,handleGameOver, handlePuzzleComplete,setShowGameOver, 
            handleAddToScore, setScore,setShowLeaderboard, getCubeWidth, setGameMode, setLevel, setShowPuzzleEnd,setPuzzleEnd, decrementLevel, incrementLevel}}>
            {children}
          </NumbleUpdateContext.Provider>
      </NumbleContext.Provider>
    );
}

export function useNumbleContext() {
    return useContext(NumbleContext);
}

export function useNumbleUpdateContext() {
    return useContext(NumbleUpdateContext);
}