import { ChangeEvent, ChangeEventHandler, useState } from 'react';
import { useUser } from "@clerk/clerk-react";
import io, { Socket } from "socket.io-client";

import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { createTheme, makeStyles } from '@mui/material/styles';
import { ThemeProvider } from '@emotion/react';
//import { HandleChangeInterface } from '../interfaces/HandleChangeInterface';



const socket : Socket = io("http://localhost:5000");

const theme = createTheme({
    components: {
        MuiContainer: {
            styleOverrides: {
                root: {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    
                }
            }
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    width: '25%',
                    
                    backgroundColor: 'white',
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    
                    
                    backgroundColor: 'blue',
                    color: 'white',
                    fontWeight: '600',
                    textTransform: 'none',
                }
            }
        }
    }
});

const Dashboard = () => {
    
    const { isSignedIn, user } = useUser();
    
    const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
    const [roomNumber, setRoomNumber] = useState<Number>(-1);

    if(!user) return null;

    console.log(`Username: ${user.username}`);
    console.log(`is ${user.username} signed in? => ${isSignedIn}`);

    const handleChange = (event : ChangeEvent<HTMLInputElement>) : void => {
        console.log("Change type");
      //  console.log(typeof evt);
        
        setRoomNumber(Number(event.target.value));

        //console.log(roomNumber);
        
    }
    
    return (
        
            <div className="dashboard-container">
                <h2>{isConnected ? <p>Connected</p> : <p>Not Connected</p>}</h2>
                <h3>Hello, {user.username}</h3>
                <ThemeProvider theme={theme}>
                <Container>
                    <TextField
                        id="standard-number"
                        
                        type="number"
                        placeholder="####"
                        onChange={handleChange}
                        
                        variant="standard"
                        
                    />
                    <Button>Join</Button>
                </Container>
                </ThemeProvider>

            </div>
        
    )
}

export default Dashboard;