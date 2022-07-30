import {useState, useEffect, useRef} from "react";
import { useCub3skiContext, useCub3skiUpdateContext} from '../Contexts/cub3skiContext';
import Modal from '../components/modal'
import {DataStore} from 'aws-amplify';
import {Highscores} from "../src/models";


export default function PuzzleEnd(props){
    const {showPuzzleEnd} = useCub3skiContext();
    const {setShowPuzzleEnd,setPuzzleEnd, incrementLevel} = useCub3skiUpdateContext();
    const RefreshGrid = props.refresh;


    let handleClose = () => {
        setShowPuzzleEnd(false);
    }

    const handleNextPuzzle = () => {
        incrementLevel();
        setShowPuzzleEnd(false);
        setPuzzleEnd(false);
        RefreshGrid();
    }

    let puzzleEndBody = () =>{
        return(
        <>
            <p>Puzzle Solved!</p>
            <button onClick={()=>{handleNextPuzzle()}}>Next Puzzle</button>
        </>
        )
    }

    return(
        <Modal 
        onClose={()=>handleClose(false)} 
        show={showPuzzleEnd} 
        title={<strong>Congrats!</strong>}
        body={puzzleEndBody()}/>
    )
}