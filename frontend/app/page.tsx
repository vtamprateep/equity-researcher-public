'use client'

import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';
import { useEffect, useState } from 'react';
import config from "../next.config.mjs";


function SymbolProfile() {
  const [profileData, setProfileData] = useState({
    symbol:"IWM",
    company_name:"iShares Russell 2000 ETF",
    currency:"USD",
    cik:"1100663",
    isin:"US4642876555",
    exchange:"New York Stock Exchange Arca",
    cusip:"464287655",
    exchange_short_name:"AMEX",
    industry:null,
    website:"https://www.ishares.com/us/products/239710/ishares-russell-2000-etf",
    description:"The fund generally invests at least 80% of its assets in the component securities of its underlying index and in investments that have economic characteristics that are substantially identical to the component securities of its underlying index (i.e., depositary receipts representing securities of the underlying index) and may invest up to 20% of its assets in certain futures, options and swap contracts, cash and cash equivalents.",
    ceo:null,
    sector:"Real Estate",
    country:"US",
    phone:null,
    address:"400 Howard Street",
    city:"San Francisco",
    state:null,
    ipo_date:"2000-05-26T04:00:00.000Z",
    is_etf:true,
    is_actively_trading:true,
    is_adr:false,
    is_fund:false
  });

  return <table>{Object.entries(profileData).map(([key, value]) => (
    <tr key={key}>
      <td>{key}</td>
      <td>{value}</td>
    </tr>
  ))}</table>;
}

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

  return (
    <div>
      <Chart type="line" data={chartData} />
      <SymbolProfile />
    </div>);
}
