import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { parse } from "date-fns";
import { useEffect, useState } from 'react';

import { ServerRoutes } from '../util/server';
import { ChartData } from '@/types/component';


export function SymbolPriceChart({symbolId}: {symbolId: number}) {
    const [displayMode, setDisplayMode] = useState<string>("$");
    const [displayData, setDisplayData] = useState<ChartData[]>([]);

    const [dataDollarForm, setDataDollarForm] = useState<ChartData[]>([]);
    const [dataPctForm, setDataPctForm] = useState<ChartData[]>([]);
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

    const handleDisplayModeChange = (mode: string): undefined => {
        if (mode !== displayMode) {
            setDisplayMode(mode)
            
            if (mode === "$") {setDisplayData(dataDollarForm)}
            if (mode === "%") {setDisplayData(dataPctForm)}
        }
    }

    const updateChartsData = async (symbolData: any): Promise<void> => {
        const dataEntries = await Promise.all(symbolData.map(async (entry: any) => {
            return ServerRoutes.getCharts(entry.symbol_id)
                .then(data => {
                    return {
                        symbol: entry.symbol,
                        type: entry.type,
                        data: data.map((entry: any) => ({close_date: entry.close_date, adj_close: entry.adj_close}))
                    }
                })
        }));
        setDataDollarForm(dataEntries);

        // Calculate 0% indexed series
        const pctDataEntries = dataEntries.map(entry => {
            // Grab first price as baseline, calculate percent change for each date
            let firstAdjClose = entry.data[0].adj_close;
            return {
                symbol: entry.symbol,
                type: entry.type,
                data: entry.data.map((close: any) => ({close_date: close.close_date, adj_close: (close.adj_close - firstAdjClose) / firstAdjClose}))
            }
        });
        setDataPctForm(pctDataEntries);
        setDisplayData(dataEntries);
    }

    const formatChartsData = (data: ChartData[]) => {
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
        setDisplayMode("$");
        // Search for parent, if exists get series data
        ServerRoutes.getParentIds(symbolId)
            .then((data: any) => {
                data.length ? updateChartsData(data) : undefined
            })
    }, [symbolId]);
    
    return (
        <div className="container">
            <div className="flex justify-center">
            <button
                onClick={() => handleDisplayModeChange('$')}
                className={`px-4 py-2 mr-2 font-semibold border rounded ${
                    displayMode === '$' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border-blue-500'
                }`}
            >
            $
            </button>
            <button
                onClick={() => handleDisplayModeChange('%')}
                className={`px-4 py-2 font-semibold border rounded ${
                    displayMode === '%' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border-blue-500'
                }`}
            >
            %
            </button>
            </div>
            <div className="container mx-4 my-4">
                <Chart 
                    type="line"
                    data={formatChartsData(displayData)}
                    // @ts-ignore
                    options={chartOptions}
                    className="w-full h-full" />
            </div>
        </div>
        
    );
}