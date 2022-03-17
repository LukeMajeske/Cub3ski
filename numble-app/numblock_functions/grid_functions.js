
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
                    multiplier *= 3;
                }
            })
        }
        if(!matches_triple_scored.includes(i)){
            addToScore = (100*num*multiplier);
            console.log("Points Scored", addToScore, "Multiplier", multiplier);
            //setScore(prevScore => prevScore += addToScore);
        }
    }
    return addToScore;
}

let removeMatches = (grid, match_indexes) => {
    match_indexes.forEach(match => {
        match.forEach(index => {
            grid[index] = "";
        })
    })
    return grid;
}

//Check for matches of 3 in a row or more
let checkForMatches = (grid) =>{
    let match_indexes =[];
    for(var i = 0; i < grid.length; i++){
        let match_number = grid[i];
        if(match_number === ""){
            continue;
        }
        //1= right block,5 = below block, -1= left block, -5 = above block 
        let directions = [1,5,-1,-5];
        directions.forEach(direction => {
            let searchIndex = i;
            let cur_match = [i];
            //if search index reaches the end of a row or column, check for matches and end while loop
            let end = false;
            while(!end){
                //If match is found, continue in that direction
                if(match_number === grid[searchIndex+direction]){
                    searchIndex += direction;
                    cur_match.push(searchIndex);
                    //If next searchIndex is out of bounds, then end while loop
                    let xpos = (searchIndex) % 5;
                    let ypos = Math.floor((searchIndex)/5);
                    if((xpos < 0 || xpos > 4)||(ypos < 0 || ypos > 4)){
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








export {scoreMatches,checkForMatches, removeMatches,randomNumber};