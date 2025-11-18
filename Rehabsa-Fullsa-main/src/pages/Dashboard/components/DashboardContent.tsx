import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useDirection } from "@/hooks/useDirection";

const periods = [
  { id: "day", label: "يوم" },
  { id: "week", label: "أسبوع" },
  { id: "month", label: "شهر" },
  { id: "year", label: "سنة" },
  { id: "all", label: "كل الوقت" },
];

const lineData = [
  { day: "5", customers: 18 },
  { day: "6", customers: 22 },
  { day: "7", customers: 28 },
  { day: "8", customers: 12 },
  { day: "9", customers: 26 },
  { day: "10", customers: 24 },
  { day: "11", customers: 0 },
  { day: "12", customers: 4 },
  { day: "13", customers: 6 },
  { day: "14", customers: 4 },
  { day: "15", customers: 4 },
  { day: "16", customers: 3 },
  { day: "17", customers: 0 },
  { day: "18", customers: 0 },
  { day: "19", customers: 0 },
];

export function DashboardContent() {
  const { isRTL } = useDirection();
  const [activePeriod, setActivePeriod] = React.useState("month");
  const [startDate, setStartDate] = React.useState("2025-11-01");
  const [endDate, setEndDate] = React.useState("2025-11-07");

  return (
    <div className="px-10 py-6 w-full" dir={isRTL ? "rtl" : "rtl"}>
      <div className="w-full flex items-center justify-between">
        <h1 className="mt-5 mb-6 text-[24px] font-[500]">لوحة التحكم</h1>
        <div className="relative">
          <div className="flex items-center gap-4">
            {periods.map((period) => (
              <button
                key={period.id}
                type="button"
                onClick={() => setActivePeriod(period.id)}
                className={`ant-btn ant-btn-default ant-btn-color-default ant-btn-variant-outlined text-sm px-4 py-2 rounded-md border transition-colors ${
                  activePeriod === period.id
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                }`}
              >
                <span>{period.label}</span>
              </button>
            ))}
            <div className="w-[300px]">
              <div className="flex items-center justify-between gap-2 border border-gray-300 rounded-md px-3 py-2 bg-white">
                <input
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  className="w-1/2 border-none focus:outline-none text-sm text-gray-700 bg-transparent"
                />
                <span className="text-gray-500">إلى</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                  className="w-1/2 border-none focus:outline-none text-sm text-gray-700 bg-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Card className="border-[1px] border-[#D1D1D1D9] rounded-[6px] mb-10 shadow-sm">
        <CardHeader className="flex justify-between py-4 px-6">
          <div>
            <h2 className="text-[1.1rem] font-medium">عملاء جدد</h2>
            <h2 className="text-[0.95rem] text-right font-medium mt-1">اليوم, 07 November 2025</h2>
          </div>
        </CardHeader>
        <CardContent className="mt-4 mx-6">
          <div className="flex gap-1">
            <div className="relative w-full ml-4 flex flex-col gap-1">
              <h6 className="flex justify-between items-center text-[13px] font-[500]">
                إجمالي العملاء
                <span className="text-[16px] font-[500]">32</span>
              </h6>
              <h1 className="text-[32px] font-[600]">32</h1>
            </div>
          </div>
          <div className="mt-4" style={{ minHeight: "215px" }}>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={lineData}>
                <CartesianGrid stroke="#e0e0e0" strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke="#373d3f" tick={{ fontSize: 12 }} tickLine={false} axisLine={{ stroke: "#e0e0e0" }} />
                <YAxis stroke="#373d3f" tick={{ fontSize: 12 }} tickLine={false} axisLine={{ stroke: "#e0e0e0" }} />
                <Tooltip
                  contentStyle={{ fontSize: 12 }}
                  labelStyle={{ fontSize: 12 }}
                  formatter={(value: number) => [`${value}`, "Customers"]}
                  labelFormatter={(label) => `${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="customers"
                  stroke="rgba(42,151,252,0.85)"
                  strokeWidth={3}
                  dot={{ r: 3, strokeWidth: 2, fill: "#2a97fc" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-5 gap-4 max-md:grid-cols-2">
        <Card className="h-[90px] border-[1px] border-[#D1D1D1D9] rounded-[6px] shadow-sm">
          <CardContent className="p-3 flex flex-col gap-2 justify-between h-full">
            <h1 className="text-[0.9rem] font-medium text-center">مجموع الاختام المكتسبة</h1>
            <h1 className="text-lg font-semibold text-center flex items-center gap-2 justify-center">32</h1>
          </CardContent>
        </Card>
        <Card className="h-[90px] border-[1px] border-[#D1D1D1D9] rounded-[6px] shadow-sm">
          <CardContent className="p-3 flex flex-col gap-2 justify-between h-full">
            <h1 className="text-[0.9rem] font-medium text-center">مجموع الهدايا المكتسبة</h1>
            <h1 className="text-lg font-semibold text-center flex items-center gap-2 justify-center">1</h1>
          </CardContent>
        </Card>
        <Card className="h-[90px] border-[1px] border-[#D1D1D1D9] rounded-[6px] shadow-sm">
          <CardContent className="p-3 flex flex-col gap-2 justify-between h-full">
            <h1 className="text-[0.9rem] font-medium text-center">مجموع المكافآت المستردة</h1>
            <h1 className="text-lg font-semibold text-center flex items-center gap-2 justify-center">0</h1>
          </CardContent>
        </Card>
        <Card className="h-[90px] border-[1px] border-[#D1D1D1D9] rounded-[6px] shadow-sm">
          <CardContent className="p-3 flex flex-col gap-2 justify-between h-full">
            <h1 className="text-[0.9rem] font-medium text-center">مجموع الكاش باك المكتسب</h1>
            <h1 className="text-lg font-semibold text-center flex items-center gap-2 justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-saudi-riyal"
                aria-hidden="true"
              >
                <path d="m20 19.5-5.5 1.2" />
                <path d="M14.5 4v11.22a1 1 0 0 0 1.242.97L20 15.2" />
                <path d="m2.978 19.351 5.549-1.363A2 2 0 0 0 10 16V2" />
                <path d="M20 10 4 13.5" />
              </svg>
              0
            </h1>
          </CardContent>
        </Card>
        <Card className="h-[90px] border-[1px] border-[#D1D1D1D9] rounded-[6px] shadow-sm">
          <CardContent className="p-3 flex flex-col gap-2 justify-between h-full">
            <h1 className="text-[0.9rem] font-medium text-center">مجموع الكاش باك المستخدم</h1>
            <h1 className="text-lg font-semibold text-center flex items-center gap-2 justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-saudi-riyal"
                aria-hidden="true"
              >
                <path d="m20 19.5-5.5 1.2" />
                <path d="M14.5 4v11.22a1 1 0 0 0 1.242.97L20 15.2" />
                <path d="m2.978 19.351 5.549-1.363A2 2 0 0 0 10 16V2" />
                <path d="M20 10 4 13.5" />
              </svg>
              0
            </h1>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-10 gap-4 place-items-center">
        <div className="h-full w-full">
          <Card className="border-[1px] border-[#D1D1D1D9] rounded-[6px] py-4 px-6 shadow-sm">
            <CardHeader className="p-0">
              <h1 className="text-[1.1rem] font-medium">الجنس</h1>
              <h2 className="text-[0.9rem] font-medium mt-1">32 إجمالي العملاء</h2>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full mt-8">
                <h1 className="text-[1rem] font-medium mb-1">ذكر</h1>
                <div className="w-full rounded-md h-6 relative overflow-hidden" style={{ backgroundColor: "#E5E5E5" }}>
                  <div className="h-full absolute left-0 bg-[#2A97FC]" style={{ width: "0%" }} />
                  <h2 className="absolute text-center text-black/80 text-[0.95rem] font-semibold z-20 left-1/2 -translate-x-1/2">0%</h2>
                </div>
              </div>
              <div className="w-full mt-4">
                <h1 className="text-[1rem] font-medium mb-1">أنثى</h1>
                <div className="w-full rounded-md h-6 relative overflow-hidden" style={{ backgroundColor: "#E5E5E5" }}>
                  <div className="h-full absolute left-0 bg-[#F55FCB]" style={{ width: "0%" }} />
                  <h2 className="absolute text-center text-black/80 text-[0.95rem] font-semibold z-20 left-1/2 -translate-x-1/2">0%</h2>
                </div>
              </div>
              <div className="w-full mt-4 pb-4">
                <h1 className="text-[1rem] font-medium mb-1">غير معروف</h1>
                <div className="w-full rounded-md h-6 relative overflow-hidden" style={{ backgroundColor: "#E5E5E5" }}>
                  <div className="h-full absolute left-0 bg-[#949494]" style={{ width: "100%" }} />
                  <h2 className="absolute text-center text-black/80 text-[0.95rem] font-semibold z-20 left-1/2 -translate-x-1/2">100%</h2>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
