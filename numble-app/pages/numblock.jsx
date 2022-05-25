import { useNumbleContext, useNumbleUpdateContext} from '../Contexts/numbleContext';
import styles from '../styles/Home.module.css';
import { useState, useEffect } from "react";
import { useSpring, animated, config} from "react-spring";



export default function Numblock(props){
    const {activeNumblock,tutorialMode,step,match_anim_status} = useNumbleContext();
    const {selectNumblock,deSelectNumblock,handleTutorial} = useNumbleUpdateContext();
    const {index,num, x,y,updateGrid,animation} = props;
    const [selected, toggleSelected] = useState(false);

    const {pop} = useSpring({
        from:{x:0},
        pop:selected ? 1 : 0,
        config: config.wobbly
    })

    let numblockLogic = () => {
        console.log("Match Anim Status: ", match_anim_status.current);
        if(index === activeNumblock.index){
            //deselect numblock
            selectNumblock({index:-1,num:0,x:-10,y:-10});
            return;
        }
        else if((num + activeNumblock.num) > 10 || num === "" || match_anim_status.current === true){
            //deselect numblocks and shake numblock to show it can't be added to make a number over 10
            handleTutorial(3);
            deSelectNumblock();
            return;
        }
        else if((Math.abs(x - activeNumblock.x) ===  1)&&((y - activeNumblock.y)===0)){
            num += activeNumblock.num;
            let numblocks = [{index:index, num:num}, {index:activeNumblock.index,num:""}];
            //Delete previous numblock;
            updateGrid(numblocks);
            selectNumblock({index:-1,num:0,x:-10,y:-10});
            handleTutorial(2);
            return;
        }
        else if((Math.abs(y - activeNumblock.y) ===  1)&&((x - activeNumblock.x)===0)){
            num += activeNumblock.num;
            let numblocks = [{index:index, num:num}, {index:activeNumblock.index,num:""}];
            updateGrid(numblocks);
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
                    output:[1,0.9,1.2,0.95,1]})}}
                onClick={() => {handleSelect(); numblockLogic(props);}}>
                    <p className={styles.noselect}>{num}</p>
                </animated.div>
                :
                <animated.div className={styles.card} style={animation}  onClick={() => {handleSelect(); numblockLogic(props);}}>
                        <p className={styles.noselect}>{num}</p>
                </animated.div>
            }
        </>
    )
}