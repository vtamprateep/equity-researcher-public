import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';
import { useEffect, useState } from 'react';
import config from "../next.config.mjs";

import { parse } from "date-fns";
import 'chartjs-adapter-date-fns';


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
    }, [symbolId]);

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
        scales: {
            x: {
                type: "time",
                time: {
                    unit: "day",
                    displayFormats: {
                        day: "MMM dd, yyyy"
                    }
                },
                ticks: {
                    stepSize: 10
                }
            },
            y: {
                title: {
                    display: true,
                    text: "Adjusted Close"
                }
            }
        }
    }

    const updateChartsData = async (symbolIdArray: number[]): Promise<void> => { // Pull charts data down from server and update state
        setChartData([]) // Wipe existing data first
        symbolIdArray.forEach((symbolId) => {
            fetch(`http://${config?.env?.SERVER_HOST}:${config?.env?.SERVER_PORT}/get_charts/${symbolId}`, {
                method: "GET",
                headers: { 'Content-Type': 'application/json' },
            })
                .then((res) => res.json())
                .then((res_data: any) => {
                    let newDataEntry = {
                        symbol: res_data.rows[0].symbol,
                        data: res_data.rows.map((entry: RouteGetChartsEntry) => { return {close_date: entry.close_date, adj_close: entry.adj_close} })
                    }
                    console.log(newDataEntry);
                    setChartData(prevChartData => [...prevChartData, newDataEntry]);
                })
                .catch(error => {
                    console.log("Error fetching or processing data:", error);
                });
        })
        console.log(chartData);
    }

    const searchParent = async function(symbolId: number) { // Given symbol ID, see if there is a parent
        return fetch(`http://${config?.env?.SERVER_HOST}:${config?.env?.SERVER_PORT}/get_parent_id/${symbolId}`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        })
            .then((res) => res.json())
            .then((res_data: any) => {
                if (res_data.rows.length != 0) {
                    return res_data.rows[0].parent_symbol_id;
                } else { return undefined }
            })
    }

    const formatChartsData = (data: ChartData[]) => { // Format data to be put into Chart.js component
        if (data.length == 0) { // Base case
            return { labels: [], datasets: [] }
        }

        let outputChartData = {
            labels: data[0].data.map(row => parse(row.close_date.slice(0, 10), "yyyy-MM-dd", new Date())),
            datasets: data.map(entry => {
                return {
                    label: entry.symbol,
                    data: entry.data.map((row: any) => row.adj_close),
                    borderColor: "red",
                    fill: false
                }
            })
        }

        return outputChartData
    }
    
    useEffect(() => {
        if (symbolId != undefined) {
            // Search for parent, if exists get series data
            searchParent(symbolId)
                .then(parentSymbolId => {
                    parentSymbolId ? updateChartsData([symbolId, parentSymbolId]) : updateChartsData([symbolId]);
                })
        }
    }, [symbolId]);
    
    if (symbolId != undefined && chartData.length != 0) {
        return <Chart type="line" data={formatChartsData(chartData)} options={chartOptions} />;
    }
}
