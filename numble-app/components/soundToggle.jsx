import {useNumbleContext, useNumbleUpdateContext} from '../Contexts/numbleContext'
import{useEffect} from 'react'
import{GoMute,GoUnmute} from 'react-icons/go'
import styles from '../styles/Home.module.css'
import useSound from 'use-sound'
import enableSound from '../public/sounds/CloseOrDisable1.mp3';
import disableSound from '../public/sounds/OpenOrEnable1.mp3';


export default function SoundToggle(){
    const {soundEnable} = useNumbleContext();
    const {setSoundEnable} = useNumbleUpdateContext();

    const [playEnable] = useSound(enableSound,{volume:0.25});
    const [playDisable] = useSound(disableSound,{volume:0.25});

    const handleSoundEnable = () => {
        localStorage.setItem("soundEnable",JSON.stringify(!soundEnable));
        setSoundEnable(!soundEnable);
        soundEnable?playEnable():playDisable();
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