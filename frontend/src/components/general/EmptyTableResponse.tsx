import { TableCell, TableRow } from '../ui/table'
import EmptyResults from './EmptyResults'

interface props {
    colSpan : number
}
function EmptyTableResponse({colSpan}:props) {
  return (
   <TableRow>
        <TableCell colSpan={colSpan}>
            <EmptyResults
            message="Nothing to show"/>
        </TableCell>
    </TableRow>
  )
}

export default EmptyTableResponse