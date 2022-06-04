import { createContext, useContext, useState,useRef } from "react";
import Numblock from "../pages/numblock";
import { useMediaQuery } from 'react-responsive'


export const NumbleContext = createContext();
export const NumbleUpdateContext = createContext();

export function NumbleProvider({ children }) {
    const [activeNumblock, setActiveNumblock] = useState({index:-1,num:0,x:-10,y:-10});
    const [tutorialMode, setTutorialMode] = useState(false);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [gameOver, setGameOver] = useState(false); 
    const [step,setStep] = useState(1);//Keeps track of what step of the tutorial user is on.
    const [numblock_grid, setNumblockGrid] = useState([]);
    const [score, setScore] = useState(0);
    const key_count = useRef(1);
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

    let handleTutorial = (checkPoint) => {
        if(tutorialMode & checkPoint === step){
            setStep(prevStep => prevStep + 1);
            console.log("Next Step");
        }
    }


    let updateNumblockGrid = (new_grid) => {
        setNumblockGrid(prevGrid => prevGrid = new_grid);
    }


  
    return (
      <NumbleContext.Provider value={{activeNumblock, numblock_grid, key_count, 
      tutorialMode, step, match_anim_status, gameOver,score, showLeaderboard}}>
          <NumbleUpdateContext.Provider value={{selectNumblock, deSelectNumblock, 
            updateNumblockGrid,setTutorialMode,handleTutorial, setStep,setGameOver, 
            setScore, setShowLeaderboard, getCubeWidth}}>
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