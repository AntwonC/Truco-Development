import { useState, ReactElement, ReactNode } from "react";
import CardInterface from "../interfaces/CardInterface";
import Button from "@mui/material/Button";
import "../styles/PlayerStack.css";

import TrucoContainer from './TrucoContainer';
import ThreeClownsContainer from './ThreeClownsContainer';
import LastHandContainer from './LastHandContainer';


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
  clickedAcceptLastHand: (player: string, number: number) => void;
  clickedDeclineLastHand: (player: string, number: number) => void;
  lastHandRefPlayerOne: boolean;
  lastHandRefPlayerTwo: boolean;
  clickedAcceptThreeClowns: (player: string, number: number) => void;
  clickedDeclineThreeClowns: (player: string, number: number) => void;
  threeClownsClicked: (player: string, number: number) => void;
  threeClownsRef: boolean;
  threeClownsClickedPlayerOne: boolean;
  threeClownsClickedPlayerTwo: boolean;
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
  clickedAcceptLastHand,
  clickedDeclineLastHand,
  lastHandRefPlayerOne,
  lastHandRefPlayerTwo,
  clickedAcceptThreeClowns,
  clickedDeclineThreeClowns,
  threeClownsClicked,
  threeClownsRef,
  threeClownsClickedPlayerOne,
  threeClownsClickedPlayerTwo,
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

            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                threeClownsClicked(p1, roomNumber);
              }}
            >
              Three Clowns
            </Button>

          </div>

          {
          trucoPressedRef === true  || threeClownsRef === true
          ?
          <>
          {disableShowHandFunction(hand, p1)}
          </>
          :
          <>
          {showHandFunction(hand)}
          </>
          }



          {lastHandRefPlayerOne === true 
          ?
          <>
          <LastHandContainer
            show={lastHandRefPlayerOne}
            rNumber={roomNumber}
            acceptClicked={clickedAcceptLastHand}
            declineClicked={clickedDeclineLastHand}
            player={p1}
          />
          
          </>
          :
          <>
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
         {
          threeClownsRef === true 
          ?
          <ThreeClownsContainer 
             show={threeClownsRef === true}
             rNumber={roomNumber}
             acceptClicked={clickedAcceptThreeClowns}
             declineClicked={clickedDeclineThreeClowns}
             player={p1}
          />
          :
          <></>
          }


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

          {
          threeClownsRef === true 
          ?
          <ThreeClownsContainer 
             show={threeClownsRef === true}
             rNumber={roomNumber}
             acceptClicked={clickedAcceptThreeClowns}
             declineClicked={clickedDeclineThreeClowns}
             player={p1}
          />
          :
          <></>
          }
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

          <Button
              variant="contained"
              color="primary"
              onClick={() => {
                threeClownsClicked(p2, roomNumber);
              }}
            >
              Three Clowns
          </Button>

          {
          trucoPressedRef === true || threeClownsRef === true
          ?
          <>
          {disableShowHandFunction(hand, p2)}
          </>
          :
          <>
          {showHandFunction(hand)}
          </>
          }

          {lastHandRefPlayerTwo === true 
          ?
          <>
          <LastHandContainer
            show={lastHandRefPlayerTwo}
            rNumber={roomNumber}
            acceptClicked={clickedAcceptLastHand}
            declineClicked={clickedDeclineLastHand}
            player={p2}
          />
          
          </>
          :
          <>
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
