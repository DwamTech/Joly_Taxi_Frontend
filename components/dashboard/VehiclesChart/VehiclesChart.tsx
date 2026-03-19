"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "./VehiclesChart.css";
import { MonthlyStats } from "@/services/dashboardService";

interface VehiclesChartProps {
  monthlyStats?: MonthlyStats[];
}

export default function VehiclesChart({ monthlyStats = [] }: VehiclesChartProps) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (!monthlyStats || monthlyStats.length === 0) return;

    // Transform API data to chart format - showing new users per month
    const chartData = monthlyStats.map(stat => ({
      name: stat.month_name,
      count: stat.new_users
    }));

    setData(chartData);
  }, [monthlyStats]);

  return (
    <div className="vehicles-chart-container">
      <div className="chart-header">
        <h3 className="chart-title">المستخدمون الجدد شهرياً</h3>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
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
            <Bar
              dataKey="count"
              fill="#4A90E2"
              radius={[8, 8, 0, 0]}
              name="عدد المستخدمين الجدد"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
