import {DataStore, Predicates, SortDirection} from 'aws-amplify';
import {Highscores} from "../src/models";
import Modal from './modal'
import {useEffect, useState, useRef} from 'react';
import { useNumbleContext, useNumbleUpdateContext} from '../Contexts/numbleContext';
import styles from '../styles/Home.module.css'

export default function LeaderBoard(){
    const {showLeaderboard} = useNumbleContext();
    const {setShowLeaderboard} = useNumbleUpdateContext();
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
        for(const score of models){
            scores.push((
                <tr key={score.id}>
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
                    <th>Username</th>
                    <th>Score</th>
                </tr>
                {highScores}
            </table>}
            <button onClick={()=>getHighscores()}>Update Scores</button>
            </div>
        )
    }

    useEffect(async ()=>{
        if(!scoresLoaded.current){
            const models = await DataStore.query(Highscores,Predicates.ALL,{
                sort: s => s.score(SortDirection.DESCENDING)
            });

            let scores = [];
            for(const score of models){
                scores.push((
                    <tr key={score.id}>
                        <td>{score.username}</td>
                        <td>{score.score}</td>
                    </tr>
                ));
            }
            scoresLoaded.current = true;
            setHighScores(scores);
        }
    });

    return(
        <>
            <Modal 
            onClose={()=>handleClose(false)} 
            show={showLeaderboard} 
            title={<strong>Global Highscores</strong>}
            body={leaderBoardBody()}/>

            <button className={styles.sidebarButton} 
            onClick={()=>setShowLeaderboard(true)}>See Highscores</button>
        </>
    )
}