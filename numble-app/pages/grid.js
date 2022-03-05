import styles from '../styles/Home.module.css'
import Numblock from './numblock'
import { useNumbleContext, useNumbleUpdateContext} from '../Contexts/numbleContext'
import Score from './score'
import { useEffect, useState } from 'react';
import {scoreMatches,checkForMatches,removeMatches, newNumblocks} from '../numblock_functions/grid_functions'
import {useSpring, animated, config, useSprings} from "react-spring";

const animations = (blocks, drop = false, y = 0, x = 0) => {
    drop === true
    ?{
        from:{y:-80, x:0},
        to:{y:0, x:0},
        delay:200,
        config: config.wobbly
    }
    :{
        y:80 * y, 
        x:80 * x, 
        delay:200,
        config: config.wobbly
    }
}

export default function Grid(){
    const [numblock_grid, setNumblockGrid] = useState([]);
    const [numblocks, setNumblocks] = useState([]);
    const [score, setScore] = useState(0);
    const [numblock_animations, setAnimations] = useState(new Map());

    const start = useSpring({
        from:{y:-100, x:0, opacity:0},
        to:{y:0, x:0, opacity:1},
        delay:200,
        config: config.wobbly
    })

    //const [springs, api] = useSprings(25, animations(numblocks));

    let refreshNumblocks = () =>{
        console.log("Refresh Numblocks...");
        let new_numblocks = [];
        console.log(numblock_animations);
        for(var i = 1; i < 26; i++){
            let animation = numblock_animations.get(i);
            let xpos = (i-1) % 5;
            let ypos = Math.floor((i-1)/5);
            new_numblocks.push(<Numblock key={i}
                                        num={numblock_grid[i-1]} 
                                        x={xpos} y={ypos} 
                                        index={i-1}
                                        updateGrid={updateGrid}
                                        animation={animation}/>
                                        );
        } 
        setNumblocks(prevNumblocks => prevNumblocks = new_numblocks);
    }

    //If numblock has empty space beneath it, let it drop to the bottom.
    //give index or indexes of empty spaces
    let dropNumblocks = (emptyIndexes, grid) => {
        console.log("Dropping Block", grid);
        let drop_grid = [...grid];
        
        emptyIndexes.forEach(startIndex => {
            let searchIndex = startIndex - 5;
            while(searchIndex >= 0){
                if(drop_grid[searchIndex] !== ""){
                    drop_grid[startIndex] = drop_grid[searchIndex];
                    drop_grid[searchIndex] = "";
                    startIndex -= 5;
                    numblock_animations.set(searchIndex+1,drop);//set animation for this block to drop.
                    console.log("Drop!");
                }
                searchIndex -= 5;
            }
        })
        return drop_grid;
    }

    let getNumblocks = () =>{
        console.log("Getting Numblocks", numblocks);
        return numblocks;
    }

    let gen_grid = () => {
        console.log("Generating grid...");
        let new_grid = [1,2,2,3,2,1,2,3,4,2,3,1,3,1,1,3,2,1,3,3,9,8,3,6,5];
        
        for(var i = 1; i < 26; i++){
            numblock_animations.set(i,start);
        }

        /*for(var i = 1; i < 26; i++){
            var number = Math.floor(Math.random() * 10) + 1;
            new_grid.push(number);
        }*/
    
        setNumblockGrid(prevGrid => prevGrid = new_grid);
    }

    let updateGrid = (numblocksUpdate) => {
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
                score = scoreMatches(new_grid, empty_indexes);
                console.log("Total Scored", score);
                setScore(prevScore => prevScore += score);
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
        refreshNumblocks();
        console.log(numblocks);
        console.log("Grid", numblock_grid);
    },[numblock_grid])

    return(
        <>
        <Score score={score}/>
        <div className={styles.grid}>
            {numblock_grid.length === 0 ? gen_grid() : getNumblocks()}
        </div>
        </>
    )
}