import { useNumbleContext, useNumbleUpdateContext} from '../Contexts/numbleContext'
import styles from '../styles/Home.module.css'

export default function GameMode(){
    const{gameMode} = useNumbleContext();
    const{setGameMode} = useNumbleUpdateContext();
    //const isSelected = 
    

    return(
        <>
            <div className={styles.sidebarItem}>
                <ul className={styles.gameModeMenu} style={{listStyle:'none'}}>
                    <h4 style={{margin:'0px'}}>Game Mode:</h4>
                    <li onClick={()=>{setGameMode(0)}}>Endless</li>
                    <li>Puzzle</li>
                </ul>
            </div>

        </>
    )
}