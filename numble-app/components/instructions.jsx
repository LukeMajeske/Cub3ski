import styles from '../styles/Home.module.css'
import Modal from './modal'
import Grid from './grid';
import { useNumbleContext, useNumbleUpdateContext} from '../Contexts/numbleContext';
import {useRef, useState, useEffect} from 'react';
import {BsFillQuestionCircleFill} from 'react-icons/bs';

export default  function Instructions(){
    const {step} = useNumbleContext();
    const {setTutorialMode, deSelectNumblock,setStep} = useNumbleUpdateContext();
    const [showOnLoad,setShowOnLoad] = useState(false);
    const [show,setShow] = useState(false);
    const [grid, setGrid] = useState([4,6]);
    
    const handleShow = () => {
        setShow(true);
        setTutorialMode(true);
        deSelectNumblock();
    }

    const handleClose = () => {
        setShow(false);
        setTutorialMode(false);
        setStep(prevStep => prevStep = 1);
        deSelectNumblock();
    }

    const handleShowOnLoad = () =>{
        localStorage.setItem("showTutorial",JSON.stringify(!showOnLoad));
        setShowOnLoad(!showOnLoad);
    }



    let displayText = () =>{
        //console.log("Current Step: ", step);
        switch(step){
            case 1:
                return(<p><strong>{step}: </strong> Click to select one of the cubes below.</p>);
                break;
            case 2:
                return(<p><strong>{step}: </strong> Click the other cube to add them together.</p>);
                break;
            case 3:
                return(<p><strong>{step}: </strong> 10 is the highest number a cube can hold. Combining two cubes whose sum is greater than 
                10 will swap their positions. However, you can only swap a limited amount of times. Try swapping the cubes below!</p>);
                break;
            case 4:
                return(<p><strong>{step}: </strong>Score points by matching three or more numbers in a row! </p>);
                break;
            case 5:
                return(<p><strong>{step}: </strong>Introducing the new Swap Cube! It can be used as any number to complete a match of 3 or more! When using the Swap Cube 
                to complete a match, you also gain a +1 extra swap!</p>);
                break;
            case 6:
                return(<p><strong>{step}: </strong>The game ends when there are no possible moves left. Refresh the page to restart. <br/>Good Luck!</p>);
                break;

        }

    }
    let displayGrid= () => {
        if(step === 4){
            //setGrid(prevGrid => prevGrid = [4,6,10,10]);
            return(<Grid key={3} numblock_grid={[4,6,10,10]} tutorialMode={true} swapCount={0}></Grid>);
        }
        if(step === 5){
            //setGrid(prevGrid => prevGrid = [4,6,10,10]);
            return(<Grid key={4} numblock_grid={[11,10,10]} tutorialMode={true} swapCount={1}></Grid>);
        }
        if(step === 6){
            //setGrid(prevGrid => prevGrid = [4,6,10,10]);
            return(<Grid key={5} numblock_grid={[9,7,4,8,5,3,8,8,3,9]} tutorialMode={true} swapCount={0}></Grid>);
        }
        return(<Grid key={2} numblock_grid={[4,6]} tutorialMode={true} swapCount={1}></Grid>);
    }

    const displayButtons = () => {
        let buttons = []
        if(step != 1){
            buttons.push(<button onClick={()=>setStep(prevStep=>prevStep -= 1)}>Back</button>);
        }
        if(step != 6){
            buttons.push(<button onClick={()=>setStep(prevStep=>prevStep += 1)}>Next</button>);
        }
        buttons.push(<label><input type="checkbox" checked={!showOnLoad} onChange={handleShowOnLoad}/>Don't Show Me This Again</label>);
        return(buttons);

    }
    let instructions = (<section className={styles.instructions}>
        {displayText()}
        {displayGrid()}
        {displayButtons()}

    </section>)


    useEffect(()=>{
        let showTutorial = JSON.parse(localStorage.getItem("showTutorial"));

        if (showTutorial === null){
            localStorage.setItem("showTutorial","true");
            setShowOnLoad(true);
            showTutorial = true;
        }
        if(showTutorial === true){
            setShowOnLoad(true);
            handleShow();
        }
    },[]) 

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