import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { listTransactionsAPI } from "../../services/transactions/transactionService";

ChartJS.register(ArcElement, Tooltip, Legend);

const EXPENSE_COLORS = [
  "#f87171", "#fb923c", "#fbbf24", "#a78bfa",
  "#60a5fa", "#f472b6", "#34d399", "#818cf8",
  "#e879f9", "#94a3b8",
];

const TransactionChart = () => {
  const { data: transactions } = useQuery({
    queryFn: listTransactionsAPI,
    queryKey: ["list-transactions"],
  });

  // Group expenses by category
  const expenseByCategory = {};
  let totalIncome = 0;

  transactions?.forEach((t) => {
    if (t.type === "income") {
      totalIncome += t.amount;
    } else {
      const cat = t.category?.name || t.category || "Uncategorized";
      expenseByCategory[cat] = (expenseByCategory[cat] || 0) + t.amount;
    }
  });

  const expenseCategories = Object.keys(expenseByCategory);
  const expenseAmounts = Object.values(expenseByCategory);
  const totalExpense = expenseAmounts.reduce((a, b) => a + b, 0);

  const labels = ["Income", ...expenseCategories];
  const dataValues = [totalIncome, ...expenseAmounts];
  const backgroundColors = [
    "#4ade80",
    ...expenseCategories.map((_, i) => EXPENSE_COLORS[i % EXPENSE_COLORS.length]),
  ];

  const data = {
    labels,
    datasets: [{
      data: dataValues,
      backgroundColor: backgroundColors,
      borderColor: "#162032",
      borderWidth: 3,
      hoverOffset: 6,
    }],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 16,
          boxWidth: 10,
          color: "#a89f91",
          font: { size: 11 },
        },
      },
    },
    cutout: "68%",
  };

  return (
    <div className="glass rounded-2xl p-6 border border-white/5 h-full">
      <h2 className="text-lg font-semibold text-[#f5f0e8] mb-1">Overview</h2>
      <p className="text-[#a89f91] text-sm mb-4">Income vs Expenses by category</p>
      <div style={{ height: "260px" }}>
        <Doughnut data={data} options={options} />
      </div>
      <div className="mt-5 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-[#a89f91] text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
            Total Income
          </span>
          <span className="text-green-400 font-semibold">${totalIncome.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#a89f91] text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-400 inline-block"></span>
            Total Expenses
          </span>
          <span className="text-red-400 font-semibold">${totalExpense.toLocaleString()}</span>
        </div>
        {expenseCategories.map((cat, i) => (
          <div key={cat} className="flex justify-between items-center">
            <span className="text-[#a89f91] text-xs flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: EXPENSE_COLORS[i % EXPENSE_COLORS.length] }}
              ></span>
              {cat}
            </span>
            <span className="text-[#f5f0e8] text-xs font-medium">
              ${expenseByCategory[cat].toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionChart;