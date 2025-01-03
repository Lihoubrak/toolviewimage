import React from 'react';
import LayoutGlobal from '../layout/LayoutGlobal';

// Sample data for KPIs
const kpiData = [
  { id: 1, name: 'Sales Growth', target: '10%', actual: '12%', status: 'On Track' },
  { id: 2, name: 'Customer Satisfaction', target: '85%', actual: '80%', status: 'Needs Improvement' },
  { id: 3, name: 'Website Traffic', target: '50K visits', actual: '55K visits', status: 'On Track' },
  { id: 4, name: 'Product Defects', target: '5%', actual: '3%', status: 'Excellent' },
];

const KpiPage = () => {
  return (
    <LayoutGlobal>
      {/* Tạo phần tiêu đề trang */}
      <div className="flex items-center justify-center mb-8 gap-2">
        <h1 className="text-4xl font-extrabold text-center text-blue-600">
          KPI Dashboard
        </h1>
      </div>

      {/* Nội dung của trang KPI */}
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="bg-white shadow-lg p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">KPI Overview</h2>
          <p className="text-gray-600 mb-6">Here you can track your KPIs and performance indicators.</p>

          {/* KPI Table */}
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="py-2 px-4 border-b">KPI</th>
                <th className="py-2 px-4 border-b">Target</th>
                <th className="py-2 px-4 border-b">Actual</th>
                <th className="py-2 px-4 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {kpiData.map((kpi) => (
                <tr key={kpi.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{kpi.name}</td>
                  <td className="py-2 px-4">{kpi.target}</td>
                  <td className="py-2 px-4">{kpi.actual}</td>
                  <td className="py-2 px-4">
                    <span
                      className={`${
                        kpi.status === 'On Track'
                          ? 'text-green-600'
                          : kpi.status === 'Needs Improvement'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    >
                      {kpi.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </LayoutGlobal>
  );
};

export default KpiPage;
