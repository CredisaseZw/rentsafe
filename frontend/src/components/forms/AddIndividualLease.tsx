import ColumnsContainer from "../general/ColumnsContainer";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import FormSectionHeader from "../general/FormSectionHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableBase } from "../general/TableBase";
import { TableCell, TableRow } from "../ui/table";
import { Checkbox } from "../ui/checkbox";
import { useState } from "react";
import { Button } from "../ui/button";

function AddIndividualLease() {
  const [formData, setFormData] = useState({
    idPassportNumber: "",
    leaseName: "",
    leaseMobileNumber: "",
    rentGuarantorId: "",
    rentGuarantorName: "",
    propertyType: "",
    numberOfRooms: "",
    otherPropertyDetails: "",
    unitNumber: "",
    buildingComplexName: "",
    streetNumber: "",
    streetName: "",
    suburbArea: "",
    cityTown: "",
    province: "",
    country: "",
    areaCode: "",
    leaseCurrency: "",
    monthlyRent: "",
    otherStandingCharge: "",
    standingChargeNarration: "",
    radiosHere: "",
    leaseCopy: "",
    depositDate: "",
    depositCurrency: "",
    depositAmount: "",
    depositHolder: "",
    leaseStartDate: "",
    leaseEndDate: "",
    subscriptionPeriodRemaining: "",
    paymentPeriodStartDate: "",
    paymentPeriodEndDate: "",
    landlordType: "",
    idRegName: "",
    landlordName: "",
    commissionPercentage: "",
    operatingCostsIncluded: false,
    landlordsOpeningBalance : "",
    paymentDataMoreThan3Months: "",
    paymentData07May25: "",
    paymentData07Jun25: "",
    paymentData07Jul25: "",
    paymentData07Aug25: "",
  });

  const handleChange = (e:any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (name:any, value:any) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const headers = [
    {
      name: "Payment Data",
      textAlign: "center",
    },
    {
      name: "More than 3 months",
      textAlign: "center",
    },
    {
      name: "07-May-25",
      textAlign: "center",
    },
    {
      name: "07-Jun-25",
      textAlign: "center",
    },
    {
      name: "07-Jul-25",
      textAlign: "center",
    },
    {
      name: "07-Aug-25",
      textAlign: "center",
    },
    {
      name: "Outstanding Balance",
      textAlign: "center",
    },
  ];

  return (
    <form className="w-full">
      <ColumnsContainer numberOfCols={3} gapClass="gap-7">
        <div className="flex flex-col gap-2">
          <Label className="px-2 font-normal required" htmlFor="idPassportNumber">
            ID / Passport #
          </Label>
          <Input
            name="idPassportNumber"
            id="idPassportNumber"
            required
            className="border-foreground/40 bg-white"
            value={formData.idPassportNumber}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="px-2 font-normal required" htmlFor="leaseName">
            Lease Name
          </Label>
          <Input
            name="leaseName"
            id="leaseName"
            required
            className="border-foreground/40 bg-white"
            value={formData.leaseName}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="px-2 font-normal" htmlFor="leaseMobileNumber">
            Lease Mobile Number
          </Label>
          <Input
            name="leaseMobileNumber"
            id="leaseMobileNumber"
            className="border-foreground/40 bg-white"
            value={formData.leaseMobileNumber}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="px-2 font-normal required" htmlFor="rentGuarantorId">
            Rent Guarantor ID
          </Label>
          <Input
            name="rentGuarantorId"
            id="rentGuarantorId"
            required
            className="border-foreground/40 bg-white"
            value={formData.rentGuarantorId}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="px-2 font-normal required" htmlFor="rentGuarantorName">
            Rent Guarantor Name
          </Label>
          <Input
            name="rentGuarantorName"
            id="rentGuarantorName"
            required
            className="border-foreground/40 bg-white"
            value={formData.rentGuarantorName}
            onChange={handleChange}
          />
        </div>
      </ColumnsContainer>
      <FormSectionHeader title="Lease Address" />
      <ColumnsContainer numberOfCols={3} marginClass="mt-5" gapClass="gap-7">
        <div className="flex flex-col gap-2">
          <Label className="px-2 font-normal required" htmlFor="propertyType">
            Property Type
          </Label>
          <Select
            name="propertyType"
            onValueChange={(value) => handleSelectChange("propertyType", value)}
            value={formData.propertyType}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="px-2 font-normal" htmlFor="numberOfRooms">
            No. Of rooms
          </Label>
          <Input
            name="numberOfRooms"
            id="numberOfRooms"
            className="border-foreground/40 bg-white"
            value={formData.numberOfRooms}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="px-2 font-normal" htmlFor="otherPropertyDetails">
            Other Property Details
          </Label>
          <Input
            name="otherPropertyDetails"
            id="otherPropertyDetails"
            className="border-foreground/40 bg-white"
            value={formData.otherPropertyDetails}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="px-2 font-normal" htmlFor="unitNumber">
            Unit Number
          </Label>
          <Input
            name="unitNumber"
            id="unitNumber"
            className="border-foreground/40 bg-white"
            value={formData.unitNumber}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="px-2 font-normal" htmlFor="buildingComplexName">
            Building / Complex Name
          </Label>
          <Input
            name="buildingComplexName"
            id="buildingComplexName"
            className="border-foreground/40 bg-white"
            value={formData.buildingComplexName}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="px-2 font-normal required" htmlFor="streetNumber">
            Street Number
          </Label>
          <Input
            name="streetNumber"
            id="streetNumber"
            required
            className="border-foreground/40 bg-white"
            value={formData.streetNumber}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="px-2 font-normal required" htmlFor="streetName">
            Street Name
          </Label>
          <Input
            name="streetName"
            id="streetName"
            required
            className="border-foreground/40 bg-white"
            value={formData.streetName}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="px-2 font-normal required" htmlFor="suburbArea">
            Suburb / Area
          </Label>
          <Input
            name="suburbArea"
            id="suburbArea"
            required
            className="border-foreground/40 bg-white"
            value={formData.suburbArea}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="px-2 font-normal required" htmlFor="cityTown">
            City / Town
          </Label>
          <Input
            name="cityTown"
            id="cityTown"
            required
            className="border-foreground/40 bg-white"
            value={formData.cityTown}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="px-2 font-normal" htmlFor="province">
            Province
          </Label>
          <Input
            name="province"
            id="province"
            className="border-foreground/40 bg-white"
            value={formData.province}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="px-2 font-normal required" htmlFor="country">
            Country
          </Label>
          <Input
            name="country"
            id="country"
            required
            className="border-foreground/40 bg-white"
            value={formData.country}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="px-2 font-normal" htmlFor="areaCode">
            Area Code
          </Label>
          <Input
            name="areaCode"
            id="areaCode"
            className="border-foreground/40 bg-white"
            value={formData.areaCode}
            onChange={handleChange}
          />
        </div>
      </ColumnsContainer>
      <FormSectionHeader title="Lease Details" />
      <ColumnsContainer numberOfCols={3} marginClass="mt-5" gapClass="gap-7">
        <div className="flex flex-col gap-2">
          <Label className="px-2 font-normal" htmlFor="leaseCurrency">
            Lease Currency
          </Label>
          <Select
            name="leaseCurrency"
            onValueChange={(value) => handleSelectChange("leaseCurrency", value)}
            value={formData.leaseCurrency}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="US">US</SelectItem>
              <SelectItem value="ZWD">ZWD</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="px-2 font-normal" htmlFor="monthlyRent">
            Monthly Rent (Excl. VAT)
          </Label>
          <Input
            name="monthlyRent"
            id="monthlyRent"
            className="border-foreground/40 bg-white"
            value={formData.monthlyRent}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="px-2 font-normal" htmlFor="otherStandingCharge">
            Other Standing Charge (Excl. VAT)
          </Label>
          <Input
            name="otherStandingCharge"
            id="otherStandingCharge"
            className="border-foreground/40 bg-white"
            value={formData.otherStandingCharge}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="px-2 font-normal" htmlFor="standingChargeNarration">
            Standing Charge Narration
          </Label>
          <Input
            name="standingChargeNarration"
            id="standingChargeNarration"
            className="border-foreground/40 bg-white"
            value={formData.standingChargeNarration}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="px-2 font-normal" htmlFor="radiosHere">
            RADIOS HERE
          </Label>
          <Input
            name="radiosHere"
            id="radiosHere"
            className="border-foreground/40 bg-white"
            value={formData.radiosHere}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="px-2 font-normal" htmlFor="leaseCopy">
            Lease Copy
          </Label>
          <Input
            name="leaseCopy"
            id="leaseCopy"
            className="border-foreground/40 bg-white"
            value={formData.leaseCopy}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="px-2 font-normal" htmlFor="depositDate">
            Deposit Date
          </Label>
          <Input
            name="depositDate"
            id="depositDate"
            type="date"
            className="border-foreground/40 bg-white"
            value={formData.depositDate}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="px-2 font-normal" htmlFor="depositCurrency">
            Deposit Currency
          </Label>
          <Select
            name="depositCurrency"
            onValueChange={(value) => handleSelectChange("depositCurrency", value)}
            value={formData.depositCurrency}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Deposit Currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="US">US</SelectItem>
              <SelectItem value="ZWD">ZWD</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="px-2 font-normal" htmlFor="depositAmount">
            Deposit Amount
          </Label>
          <Input
            name="depositAmount"
            id="depositAmount"
            className="border-foreground/40 bg-white"
            value={formData.depositAmount}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="px-2 font-normal" htmlFor="depositHolder">
            Deposit Holder
          </Label>
          <Select
            name="depositHolder"
            onValueChange={(value) => handleSelectChange("depositHolder", value)}
            value={formData.depositHolder}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Deposit Holder" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="US">US</SelectItem>
              <SelectItem value="ZWD">ZWD</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="px-2 font-normal" htmlFor="leaseStartDate">
            Lease Start Date
          </Label>
          <Input
            name="leaseStartDate"
            id="leaseStartDate"
            type="date"
            className="border-foreground/40 bg-white"
            value={formData.leaseStartDate}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="px-2 font-normal" htmlFor="leaseEndDate">
            Lease End Date
          </Label>
          <Input
            name="leaseEndDate"
            id="leaseEndDate"
            type="date"
            className="border-foreground/40 bg-white"
            value={formData.leaseEndDate}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="px-2 font-normal" htmlFor="subscriptionPeriodRemaining">
            Subscription Period Remaining
          </Label>
          <Input
            name="subscriptionPeriodRemaining"
            id="subscriptionPeriodRemaining"
            className="border-foreground/40 bg-white"
            value={formData.subscriptionPeriodRemaining}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="px-2 font-normal" htmlFor="paymentPeriodStartDate">
            Payment Period Start Date
          </Label>
          <Input
            name="paymentPeriodStartDate"
            id="paymentPeriodStartDate"
            type="date"
            className="border-foreground/40 bg-white"
            value={formData.paymentPeriodStartDate}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="px-2 font-normal" htmlFor="paymentPeriodEndDate">
            Payment Period End Date
          </Label>
          <Input
            name="paymentPeriodEndDate"
            id="paymentPeriodEndDate"
            type="date"
            className="border-foreground/40 bg-white"
            value={formData.paymentPeriodEndDate}
            onChange={handleChange}
          />
        </div>
      </ColumnsContainer>
      <FormSectionHeader title="Tenant Opening Balance" />
      <div className="w-full">
        <TableBase headers={headers}>
          <TableRow>
            <TableCell className="baseCellClass text-center">Amount</TableCell>
            <TableCell className="baseCellClass bg-black">
              <Input
                name="paymentDataMoreThan3Months"
                value={formData.paymentDataMoreThan3Months}
                onChange={handleChange}
              />
            </TableCell>
            <TableCell className="baseCellClass bg-red-500">
              <Input
                name="paymentData07May25"
                value={formData.paymentData07May25}
                onChange={handleChange}
              />
            </TableCell>
            <TableCell className="baseCellClass bg-rose-500">
              <Input
                name="paymentData07Jun25"
                value={formData.paymentData07Jun25}
                onChange={handleChange}
              />
            </TableCell>
            <TableCell className="baseCellClass bg-amber-500">
              <Input
                name="paymentData07Jul25"
                value={formData.paymentData07Jul25}
                onChange={handleChange}
              />
            </TableCell>
            <TableCell className="baseCellClass bg-green-500">
              <Input
                name="paymentData07Aug25"
                value={formData.paymentData07Aug25}
                onChange={handleChange}
              />
            </TableCell>
            <TableCell className="baseCellClass text-center bg-green-500 text-white">
              $0.00
            </TableCell>
          </TableRow>
        </TableBase>
      </div>
      <FormSectionHeader title="Estate Agents Section" />
      <ColumnsContainer numberOfCols={3} gapClass="gap-7">
        <div className="flex flex-col gap-2">
          <Label className="px-2 font-normal required" htmlFor="landlordType">
            Landlord Type
          </Label>
          <Input
            name="landlordType"
            id="landlordType"
            required
            className="border-foreground/40 bg-white"
            value={formData.landlordType}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="px-2 font-normal required" htmlFor="idRegName">
            ID / Reg #(or name)
          </Label>
          <Input
            name="idRegName"
            id="idRegName"
            required
            className="border-foreground/40 bg-white"
            value={formData.idRegName}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="px-2 font-normal required" htmlFor="landlordName">
            Landlord Name
          </Label>
          <Input
            name="landlordName"
            id="landlordName"
            required
            className="border-foreground/40 bg-white"
            value={formData.landlordName}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="px-2 font-normal required" htmlFor="commissionPercentage">
            Commission %
          </Label>
          <Input
            name="commissionPercentage"
            id="commissionPercentage"
            required
            className="border-foreground/40 bg-white"
            value={formData.commissionPercentage}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="px-2 font-normal required" htmlFor="commissionPercentage">
            Landlords Opening Balance
          </Label>
          <Input
            name="landlordsOpeningBalance"
            id="landlordsOpeningBalance"
            required
            className="border-foreground/40 bg-white"
            value={formData.landlordsOpeningBalance}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-row gap-2 self-center">
          <Checkbox
            className="self-center"
            name="operatingCostsIncluded"
            id="operatingCostsIncluded"
            checked={formData.operatingCostsIncluded}
            onCheckedChange={(checked) => handleSelectChange("operatingCostsIncluded", checked)}
          />
          <Label className="px-2 font-normal self-center" htmlFor="operatingCostsIncluded">
            Operating Costs Included
          </Label>
        </div>
      </ColumnsContainer>
      <div className="flex justify-end">
        <Button>Submit</Button> 
      </div>
    </form>
  );
}

export default AddIndividualLease;