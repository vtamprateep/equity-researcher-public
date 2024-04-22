import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';
import { useEffect, useState } from 'react';
import config from "../next.config.mjs";


export function SymbolProfile({symbolId}: {symbolId: number | undefined}) {
    const [profileData, setProfileData] = useState<ProfileData>();
    // const [curSymbolId, setCurSymbolId] = useState<number | undefined>(symbolId);
  
    useEffect(() => {
        if (symbolId != undefined) {
            fetch(`http://${config?.env?.SERVER_HOST}:${config?.env?.SERVER_PORT}/get_profile/${symbolId}`, {
                method: "GET",
                headers: { 'Content-Type': 'application/json' },
            })
            .then((res) => res.json())
            .then((res_data: any) => {
                setProfileData(res_data.rows[0]);
            })
        }
        
    }, [symbolId]);
  
    if (symbolId != undefined) {
        return (<table>{
            profileData ? Object.entries(profileData).map(([key, value]) => (<tr key={key}><td>{key}</td><td>{String(value)}</td></tr>)) : null
        }</table>);
    }
}

export function PriceChart({symbolId}: {symbolId: number | undefined}) {
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const chartOptions = {
        x: {
            type: "time",
            time: {
                unit: "day"
            },
            title: {
                display: true,
                text: "Date"
            }
        },
        y: {
            title: {
                display: true,
                text: "Adjusted Close"
            }
        }
    };

    const updateChartsData = async (symbolIdArray: number[]): Promise<void> => { // Pull charts data down from server and update state
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
            labels: data[0].data.map(row => row.close_date.slice(0, 10)),
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
        return <Chart type="line" data={formatChartsData(chartData)} />;
    }
}
