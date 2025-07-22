import React, { useState, useEffect, useMemo, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import analyticsService from '../services/analyticsService';
import { Pie, Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const data = await analyticsService.getAnalytics();
      setAnalytics(data);
    };
    fetchAnalytics();
  }, []);

  const categoryData = useMemo(() => {
    if (!analytics) return null;
    return {
      labels: analytics.categoryBreakdown.map((c) => c.category),
      datasets: [
        {
          data: analytics.categoryBreakdown.map((c) => c.total),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        },
      ],
    };
  }, [analytics]);

  const monthlyData = useMemo(() => {
    if (!analytics) return null;
    return {
      labels: analytics.monthlySpending.map((m) => m.month),
      datasets: [
        {
          label: 'Monthly Spending',
          data: analytics.monthlySpending.map((m) => m.total),
          borderColor: '#FF6384',
          fill: false,
        },
      ],
    };
  }, [analytics]);

    const incomeExpenseData = useMemo(() => {
        if (!analytics) return null;
        const income = analytics.incomeVsExpense.find(i => i.type === 'income')?.total || 0;
        const expense = analytics.incomeVsExpense.find(i => i.type === 'expense')?.total || 0;
        return {
            labels: ['Income', 'Expense'],
            datasets: [{
                label: 'Income vs Expense',
                data: [income, expense],
                backgroundColor: ['#36A2EB', '#FF6384'],
            }]
        }
    }, [analytics]);


  if (!analytics) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div style={{ width: '30%' }}>
          <h3>Category Breakdown</h3>
          {categoryData && <Pie data={categoryData} />}
        </div>
        <div style={{ width: '30%' }}>
            <h3>Income vs Expense</h3>
            {incomeExpenseData && <Bar data={incomeExpenseData} />}
        </div>
        <div style={{ width: '30%' }}>
          <h3>Monthly Spending</h3>
          {monthlyData && <Line data={monthlyData} />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 