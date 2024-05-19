import { useEffect, useState } from 'react';
import { ServerRoutes } from '../util/server';


export function ChildSymbolDisplay({symbolId, callback}: {symbolId: number, callback?: Function}) {
    const [displayData, setDisplayData] = useState<{symbol_id: number, symbol: string, day_pct_change: number}[]>();

    useEffect(() => {
        setDisplayData(undefined);
        ServerRoutes.getChildIds(symbolId)
            .then((data: any) => {
                if (data.length != 0) {
                    return data.map((entry: any) => entry.symbol_id);
                }
            })
            .then(res => {
                if (!res) { return } // Terminate if no child IDs to search
                ServerRoutes.getLatestPriceChange(res)
                    .then(data => {setDisplayData(data)})
            });   
    }, [symbolId])

    return(
        <div className="my-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 container">
            {displayData && displayData.map(entry => (
                <div 
                    key={entry.symbol_id} 
                    className={`p-4 border border-gray-300 rounded-lg ${entry.day_pct_change > 0 ? "text-green-500" : "text-red-500"} container`}
                    onClick={() => {if (callback) {callback(entry.symbol_id)}}}
                >
                    <h2 className="text-xl font-medium mb-2">{entry.symbol} {entry.day_pct_change > 0 ? '▲' : '▼'}{(entry.day_pct_change * 100).toFixed(2)}%</h2>
                </div>
            ))}
        </div>
    );
}
