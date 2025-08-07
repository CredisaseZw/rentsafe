import { Eye } from "lucide-react";
import useCombined from "@/hooks/components/useCombined";
import { TableBase } from "@/components/general/TableBase";
import { TableCell, TableRow } from "@/components/ui/table";
import InspectionsHeader from "./InspectionsHeader";


export default function Combined(){
    const {headers} = useCombined()
    return <div>
        <InspectionsHeader/>
        <div className="mt-5">
            <TableBase headers={headers}>
                <TableRow>
                    <TableCell className="baseCellClass">Tao Properties</TableCell>
                    <TableCell className="baseCellClass">14, Spencer Flats, Avenues, CBD, Harare</TableCell>
                    <TableCell className="baseCellClass">Residential - Flats</TableCell>
                    <TableCell className="baseCellClass text-center">Dzotso</TableCell>
                    <TableCell className="baseCellClass text-center">24-Jul-25</TableCell>
                    <TableCell className="baseCellClass text-center">45%</TableCell>
                    <TableCell className="baseCellClass text-center">29-Nov-24</TableCell>
                    <TableCell className="baseCellClass text-center">67%</TableCell>
                    <TableCell className="baseCellClass flex items-center justify-center"><Eye size={18}/></TableCell>
                </TableRow>
                 <TableRow>
                    <TableCell className="baseCellClass">Tao Properties</TableCell>
                    <TableCell className="baseCellClass">14, Spencer Flats, Avenues, CBD, Harare</TableCell>
                    <TableCell className="baseCellClass">Residential - Flats</TableCell>
                    <TableCell className="baseCellClass text-center">Dzotso</TableCell>
                    <TableCell className="baseCellClass text-center">24-Jul-25</TableCell>
                    <TableCell className="baseCellClass text-center">45%</TableCell>
                    <TableCell className="baseCellClass text-center">29-Nov-24</TableCell>
                    <TableCell className="baseCellClass text-center">67%</TableCell>
                    <TableCell className="baseCellClass flex items-center justify-center"><Eye size={18}/></TableCell>
                </TableRow>
                 <TableRow>
                    <TableCell className="baseCellClass">Tao Properties</TableCell>
                    <TableCell className="baseCellClass">14, Spencer Flats, Avenues, CBD, Harare</TableCell>
                    <TableCell className="baseCellClass">Residential - Flats</TableCell>
                    <TableCell className="baseCellClass text-center">Dzotso</TableCell>
                    <TableCell className="baseCellClass text-center">24-Jul-25</TableCell>
                    <TableCell className="baseCellClass text-center">45%</TableCell>
                    <TableCell className="baseCellClass text-center">29-Nov-24</TableCell>
                    <TableCell className="baseCellClass text-center">67%</TableCell>
                    <TableCell className="baseCellClass flex items-center justify-center"><Eye size={18}/></TableCell>
                </TableRow>
            </TableBase>
        </div>
    </div>
}