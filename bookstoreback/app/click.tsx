'use client'
import { useState } from 'react'
function MyClickButton(props:any) {

  function click() {
    props.setCount(props.count+1);
  }
  return (
    <button onClick={click}>Click me</button>
  )
}

export default function Click() {
  const [count, setCount] = useState(0);

  return (
    <div>
      {count}
      <MyClickButton count={count} setCount={setCount} />
    </div>
  )
}