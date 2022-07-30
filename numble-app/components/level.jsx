import {useCub3skiContext} from '../Contexts/cub3skiContext'


export default function Level(props){
    const {level} = useCub3skiContext();
    const levelName = props.levelName;
    return(
        <div>
            <p>Level #{level.current}: <strong>{levelName}</strong></p>
        </div>
    )
}