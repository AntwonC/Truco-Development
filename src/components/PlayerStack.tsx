    import { useState, ReactElement, ReactNode } from 'react';
    import CardInterface from '../interfaces/CardInterface';
    import Button from '@mui/material/Button';
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
    trucoClicked : (player : string, number: number) => void,
    roomNumber : number
    }
    const PlayerStack = ({ className, user, player, hand, showHandFunction, disableShowHandFunction, turn, p1, p2, trucoClicked, roomNumber } : Props) => {
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

    <div className="option-container"> 
    <Button variant="contained" color="primary" onClick={() => {trucoClicked(p1, roomNumber)}} >Truco</Button>
    </div>
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
    <div className="option-container">
    <Button onClick={() => {trucoClicked(p2, roomNumber)}} >Truco</Button>
    </div>
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
