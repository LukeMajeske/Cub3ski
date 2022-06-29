import {useNumbleContext, useNumbleUpdateContext} from '../Contexts/numbleContext'
import{useEffect} from 'react'
import{GoMute,GoUnmute} from 'react-icons/go'
import styles from '../styles/Home.module.css'


export default function SoundToggle(){
    const {soundEnable} = useNumbleContext();
    const {setSoundEnable, playSound} = useNumbleUpdateContext();

    const handleSoundEnable = () => {
        localStorage.setItem("soundEnable",JSON.stringify(!soundEnable));
        setSoundEnable(!soundEnable);
        if(soundEnable){
            playSound({id:'enableSound'});    
        }
        else{
            playSound({id:'disableSound'});    
        }
    }

    useEffect(()=>{
        let soundEnableLocalStorage = JSON.parse(localStorage.getItem("soundEnable"));

        if (soundEnableLocalStorage  === null){
            localStorage.setItem("soundEnable","true");
            setSoundEnable(true);
        }
        if(soundEnableLocalStorage === true){
            setSoundEnable(true);
        }
    },[]) 

    return(
        <>
            {soundEnable?<GoUnmute className={styles.sidebarButton} onClick={()=>{handleSoundEnable();}}/>:<GoMute className={styles.sidebarButton} onClick={()=>{handleSoundEnable();}}/>}
        </>
    )
}