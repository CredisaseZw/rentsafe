export default function WeeklyImpactTable() {
  return (
    <div>
      <h5 className="p-2 m-0 text-white text-center bg-info">
        Impact - {new Date().getFullYear()}
      </h5>

      <table className="table table-sm table-responsive table-bordered">
        <thead>
          <tr>
            <th>Week on Week Ageing</th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {weeklyData.map((data, index) => (
            <tr key={index}>
              <td>{data.date}</td>
              <td>{data.value1}</td>
              <td>{data.value2}</td>
              <td>{data.value3}</td>
              <td>{data.value4}</td>
              <td>{data.value5}</td>
              <td>100%</td>
            </tr>
          ))}
        </tbody>

        <tfoot>
          <tr>
            <th> Movements</th>

            {movements.map((data, index) => (
              <td key={index}>{data}</td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

const movements = [-31.45, -2.98, -3.41, 1.6, 36.24];

const weeklyData = [
  {
    date: "17-Jun-24",
    value1: 68.5,
    value2: 2.5,
    value3: 0.12,
    value4: 8.9,
    value5: 19.98,
  },
  {
    date: "24-Jun-24",
    value1: 55.0,
    value2: 2.4,
    value3: 5.2,
    value4: 6.2,
    value5: 31.2,
  },
  {
    date: "01-Jul-24",
    value1: 23.55,
    value2: -0.58,
    value3: 1.79,
    value4: 7.8,
    value5: 67.44,
  },
];
