import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Button from "@/components/general/Button";
import ButtonSpinner from "@/components/general/ButtonSpinner";
import StaticBadge from "@/components/general/StaticBadge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";
import useRenewLease from "@/hooks/components/useRenewLease";
import usePatchLease from "@/hooks/apiHooks/usePatchLease";

interface Props {
  refetch: () => void;
  tenantName: string;
  lease_id: string;
}

function RenewLeaseDialog({ tenantName, lease_id, refetch }: Props) {
    const renew = usePatchLease()
    const { 
        date,
        open,
        loading,
        setDate,
        setOpen,
        patch,
    } = useRenewLease(lease_id, refetch, renew);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <StaticBadge bgColor="bg-amber-500">
                <Button variant="ghost" className="text-white" onClick={() => setOpen(true)}>
                    Renew
                </Button>
                </StaticBadge>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                <DialogTitle className="text-gray-800 dark:text-white">
                    Are you absolutely sure?
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-white">
                    Renew lease for {tenantName}, please provide the new end date.
                    <div className="mt-5">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="endDate">End Date</Label>
                            <Input 
                                id="endDate"
                                name="endDate"
                                type="date"
                                value={date}
                                onChange={(e)=> setDate(e.target.value)}
                            />
                        </div>
                    </div>
                </DialogDescription>
                </DialogHeader>

                <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" asChild onClick={() => setOpen(false)}>
                    Cancel
                </Button>
                <Button asChild variant={"success"} disabled={loading} onClick={() => {patch()}}>
                  {
                    loading ?
                    <ButtonSpinner/>: 
                    <CheckCircle className="mr-2" size={18} />
                  }
                    Renew
                </Button>
                </div>
            </DialogContent>
        </Dialog>
  );
}

export default RenewLeaseDialog;
