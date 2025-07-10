import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { useNavigate } from "react-router";

export const description = "A bar chart with a custom label";

const chartData = [
   { fill: "darkgreen", status: "Current", amount: 30, amountDisplay: "$ 30.00" },
   { fill: "orange", status: "Past Due 1-30 days", amount: 90, amountDisplay: "$ 90.00" },
   { fill: "tomato", status: "Past Due 31-60 days", amount: 34, amountDisplay: "$ 34.00" },
   { fill: "firebrick", status: "Past Due 61-90 days", amount: 63, amountDisplay: "$ 63.00" },
   { fill: "black", status: "Past Due 90+ days", amount: 78, amountDisplay: "$ 78.00" },
];

const chartConfig = {
   desktop: {
      label: "Desktop",
      color: "var(--chart-2)",
   },
   mobile: {
      label: "Mobile",
      color: "var(--chart-2)",
   },
   label: {
      color: "var(--background)",
   },
} satisfies ChartConfig;

type CreditSummaryGraphProps = {
   title: string;
};

export default function CreditSummaryGraph({ title }: CreditSummaryGraphProps) {
   const navigate = useNavigate();

   return (
      <Card>
         <CardHeader>
            <CardTitle>{title}</CardTitle>
         </CardHeader>

         <CardContent>
            <ChartContainer config={chartConfig}>
               <BarChart accessibilityLayer data={chartData} layout="vertical" margin={{ right: 16 }}>
                  <YAxis
                     dataKey="status"
                     type="category"
                     tickLine={false}
                     tickMargin={10}
                     axisLine={false}
                     tickFormatter={(value) => value.slice(0, 3)}
                     hide
                  />

                  <XAxis dataKey="amount" type="number" hide />

                  <Bar
                     dataKey="amount"
                     fill="var(--color-PRIMARY)"
                     radius={8}
                     cursor={"pointer"}
                     onClick={(e) =>
                        navigate(
                           `/services/rent-safe/leases/${
                              e?.payload?.status?.toLowerCase().replace(/\s+/g, "-") || "unknown"
                           }`,
                        )
                     }
                  >
                     <LabelList
                        dataKey="status"
                        position="insideLeft"
                        offset={8}
                        className="fill-(--color-label)"
                        fontSize={12}
                        fontWeight="bold"
                     />
                     <LabelList
                        dataKey="amountDisplay"
                        position="right"
                        offset={8}
                        className="fill-foreground"
                        fontSize={12}
                        fontWeight="bold"
                     />
                  </Bar>
               </BarChart>
            </ChartContainer>
         </CardContent>
      </Card>
   );
}
