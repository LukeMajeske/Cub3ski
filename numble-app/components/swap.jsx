import {useCub3skiContext} from '../Contexts/cub3skiContext'


export default function Swap(props){
    const {swapCount} = props;

    return(
        <div>
            <p>Swap: {swapCount}</p>
        </div>
    )
}