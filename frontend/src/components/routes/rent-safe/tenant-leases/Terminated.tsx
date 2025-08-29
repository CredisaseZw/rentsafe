import Searchbox from "@/components/general/Searchbox"
import { TableBase } from "@/components/general/TableBase"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TableCell, TableRow } from "@/components/ui/table"
import type { Header } from "@/types"
function Terminated() {

  const headers:Header[] = [
    {
      name  :"Lease ID",
    },
    {
      name : "Tenant",
    },
    {
      name : "Landlord",
    }, 
    {
      name : "Property Type"
    },
    {
      name : "Address"
    },
    {
      name : "Rent owing"
    },
    {
      name : "Actions",
      colSpan : 2
    },
    {
      name : "Date of termination"
    }

  ]
  
  return (
    <div className="w-full">
      <div>
        <h3 className="pb-1 font-bold text-2xl text-gray-800 dark:text-gray-50 ">Active Leases</h3>
        <p className="m-0 self-center text-gray-500 dark:text-gray-100 text-sm">Showing 10 of 65 leases</p>
      </div>
      <div className="flex mt-8 flex-row justify-between">
        <Searchbox
          placeholder="Search by Name"
          handleSearch={()=>{}}
        />
        <div className="flex flex-row gap-3">
          <p className="m-0 self-center text-gray-600 dark:text-gray-100 font-medium">Sort by</p>
          <Select defaultValue="default">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="rent_owing_asc">Rent Owing asc</SelectItem>
              <SelectItem value="rent_owing_desc">Rent Owing desc</SelectItem>
              <SelectItem value="color_asc">Color (Rent) asc</SelectItem>
              <SelectItem value="color_asc">Color (Rent) desc</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-3">
        <TableBase headers={headers}>
          <TableRow>      
            <TableCell className="text-center">1</TableCell>
            <TableCell className="text-center">Fincheck</TableCell>
            <TableCell className="text-center">Southview Holdings</TableCell>
            <TableCell className="text-center">Office Complex</TableCell>
            <TableCell className="text-center">8th Floor, West Wing, Club Chambers, 128
              Nelson Mandela Avenue, CBD, Harare,
              Zimbabwe</TableCell>
            <TableCell className="bg-yellow-400 text-center text-white font-semibold">USD100.00</TableCell>
            <TableCell className="bg-blue-600 text-center text-white font-semibold">
              <div className="flex items-center justify-center">
                <Button variant={"ghost"}>Receipt</Button>
              </div>
            </TableCell>
            <TableCell className="bg-amber-500 text-center text-white font-semibold">
              <div className="flex items-center justify-center">
                <Button variant={"ghost"}>Renew</Button>
              </div>
            </TableCell>
            <TableCell className="bg-red-600 text-center text-white font-semibold">
              <div className="flex items-center justify-center">
                <Button variant={"ghost"}>Terminate</Button>
              </div>
            </TableCell>
          </TableRow>
           <TableRow>      
            <TableCell className="text-center">1</TableCell>
            <TableCell className="text-center">Fincheck</TableCell>
            <TableCell className="text-center">Southview Holdings</TableCell>
            <TableCell className="text-center">Office Complex</TableCell>
            <TableCell className="text-center">8th Floor, West Wing, Club Chambers, 128
              Nelson Mandela Avenue, CBD, Harare,
              Zimbabwe</TableCell>
            <TableCell className="bg-yellow-400 text-center text-white font-semibold">USD100.00</TableCell>
            <TableCell className="bg-blue-600 text-center text-white font-semibold">
              <div className="flex items-center justify-center">
                <Button variant={"ghost"}>Receipt</Button>
              </div>
            </TableCell>
            <TableCell className="bg-amber-500 text-center text-white font-semibold">
              <div className="flex items-center justify-center">
                <Button variant={"ghost"}>Renew</Button>
              </div>
            </TableCell>
            <TableCell className="bg-red-600 text-center text-white font-semibold">
              <div className="flex items-center justify-center">
                <Button variant={"ghost"}>Terminate</Button>
              </div>
            </TableCell>
          </TableRow>

          {/* TOTALS ROW */}
          <TableRow>
            <TableCell colSpan={5}/>
            <TableCell className="text-center flex flex-col gap-1">
              USD700.00
            <i>rate : 36</i>  
            </TableCell>

          </TableRow>
        </TableBase>
      </div>
    </div>
  )
}

export default Terminated