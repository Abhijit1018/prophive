"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type Props = { data: { month: string; revenue: number }[] };

export default function RevenueChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12, fill: "#9ca3af" }}
          axisLine={{ stroke: "rgba(128,128,128,0.1)" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#9ca3af" }}
          tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          formatter={(v) => [`₹${Number(v).toLocaleString("en-IN")}`, "Revenue"]}
          contentStyle={{
            background: "rgba(17,17,17,0.95)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            color: "#fff",
            fontSize: "13px",
            padding: "10px 14px",
          }}
          cursor={{ fill: "rgba(249,115,22,0.05)" }}
        />
        <Bar
          dataKey="revenue"
          fill="url(#barGradient)"
          radius={[6, 6, 0, 0]}
          maxBarSize={48}
        />
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  );
}
