'use client'

import { useState } from 'react';
import { ServerRoutes } from './util/server';

import { SymbolPriceChart } from "./components/SymbolPriceChart";
import { ChildSymbolDisplay } from "./components/ChildSymbolDisplay";
import { SymbolHighlights } from "./components/SymbolHighlights";
import { PERatioTable } from './components/PERatioTable';


export default function Home() {

    const [input, setInput] = useState<string>('');
    const [focusSymbol, setFocusSymbol] = useState<{id: number, symbol: string, type: string}>();

    const updateInput = (e: any) => {
        setInput(e.target.value);
    }

    const updateFocusSymbol = (symbolName: string): void => {
        ServerRoutes.getSymbolId(symbolName)
            .then(data => {
                data.length ? setFocusSymbol(data[0]) : undefined;
            })
            .catch(error => { console.log(error) });
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
                        onKeyDown={(e) => {if (e.key === "Enter" && input && input.trim()) { updateFocusSymbol(input.toUpperCase()) }}}
                        placeholder="Try searching 'SPY' to start..."
                        className="px-4 py-2 rounded-md text-black"
                    />
                    <button 
                        className="mx-4 rounded-md bg-zinc-600 px-4 py-2 border-black border"
                        onClick={() => {{if (input && input.trim()) { updateFocusSymbol(input.toUpperCase()) }}}}>
                        Search
                    </button>
                </div>
            </div>
            {focusSymbol &&
                <div className="flex flex-col items-center h-screen mx-8 my-8">
                    <SymbolPriceChart symbolId={focusSymbol.id} />
                    <SymbolHighlights symbolId={focusSymbol.id} />
                    <PERatioTable symbolId={focusSymbol.id} />
                    <ChildSymbolDisplay symbolId={focusSymbol.id} type={focusSymbol.type} callback={updateFocusSymbol} />
                </div>
            }
            
        </div>
    );
}
