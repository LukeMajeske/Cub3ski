import {HiRefresh} from 'react-icons/hi';
import styles from '../styles/Home.module.css'
import {useCub3skiUpdateContext} from '../Contexts/cub3skiContext'

export default function RefreshGrid(props) {
    const refreshGrid = props.refresh;
    const setSwapCount = props.setSwapCount;
    const {setScore,deSelectCube} = useCub3skiUpdateContext();

    const handleRefresh = () => {
        deSelectCube();
        refreshGrid();
    }
    return(
        <HiRefresh className={styles.sidebarButton} onClick={()=> handleRefresh()}/>
    )
}