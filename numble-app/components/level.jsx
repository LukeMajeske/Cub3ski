import {useNumbleContext} from '../Contexts/numbleContext'


export default function Level(){
    const {level} = useNumbleContext();
    return(
        <div>
            <p>Level: {level.current}</p>
        </div>
    )
}