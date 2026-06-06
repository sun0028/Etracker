import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { listTransactionsAPI } from "../../services/transactions/transactionService";

const TABS = ["Daily", "Weekly", "Monthly"];

const TrendsChart = () => {
  const [activeTab, setActiveTab] = useState("Monthly");
  const [activeType, setActiveType] = useState("expense");

  const { data: transactions } = useQuery({
    queryFn: listTransactionsAPI,
    queryKey: ["list-transactions"],
  });

  const buildData = () => {
    if (!transactions?.length) return [];

    const grouped = {};

    transactions.forEach((t) => {
      const date = new Date(t.date);
      let key;

      if (activeTab === "Daily") {
        key = date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
      } else if (activeTab === "Weekly") {
        // Get week number
        const startOfYear = new Date(date.getFullYear(), 0, 1);
        const week = Math.ceil(((date - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
        key = `W${week}`;
      } else {
        key = date.toLocaleDateString("en-GB", { month: "short", year: "2-digit" });
      }

      if (!grouped[key]) grouped[key] = { period: key, income: 0, expense: 0 };
      if (t.type === "income") grouped[key].income += t.amount;
      else grouped[key].expense += t.amount;
    });

    return Object.values(grouped).slice(-12);
  };

  const chartData = buildData();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-white/5 border border-[#2a3f5a] rounded-xl p-3 text-xs">
          <p className="text-[#a89f91] mb-1">{label}</p>
          {payload.map((p) => (
            <p key={p.name} style={{ color: p.color }} className="font-semibold">
              {p.name.charAt(0).toUpperCase() + p.name.slice(1)}: ${p.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass rounded-2xl p-6 border border-white/5 mt-6">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[#f5f0e8]">Spending Trends</h2>
          <p className="text-[#a89f91] text-sm mt-0.5">Track your financial patterns over time</p>
        </div>

        {/* Expense / Income toggle */}
        <div className="flex glass-dark rounded-xl p-1 border border-white/5">
          {["expense", "income"].map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition duration-150 ${
                activeType === type
                  ? type === "expense"
                    ? "bg-red-500/20 text-red-400"
                    : "bg-green-500/20 text-green-400"
                  : "text-[#a89f91] hover:text-[#f5f0e8]"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Period tabs */}
      <div className="flex gap-2 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-xl text-xs font-medium transition duration-150 ${
              activeTab === tab
                ? "bg-[#e8dcc8]/10 text-[#e8dcc8] border border-[#e8dcc8]/20"
                : "text-[#a89f91] hover:text-[#f5f0e8]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-[#a89f91] text-sm">
          No transaction data yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f87171" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2f45" />
            <XAxis
              dataKey="period"
              tick={{ fill: "#a89f91", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#a89f91", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            {activeType === "expense" ? (
              <Area
                type="monotone"
                dataKey="expense"
                stroke="#f87171"
                strokeWidth={2}
                fill="url(#expenseGrad)"
                dot={{ fill: "#f87171", strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: "#f87171" }}
              />
            ) : (
              <Area
                type="monotone"
                dataKey="income"
                stroke="#4ade80"
                strokeWidth={2}
                fill="url(#incomeGrad)"
                dot={{ fill: "#4ade80", strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: "#4ade80" }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TrendsChart;