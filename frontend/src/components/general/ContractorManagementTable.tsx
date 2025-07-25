import ContractManagementTR from "./ContractorManagementTR";

function ContractorManagementTable() {
   return (
      <table className="mt-10 w-full">
         <tbody>
            <ContractManagementTR />
            <ContractManagementTR />
            <ContractManagementTR />
         </tbody>
      </table>
   );
}

export default ContractorManagementTable;
