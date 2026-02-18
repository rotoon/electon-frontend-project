import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map, Users, Vote } from "lucide-react";

export default function AdminDashboardLoading() {
  const statItems = [
    { label: "ผู้ลงทะเบียนทั้งหมด", icon: Users, desc: "% จากเมื่อวาน" },
    { label: "จำนวนเขตเลือกตั้ง", icon: Map, desc: "ครอบคลุมทั่วประเทศ" },
    { label: "กกต. ในระบบ", icon: Vote, desc: "พร้อมปฏิบัติหน้าที่" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-900">Dashboard</h2>
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
