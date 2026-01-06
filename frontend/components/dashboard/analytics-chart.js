"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Cell, PieChart, Pie } from "recharts"

export function AnalyticsChart({ activityData, statusData }) {

  // 🔥 1. Define Default/Mock Data (Used for Home Page Preview)
  const defaultActivity = [
    { name: "Mon", apps: 4 },
    { name: "Tue", apps: 7 },
    { name: "Wed", apps: 3 },
    { name: "Thu", apps: 9 },
    { name: "Fri", apps: 5 },
    { name: "Sat", apps: 2 },
    { name: "Sun", apps: 1 },
  ];

  const defaultStatus = [
    { name: "Applied", value: 15, color: "#3b82f6" },   // Blue
    { name: "Interview", value: 5, color: "#a855f7" },  // Purple
    { name: "Offer", value: 2, color: "#10b981" },      // Green
    { name: "Rejected", value: 3, color: "#ef4444" },   // Red
  ];

  // 🔥 2. Use Real Data if available, otherwise use Defaults
  const finalActivity = activityData && activityData.length > 0 ? activityData : defaultActivity;
  const finalStatus = statusData && statusData.length > 0 ? statusData : defaultStatus;

  // Tooltip Style
  const tooltipStyle = {
    backgroundColor: '#ffffff', 
    borderColor: '#e2e8f0',
    color: '#000000',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    outline: 'none'
  };

  // Calculate Total for the Center of Donut (Using Safe Data)
  const totalApps = finalStatus.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-7">
      
      {/* 1. Bar Chart (Weekly Activity) */}
     <Card className="col-span-4 border-border/50">
        <CardHeader>
          <CardTitle>Application Activity</CardTitle>
          <CardDescription>Applications sent over the last 7 days</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={finalActivity}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                <XAxis 
                  dataKey="name" 
                  stroke="#888888" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#888888" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `${value}`} 
                />
                <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    itemStyle={{color:'#000000'}}
                    
                />
                <Bar dataKey="apps" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 2. Donut Chart (Status Breakdown) */}
      <Card className="col-span-1 md:col-span-3 border-border/50">
        <CardHeader>
          <CardTitle>Status Overview</CardTitle>
          <CardDescription>Current pipeline distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={finalStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {finalStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip 
                    contentStyle={tooltipStyle}
                    itemStyle={{ color: '#000000' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <span className="text-3xl font-bold block text-foreground">{totalApps}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Total</span>
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs text-muted-foreground">
            {finalStatus.map((item) => (
                <div key={item.name} className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.name}
                </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}