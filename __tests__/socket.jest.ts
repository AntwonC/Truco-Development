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
      
  test("start a game with two players", (done) => {
    //  socket.on("start-game", (playerOne : string, playerTwo : string, roomNumber : number)
    // socket.emit("start-game", tempVar, user, roomNumber);
    const roomNumber: number = 123;
    const player1: string = "anthony";
    const player2: string = "ofir1";

    let undefinedCheck1: boolean = false;
    let undefinedCheck2: boolean = false;
    // Client1 initials a start-game, doesn't matter which client does it
    client1.emit("start-game", player1, player2, roomNumber);

    //setTimeout(() => {

     // client2.emit("start-game", player1, player2, roomNumber);
    //}, 1000);
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
        done();
    });

    /*client2.on("start-game-confirmed", 
        (
          deckObject: CardInterface[],
          playerOneHandObject: CardInterface[],
          playerTwoHandObject: CardInterface[],
          playerOneObject: string,
          playerTwoObject: string,
          turnCardObject: CardInterface,
          specialCardObject: CardInterface,
          roundValueObject: number,
          teamOneScoreObject: number,
          teamTwoScoreObject: number,
          teamOneRoundsObject: number[],
          teamTwoRoundsObject: number[],

        ) => {
          console.log("in client2");
          
        console.log(deckObject);
        expect(deckObject).toBeDefined();
        expect(playerOneHandObject).toBeDefined();
        expect(playerTwoHandObject).toBeDefined();
        expect(turnCardObject).toBeDefined();
        expect(specialCardObject).toBeDefined();
        expect(roundValueObject).toBeDefined();
        expect(teamOneScoreObject).toBeDefined();
        expect(teamTwoScoreObject).toBeDefined();
        expect(teamOneRoundsObject).toBeDefined();
        expect(teamTwoRoundsObject).toBeDefined();

        done();
    }); */
    
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
  test("two players play a turn", (done) => {
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

    client1.emit("start-game", player1, player2, roomNumber);

    // Need to grab the current game that was created from the test before
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
      playerTurnsObject: number[],
      teamOneScoreObject: number,
      teamTwoScoreObject: number,
      teamOneRoundsObject: number[],
      teamTwoRoundsObject: number[],

    ) => {
      console.log("in client1");
      //console.log(deckObject);

      
      // console.log(playerOneHandObject);
      // console.log(playerTwoHandObject);
      expect(deckObject).toBeDefined();
      expect(playerOneHandObject).toBeDefined();
      expect(playerTwoHandObject).toBeDefined();
      expect(turnCardObject).toBeDefined();
      expect(specialCardObject).toBeDefined();
      expect(playerTurnsObject).toBeDefined();
      expect(roundValueObject).toBeDefined();
      expect(teamOneScoreObject).toBeDefined();
      expect(teamTwoScoreObject).toBeDefined();
      expect(teamOneRoundsObject).toBeDefined();
      expect(teamTwoRoundsObject).toBeDefined();

      p1Hand = playerOneHandObject;
      p2Hand = playerTwoHandObject;

      p1FirstCard = playerOneHandObject[0];
      p2FirstCard = playerTwoHandObject[0];

      playerTurns = playerTurnsObject;
      //  done();

    console.log(p1FirstCard);
    console.log(p2FirstCard);
    
  });

  //"turn-play-card", (card : CardInterface, playerTurn : number[], roomNumber : number
    client1.emit("turn-play-card", p1FirstCard, playerTurns, roomNumber);

    //
    done();

  });

  
});

 /* test("two players joining a room to start a game", (done) => {
    let counterCalled = 0;

    serverSocket.on("join-room", (roomNumber : number, user : string, callback) => {
      
      counterCalled++;
      const roomNumberString : string = roomNumber.toString();

      const userExistsOnTable = object.findUserOnTable(user, roomNumber);
      
      if(userExistsOnTable === false) {
          object.addUserOnTable(user, roomNumber);
      }
      //const usersOnTable = object.getUsersOnTable();

      
      serverSocket.join(roomNumberString); // socket joining room

      const usersInRoom = io.sockets.adapter.rooms.get(roomNumberString);
      let numberOfUsersInRoom = usersInRoom ? usersInRoom.size : 0;
      console.log(usersInRoom);
      expect(object).toBeInstanceOf(userStorageObject);
     // console.log(counterCalled);

     if(callback) {
      callback();
     }
      if(counterCalled === 2) {
        console.log(`numberOfUsersInRoom: ${numberOfUsersInRoom}`);
        expect(numberOfUsersInRoom).toBe(2);
        done();
      }
     // done();
     // console.log(io.sockets.adapter.rooms.get(roomNumberString));
     // console.log('-----------------------------------');
      serverSocket.emit("room-success");
      //socket.emit("room-success");
      //io.to(roomNumberString).emit("room-success", user, roomNumber, numberOfUsersInRoom, usersOnTable); 
    //  socket.emit("room-success", user, roomNumber, usersInRoom, usersOnTable); 
  });
    serverSocket.on("join-room", (roomNumber, player1) => {
      done();
    }); 

    clientSocket.on("room-success", () => {
      console.log("client got room-success");
      
    });

    const roomNumber: number = 123;
    const player1: string = "anthony";
    const player2: string = "ofir1";

    clientSocket.emit("join-room", roomNumber, player1);

    setTimeout(() => {
      clientSocket.emit("join-room", roomNumber, player2);
      //done();
    }, 1000);
  }); */
//});