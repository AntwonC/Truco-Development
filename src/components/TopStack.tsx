import { ReactElement, useState } from 'react';
import CardInterface from '../interfaces/CardInterface';

interface Props {
    className : string,
    user: string | null,
    player: string,
    hand: CardInterface[],
    disableShowHandFunction : (hand : CardInterface[], player : string) => ReactElement,
    turn: number[],
    p1 : string,
    p2 : string,
}

const TopStack = ({ className, user, player, hand, disableShowHandFunction, turn, p1, p2 } : Props) => {
    if(user === null) return null;
    console.log(`in topStack: ${user}`);
    console.log(hand);
    return (
        <div className={className}>
            {user}
            
            {turn[0] === -1 || turn[1] === -1
                ?
                <>
                   
                    {disableShowHandFunction(hand, player)}
                </>
                :
                <></>
            }



        </div>
    )
};

export default TopStack;