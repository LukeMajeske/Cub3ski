import styles from '../styles/Home.module.css'
import Numblock from './numblock'
import { useNumbleContext, useNumbleUpdateContext} from '../Contexts/numbleContext'
import Score from './score'
import { useEffect, useRef, useState } from 'react';
import {scoreMatches,checkForMatches,removeMatches,randomNumber} from '../numblock_functions/grid_functions'
import {useSpringRef,useSpring, useSprings, config, useChain} from "react-spring";



export default function Grid(props){
    const [numblock_grid,setNumblockGrid] = useState(props.numblock_grid);
    const [numblocks, setNumblocks] = useState([]);
    const initial_render = useRef(0);
    const key_count = useRef(1);
    //const [score, setScore] = useState(0);
    const matchSpringRef = useSpringRef();

    const [springs,api] = useSprings(25, index => ({
        from:{y:-80, x:0, opacity:0},
        to:{y:0, x:0, opacity:1},
        delay:200, 
        config: config.wobbly
    }));

    const match_spring = useSpring({
        ref:matchSpringRef,
        from:{y:0, x:0, opacity:1},
        to:{y:0, x:0, opacity:0},
        delay:200, 
        config: config.wobbly
    })

    useChain([matchSpringRef,api]);

    let setDropNumblock = (numblock_index) => {
        api.start(index => {
            if (index === numblock_index){
                return({
                    from:{y:-80, x:0, opacity:1},
                    to:{y:0, x:0, opacity:1},
                    config: config.molasses
                });
            }
        })
    }

    let setMatchNumblock = (numblock_index) => {
        api.start(index => {
            if (index === numblock_index){
                return({
                    from:{y:0, x:0, opacity:1},
                    to:{y:0, x:0, opacity:0},
                    config: config.molasses
                });
            }
        })
    }

    let newNumblocks = (grid) => {
        //fill in empty spaces with new numbers
        console.log("New Numblocks", grid);
        for(var i = 25; i >= 0; i--){
            if(grid[i] == ""){
                grid[i] = randomNumber();
                setDropNumblock(i);
            }
        }
        return grid;
    }

    let createNumblock = (index, animation,num=numblock_grid[index]) =>{
        let xpos = (index) % 5;
        let ypos = Math.floor((index)/5);
        let numblock = <Numblock key={key_count.current}
                            num={num} 
                            x={xpos} y={ypos} 
                            index={index}
                            updateGrid={updateGrid}
                            animation = {animation}/>;
        key_count.current += 1;
        return(numblock)
    }

    let initNumblocks = () =>{
        console.log("Initial Numblocks...");
        let new_numblocks = [];

        for(var i = 1; i < 26; i++){
            console.log(springs[i-1]);
            new_numblocks.push(createNumblock(i-1,springs[i-1]));
        }



        initial_render.current += 1;
        setNumblocks(prevBlocks => prevBlocks = new_numblocks);
    }

    let updateNumblocks = () => {
        console.log("Update Numblocks...");
        let new_numblocks = [];

        
        for(var i = 1; i < 26; i++){
            new_numblocks.push(createNumblock(i-1,springs[i-1]));
            //new_numblocks.push(createNumblock(i-1,match_spring));
        }
        console.log(new_numblocks);
        setNumblocks(prevBlocks => prevBlocks = new_numblocks);
    }

    //If numblock has empty space beneath it, let it drop to the bottom.
    //give index or indexes of empty spaces
    let dropNumblocks = (emptyIndexes, grid) => {
        console.log("Dropping Block", grid);
        let drop_grid = [...grid];
        emptyIndexes.forEach(startIndex => {
            let searchIndex = startIndex - 5;
            let new_numblocks = [];
            while(searchIndex >= 0){
                if(drop_grid[searchIndex] !== ""){
                    drop_grid[startIndex] = drop_grid[searchIndex];
                    drop_grid[searchIndex] = "";
                    setDropNumblock(startIndex);
                    startIndex -= 5;
                    console.log("Drop!");
                }
                searchIndex -= 5;
            }
        })
        return drop_grid;
    }

    let getNumblocks = () =>{
        console.log("Rendering Numblocks",numblocks);
        return numblocks;
    }

    let updateGrid = (numblocksUpdate) => {
        //Adding two numblocks together
        console.log("Updating Grid");
        let new_grid = [...numblock_grid];
        let activeIndex = [numblocksUpdate[1].index];
        
        numblocksUpdate.forEach(numblock => {
            new_grid[numblock.index] = numblock.num;
        });
    
        //repeat until there are no matches or empty spaces
        let match = true;
        let empty_indexes = activeIndex;
        while(match){
            new_grid = dropNumblocks(empty_indexes.flat(),new_grid);
            //Indexes of matched numbers will be given here, these will turn into empty blocks
            empty_indexes = checkForMatches(new_grid);
            if(empty_indexes.length > 0){
                //score = scoreMatches(new_grid, empty_indexes);
                //console.log("Total Scored", score);
                //setScore(prevScore => prevScore += score);
                console.log(empty_indexes);
                setMatchNumblock(empty_indexes[0]);
                new_grid = removeMatches(new_grid,empty_indexes);
                console.log("after new blocks", new_grid);
            }
            else{
                console.log("No matches found");
                new_grid = newNumblocks(new_grid);
                empty_indexes = checkForMatches(new_grid);
                if(empty_indexes.length == 0){
                    match = false;
                }
            }
        }
    
        setNumblockGrid(prevGrid => prevGrid = new_grid);
    }



    useEffect(()=>{
        //refreshNumblocks();
        
        if(initial_render.current === 0){
            initNumblocks();
        }
        else{
            updateNumblocks();
        }
        console.log("Grid", numblock_grid);
    },[numblock_grid])

    return(
        <>
        
        <div className={styles.grid}>
            {getNumblocks()}
        </div>
        </>
    )
}