'use client'

import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';
import { useEffect, useState } from 'react';
import config from "../next.config.mjs";


function SymbolProfile() {
  const [symbolData, setSymbolData] = useState();

};

export default function Home() {

  const [chartData, setChartData] = useState<ChartData>({
    labels: ["1", "2", "3"],
    datasets: [{label: "X", data: [1, 2, 3]}]
  });

  useEffect(() => {
    fetch(`http://${config.env.SERVER_HOST}:${config.env.SERVER_PORT}/get_charts/10`, {
      method: "GET",
      headers: { 'Content-Type': 'application/json' },
    })
    .then((res) => res.json())
    .then((res_data: any) => {
      let newChartData = {
        labels: res_data.rows.map((row: any) => row.close_date.slice(0, 10)),
        datasets: [
          {
            label: "Adjusted Close Price",
            data: res_data.rows.map((row: any) => row.adj_close)
          }
        ]
      }
      setChartData(newChartData);
    }).catch(error => {console.log("Error fetching or processing data:", error)});
  });

  return <Chart type="line" data={chartData} />;
}
