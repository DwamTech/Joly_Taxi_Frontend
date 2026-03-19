"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "./TripsChart.css";
import { MonthlyStats } from "@/services/dashboardService";

interface TripsChartProps {
  monthlyStats?: MonthlyStats[];
}

export default function TripsChart({ monthlyStats = [] }: TripsChartProps) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (!monthlyStats || monthlyStats.length === 0) return;

    // Transform API data to chart format
    const chartData = monthlyStats.map(stat => ({
      name: stat.month_name,
      trips: stat.trips,
      completed: stat.completed_trips
    }));

    setData(chartData);
  }, [monthlyStats]);

  return (
    <div className="trips-chart-container">
      <div className="chart-header">
        <h3 className="chart-title">إحصائيات الرحلات الشهرية</h3>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              stroke="#888"
              style={{ fontSize: '12px' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              stroke="#888"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                background: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                direction: 'rtl'
              }}
            />
            <Line
              type="monotone"
              dataKey="trips"
              stroke="#FDB913"
              strokeWidth={3}
              dot={{ fill: '#FDB913', r: 5 }}
              activeDot={{ r: 7 }}
              name="إجمالي الرحلات"
            />
            <Line
              type="monotone"
              dataKey="completed"
              stroke="#27ae60"
              strokeWidth={2}
              dot={{ fill: '#27ae60', r: 4 }}
              activeDot={{ r: 6 }}
              name="الرحلات المكتملة"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
