# React.Dev/Learn: Tic-Tac-Toe in Typescript: A Companion Guide

So, you want to learn React. The [React Docs](https://react.dev/learn/) are a great place to start, but it's all, understandably, in regular JavaScript, and you're more a fan of strongly-typed code. This guide will serve as an adaptation (but not a replacement!) for React Doc's Tic-Tac-Toe tutorial. Generally, follow the guide, and at the end of each section, check back here for what to do. Following with how the guide is structured, there's no need to separate out each component into its own file. You can, if you want, but putting it all in `app.tsx`, while not good practice, will be fine for the sake of this guide.

## Getting Typescript set up.
First, head on over to the React Docs, and follow the "Setup for the tutorial" and "Overview" sections.

Back? Great. Now, you can do all of this within the React Docs' code sandbox fork, by importing the right libraries, but I find it's easier to do this within VSCode. Why? Code Sandboxes are great for getting immediate feedback. However, you'll get just as immediate feedback by building and deploying in VSCode, along with some useful linter guidance as you go along. 

First, create a new project:

```bash
npx create-react-app tic-tac-toe --template typescript
```

This line will set up your React application, with a basic Typescript template. If you've already created a React project, and you'd like to make it Typescript instead, run the following:
```bash
npm install --save typescript @types/node @types/react @types/react-dom @types/jest
```
Then you'll need to manually rename any `.js` files into `.tsx` files, and solve any type errors that appear. I recommend starting from scratch, here.

If you're running through the code sandbox, you'll need to do something similar to that second bash command, only through the Code Sandbox's UI.

## Overview

We have a similar set-up as the basic Javascript version, just with quite a few more files. `App.css`, `App.tsx`, `index.tsx`, and our `public` folder are the important pieces of the puzzle.

`App.tsx` will look exactly the same as the original `App.js`. `App.css` will look like `styles.css`, but with a little bit extra. `index.tsx` will have one key difference:

```typescript
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import './index.css';
import App from './App';

const root = createRoot(
  document.getElementById('root') as HTMLElement
);
```

Notice anything different? Exactly, we're declaring the type of our root constant to be an `HTMLElement`. In Typescript, we want things to be as well defined as possible.

Now, follow the React Docs up until you reach **Passing data through Props**. Then come back.

## Passing data through props.

Follow the React Docs until you reach the part where you're asked to make `Square` look like this:
```javascript
function Square({ value }) {
  return <button className="square">1</button>;
}
```
Now, you may notice a squiggly error line over `{ value }`:
```
Binding element 'value' implicitly has an 'any' type.
```

You *could* quickly resolve this by making it read:
```javascript
function Square({ value }: any) {
  return <button className="square">1</button>;
}
```
I have to stress, however, you don't want to resolve the error this way. Instead, you'll want to create a new property interface, defining the variables you want to pass into your Square component.
```typescript
interface SquareProps {
  value: string
}

function Square(props: SquareProps) {
  return <button className="square">1</button>;
}
```
This may look familiar if you've worked with React before - one common way of handling props is to use a nebulous `props` object. In TypeScript, we have to define it with an interface, making it more readable and maintainable. The reasoning why we don't go with the prior example is simple - by setting the type for the entire object parameter, you're making it difficult to add more parameters later. If you need to pass an event handler from the Board to the square, or even another variable, things will get tricky without the interface.

Following the React Docs, next you'll want to have your square show the value. Because `value` is a property of `props`, you'll want to reference it like so:
```ts
function Square(props: SquareProps) {
  return <button className="square">{props.value}</button>;
}
```

Now your board is nice and empty. Follow the React Docs up to the end of the section.

Your updated code should look like this:

```ts
import './App.css';

interface SquareProps {
  value: string
}

function Square(props: SquareProps) {
  return <button className="square">1</button>;
}

export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square value="1" />
        <Square value="2" />
        <Square value="3" />
      </div>
      <div className="board-row">
        <Square value="4" />
        <Square value="5" />
        <Square value="6" />
      </div>
      <div className="board-row">
        <Square value="7" />
        <Square value="8" />
        <Square value="9" />
      </div>
    </>
  );
}
```

## Making an Interactive Component
Follow the React Docs until you're asked to utilize `useState`.

With Typescript, because your values are specified as strings, the following line won't work:
```js
const [value, setValue] = useState(null);
```

To fix this, you'll want to feed useState an empty string, like so:

```ts
import { useState } from 'react';

function Square() {
  const [value, setValue] = useState('');

  function handleClick() {
    //...
```

Now, follow the guide up until **React Developer Tools**.

Your code will look something like this:
```ts
import { useState } from 'react';
import './App.css';

function Square() {
  const [value, setValue] = useState('');
  
  function handleClick() {
    setValue('X');
  }
  return <button className="square"
  onClick={handleClick}>{value}</button>;
}

export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}
```

## Lifting State Up
Keep following the official docs, keeping in mind the above as you enter **Lifting State Up**. When you once again pass `value` to `Square()`, you'll want to reinstate your `SquareProps` interface:
```ts
interface SquareProps {
  value: string | null
}
```
We've declared value to be a string again, but you may notice the comment off to the side - if you want to pass `null` into `useState` instead of an empty string, it needs to be of an acceptable type. In Typescript, the `[TYPE] | [TYPE]` pattern denotes that `value` can be either a `string` or `null`. 

Eventually, you'll need to pass in an `onClick` handler function from `Board`, `onSquareClick`. You guessed it - you'll need to place it into SquareProps. Normally, you don't want to declare the type of something as `any`, otherwise you lose the benefits of using typescript. Sometimes, though, there's an exception. This is one of those times. onSquareClick is a function, so we declare it as `onSquareClick: ()`. It can take in certain parameters that we don't want to build out a whole new property interface for, so we change it up to `onSquareClick: (params: any)`. Finally, we're not intending on fleshing out the function here, so we append it with `=> any`,
```ts
interface SquareProps {
  value: string | null,
  onSquareClick: (params: any) => any
}
```

By the time you've reached **Immutability is Important**, your code will look something like this:

```typescript
import { useState } from 'react';
import './App.css';

interface SquareProps {
  value: string | null,
  onSquareClick: (params: any) => any
}
function Square(props: SquareProps) {
  
  return (
    <button className="square" onClick={props.onSquareClick}>
      {props.value}
    </button >
  );
}

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i: number) {
    const nextSquares = squares.slice();
    nextSquares[i] = "X";
    setSquares(nextSquares);
  }

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}
```

Now keep following along until you reach **Declaring a Winner**.

Your code at this point should look like this:
```typescript
import { useState } from 'react';
import './App.css';

interface SquareProps {
  value: string | null,
  onSquareClick: (params: any) => any
}
function Square(props: SquareProps) {
  
  return (
    <button className="square" onClick={props.onSquareClick}>
      {props.value}
    </button >
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    if (squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}
```

Now, inside **Declaring a Winner**, you may have noticed something about the `calculateWinner` function. It's not quite ready for typescript yet - the code has no idea what type calculateWinner returns, or what type its parameter is. We can infer that squares will be an array of strings, from what we've done previously. We can also assume, since we're returning the value of one specific square, that we're returning a `string`. If we don't find a match, we may end up returning `null` instead. Let's modify this a bit:
```typescript
function calculateWinner(squares: string[]): string | null {
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

  return null;
}
```

As you can see, we've also utilized a different syntax for iterating through each line. Typescript expects of simple for loop, rather than a for-each loop here. Iterating through the way the official guide requests will work, but this will keep your linter happy, and if your linter is happy, you'll be happy. Now, let's continue through the guide.

When you go to implement `status`, you'll want to define its type. We know it's a string, so we'll add that type definition: `let status: string`.

Now that we're in the **Time Travel** section, I want you to go through this area, and make adjustments on your own, using what you've learned. We'll regroup at the end of the tutorial!

...

Alright, that was a lot, wasn't it? Let's go over some of steps you just followed.

### Lifting State Up, Again: Making the Boad Component
We learned ealier that when defining props, passing in a nebulous `props` or `{propA, propB, propC}` doesn't quite fit the bill with Typescript. We have to manually define our props object like so:

```typescript
interface BoardProps {
  xIsNext: boolean,
  squares: string[],
  onPlay: (params: any) => any
}
function Board(props: BoardProps): ReactElement {
  //...
}
```

How did we determine each type?

`xIsNext` follows a standard boolean naming scheme. We also see it checked in an if statement the same way a boolean is checked, so let's call it a boolean - if we're wrong, we can change it later.

We can infer that `squares` is the same type of squares property we've seen throughout the guide, so that one is clearly a string. 

Finally, `onPlay` looks like a function, and we invoke it like one in `handleClick()`.

If you were wondering what else needed changed, you're on the right track. That was all that needed to be changed to bring this guide into Typescript. 

Let's take a look at what this should look like:

```typescript
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
  Note that just as if we were passing a props object, because we're passing
  an interface, references to the variables we're passing through will need
  to be prefixed with the property variable object (i.e. props.blah)
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
    let description: string;
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

function calculateWinner(squares: string[]): string | null {
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

  return null;
}
```