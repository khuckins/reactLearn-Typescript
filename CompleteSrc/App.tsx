import { ReactElement, useState } from 'react';
import './App.css';

/*
  For Typescript, we need to define the types of each parameter going into our
  components. The cleanest way to do this is to set up an interface defining
  them, and to pass a variable typed to the interface for our components.

  Functions that are being passed in can use 'any', but in other cases it's
  strongly recommended NOT to use 'any' (otherwise just use Javascript)
*/
interface SquareProps {
  value: string | null,
  onSquareClick: (params: any) => any
}

/*
  Note that because we're passing an interface, references to the variables
  we're passing through will need to be prefixed with the property variable
  object (i.e. props.blah)
*/

function Square(props: SquareProps): ReactElement {
  return <button
    className="square"
    onClick={props.onSquareClick}
  >{props.value}</button>;
}

interface BoardProps {
  xIsNext: boolean,
  squares: string[],
  onPlay: (params: any) => any
}
function Board(props: BoardProps): ReactElement {
  const winner = calculateWinner(props.squares);

  let status: string;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next Player: ' + (props.xIsNext ? 'X' : 'O');
  }

  const handleClick = (i: number): void => {
    if (props.squares[i] || calculateWinner(props.squares)) {
      return;
    }

    const nextSquares = props.squares.slice();
    if (props.xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O'
    }
    props.onPlay(nextSquares);
  }
  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={props.squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={props.squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={props.squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={props.squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={props.squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={props.squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={props.squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={props.squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={props.squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game(): ReactElement {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares: string[]): void {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove: number): void {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
    // We're using an array index as the key - generally, don't do this.
    <li key={move}>
      <button onClick={() => jumpTo(move)}>{description}</button>
    </li>
    )
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
};



function calculateWinner(squares: string[]): string | undefined {
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

  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
}
