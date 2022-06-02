import { useNumbleContext, useNumbleUpdateContext} from '../Contexts/numbleContext';
import styles from '../styles/Home.module.css';
import { useState, useEffect } from "react";
import { useSpring, animated, config} from "react-spring";



export default function Numblock(props){
    const {activeNumblock,tutorialMode,step,match_anim_status, swapCount} = useNumbleContext();
    const {selectNumblock,deSelectNumblock,handleTutorial, setSwapCount} = useNumbleUpdateContext();
    const {index,num, x,y,updateGrid,animation,anim_api} = props;
    const [selected, toggleSelected] = useState(false);
    const [z_index, setZIndex]= useState(1);

    const {pop} = useSpring({
        from:{x:0},
        pop:selected ? 1 : 0,
        config: config.wobbly
    })

    let startAddAnimation = (cube_index,cubes_to_update,xDir, yDir) =>{
        anim_api.start(ind => {
            if (ind === cube_index){
                console.log("Starting anim for index: ", index);
                return({
                    from:{x:0,y:0,zIndex:1},
                    to:{x:80*xDir,y:80*yDir,zIndex:0},
                    onRest:()=>{ updateGrid(cubes_to_update,false,false,yDir !== 0 ? -yDir : -1);},
                    immediate: key => key === "zIndex"
                });
            }
        })
    }

    let startSwapAnimation = (cube1_index,cube2_index,cubes_to_update,xDir, yDir) =>{
        anim_api.start(ind => {
            if (ind === cube1_index){
                return({
                    from:{x:80*xDir,y:80*yDir,zIndex:0},
                    to:{x:0,y:0,zIndex:1},
                    immediate: key => key === "zIndex"
                });
            }
            if (ind === cube2_index){
                return({
                    from:{x:80*-xDir,y:80*-yDir,zIndex:1},
                    to:{x:0,y:0,zIndex:1},
                    onStart:()=>{ updateGrid(cubes_to_update, true);},
                    onRest:()=>{ updateGrid(cubes_to_update,false,true);},
                    immediate: key => key === "zIndex"
                });
            }
        })
    }

    let numblockLogic = () => {
        console.log("Match Anim Status: ", match_anim_status.current);
        let xDir = x - activeNumblock.x;
        let yDir = y - activeNumblock.y;

        if(index === activeNumblock.index){
            //deselect numblock
            selectNumblock({index:-1,num:0,x:-10,y:-10});
            return;
        }
        else if(num === "" || match_anim_status.current === true || ((num + activeNumblock.num) > 10 && swapCount <= 0)){
            handleTutorial(3);
            //deselect numblocks and shake numblock to show it can't be added to make a number over 10
            deSelectNumblock();
            return;
        }
        //SWAP CUBES!!
        else if((num + activeNumblock.num) > 10 && swapCount > 0){
            let numblocks = [{index:index, num:activeNumblock.num}, {index:activeNumblock.index,num:num}];
            //let numblocks = [{index:activeNumblock.index,num:activeNumblock.num}, {index:index, num:num}];
            //Swap Numbers
            startSwapAnimation(activeNumblock.index,index,numblocks, xDir, yDir);
            setSwapCount(prevSwapCount => prevSwapCount -= 1);
            deSelectNumblock();
            return;
        }
        else if((Math.abs(x - activeNumblock.x) ===  1)&&((y - activeNumblock.y)===0)){
            num += activeNumblock.num;
            let numblocks = [{index:index, num:num}, {index:activeNumblock.index,num:""}];
            //Delete previous numblock;
            startAddAnimation(activeNumblock.index,numblocks, xDir, yDir);
            selectNumblock({index:-1,num:0,x:-10,y:-10});
            handleTutorial(2);
            return;
        }
        else if((Math.abs(y - activeNumblock.y) ===  1)&&((x - activeNumblock.x)===0)){
            num += activeNumblock.num;
            let numblocks = [{index:index, num:num}, {index:activeNumblock.index,num:""}];
            startAddAnimation(activeNumblock.index,numblocks, xDir, yDir);
            selectNumblock({index:-1,num:0,x:-10,y:-10});
            
            return;

        }
        console.log("Active Numblock", activeNumblock);
        console.log("This Numblock", props);

        selectNumblock({index,num,x,y});
    }

    let handleSelect = () => {
        handleTutorial(1);
        toggleSelected(!selected);
    }

    useEffect(()=>{
        console.log("Render!");
    },[animation])
    return(
        <>
            {activeNumblock.index === props.index 
                ?<animated.div className={styles.selected} style={{scale:pop.to({range:[0,0.25,0.5,0.75,1],
                    output:[1,0.9,1.2,0.95,1]}),zIndex:2}}
                onClick={() => {handleSelect(); numblockLogic(props);}}>
                    <p className={styles.noselect}>{num}</p>
                </animated.div>
                :
                <animated.div className={styles.card} style={{...animation}}  onClick={() => {handleSelect(); numblockLogic(props);}}>
                        <p className={styles.noselect}>{num}</p>
                </animated.div>
            }
        </>
    )
}