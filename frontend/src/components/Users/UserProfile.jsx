import React from "react";
import { FaUserCircle, FaEnvelope, FaLock, FaShieldAlt } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateProfileAPI, changePasswordAPI } from "../../services/users/userService";
import { logoutAction } from "../../redux/slice/authSlice";
import AlertMessage from "../Alert/AlertMessage";

const inputClass = "w-full py-3 px-4 rounded-xl glass-dark border border-white/5 text-[#f5f0e8] placeholder-[#4a5568] focus:border-[#e8dcc8] focus:outline-none text-sm";
const labelClass = "block text-[#a89f91] text-xs mb-1.5 font-medium uppercase tracking-wider";

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state?.auth?.user);

  // Update profile mutation
  const {
    mutateAsync: updateProfile,
    isPending: isUpdating,
    isError: isUpdateErr,
    error: updateErr,
    isSuccess: isUpdateSuccess,
  } = useMutation({
    mutationFn: updateProfileAPI,
    mutationKey: ["update-profile"],
  });

  // Change password mutation
  const {
    mutateAsync: changePassword,
    isPending: isChanging,
    isError: isChangeErr,
    error: changeErr,
    isSuccess: isChangeSuccess,
  } = useMutation({
    mutationFn: changePasswordAPI,
    mutationKey: ["change-password"],
    onSuccess: () => {
      setTimeout(() => {
        dispatch(logoutAction());
        localStorage.removeItem("userInfo");
        navigate("/login");
      }, 1500);
    },
  });

  const profileFormik = useFormik({
    initialValues: { username: user?.username || "", email: user?.email || "" },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
    }),
    onSubmit: (values) => updateProfile(values).catch(console.error),
  });

  const passwordFormik = useFormik({
    initialValues: { password: "" },
    validationSchema: Yup.object({
      password: Yup.string().min(5, "Minimum 5 characters").required("Required"),
    }),
    onSubmit: (values) => changePassword(values.password).catch(console.error),
  });

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#f5f0e8]">Profile Settings</h1>
          <p className="text-[#a89f91] text-sm mt-1">Manage your account details</p>
        </div>

        {/* Avatar + name card */}
        <div className="glass rounded-2xl p-6 border border-white/5 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
            <FaUserCircle className="text-[#e8dcc8] text-4xl" />
          </div>
          <div>
            <p className="text-[#f5f0e8] font-semibold text-lg">{user?.username || "User"}</p>
            <p className="text-[#a89f91] text-sm">{user?.email || ""}</p>
          </div>
        </div>

        {/* Update Profile */}
        <div className="glass rounded-2xl p-6 border border-white/5">
          <div className="flex items-center gap-2 mb-6">
            <FaEnvelope className="text-[#e8dcc8]" />
            <h2 className="text-[#f5f0e8] font-semibold">Update Profile</h2>
          </div>

          {isUpdating && <AlertMessage type="loading" message="Updating profile..." />}
          {isUpdateErr && <AlertMessage type="error" message={updateErr?.response?.data?.message || "Update failed"} />}
          {isUpdateSuccess && <AlertMessage type="success" message="Profile updated successfully!" />}

          <form onSubmit={profileFormik.handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className={labelClass}>Username</label>
              <input
                type="text"
                {...profileFormik.getFieldProps("username")}
                placeholder="Your username"
                className={inputClass}
              />
              {profileFormik.touched.username && profileFormik.errors.username && (
                <p className="text-red-400 text-xs mt-1">{profileFormik.errors.username}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                {...profileFormik.getFieldProps("email")}
                placeholder="Your email"
                className={inputClass}
              />
              {profileFormik.touched.email && profileFormik.errors.email && (
                <p className="text-red-400 text-xs mt-1">{profileFormik.errors.email}</p>
              )}
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isUpdating}
                className="px-6 py-2.5 bg-[#e8dcc8] hover:bg-[#d4c9b0] text-[#0f1b2d] font-semibold rounded-xl text-sm transition duration-150"
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password */}
        <div className="glass rounded-2xl p-6 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <FaShieldAlt className="text-[#e8dcc8]" />
            <h2 className="text-[#f5f0e8] font-semibold">Change Password</h2>
          </div>
          <p className="text-[#a89f91] text-xs mb-6">You will be signed out after changing your password.</p>

          {isChanging && <AlertMessage type="loading" message="Updating password..." />}
          {isChangeErr && <AlertMessage type="error" message={changeErr?.response?.data?.message || "Failed to update"} />}
          {isChangeSuccess && <AlertMessage type="success" message="Password changed! Signing you out..." />}

          <form onSubmit={passwordFormik.handleSubmit} className="space-y-4">
            <div>
              <label className={labelClass}>New Password</label>
              <div className="relative">
                <FaLock className="absolute top-3.5 left-3 text-[#a89f91]" />
                <input
                  type="password"
                  {...passwordFormik.getFieldProps("password")}
                  placeholder="Enter new password"
                  className="pl-10 pr-4 py-3 w-full rounded-xl glass-dark border border-white/5 text-[#f5f0e8] placeholder-[#4a5568] focus:border-[#e8dcc8] focus:outline-none text-sm"
                />
              </div>
              {passwordFormik.touched.password && passwordFormik.errors.password && (
                <p className="text-red-400 text-xs mt-1">{passwordFormik.errors.password}</p>
              )}
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isChanging}
                className="px-6 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold rounded-xl text-sm border border-red-500/20 transition duration-150"
              >
                {isChanging ? "Updating..." : "Change Password"}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default UserProfile;