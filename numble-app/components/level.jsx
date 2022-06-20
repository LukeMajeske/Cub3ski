import {useNumbleContext} from '../Contexts/numbleContext'


export default function Level(props){
    const {level} = useNumbleContext();
    const levelName = props.levelName;
    return(
        <div>
            <p>Level #{level.current}: <strong>{levelName}</strong></p>
        </div>
    )
}