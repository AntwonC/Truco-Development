import { Button, Container, createTheme, ThemeProvider } from '@mui/material';
import { useState, useEffect, useRef, ReactElement, ChangeEvent } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Socket } from "socket.io-client";

import '../styles/GameRoom.css';
import PlayerStack from './PlayerStack';
import TopStack from './TopStack';

import Card from '../components/Card';

import CardInterface from '../interfaces/CardInterface';

interface Props {
    socket: Socket,
    roomNumber: number,
    user: string | null,
};

const theme = createTheme({
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
});

const GameRoom = ({ socket, roomNumber, user } : Props) => {

    const navigate = useNavigate();

    const [numInRoom, setNumInRoom] = useState<number>(0);

    const [topUser, setTopUser] = useState<string | null>(null);
    const [bottomUser, setBottomUser] = useState<string | null>(null);

    const [gameStarted, setGameStarted] = useState<boolean>(false);

    const countSocketRequests = useRef<number>(0);

    // Game useState objects
    const [p1, setP1] = useState<string>("");
    const [p2, setP2] = useState<string>("");

    const [p1Hand, setP1Hand] = useState<CardInterface[]>([]);
    const [p2Hand, setP2Hand] = useState<CardInterface[]>([]);

    const [turnCard, setTurnCard] = useState<CardInterface>({rank: null, suit: null, key: 2000});
    const [specialCard, setSpecialCard] = useState<CardInterface>({rank: null, suit: null, key: 1000});

    const [roundValue, setRoundValue] = useState<number>(-1);

    const [playerTurn, setPlayerTurn] = useState<number[]>([]);

    const [t1Score, setT1Score] = useState<number>(-1);
    const [t2Score, setT2Score] = useState<number>(-1);

    const [t1Rounds, setT1Rounds] = useState<number[]>([]);
    const [t2Rounds, setT2Rounds] = useState<number[]>([]);

    const [gameBoardTable, setGameBoardTable] = useState<CardInterface[]>([]);


    const decideTurn = (playerTurns : number[]) => {
        // [-1, 0]
        if(playerTurns[0] === -1) { // player 1 goes first
          setPlayerTurn([0, -1]);
        } else if(playerTurns[1] === -1) { // player 2 goes next
          setPlayerTurn([-1, 0]);
        }
    }
    // (ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLDivElement, MouseEvent>)
    // Figure out the type later
    const cardClicked = (evt : any)  => {
        
        
        console.log(`A card has been clicked`);
        const { suit, value } = evt.target.dataset;
        console.log(`suit: ${suit} | rank :${value}`);
        console.log(evt.target.dataset);
    
        if(suit === undefined || value === undefined) { // bug where clicking the corner would make it the other player's turn without playing a card
          return ;
        }
        // when card is clicked, send event to server using socket
        // send -> {user: -1 or 0, suit, rank}
        // [-1, 0]
        const ex = playerTurn[0] === -1 ? p1 : p2;
        const card : CardInterface = {rank: value, suit: suit, key: 9999, turn: ex};
    
    
    
        decideTurn(playerTurn);
        const turnObject = [0, -1];
        console.log(playerTurn);
        console.log(card);
       
        
        socket.emit("turn-play-card", card, playerTurn, roomNumber);
       
      }

    const showHand = (playerHand : CardInterface[]) : ReactElement => {
    
        return ( <div className="player-cards">
            {playerHand.map((element) => {
                if(element.suit === null || element.rank === null) {
                    return;
                }
              return <Card suit={element.suit} rank={element.rank} key={element.key} onClick={cardClicked} click={true}/>
            })}
        </div>)
    }

    const disableClickShowHand = (playerHand : CardInterface[], player : string) => {

        console.log(`in disbleClick: ${player}`);
        if(player === user ) {
          return ( <div className="player-cards">
          {playerHand.map((element) => {
            if(element.suit === null || element.rank === null) {
                return;
            }
            return <Card suit={element.suit} rank={element.rank} key={element.key} click={true} />
          })}
          </div>)
        } else {
        return ( <div className="player-cards">
        {playerHand.map((element) => {
            if(element.suit === null || element.rank === null) {
                return;
            }
          return <Card suit={element.suit} rank={element.rank} key={element.key} click={false} />
        })}
        </div>)
    
        }
      }

    const leaveRoomClicked = () => {
        //setJoin(false);
        socket.emit("leave-room", roomNumber, user);
        navigate('/');
      };
      // Use the score-board-text to push the game table down?
    //  <div className="score-board-text">Score Board Goes Here</div>

    useEffect(() => {

        // Socket sending TWO requests per client.. meaning if there were more players
        // then it would send N requests for N players.
        // How to handle this? 05/28/24
        socket.on("room-success", (userFromServer, room, usersInRoom, userTable) => {
            console.log(`usersInRoom: ${usersInRoom}`);
                
                setNumInRoom(usersInRoom);
                
            //   setUserTable(userTable);
                if(usersInRoom === 2) {
                    setBottomUser(user);
                    setGameStarted(true);
                    let tempVar : string = "";
                    for(let i = 0; i < userTable.length; i++) {
                        const userObject = userTable[i];
                    // console.log(`BottomUserOne: ${bottomUserOne}`);
                       // console.log(`userFromServer: ${userFromServer}`);
                        if(userObject.name !== user && userObject.room === roomNumber) {
                       // console.log(`userObject.name: ${userObject.name}`);
                        tempVar = userObject.name;
                        
                        setTopUser(userObject.name);
                        }
                    }
                    
                   // console.log(tempVar);
            
                    socket.emit("start-game", tempVar, user, roomNumber);
                }
           // } 
        });

        socket.on("start-game-confirmed", 
        (   deck : CardInterface[], 
            playerOneHand : CardInterface[], 
            playerTwoHand : CardInterface[], 
            playerOne : string, 
            playerTwo : string,
            turnCardObject: CardInterface,
            specialCardObject : CardInterface,
            turnValue : number,
            playerTurns : number[],
            teamOneScore : number,
            teamTwoScore : number,
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
            
            setTurnCard({rank: turnCardObject.rank, suit: turnCardObject.suit, key: turnCardObject.key});
            setSpecialCard(specialCardObject);

            setRoundValue(turnValue);
            
            setT1Score(teamOneScore);
            setT2Score(teamTwoScore);

            console.log(`turnCard:`);
            console.log(turnCard);

            console.log(specialCard);

            //gameSession.deck,
            //gameSession.playerOneHand,
            //gameSession.playerTwoHand,
            //gameSession.playerOne,
            //gameSession.playerTwo,
        });

        socket.on("turn-completed", 
            (p1Hand : CardInterface[],
             p2Hand : CardInterface[],
             roundOne : number[],
             roundTwo : number[],
             gameBoard : CardInterface[],
             turns : number[],) => {
            // revealHand.current = false;

            // waiting.current = false;
            setT1Rounds([...roundOne]);
            setT2Rounds([...roundTwo]);
            
            setP1Hand([...p1Hand]);
            setP2Hand([...p2Hand]);

            setPlayerTurn([...turns]);
            setGameBoardTable([...gameBoard]);

       
             
            /* setTimeout(() => {
       
             }, 1500); */
             
             if(gameBoard.length === 0) {
               // put animation here??
              
                 setGameBoardTable([]);
       
             
             } else {
               setGameBoardTable([...gameBoard]);
             }
       
           });

        return () => {
            socket.off("room-success");
            socket.off("start-game-confirmed");
            socket.off("turn-completed");
        }
    }, [socket]);
    return (
        <>
            <ThemeProvider theme={theme}>
                <div className="rectangle-container">
                    <div className="turn-container">
                    <div className="top-user-turn">

                        {topUser}
                    </div>
                    <div className="top-user-turn">
                            {bottomUser}
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
                    <Card suit={turnCard.suit === null ? "" : turnCard.suit} rank={turnCard.rank === null ? "" : turnCard.rank} key={turnCard.key + 2000}  click={true}/>
                    </div>

                <div >
                    Special
                    <Card suit={specialCard.suit === null ? "" : specialCard.suit} rank={specialCard.rank === null ? "" : specialCard.rank} key={specialCard.key + 3000}  click={true}/>
                </div>


                
                </div>
                    
                </div>


                <div className="game-table-container">
                    <div className="game-table">
                        

                    </div>

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
                            />
                        </div>
                </div>
           

                <Container>
                    <Button onClick={leaveRoomClicked}>Leave</Button>
                </Container>
            </ThemeProvider>
        </>
    )
};

export default GameRoom;