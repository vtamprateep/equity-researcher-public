import { useEffect, useState } from 'react';
import { ServerRoutes } from '../util/server';


export function PERatioTable({symbolId}: {symbolId: number}) {
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
