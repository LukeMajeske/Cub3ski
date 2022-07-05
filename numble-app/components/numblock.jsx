import { useNumbleContext, useNumbleUpdateContext} from '../Contexts/numbleContext';
import styles from '../styles/Home.module.css';
import { useState, useEffect,useRef, forwardRef, useImperativeHandle} from "react";
import { useSpring, animated, config} from "react-spring";
import {HiSwitchHorizontal} from 'react-icons/hi';



const Numblock = forwardRef((props, ref) => {
    const {activeNumblock,tutorialMode,step,match_anim_status} = useNumbleContext();
    const {selectNumblock,deSelectNumblock,handleTutorial, getCubeWidth, playSound, setPlaybackRate} = useNumbleUpdateContext();
    const {index,num, x,y,updateGrid,decrementSwapCount,dropNumblocks,swapCount,animation,anim_api} = props;
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

    
 

    let startAddAnimation = (cube_index,cubes_to_update,xDir, yDir) =>{
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

    let startSwapAnimation = (cube1_index,cube2_index,cubes_to_update,xDir, yDir) =>{
        
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

    useImperativeHandle(ref,() => ({
        setMatchNumblock(numblock_index, isLastCube = false, delay = 0){
            anim_api.start(index => {
                let startCount = 0;
                
                if (index === numblock_index){
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
                                    dropNumblocks()
                                }; 
                                handleTutorial(4,5);
                            },
                        config:{tension:450,friction:30}
                        
                    });
                }
            })
        }
    }));


    let numblockLogic = () => {
        //console.log("Match Anim Status: ", match_anim_status.current);
        let xDir = x - activeNumblock.x;
        let yDir = y - activeNumblock.y;
        let isAdjacentX = (Math.abs(x - activeNumblock.x) ===  1)&&((y - activeNumblock.y)===0);
        let isAdjacentY = (Math.abs(y - activeNumblock.y) ===  1)&&((x - activeNumblock.x)===0);
        let isAdjacent = (isAdjacentX || isAdjacentY);

        if(index === activeNumblock.index){
            //deselect numblock
            deSelectNumblock();
            return;
        }
        else if(num === "" || match_anim_status.current === true || ((num + activeNumblock.num) > 10  && swapCount <= 0)){
            //deselect numblocks and shake numblock to show it can't be added to make a number over 10
            deSelectNumblock(false);
            selectNumblock({index,num,x,y},selectSound);
            return;
        }
        //SWAP CUBES!!
        else if((num + activeNumblock.num) > 10 && swapCount > 0 && isAdjacent){
            let numblocks = [{index:index, num:activeNumblock.num}, {index:activeNumblock.index,num:num}];
            //let numblocks = [{index:activeNumblock.index,num:activeNumblock.num}, {index:index, num:num}];
            //Swap Numbers
            startSwapAnimation(activeNumblock.index,index,numblocks, xDir, yDir);
            //console.log("number of swaps ", swapCount);
            
            decrementSwapCount();

            //console.log("number of swaps ", swapCount);
            
            deSelectNumblock(false);
            return;
        }
        else if(isAdjacent){
            num += activeNumblock.num;
            let numblocks = [{index:index, num:num}, {index:activeNumblock.index,num:""}];
            //Delete previous numblock;
            startAddAnimation(activeNumblock.index,numblocks, xDir, yDir);
            deSelectNumblock(false);
            handleTutorial(2);
            return;
        }

        //console.log("Active Numblock", activeNumblock);
        //console.log("This Numblock", props);
        selectNumblock({index,num,x,y},selectSound);
    }

    let handleSelect = () => {
        handleTutorial(1);
        toggleSelected(prevSelected => prevSelected = !selected);
        console.log("Cube Color",cubeColor);
        numblockLogic();
    }

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
            {activeNumblock.index === props.index 
                ?popCube()
                :
                <animated.div className={styles.card} style={{...animation,visibility:visible}}  onClick={() => {handleSelect();}}>
                        <p className={styles.noselect}>{displayItem}</p>
                </animated.div>
            }
        </>
    )
});

Numblock.displayName = 'Numblock'

export default Numblock;