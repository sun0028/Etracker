import React, { useEffect } from "react";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { loginAPI } from "../../services/users/userService";
import AlertMessage from "../Alert/AlertMessage";
import { loginAction } from "../../redux/slice/authSlice";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(5, "Password must be at least 5 characters")
    .required("Password is required"),
});

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { mutateAsync, isPending, isError, error, isSuccess } = useMutation({
    mutationFn: loginAPI,
    mutationKey: ["login"],
  });

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: (values) => {
      mutateAsync(values)
        .then((data) => {
          dispatch(loginAction(data));
          localStorage.setItem("userInfo", JSON.stringify(data));
        })
        .catch((e) => console.log(e));
    },
  });

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => navigate("/dashboard"), 1500);
    }
  }, [isSuccess]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={formik.handleSubmit}
        className="w-full max-w-md glass p-8 rounded-2xl shadow-xl space-y-5 border border-white/5"
      >
        <div className="text-center mb-2">
          <h2 className="text-2xl font-bold text-[#f5f0e8]">Welcome Back</h2>
          <p className="text-[#a89f91] text-sm mt-1">Sign in to your account</p>
        </div>

        {isPending && <AlertMessage type="loading" message="Logging you in..." />}
        {isError && <AlertMessage type="error" message={error?.response?.data?.message || "Login failed"} />}
        {isSuccess && <AlertMessage type="success" message="Login successful!" />}

        <div className="relative">
          <FaEnvelope className="absolute top-3.5 left-3 text-[#a89f91]" />
          <input
            id="email"
            type="email"
            {...formik.getFieldProps("email")}
            placeholder="Email"
            className="pl-10 pr-4 py-3 w-full rounded-xl glass-dark border border-white/5 text-[#f5f0e8] placeholder-[#4a5568] focus:border-[#e8dcc8] focus:outline-none text-sm"
          />
          {formik.touched.email && formik.errors.email && (
            <span className="text-xs text-red-400 mt-1 block">{formik.errors.email}</span>
          )}
        </div>

        <div className="relative">
          <FaLock className="absolute top-3.5 left-3 text-[#a89f91]" />
          <input
            id="password"
            type="password"
            {...formik.getFieldProps("password")}
            placeholder="Password"
            className="pl-10 pr-4 py-3 w-full rounded-xl glass-dark border border-white/5 text-[#f5f0e8] placeholder-[#4a5568] focus:border-[#e8dcc8] focus:outline-none text-sm"
          />
          {formik.touched.password && formik.errors.password && (
            <span className="text-xs text-red-400 mt-1 block">{formik.errors.password}</span>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-[#e8dcc8] hover:bg-[#d4c9b0] text-[#0f1b2d] font-bold py-3 px-4 rounded-xl transition duration-150"
        >
          {isPending ? "Signing in..." : "Sign In"}
        </button>

        <p className="text-sm text-center text-[#a89f91]">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#e8dcc8] hover:underline">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;