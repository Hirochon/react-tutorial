import React, {useState} from 'react';
import './App.css';

type squareType = null | string;

interface SquareProps {
  onClick: () => void,
  value: squareType
}

const Square = (props: SquareProps) => {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  )
}

interface BoardProps {
  squares: squareType[],
  onClick: (i: number) => void
}

const Board = (props: BoardProps) => {
  const renderSquare = (i: number) => {
    return (
      <Square 
        value={props.squares[i]}
        onClick={() => props.onClick(i)}   // onClickでvalueで表示を変える。
      />
    );
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
}

const App = () => {
  const [history, setHistory] = useState<Array<{
    squares: Array<string | null>
  }>>([{
    squares: Array(9).fill(null)
  }])
  const [stepNumber, setstepNumber] = useState(0);
  const [xIsNext, setIsNext] = useState(true);

  const handleClick = (i: number) => {
    const handlehistory = history.slice(0, stepNumber + 1);
    const current = handlehistory[handlehistory.length - 1];
    const squares = current.squares.slice();
    
    if (calculateWinner(squares) || squares[i]){
      return;
    }

    squares[i] = xIsNext ? 'X': 'O';
    setHistory(handlehistory.concat([{
      squares: squares
    }]));
    setstepNumber(handlehistory.length);
    setIsNext(!xIsNext);
  }

  const jumpTo = (step: number) => {
    setstepNumber(step);
    setIsNext((step & 2) === 0);
  };

  const current = history[stepNumber];
  const winner = calculateWinner(current.squares);

  const moves = history.map((step, move) => {
    const desc: string = move ?
      'Go to move #' + move :
      'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>
          {desc}
        </button>
      </li>
    )
  })

  let status: string;
  if (winner){
    status = 'Winner' + winner;
  } else {
    status = 'Next Player' + (xIsNext ? 'X': 'O');
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board 
          squares={current.squares}
          onClick={(i) => handleClick(i)}
        />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

const calculateWinner = (squares: squareType[]) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default App;
