import {useState, useEffect, useRef} from "react";
import { useCub3skiContext, useCub3skiUpdateContext} from '../Contexts/cub3skiContext';
import Modal from '../components/modal'
import {DataStore} from 'aws-amplify';
import {Highscores} from "../src/models";


export default function GameOver(){
    const {gameOver,showGameOver,score} = useCub3skiContext();
    const {setShowGameOver} = useCub3skiUpdateContext();
    const [localScore,setLocalScore] = useState([]);
    const [username, setUsername] = useState("anon");
    const scoreSorted = useRef(false); //If scores have been sorted, don't try again.
    const scorePosted = useRef(false);
    //const [show,setShow] = useState(false);

    let handleClose = () => {
        setShowGameOver(false);
    }

    let handleScorePost = async () => {
        if(username === ""){
            alert("Must enter username to post score!");
            return;
        }
        else if(username.length > 10){
            alert("Username cannot be longer than 10 characters");
            return;
        }
        else if(score === 0){
            alert("Can't Post a score of 0 :(");
            return;
        }
        else if(scorePosted.current === true){
            alert("Your score was already posted. Can't post score again!");
            return;
        }
        try{
            //console.log("Saving Score", score);
            await DataStore.save(
            new Highscores(
                {
                    "username":username,
                    "score":score.current
                }
            )
            );
            scorePosted.current = true;
            alert("Score Posted Successfully!");
        }
        catch(error){
            //console.log("Failed to save score",error);
        }
    }

    let gameOverBody = () =>{
        let scoreList = [];
        let scoreCount = 1;
        for(let highscore of localScore){
            if(highscore > 0){
                scoreList.push((<p key={scoreCount}>{scoreCount}: {highscore}</p>));
            }
            scoreCount++;
        }
        //console.log(localScore);
        return(
        <>
            <p>Game Over</p>
            <p><strong>Your HighScores:</strong></p>
            {scoreList}
            <form>
            <label>Enter your username:
                <input
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />
            </label>
            </form>
            <button onClick={()=>handleScorePost()}>Post score to Highscore Board</button>
        </>
        )
    }

    useEffect(() => {
        let localHighScores = [];
        if(gameOver === true && scoreSorted.current === false){
            //localStorage.setItem("highscore",JSON.stringify([0,0,0,0,0]));
            localHighScores = JSON.parse(localStorage.getItem("highscore"));
            //If first time playing
            if(localHighScores === null){
                localStorage.setItem("highscore",JSON.stringify([score.current,0,0,0,0]));
            }
            //Else determine where current score goes.
            else{
                let sorted_scores = [...localHighScores,0];//length of localScore.current + 1
                for(var i = localHighScores.length - 1; i >= 0 ; i--){
                    if(score.current > localHighScores[i]){
                        sorted_scores[i+1] = localHighScores[i];
                        sorted_scores[i] = score.current;
                    }
                    //If score is not greater than the next greatest score, end comparrison
                    else{
                        break;
                    }
                }
                sorted_scores = sorted_scores.slice(0,sorted_scores.length-1);
                localStorage.setItem("highscore",JSON.stringify(sorted_scores));
            }
            scoreSorted.current = true;
            setLocalScore(prevLocalScore => prevLocalScore = JSON.parse(localStorage.getItem("highscore")));
        }
    },[gameOver])

    return(
        <Modal 
        onClose={()=>handleClose(false)} 
        show={showGameOver} 
        title={<strong>Thanks for playing!</strong>}
        body={gameOverBody()}/>
    )
}