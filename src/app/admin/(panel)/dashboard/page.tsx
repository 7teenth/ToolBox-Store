import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown } from "lucide-react";


export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title="Аналітика"/>
      <div className="grid grid-cols-4 gap-4">
        {
          new Array(4).fill(0).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <CardDescription>New Customers</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  1,234
                </CardTitle>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  Down 20% this period <TrendingDown className="size-4" />
                </div>
                <div className="text-muted-foreground">
                  Acquisition needs attention
                </div>
              </CardFooter>
            </Card>
          ))
        }
      </div>
    </div>
  );
}