import { Search } from "lucide-react";
import Button from "../general/Button";
import { Input } from "../ui/input";
import ColumnsContainer from "../general/ColumnsContainer";
import useAddResidentialInspection from "@/hooks/components/useAddResidentialInspection";
import Checklist from "../general/Checklist";

export default function AddResidentialInspectionForm(){
    const {PropertyInspectionChecklists} = useAddResidentialInspection()

    return <div>
        <form action="">
            <div className="flex flex-col gap-5">
                <div className="flex flex-row gap-3">
                    <label className="self-center" htmlFor="">Address</label>
                    <Input placeholder = "e.g 123 Orange way" className="w-full"/>
                    <Button variant={"success"}> <Search size={18}/></Button>

                </div>
                <div className="flex flex-row gap-3">
                    <label className="self-center">Date</label>
                    <Input placeholder=""/>
                </div>
            </div>
            <div className="flex flex-row mt-5 gap-5">
                <div>
                    <h6 className="flex flex-row text-gray-500">M - missing,</h6>
                </div>
                  <div>
                    <h6 className="flex flex-row text-gray-500">S - scratched,</h6>
                </div>
                  <div>
                    <h6 className="flex flex-row text-gray-500">D - damaged,</h6>
                </div>
                  <div>
                    <h6 className="flex flex-row text-gray-500">B - broken,</h6>
                </div>
                  <div>
                    <h6 className="flex flex-row text-gray-500">R - repair/replace,</h6>
                </div>
                 <div>
                    <h6 className="flex flex-row text-gray-500">W - water damage,</h6>
                </div>
                 <div>
                    <h6 className="flex flex-row text-gray-500">L - leaking,</h6>
                </div>
            </div>
         <ColumnsContainer numberOfCols={2}>
            {
                PropertyInspectionChecklists.map((column, index)=>
                    <Checklist key={index}
                    headerName={column.headerName}
                    captionLabel={column.captionLabel}
                    note={column.note}
                    rows={column.rows}/>
                )
            }
            </ColumnsContainer> 

        </form>
    </div>
}