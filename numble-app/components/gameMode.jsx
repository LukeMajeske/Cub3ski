import { useCub3skiContext, useCub3skiUpdateContext} from '../Contexts/cub3skiContext'
import styles from '../styles/Home.module.css'

export default function GameMode(props){
    const RefreshGrid = props.refresh;
    const{gameMode} = useCub3skiContext();
    const{setGameMode} = useCub3skiUpdateContext();
    
    const handleGameModeChange = (mode) =>{
        setGameMode(mode);
        RefreshGrid(true);
    }

    return(
        <>
            <div className={styles.sidebarItem}>
                <ul className={styles.gameModeMenu} style={{listStyle:'none'}}>
                    <h4 style={{margin:'0px'}}>Game Mode:</h4>
                    <li className={gameMode.current===1?styles.selectedGameMode:null} onClick={()=>{handleGameModeChange(1)}}>Puzzle</li>
                    <li className={gameMode.current===0?styles.selectedGameMode:null} onClick={()=>{handleGameModeChange(0)}}>Endless</li>
                </ul>
            </div>
        </>
    )
}