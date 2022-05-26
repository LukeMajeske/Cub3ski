import styles from '../styles/Home.module.css'
import Modal from './modal'
import Grid from './grid';
import { useNumbleContext, useNumbleUpdateContext} from '../Contexts/numbleContext';
import {useRef, useState, useEffect} from 'react';
import {BsFillQuestionCircleFill} from 'react-icons/bs';

export default  function Instructions(){
    const {step} = useNumbleContext();
    const {setTutorialMode, deSelectNumblock,setStep} = useNumbleUpdateContext();
    const [show,setShow] = useState(false);
    const [grid, setGrid] = useState([4,6]);
    
    let handleShow = () => {
        setShow(true);
        setTutorialMode(true);
        deSelectNumblock();
    }

    let handleClose = () => {
        setShow(false);
        setTutorialMode(false);
        setStep(prevStep => prevStep = 1);
        deSelectNumblock();
    }



    let displayText = () =>{
        console.log("Current Step: ", step);
        switch(step){
            case 1:
                return(<p><strong>1: </strong> Click to select one of the cubes below.</p>);
                break;
            case 2:
                return(<p><strong>2: </strong> Click the other cube to add them together.</p>);
                break;
            case 3:
                return(<p><strong>3: </strong> 10 is the highest number a cube can hold. Try adding the 2 cubes below.</p>);
                break;
            case 4:
                return(<p><strong>4: </strong>Score points by matching three or more numbers in a row! </p>);
                break;
            case 7:
            case 8:
                return(<p><strong>5: </strong>The game ends when there are no possible moves left. Refresh the page to restart. <br/>Good Luck!</p>);
                break;

        }

    }
    let displayGrid= () => {
        if(step === 4){
            //setGrid(prevGrid => prevGrid = [4,6,10,10]);
            return(<Grid key={3} numblock_grid={[4,6,10,10]} tutorialMode={true}></Grid>);
        }
        if(step === 7 || step === 8){
            //setGrid(prevGrid => prevGrid = [4,6,10,10]);
            return(<Grid key={4} numblock_grid={[9,7,4,8,5,3,8,8,3,9]} tutorialMode={true}></Grid>);
        }
        return(<Grid key={2} numblock_grid={[4,6]} tutorialMode={true}></Grid>);
    }
    let instructions = (<section className={styles.instructions}>
        {displayText()}
        {displayGrid()}

    </section>)

    return(
        <>
            <BsFillQuestionCircleFill className={styles.sidebarButton} onClick={()=> {handleShow()}}/>
            <Modal 
            onClose={()=>handleClose()} 
            show={show} 
            title={<strong>How to Play:</strong>}
            body={instructions}/>
        </>
    )
}