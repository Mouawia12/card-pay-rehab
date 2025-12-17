import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";

const logs = [
  {
    id: 1,
    managerName: "Hussain Ali",
    createdAt: "10/22/2025 4:54:40 PM",
    customerName: "مداوي القحطاني",
    event: "تم منح 1 ختم",
    cashbackStamps: 1,
  },
  {
    id: 2,
    managerName: "Hussain Ali",
    createdAt: "10/22/2025 4:54:40 PM",
    customerName: "سعيد",
    event: "تم منح 1 ختم",
    cashbackStamps: 1,
  },
  {
    id: 3,
    managerName: "Hussain Ali",
    createdAt: "10/22/2025 4:54:40 PM",
    customerName: "ابو حاتم",
    event: "تم منح 1 ختم",
    cashbackStamps: 1,
  },
  {
    id: 4,
    managerName: "Hussain Ali",
    createdAt: "10/22/2025 4:54:40 PM",
    customerName: "فيحان",
    event: "تم منح 1 ختم",
    cashbackStamps: 1,
  },
  {
    id: 5,
    managerName: "Hussain Ali",
    createdAt: "10/22/2025 4:54:40 PM",
    customerName: "Omar",
    event: "تم منح 1 ختم",
    cashbackStamps: 1,
  },
];

export function LogsPage() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <h1 className={`text-2xl font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>
          {t("dashboardPages.logs.title")}
        </h1>
      </div>

      {/* Logs Table */}
      <div className="relative overflow-x-auto">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-xs py-2">
                    <Checkbox />
                  </TableHead>
                  <TableHead className="text-xs py-2 min-w-[150px]">
                    <div className="flex items-center gap-1">
                      اسم المدير
                      <div className="flex flex-col">
                        <ChevronUp className="h-3 w-3" />
                        <ChevronDown className="h-3 w-3" />
                      </div>
                    </div>
                  </TableHead>
                  <TableHead className="text-xs py-2 min-w-[180px]">
                    <div className="flex items-center gap-1">
                      تاريخ الإنشاء
                      <div className="flex flex-col">
                        <ChevronUp className="h-3 w-3" />
                        <ChevronDown className="h-3 w-3" />
                      </div>
                    </div>
                  </TableHead>
                  <TableHead className="text-xs py-2 min-w-[150px]">
                    <div className="flex items-center gap-1">
                      اسم العميل
                      <div className="flex flex-col">
                        <ChevronUp className="h-3 w-3" />
                        <ChevronDown className="h-3 w-3" />
                      </div>
                    </div>
                  </TableHead>
                  <TableHead className="text-xs py-2 min-w-[150px]">
                    <div className="flex items-center gap-1">
                      الحدث
                      <div className="flex flex-col">
                        <ChevronUp className="h-3 w-3" />
                        <ChevronDown className="h-3 w-3" />
                      </div>
                    </div>
                  </TableHead>
                  <TableHead className="text-xs py-2 min-w-[180px]">
                    <div className="flex items-center gap-1">
                      استرداد النقود/الطوابع
                      <div className="flex flex-col">
                        <ChevronUp className="h-3 w-3" />
                        <ChevronDown className="h-3 w-3" />
                      </div>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-xs py-2">
                      <Checkbox />
                    </TableCell>
                    <TableCell className="text-xs py-2 whitespace-nowrap font-medium">
                      {log.managerName}
                    </TableCell>
                    <TableCell className="text-xs py-2 whitespace-nowrap">
                      {log.createdAt}
                    </TableCell>
                    <TableCell className="text-xs py-2 whitespace-nowrap">
                      {log.customerName}
                    </TableCell>
                    <TableCell className="text-xs py-2 whitespace-nowrap">
                      {log.event}
                    </TableCell>
                    <TableCell className="text-xs py-2 text-center">
                      {log.cashbackStamps}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Shown 50 From 153 Logs
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
            <div className="text-sm text-muted-foreground ml-4">
              50 / page
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

