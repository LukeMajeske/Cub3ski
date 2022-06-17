import styles from '../styles/Home.module.css'
import Numblock from './numblock'
import { useNumbleContext, useNumbleUpdateContext} from '../Contexts/numbleContext'
import Score from './score'
import Instructions from './instructions'
import GameOver from './gameOver'
import GameMode from './gameMode'
import LeaderBoard from './leaderBoard'
import { useEffect, useRef, useState } from 'react';
import {scoreMatches,checkForMatches, randomNumber, 
    getEmptyIndexes,checkGameOver,checkForSwapCubes, getYPos} from '../numblock_functions/grid_functions';
import {useSpringRef, useSprings, config} from "react-spring";
import Swap from './swap'
import RefreshGrid from './refreshGrid'

export default function Grid(props){
    const [numblock_grid,setNumblockGrid] = useState(props.numblock_grid);
    const [mode, setMode] = useState(1)//0=endlessMode, 1=puzzleMode
    const size = props.numblock_grid.length;
    const tutorialMode = props.tutorialMode;
    const [numblocks, setNumblocks] = useState([]);
    const initial_render = useRef(0);
    const empty_indexes = useRef([]);
    const cur_grid = useRef(props.numblock_grid);
    //const [swapCount, setSwapCount] = useState(3);//When > 0, cubes whose sum > 10 can be swapped.
    const {key_count,match_anim_status,score} = useNumbleContext();
    const {handleTutorial,handleGameOver, handleAddToScore, getCubeWidth} = useNumbleUpdateContext();
    const swapCount = useRef(props.swapCount);
    let minHeight = ((Math.floor((cur_grid.current.length)/6)+1)*getCubeWidth())+'px';
    //console.log("minHeight",minHeight);

    const decrementSwapCount=()=>{
        swapCount.current--;
    }
    const setSwapCount=(count)=>{
        swapCount.current = count;
    }
    const addToSwapCount=(count)=>{
        swapCount.current += count;
    }

    const [springs,api] = useSprings(size, index => ({
        from:{y:-(5*getCubeWidth()), x:0, opacity:0,scale:1,zIndex:1},
        to:{y:0, x:0, opacity:1, scale:1,zIndex:1},
        delay:400,
        config: {mass:2,tension:250,bounce:1},
        immediate: key => key === "zIndex"
    }));

    const swapIncrementOnFiveChain = (matches) =>{
        //If player makes a chain of 5, +1 swap
        for(const match of matches){
            if (match.length === 5){
                addToSwapCount(1);
            }
        }
    }

    let handleMatchCheck = () =>{
        if(cur_grid.current === undefined){
            return;
        }
        empty_indexes.current = checkForMatches(cur_grid.current);
        swapIncrementOnFiveChain(empty_indexes.current);
        addToSwapCount(checkForSwapCubes(cur_grid.current,empty_indexes.current));

        //console.log("empty indexs: ", empty_indexes.current);
        if(empty_indexes.current.length > 0){
            if(!tutorialMode){
                //Before removing the matches, empty_indexes.current represents the current matches on the grid.
                const addScore = scoreMatches(cur_grid.current, empty_indexes.current);
                handleAddToScore(addScore);   
            }

            removeMatches(empty_indexes.current);
            
        }
        else{
            //console.log("No matches found");
            return;

        }
    }
    let handleDropPhase = () => {
        //console.log("Drop Phase");
    }
    let handleGridUpdate = () => {
        if(cur_grid.current !== undefined){
            //console.log("updating after drop:",cur_grid.current);
            setNumblockGrid(prevGrid => prevGrid = cur_grid.current);
        }
    }
    let setDropNumblock = (numblock_index, yDir=-1) => {
        api.start(index => {
            if (index === numblock_index){
                return({
                    from:{y:getCubeWidth()*yDir, x:0, opacity:1,scale:1,zIndex:1},
                    to:{y:0, x:0, opacity:1,scale:1,zIndex:1},
                    onStart: ()=>{handleDropPhase()},
                    onRest: ()=>{handleMatchCheck()},
                    config: config.stiff,
                    immediate: key => key === "zIndex"
                });
            }
        })
    }

    let setMatchNumblock = (numblock_index) => {
        api.start(index => {
            if (index === numblock_index){
                //console.log("Starting anim for index: ", index);
                return({
                    from:{opacity:1,scale:1},
                    to:[{opacity:1, scale:0.5},
                        {opacity:1, scale:1},
                        {opacity:0,scale:0}],
                    onStart:() => {match_anim_status.current = true;},
                    onRest:()=>{match_anim_status.current = false; dropNumblocks(cur_grid.current); handleTutorial(4,5);},
                    config:{tension:450,friction:30}
                    
                });
            }
        })
    }

    let removeMatches = (match_indexes) => {
        match_indexes = match_indexes.flat();
        match_indexes = [...new Set(match_indexes)];
        //console.log("Remove Matches",match_indexes);
        match_indexes.forEach(index => {
            setMatchNumblock(index);
            cur_grid.current[index] = "";
        })

    }

    let newNumblocks = (dropDirection = -1) => {
        //fill in empty spaces with new numbers
        //console.log("New Numblocks", cur_grid.current);
        if(mode === 0){//If in endless mode
            for(var i = size; i >= 0; i--){
                if(cur_grid.current[i] == ""){
                    cur_grid.current[i] = randomNumber();
                    setDropNumblock(i, dropDirection);
                }
            }
        }
        updateNumblocks();
    }

    let createNumblock = (index, animation, num=cur_grid.current[index]) =>{ 
        let xpos = (index) % 5;
        let ypos = Math.floor((index)/5);
        let numblock = <Numblock key={key_count.current}
                            num={num} 
                            x={xpos} y={ypos} 
                            index={index}
                            updateGrid={updateGrid}
                            decrementSwapCount = {decrementSwapCount}
                            swapCount = {swapCount.current}
                            tutorialMode={tutorialMode}
                            animation = {animation}
                            anim_api = {api}
                            />;
        key_count.current += 1;
        return(numblock)
    }

    let initNumblocks = () =>{
        let new_numblocks = [];

        for(var i = 1; i < size+1; i++){
            //console.log(springs[i-1]);
            new_numblocks.push(createNumblock(i-1,springs[i-1]));
        }



        initial_render.current += 1;
        setNumblocks(prevBlocks => prevBlocks = new_numblocks);
    }

    let updateNumblocks = () => {
        //console.log("Update Numblocks...");
        let new_numblocks = [];

        
        for(var i = 1; i < size+1; i++){
            new_numblocks.push(createNumblock(i-1,springs[i-1]));
            //new_numblocks.push(createNumblock(i-1,match_spring));
        }
        //console.log(new_numblocks);

        //If there are no matches on the board, check to see if the game is over
        if(!tutorialMode){
            handleGameOver(checkGameOver(cur_grid.current, swapCount.current));
            //Save grid state into local storage
            //gameStatus:start,inProgress, gameOver
            //console.log("Localstorage Score:",score.current);
            localStorage.setItem("gameState",JSON.stringify({score:score.current,swaps:swapCount.current,gridState:cur_grid.current,gameStatus:"inProgress"}));
        }
        setNumblocks(prevBlocks => prevBlocks = new_numblocks);
    }

    //If numblock has empty space beneath it, let it drop to the bottom.
    //give index or indexes of empty spaces
    let dropNumblocks = (grid,dropDirection = -5) => {
        if(mode != 0){//if not in endless mode, always drop cubes downwards;
            dropDirection = -5;
        }
        if(match_anim_status.current === true){
            return;
        }
        let emptyIndexes = getEmptyIndexes(grid);
        let drop_grid = [...grid];
        emptyIndexes.forEach(startIndex => {
            let searchIndex = startIndex + dropDirection;
            let new_numblocks = [];
            while(searchIndex >= 0 && searchIndex <= 24){
                //console.log("Drop Search Index:",searchIndex);
                if(drop_grid[searchIndex] !== ""){
                    drop_grid[startIndex] = drop_grid[searchIndex];
                    drop_grid[searchIndex] = "";
                    setDropNumblock(startIndex, Math.sign(dropDirection)); //Math.sign(x) gives the direction which to drop numblocks. Positive is up, negative is down.
                    startIndex += dropDirection;
                    //console.log("Drop!");
                }
                searchIndex += dropDirection;
            }
        })
        cur_grid.current = drop_grid;
        newNumblocks(Math.sign(dropDirection));
        updateNumblocks();
    }

    let getNumblocks = () =>{
        //console.log("Rendering Numblocks",numblocks);
        return (<div className={styles.grid} style={{minHeight:minHeight,height:minHeight}}>
                    {numblocks}
                </div>);
    }

    let updateGrid = (numblocksUpdate, updateGridOnly = false, swap = false, dropDirection = -1) => {
        //Adding two numblocks together
        //console.log("Updating Grid");
        let activeIndex = [numblocksUpdate[1].index];
        
        numblocksUpdate.forEach(numblock => {
            cur_grid.current[numblock.index] = numblock.num;
        });
        
        //repeat until there are no matches or empty spaces
        //empty_indexes.current = activeIndex;
        
        if(updateGridOnly === true){
            newNumblocks();
            updateNumblocks();
        }
        else if(swap === true){
            handleMatchCheck();
        }
        else{
            dropNumblocks(cur_grid.current, dropDirection * 5);
        }
        

    }

    let renderGrid = () => {
        if(tutorialMode){
            return(
                <>
                    {getNumblocks()}
                </> 
            )
        }
        return(
            <>
            {props.showScore ? <div className={styles.topbar}><Score/><Swap swapCount={swapCount.current}/></div> : null}
            <div className={styles.instructGrid}>
                {props.showSidebar ?
                    <div className={styles.sidebar}>
                            <Instructions/>
                            <RefreshGrid refresh={props.refresh} setSwapCount={setSwapCount}/>
                            <GameOver/>
                            <LeaderBoard/>
                            <button className={styles.sidebarButton} onClick={()=>handleGameOver(true)}>End Game</button>
                            <GameMode/>
                    </div>
                    : null}

                <div className={styles.gridCont}>
                    {getNumblocks()}
                </div>

            </div>
            </>
        )
    }




    useEffect(()=>{        
        if(initial_render.current === 0){
            initNumblocks();
        }
    },[])

    return(renderGrid())
}