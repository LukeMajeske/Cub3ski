import {useState} from "react";
import { useNumbleContext, useNumbleUpdateContext} from '../Contexts/numbleContext';
import Modal from './modal'


export default function GameOver(){
    const {gameOver} = useNumbleContext();
    const {setGameOver} = useNumbleUpdateContext();
    //const [show,setShow] = useState(false);

    let handleClose = () => {
        setGameOver(false);
    }

    return(
        <Modal 
        onClose={()=>handleClose(false)} 
        show={gameOver} 
        title={<strong>Thanks for playing!</strong>}
        body="GAME OVER"/>
    )
}