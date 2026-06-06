import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { updateTransactionAPI, listTransactionsAPI } from "../../services/transactions/transactionService";
import { listCategoriesAPI, addCategoryAPI } from "../../services/category/categoryService";
import AlertMessage from "../Alert/AlertMessage";

const inputClass = "w-full py-3 px-4 rounded-xl glass-dark border border-white/5 text-[#f5f0e8] placeholder-[#4a5568] focus:border-[#e8dcc8] focus:outline-none text-sm";
const labelClass = "block text-[#a89f91] text-xs mb-1.5 font-medium uppercase tracking-wider";

const UpdateTransaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: transactions } = useQuery({
    queryFn: () => listTransactionsAPI({}),
    queryKey: ["list-transactions-all"],
  });

  const { data: categories } = useQuery({
    queryFn: listCategoriesAPI,
    queryKey: ["list-categories"],
  });

  const transaction = transactions?.find((t) => t._id === id);

  const { mutateAsync: createCategory } = useMutation({
    mutationFn: addCategoryAPI,
    onSuccess: () => queryClient.invalidateQueries(["list-categories"]),
  });

  const {
    mutateAsync: updateTransaction,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: updateTransactionAPI,
    mutationKey: ["update-transaction"],
    onSuccess: () => {
      queryClient.invalidateQueries(["list-transactions"]);
      queryClient.invalidateQueries(["list-transactions-dash"]);
      setTimeout(() => navigate("/dashboard"), 1200);
    },
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      type: transaction?.type || "",
      amount: transaction?.amount || "",
      category: transaction?.category || "",
      date: transaction?.date ? new Date(transaction.date).toISOString().split("T")[0] : "",
      description: transaction?.description || "",
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
          if (!values.newCategoryName) {
            formik.setFieldError("category", "Please enter a category name");
            return;
          }
          await createCategory({
            name: values.newCategoryName,
            type: values.newCategoryType || values.type,
          });
          categoryName = values.newCategoryName.toLowerCase();
        }

        await updateTransaction({
          id,
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

  if (!transaction) {
    return (
      <div className="min-h-screen glass-dark flex items-center justify-center">
        <p className="text-[#a89f91]">Loading transaction...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen glass-dark px-6 py-10">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#f5f0e8]">Edit Transaction</h1>
            <p className="text-[#a89f91] text-sm mt-1">Update transaction details</p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-[#a89f91] hover:text-[#f5f0e8] transition"
          >
            <FaTimes />
          </button>
        </div>

        <div className="glass rounded-2xl p-6 border border-white/5">
          {isPending && <AlertMessage type="loading" message="Updating transaction..." />}
          {isError && <AlertMessage type="error" message={error?.response?.data?.message || "Update failed"} />}
          {isSuccess && <AlertMessage type="success" message="Transaction updated!" />}

          <form onSubmit={formik.handleSubmit} className="space-y-4 mt-2">
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

            <div>
              <label className={labelClass}>Category</label>
              <select
                {...formik.getFieldProps("category")}
                className={inputClass}
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

              {formik.values.category === "__new__" && (
                <div className="mt-3 space-y-2">
                  <input
                    type="text"
                    placeholder="New category name"
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

            <div>
              <label className={labelClass}>Description (optional)</label>
              <input
                type="text"
                {...formik.getFieldProps("description")}
                placeholder="Notes..."
                className={inputClass}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="flex-1 py-3 rounded-xl border border-white/5 text-[#a89f91] hover:text-[#f5f0e8] text-sm font-medium transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 py-3 bg-[#e8dcc8] hover:bg-[#d4c9b0] text-[#0f1b2d] font-semibold rounded-xl text-sm transition"
              >
                {isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateTransaction;