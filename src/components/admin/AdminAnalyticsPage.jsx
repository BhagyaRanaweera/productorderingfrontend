import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { name: "Product A", sales: 400 },
  { name: "Product B", sales: 700 },
  { name: "Product C", sales: 300 },
  { name: "Product D", sales: 900 },
];

const AdminAnalyticsPage = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Sales Analytics</h2>
      <div className="w-full h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
