import styles from '../styles/Home.module.css'
import { useSpring, animated, config} from "react-spring";

export default function Modal(props){
    if(!props.show){
        return null;
    }
    return(
        <div className={styles.modal} onClick={props.onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h4 className={styles.modalTitle}>{props.title}</h4>
                    <div className={styles.modalBody}>
                        {props.body}
                    </div>
                    <div className={styles.modalFooter}>
                        <button className={styles.button}
                                onClick={()=>{props.onClose()}}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    )

}