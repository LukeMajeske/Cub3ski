import {DataStore, Predicates, SortDirection} from 'aws-amplify';
import {Highscores} from "../src/models";
import Modal from './modal'
import {useEffect, useState, useRef} from 'react';
import { useCub3skiContext, useCub3skiUpdateContext} from '../Contexts/cub3skiContext';
import styles from '../styles/Home.module.css'

export default function LeaderBoard(){
    const {showLeaderboard} = useCub3skiContext();
    const {setShowLeaderboard} = useCub3skiUpdateContext();
    const [highScores, setHighScores] = useState([]);
    const scoresLoaded = useRef(false);
    
    let handleClose = () => {
        setShowLeaderboard(false);
    }

    let getHighscores = async () => {
        const models = await DataStore.query(Highscores,Predicates.ALL,{
            sort: s => s.score(SortDirection.DESCENDING)
        });
        
        let scores = [];
        for(const [index,score] of models.entries()){
            if(index >= 10){
                break;
            }
            scores.push((
                <tr key={score.id}>
                    <td><strong>{index+1}:</strong></td>
                    <td>{score.username}</td>
                    <td>{score.score}</td>
                </tr>
            ));
        }
        setHighScores(scores);
    }

    let leaderBoardBody = () => {
        return(
            <div className='leaderBoard'>
            {highScores.length === 0 ? <p>No Scores To Show</p> 
            : 
            <table>
                <tr>
                    <th></th>
                    <th>Username</th>
                    <th>Score</th>
                </tr>
                {highScores}
            </table>}
            <button onClick={()=>getHighscores()}>Update Scores</button>
            </div>
        )
    }

    useEffect(()=>{
        if(!scoresLoaded.current){
            getHighscores();
            scoresLoaded.current = true;
        }
    });

    return(
        <>
            <Modal 
            onClose={()=>handleClose(false)} 
            show={showLeaderboard} 
            title={<strong>Top 10 Global Highscores</strong>}
            body={leaderBoardBody()}/>

            <button className={styles.sidebarButton} 
            onClick={()=>setShowLeaderboard(true)}>See Highscores</button>
        </>
    )
}