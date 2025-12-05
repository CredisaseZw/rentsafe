import { Card, CardContent} from "@/components/ui/card";
import { COLOR_CLASSES } from "@/constants";
import type { LucideIcon } from "lucide-react";
import React from "react";

interface props {
  value: string | React.ReactElement;
  subTitle: number | string | React.ReactElement;
  layoutScheme: {
    icon: LucideIcon;
    color: string;
  };
  valueAsChild?: React.ReactNode | false;
}

function DashboardCard({ value, subTitle, layoutScheme, valueAsChild = false }: props) {
  const Icon = layoutScheme.icon;
  const color = COLOR_CLASSES[layoutScheme.color] ?? COLOR_CLASSES["blue"];

  return (
    <Card className="rounded-md border-color">
      <CardContent className="flex flex-row items-center gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${color.bg}`}>
          <Icon className={color.text} />
        </div>
        <div className="flex flex-col">
          {valueAsChild ? (
            <>{value}</>
          ) : (
            <h1 className="text-2xl font-semibold text-gray-700 dark:text-gray-100">{value}</h1>
          )}
          <span className="mt-1 text-sm uppercase text-gray-500 dark:text-gray-2001">{subTitle}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default DashboardCard;
