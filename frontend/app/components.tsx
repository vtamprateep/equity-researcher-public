import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';
import { useEffect, useState } from 'react';
import config from "../next.config.mjs";

import { parse } from "date-fns";
import 'chartjs-adapter-date-fns';
import { ServerRoutes } from './util/server';


export function RatioTable({symbolId}: {symbolId: number | undefined}) {
    const [ratioData, setRatioData] = useState<any>({});

    const getTTMDilutedEPS = async function(symbolId: number) {
        return fetch(`http://${config?.env?.SERVER_HOST}:${config?.env?.SERVER_PORT}/get_ttm_diluted_eps/${symbolId}`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' },
        })
            .then(res => res.json())
            .then(res_data => res_data.rows);
    }

    useEffect(() => {
        if (symbolId) {
            setRatioData({});
            getTTMDilutedEPS(symbolId)
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
        }
    }, []);

    if (Object.keys(ratioData).length !== 0) { // Only render when we have some data point
        return (
            <table>
                <tr>
                    <td>TTM Diluted EPS</td>
                    {ratioData.quarter_end.map((date: any) => <td>{date}</td>)}
                </tr>
                <tr>
                    <td>{ratioData.ttm_diluted_eps}</td>
                    {ratioData.quarter_diluted_eps.map((eps: any) => <td>{eps}</td>)} 
                </tr>
            </table>
        )
    }
}

export function PriceChart({symbolId}: {symbolId: number | undefined}) {
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                grid: { color: "white" },
                type: "time",
                time: {
                    unit: "day",
                    displayFormats: {
                        day: "MMM dd, yyyy"
                    }
                },
                ticks: {
                    stepSize: 30,
                    color: "white"
                }
            },
            y: {
                title: {
                    display: true,
                    text: "Adjusted Close ($)",
                    color: "white",
                    font: {
                        size: 16
                    }
                },
                ticks: {
                    color: "white",
                }
            }
        },
        plugins: {
            legend: {
                labels: { color: "white" }
            }
        }
    }

    const updateChartsData = async (symbolData: any): Promise<void> => { // Pull charts data down from server and update state
        setChartData([]) // Wipe existing data first
        symbolData.forEach((entry: any) => {
            ServerRoutes.getCharts(entry.symbol_id)
                .then(data => {
                    let newDataEntry = {
                        symbol: entry.symbol,
                        type: entry.type,
                        data: data.rows.map((entry: RouteGetChartsEntry) => { return {close_date: entry.close_date, adj_close: entry.adj_close} })
                    }
                    setChartData(prevChartData => [...prevChartData, newDataEntry]);
                })
        });
    }

    const formatChartsData = (data: ChartData[]) => { // Format data to be put into Chart.js component
        if (data.length == 0) { // Base case
            return { labels: [], datasets: [] }
        }

        let outputChartData = {
            labels: data[0].data.map(row => parse(row.close_date.slice(0, 10), "yyyy-MM-dd", new Date())),
            datasets: data.map((entry: any) => {
                // Set series color
                let lineColor;
                if (entry.type == "MARKET") {lineColor = "rgba(211,84,0,1"};
                if (entry.type == "SECTOR") {lineColor = "rgba(242,121,53,1)"};
                if (entry.type == "INDIVIDUAL") {lineColor = "rgba(249,191,59,1)"};

                return {
                    label: entry.symbol,
                    data: entry.data.map((row: any) => row.adj_close),
                    borderColor: lineColor,
                    fill: false
                }
            })
        }

        return outputChartData
    }
    
    useEffect(() => {
        if (symbolId != undefined) {
            // Search for parent, if exists get series data
            ServerRoutes.getParentIds(symbolId)
                .then((data: any) => {
                    data.rows.length ? updateChartsData(data.rows) : undefined
                })
        }
    }, [symbolId]);
    
    if (symbolId != undefined && chartData.length != 0) {
        return (
            <div className="container mx-4 my-4">
                <Chart 
                    type="line"
                    data={formatChartsData(chartData)} 
                    options={chartOptions}
                    className="w-full h-full" />
            </div>
        );
    }
}

export function DrillDownDisplayCard({symbolName}: {symbolName: string}) {
    return (
        <div className="bg-grey rounded-lg shadow-md p-4 text-center">
            <h2 className="text-xl font-medium mb-2">{symbolName}</h2>
        </div>
    )
}

/**
 * Displays children symbol ID in cards that user can drill down into
 */
export function DrillDownDisplay({symbolId}: {symbolId: number | undefined}) {
    const [displayData, setDisplayData] = useState<any[]>([]);

    useEffect(() => {
        if (symbolId != undefined) {
            ServerRoutes.getChildIds(symbolId)
                .then((data: any) => {
                    if (data.rows.length != 0) {
                        return data.rows.map((entry: any) => entry.symbol_id);
                    } else { return [] }
                })
                .then(res => {
                    ServerRoutes.getSymbolNames(res)
                        .then((data: any) => {
                            if (data.rows.length > 0) {
                                let symbolList = data.rows.map((entry: any) => entry.symbol);
                                setDisplayData(symbolList);
                            }
                        })
                });   
        }
    }, [symbolId])

    if (symbolId != undefined && displayData.length > 0) {

        return(
            <div className="grid grid-cols-3 gap-4 w-11/12 bg-white">
                {displayData.map((entry: string) => <DrillDownDisplayCard symbolName={entry} />)}
            </div>
        );
    }
}

export function SummaryHighlights({symbolId}: {symbolId: number | undefined}) {
    const [summaryText, setSummaryText] = useState<string>();
    const [summaryCitations, setSummaryCitations] = useState<string[]>([]);
    const [showCitations, setShowCitations] = useState<boolean>(false);

    useEffect(() => {
        if (symbolId !== undefined) {
            ServerRoutes.getSymbolHighlights(symbolId)
            .then(data => {
                if (data.rows.length > 0) {
                    setSummaryText(data.rows[0].highlights);
                    setSummaryCitations(data.rows[0].documents);
                }
            })
        }
    }, [symbolId])

    if (summaryText != undefined) {
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
}
