import { useState, useEffect, ChangeEvent, MouseEventHandler } from 'react';
import '../styles/Card.css';

interface Props {
    suit: string,
    rank: string,
    onClick?: MouseEventHandler<HTMLDivElement>
    click: boolean,
    //showHandFunction : (hand : CardInterface[]) => ReactElement
}

const Card = ({ suit, rank, onClick, click} : Props) => {

    const [counter, setCounter] = useState(0);

    const [backgroundOn, setBackgroundOn] = useState(false);

    const convertRankToInt = (rank : string) : number => {
        switch(rank) {
            case "2":
                return parseInt("2");
                
            case "3":
                return parseInt("3");
                
            case "4":
                return parseInt("4");
                
            case "5":
                return parseInt("5");
                
            case "6":
                return parseInt("6");
                
            case "7":
                return parseInt("7");
                    
            case "8":
                return parseInt("8");

            case "9":
                return parseInt("9");

            case "10": 
                return parseInt("10");
            default: 
                return -1;

        }
    }

    const checkSuit = (suit : string) => {
        switch(suit) {
            case "C": 
                return "&clubs";

            case "H":
                return "&hearts";
            
            case "D":
                return "&diams";

            case "S":
                return "&spades";
        }
    }

    const incrementCount = () => {
        setCounter(prevValue => prevValue + 1);
    }



    const createPips = () => {
        const arr = [];

        let counter = 1;
        let letter = "A";

        const numberRank : number = convertRankToInt(rank);
        const suitSymbol = checkSuit(suit);

        if(rank === "A") {
            arr.push((<div key={counter} className="pip"></div>));
          //  incrementCount();
        } else if(rank === "J") {
            arr.push((<div key={counter} className="pip"></div>)); 
           // incrementCount();
        } else if(rank === "Q") {
            arr.push((<div key={counter} className="pip"></div>));   
           // incrementCount();
        } else if(rank === "K") {
            arr.push((<div key={counter} className="pip"></div>));
           // incrementCount();
        } else {
            for(let i = 0; i < numberRank; i++) {
                arr.push((<div key={counter} className="pip"></div>));
                counter++;
            }
           // incrementCount();
        }


       /* let result = arr.map((item) => {
            <div key={item} className="pip"></div>
        }) */

        return arr;


    }

    const cardClicked = () => {
        setBackgroundOn(!backgroundOn);
     /*   if(selected === false) {
            selectChange(true);
        } else {
            selectChange(false);
        } */
      //  console.log(selected);
    }

    const changeSelect = () => {

    }
  //  console.log(suit);
   // console.log(rank);

   

    return (
        <>
        { click ?

       ( <div className="card" data-suit={suit} data-value={rank} onClick={onClick}>

            {createPips()}
            
            
            <div className="corner-number top">{rank}</div>
            <div className="corner-number bottom">{rank}</div>
            

        </div>) 
        
        :
        
        (<div className="bg-card"></div>)
        }
        </>
       
    )
}

export default Card;