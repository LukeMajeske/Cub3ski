import {useNumbleContext} from '../Contexts/numbleContext'


export default function Score(){
    const {score} = useNumbleContext();
    return(
        <div>
            <p>Score: {score}</p>
        </div>
    )
}