let getEmptyIndexes = (grid) => {
    let empty_indexes = [];

    grid.forEach((number,ind) => {
        if(number === ""){
            empty_indexes.push(ind);
        }
    })
    return empty_indexes;
}


let cleanMatches = (match_indexes, cur_matches) =>{
    //If the current match is already in match_indexes, then do not add again to match indexes
    let exists = false;
    match_indexes.forEach(match => {
        console.log(cur_matches,match);
        if(exists === true){
            //do nothing
        }
        else{
            exists = cur_matches.every((ind => match.includes(ind)));
        }
    })
    return exists;
}

let scoreMatches = (grid,match_indexes) => {
    console.log("Matches to Score: ",match_indexes);
    let matches_triple_scored = [];
    let addToScore = 0;
    if(match_indexes.length == 0){
        return addToScore;
    }
    for(var i = 0; i < match_indexes.length; i++){
        let multiplier = 1;
        let num = grid[match_indexes[i][0]];//Number in the given set of matches

        switch(match_indexes[i].length){
            case 4:
                multiplier = 2;
                break;
            case 5:
                multiplier = 4;
                break;
        }
        for(var j = i+1; j < match_indexes.length; j++){

            match_indexes[i].forEach(index => {
                if( match_indexes[j].includes(index)){
                    switch(match_indexes[j].length){
                        case 4:
                            multiplier *= 2;
                            break;
                        case 5:
                            multiplier *= 4;
                            break;
                    }
                    matches_triple_scored.push(j);
                    console.log("Triple Score!");
                    multiplier += 3;
                }
            })
        }
        if(!matches_triple_scored.includes(i)){
            addToScore += (100*num*multiplier);
            console.log("Points Scored", addToScore, "Multiplier", multiplier);
            //setScore(prevScore => prevScore += addToScore);
        }
    }
    addToScore *= match_indexes.length;
    return addToScore;
}

let checkGameOver = (grid) => {
    let matchesFound = checkForMatches(grid);
    console.log("Matches Found, game continues:", matchesFound);
    if(matchesFound.length != 0){
        return false;
    }
    let direction = [1,5] //1=right one, 5=down one
    for(var i = 0; i < grid.length; i++){
        let numberToAdd = grid[i];
        //console.log("Number to Add",numberToAdd," Index: ", i);
        for (const dir of direction){
            let ydir = dir===5 ? 1 : 0;
            let xdir = dir===1 ? 1 : 0;
            let xpos = (i) % 5;
            let ypos = Math.floor((i)/5);
            //If out of bounds, skip this step and move on to next.
            if((xpos+xdir < 0 || xpos+xdir > 4)||(ypos+ydir < 0 || ypos+ydir > 4)){
                continue;
            }
            //console.log("Number Total", numberToAdd + grid[i+dir]);
            if((numberToAdd + grid[i+dir]) <= 10){
                console.log("Game not over, move at index:",i);
                return false;
            }
        }
    }
    console.log("Game Over!");
    //debugger;
    return true;
}


//Check for matches of 3 in a row or more
let checkForMatches = (grid) =>{
    let match_indexes =[];
    //1= right block,5 = below block, -1= left block, -5 = above block 
    let directions = [1,5,-1,-5];
    for(var i = 0; i < grid.length; i++){
        let match_number = grid[i];
        if(match_number === ""){
            continue;
        }
        //console.log("Current Search Index: ", i);
        directions.forEach(direction => {
            //console.log("Direction: ",direction);
            let searchIndex = i;
            let ydir = Math.abs(direction)===5 ? Math.sign(direction) : 0;
            let xdir = Math.abs(direction)===1 ? Math.sign(direction) : 0;
            let cur_match = [i];
            //if search index reaches the end of a row or column, check for matches and end while loop
            let end = false;
            
            while(!end){
                //Get current x and y position of searchIndex.
                let xpos = (searchIndex) % 5;
                let ypos = Math.floor((searchIndex)/5);
                //If match is found, continue in that direction
                if((xpos+xdir < 0 || xpos+xdir > 4)||(ypos+ydir < 0 || ypos+ydir > 4)){
                    //console.log("OUT OF BOUNDS");
                    end = true;
                }
                if(match_number === grid[searchIndex+direction]){
                    searchIndex += direction;
                    cur_match.push(searchIndex);
                    //Get x and y position of next searchIndex.
                    xpos = (searchIndex) % 5;
                    ypos = Math.floor((searchIndex)/5);
                    //If next searchIndex is out of bounds, then end while loop
                    //console.log("X",xpos,"Y",ypos,"Match Number",match_number);
                    //console.log('XPOS+XDIR: ',xpos+xdir,'YPOS-YDIR: ',ypos+ydir);
                    if((xpos+xdir < 0 || xpos+xdir > 4)||(ypos+ydir < 0 || ypos+ydir > 4)){
                        console.log("OUT OF BOUNDS");
                        end = true;
                        if(cur_match.length >= 3){
                            if(cleanMatches(match_indexes,cur_match) != true){
                                match_indexes.push(cur_match);
                            }
                        }
                    }
                }
                else if(cur_match.length >= 3){
                    if(cleanMatches(match_indexes,cur_match) != true){
                        match_indexes.push(cur_match);
                    }
                    end = true;
                }
                else{
                    end = true;
                }
            }
        })
    }
    console.table("Matches found", match_indexes);
    return match_indexes;
}

let randomNumber = () =>{
    return Math.floor(Math.random() * 10) + 1;
}








export {scoreMatches,checkForMatches,randomNumber, getEmptyIndexes,checkGameOver};