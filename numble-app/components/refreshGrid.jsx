import {HiRefresh} from 'react-icons/hi';
import styles from '../styles/Home.module.css'
import {useNumbleUpdateContext} from '../Contexts/numbleContext'

export default function RefreshGrid(props) {
    const refreshGrid = props.refresh;
    const setSwapCount = props.setSwapCount;
    const {setScore,deSelectNumblock} = useNumbleUpdateContext();

    const handleRefresh = () => {
        setScore(0);
        setSwapCount(0);
        deSelectNumblock();
        refreshGrid();
    }
    return(
        <HiRefresh className={styles.sidebarButton} onClick={()=> handleRefresh()}/>
    )
}