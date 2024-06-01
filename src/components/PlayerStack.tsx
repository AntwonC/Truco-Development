import { useState, ReactElement, ReactNode } from 'react';
import CardInterface from '../interfaces/CardInterface';
import '../styles/PlayerStack.css';

interface Props {
    className : string,
    user: string | null,
    player: string,
    hand: CardInterface[],
    showHandFunction : (hand : CardInterface[]) => ReactElement,
    disableShowHandFunction : (hand : CardInterface[], player : string) => ReactElement,
    turn: number[],
    p1 : string,
    p2 : string,
}
const PlayerStack = ({ className, user, player, hand, showHandFunction, disableShowHandFunction, turn, p1, p2 } : Props) => {
    if(user === null) return null;

    console.log(`Inside PlayerStack...`);
    console.log(`player: ${player}`);
    console.log(`playerTurns`);
    console.log(turn);


    return (
        <div className={className}>
            {user}            


            {turn[0] === -1 && p1 === player
                ?
                <>
                    <div className="circle"></div>
                    {showHandFunction(hand)}
                </>
                :
                <>
                   
                </>
            }

            {/* */}
            {turn[0] === 0 && p1 === player
                ?
                <>
                    {disableShowHandFunction(hand, player)}
                </>
                :
                <>
                   
                </>
            }


            {turn[1] === 0 && p2 === player
                ?
                <>
                    {disableShowHandFunction(hand, player)}
                    
                </>
                :
                <>
                    
                </>
            }

            {turn[1] === -1 && p2 === player
                ?
                <>
                    <div className="circle"></div>
                    {showHandFunction(hand)}
                    
                </>
                :
                <>
                    
                </>
            }






            
        </div>
    )
};

export default PlayerStack;

// [p1, p2]

// [-1, 0]

// [0, -1]