import React from 'react';
import logo from './logo.svg';
import { useState } from 'react';
import './App.css';


type players = "X" | "O";

// interface mech {
//   users: {
//     user_one: {
//       name: string,
//       victorys: number
//     },
//     user_two: {
//       name: string,
//       victorys: number
//     },
//     winners_history: Array<{
//       name: string,
//       played_as: players
//     }>
//   },
// }

// GLOBAL MECH DATA
const mech : any = {
  users:{
    user_one: {
      name: "",
      victorys: 0,
    },
    user_two: {
      name: "",
      victorys: 0,
    },
    winners_history: [
      // {
      //   name: "Alex",
      //   played_as: "X",
      // }
    ], // users name
  }, // # users
}









function App() {
  
  // define game steps
  const [game_step, setGameStep] = useState<"in_user_define" | "in_game">("in_user_define") // "in_user_define, in_game, in_archive"

  // const [xIsNext, setXIsNext] = useState<boolean>(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];


  // ==============
  // MANAGE MECH DATA / functions interact with mech object
  // ==============
  function setUsersNames(userOne:string, userTwo:string){
    mech.users.user_one.name = userOne
    mech.users.user_two.name = userTwo
  }
  function addUserVictory(user_prop: string, nVictory: number){
    if(mech.users[user_prop]){
      mech.users[user_prop].victorys = mech.users[user_prop].victorys + nVictory
    }
  }
  interface addWinnerToHistory {
    name: string,
    played_as: "X" | "O",
  }
  function addWinnerToHistory(user_data: addWinnerToHistory){
    mech.users.winners_history.push(user_data)
  }


  // ==============
  // COMPONENTS
  // ==============

  // define users / select a name for each user
  function DefineUsers(){
    

    // users variables
    const [userOne, setUserOne] = useState("")
    const [userTwo, setUserTwo] = useState("")

    // dom component
    return (
      <div className='con_defineUser'>
        <div className='box_defineUser baseBox'>

          <h2 className='label_one' >Inserire i nomi dei giocatori</h2>

          <div className="box_card">
            {/* user one */}
            <div className="user_card player_one">
              <div className="userIcon">
                <span>X</span>
              </div>
              <input className="baseInput" type="text" onChange={(e) => {setUserOne(e.target.value)}} placeholder='Nome giocatore uno' />
            </div>

            {/* user two */}
            <div className="user_card player_two">
              <div className="userIcon">
                <span>O</span>
              </div>
              <input className="baseInput" type="text" onChange={(e) => {setUserTwo(e.target.value)}} placeholder='Nome giocatore due' />
            </div>
          </div>

          {/* save users */}
          <button 
            className={`actBtn ${ !(userOne.length > 0 && userTwo.length > 0) && "deactivate"}`} 
            onClick={
              ()=>{
                setUsersNames(userOne, userTwo); 
                setGameStep("in_game"); 
                resetMech()
              }} >
              PLAY
          </button>

        </div>
      </div> 
    )
  } // # defineUsers

  // define mech winner archive
  function WinnersHistory(){
    return (
      <div className='con_users_archive'>
        <div className='box_users_archive'>
          {/* winners player archive */}
          <table>
            <thead>
              <tr>
                <th>Giocatore</th>
                <th>Nome Giocatore</th>
              </tr>
            </thead>
            <tbody>
              {/* archive list */}
              {
                mech.users.winners_history.map((row : any, i : number) => {
                  return (
                    <tr key={i} >
                      <td>{row.played_as}</td>
                      <td>{row.name}</td>
                    </tr>
                  )
                })
              }
              </tbody>
          </table>
        </div> 
      </div> 
    )
  }


  // define interfaces
  interface Square {
    value: null | players;
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
      const winner : string = calculateWinner(squares)
      // square already defined or game finished 
      if(squares[i] || winner){
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
    const winner : players = calculateWinner(squares)
    let status
    if(winner){ // END GAME, there is a winner

      let user_prop = winner == "X" ? "user_one" : "user_two" // define current user attribute
      let winnerName = mech.users[user_prop].name // get user name
      status = `Vincitore!!! ${winner} --- ${winnerName}` // winner message

      // update winners history
      addWinnerToHistory({
        name: winnerName,
        played_as: winner 
      })

      // register the  victory in the current user data
      addUserVictory(user_prop, 1)

    } else { // show next player
      status = "È il turno di: " + (xIsNext ? `X -- ${mech.users.user_one.name }`: `O -- ${mech.users.user_two.name}`)
    }

    return (
      <>
        <span className="label_one">{status}</span>

        <div className="box_core_game">

            <Square value={squares[0]} onSquareClick={()=>{handleClick(0)}} />
            <Square value={squares[1]} onSquareClick={()=>{handleClick(1)}} />
            <Square value={squares[2]} onSquareClick={()=>{handleClick(2)}} />

            <Square value={squares[3]} onSquareClick={()=>{handleClick(3)}} />
            <Square value={squares[4]} onSquareClick={()=>{handleClick(4)}} />
            <Square value={squares[5]} onSquareClick={()=>{handleClick(5)}} />

            <Square value={squares[6]} onSquareClick={()=>{handleClick(6)}} />
            <Square value={squares[7]} onSquareClick={()=>{handleClick(7)}} />
            <Square value={squares[8]} onSquareClick={()=>{handleClick(8)}} />
  
        </div>

      </>
    )
  } // # Board()


  //  RETURN THE WINNER PLAYER 
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

  function resetMech(){
    setHistory([Array(9).fill(null)])
    jumpTo(0)
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

        {/* define user / players */}
        {
          game_step == "in_user_define" && 
          <div className="boxSection ">
            <div className="baseWidth">
              <DefineUsers />
            </div>
          </div>
        }

        {/* mech */}
        {
          game_step == "in_game" &&    
          <div className="boxSection">
            <div className="baseWidth">
              <div className='con_mech'>
                <div className='box_mech baseBox'>
                  {/* game board */}
                  <div className="box_board">
                    <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
                  </div>
                  {/* mech history */}
                  {/* <div className="box_history">
                    <ol>{moves}</ol>
                  </div> */}
                </div> {/* # box_mech */}

                {/* actions */}
                <div className="box_actions">
                  <button className="actBtn slim" onClick={()=>{resetMech()}} >RESET MECH</button>
                  <button className="actBtn slim" onClick={()=>{setGameStep("in_user_define") }}>CAMBIA GIOCATORI</button>
                  <a href="#archive">
                    <button className="actBtn slim">CLASSIFICA</button>
                  </a>
                </div>
              </div> {/* # con_mech */} 
            </div>
          </div>
        }


        {/* mech winners history */}
        {
          game_step == "in_game" &&  
          <div className="boxSection" id="archive">
            <div className="baseWidth">
              <div className="archive baseBox">
                <span className="label_one">Tabella Vincitori</span>
                <WinnersHistory />
                
                
                {/* {
                  mech.users.winners_history.length == 0 && 
                  <span className="label_two">Nessuna vittoria registrata</span>
                } */}

              </div>
            </div>
          </div>
        }


      </div> 
    </div> 
  );

}

export default App;
