import SectionSkeleton from './SectionSkeleton.jsx';

export default function AgedAnalysis({ data, isCreditorView }) {
  let total = 0;

  Object.keys(data).forEach((key) => {
    return (total += data[key]);
  });

  return (
    <SectionSkeleton title={isCreditorView ? 'ageing' : 'aged analysis'}>
      <table className="table table-sm table-responsive table-bordered  mb-0">
        <thead className="custom-bg-grey-2 text-white">
          <tr>
            <th>90+ Days</th>
            <th>90 Days</th>
            <th>60 Days</th>
            <th>30 Days</th>
            <th>Current</th>
            <th>total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{data.oneTwentyDays}</td>
            <td>{data.ninetyDays}</td>
            <td>{data.sixtyDays}</td>
            <td>{data.thirtyDays}</td>
            <td>{data.current}</td>
            <td>${total.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </SectionSkeleton>
  );
}
