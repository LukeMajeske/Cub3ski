import {useSpring, animated, config} from "react-spring";

export const start = useSpring({
    from:{y:-100,
        x:0,
        opacity:0},
    to:{y:0,
        x:0,
        opacity:1},
    delay:200,
    config: config.wobbly
})

