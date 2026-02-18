import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flag, Users, Vote } from "lucide-react";

export default function ECDashboardLoading() {
  const statItems = [
    { label: "พรรคการเมือง", icon: Flag, desc: "พรรคในระบบ" },
    { label: "ผู้สมัครทั้งหมด", icon: Users, desc: "คนทั่วประเทศ" },
    { label: "ผู้ใช้สิทธิแล้ว", icon: Vote, desc: "% ของผู้มีสิทธิ" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-900">EC Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {statItems.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">
                  {stat.label}
                </CardTitle>
                <Icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-1" />
                <p className="text-xs text-slate-400">{stat.desc}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
