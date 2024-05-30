import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { parse } from "date-fns";
import { useEffect, useState } from 'react';

import { ServerRoutes } from '../util/server';
import { ChartData } from '@/types/component';


export function DisplayPeriodModeToggle({callback, defaultMode="1YR"}: {callback: Function, defaultMode?: string}) {
    const [mode, setMode] = useState<string>(defaultMode);

    const BASE_CSS = "bg-white text-blue-500 border-blue-500";
    const FOCUS_CSS = "bg-blue-500 text-white";

    const handleModeChange = (value: string) => {
        setMode(value);
        callback(value);
    }

    return (
        <div className="flex justify-center my-2">
            <button
                onClick={() => handleModeChange("1WK")}
                className={`px-4 py-2 mr-2 font-semibold border rounded ${mode === "1WK" ? FOCUS_CSS : BASE_CSS}`}
            >
            1WK
            </button>
            <button
                onClick={() => handleModeChange("1M")}
                className={`px-4 py-2 mr-2 font-semibold border rounded ${mode === "1M" ? FOCUS_CSS : BASE_CSS}`}
            >
            1M
            </button>
            <button
                onClick={() => handleModeChange("3M")}
                className={`px-4 py-2 mr-2 font-semibold border rounded ${mode === "3M" ? FOCUS_CSS : BASE_CSS}`}
            >
            3M
            </button>
            <button
                onClick={() => handleModeChange("6M")}
                className={`px-4 py-2 mr-2 font-semibold border rounded ${mode === "6M" ? FOCUS_CSS : BASE_CSS}`}
            >
            6M
            </button>
            <button
                onClick={() => handleModeChange("1YR")}
                className={`px-4 py-2 mr-2 font-semibold border rounded ${mode === "1YR" ? FOCUS_CSS : BASE_CSS}`}
            >
            1YR
            </button>
        </div>
        
    )
}

export function DisplayUnitModeToggle({callback, defaultMode="$"}: {callback: Function, defaultMode?: string}) {
    const [mode, setMode] = useState<string>(defaultMode);

    const BASE_CSS = "bg-white text-blue-500 border-blue-500";
    const FOCUS_CSS = "bg-blue-500 text-white";

    const handleModeChange = (value: string) => {
        setMode(value);
        callback(value);
    }

    return (
        <div className="flex justify-center">
            <button
                onClick={() => handleModeChange('$')}
                className={`px-4 py-2 mr-2 font-semibold border rounded ${
                    mode === '$' ? FOCUS_CSS : BASE_CSS
                }`}
            >
            $
            </button>
            <button
                onClick={() => handleModeChange('%')}
                className={`px-4 py-2 font-semibold border rounded ${
                    mode === '%' ? FOCUS_CSS : BASE_CSS
                }`}
            >
            %
            </button>
        </div>
    )    
}

export function SymbolPriceChart({symbolId}: {symbolId: number}) {
    const [displayMode, setDisplayMode] = useState<string>("$");
    const [displayPeriod, setDisplayPeriod] = useState<string>("1YR");
    const [displayData, setDisplayData] = useState<ChartData[]>([]);

    const [symbolIdArr, setSymbolArr] = useState<{symbol_id: number, symbol: string, type: string}[]>();
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
                    text: `Adjusted Close (${displayMode})`,
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

    const updateChartsData = async (symbolData: {symbol_id: number, symbol: string, type: string}[], period: string): Promise<void> => {
        // Define start / end date
        let endDate = new Date();
        let startDate = new Date();
        switch (period) {
            case "1WK":
                startDate.setDate(endDate.getDate() - 7);
                break;
            case "1M":
                startDate.setMonth(endDate.getMonth() - 1);
                break;
            case "3M":
                startDate.setMonth(endDate.getMonth() - 3);
                break;
            case "6M":
                startDate.setMonth(endDate.getMonth() - 6);
                break;
            case "1YR":
                startDate.setFullYear(endDate.getFullYear() - 1);
                break;
        }
        const dataEntries = await Promise.all(symbolData.map(async (entry: any) => {
            return ServerRoutes.getCharts(entry.symbol_id, startDate, endDate)
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
            let firstAdjClose = entry.data[0].adj_close;
            return {
                symbol: entry.symbol,
                type: entry.type,
                data: entry.data.map((close: any) => ({close_date: close.close_date, adj_close: (close.adj_close - firstAdjClose) / firstAdjClose}))
            }
        });
        setDataPctForm(pctDataEntries);
        displayMode === "$" ? setDisplayData(dataEntries) : setDisplayData(pctDataEntries);
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
                switch (entry.type) {
                    case "MARKET":
                        lineColor = "rgba(211,84,0,1";
                        break;
                    case "SECTOR":
                        lineColor = "rgba(242,121,53,1)";
                        break;
                    case "INDIVIDUAL":
                        lineColor = "rgba(249,191,59,1)";
                        break;
                }

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
        setSymbolArr([]);
        // Search for parent, if exists get series data
        ServerRoutes.getParentIds(symbolId)
            .then((data) => {
                setSymbolArr(data);
                data.length ? updateChartsData(data, displayPeriod) : undefined
            })
    }, [symbolId]);

    useEffect(() => { // When display period changes
        if (symbolIdArr && symbolIdArr.length !== 0) {
            updateChartsData(symbolIdArr, displayPeriod);
        }
    }, [displayPeriod])

    useEffect(() => {
        displayMode === "$" ? setDisplayData(dataDollarForm) : setDisplayData(dataPctForm)
    }, [displayMode])
    
    return (
        <div className="container">
            <DisplayUnitModeToggle callback={setDisplayMode} />
            <DisplayPeriodModeToggle callback={setDisplayPeriod} />
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