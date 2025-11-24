import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
} from "chart.js";

ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const colors = {
  bitcoin: "orange",
  solana: "cyan",
  ripple: "lime",
  xrp: "magenta"
};

const displayNames = {
  bitcoin: "Bitcoin",
  solana: "Solana",
  ripple: "XRP",
  xrp: "XRP"
};

const CryptoDashboard = () => {
  const [data, setData] = useState({ prices: {}, sma: {}, signals: {}, timestamps: {} });

  useEffect(() => {
    const fetchData = () => {
      axios.get("https://crypto-dashboard-backend-updated.onrender.com")
        .then(res => setData(res.data))
        .catch(err => console.log(err));
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: "90%", margin: "0 auto", textAlign: "center", fontFamily: "Arial, sans-serif", backgroundColor: "#000", color: "white", padding: "20px", borderRadius: "10px" }}>
      <h2>Crypto Dashboard</h2>
      {Object.keys(data.prices).map(coin => (
        <div key={coin} style={{ backgroundColor: "#111", padding: "20px", borderRadius: "10px", marginBottom: "30px" }}>
          <h3>{displayNames[coin]}</h3>
          <Line
            data={{
              labels: data.timestamps[coin] || [],
              datasets: [
                {
                  label: displayNames[coin],
                  data: data.prices[coin].map(v => v === null ? undefined : v),
                  borderColor: colors[coin] || "white",
                  fill: false,
                  tension: 0.4,
                  spanGaps: true
                },
                {
                  label: `${displayNames[coin]} SMA`,
                  data: (data.sma[coin] || []).map(v => v === null ? undefined : v),
                  borderColor: colors[coin] || "white",
                  borderDash: [5, 5],
                  fill: false,
                  tension: 0.4,
                  spanGaps: true
                }
              ]
            }}
            options={{
              responsive: true,
              scales: {
                x: { title: { display: true, text: "Time" }, ticks: { color: "white" } },
                y: { title: { display: true, text: "Price (USD)" }, ticks: { color: "white" } }
              },
              plugins: { legend: { labels: { color: "white" } } }
            }}
          />
          <div style={{ marginTop: "10px" }}>
            <span style={{ color: data.signals[coin] === "BUY" ? "green" : data.signals[coin] === "SELL" ? "red" : "gray" }}>
              Signal: {data.signals[coin]}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CryptoDashboard;
