import { ReactElement, useState } from "react";
import CardInterface from "../interfaces/CardInterface";

interface Props {
  className: string;
  user: string | null;
  player: string;
  hand: CardInterface[];
  disableShowHandFunction: (
    hand: CardInterface[],
    player: string,
  ) => ReactElement;
  turn: number[];
  p1: string;
  p2: string;
  revealHandPlayerOne: boolean;
  revealHandPlayerTwo: boolean;
  disableClickRevealHandFunction: (
    hand: CardInterface[],
    revealHandStateOne: boolean,
    revealHandStateTwo: boolean,
  ) => ReactElement | undefined;
  disableClickRevealHandFunctionTwo: (
    hand: CardInterface[],
    revealHandStateOne: boolean,
    revealHandStateTwo: boolean,
  ) => ReactElement | undefined;
}

const TopStack = ({
  className,
  user,
  player,
  hand,
  disableShowHandFunction,
  turn,
  p1,
  p2,
  revealHandPlayerOne,
  revealHandPlayerTwo,
  disableClickRevealHandFunction,
  disableClickRevealHandFunctionTwo,
}: Props) => {
  if (user === null) return null;
  console.log(`in topStack: ${user}`);
  console.log(hand);
  return (
    <div className={className}>
      {user}

      {user === p1
      ?
      <>
      {disableClickRevealHandFunction(hand, revealHandPlayerOne, revealHandPlayerTwo)}
      </>
      :
      <></>
      }

      {user === p2
      ?
      <>
      {disableClickRevealHandFunctionTwo(hand, revealHandPlayerOne, revealHandPlayerTwo)}
      </>
      :
      <></>
      }

      

    </div>
  );
};

export default TopStack;

/* 

      {turn[0] === -1 || turn[1] === -1 ? (
        <>{disableShowHandFunction(hand, player, revealHandPlayerOne, revealHandPlayerTwo)}</>
      ) : (
        <></>
      )}
*/
