import { useState, useEffect } from "react";
import CardInterface from "../interfaces/CardInterface";
import Button from "@mui/material/Button";

interface Props {
  show: boolean;
  rNumber: number;
  acceptClicked: (player: string, number: number) => void;
  declineClicked: (player: string, number: number) => void;
  player: string;
}

const TrucoContainer = ({
  show,
  rNumber,
  acceptClicked,
  declineClicked,
  player,
}: Props) => {
  if (!show) return null;

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
};

export default TrucoContainer;
