import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaPlus, FaArrowUp, FaArrowDown, FaWallet, FaTimes, FaTags } from "react-icons/fa";
import { listTransactionsAPI, addTransactionAPI } from "../../services/transactions/transactionService";
import { listCategoriesAPI, addCategoryAPI } from "../../services/category/categoryService";
import TransactionChart from "../Transactions/TransactionChart";
import TransactionList from "../Transactions/TransactionList";
import AlertMessage from "../Alert/AlertMessage";
import TrendsChart from "../Transactions/TrendsChart";


const inputClass = "w-full p-2.5 rounded-xl bg-[#0a1220] border border-white/5 text-[#f5f0e8] text-sm focus:border-[#e8dcc8] focus:outline-none";
const labelClass = "block text-[#a89f91] text-xs mb-1.5 font-medium";

// ── Add Transaction Modal ─────────────────────────────────────────────────────
const AddTransactionModal = ({ onClose, categories, onCategoryCreated }) => {
  const queryClient = useQueryClient();

  const { mutateAsync: createCategory } = useMutation({
    mutationFn: addCategoryAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(["list-categories"]);
      onCategoryCreated();
    },
  });

  const { mutateAsync, isPending, isError, error, isSuccess } = useMutation({
    mutationFn: addTransactionAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(["list-transactions"]);
      queryClient.invalidateQueries(["list-transactions-dash"]);
      setTimeout(onClose, 1200);
    },
  });

  const formik = useFormik({
    initialValues: {
      type: "",
      amount: "",
      category: "",
      date: "",
      description: "",
      newCategoryName: "",
      newCategoryType: "",
    },
    validationSchema: Yup.object({
      type: Yup.string().required("Required").oneOf(["income", "expense"]),
      amount: Yup.number().required("Required").positive("Must be positive"),
      category: Yup.string().required("Required"),
      date: Yup.date().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        let categoryName = values.category;

        if (values.category === "__new__") {
          if (!values.newCategoryName.trim()) {
            formik.setFieldError("category", "Please enter a category name");
            return;
          }
          await createCategory({
            name: values.newCategoryName.trim(),
            type: values.newCategoryType || values.type,
          });
          categoryName = values.newCategoryName.trim().toLowerCase();
        }

        await mutateAsync({
          type: values.type,
          amount: values.amount,
          category: categoryName,
          date: values.date,
          description: values.description,
        });
      } catch (e) {
        console.error(e);
      }
    },
  });

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="glass rounded-2xl p-6 w-full max-w-md border border-white/5 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold text-[#f5f0e8]">Add Transaction</h2>
          <button onClick={onClose} className="text-[#a89f91] hover:text-[#f5f0e8]">
            <FaTimes />
          </button>
        </div>

        {isPending && <AlertMessage type="loading" message="Adding transaction..." />}
        {isError && <AlertMessage type="error" message={error?.response?.data?.message || "Error"} />}
        {isSuccess && <AlertMessage type="success" message="Transaction added!" />}

        <form onSubmit={formik.handleSubmit} className="space-y-4 mt-4">
          {/* Type */}
          <div>
            <label className={labelClass}>Type</label>
            <select {...formik.getFieldProps("type")} className={inputClass}>
              <option value="">Select type</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            {formik.touched.type && formik.errors.type && (
              <p className="text-red-400 text-xs mt-1">{formik.errors.type}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className={labelClass}>Amount</label>
            <input
              type="number"
              {...formik.getFieldProps("amount")}
              placeholder="0.00"
              className={inputClass}
            />
            {formik.touched.amount && formik.errors.amount && (
              <p className="text-red-400 text-xs mt-1">{formik.errors.amount}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className={labelClass}>Category</label>
            <select
              className={inputClass}
              value={formik.values.category}
              onChange={(e) => formik.setFieldValue("category", e.target.value)}
            >
              <option value="">Select category</option>
              <option value="Uncategorized">Uncategorized</option>
              {categories?.map((c) => (
                <option key={c._id} value={c.name}>{c.name}</option>
              ))}
              <option value="__new__">+ Create new category</option>
            </select>
            {formik.touched.category && formik.errors.category && (
              <p className="text-red-400 text-xs mt-1">{formik.errors.category}</p>
            )}

            {/* New category inputs */}
            {formik.values.category === "__new__" && (
              <div className="mt-3 p-3 glass-dark rounded-xl border border-white/5 space-y-2">
                <p className="text-[#a89f91] text-xs mb-2">New category details</p>
                <input
                  type="text"
                  placeholder="Category name (e.g. Groceries)"
                  value={formik.values.newCategoryName}
                  onChange={(e) => formik.setFieldValue("newCategoryName", e.target.value)}
                  className={inputClass}
                />
                <select
                  value={formik.values.newCategoryType}
                  onChange={(e) => formik.setFieldValue("newCategoryType", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Category type</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
            )}
          </div>

          {/* Date */}
          <div>
            <label className={labelClass}>Date</label>
            <input
              type="date"
              {...formik.getFieldProps("date")}
              className={inputClass}
            />
            {formik.touched.date && formik.errors.date && (
              <p className="text-red-400 text-xs mt-1">{formik.errors.date}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Description (optional)</label>
            <input
              type="text"
              {...formik.getFieldProps("description")}
              placeholder="Notes..."
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#e8dcc8] hover:bg-[#d4c9b0] text-[#0f1b2d] font-semibold py-2.5 rounded-xl transition duration-150"
          >
            {isPending ? "Adding..." : "Add Transaction"}
          </button>
        </form>
      </div>
    </div>
  );
};

// ── Add Category Modal ────────────────────────────────────────────────────────
const AddCategoryModal = ({ onClose }) => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, isError, error, isSuccess } = useMutation({
    mutationFn: addCategoryAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(["list-categories"]);
      setTimeout(onClose, 1200);
    },
  });

  const formik = useFormik({
    initialValues: { name: "", type: "" },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      type: Yup.string().required("Required").oneOf(["income", "expense"]),
    }),
    onSubmit: (values) => mutateAsync(values).catch(console.error),
  });

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="glass rounded-2xl p-6 w-full max-w-sm border border-white/5 shadow-2xl">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold text-[#f5f0e8]">Add Category</h2>
          <button onClick={onClose} className="text-[#a89f91] hover:text-[#f5f0e8]">
            <FaTimes />
          </button>
        </div>

        {isPending && <AlertMessage type="loading" message="Adding category..." />}
        {isError && <AlertMessage type="error" message={error?.response?.data?.message || "Error"} />}
        {isSuccess && <AlertMessage type="success" message="Category added!" />}

        <form onSubmit={formik.handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className={labelClass}>Name</label>
            <input
              type="text"
              {...formik.getFieldProps("name")}
              placeholder="e.g. Groceries"
              className={inputClass}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-400 text-xs mt-1">{formik.errors.name}</p>
            )}
          </div>
          <div>
            <label className={labelClass}>Type</label>
            <select {...formik.getFieldProps("type")} className={inputClass}>
              <option value="">Select type</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            {formik.touched.type && formik.errors.type && (
              <p className="text-red-400 text-xs mt-1">{formik.errors.type}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#e8dcc8] hover:bg-[#d4c9b0] text-[#0f1b2d] font-semibold py-2.5 rounded-xl transition duration-150"
          >
            {isPending ? "Adding..." : "Add Category"}
          </button>
        </form>
      </div>
    </div>
  );
};

// ── Main Dashboard ────────────────────────────────────────────────────────────
const Dashboard = () => {
  const [showTxModal, setShowTxModal] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);

  const { data: transactions } = useQuery({
    queryFn: () => listTransactionsAPI({}),
    queryKey: ["list-transactions-dash"],
  });

  const { data: categories, refetch: refetchCategories } = useQuery({
    queryFn: listCategoriesAPI,
    queryKey: ["list-categories"],
  });

  const totals = transactions?.reduce(
    (acc, t) => {
      if (t.type === "income") acc.income += t.amount;
      else acc.expense += t.amount;
      return acc;
    },
    { income: 0, expense: 0 }
  );

  const balance = (totals?.income || 0) - (totals?.expense || 0);

  return (
    <div className="min-h-screen  text-[#f5f0e8] px-6 py-8">

      {/* Modals */}
      {showTxModal && (
        <AddTransactionModal
          onClose={() => setShowTxModal(false)}
          categories={categories}
          onCategoryCreated={refetchCategories}
        />
      )}
      {showCatModal && <AddCategoryModal onClose={() => setShowCatModal(false)} />}

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#f5f0e8]">Dashboard</h1>
          <p className="text-[#a89f91] text-sm mt-1">Your financial overview</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowCatModal(true)}
            className="flex items-center gap-2 bg-white/5 hover:bg-[#e8dcc8]/10 text-[#e8dcc8] font-medium px-4 py-2.5 rounded-xl transition duration-200 text-sm border border-white/5"
          >
            <FaTags className="text-xs" />
            Add Category
          </button>
          <button
            onClick={() => setShowTxModal(true)}
            className="flex items-center gap-2 bg-[#e8dcc8] hover:bg-[#d4c9b0] text-[#0f1b2d] font-semibold px-5 py-2.5 rounded-xl transition duration-200 text-sm"
          >
            <FaPlus className="text-xs" />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="glass rounded-2xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#e8dcc8]/10 flex items-center justify-center">
              <FaWallet className="text-[#e8dcc8]" />
            </div>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${balance >= 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
              Balance
            </span>
          </div>
          <p className="text-3xl font-bold text-[#f5f0e8]">${Math.abs(balance).toLocaleString()}</p>
          <p className="text-[#a89f91] text-sm mt-1">Net Balance</p>
        </div>

        <div className="glass rounded-2xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <FaArrowUp className="text-green-400" />
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-500/20 text-green-400">Income</span>
          </div>
          <p className="text-3xl font-bold text-[#f5f0e8]">${(totals?.income || 0).toLocaleString()}</p>
          <p className="text-[#a89f91] text-sm mt-1">Total Income</p>
        </div>

        <div className="glass rounded-2xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
              <FaArrowDown className="text-red-400" />
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-red-500/20 text-red-400">Expense</span>
          </div>
          <p className="text-3xl font-bold text-[#f5f0e8]">${(totals?.expense || 0).toLocaleString()}</p>
          <p className="text-[#a89f91] text-sm mt-1">Total Expenses</p>
        </div>
      </div>

      {/* Chart + Transactions */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <TransactionChart />
        </div>
        <div className="lg:col-span-2">
          <TransactionList />
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-6">
  <TrendsChart />
</div>
    </div>
  );
};

export default Dashboard;