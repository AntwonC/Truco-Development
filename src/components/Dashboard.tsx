import { useState } from 'react';
import { useUser } from "@clerk/clerk-react";
import io, { Socket } from "socket.io-client";

const socket : Socket = io("http://localhost:5000");

const Dashboard = () => {
    const { isSignedIn, user } = useUser();

    if(!user) return null;

    console.log(`Username: ${user.username}`);
    console.log(`is ${user.username} signed in? => ${isSignedIn}`);

    
    return (
        <>
            <h1>This is the dashboard page!</h1>
            <p>This is a protected page.</p>
        </>
    )
}

export default Dashboard;