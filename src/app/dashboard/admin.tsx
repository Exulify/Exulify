"use client";

import { Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Sidebar from '../components/Sidebar';

export default function SiswaDashboard() {
  return (
    <div className="flex h-screen bg-gray-50">

        <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Halo, Riza!</h1>
              <p className="text-gray-600 text-sm mt-1">Welcome back to your student dashboard</p>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Student Dashboard</h2>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Kehadiran</p>
                  <p className="text-4xl font-bold text-gray-900 mt-2">0%</p>
                </div>
                <CheckCircle className="w-12 h-12 text-blue-400 opacity-20" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Ekstrakurikuler Di ikuti</p>
                  <p className="text-4xl font-bold text-gray-900 mt-2">0</p>
                </div>
                <Calendar className="w-12 h-12 text-blue-400 opacity-20" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Jumlah Aktivitas Bulan Ini</p>
                  <p className="text-4xl font-bold text-gray-900 mt-2">0</p>
                </div>
                <AlertCircle className="w-12 h-12 text-blue-400 opacity-20" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="col-span-2 bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Weekly Activity</h3>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { day: 'Sat', value: 0 },
                    { day: 'Sun', value: 0 },
                    { day: 'Mon', value: 0 },
                    { day: 'Tue', value: 0 },
                    { day: 'Wed', value: 0 },
                    { day: 'Thu', value: 0 },
                    { day: 'Fri', value: 0 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="day" stroke="#555" />
                  <YAxis stroke="#555" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#5B9BD5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm flex flex-col">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Daily Activity</h3>
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="text-6xl mb-4">💧</div>
                <p className="text-blue-500 font-medium text-sm">You aren't record any</p>
                <p className="text-blue-500 font-medium text-sm">Presence this day</p>
              </div>
              <button className="w-full py-3 bg-gradient-to-r from-[#5B9BD5] to-[#2D5F7F] text-white rounded-xl font-medium hover:shadow-lg transition-shadow text-sm">
                Record Presence
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Presence Records</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <div>
                    <p className="font-medium text-gray-900">Presence</p>
                    <p className="text-sm text-gray-600">21 January 2021</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-600">+1</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <div>
                    <p className="font-medium text-gray-900">Presence</p>
                    <p className="text-sm text-gray-600">21 January 2021</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-600">+1</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <div>
                    <p className="font-medium text-gray-900">Presence</p>
                    <p className="text-sm text-gray-600">21 January 2021</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-600">+1</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
