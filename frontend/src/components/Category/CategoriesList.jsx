import React from "react";
import { FaTrash, FaEdit, FaPlus, FaTags } from "react-icons/fa";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { deleteCategoryAPI, listCategoriesAPI } from "../../services/category/categoryService";
import AlertMessage from "../Alert/AlertMessage";

const CategoriesList = () => {
  const navigate = useNavigate();

  const { data, isError, isLoading, error, refetch } = useQuery({
    queryFn: listCategoriesAPI,
    queryKey: ["list-categories"],
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteCategoryAPI,
    mutationKey: ["delete-category"],
    onSuccess: () => refetch(),
  });

  const handleDelete = (id) => {
    if (window.confirm("Delete this category? Transactions will be marked Uncategorized.")) {
      mutateAsync(id).catch((e) => console.log(e));
    }
  };

  const incomeCategories = data?.filter((c) => c.type === "income") || [];
  const expenseCategories = data?.filter((c) => c.type === "expense") || [];

  return (
    <div className="min-h-screen  px-6 py-10">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#f5f0e8]">Categories</h1>
            <p className="text-[#a89f91] text-sm mt-1">Manage your income and expense categories</p>
          </div>
          <button
            onClick={() => navigate("/add-category")}
            className="flex items-center gap-2 bg-[#e8dcc8] hover:bg-[#d4c9b0] text-[#0f1b2d] font-semibold px-4 py-2.5 rounded-xl text-sm transition"
          >
            <FaPlus className="text-xs" />
            Add Category
          </button>
        </div>

        {isLoading && <AlertMessage type="loading" message="Loading categories..." />}
        {isError && <AlertMessage type="error" message={error?.response?.data?.message || "Failed to load"} />}

        {/* Income Categories */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-green-400"></span>
            <h2 className="text-[#a89f91] text-xs font-semibold uppercase tracking-wider">
              Income ({incomeCategories.length})
            </h2>
          </div>
          {incomeCategories.length === 0 ? (
            <div className="glass rounded-2xl p-4 border border-white/5 text-center">
              <p className="text-[#a89f91] text-sm">No income categories yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {incomeCategories.map((category) => (
                <div
                  key={category._id}
                  className="glass rounded-xl p-4 border border-white/5 flex justify-between items-center hover:border-green-500/20 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <FaTags className="text-green-400 text-xs" />
                    </div>
                    <span className="text-[#f5f0e8] text-sm font-medium capitalize">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400 font-medium">
                      Income
                    </span>
                    <Link to={`/update-category/${category._id}`}>
                      <button className="text-[#a89f91] hover:text-[#e8dcc8] transition">
                        <FaEdit className="text-sm" />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(category._id)}
                      disabled={isPending}
                      className="text-[#a89f91] hover:text-red-400 transition"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Expense Categories */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-red-400"></span>
            <h2 className="text-[#a89f91] text-xs font-semibold uppercase tracking-wider">
              Expense ({expenseCategories.length})
            </h2>
          </div>
          {expenseCategories.length === 0 ? (
            <div className="glass rounded-2xl p-4 border border-white/5 text-center">
              <p className="text-[#a89f91] text-sm">No expense categories yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {expenseCategories.map((category) => (
                <div
                  key={category._id}
                  className="glass rounded-xl p-4 border border-white/5 flex justify-between items-center hover:border-red-500/20 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                      <FaTags className="text-red-400 text-xs" />
                    </div>
                    <span className="text-[#f5f0e8] text-sm font-medium capitalize">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400 font-medium">
                      Expense
                    </span>
                    <Link to={`/update-category/${category._id}`}>
                      <button className="text-[#a89f91] hover:text-[#e8dcc8] transition">
                        <FaEdit className="text-sm" />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(category._id)}
                      disabled={isPending}
                      className="text-[#a89f91] hover:text-red-400 transition"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CategoriesList;