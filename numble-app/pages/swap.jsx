import {useNumbleContext} from '../Contexts/numbleContext'


export default function Swap(){
    const {swapCount} = useNumbleContext();
    return(
        <div>
            <p>Swap: {swapCount}</p>
        </div>
    )
}