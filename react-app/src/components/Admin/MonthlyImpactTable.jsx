export default function MonthlyImpactTable() {
  return (
    <div>
      <h5 className="p-2 m-0 text-white text-center bg-info">
        Impact - {new Date().getFullYear()}
      </h5>

      <table className="table table-sm table-responsive table-bordered">
        <thead>
          <tr>
            <th>Month</th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {monthlyData.map((month, index) => (
            <tr key={index}>
              <td>{month.month}</td>
              <td>{month.value1.toFixed(2)}%</td>
              <td>{month.value2.toFixed(2)}%</td>
              <td>{month.value3.toFixed(2)}%</td>
              <td>{month.value4.toFixed(2)}%</td>
              <td>{month.value5.toFixed(2)}%</td>
              <td>100%</td>
            </tr>
          ))}
        </tbody>

        <tfoot>
          <tr>
            <th>Movements</th>
            {movements.map((movement, index) => (
              <td key={index}>{movement.toFixed(2)}%</td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

const movements = [-44.95, -3.08, 1.67, -1.1, 47.46];

const monthlyData = [
  {
    month: "Jan-24",
    value1: 68.5,
    value2: 2.5,
    value3: 0.12,
    value4: 8.9,
    value5: 19.98,
  },
  {
    month: "Feb-24",
    value1: 23.55,
    value2: -0.58,
    value3: 1.79,
    value4: 7.8,
    value5: 67.44,
  },
  {
    month: "Mar-24",
    value1: 68.5,
    value2: 2.5,
    value3: 0.12,
    value4: 8.9,
    value5: 19.98,
  },
  {
    month: "Apr-24",
    value1: 23.55,
    value2: -0.58,
    value3: 1.79,
    value4: 7.8,
    value5: 67.44,
  },
  {
    month: "May-24",
    value1: 68.5,
    value2: 2.5,
    value3: 0.12,
    value4: 8.9,
    value5: 19.98,
  },
  {
    month: "Jun-24",
    value1: 23.55,
    value2: -0.58,
    value3: 1.79,
    value4: 7.8,
    value5: 67.44,
  },
];
