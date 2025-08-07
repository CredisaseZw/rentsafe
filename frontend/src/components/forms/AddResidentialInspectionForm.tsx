import { Search } from "lucide-react";
import Button from "../general/Button";
import { Input } from "../ui/input";
import ColumnsContainer from "../general/ColumnsContainer";
import useAddResidentialInspection from "@/hooks/components/useAddResidentialInspection";
import Checklist from "../general/Checklist";

export default function AddResidentialInspectionForm(){
    const {ExteriorColumns} = useAddResidentialInspection()

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
                    <h6 className="flex flex-row text-gray-600">M - missing,</h6>
                </div>
                  <div>
                    <h6 className="flex flex-row text-gray-600">S - scratched,</h6>
                </div>
                  <div>
                    <h6 className="flex flex-row text-gray-600">D - damaged,</h6>
                </div>
                  <div>
                    <h6 className="flex flex-row text-gray-600">B - broken,</h6>
                </div>
                  <div>
                    <h6 className="flex flex-row text-gray-600">R - repair/replace,</h6>
                </div>
                 <div>
                    <h6 className="flex flex-row text-gray-600">W - water damage,</h6>
                </div>
                 <div>
                    <h6 className="flex flex-row text-gray-600">L - leaking,</h6>
                </div>
            </div>
            <ColumnsContainer numberOfCols={2}>
            {
                ExteriorColumns.map((column, index)=>
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