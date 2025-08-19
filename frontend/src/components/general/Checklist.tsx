import type { Row } from "@/types"
import { Textarea } from "../ui/textarea"
import CircledCheck from "./CircledCheck"

interface props {
    captionLabel: string,
    headerName: string,
    note : string,
    rows :  Row[]
}
function Checklist({captionLabel, headerName, note, rows}:props) {
  return (
    <div>
        <table className="w-full table-auto border-collapse text-left">
            <thead>
                <tr className="border border-color">
                <th className="bg-gray-800 p-2 text-white dark:bg-zinc-900">{headerName}</th>
                <th className="dark:bg-zinc-800 bg-gray-300 p-2 text-center">Good</th>
                <th className="dark:bg-zinc-800 bg-gray-300 p-2 text-center">OK</th>
                <th className="dark:bg-zinc-800 bg-gray-300 p-2 text-center">Bad</th>
                </tr>
            </thead>
            <tbody className="border border-color">
                {
                    rows.map((row, index)=>
                        <tr className="border-t border-color" key={index}>
                            <td className="p-2">{row.rowName}</td>
                            <td className="border border-b-0 border-t-0 border-color p-2 text-center">
                                <div className="flex items-center justify-center">
                                    <CircledCheck isActive = {row.status.good} />
                                </div>
                            </td>
                            <td className="border border-b-0 border-t-0 border-color p-2 text-center">
                                <div className="flex items-center justify-center">
                                    <CircledCheck isActive = {row.status.ok}/>
                                </div>
                            </td>
                            <td className="border border-b-0 border-t-0 border-color p-2 text-center">
                                <div className="flex items-center justify-center">
                                    <CircledCheck isActive = {row.status.bad}/>
                                </div>
                            </td>
                        </tr>
                    )
                }
              
            </tbody>
        </table>
        <div className="bg-gray-200 w-full dark:bg-zinc-900 p-3">
            <p>{captionLabel}</p>
        </div>
        <div className="form-group mt-4">
            <label>Notes</label>
            <Textarea value={note} className="w-full"></Textarea>
        </div>
    </div>
  )
}

export default Checklist