import {useNumbleContext} from '../Contexts/numbleContext'


export default function Swap(props){
    const {swapCount} = props;

    return(
        <div>
            <p>Swap: {swapCount}</p>
        </div>
    )
}