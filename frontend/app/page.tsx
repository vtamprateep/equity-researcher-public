'use client'

import { SymbolProfile, PriceChart } from './components';
import { useEffect, useState } from 'react';
import config from "../next.config.mjs";


export default function Home() {

  const [input, setInput] = useState<string>('');
  const [focusSymbolId, setFocusSymbolId] = useState<number>();

  const updateInput = (e: any) => {
    setInput(e.target.value);
  }

  const submitInputHandler = (e: any) => {
    if (e.key == "Enter" && input != undefined) {
      fetch(`http://${config?.env?.SERVER_HOST}:${config?.env?.SERVER_PORT}/get_symbolid/${input.toUpperCase()}`)
      .then(res => res.json())
      .then((res_data: any) => {
        if (res_data.rows.length != 0) {
          setFocusSymbolId(res_data.rows[0].id);
        }
      })
    }
  }

  useEffect(() => {}, [focusSymbolId]); // Set useEffect to refresh based on value change

  return (
    <div>
      <input type="text" id="searchInputField" value={input} onChange={updateInput} onKeyDown={submitInputHandler} />
      <PriceChart symbolId={focusSymbolId}/>
    </div>);
}
