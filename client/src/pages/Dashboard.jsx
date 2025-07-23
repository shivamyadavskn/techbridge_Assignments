
import { useState, useEffect, useMemo, useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"
import analyticsService from "../services/analyticsService"
import { Pie, Line, Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
} from "chart.js"

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement)

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useContext(AuthContext)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await analyticsService.getAnalytics()
        setAnalytics(data)
      } catch (error) {
        console.error("Failed to fetch analytics:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  const categoryData = useMemo(() => {
    if (!analytics) return null
    return {
      labels: analytics.categoryBreakdown.map((c) => c.category),
      datasets: [
        {
          data: analytics.categoryBreakdown.map((c) => c.total),
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#FF6384", "#C9CBCF"],
          borderWidth: 0,
          hoverOffset: 4,
        },
      ],
    }
  }, [analytics])

  const monthlyData = useMemo(() => {
    if (!analytics) return null
    return {
      labels: analytics.monthlySpending.map((m) => m.month),
      datasets: [
        {
          label: "Monthly Spending",
          data: analytics.monthlySpending.map((m) => m.total),
          borderColor: "#667eea",
          backgroundColor: "rgba(102, 126, 234, 0.1)",
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#667eea",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 6,
        },
      ],
    }
  }, [analytics])

  const incomeExpenseData = useMemo(() => {
    if (!analytics) return null
    const income = analytics.incomeVsExpense.find((i) => i.type === "income")?.total || 0
    const expense = analytics.incomeVsExpense.find((i) => i.type === "expense")?.total || 0
    return {
      labels: ["Income", "Expense"],
      datasets: [
        {
          label: "Amount ($)",
          data: [income, expense],
          backgroundColor: ["#10B981", "#EF4444"],
          borderWidth: 0,
          borderRadius: 8,
        },
      ],
    }
  }, [analytics])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
    },
  }

  if (loading) {
    return <div className="loading">Loading your financial dashboard...</div>
  }

  if (!analytics) {
    return (
      <div className="card">
        <h2>📊 Dashboard</h2>
        <p>Unable to load analytics data. Please try again later.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="card">
        <h2>📊 Financial Dashboard</h2>
        <p>
          Welcome back, <strong>{user?.username || "User"}</strong>! Here's your financial overview.
        </p>
      </div>

      <div className="dashboard-grid">
        <div className="chart-container">
          <h3 className="chart-title">💰 Category Breakdown</h3>
          <div style={{ height: "300px" }}>{categoryData && <Pie data={categoryData} options={chartOptions} />}</div>
        </div>

        <div className="chart-container">
          <h3 className="chart-title">📈 Income vs Expense</h3>
          <div style={{ height: "300px" }}>
            {incomeExpenseData && <Bar data={incomeExpenseData} options={chartOptions} />}
          </div>
        </div>

        <div className="chart-container">
          <h3 className="chart-title">📅 Monthly Spending Trend</h3>
          <div style={{ height: "300px" }}>{monthlyData && <Line data={monthlyData} options={chartOptions} />}</div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
