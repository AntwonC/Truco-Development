import { Button, Container, createTheme, ThemeProvider } from "@mui/material";
import { useState, useEffect, useRef, ReactElement, ChangeEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Socket } from "socket.io-client";

import PlayerStack from "./PlayerStack";
import TopStack from "./TopStack";

import TrucoContainer from "./TrucoContainer";

import Card from "../components/Card";

import CardInterface from "../interfaces/CardInterface";

import "../styles/GameRoom.css";

interface Props {
  socket: Socket;
  roomNumber: number;
  user: string | null;
}

/*const theme = createTheme({
components: {

MuiButton: {
styleOverrides: {
root: {
position: 'absolute',
bottom: '0',
left: '0',
backgroundColor: '#243FA6',
color: 'white',
}
}
}
}
}); */

const GameRoom = ({ socket, roomNumber, user }: Props) => {
  const navigate = useNavigate();

  const [numInRoom, setNumInRoom] = useState<number>(0);

  const [topUser, setTopUser] = useState<string | null>(null);
  const [bottomUser, setBottomUser] = useState<string | null>(null);

  const countSocketRequests = useRef<number>(0);
  // Game useState objects
  const [p1, setP1] = useState<string>("");
  const [p2, setP2] = useState<string>("");
  const [p1Hand, setP1Hand] = useState<CardInterface[]>([]);
  const [p2Hand, setP2Hand] = useState<CardInterface[]>([]);
  const [turnCard, setTurnCard] = useState<CardInterface>({
    rank: null,
    suit: null,
    key: 2000,
  });
  const [specialCard, setSpecialCard] = useState<CardInterface>({
    rank: null,
    suit: null,
    key: 1000,
  });
  const [roundValue, setRoundValue] = useState<number>(-1);
  const [playerTurn, setPlayerTurn] = useState<number[]>([]);
  const [t1Score, setT1Score] = useState<number>(-1);
  const [t2Score, setT2Score] = useState<number>(-1);

  const [t1Rounds, setT1Rounds] = useState<number[]>([]);
  const [t2Rounds, setT2Rounds] = useState<number[]>([]);
  const [gameBoardTable, setGameBoardTable] = useState<CardInterface[]>([]);
  const [userWonRound, setUserWonRound] = useState<string>("");
  const [gameWinner, setGameWinner] = useState<number>(-1);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  // Truco State
  const [acceptTruco, setAcceptTruco] = useState<boolean>(false);
  // Refs
  const waiting = useRef<boolean>(false);
  const trucoPressed = useRef<boolean>(false);
  const lastHandShowdownOne = useRef<boolean>(false);
  const lastHandShowdownTwo = useRef<boolean>(false);

  const trucoClicked = (player: string, number: number) => {
    // setAcceptTruco(true);
    console.log("Truco Clicked");
    trucoPressed.current = true;
    socket.emit("truco-clicked", player, number, false, false);
  };
  const clickedAcceptTruco = (player: string, number: number) => {
    trucoPressed.current = false;
    setAcceptTruco(false);
    // socket.emit("truco-accepted", )
    socket.emit("truco-clicked", player, roomNumber, true, false);
  };
  const clickedDeclineTruco = (player: string, number: number) => {
    trucoPressed.current = false;
    console.log("trucoPressed....");
    console.log(trucoPressed.current);
    setAcceptTruco(false);
    // setDeclineTruco(!declineTruco);
    socket.emit("truco-clicked", player, roomNumber, false, true);
    // setRoundValue(1);
  };

  /* --------START------------
     Last Hand Logic here 
     --------START------------*/
  const lastHandAccepted = (player: string, number: number) => {
    
    if(p1 === player) {
      console.log(`Player 1 is making the decision...`);
      lastHandShowdownOne.current = false;
    } else if(p2 === player) {
      console.log(`Player 2 is making the decision...`);
      lastHandShowdownTwo.current = false;
    }
    socket.emit("last-hand-before-winning", player, number, true, false);
  }

  const lastHandDeclined = (player: string, number: number) => {
    if(p1 === player) {
      console.log(`Player 1 is making the decision......`);
      lastHandShowdownOne.current = false;
    } else if(p2 === player) {
      console.log(`Player 2 is making the decision......`);
      lastHandShowdownTwo.current = false;
    }

    socket.emit("last-hand-before-winning", player, number, false, true);
  }
    /* --------END------------
     Last Hand Logic 
     --------END------------*/


  const decideTurn = (playerTurns: number[]) => {
    // [-1, 0]
    if (playerTurns[0] === -1) {
      // player 1 goes first
      setPlayerTurn([0, -1]);
    } else if (playerTurns[1] === -1) {
      // player 2 goes next
      setPlayerTurn([-1, 0]);
    }
  };
  // (ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLDivElement, MouseEvent>)
  // Figure out the type later
  const cardClicked = (evt: any) => {
    console.log(`A card has been clicked`);
    const { suit, value } = evt.target.dataset;
    console.log(`suit: ${suit} | rank :${value}`);
    console.log(evt.target.dataset);
    if (suit === undefined || value === undefined) {
      // bug where clicking the corner would make it the other player's turn without playing a card
      return;
    }
    // when card is clicked, send event to server using socket
    // send -> {user: -1 or 0, suit, rank}
    // [-1, 0]
    const ex = playerTurn[0] === -1 ? p1 : p2;
    const card: CardInterface = {
      rank: value,
      suit: suit,
      key: 9999,
      turn: ex,
    };
    decideTurn(playerTurn);
    const turnObject = [0, -1];
    console.log(playerTurn);
    console.log(card);
    socket.emit("turn-play-card", card, playerTurn, roomNumber);
  };

  const showHand = (playerHand: CardInterface[]): ReactElement => {
    return (
      <div className="player-cards">
        {playerHand.map((element) => {
          if (element.suit === null || element.rank === null) {
            return;
          }
          return (
            <Card
              suit={element.suit}
              rank={element.rank}
              key={element.key}
              onClick={cardClicked}
              click={true}
            />
          );
        })}
      </div>
    );
  };

  const disableClickShowHand = (
    playerHand: CardInterface[],
    player: string,
  ) => {
    console.log(`in disbleClick: ${player}`);
    if (player === user) {
      return (
        <div className="player-cards">
          {playerHand.map((element) => {
            if (element.suit === null || element.rank === null) {
              return;
            }
            return (
              <Card
                suit={element.suit}
                rank={element.rank}
                key={element.key}
                click={true}
              />
            );
          })}
        </div>
      );
    } else {
      return (
        <div className="player-cards">
          {playerHand.map((element) => {
            if (element.suit === null || element.rank === null) {
              return;
            }
            return (
              <Card
                suit={element.suit}
                rank={element.rank}
                key={element.key}
                click={false}
              />
            );
          })}
        </div>
      );
    }
  };

  const updateRound = (
    round: number[],
    player: string,
    userWonRound: string,
  ) => {
    console.log(`in updateRound()`);
    console.log(round);
    if (player === userWonRound) {
      return (
        <div>
          {round.map((element) => {
            if (element === 0) {
              return <div className="green-circle"> </div>;
            } else {
              return <div className="circle"></div>;
            }
          })}
        </div>
      );
    } else if (player === userWonRound) {
      return (
        <div>
          {round.map((element) => {
            if (element === 0) {
              return <div className="green-circle"> </div>;
            } else {
              return <div className="circle"></div>;
            }
          })}
        </div>
      );
    }
    return (
      <div>
        {round.map((element) => {
          if (element === 0) {
            return <div className="green-circle"> </div>;
          } else {
            return <div className="circle"></div>;
          }
        })}
      </div>
    );
  };

  const leaveRoomClicked = () => {
    //setJoin(false);
    socket.emit("leave-room", roomNumber, user);
    navigate("/");
  };
  // Use the score-board-text to push the game table down?
  // <div className="score-board-text">Score Board Goes Here</div>

  useEffect(() => {
    // Socket sending TWO requests per client.. meaning if there were more players
    // then it would send N requests for N players.
    // How to handle this? 05/28/24
    socket.on(
      "room-success",
      (userFromServer, room, usersInRoom, userTable) => {
        console.log(`usersInRoom: ${usersInRoom}`);
        setNumInRoom(usersInRoom);
        // setUserTable(userTable);
        if (usersInRoom === 2) {
          setBottomUser(user);
          setGameStarted(true);
          let tempVar: string = "";
          for (let i = 0; i < userTable.length; i++) {
            const userObject = userTable[i];
            // console.log(`BottomUserOne: ${bottomUserOne}`);
            // console.log(`userFromServer: ${userFromServer}`);
            if (userObject.name !== user && userObject.room === roomNumber) {
              // console.log(`userObject.name: ${userObject.name}`);
              tempVar = userObject.name;
              setTopUser(userObject.name);
            }
          }
          // console.log(tempVar);
          socket.emit("start-game", tempVar, user, roomNumber);
        }
        // }
      },
    );

    socket.on(
      "user-left-room",
      (user: string, roomNumber: number, usersInRoom: number) => {
        console.log(`user-left-room getting triggered in GameRoom.jsx`);

        setGameStarted(false);
        setNumInRoom(usersInRoom);
        //console.log(room);
      },
    );

    socket.on(
      "start-game-confirmed",
      (
        deck: CardInterface[],
        playerOneHand: CardInterface[],
        playerTwoHand: CardInterface[],
        playerOne: string,
        playerTwo: string,
        turnCardObject: CardInterface,
        specialCardObject: CardInterface,
        turnValue: number,
        playerTurns: number[],
        teamOneScore: number,
        teamTwoScore: number,
        teamOneRounds: number[],
        teamTwoRounds: number[],
      ) => {
        console.log(deck);
        console.log(playerOneHand);
        console.log(playerTwoHand);

        console.log(`playerOne: ${playerOne}`);
        console.log(`playerTwo: ${playerTwo}`);
        console.log(turnCard);
        console.log(specialCard);
        console.log(`turnValue: ${turnValue}`);
        console.log(playerTurns);

        setP1(playerOne);
        setP2(playerTwo);

        setP1Hand([...playerOneHand]);
        setP2Hand([...playerTwoHand]);

        setPlayerTurn([...playerTurns]);
        setTurnCard({
          rank: turnCardObject.rank,
          suit: turnCardObject.suit,
          key: turnCardObject.key,
        });
        setSpecialCard(specialCardObject);

        setRoundValue(turnValue);
        setT1Score(teamOneScore);
        setT2Score(teamTwoScore);

        setT1Rounds([...teamOneRounds]);
        setT2Rounds([...teamTwoRounds]);

        console.log(`turnCard:`);
        console.log(turnCard);

        console.log(specialCard);

        setGameStarted(true);

        //gameSession.deck,
        //gameSession.playerOneHand,
        //gameSession.playerTwoHand,
        //gameSession.playerOne,
        //gameSession.playerTwo,
      },
    );

    socket.on(
      "turn-completed",
      (
        p1Hand: CardInterface[],
        p2Hand: CardInterface[],
        roundOne: number[],
        roundTwo: number[],
        gameBoard: CardInterface[],
        turns: number[],
      ) => {
        // revealHand.current = false;

        waiting.current = false;

        setT1Rounds([...roundOne]);
        setT2Rounds([...roundTwo]);
        setP1Hand([...p1Hand]);
        setP2Hand([...p2Hand]);

        setPlayerTurn([...turns]);
        setGameBoardTable([...gameBoard]);

        /* setTimeout(() => {
}, 1500); */
        if (gameBoard.length === 0) {
          // put animation here??
          setGameBoardTable([]);
        } else {
          setGameBoardTable([...gameBoard]);
        }
      },
    );

    socket.on(
      "winner-round",
      (
        winner: CardInterface,
        p1RoundsArr: number[],
        p2RoundsArr: number[],
        playerOne: string,
        playerTwo: string,
        turns: number[],
      ) => {
        const winnerUser = winner.turn;

        setUserWonRound(winnerUser === undefined ? "" : winnerUser);
        console.log(`Turns...`);
        console.log(turns);
        /* setTimeout(() => {
}, 1500); */
        setPlayerTurn([...turns]);
        // check if anybody has won this turn...
        const p1TempArr = [...p1RoundsArr];
        const p2TempArr = [...p2RoundsArr];
        if (winnerUser === playerOne) {
          // increment round for the user...
          setT1Rounds([...p1RoundsArr]);
        } else if (winnerUser === playerTwo) {
          setT2Rounds([...p2RoundsArr]);
        }
        // [0, -1, -1]
        // [0, 0, -1]
        // [-1, 0, -1]
        // [0, -1, 0]
        // Check for double tie first... then increment score based on that..
        let checkDoubleTieCounter1 = 0;
        for (let x = 0; x < p1TempArr.length; x++) {
          const currentIndex = p1TempArr[x];
          if (checkDoubleTieCounter1 === 2) {
          } else if (currentIndex === 0) {
            checkDoubleTieCounter1++;
          }
        }
        let checkDoubleTieCounter2 = 0;
        for (let x = 0; x < p2TempArr.length; x++) {
          const currentIndex = p2TempArr[x];
          if (checkDoubleTieCounter2 === 2) {
          } else if (currentIndex === 0) {
            checkDoubleTieCounter2++;
          }
        }
        // Should give both teams the point, if reaches the limit then it will be handled.
        // Person that initiated the tie should go first.. -> 05/10/2024
        if (checkDoubleTieCounter1 === 2 && checkDoubleTieCounter2 === 2) {
          console.log("We got a double tie! Give a point to both teams");
          const tieString = "tie";
          socket.emit("reset-next-turn", tieString, roomNumber);
          return;
        }
        let p1Counter = 0;
        //console.log(`p1Counter: ${p1Counter}`);
        for (let i = 0; i < p1TempArr.length; i++) {
          const currentIndex = p1TempArr[i];
          console.log(`p1Counter: ${p1Counter} ${i}`);
          if (p1Counter === 2) {
            // p1 won the turn...reset the state for next turn...
            console.log(`player 1 won this turn! ${playerOne}`);
            socket.emit("reset-next-turn", playerOne, roomNumber);
            return;
          } else if (currentIndex === 0) {
            p1Counter++;
          }
        }
        let p2Counter = 0;
        //console.log(`p2Counter: ${p2Counter}`);
        for (let i = 0; i < p2TempArr.length; i++) {
          const currentIndex = p2TempArr[i];
          console.log(`p2Counter: ${p2Counter} ${i}`);
          if (p2Counter === 2) {
            // p2 won the turn...
            console.log(`player 2 won this turn! ${playerTwo}`);
            socket.emit("reset-next-turn", playerTwo, roomNumber);
            return;
          } else if (currentIndex === 0) {
            p2Counter++;
          }
        }
      },
    );

    socket.on(
      "reset-completed",
      (
        playerOneHand: CardInterface[],
        playerTwoHand: CardInterface[],
        turnCardObject: CardInterface,
        specialCardObject: CardInterface,
        teamOneScore: number,
        teamTwoScore: number,
        playerTurnsObject: number[],
        roundValueVariable: number,
        roundOne: number[],
        roundTwo: number[],
      ) => {
        // revealPlayerOneHand.current = false;
        // revealPlayerTwoHand.current = false;

        // setClownsCountClickedP1(false);
        // setClownsCountClickedP2(false);

        // setRenderAgain(false);

        setRoundValue(roundValueVariable);
        // To have delay to show how many rounds each team/player won
        setTimeout(() => {
          setT1Rounds([...roundOne]);
          setT2Rounds([...roundTwo]);
        }, 1500);
        setPlayerTurn([...playerTurnsObject]);
        setP1Hand([...playerOneHand]);
        setP2Hand([...playerTwoHand]);

        setTurnCard(turnCardObject);
        setSpecialCard(specialCardObject);

        console.log(`teamOneScore: ${teamOneScore}`);
        console.log(`teamTwoScore: ${teamTwoScore}`);

        setT1Score(teamOneScore);
        setT2Score(teamTwoScore);
      },
    );

    socket.on("game-winner", (value: number) => {
      if (value === 1) {
        // p1 won
        setGameWinner(1);
      } else if (value === 2) {
        // p2 won
        setGameWinner(2);
      } else {
        setGameWinner(0);
      }
    });

    socket.on("waiting-game-board-finished", () => {
      console.log("Change acceptTruco to false");
      // setWaiting(false);
      waiting.current = false;
    });

    socket.on("truco-called", (value: number) => {
      if (value === -1) {
        // other player has not made the decision yet
        trucoPressed.current = true;
        setAcceptTruco(true); // forces re-render, use ref will be alive
      } else if (value === 1) {
        setRoundValue(1);
        trucoPressed.current = false;
        setAcceptTruco(false);
        //trucoPressed.current = false;
      } else if (value === 3) {
        setRoundValue(3);
        trucoPressed.current = false;
        setAcceptTruco(false);
        // trucoPressed.current = false;
      }
    });
   /* io.to(roomNumberString).emit("truco-declined", 
    currentGame.playerOneHand, 
    currentGame.playerTwoHand,
    currentGame.turnCard,
    currentGame.specialCard,
    currentGame.scoreTeamOne,
    currentGame.scoreTeamTwo,
    currentGame.playerTurn */

    socket.on("truco-declined", 
    (
      playerOneHand: CardInterface[],
      playerTwoHand: CardInterface[],
      turnCardObject: CardInterface,
      specialCardObject: CardInterface,
      teamOneScore: number,
      teamTwoScore: number,
      playerTurnsObject: number[],
    ) => {
      setAcceptTruco(false);
      trucoPressed.current = false;

      setP1Hand([...playerOneHand]);
      setP2Hand([...playerTwoHand]);


      setTurnCard(turnCardObject);
      setSpecialCard(specialCardObject);

      setT1Score(teamOneScore);
      setT2Score(teamTwoScore);


      setPlayerTurn([...playerTurnsObject]);
    });

    socket.on("score-threshold", 
      (
        player: string,
        beforeWinningScore: number, 
        t1Score: number, 
        t2Score: number,
      ) => {
      console.log("Score-threshold being called!");

      console.log(`t1Score: ${t1Score}`);
      console.log(`t2Score: ${t2Score}`);
      console.log(`beforeWinningScore: ${beforeWinningScore}`);
      console.log(`player: ${player}`);

      if(beforeWinningScore === t1Score) {
        lastHandShowdownOne.current = true;
      } else if(beforeWinningScore === t2Score) {
        lastHandShowdownTwo.current = true;
      }
     // socket.emit("last-hand-before-winning", )
    });

    

    socket.on("last-hand-accepted", (roundValue: number, player: string) => {
      console.log("inside last-hand-accepted");
      setRoundValue(roundValue);

      lastHandShowdownOne.current = false;
      lastHandShowdownTwo.current = false;

    });

    return () => {
      socket.off("room-success");
      socket.off("start-game-confirmed");
      socket.off("turn-completed");
      socket.off("winner-round");
      socket.off("reset-completed");
      socket.off("game-winner");
      socket.off("waiting-game-board-finished");
      socket.off("truco-called");
      socket.off("truco-declined");
      socket.off("score-threshold");
    };
  }, [socket]);
  return (
    <>
      <div className="rectangle-container">
        <div className="turn-container">
          <div className="top-user-turn">
            {p1 === undefined ? "" : p1}
            {updateRound(t1Rounds, p1, userWonRound)}
          </div>
          <div className="top-user-turn">
            {p2 === undefined ? "" : p2}
            {updateRound(t2Rounds, p2, userWonRound)}
          </div>
        </div>
        <div className="score-container">
          Score
          <div>T1: {t1Score}</div>
          <div>T2: {t2Score}</div>
        </div>

        <div className="value-container">
          Value
          <div>{roundValue}</div>
        </div>
        <div className="special-card-container">
          <div>
            Turn
            <Card
              suit={turnCard.suit === null ? "" : turnCard.suit}
              rank={turnCard.rank === null ? "" : turnCard.rank}
              key={turnCard.key + 2000}
              click={true}
            />
          </div>

          <div>
            Special
            <Card
              suit={specialCard.suit === null ? "" : specialCard.suit}
              rank={specialCard.rank === null ? "" : specialCard.rank}
              key={specialCard.key + 3000}
              click={true}
            />
          </div>
        </div>
      </div>

      <div>
        {gameWinner === 1 ? <h3>{p1} has won!</h3> : <></>}

        {gameWinner === 2 ? <h3>{p2} has won!</h3> : <></>}
      </div>

      <div className="game-table-container">
        <div className="game-table">
          {gameBoardTable.map((element) => {
            if (gameBoardTable.length === 2) {
              waiting.current = true;
            } else {
              waiting.current = false;
            }
            return (
              <Card
                suit={element.suit === null ? "" : element.suit}
                rank={element.rank === null ? "" : element.rank}
                key={element.key}
                click={true}
              />
            );
          })}
        </div>
        {gameStarted ? (
          <>
            <div className="player-one-hand-container">
              <TopStack
                className="user-name-table-one"
                user={topUser}
                player={p1 === topUser ? p1 : p2}
                hand={p1 === topUser ? p1Hand : p2Hand}
                disableShowHandFunction={disableClickShowHand}
                turn={playerTurn}
                p1={p1}
                p2={p2}
              />
            </div>

            <div className="player-two-hand-container">
              <PlayerStack
                className="user-name-table-two"
                user={bottomUser}
                player={p1 === bottomUser ? p1 : p2}
                hand={p1 === bottomUser ? p1Hand : p2Hand}
                showHandFunction={showHand}
                disableShowHandFunction={disableClickShowHand}
                turn={playerTurn}
                p1={p1}
                p2={p2}
                trucoClicked={trucoClicked}
                roomNumber={roomNumber}
                clickedAcceptTruco={clickedAcceptTruco}
                clickedDeclineTruco={clickedDeclineTruco}
                trucoPressedRef={trucoPressed.current}
                clickedAcceptLastHand={lastHandAccepted}
                clickedDeclineLastHand={lastHandDeclined}
                lastHandRefPlayerOne={lastHandShowdownOne.current}
                lastHandRefPlayerTwo={lastHandShowdownTwo.current}
              />
            </div>
          </>
        ) : (
          <></>
        )}
      </div>

      <Container>
        <Button
          sx={{ position: "absolute", bottom: 0, left: 0 }}
          variant="contained"
          onClick={leaveRoomClicked}
        >
          Leave
        </Button>
      </Container>
    </>
  );
};

export default GameRoom;
