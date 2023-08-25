import { useState } from 'react'



const TURNS = {
  X: '❌',
  O: '⚪'
}

const WINNERS_COMBOS = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
]
  



const Square = ({children,isSelected,updateBoard,index}) => {
  
  const className =`square ${isSelected ? 'is-selected' : ''}`
  const handleClick = () => {
    updateBoard(index)
    
  }
  return (
    <div onClick={handleClick} className={className}>
      {children}
    </div>
  )
}

function App() {

  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board')
    return boardFromStorage ? JSON.parse(boardFromStorage) : Array(9).fill(null)
  })
  const [turn, setTurn] = useState(TURNS.X);
  // null es que no hay ganador, false empate
  const [winner, setWinner] = useState(null)

  

  const checkWinner = (boardCheck) => {

    for (const combo of WINNERS_COMBOS) {
      const [a,b,c] = combo
      if (
        boardCheck[a] &&
        boardCheck[a] === boardCheck[b] &&
        boardCheck[a] === boardCheck[c]
      ) {
        return boardCheck[a]
      }
      
    }
      return null
  }

  const checkEndGame = (newBoard) => {
    return newBoard.every((square)=> square !== null)
  }

  const updateBoard = (index) => {
    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);
    
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    setTurn(newTurn);

    window.localStorage.setItem('board', JSON.stringify(newBoard))
    window.localStorage.setItem('turn',newTurn)

    const newWinner = checkWinner(newBoard);
    if(newWinner !== null){
      setWinner(newWinner)
    }else if(checkEndGame(newBoard)){
      setWinner(false)   //empate
    }
  }

  const onResetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)
    window.localStorage.removeItem('board')
    window.localStorage.removeItem('turn')
  };

  return (
    <>
      <main className="board">
        <h1 className="">Ta Te Ti</h1>
        <button className="button-reset" onClick={onResetGame}>Comenzar de nuevo!</button>
        <section className="game">
          {
            board.map((square,index) =>{
              return (
                <Square 
                key={index}
                index={index}
                updateBoard={updateBoard}
                >
                  {square}
                </Square>
              )
            })
          }
        </section>
        <section className="turn">
          <Square isSelected = {turn === TURNS.X}>
            {TURNS.X}
          </Square>
          <Square isSelected = {turn === TURNS.O}>
            {TURNS.O}
          </Square>
        </section>
        <section className="">
            {
              winner !== null && (
                <section>
                  <h2 className="">Gano el {winner}</h2>
                </section>
              )
            }
        </section>
      </main>     
    </>
  )
}

export default App
