import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";
import AppBar from "@mui/material/AppBar";
import { createTheme, Typography } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import "../styles/RootLayout.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const theme = createTheme({
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          display: "flex",
          flexDirection: "row",
          backgroundColor: "#2480A6",
        },
      },
    },
  },
});

export default function RootLayout() {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      publishableKey={PUBLISHABLE_KEY}
    >
      <header className="header">
        <div>
          <ThemeProvider theme={theme}>
            <AppBar>
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1 }}
                color="black"
              >
                Truco Online
              </Typography>
              <SignedIn>
                <UserButton afterSignOutUrl="/sign-in" />
              </SignedIn>
              <SignedOut>
                <Link to="/sign-in">Sign In</Link>
              </SignedOut>
            </AppBar>
          </ThemeProvider>
        </div>
      </header>

      <Outlet />
    </ClerkProvider>
  );
}
