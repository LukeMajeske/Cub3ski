import {useCub3skiContext, useCub3skiUpdateContext} from '../Contexts/cub3skiContext'
import{useEffect} from 'react'
import{GoMute,GoUnmute} from 'react-icons/go'
import styles from '../styles/Home.module.css'


export default function SoundToggle(){
    const {soundEnable} = useCub3skiContext();
    const {setSoundEnable, playUnmutableSound} = useCub3skiUpdateContext();

    const handleSoundEnable = () => {
        localStorage.setItem("soundEnable",JSON.stringify(!soundEnable));
        setSoundEnable(prevSoundEnable => prevSoundEnable = !soundEnable);
        soundEnable?playUnmutableSound({id:'disableSound'}):playUnmutableSound({id:'enableSound'});
    }

    return(
        <>
            {soundEnable?<GoUnmute className={styles.sidebarButton} onClick={()=>{handleSoundEnable();}}/>:<GoMute className={styles.sidebarButton} onClick={()=>{handleSoundEnable();}}/>}
        </>
    )
}