import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';
import { useEffect, useState } from 'react';

import { parse } from "date-fns";
import 'chartjs-adapter-date-fns';
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

export function PriceChart({symbolId}: {symbolId: number}) {
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

    const updateChartsData = async (symbolData: any): Promise<void> => {
        const dataEntries = await Promise.all(symbolData.map(async (entry:any) => {
            return ServerRoutes.getCharts(entry.symbol_id)
                .then(data => {
                    return {
                        symbol: entry.symbol,
                        type: entry.type,
                        data: data.rows.map((entry: any) => ({close_date: entry.close_date, adj_close: entry.adj_close}))
                    }
                })
        }));
        setChartData(dataEntries);
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
        // Search for parent, if exists get series data
        ServerRoutes.getParentIds(symbolId)
            .then((data: any) => {
                data.rows.length ? updateChartsData(data.rows) : undefined
            })
    }, [symbolId]);
    
    return (
        <div className="container mx-4 my-4">
            <Chart 
                type="line"
                data={formatChartsData(chartData)}
                // @ts-ignore
                options={chartOptions}
                className="w-full h-full" />
        </div>
    );
}

export function DrillDownDisplayCard({symbolName, percentChange}: {symbolName: string, percentChange: number}) {

    return (
        <div className={`p-4 border border-gray-300 rounded-lg ${percentChange > 0 ? "text-green-500" : "text-red-500"} container`}>
            <h2 className="text-xl font-medium mb-2">{symbolName} {percentChange > 0 ? '▲' : '▼'}{(percentChange * 100).toFixed(2)}%</h2>
        </div>
    )
}

/**
 * Displays children symbol ID in cards that user can drill down into
 */
export function DrillDownDisplay({symbolId}: {symbolId: number}) {
    const [displayData, setDisplayData] = useState<{[key: string]: number}>();

    useEffect(() => {
        setDisplayData(undefined);
        ServerRoutes.getChildIds(symbolId)
            .then((data: any) => {
                if (data.rows.length != 0) {
                    return data.rows.map((entry: any) => entry.symbol_id);
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
                <DrillDownDisplayCard key={key} symbolName={key} percentChange={value} />
            ))}
            
        </div>
    );
}

export function SummaryHighlights({symbolId}: {symbolId: number}) {
    const [summaryText, setSummaryText] = useState<string>();
    const [summaryCitations, setSummaryCitations] = useState<string[]>([]);
    const [showCitations, setShowCitations] = useState<boolean>(false);

    useEffect(() => {
        ServerRoutes.getSymbolHighlights(symbolId)
            .then(data => {
                if (data.rows.length > 0) {
                    setSummaryText(data.rows[0].highlights);
                    setSummaryCitations(data.rows[0].documents);
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
