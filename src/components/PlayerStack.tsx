import { useState, ReactElement, ReactNode } from 'react';
import CardInterface from '../interfaces/CardInterface';

interface Props {
    className : string,
    user: string | null,
    player: string,
    hand: CardInterface[],
    showHandFunction : (hand : CardInterface[]) => ReactElement
}
const PlayerStack = ({ className, user, player, hand, showHandFunction } : Props) => {
    if(user === null) return null;

    console.log(`Inside PlayerStack...`);
    console.log(`player: ${player}`);
    console.log(`hand:`);
    console.log(hand);


    return (
        <div className={className}>
            {user}
            
                {showHandFunction(hand)}
            
        </div>
    )
};

export default PlayerStack;