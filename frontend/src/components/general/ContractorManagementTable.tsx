import React from 'react'
import ContractManagementTR from './ContractorManagementTR'

function ContractorManagementTable() {
  return (
    <table className='w-full mt-10'>
        <tbody>
            <ContractManagementTR/>
            <ContractManagementTR/>        
            <ContractManagementTR/>        

        </tbody>
    </table>
  )
}

export default ContractorManagementTable