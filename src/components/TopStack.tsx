import { ReactElement, useState } from 'react';
import CardInterface from '../interfaces/CardInterface';

interface Props {
    className : string,
    user: string | null,
    player: string,
    hand: CardInterface[],
    disableShowHandFunction : (hand : CardInterface[], player : string) => ReactElement
}

const TopStack = ({ className, user, player, hand, disableShowHandFunction } : Props) => {
    if(user === null) return null;
    return (
        <div className={className}>
            {user}
            {disableShowHandFunction(hand, player)}
        </div>
    )
};

export default TopStack;