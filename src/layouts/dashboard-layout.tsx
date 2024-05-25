import * as React from 'react'
import { useAuth, useUser } from "@clerk/clerk-react"
import { Outlet, useNavigate } from "react-router-dom"

export default function DashboardLayout() {
    const { userId, isLoaded } = useAuth();
    

    const navigate = useNavigate();

   // if(!user) return null;

    console.log('test', userId)
   // console.log(`Username: ${user.username}`);
   // console.log(`is ${user.username} signed in? => ${isSignedIn}`);


    React.useEffect(() => {
        if (isLoaded && !userId) {
            navigate("/sign-in");
        }
      //  } else if(!user) {
      //      navigate("/sign-in");
     //   }
    }, [isLoaded])

    if (!isLoaded) return "Loading..."

    return (
        <Outlet />
    )
}