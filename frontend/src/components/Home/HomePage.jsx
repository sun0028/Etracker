import React from "react";
import { Link } from "react-router-dom";
import { FaMoneyBillWave, FaFilter, FaChartPie, FaShieldAlt, FaTags, FaRegCalendarAlt } from "react-icons/fa";

const HomePage = () => {
  return (
    <div className="glass-dark text-[#f5f0e8]">
    
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-[#e8dcc8]/20 text-[#e8dcc8] text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-widest uppercase">
            Personal Finance
          </span>
          <h1 className="text-5xl font-bold leading-tight mb-6 text-[#f5f0e8]">
            Take Control of Your <span className="text-[#e8dcc8]">Finances</span>
          </h1>
          <p className="text-lg text-[#a89f91] max-w-2xl mx-auto mb-10">
            Track income and expenses, manage custom categories, and visualise your spending — all in one place.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/register" className="px-8 py-3 bg-[#e8dcc8] hover:bg-[#d4a55a] text-[#0f1b2d] font-semibold rounded-xl transition duration-200">
              Get Started !
            </Link>
           
          </div>
        </div>
      </section>

    
      <section className="py-20 px-6 bg-[#0a1220]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#f5f0e8] mb-2">Everything You Need</h2>
          <p className="text-center text-[#a89f91] mb-12">Built for people who want clarity over their money.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <FaMoneyBillWave className="text-2xl text-[#e8dcc8]" />, title: "Income & Expense Tracking", desc: "Log every transaction with amount, date, category, and description in seconds." },
              { icon: <FaTags className="text-2xl text-[#e8dcc8]" />, title: "Custom Categories", desc: "Create your own income and expense categories. Rename or delete them anytime." },
              { icon: <FaFilter className="text-2xl text-[#e8dcc8]" />, title: "Smart Filtering", desc: "Filter transactions by date range, type, or category to find exactly what you need." },
              { icon: <FaChartPie className="text-2xl text-[#e8dcc8]" />, title: "Visual Reports", desc: "See your income vs expense breakdown in a clear doughnut chart on your dashboard." },
              { icon: <FaShieldAlt className="text-2xl text-[#e8dcc8]" />, title: "Secure & Private", desc: "Your data is protected with JWT authentication. Only you can see your transactions." },
              { icon: <FaRegCalendarAlt className="text-2xl text-[#e8dcc8]" />, title: "Date-Based Insights", desc: "View your financial history over any time period with date range filters." },
            ].map((f, i) => (
              <div key={i} className="glass p-6 rounded-2xl border border-white/5 hover:border-[#e8dcc8]/30 transition duration-200">
                <div className="mb-3">{f.icon}</div>
                <h3 className="font-semibold text-[#f5f0e8] mb-2">{f.title}</h3>
                <p className="text-sm text-[#a89f91] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#f5f0e8] mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { step: "01", title: "Create an Account", desc: "Sign up in under a minute. No credit card required." },
              { step: "02", title: "Add Your Transactions", desc: "Log income and expenses with custom categories and dates." },
              { step: "03", title: "Track & Analyse", desc: "Use the dashboard chart and filters to understand your finances." },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-5xl font-bold text-[#e8dcc8]/20 mb-2">{item.step}</span>
                <h3 className="font-semibold text-[#f5f0e8] mb-2">{item.title}</h3>
                <p className="text-sm text-[#a89f91]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;