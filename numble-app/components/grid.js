import styles from '../styles/Home.module.css'
import Cube from './cube'
import { useCub3skiContext, useCub3skiUpdateContext} from '../Contexts/cub3skiContext'
import Score from './score'
import Instructions from './instructions'
import GameOver from './gameOver'
import GameMode from './gameMode'
import LeaderBoard from './leaderBoard'
import Level from './level'
import { useEffect, useRef, useState } from 'react';
import {scoreMatches,checkForMatches, randomNumber, 
    getEmptyIndexes,checkGameOver,checkForSwapCubes, checkPuzzleComplete} from '../cub3ski_functions/grid_functions';
import {useSprings, config} from "react-spring";
import Swap from './swap'
import RefreshGrid from './refreshGrid'
import PuzzleEnd from './puzzleEnd'
import SoundToggle from './soundToggle'

export default function Grid(props){
    const [mode, setMode] = useState(props.gameMode)//0=endlessMode, 1=puzzleMode
    const size = props.cube_grid.length;
    const tutorialMode = props.tutorialMode;
    const [cubes, setCubes] = useState([]);
    const initial_render = useRef(0);
    const cube_ref = useRef();
    const empty_indexes = useRef([]);//Used to track empty spaces in the grid.
    const cur_grid = useRef(props.cube_grid);
    const unmounted = useRef(false);
    const refreshGrid = props.refresh;
    const {key_count,match_anim_status,score,level} = useCub3skiContext();
    const {handleGameOver, handleAddToScore, getCubeWidth, 
        handlePuzzleComplete,incrementLevel, decrementLevel} = useCub3skiUpdateContext();
    const swapCount = useRef(props.swapCount);
    let minHeight = ((Math.floor((cur_grid.current.length)/6)+1)*getCubeWidth())+'px';

    const decrementSwapCount=()=>{
        swapCount.current--;
    }
    const setSwapCount=(count)=>{
        swapCount.current = count;
    }
    const addToSwapCount=(count)=>{
        swapCount.current += count;
    }

    const handlePrevLevel=()=>{
        decrementLevel();
        refreshGrid();
    }

    const handleNextLevel=()=>{
        incrementLevel();
        refreshGrid();
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

    const handleMatchCheck = () =>{
        console.log("Running match check");
        if(cur_grid.current === undefined){
            console.log("grid is undefined for match check");
            return;
        }
        empty_indexes.current = checkForMatches(cur_grid.current);
        swapIncrementOnFiveChain(empty_indexes.current);
        addToSwapCount(checkForSwapCubes(cur_grid.current,empty_indexes.current));

        console.log("empty indexs: ", empty_indexes.current);
        if(empty_indexes.current.length > 0){
            if(!tutorialMode){
                //Before removing the matches, empty_indexes.current represents the current matches on the grid.
                if(mode === 0){
                    const addScore = scoreMatches(cur_grid.current, empty_indexes.current);
                    handleAddToScore(addScore);   
                }

            }

            removeMatches(empty_indexes.current);
            
        }
        else{
            //console.log("No matches found");
            return;

        }
    }

    const setDropCube = (cube_index, yDir=-1, isLastCube = false) => {
        api.start(index => {
            if (index === cube_index){
                return({
                    from:{y:getCubeWidth()*yDir, x:0, opacity:1,scale:1,zIndex:1},
                    to:{y:0, x:0, opacity:1,scale:1,zIndex:1},
                    onRest: ()=>{console.log("Match Check After match animation"); if(isLastCube){handleMatchCheck()}},
                    config: config.stiff,
                    immediate: key => key === "zIndex"
                });
            }
        })
    }

    const removeMatches = (match_indexes) => {
        match_indexes = match_indexes.flat();
        match_indexes = [...new Set(match_indexes)];
        let delay = 0;
        match_indexes.forEach((cubeIndex, ind) => {
            if(ind === match_indexes.length-1){
                console.log("Last match cube to remove!");
                cube_ref.current.setMatchCube(cubeIndex, true,delay);
            }
            else{
                cube_ref.current.setMatchCube(cubeIndex,false,delay);
            }
            delay += 100;
            cur_grid.current[cubeIndex] = "";
        })

    }

    const newCubes = (dropDirection = -1) => {
        //fill in empty spaces with new numbers
        let new_cube_indexes = [];
        if(mode === 0){//If in endless mode
            for(var i = size; i >= 0; i--){
                if(cur_grid.current[i] == ""){
                    cur_grid.current[i] = randomNumber();
                    new_cube_indexes.push(i);
                }
            }
            new_cube_indexes.forEach((cubeIndex,index)=>{
                if(index+1 === new_cube_indexes.length){
                    setDropCube(cubeIndex, dropDirection,true);
                }
                else{
                    setDropCube(cubeIndex, dropDirection);
                }
            })
        }
        updateCubes();
    }

    const createCube = (index, animation, num=cur_grid.current[index]) =>{ 
        let xpos = (index) % 5;
        let ypos = Math.floor((index)/5);
        let cube = <Cube key={key_count.current}
                            ref ={cube_ref}
                            num={num} 
                            x={xpos} y={ypos} 
                            index={index}
                            updateGrid={updateGrid}
                            decrementSwapCount = {decrementSwapCount}
                            dropCubes = {dropCubes}
                            swapCount = {swapCount.current}
                            tutorialMode={tutorialMode}
                            animation = {animation}
                            anim_api = {api}
                            />;
        key_count.current += 1;
        return(cube)
    }

    const initCubes = () =>{
        let new_cubes = [];

        for(var i = 1; i < size+1; i++){
            //console.log(springs[i-1]);
            new_cubes.push(createCube(i-1,springs[i-1]));
        }
        initial_render.current += 1;
        setCubes(prevCubes => prevCubes = new_cubes);
    }

    const updateCubes = () => {
        let new_cubes = [];
        
        for(var i = 1; i < size+1; i++){
            new_cubes.push(createCube(i-1,springs[i-1]));
        }
        //If there are no matches on the board, check to see if the game is over
        if(!tutorialMode){
            if(mode === 0){
                handleGameOver(checkGameOver(cur_grid.current, swapCount.current));
            }
            else if (mode === 1){
                handlePuzzleComplete(checkPuzzleComplete(cur_grid.current));
            }
            
            //Save grid state into local storage
            //gameStatus:start,inProgress, gameOver
            //console.log("Localstorage Score:",score.current);
            if(mode === 0){
                localStorage.setItem("gameState",JSON.stringify({score:score.current,swaps:swapCount.current,gridState:cur_grid.current,gameStatus:"inProgress"}));
            }          
        }
        setCubes(prevBlocks => prevBlocks = new_cubes);
    }

    //If cube has empty space beneath it, let it drop to the bottom.
    //give index or indexes of empty spaces
    const dropCubes = (dropDirection = -5) => {
        if(mode != 0){//if not in endless mode, always drop cubes downwards;
            dropDirection = -5;
        }
        if(match_anim_status.current === true){
            return;
        }
        let emptyIndexes = getEmptyIndexes(cur_grid.current);
        let drop_grid = [...cur_grid.current];
        let didDrop = false;//if no blocks dropped, still run a match check
        let cubeIndexesToDrop = [];//Used to get a list of all cubes to be dropped. Call to check for matches only after the last cube has been dropped.
        emptyIndexes.forEach(startIndex => {
            let searchIndex = startIndex + dropDirection;
            while(searchIndex >= 0 && searchIndex <= 24){
                //console.log("Drop Search Index:",searchIndex);
                if(drop_grid[searchIndex] !== ""){
                    drop_grid[startIndex] = drop_grid[searchIndex];
                    drop_grid[searchIndex] = "";
                    cubeIndexesToDrop.push(startIndex);
                    startIndex += dropDirection;
                    didDrop = true;
                }
                searchIndex += dropDirection;
            }
            for(const [ind,cubeIndex] of cubeIndexesToDrop.entries()){
                if(ind === cubeIndexesToDrop.length-1){
                    //Math.sign(x) gives the direction which to drop cubes. Positive is up, negative is down.
                    setDropCube(cubeIndex, Math.sign(dropDirection), true);
                }
                else{
                    setDropCube(cubeIndex, Math.sign(dropDirection));
                }

            }
        })
        cur_grid.current = drop_grid;
        console.log("mode",mode);
        if(didDrop === false && mode === 1){
            updateCubes();
            handleMatchCheck();
        }
        else{
            newCubes(Math.sign(dropDirection));
        }
    }

    const getCubes = () =>{
        return (<div className={styles.grid} style={{minHeight:minHeight,height:minHeight}}>
                    {cubes}
                </div>);
    }

    const updateGrid = (cubesUpdate, updateGridOnly = false, swap = false, dropDirection = -1) => {
        //Adding two cubes together
        //console.log("Updating Grid");
        let activeIndex = [cubesUpdate[1].index];
        
        cubesUpdate.forEach(cube => {
            cur_grid.current[cube.index] = cube.num;
        });
        
        //repeat until there are no matches or empty spaces
        //empty_indexes.current = activeIndex;
        
        if(updateGridOnly === true){
            newCubes();
            updateCubes();
        }
        else if(swap === true){
            handleMatchCheck();
        }
        else{
            dropCubes(dropDirection * 5);
        }
        

    }

    const puzzleTopBar = () =>{
        const levelState = JSON.parse(localStorage.getItem("levelState"));
        const didCompleteLevel = levelState.levelsCompleted[level.current-1];
        let nextLvlButton = <button>Next Level Locked</button>;
        let prevLvlButton = null;
        if(didCompleteLevel === 1){
            nextLvlButton = <button onClick={()=>{handleNextLevel();}}>Next Level</button>;
        }
        if(level.current !== 1){
            prevLvlButton = <button onClick={()=>{handlePrevLevel();}}>Prev Level</button>;
        }

        return(
        <div className={styles.topbar}>
            {prevLvlButton}
            <Level levelName={props.levelName}/><Swap swapCount={swapCount.current}/>
            {nextLvlButton}
        </div>)
    }

    const renderGrid = () => {
        if(tutorialMode){
            return(
                <>
                    {getCubes()}
                </> 
            )
        }
        return(
            <>
            {props.showScore ? <div className={styles.topbar}><Score/><Swap swapCount={swapCount.current}/></div> : null}
            {props.showLevel ? puzzleTopBar() : null}
            <div className={styles.instructGrid}>
                {props.showSidebar ?
                    <div className={styles.sidebar}>
                            <Instructions/>
                            <SoundToggle/>
                            <RefreshGrid refresh={props.refresh} setSwapCount={setSwapCount}/>
                            {mode === 0 ? <><GameOver/><LeaderBoard/><button className={styles.sidebarButton} onClick={()=>handleGameOver(true)}>End Game</button></>:null}
                            <PuzzleEnd refresh={props.refresh}/>
                            
                            <GameMode refresh={props.refresh}/>
                    </div>
                    : null}

                <div className={styles.gridCont}>
                    {getCubes()}
                </div>

            </div>
            </>
        )
    }




    useEffect(()=>{        
        if(initial_render.current === 0){
            initCubes();
        }
    },[])

    return(renderGrid())
}