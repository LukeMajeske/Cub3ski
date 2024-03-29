import { useCub3skiContext, useCub3skiUpdateContext} from '../Contexts/cub3skiContext';
import styles from '../styles/Home.module.css';
import { useState, useEffect,useRef, forwardRef, useImperativeHandle} from "react";
import { useSpring, animated, config} from "react-spring";
import {HiSwitchHorizontal} from 'react-icons/hi';

const Cube = forwardRef((props, ref) => {
    const {activeCube,step,match_anim_status} = useCub3skiContext();
    const {selectCube,deSelectCube,handleTutorial, getCubeWidth, playSound, setPlaybackRate} = useCub3skiUpdateContext();
    const {index,num, x,y,updateGrid,decrementSwapCount,dropCubes,swapCount,animation,anim_api} = props;
    const [selected, toggleSelected] = useState(false);
    const [visible, setVisible] = useState(num === "" ? "hidden" : "visible");
    const unmounted = useRef(false);
    const selectSound = "selectSound"+num;
    const displayItem = num === 11 ? <HiSwitchHorizontal/> : num;
    const cubeColors = {
        '1':'red',
        '2':'',
        '3':'#25b509',
        '4':'gold',
        '5':'darkorange',
        '6':'skyblue',
        '7':'peru',
        '8':'seagreen',
        '9':'deeppink',
        '10':'darkblue',
        '11':'purple',
    }
    const cubeColor = cubeColors[num];


    const {pop} = useSpring({
        from:{x:0},
        pop:selected ? 1 : 0,
        config: config.wobbly
    })

    
 

    const startAddAnimation = (cube_index,cubes_to_update,xDir, yDir) =>{
        anim_api.start(ind => {
            if (ind === cube_index){
                console.log("Starting anim for index: ", cube_index);
                return({
                    from:{x:0,y:0,zIndex:1},
                    to:{x:getCubeWidth()*xDir,y:getCubeWidth()*yDir,zIndex:0},
                    onRest:()=>{updateGrid(cubes_to_update,false,false,yDir !== 0 ? -yDir : -1);},
                    immediate: key => key === "zIndex"
                });
            }
        })
    }

    const startSwapAnimation = (cube1_index,cube2_index,cubes_to_update,xDir, yDir) =>{
        
        anim_api.start(ind => {
            if (ind === cube1_index){
                return({
                    from:{x:getCubeWidth()*xDir,y:getCubeWidth()*yDir,zIndex:0},
                    to:{x:0,y:0,zIndex:1},
                    immediate: key => key === "zIndex"
                });
            }
            if (ind === cube2_index){
                return({
                    from:{x:getCubeWidth()*-xDir,y:getCubeWidth()*-yDir,zIndex:1},
                    to:{x:0,y:0,zIndex:1},
                    onStart:()=>{playSound({id:'swapSound'}); updateGrid(cubes_to_update, true);},
                    onRest:()=>{handleTutorial(3); updateGrid(cubes_to_update,false,true);},
                    immediate: key => key === "zIndex"
                });
            }
        })
    }

    //Called from Grid component. When a cube is matched, start the match animation
    //and play the match sound for this cube. If this cube is the last cube for all sets of
    //matches, start the logic for dropping cubes.
    useImperativeHandle(ref,() => ({
        setMatchCube(cube_index, isLastCube = false, delay = 0){
            anim_api.start(index => {
                let startCount = 0;
                
                if (index === cube_index){
                    //console.log("Starting anim for index: ", index);
                    return({
                        from:{opacity:1,scale:1},
                        to:[{opacity:1, scale:0.5},
                            {opacity:1, scale:1},
                            {opacity:0,scale:0}],
                        delay:delay,
                        onStart:() => {
                                if(startCount===0){
                                    /*if(!unmounted.current){
                                        setPlaybackRate(prevRate => prevRate+=0.1);
                                    }*/
                                    playSound({id:'matchSound'});
                                    setPlaybackRate(prevRate => prevRate+=0.1);
                                    match_anim_status.current = true; 
                                    startCount++
                                }
                            },
                        onRest:()=>{
                                /*if(!unmounted.current){
                                    setPlaybackRate(prevRate => prevRate=1);
                                }*/
                                setPlaybackRate(prevRate => prevRate=1);
                                match_anim_status.current = false; 
                                if(isLastCube){
                                    dropCubes();
                                }; 
                                handleTutorial(4,5);
                            },
                        config:{tension:450,friction:30}
                        
                    });
                }
            })
        }
    }));

    //Handles the behavior of a cube
    const cubeLogic = () => {
        //console.log("Match Anim Status: ", match_anim_status.current);

        //get the difference in x & y coords between the currently selected cube and this
        //clicked cube
        let xDir = x - activeCube.x;
        let yDir = y - activeCube.y;
        let isAdjacentX = (Math.abs(xDir) ===  1)&&((yDir)===0);
        let isAdjacentY = (Math.abs(yDir) ===  1)&&((xDir)===0);
        let isAdjacent = (isAdjacentX || isAdjacentY);

        //Deselect if clicking the currently selected cube
        if(index === activeCube.index){
            deSelectCube();
            return;
        }
        else if(num === "" || match_anim_status.current === true || ((num + activeCube.num) > 10  && swapCount <= 0)){
            
            deSelectCube(false);
            selectCube({index,num,x,y},selectSound);
            return;
        }
        //SWAP CUBES!!
        else if((num + activeCube.num) > 10 && swapCount > 0 && isAdjacent){
            let cubes = [{index:index, num:activeCube.num}, {index:activeCube.index,num:num}];
            //let cubes = [{index:activeCube.index,num:activeCube.num}, {index:index, num:num}];
            //Swap Numbers
            startSwapAnimation(activeCube.index,index,cubes, xDir, yDir);
            //console.log("number of swaps ", swapCount);
            
            decrementSwapCount();

            //console.log("number of swaps ", swapCount);
            
            deSelectCube(false);
            return;
        }
        else if(isAdjacent){
            num += activeCube.num;
            let cubes = [{index:index, num:num}, {index:activeCube.index,num:""}];
            //Delete previous cube;
            startAddAnimation(activeCube.index,cubes, xDir, yDir);
            deSelectCube(false);
            handleTutorial(2);
            return;
        }

        //console.log("Active Cube", activeCube);
        //console.log("This Cube", props);
        selectCube({index,num,x,y},selectSound);
    }

    let handleSelect = () => {
        handleTutorial(1);
        toggleSelected(prevSelected => prevSelected = !selected);
        console.log("Cube Color",cubeColor);
        cubeLogic();
    }

    //Animation when a cube is clicked
    const popCube = () =>{
        return(
            <animated.div className={styles.selected} style={{scale:pop.to({range:[0,0.25,0.5,0.75,1],
                output:[1,0.9,1.2,0.95,1]}),zIndex:2,color:cubeColor,borderColor:cubeColor}}
            onClick={() => {handleSelect();}}>
                <p className={styles.noselect}>{displayItem}</p>
            </animated.div>
        )
    }

    useEffect(()=>{
        return () => {
            console.log("unmounted");
            unmounted.current = true;
        }
    })
    return(
        <>
            {activeCube.index === props.index 
                ?popCube()
                :
                <animated.div className={styles.card} style={{...animation,visibility:visible}}  onClick={() => {handleSelect();}}>
                        <p className={styles.noselect}>{displayItem}</p>
                </animated.div>
            }
        </>
    )
});

Cube.displayName = 'Cube'

export default Cube;