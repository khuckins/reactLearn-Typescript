# React.Dev/Learn: Tic-Tac-Toe in Typescript

So, you want to learn React. The [React Docs](https://react.dev/learn/) are a great place to start, but it's all, understandably, in regular JavaScript, and you're more a fan of strongly-typed code. This guide will serve as an adaptation (but not a replacement!) for React Doc's Tic-Tac-Toe tutorial. Generally, follow the guide, and at the end of each section, check back here for what to do.

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

Notice anything different? Exactly, we're declaring the type of our root contant to be an `HTMLElement`. 

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

You can quickly resolve this by making it read:
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
The reasoning for this is simple - by setting the type for the entire object parameter, you're making it difficult to add more parameters later. If you need to pass an event handler from the Board to the square, or even another variable, things will get tricky without the interface.

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

You'll wnat to feed useState an empty string, like so:

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

Now keep following along until