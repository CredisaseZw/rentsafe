import ColumnsContainer from "@/components/general/ColumnsContainer";
import Fieldset from "@/components/general/Fieldset";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger } from "@/components/ui/select";
1
export default function SalesReports() {
  return (
    <div >
      <div className="main-sm-card">
        <ColumnsContainer numberOfCols={3} marginClass="mt-0">
          <Fieldset legendTitle="Category">
            
              <div className="form-group">
                <Label></Label>
                <Select>
                  <SelectTrigger>
                  </SelectTrigger>
                </Select>
              </div>
          </Fieldset>
        </ColumnsContainer>

      </div>
    </div>
  )
}
