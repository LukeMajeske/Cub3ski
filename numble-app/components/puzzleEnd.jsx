import {useState, useEffect, useRef} from "react";
import { useNumbleContext, useNumbleUpdateContext} from '../Contexts/numbleContext';
import Modal from '../components/modal'
import {DataStore} from 'aws-amplify';
import {Highscores} from "../src/models";


export default function PuzzleEnd(props){
    const {showPuzzleEnd} = useNumbleContext();
    const {setShowPuzzleEnd,setPuzzleEnd, incrementLevel} = useNumbleUpdateContext();
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