import React from 'react';
import logo from './logo.svg';
import { useState } from 'react';
import './App.css';

// define interfaces
interface Square {
  value: null | "X" | "O";
  onSquareClick: any
}

function Square({value, onSquareClick}: Square){
  // const [value, setValue] = useState< null | "X" | "O" >(null)

  return (
    <button 
      className="square" 
      onClick={onSquareClick}  
    >
      {value}
    </button>
  )

} // # Square()



function calculateWinner(squares: any) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
} // # 


// Board
interface Board {
  xIsNext: Boolean,
  squares: any,
  onPlay: any,
}
function Board({xIsNext, squares, onPlay} : Board){


  // // Board structure
  // const [xIsNext, setXIsNext] = useState(true)
  // const [squares, setSquares] = useState(Array(9).fill(null))


  function handleClick(i: number){

    // square already defined or game finished 
    if(squares[i] || calculateWinner(squares)){
      return;
    }

    const nextSquares = squares.slice()
    // manage turn
    if(xIsNext){
      nextSquares[i] = "X"
    } else if(!xIsNext) {
      nextSquares[i] = "O"
    }
    onPlay(nextSquares)
  } // # handleClick()


  // game status information
  const winner : string = calculateWinner(squares)
  let status
  if(winner){
    status = "Winner: " + winner
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O")
  }

  return (
    <>

      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[1]} onSquareClick={()=>{handleClick(1)}} />
        <Square value={squares[2]} onSquareClick={()=>{handleClick(2)}} />
        <Square value={squares[3]} onSquareClick={()=>{handleClick(3)}} />
      </div>
      <div className="board-row">
        <Square value={squares[4]} onSquareClick={()=>{handleClick(4)}} />
        <Square value={squares[5]} onSquareClick={()=>{handleClick(5)}} />
        <Square value={squares[6]} onSquareClick={()=>{handleClick(6)}} />
      </div>
      <div className="board-row">
        <Square value={squares[7]} onSquareClick={()=>{handleClick(7)}} />
        <Square value={squares[8]} onSquareClick={()=>{handleClick(8)}} />
        <Square value={squares[9]} onSquareClick={()=>{handleClick(9)}} />
      </div>
    </>
  )
} // # Board()





function App() {

  // const [xIsNext, setXIsNext] = useState<boolean>(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares : any){
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    // setXIsNext(!xIsNext)
  }

  function jumpTo(nextMove : any){
    setCurrentMove(nextMove);
    // setXIsNext(nextMove % 2 === 0);
  }
  

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move} >
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className='con_page'>
      <div className='box_page'>
        {/* game board */}
        <div className="box_board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </div>
        {/* game history */}
        <div className="box_history">
          <ol>{moves}</ol>
        </div>
      </div> 
    </div> 
  );

}

export default App;
