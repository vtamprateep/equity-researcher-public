import { useEffect, useState } from 'react';
import { ServerRoutes } from './util/server';


export function RatioTable({symbolId}: {symbolId: number}) {
    const [ratioData, setRatioData] = useState<any>({});

    useEffect(() => {
        setRatioData({});
        ServerRoutes.getTTMDilutedEPS(symbolId)
            .then(epsArr => {
                if (epsArr.length === 4) {
                    // Calculate TTM EPS & set state
                    let totalEps = 0
                    epsArr.forEach((element: any) => { totalEps += parseFloat(element.value) });

                    setRatioData({
                        symbolId: symbolId,
                        quarter_end: epsArr.map((row: any) => row.quarter_ending_on.slice(0,10)),
                        quarter_diluted_eps: epsArr.map((row: any) => row.value),
                        ttm_diluted_eps: totalEps
                    })
                }
            })
    }, [symbolId]);

    if (Object.keys(ratioData).length !== 0) {
        return (
            <table>
                <tr>
                    <td>TTM Diluted EPS</td>
                    {ratioData.quarter_end.map((date: any) => <td key={date}>{date}</td>)}
                </tr>
                <tr>
                    <td>{ratioData.ttm_diluted_eps}</td>
                    {ratioData.quarter_diluted_eps.map((eps: any) => <td key={eps}>{eps}</td>)} 
                </tr>
            </table>
        )
    }
}

export function SummaryHighlights({symbolId}: {symbolId: number}) {
    const [summaryText, setSummaryText] = useState<string>();
    const [summaryCitations, setSummaryCitations] = useState<string[]>([]);
    const [showCitations, setShowCitations] = useState<boolean>(false);

    useEffect(() => {
        ServerRoutes.getSymbolHighlights(symbolId)
            .then(data => {
                if (data.length > 0) {
                    setSummaryText(data[0].highlights);
                    setSummaryCitations(data[0].documents);
                }
            })
    }, [symbolId])

    return (
        <div className="p-4 border border-gray-300 rounded-lg text-white container">
            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">News Summary</h2>
                <p style={{whiteSpace: "pre-line"}}>{summaryText}</p>
            </div>
            {showCitations && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">Citations</h3>
                    <ul>
                        {summaryCitations.map((citation, index) => (
                            <li key={index} className="mb-1">
                                <a href={citation} target="_blank" rel="noopener noreferrer">{citation}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <div className="flex justify-center">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4"
                    onClick={() => setShowCitations(!showCitations)}
                >
                    {showCitations ? "Hide Citations" : "See Citations"}
                </button>
            </div>
            
        </div>
    )
}
