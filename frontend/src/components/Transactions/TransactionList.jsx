import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaTrash, FaEdit } from "react-icons/fa";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { listTransactionsAPI, deleteTransactionAPI } from "../../services/transactions/transactionService";
import { listCategoriesAPI } from "../../services/category/categoryService";

const TransactionList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState({
    startDate: "", endDate: "", type: "", category: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const { data: categoriesData } = useQuery({
    queryFn: listCategoriesAPI,
    queryKey: ["list-categories"],
  });

  const { data: transactions, isLoading } = useQuery({
    queryFn: () => listTransactionsAPI(filters),
    queryKey: ["list-transactions", filters],
  });

  const { mutateAsync: deleteTrans, isPending: isDeleting } = useMutation({
    mutationFn: deleteTransactionAPI,
    mutationKey: ["delete-transaction"],
    onSuccess: () => queryClient.invalidateQueries(["list-transactions"]),
  });

  const handleDelete = async (id) => {
    if (window.confirm("Delete this transaction?")) await deleteTrans(id);
  };

  const inputClass = "w-full p-2.5 rounded-xl glass-dark border border-white/5 text-[#f5f0e8] text-sm focus:border-[#e8dcc8] focus:outline-none appearance-none";

  return (
    <div className="glass rounded-2xl p-6 border border-white/5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-[#f5f0e8]">Transactions</h2>
        <span className="text-[#a89f91] text-sm">{transactions?.length || 0} records</span>
      </div>

      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className={inputClass} />
        <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className={inputClass} />
        <div className="relative">
          <select name="type" value={filters.type} onChange={handleFilterChange} className={inputClass}>
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <ChevronDownIcon className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-[#a89f91] pointer-events-none" />
        </div>
        <div className="relative">
          <select name="category" value={filters.category} onChange={handleFilterChange} className={inputClass}>
            <option value="All">All Categories</option>
            <option value="Uncategorized">Uncategorized</option>
            {categoriesData?.map((cat) => (
              <option key={cat._id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
          <ChevronDownIcon className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-[#a89f91] pointer-events-none" />
        </div>
      </div>

      
      {isLoading ? (
        <p className="text-center text-[#a89f91] py-8">Loading...</p>
      ) : transactions?.length === 0 ? (
        <p className="text-center text-[#a89f91] py-8">No transactions found.</p>
      ) : (
        <ul className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
          {transactions?.map((t) => (
            <li key={t._id} className="glass-dark rounded-xl p-4 flex justify-between items-center border border-white/5 hover:border-[#e8dcc8]/30 transition duration-150">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${t.type === "income" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                  {t.type === "income" ? "+" : "-"}
                </div>
                <div>
                  <p className="text-[#f5f0e8] text-sm font-medium">
                    {t.category?.name || t.category || "Uncategorized"}
                  </p>
                  <p className="text-[#a89f91] text-xs mt-0.5">
                    {t.description || "—"} • {new Date(t.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`font-semibold text-sm ${t.type === "income" ? "text-green-400" : "text-red-400"}`}>
                  {t.type === "income" ? "+" : "-"}${t.amount.toLocaleString()}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => navigate(`/update-transaction/${t._id}`)} className="text-[#a89f91] hover:text-[#e8dcc8] transition">
                    <FaEdit className="text-xs" />
                  </button>
                  <button onClick={() => handleDelete(t._id)} disabled={isDeleting} className="text-[#a89f91] hover:text-red-400 transition">
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TransactionList;