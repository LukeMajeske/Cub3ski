import {useCub3skiContext} from '../Contexts/cub3skiContext'


export default function Score(){
    const {score} = useCub3skiContext();
    return(
        <div>
            <p>Score: {score.current}</p>
        </div>
    )
}