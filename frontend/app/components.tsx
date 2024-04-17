import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';
import { useEffect, useState } from 'react';
import config from "../next.config.mjs";


export function SymbolProfile({symbolId}: {symbolId: number | undefined}) {
    const [profileData, setProfileData] = useState<ProfileData>();
    // const [curSymbolId, setCurSymbolId] = useState<number | undefined>(symbolId);
  
    useEffect(() => {
        console.log("SymbolProfile updated.");
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
    const [chartData, setChartData] = useState<ChartData>({ labels: [], datasets: [] });
    // const [curSymbolId, setCurSymbolId] = useState<number | undefined>(symbolId);
    
    useEffect(() => {
        if (symbolId != undefined) {
            fetch(`http://${config?.env?.SERVER_HOST}:${config?.env?.SERVER_PORT}/get_charts/${symbolId}`, {
                method: "GET",
                headers: { 'Content-Type': 'application/json' },
            })
            .then((res) => res.json())
            .then((res_data: any) => {
                setChartData({
                    labels: res_data.rows.map((row: any) => row.close_date.slice(0, 10)),
                    datasets: [{
                        label: "Adjusted Close Price",
                        data: res_data.rows.map((row: any) => row.adj_close)
                    }]
                });
            }).catch(error => {console.log("Error fetching or processing data:", error)});
        }
    }, [symbolId]);
    
    if (symbolId != undefined) {
        return <Chart type="line" data={chartData} />;
    }
}
