import Button from '@mui/material/Button';
import { useState } from 'react';

interface Props {
  show: boolean;
  rNumber: number;
  acceptClicked: (player: string, number: number) => void;
  declineClicked: (player: string, number: number) => void;
  player: string;
}

const LastHandContainer = ({ show, rNumber, acceptClicked, declineClicked, player }: Props) => {
   console.log("Inside LastHandContainer");
   console.log(show);
    if(!show) return null;
    return (
        <div className="option-container">
        <Button
          type="button"
          variant="contained"
          onClick={() => {
            acceptClicked(player, rNumber);
          }}
        >
          Success
        </Button>
        
        <Button
          type="button"
          variant="contained"
          onClick={() => {
             declineClicked(player, rNumber);
          }}
        >
          Danger
        </Button>
      </div>
    );
}

export default LastHandContainer;