import SectionSkeleton from './SectionSkeleton.jsx';

export default function ForecastInflows({ data, isCreditorView }) {
  return (
    <SectionSkeleton
      title={isCreditorView ? 'forecast outflows' : 'forecast inflows'}
    >
      <table className="table table-sm table-responsive table-bordered  mb-0">
        <thead className="custom-bg-grey-2 text-white">
          <tr>
            <th>0-7 Days</th>
            <th>8-14 Days</th>
            <th>15-21 Days</th>
            <th>21+ Days</th>
            <th>total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{data.zeroToSevenDays}</td>
            <td>{data.eightToFourteenDays}</td>
            <td>{data.fourteenToTwentyOneDays}</td>
            <td>{data.twentyOnePlusDays}</td>
            <td>
              $
              {Number.isNaN(Number(data.total))
                ? data.total
                : Number(data.total).toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    </SectionSkeleton>
  );
}
