'use client'

import { RatioTable, PriceChart, DrillDownDisplay, SummaryHighlights } from './components';
import { useState } from 'react';
import { ServerRoutes } from './util/server';


export default function Home() {

    const [input, setInput] = useState<string>('');
    const [focusSymbolId, setFocusSymbolId] = useState<number>();

    const updateInput = (e: any) => {
        setInput(e.target.value);
    }

    const submitInputHandler = () => {
        if (input != undefined && input.trim() !== "") {
            ServerRoutes.getSymbolId(input.toUpperCase())
                .then(data => data.rows.length ? setFocusSymbolId(data.rows[0].id) : undefined)
                .catch(error => { console.log(error) });
        }
    }

    return (
        <div>
            <div className="bg-slate-700 py-4 px-8 text-white flex items-center justify-between">
                <h1 className="text-2xl font-bold">Equity Researcher</h1>
                <div>
                    <input
                        type="text"
                        id="searchInputField"
                        value={input}
                        onChange={updateInput}
                        onKeyDown={(e) => {if (e.key === "Enter") { submitInputHandler() }}}
                        placeholder="Enter ticker symbol here..."
                        className="px-4 py-2 rounded-md text-black"
                    />
                    <button 
                        className="mx-4 rounded-md bg-zinc-600 px-4 py-2 border-black border"
                        onClick={submitInputHandler}>
                        Search
                    </button>
                </div>
            </div>
            {focusSymbolId &&
                <div className="flex flex-col items-center h-screen mx-8 my-8">
                    <PriceChart symbolId={focusSymbolId} />
                    <SummaryHighlights symbolId={focusSymbolId} />
                    <RatioTable symbolId={focusSymbolId} />
                    <DrillDownDisplay symbolId={focusSymbolId} />
                </div>
            }
            
        </div>
    );
}
