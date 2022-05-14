let updateGrid = (numblocksUpdate) => {
    //Adding two numblocks together
    console.log("Updating Grid");
    let new_grid = [...numblock_grid];
    let activeIndex = [numblocksUpdate[1].index];
    
    numblocksUpdate.forEach(numblock => {
        new_grid[numblock.index] = numblock.num;
    });

    //repeat until there are no matches or empty spaces
    let match = true;
    let empty_indexes = activeIndex;
    while(match){
        new_grid = dropNumblocks(empty_indexes.flat(),new_grid);
        //Indexes of matched numbers will be given here, these will turn into empty blocks
        empty_indexes = checkForMatches(new_grid);
        if(empty_indexes.length > 0){
            //score = scoreMatches(new_grid, empty_indexes);
            //console.log("Total Scored", score);
            //setScore(prevScore => prevScore += score);
            new_grid = removeMatches(new_grid,empty_indexes);
        }
        else{
            console.log("No matches found");
            new_grid = newNumblocks(new_grid);
            empty_indexes = checkForMatches(new_grid);
            if(empty_indexes.length == 0){
                match = false;
            }
        }
    }

    setNumblockGrid(prevGrid => prevGrid = new_grid);
}