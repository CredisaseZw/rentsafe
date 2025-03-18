export default function useForecasts(inflows_statement, outflows_statement) {
  const inflows_totals = inflows_statement?.reduce(
    (acc, row) => ({
      zero_to_seven_days: acc.zero_to_seven_days + row["0-7"],
      eight_to_fourteen_days: acc.eight_to_fourteen_days + row["8-14"],
      fifteen_to_twenty_one_days: acc.fifteen_to_twenty_one_days + row["14-21"],
      twenty_one_plus_days: acc.twenty_one_plus_days + row["21+"],
      total: acc.total + row.total,
    }),
    {
      zero_to_seven_days: 0,
      eight_to_fourteen_days: 0,
      fifteen_to_twenty_one_days: 0,
      twenty_one_plus_days: 0,
      total: 0,
    }
  );

  const outflows_totals = outflows_statement?.reduce(
    (acc, row) => ({
      zero_to_seven_days: acc.zero_to_seven_days + row["0-7"],
      eight_to_fourteen_days: acc.eight_to_fourteen_days + row["8-14"],
      fifteen_to_twenty_one_days: acc.fifteen_to_twenty_one_days + row["14-21"],
      twenty_one_plus_days: acc.twenty_one_plus_days + row["21+"],
      total: acc.total + row.total,
    }),
    {
      zero_to_seven_days: 0,
      eight_to_fourteen_days: 0,
      fifteen_to_twenty_one_days: 0,
      twenty_one_plus_days: 0,
      total: 0,
    }
  );

  const netFlows = {
    zero_to_seven_days: inflows_totals.zero_to_seven_days - outflows_totals.zero_to_seven_days,
    eight_to_fourteen_days:
      inflows_totals.eight_to_fourteen_days - outflows_totals.eight_to_fourteen_days,
    fifteen_to_twenty_one_days:
      inflows_totals.fifteen_to_twenty_one_days - outflows_totals.fifteen_to_twenty_one_days,
    twenty_one_plus_days:
      inflows_totals.twenty_one_plus_days - outflows_totals.twenty_one_plus_days,
    total: inflows_totals.total - outflows_totals.total,
  };

  return { netFlows, inflows_totals, outflows_totals };
}
