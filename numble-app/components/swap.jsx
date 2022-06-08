import {useNumbleContext} from '../Contexts/numbleContext'


export default function Swap(props){
    const {swapCount} = props;

    console.log("swapCount in swap component:", swapCount);
    return(
        <div>
            <p>Swap: {swapCount}</p>
        </div>
    )
}