'use client'

import { RatioTable, PriceChart, DrillDownDisplay } from './components';
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
            <div className="bg-blue-500 py-4 px-8 text-white flex items-center justify-between">
                <h1 className="text-2xl font-bold">Cool Banner</h1>
                <input
                    type="text"
                    id="searchInputField"
                    value={input}
                    onChange={updateInput}
                    onKeyDown={submitInputHandler}
                    placeholder="Search..."
                    className="px-4 py-2 rounded-md text-black"
                />
            </div>
            <div className="flex flex-col items-center h-screen">
                <PriceChart symbolId={focusSymbolId} />
                <RatioTable symbolId={focusSymbolId} />
                <DrillDownDisplay symbolId={focusSymbolId} />
            </div>
        </div>
    );
}
