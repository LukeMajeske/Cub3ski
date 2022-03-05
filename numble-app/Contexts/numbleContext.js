import { createContext, useContext, useState } from "react";
import Numblock from "../pages/numblock";


export const NumbleContext = createContext();
export const NumbleUpdateContext = createContext();

export function NumbleProvider({ children }) {
    const [activeNumblock, setActiveNumblock] = useState({index:-1,num:0,x:-10,y:-10});
    const [numblock_grid, setNumblockGrid] = useState([]);
    //const [deleteNumblock, setDeleteNumblock] = useState([]);

    let selectNumblock = (numblock) =>{ 

        setActiveNumblock(prevNumblock => prevNumblock = numblock);
    }

    /*let deleteNumblock = (index) => {
        /*setNumblockGrid(prevGrid => {
            prevGrid = [...numblock_grid];
            prevGrid[index] = <Numblock key={index} num={""} x={-10} y={-10} index={index}/>;
            
        })
        let key = index;
        index = index - 1;
        numblock_grid[index] = <Numblock key={key} num={""} x={-10} y={-10} index={key}/>;
        console.log("Grid Updated", numblock_grid);
    }*/

    let updateNumblockGrid = (new_grid) => {
        setNumblockGrid(prevGrid => prevGrid = new_grid);
    }
  
    return (
      <NumbleContext.Provider value={{activeNumblock, numblock_grid}}>
          <NumbleUpdateContext.Provider value={{selectNumblock, updateNumblockGrid}}>
            {children}
          </NumbleUpdateContext.Provider>
      </NumbleContext.Provider>
    );
}

export function useNumbleContext() {
    return useContext(NumbleContext);
}

export function useNumbleUpdateContext() {
    return useContext(NumbleUpdateContext);
}