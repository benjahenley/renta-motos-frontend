'use client';

import { useState, useEffect } from 'react';
import TransactionActivity from '@/components/dashboard/transaction-activity';
import DashboardHero from '@/components/dashboard/dashboard-hero';
import StatCard from '@/components/ui/cards/stat-card';
import { getDashboardData } from '@/helpers/getDashboardData';

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    totalPrice: 0,
    avgOrderPrice: 0,
  });

  useEffect(() => {
    async function fetchData() {
      const data = await getDashboardData();
      setDashboardData(data);
    }
    fetchData();
  }, []);

  const statCards = [
    {
      id: 'cardone',
      title: 'New Orders',
      order: dashboardData.totalOrders,
      last: 178, // Este dato puede ser actualizado con información real
      price: null,
    },
    {
      id: 'cardtwo',
      title: 'New Orders Revenue',
      order: null,
      last: 12, // Este dato puede ser actualizado con información real
      price: dashboardData.totalPrice,
    },
    {
      id: 'cardthree',
      title: 'Avg. Order Revenue',
      order: null,
      last: 12, // Este dato puede ser actualizado con información real
      price: dashboardData.avgOrderPrice,
    },
  ];

  return (
    <div className="container-fluid mb-12 lg:mb-16">
      <DashboardHero />
      <div className="mb-12 mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:mb-16 lg:mt-12 2xl:mt-16 2xl:gap-6">
        {statCards.map((item, index) => (
          <StatCard key={`pricing-card-${index}`} data={item} />
        ))}
      </div>
      <div>
        <TransactionActivity />
      </div>
    </div>
  );
}
