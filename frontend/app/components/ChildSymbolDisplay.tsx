import { useEffect, useState } from 'react';
import { ServerRoutes } from '../util/server';


export function ChildSymbolDisplay({symbolId}: {symbolId: number}) {
    const [displayData, setDisplayData] = useState<{[key: string]: number}>();

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
                    .then((data: {[key: string]: {[key: number]: number}}) => {
                        let tempData: {[key: string]: any} = {};
                        Object.entries(data).map(([key, value]) => {
                            tempData[key] = (value[1] - value[2]) / value[2];
                        })
                        setDisplayData(tempData);
                    })
            });   
    }, [symbolId])

    return(
        <div className="my-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 container">
            {displayData && Object.entries(displayData).map(([key, value]) => (
                <div key={key} className={`p-4 border border-gray-300 rounded-lg ${value > 0 ? "text-green-500" : "text-red-500"} container`}>
                    <h2 className="text-xl font-medium mb-2">{key} {value > 0 ? '▲' : '▼'}{(value * 100).toFixed(2)}%</h2>
                </div>
            ))}
            
        </div>
    );
}
