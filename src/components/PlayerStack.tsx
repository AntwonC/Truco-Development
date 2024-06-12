import { useState, ReactElement, ReactNode } from "react";
import CardInterface from "../interfaces/CardInterface";
import Button from "@mui/material/Button";
import "../styles/PlayerStack.css";

import TrucoContainer from './TrucoContainer';

interface Props {
  className: string;
  user: string | null;
  player: string;
  hand: CardInterface[];
  showHandFunction: (hand: CardInterface[]) => ReactElement;
  disableShowHandFunction: (
    hand: CardInterface[],
    player: string,
  ) => ReactElement;
  turn: number[];
  p1: string;
  p2: string;
  trucoClicked: (player: string, number: number) => void;
  roomNumber: number;
  clickedAcceptTruco: (player: string, number: number) => void;
  clickedDeclineTruco: (player: string, number: number) => void;
  trucoPressedRef: boolean;
}

const PlayerStack = ({
  className,
  user,
  player,
  hand,
  showHandFunction,
  disableShowHandFunction,
  turn,
  p1,
  p2,
  trucoClicked,
  roomNumber,
  clickedAcceptTruco,
  clickedDeclineTruco,
  trucoPressedRef,
}: Props) => {
  if (user === null) return null;

  console.log(`Inside PlayerStack...`);
  console.log(`player: ${player}`);
  console.log(`playerTurns`);
  console.log(turn);

  return (
    <div className={className}>
      {user}

      {turn[0] === -1 && p1 === player ? (
        <>
          <div className="circle"></div>

          <div className="option-container">
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                trucoClicked(p1, roomNumber);
              }}
            >
              Truco
            </Button>
          </div>

          {
          trucoPressedRef === true 
          ?
          <>
          {disableShowHandFunction(hand, p1)}
          </>
          :
          <>
          {showHandFunction(hand)}
          </>
          }
        </>
      ) : (
        <></>
      )}

      {/* */}
      {turn[0] === 0 && p1 === player ? (
        <>
        <TrucoContainer
            show={trucoPressedRef === true}
            rNumber={roomNumber}
            acceptClicked={clickedAcceptTruco}
            declineClicked={clickedDeclineTruco}
            player={p1}
         />
        {disableShowHandFunction(hand, player)}
        </>
      ) : (
        <></>
      )}

      {turn[1] === 0 && p2 === player ? (
        <>
        <TrucoContainer
            show={trucoPressedRef === true}
            rNumber={roomNumber}
            acceptClicked={clickedAcceptTruco}
            declineClicked={clickedDeclineTruco}
            player={p2}
         />
        {disableShowHandFunction(hand, player)}
        </>
      ) : (
        <></>
      )}

      {turn[1] === -1 && p2 === player ? (
        <>
          <div className="circle"></div>
          <div className="option-container">
            <Button
              variant="contained"
              onClick={() => {
                trucoClicked(p2, roomNumber);
              }}
            >
              Truco
            </Button>
          </div>

          {
          trucoPressedRef === true 
          ?
          <>
          {disableShowHandFunction(hand, p2)}
          </>
          :
          <>
          {showHandFunction(hand)}
          </>
          }
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default PlayerStack;

// [p1, p2]

// [-1, 0]

// [0, -1]
