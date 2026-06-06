import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaWallet, FaTag } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { addCategoryAPI } from "../../services/category/categoryService";
import AlertMessage from "../Alert/AlertMessage";

const inputClass = "w-full py-3 px-4 rounded-xl glass-dark border border-white/5 text-[#f5f0e8] placeholder-[#4a5568] focus:border-[#e8dcc8] focus:outline-none text-sm";
const labelClass = "block text-[#a89f91] text-xs mb-1.5 font-medium uppercase tracking-wider";

const validationSchema = Yup.object({
  name: Yup.string().required("Category name is required"),
  type: Yup.string().required("Category type is required").oneOf(["income", "expense"]),
});

const AddCategory = () => {
  const navigate = useNavigate();

  const { mutateAsync, isPending, isError, error, isSuccess } = useMutation({
    mutationFn: addCategoryAPI,
    mutationKey: ["add-category"],
  });

  const formik = useFormik({
    initialValues: { type: "", name: "" },
    validationSchema,
    onSubmit: (values) => {
      mutateAsync(values)
        .then(() => navigate("/categories"))
        .catch((e) => console.log(e));
    },
  });

  return (
    <div className="min-h-screen  px-6 py-10">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#f5f0e8]">Add Category</h1>
          <p className="text-[#a89f91] text-sm mt-1">Create a new income or expense category</p>
        </div>

        <div className="glass rounded-2xl p-6 border border-white/5">
          {isError && <AlertMessage type="error" message={error?.response?.data?.message || "Something went wrong"} />}
          {isSuccess && <AlertMessage type="success" message="Category added! Redirecting..." />}

          <form onSubmit={formik.handleSubmit} className="space-y-5 mt-2">
            <div>
              <label className={labelClass}>
                <FaWallet className="inline mr-1.5 text-[#e8dcc8]" />
                Type
              </label>
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
              <label className={labelClass}>
                <FaTag className="inline mr-1.5 text-[#e8dcc8]" />
                Name
              </label>
              <input
                type="text"
                {...formik.getFieldProps("name")}
                placeholder="e.g. Groceries, Salary..."
                className={inputClass}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-400 text-xs mt-1">{formik.errors.name}</p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/categories")}
                className="flex-1 py-3 rounded-xl border border-white/5 text-[#a89f91] hover:text-[#f5f0e8] text-sm font-medium transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 py-3 bg-[#e8dcc8] hover:bg-[#d4c9b0] text-[#0f1b2d] font-semibold rounded-xl text-sm transition"
              >
                {isPending ? "Adding..." : "Add Category"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;