import { Button, Container, createTheme, ThemeProvider } from '@mui/material';
import { useState, useEffect, useRef, ReactElement } from 'react';
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

    const [turnCard, setTurnCard] = useState<CardInterface>({rank: "", suit: "", key: 1000});
    const [specialCard, setSpecialCard] = useState<CardInterface>({rank: "", suit: "", key: 1000});

    const [roundValue, setRoundValue] = useState<number>(-1);


    const showHand = (playerHand : CardInterface[]) : ReactElement => {
    
        return ( <div className="player-cards">
            {playerHand.map((element) => {
                if(element.suit === null || element.rank === null) {
                    return;
                }
              return <Card suit={element.suit} rank={element.rank} key={element.key} click={true}/>
            })}
        </div>)
    }

    const disableClickShowHand = (playerHand : CardInterface[], player : string) => {

        if(player === user ) {
          return ( <div className="player-cards">
          {playerHand.map((element) => {
            if(element.suit === null || element.rank === null) {
                return;
            }
            return <Card suit={element.suit} rank={element.rank} key={element.key}  click={true} />
          })}
          </div>)
        } else {
        return ( <div className="player-cards">
        {playerHand.map((element) => {
            if(element.suit === null || element.rank === null) {
                return;
            }
          return <Card suit={element.suit} rank={element.rank} key={element.key}  click={false} />
        })}
        </div>)
    
        }
      }

    const leaveRoomClicked = () => {
        //setJoin(false);
        socket.emit("leave-room", roomNumber, user);
        navigate('/');
       
       // socket.emit("get-slot-of-leaving-user", user, roomNumber);
        
        //dePopulateRoom();
      };
      // Use the score-board-text to push the game table down?
    //  <div className="score-board-text">Score Board Goes Here</div>

    useEffect(() => {

        // Socket sending TWO requests per client.. meaning if there were more players
        // then it would send N requests for N players.
        // How to handle this? 05/28/24
        socket.on("room-success", (userFromServer, room, usersInRoom, userTable) => {
            console.log(`countSocketRequests: ${countSocketRequests.current}`);
            //if(countSocketRequests.current > 1) {
             //   return ; 
            //} else {
                countSocketRequests.current = countSocketRequests.current + 1;
    
            /*    console.log(`${userFromServer} joined room ${roomNumber}`);
                console.log(usersInRoom);
                console.log(`${usersInRoom} users in room ${roomNumber}`);
                console.log(userTable); */
                
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
            turnCard: CardInterface,
            specialCard : CardInterface,
            turnValue : number,
            ) => {

            console.log(deck);
            console.log(playerOneHand);
            console.log(playerTwoHand);

            console.log(`playerOne: ${playerOne}`);
            console.log(`playerTwo: ${playerTwo}`);
            console.log(turnCard);
            console.log(specialCard);
            console.log(`turnValue: ${turnValue}`);

            setP1(playerOne);
            setP2(playerTwo);

            setP1Hand([...playerOneHand]);
            setP2Hand([...playerTwoHand]);

            setTurnCard(turnCard);
            setSpecialCard(specialCard);

            setRoundValue(turnValue);

            //gameSession.deck,
            //gameSession.playerOneHand,
            //gameSession.playerTwoHand,
            //gameSession.playerOne,
            //gameSession.playerTwo,
        });

        return () => {
            socket.off("room-success");
            socket.off("start-game-confirmed");
        }
    }, [socket]);
    return (
        <>
            <ThemeProvider theme={theme}>
                <div className="rectangle-container">
                    <div className="turn-container">
                    <div className="top-user-turn">

                        
                    </div>
                    <div className="top-user-turn">

                        </div>
                    </div>
                    
                    <div className="score-container">
                    Score
                    <div>{0}</div>
                    <div>{0}</div>
                    </div>

                    <div className="value-container">
                        Value
                        <div>{0}</div>
                    </div>
                <div className="special-card-container">
                    <div>
                    Turn
                    
                    </div>

                <div >
                    Special
                    
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
                        />
                    </div>

                        <div className="player-two-hand-container">
                            <PlayerStack
                                className="user-name-table-two" 
                                user={bottomUser}
                                player={p1 === bottomUser ? p1 : p2}
                                hand={p1 === bottomUser ? p1Hand : p2Hand}
                                showHandFunction={showHand}
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