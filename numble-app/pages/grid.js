import styles from '../styles/Home.module.css'
import Numblock from './numblock'
import { useNumbleContext, useNumbleUpdateContext} from '../Contexts/numbleContext'
import Score from './score'
import { useEffect, useRef, useState } from 'react';
import {scoreMatches,checkForMatches,removeMatches, newNumblocks} from '../numblock_functions/grid_functions'
import {useSpring, animated, config, useSprings, useTransition} from "react-spring";



export default function Grid(props){
    const [numblock_grid,setNumblockGrid] = useState(props.numblock_grid);
    const numblocks = useRef([]);
    const initial_render = useRef(0);
    const update_indexes = useRef([]);//Contains indexes of numblocks to update.
    //const [score, setScore] = useState(0);





    let initNumblocks = () =>{
        console.log("Refresh Numblocks...");
        let new_numblocks = [];
        
        for(var i = 1; i < 26; i++){
            let xpos = (i-1) % 5;
            let ypos = Math.floor((i-1)/5);
            new_numblocks.push(<Numblock key={i}
                                        num={numblock_grid[i-1]} 
                                        x={xpos} y={ypos} 
                                        index={i-1}
                                        updateGrid={updateGrid}/>
                                        );
        }

        const springs = useSprings(new_numblocks.length,new_numblocks.map(numblock => ({
            from:{y:-80, x:0, opacity:0},
            to:{y:0, x:0, opacity:1},
            delay:200, 
            config: config.wobbly
        })));

        initial_render.current += 1; 
        numblocks.current = new_numblocks;
        return springs;
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
                    update_indexes.current.push(searchIndex);
                    console.log("Drop!");
                }
                searchIndex -= 5;
            }
        })
        return drop_grid;
    }

    let updateNumblocks = () =>{
        console.log(update_indexes.current);
        update_indexes.current.forEach(i => {
            let xpos = (i) % 5;
            let ypos = Math.floor((i)/5);
            numblocks.current[i] = <Numblock key={i+1}
                                        num={numblock_grid[i]} 
                                        x={xpos} y={ypos} 
                                        index={i}
                                        updateGrid={updateGrid}/>;
        });

        const springs = useSprings(numblocks.current.length, numblocks.current.map((numblock,i)=>{
            update_indexes.current.includes(i)
            ?
            {from:{y:-80, x:0, opacity:0},
            to:{y:0, x:0, opacity:1},
            delay:200, 
            config: config.wobbly}
            :{}
        }));
        console.log("update springs", springs);
        update_indexes.current = [];
        return springs;
    }

    let getNumblocks = () =>{
        let springs = [];
        if(initial_render.current === 0){
            springs = initNumblocks();
        }
        else{
            springs = updateNumblocks();
        }

        console.log("Getting Numblocks", numblocks.current);
        
        return (springs.map((styles,i) =>(
            <animated.div style={styles} children={numblocks.current[i]}/>
        )));
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
        update_indexes.current = update_indexes.current.concat(empty_indexes.flat());
        while(match){
            new_grid = dropNumblocks(empty_indexes.flat(),new_grid);
            //Indexes of matched numbers will be given here, these will turn into empty blocks
            empty_indexes = checkForMatches(new_grid);
            if(empty_indexes.length > 0){
                //score = scoreMatches(new_grid, empty_indexes);
                //console.log("Total Scored", score);
                //setScore(prevScore => prevScore += score);
                new_grid = removeMatches(new_grid,empty_indexes);
                console.log("after new blocks", new_grid);
                update_indexes.current = update_indexes.current.concat(empty_indexes.flat());
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