import { Button, Container, createTheme, ThemeProvider } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Socket } from "socket.io-client";

import '../styles/GameRoom.css';

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


    const leaveRoomClicked = () => {
        //setJoin(false);
        socket.emit("leave-room", roomNumber, user);
        navigate('/dashboard');
       
       // socket.emit("get-slot-of-leaving-user", user, roomNumber);
    
        //dePopulateRoom();
      };
      // Use the score-board-text to push the game table down?
    //  <div className="score-board-text">Score Board Goes Here</div>
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
                </div>
           

                <Container>
                    <Button onClick={leaveRoomClicked}>Leave</Button>
                </Container>
            </ThemeProvider>
        </>
    )
};

export default GameRoom;