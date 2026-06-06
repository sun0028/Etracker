import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { registerAPI } from "../../services/users/userService";
import AlertMessage from "../Alert/AlertMessage";

const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
});

const RegistrationForm = () => {
  const navigate = useNavigate();

  const { mutateAsync, isPending, isError, error, isSuccess } = useMutation({
    mutationFn: registerAPI,
    mutationKey: ["register"],
  });

  const formik = useFormik({
    initialValues: { username: "", email: "", password: "", confirmPassword: "" },
    validationSchema,
    onSubmit: (values) => {
      mutateAsync(values).catch((e) => console.log(e));
    },
  });

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => navigate("/login"), 1500);
    }
  }, [isSuccess]);

  const inputClass = "pl-10 pr-4 py-3 w-full rounded-xl glass-dark border border-white/5 text-[#f5f0e8] placeholder-[#4a5568] focus:border-[#e8dcc8] focus:outline-none text-sm";

  return (
    <div className="min-h-screen  flex items-center justify-center px-4 py-10">
      <form
        onSubmit={formik.handleSubmit}
        className="w-full max-w-md glass p-8 rounded-2xl shadow-xl space-y-5 border border-white/5"
      >
        <div className="text-center mb-2">
          <h2 className="text-2xl font-bold text-[#f5f0e8]">Create Account</h2>
          <p className="text-[#a89f91] text-sm mt-1">Start tracking your finances today</p>
        </div>

        {isPending && <AlertMessage type="loading" message="Creating your account..." />}
        {isError && <AlertMessage type="error" message={error?.response?.data?.message || "Registration failed"} />}
        {isSuccess && <AlertMessage type="success" message="Account created! Redirecting..." />}

        <div className="relative">
          <FaUser className="absolute top-3.5 left-3 text-[#a89f91]" />
          <input
            id="username" type="text"
            {...formik.getFieldProps("username")}
            placeholder="Username"
            className={inputClass}
          />
          {formik.touched.username && formik.errors.username && (
            <span className="text-xs text-red-400 mt-1 block">{formik.errors.username}</span>
          )}
        </div>

        <div className="relative">
          <FaEnvelope className="absolute top-3.5 left-3 text-[#a89f91]" />
          <input
            id="email" type="email"
            {...formik.getFieldProps("email")}
            placeholder="Email"
            className={inputClass}
          />
          {formik.touched.email && formik.errors.email && (
            <span className="text-xs text-red-400 mt-1 block">{formik.errors.email}</span>
          )}
        </div>

        <div className="relative">
          <FaLock className="absolute top-3.5 left-3 text-[#a89f91]" />
          <input
            id="password" type="password"
            {...formik.getFieldProps("password")}
            placeholder="Password"
            className={inputClass}
          />
          {formik.touched.password && formik.errors.password && (
            <span className="text-xs text-red-400 mt-1 block">{formik.errors.password}</span>
          )}
        </div>

        <div className="relative">
          <FaLock className="absolute top-3.5 left-3 text-[#a89f91]" />
          <input
            id="confirmPassword" type="password"
            {...formik.getFieldProps("confirmPassword")}
            placeholder="Confirm Password"
            className={inputClass}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <span className="text-xs text-red-400 mt-1 block">{formik.errors.confirmPassword}</span>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-[#e8dcc8] hover:bg-[#d4c9b0] text-[#0f1b2d] font-bold py-3 px-4 rounded-xl transition duration-150"
        >
          {isPending ? "Creating Account..." : "Create Account"}
        </button>

        <p className="text-sm text-center text-[#a89f91]">
          Already have an account?{" "}
          <Link to="/login" className="text-[#e8dcc8] hover:underline">Sign in</Link>
        </p>
      </form>
    </div>
  );
};

export default RegistrationForm;