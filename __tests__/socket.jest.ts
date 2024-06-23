//@ts-nocheck
import { createServer } from "node:http";
import { type AddressInfo } from "node:net";
import { io , type Socket as ClientSocket } from "socket.io-client";
import { Server, type Socket as ServerSocket } from "socket.io";
// Import socket server and gameObject, userStorageObject

import gameObject from '../backend/gameObject.ts';
import userStorageObject from '../backend/userStorage.ts';
import CardInterface from '../src/interfaces/CardInterface.ts';
import { Socket } from "node:dgram";
import { ConstructionOutlined, Done } from "@mui/icons-material";


const socketURL = "http://localhost:5000";

function waitFor(socket: ServerSocket | ClientSocket, event: string) {
  return new Promise((resolve) => {
    socket.once(event, resolve);
  });
}

// User Storage on the server for rooms
let object = new userStorageObject([]);
// Array that holds "gameObject" objects for "recovery" if a player leaves
let gamesInSession : gameObject[] = [];

const isEmpty = (obj : gameObject) => {
  for(var prop in obj) {
      if(obj.hasOwnProperty(prop))
          return false;
  }
  return true;
}
// Function to get "active" games in session for different rooms.. allows us to access the game in session
// and change its value to continue game loop
const getActiveGameSession = (roomNumber : number) : gameObject => {
  const sizeOfGameSession : number = gamesInSession.length;
  let currentGame : gameObject = {} as gameObject; // hacky way of getting exactly empty object..

  for(let i = 0; i < sizeOfGameSession; i++) {
      const gameSessionObject = gamesInSession[i];
      const activeRoomNumber = gameSessionObject.roomNumber;

      if(activeRoomNumber === roomNumber) {
          currentGame = gamesInSession[i];
          break;
      }
  }

  return currentGame;
}

describe("my awesome project", () => {
  let client1, client2;

  beforeAll((done) => {
    client1 = io.connect(socketURL);
    client2 = io.connect(socketURL);

        // Wait for clients to connect
        client1.on('connect', () => {
          console.log('client1 connected');
          client2.on('connect', () => {
            console.log('client2 connected');
            done();
          });
        });
  });

  afterAll(() => {
    client1.disconnect();
    client2.disconnect();
  });

  test("two players joining a room", (done) => {

      const roomNumber: number = 123;
      const player1: string = "anthony";
      const player2: string = "ofir1";

      let undefinedCheck1: boolean = false;
      let undefinedCheck2: boolean = false;

      // client1 sends "join-room" request
      client1.emit("join-room", roomNumber, player1); 

      // client2 after a slight delay sends its "join-room" request
      setTimeout(() => {
        client2.emit("join-room", roomNumber, player2);
      }, 100); // 100ms -> 0.1 seconds

      // Our server will send two requests to the client, needed for the frontend to display the game room
      // This will be called to avoid undefined
      client1.on('room-success', () => {
       // console.log("room-success with empty args is called first");

      });
      // The server will send 'room-success' to everybody in the roomNumber
      client1.on('room-success', (user: string, roomNumber: number, numberOfUsersInRoom: number, usersOnTable: userStorageObject[]) => {

        if(user === undefined) {
          undefinedCheck1 = true;
          return;
        }
        
        expect(user).toBeDefined();
       // expect(numberOfUsersInRoom).toBe(1);
        //done();
      });
      // Our server will send two requests to the client, needed for the frontend to display the game room
      // This will be called to avoid undefined users
      client2.on('room-success', () => {
        //console.log("room-success with empty args is called first");
      });
      // The server will send 'room-success' to everybody in the roomNumber
      client2.on('room-success', (user: string, roomNumber: number, numberOfUsersInRoom: number, usersOnTable: userStorageObject[]) => {
        
        if(user === undefined) {
          undefinedCheck2 = true;
          return;
        }
        
        expect(user).toBeDefined();
       // expect(numberOfUsersInRoom).toBe(2);
        done();
      });
    });
      
  test("start a game with two players", async () => {
    //  socket.on("start-game", (playerOne : string, playerTwo : string, roomNumber : number)
    // socket.emit("start-game", tempVar, user, roomNumber);
    const roomNumber: number = 123;
    const player1: string = "anthony";
    const player2: string = "ofir1";

    let undefinedCheck1: boolean = false;
    let undefinedCheck2: boolean = false;
    // Client1 initials a start-game, doesn't matter which client does it
    
    const clientOneActionSent = new Promise<void>((resolve) => {
      client1.emit("start-game", player1, player2, roomNumber);
      
      
      client1.on("start-game-confirmed", 
      (
        deckObject: CardInterface[],
        playerOneHandObject: CardInterface[],
        playerTwoHandObject: CardInterface[],
        playerOneObject: string,
        playerTwoObject: string,
        turnCardObject: CardInterface,
        specialCardObject: CardInterface,
        roundValueObject: number,
        playerTurnObject: number[],
        teamOneScoreObject: number,
        teamTwoScoreObject: number,
        teamOneRoundsObject: number[],
        teamTwoRoundsObject: number[],

      ) => {
            console.log("in client1");
            console.log(deckObject);
          expect(deckObject).toBeDefined();
          expect(playerOneHandObject).toBeDefined();
          expect(playerTwoHandObject).toBeDefined();
          expect(turnCardObject).toBeDefined();
          expect(specialCardObject).toBeDefined();
          expect(roundValueObject).toBeDefined();
          expect(playerTurnObject).toBeDefined();
          expect(teamOneScoreObject).toBeDefined();
          expect(teamTwoScoreObject).toBeDefined();
          expect(teamOneRoundsObject).toBeDefined();
          expect(teamTwoRoundsObject).toBeDefined();
          resolve();
        });
      }
    )

    await clientOneActionSent;
    //setTimeout(() => {

     // client2.emit("start-game", player1, player2, roomNumber);
    //}, 1000);

    
  });

  // socket.on("turn-play-card", (card : CardInterface, playerTurn : number[], roomNumber : number )
  /*
              io
            .to(roomNumberString)
            .emit("reset-completed",
             currentGame.playerOneHand, 
             currentGame.playerTwoHand, 
             currentGame.turnCard, 
             currentGame.specialCard, 
             currentGame.scoreTeamOne, 
             currentGame.scoreTeamTwo, 
             currentGame.playerTurn, 
             currentGame.roundVal, 
             currentGame.teamOneRounds, 
             currentGame.teamTwoRounds
             );
  
  */
  test("two players play a turn", async () => {
    const roomNumber: number = 123;
    const player1: string = "anthony";
    const player2: string = "ofir1";

    let undefinedCheck1: boolean = false;
    let undefinedCheck2: boolean = false;

    let p1Hand: CardInterface[] = [];
    let p2Hand: CardInterface[] = [];

    let p1FirstCard: CardInterface = {};
    let p2FirstCard: CardInterface = {};

    let playerTurns: number[] = [];

    //client1.emit("start-game", player1, player2, roomNumber);

    const clientOneActionSent = new Promise<void>((resolve) => {
      client1.emit("start-game", player1, player2, roomNumber);
      
      
      client1.on("start-game-confirmed", 
      (
        deckObject: CardInterface[],
        playerOneHandObject: CardInterface[],
        playerTwoHandObject: CardInterface[],
        playerOneObject: string,
        playerTwoObject: string,
        turnCardObject: CardInterface,
        specialCardObject: CardInterface,
        roundValueObject: number,
        playerTurnObject: number[],
        teamOneScoreObject: number,
        teamTwoScoreObject: number,
        teamOneRoundsObject: number[],
        teamTwoRoundsObject: number[],

      ) => {
            //console.log("in client1");
            console.log(deckObject);
          expect(deckObject).toBeDefined();
          expect(playerOneHandObject).toBeDefined();
          expect(playerTwoHandObject).toBeDefined();
          expect(turnCardObject).toBeDefined();
          expect(specialCardObject).toBeDefined();
          expect(roundValueObject).toBeDefined();
          expect(playerTurnObject).toBeDefined();
          expect(teamOneScoreObject).toBeDefined();
          expect(teamTwoScoreObject).toBeDefined();
          expect(teamOneRoundsObject).toBeDefined();
          expect(teamTwoRoundsObject).toBeDefined();


          p1FirstCard = playerOneHandObject.shift();
          p2FirstCard = playerTwoHandObject.shift();

          p1FirstCard.turn = player1;
          p2FirstCard.turn = player2;

          resolve();
        });
      });

      await clientOneActionSent;
    

    const clientTwoActionSent = new Promise<void>((resolve) => {
      client1.emit("turn-play-card", p1FirstCard, [-1, 0], roomNumber);

      client1.on("winner-round", 
        (
          roundWinnerObject: string,
          teamOneRoundsObject: number[],
          teamTwoRoundsObject: number[],
          playerOneObject: string,
          playerTwoObject: string,
          playerTurnsObject: number[],
        ) => {
          console.log("client1 winner round");
          
          const t1Rounds = teamOneRoundsObject;
          const t2Rounds = teamTwoRoundsObject;

          let counterForOne = 0;
          // checking for two zero's
          
          for(let i = 0; i < t1Rounds.length; i++) {
            if(t1Rounds[i] === 0) {
              counterForOne++;
            }
          }
          
          let counterForTwo = 0;

          for(let i = 0; i < t2Rounds.length; i++) {
            if(t2Rounds[i] === 0) {
              counterForTwo++;
            }
          }
            
          if(counterForOne === 2) {
            resolve();
          } else if(counterForTwo === 2) {
            resolve();
          }
          
          resolve();
      });

      client1.on("turn-completed", 
          (
            playerOneHandObject: CardInterface[],
            playerTwoHandObject: CardInterface[],
            teamOneRoundsObject: number[],
            teamTwoRoundsObject: number[],
            gameBoardObject: CardInterface[],
            playerTurnsObject: number[],
          ) => {

           // console.log("client1 turn completed");
           // console.log('------------------------------');
           // console.log(teamOneRoundsObject);
           // console.log(teamTwoRoundsObject);
           // console.log('------------------------------');
            
           
            resolve();
        });


    });
    // Need to grab the current game that was created from the test before

    await clientTwoActionSent;
    

    const clientTwoTurnCardSent = new Promise<void>((resolve) => {
    

      setTimeout(() => {
        client2.emit("turn-play-card", p2FirstCard, [0, -1], roomNumber);
      }, 2000);

      client2.on("winner-round", 
      (
        roundWinnerObject: string,
        teamOneRoundsObject: number[],
        teamTwoRoundsObject: number[],
        playerOneObject: string,
        playerTwoObject: string,
        playerTurnsObject: number[],
      ) => {
        console.log("client2 winner round");

        const t1Rounds = teamOneRoundsObject;
        const t2Rounds = teamTwoRoundsObject;

        let counterForOne = 0;
        // checking for two zero's
        
        for(let i = 0; i < t1Rounds.length; i++) {
          if(t1Rounds[i] === 0) {
            counterForOne++;
          }
        }
        
        let counterForTwo = 0;

        for(let i = 0; i < t2Rounds.length; i++) {
          if(t2Rounds[i] === 0) {
            counterForTwo++;
          }
        }
        // Tie case, will code it to run a certain test suite if possible with a boolean
       // if(counterForOne == 2 && counterForTwo == 2) {
          //
       // }
        if(counterForOne === 2) {
          resolve();
        } else if(counterForTwo === 2) {
          resolve();
        }
        
        resolve();
    });

        client2.on("turn-completed", 
        (
          playerOneHandObject: CardInterface[],
          playerTwoHandObject: CardInterface[],
          teamOneRoundsObject: number[],
          teamTwoRoundsObject: number[],
          gameBoardObject: CardInterface[],
          playerTurnsObject: number[],
        ) => {

         // console.log("client2 turn completed");
         // console.log('------------------------------');
         // console.log(teamOneRoundsObject);
         // console.log(teamTwoRoundsObject);
         // console.log('------------------------------');
         console.log(gameBoardObject);
        // setTimeout(() => {
          // expect(gameBoardObject).toEqual([]);
          // resolve();

        // }, 2000);
      });
    });
    // Need to grab the current game that was created from the test before

    await clientTwoTurnCardSent;
  });

  test("two players play a turn AGAIN", async () => {
    const roomNumber: number = 123;
    const player1: string = "anthony";
    const player2: string = "ofir1";

    let undefinedCheck1: boolean = false;
    let undefinedCheck2: boolean = false;

    let p1Hand: CardInterface[] = [];
    let p2Hand: CardInterface[] = [];

    let p1FirstCard: CardInterface = {};
    let p2FirstCard: CardInterface = {};

    let playerTurns: number[] = [];

    //client1.emit("start-game", player1, player2, roomNumber);

    const clientOneActionSent = new Promise<void>((resolve) => {
      client1.emit("start-game", player1, player2, roomNumber);
      
      
      client1.on("start-game-confirmed", 
      (
        deckObject: CardInterface[],
        playerOneHandObject: CardInterface[],
        playerTwoHandObject: CardInterface[],
        playerOneObject: string,
        playerTwoObject: string,
        turnCardObject: CardInterface,
        specialCardObject: CardInterface,
        roundValueObject: number,
        playerTurnObject: number[],
        teamOneScoreObject: number,
        teamTwoScoreObject: number,
        teamOneRoundsObject: number[],
        teamTwoRoundsObject: number[],

      ) => {
            //console.log("in client1");
            console.log(deckObject);
          expect(deckObject).toBeDefined();
          expect(playerOneHandObject).toBeDefined();
          expect(playerTwoHandObject).toBeDefined();
          expect(turnCardObject).toBeDefined();
          expect(specialCardObject).toBeDefined();
          expect(roundValueObject).toBeDefined();
          expect(playerTurnObject).toBeDefined();
          expect(teamOneScoreObject).toBeDefined();
          expect(teamTwoScoreObject).toBeDefined();
          expect(teamOneRoundsObject).toBeDefined();
          expect(teamTwoRoundsObject).toBeDefined();


          p1FirstCard = playerOneHandObject.shift();
          p2FirstCard = playerTwoHandObject.shift();

         // p1FirstCard.turn = player1;
         // p2FirstCard.turn = player2;

          resolve();
        });
      });

      await clientOneActionSent;
    

    const clientTwoActionSent = new Promise<void>((resolve) => {
      client1.emit("turn-play-card", p1FirstCard, [-1, 0], roomNumber);

      client1.on("winner-round", 
        (
          roundWinnerObject: string,
          teamOneRoundsObject: number[],
          teamTwoRoundsObject: number[],
          playerOneObject: string,
          playerTwoObject: string,
          playerTurnsObject: number[],
        ) => {
          console.log("client1 winner round");
          console.log(roundWinnerObject);

          const t1Rounds = teamOneRoundsObject;
          const t2Rounds = teamTwoRoundsObject;

          let counterForOne = 0;
          // checking for two zero's
          
          for(let i = 0; i < t1Rounds.length; i++) {
            if(t1Rounds[i] === 0) {
              counterForOne++;
            }
          }
          
          let counterForTwo = 0;

          for(let i = 0; i < t2Rounds.length; i++) {
            if(t2Rounds[i] === 0) {
              counterForTwo++;
            }
          }
            
          if(counterForOne === 2) {
            resolve();
          } else if(counterForTwo === 2) {
            resolve();
          }
          
          resolve();
      });

      client1.on("turn-completed", 
          (
            playerOneHandObject: CardInterface[],
            playerTwoHandObject: CardInterface[],
            teamOneRoundsObject: number[],
            teamTwoRoundsObject: number[],
            gameBoardObject: CardInterface[],
            playerTurnsObject: number[],
          ) => {

           // console.log("client1 turn completed");
           // console.log('------------------------------');
           // console.log(teamOneRoundsObject);
           // console.log(teamTwoRoundsObject);
           // console.log('------------------------------');
            
           
            resolve();
        });


    });
    // Need to grab the current game that was created from the test before

    await clientTwoActionSent;
    

    const clientTwoTurnCardSent = new Promise<void>((resolve) => {
    

      setTimeout(() => {
        client2.emit("turn-play-card", p2FirstCard, [0, -1], roomNumber);
      }, 2000);

      client2.on("winner-round", 
      (
        roundWinnerObject: string,
        teamOneRoundsObject: number[],
        teamTwoRoundsObject: number[],
        playerOneObject: string,
        playerTwoObject: string,
        playerTurnsObject: number[],
      ) => {
        console.log("client2 winner round");
        console.log(roundWinnerObject);
        console.log(teamOneRoundsObject);
        console.log(teamTwoRoundsObject);

        const t1Rounds = teamOneRoundsObject;
        const t2Rounds = teamTwoRoundsObject;

        let counterForOne = 0;
        // checking for two zero's
        
        for(let i = 0; i < t1Rounds.length; i++) {
          if(t1Rounds[i] === 0) {
            counterForOne++;
          }
        }

        
        let counterForTwo = 0;

        for(let i = 0; i < t2Rounds.length; i++) {
          if(t2Rounds[i] === 0) {
            counterForTwo++;
          }
        }

        if(counterForOne === 2) {
          resolve();
        } else if(counterForTwo === 2) {
          resolve();
        }

        resolve();
    });

        client2.on("turn-completed", 
        (
          playerOneHandObject: CardInterface[],
          playerTwoHandObject: CardInterface[],
          teamOneRoundsObject: number[],
          teamTwoRoundsObject: number[],
          gameBoardObject: CardInterface[],
          playerTurnsObject: number[],
        ) => {

         // console.log("client2 turn completed");
         // console.log('------------------------------');
         // console.log(teamOneRoundsObject);
         // console.log(teamTwoRoundsObject);
         // console.log('------------------------------');
         console.log(gameBoardObject);
        // setTimeout(() => {
          // expect(gameBoardObject).toEqual([]);
          // resolve();

        // }, 2000);
      });
    });
    // Need to grab the current game that was created from the test before

    await clientTwoTurnCardSent;
  });
  
  

  test("testing reset-next-turn with two players", async () => {
    const roomNumber: number = 123;
    const player1: string = "anthony";
    const player2: string = "ofir1";

    let undefinedCheck1: boolean = false;
    let undefinedCheck2: boolean = false;

    let p1Hand: CardInterface[] = [];
    let p2Hand: CardInterface[] = [];

    let p1FirstCard: CardInterface = {};
    let p2FirstCard: CardInterface = {};

    let playerTurns: number[] = [];

    let t1Rounds = [];
    let t2Rounds = [];

    let counterForOne = 0;
    let counterForTwo = 0;
    // reset-next-turn (player/tie, roomNumber)
    // When teamOneRoundsObject or teamTwoRoundsObject has 2 zeros.
    const clientOneActionSent = new Promise<void>((resolve) => {
      // Get current game thats on-going
      client1.emit("start-game", player1, player2, roomNumber);

      //client1.emit("reset-next-turn", player1, player2, roomNumber);
      
      
      client1.on("start-game-confirmed", 
      (
        deckObject: CardInterface[],
        playerOneHandObject: CardInterface[],
        playerTwoHandObject: CardInterface[],
        playerOneObject: string,
        playerTwoObject: string,
        turnCardObject: CardInterface,
        specialCardObject: CardInterface,
        roundValueObject: number,
        playerTurnObject: number[],
        teamOneScoreObject: number,
        teamTwoScoreObject: number,
        teamOneRoundsObject: number[],
        teamTwoRoundsObject: number[],

      ) => {
            //console.log("in client1");
            console.log(deckObject);
          expect(deckObject).toBeDefined();
          expect(playerOneHandObject).toBeDefined();
          expect(playerTwoHandObject).toBeDefined();
          expect(turnCardObject).toBeDefined();
          expect(specialCardObject).toBeDefined();
          expect(roundValueObject).toBeDefined();
          expect(playerTurnObject).toBeDefined();
          expect(teamOneScoreObject).toBeDefined();
          expect(teamTwoScoreObject).toBeDefined();
          expect(teamOneRoundsObject).toBeDefined();
          expect(teamTwoRoundsObject).toBeDefined();


          t1Rounds = teamOneRoundsObject;
          t2Rounds = teamTwoRoundsObject;

          resolve();
        });
      });

      await clientOneActionSent;

      const clientOneWinnerActionSent = new Promise<void>((resolve) => {


        client1.on("reset-completed", 
            (
              playerOneHandObject: CardInterface[],
              playerTwoHandObject: CardInterface[],
              turnCardObject: CardInterface,
              specialCardObject: CardInterface,
              teamOneScoreObject: number,
              teamTwoScoreObject: number,
              playerTurnsObject: number[],
              roundValueObject: number,
              teamOneRoundsObject: number[],
              teamTwoRoundsObject: number[],
            ) => {

              console.log("client1 in reset-completed");

              console.log(teamOneScoreObject);
              console.log(teamTwoScoreObject);
              resolve();
        });

        for(let i = 0; i < t1Rounds.length; i++) {
          if(t1Rounds[i] === 0) {
            counterForOne++;
          }
        }
        
        let counterForTwo = 0;

        for(let i = 0; i < t2Rounds.length; i++) {
          if(t2Rounds[i] === 0) {
            counterForTwo++;
          }
        }
          
        if(counterForOne === 2) {
          client1.emit("reset-next-turn", player1, roomNumber);
          // resolve();
        } else if(counterForTwo === 2) {
          client1.emit("reset-next-turn", player2, roomNumber);
         // resolve();
        }


      });

      await clientOneWinnerActionSent;
  }, 10000);


  
});

