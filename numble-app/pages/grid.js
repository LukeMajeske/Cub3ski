import styles from '../styles/Home.module.css'
import Numblock from './numblock'
import { useNumbleContext, useNumbleUpdateContext} from '../Contexts/numbleContext'
import Score from './score'
import Instructions from './instructions'
import GameOver from './gameOver'
import LeaderBoard from './leaderBoard'
import { useEffect, useRef, useState } from 'react';
import {scoreMatches,checkForMatches, randomNumber, getEmptyIndexes,checkGameOver} from '../numblock_functions/grid_functions'
import {useSpringRef,useSpring, useSprings, config, useChain, to} from "react-spring";
import Swap from './swap'





export default function Grid(props){
    const [numblock_grid,setNumblockGrid] = useState(props.numblock_grid);
    const size = props.numblock_grid.length;
    const tutorialMode = props.tutorialMode;
    const [numblocks, setNumblocks] = useState([]);
    const initial_render = useRef(0);
    const empty_indexes = useRef([]);
    const cur_grid = useRef(props.numblock_grid);
    const {key_count,match_anim_status} = useNumbleContext();
    const {handleTutorial,setGameOver, setScore} = useNumbleUpdateContext();
    const matchSpringRef = useSpringRef();

    const [springs,api] = useSprings(size, index => ({
        from:{y:-80, x:0, opacity:0,scale:1,zIndex:1},
        to:{y:0, x:0, opacity:1, scale:1,zIndex:1},
        delay:600,
        config: {tension:300,bounce:5},
        immediate: key => key === "zIndex"
    }));

    let handleMatchCheck = () =>{
        if(cur_grid.current === undefined){
            return;
        }
        empty_indexes.current = checkForMatches(cur_grid.current);
        //console.log("empty indexs: ", empty_indexes.current);
        if(empty_indexes.current.length > 0){
            //Before removing the matches, empty_indexes.current represents the current matches on the grid.
            const addScore = scoreMatches(cur_grid.current, empty_indexes.current);
            //console.log("Total Scored", score);
            setScore(prevScore => prevScore += addScore);
            removeMatches(empty_indexes.current);
            
        }
        else{
            console.log("No matches found");
            return;
            //newNumblocks(cur_grid.current);
            //empty_indexes = checkForMatches(new_grid);
        }
    }
    let handleDropPhase = () => {
        console.log("Drop Phase");
        //newNumblocks(cur_grid.current); 
    }
    let handleGridUpdate = () => {
        if(cur_grid.current !== undefined){
            console.log("updating after drop:",cur_grid.current);
            setNumblockGrid(prevGrid => prevGrid = cur_grid.current);
        }
    }
    let setDropNumblock = (numblock_index) => {
        api.start(index => {
            if (index === numblock_index){
                return({
                    from:{y:-80, x:0, opacity:1,scale:1,zIndex:1},
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
                console.log("Starting anim for index: ", index);
                return({
                    from:{opacity:1,scale:1},
                    to:[{opacity:1, scale:0.5},
                        {opacity:1, scale:1},
                        {opacity:0,scale:0}],
                    onStart:() => {match_anim_status.current = true;},
                    onRest:()=>{match_anim_status.current = false; dropNumblocks(cur_grid.current); handleTutorial(4);},
                    config:{tension:450,friction:30}
                    
                });
            }
        })
    }

    let removeMatches = (match_indexes) => {
        match_indexes = match_indexes.flat();
        match_indexes = [...new Set(match_indexes)];
        console.log("Remove Matches",match_indexes);
        match_indexes.forEach(index => {
            setMatchNumblock(index);
            cur_grid.current[index] = "";
        })

    }

    let newNumblocks = () => {
        //fill in empty spaces with new numbers
        console.log("New Numblocks", cur_grid.current);
        for(var i = size; i >= 0; i--){
            if(cur_grid.current[i] == ""){
                cur_grid.current[i] = randomNumber();
                setDropNumblock(i);
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
        console.log("Update Numblocks...");
        let new_numblocks = [];

        
        for(var i = 1; i < size+1; i++){
            new_numblocks.push(createNumblock(i-1,springs[i-1]));
            //new_numblocks.push(createNumblock(i-1,match_spring));
        }
        console.log(new_numblocks);

        //If there are no matches on the board, check to see if the game is over
        if(!tutorialMode){
            setGameOver(checkGameOver(cur_grid.current));
        }
        setNumblocks(prevBlocks => prevBlocks = new_numblocks);
    }

    //If numblock has empty space beneath it, let it drop to the bottom.
    //give index or indexes of empty spaces
    let dropNumblocks = (grid) => {
        if(match_anim_status.current === true){
            return;
        }
        console.log("Dropping Block", grid);
        console.log("EMPTY INDEXS", getEmptyIndexes(grid));
        let emptyIndexes = getEmptyIndexes(grid);
        let drop_grid = [...grid];
        emptyIndexes.forEach(startIndex => {
            let searchIndex = startIndex - 5;
            let new_numblocks = [];
            while(searchIndex >= 0){
                if(drop_grid[searchIndex] !== ""){
                    drop_grid[startIndex] = drop_grid[searchIndex];
                    drop_grid[searchIndex] = "";
                    setDropNumblock(startIndex,drop_grid);
                    startIndex -= 5;
                    console.log("Drop!");
                }
                searchIndex -= 5;
            }
        })
        cur_grid.current = drop_grid;
        newNumblocks(cur_grid.current);
        updateNumblocks();
    }

    let getNumblocks = () =>{
        console.log("Rendering Numblocks",numblocks);
        return numblocks;
    }

    let updateGrid = (numblocksUpdate, updateGridOnly = false, swap = false) => {
        //Adding two numblocks together
        console.log("Updating Grid");
        let activeIndex = [numblocksUpdate[1].index];
        
        numblocksUpdate.forEach(numblock => {
            cur_grid.current[numblock.index] = numblock.num;
        });
        
        //repeat until there are no matches or empty spaces
        //empty_indexes.current = activeIndex;
        if(updateGridOnly === true){
            newNumblocks(cur_grid.current);
            updateNumblocks();
        }
        else if(swap === true){
            handleMatchCheck();
        }
        else{
            dropNumblocks(cur_grid.current);
        }
        

    }

    let renderGrid = () => {
        if(tutorialMode){
            return(
                <div className={styles.grid} style={{maxWidth:'100%'}}>
                    {getNumblocks()}
                </div> 
            )
        }
        return(
            <>
            {props.showScore ? <><Score/><Swap/></> : null}
            <div className={styles.instructGrid}>
                {props.showSidebar ?
                    <div className={styles.sidebar}>
                            <Instructions/>
                            <GameOver/>
                            <LeaderBoard/>
                            <button className={styles.sidebarButton} onClick={()=>setGameOver(true)}>End Game</button>
                    </div>
                    : null}

                <div className={styles.gridCont}>
                    <div className={styles.grid}>
                        {getNumblocks()}
                    </div> 
                </div>

            </div>
            </>
        )
    }




    useEffect(()=>{
        //refreshNumblocks();
        
        if(initial_render.current === 0){
            initNumblocks();
        }
        else{
            updateNumblocks();
        }
    },[])

    return(renderGrid())
}