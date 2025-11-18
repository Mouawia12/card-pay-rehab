import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useDirection } from "@/hooks/useDirection";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
  iconColor?: string;
}

export function AdminStatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className = "",
  iconColor = "text-primary"
}: StatsCardProps) {
  const { isRTL } = useDirection();

  return (
    <Card className={`transition-all duration-300 hover:shadow-md ${className}`}>
      <CardHeader className={`flex ${isRTL ? 'flex-row' : 'flex-row-reverse'} items-center justify-between space-y-0 pb-2`}>
        <CardTitle className={`text-sm font-medium text-muted-foreground ${isRTL ? 'font-arabic text-left' : 'font-sans text-right'}`}>
          {title}
        </CardTitle>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${isRTL ? 'font-arabic text-left' : 'font-sans text-right'}`}>
          {value}
        </div>
        {description && (
          <p className={`text-xs text-muted-foreground mt-1 ${isRTL ? 'font-arabic text-left' : 'font-sans text-right'}`}>
            {description}
          </p>
        )}
        {trend && (
          <div className={`flex items-center mt-2 gap-2 ${isRTL ? 'flex-row-reverse justify-start' : 'flex-row justify-end'}`}>
            <Badge 
              variant={trend.isPositive ? "default" : "destructive"}
              className={`text-xs ${isRTL ? 'font-arabic' : 'font-sans'}`}
            >
              {trend.isPositive ? "+" : ""}{trend.value}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
