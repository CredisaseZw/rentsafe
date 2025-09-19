import ColumnsContainer from "@/components/general/ColumnsContainer"
import Header from "@/components/general/Header"
import Pill from "@/components/general/Pill"
import { TableBase } from "@/components/general/TableBase"
import CreateUnitDialog from "@/components/routes/rent-safe/properties/CreateUnitDialog"
import PropertyDetail from "@/components/routes/rent-safe/properties/PropertyDetail"
import { TableCell, TableRow } from "@/components/ui/table"
import { PROPERTY_HEADERS } from "@/constants"
import useProperty from "@/hooks/components/useProperty"
import {  Edit, MapPin, ParkingSquare, Power, Shield, TrashIcon, User } from "lucide-react"
import useGetPropertyDetails from "@/hooks/apiHooks/useGetPropertyDetails"
import { useEffect } from "react"
import { isAxiosError } from "axios"
import { toast } from "sonner"
import LoadingIndicator from "@/components/general/LoadingIndicator"
import { capitalizeFirstLetter, formatLandlords, summarizeAddress } from "@/lib/utils"
import useGetPropertyUnits from "@/hooks/apiHooks/useGetPropertyUnits"
import { Button } from "@/components/ui/button"

function Property() {
    const {
        property_id,
        property,
        open,
        setOpen,
        setProperty,
        propertyUnits,
        setPropertyUnits 
    } = useProperty()

    const {propertyData, propertyDataLoading , propertyDataError } = useGetPropertyDetails(property_id);
    const {units, unitsLoading, unitsError} = useGetPropertyUnits(property_id);

    useEffect(()=>{
        if(isAxiosError(propertyDataError)){
            const message = propertyDataError.response?.data.error ?? propertyDataError.response?.data.detail  ?? "Something went wrong"    
            toast.error("Failed to fetch property details", { description: message });
            console.error(propertyDataError);    
            return; 
        } 
        if(propertyData){
            setProperty(propertyData)
        }
    }, [propertyData, propertyDataError])

    useEffect(()=>{
        if(isAxiosError(unitsError)){
            const message = unitsError.response?.data.error ?? unitsError.response?.data.detail  ?? "Something went wrong"    
            toast.error("Failed to fetch property units", { description: message });
            console.error(unitsError);    
            return; 
        } 
        if(units){
            setPropertyUnits(units)
        }
    }, [units, unitsError])

    return (
        <div>
            <Header title="Property Details"/>
            <div className="main-sm-card">
                {
                    propertyDataLoading &&
                    <div className="h-[25vh] flex justify-center items-center">
                        <LoadingIndicator/>
                    </div>   
                }
                {
                    !propertyDataLoading && !propertyData &&
                    <div className="h-[25vh] flex flex-col gap-3 justify-center items-center">
                        <TrashIcon className="w-10 h-10 text-gray-300"/>    
                        <p className="text-gray-500 dark:text-white">No property data found</p>
                    </div>
                }
                {
                    !propertyDataLoading && propertyData &&
                    <>
                        <h2 className="text-3xl font-bold flex flex-row gap-1 text-gray-800 dark:text-white">
                            {property?.name?.length === 0  ? 
                                property?.addresses && summarizeAddress(property?.addresses[0]) :
                                property?.name
                            } 
                            <Button variant={"ghost"} className="self-center">
                                <Edit className="self-center text-gray-800 dark:text-white" size={20}/>
                            </Button>
                        </h2>
                        {
                            property?.name?.length !== 0 &&
                            <PropertyDetail Icon={MapPin} value={property?.addresses && summarizeAddress(property?.addresses[0])}/>
                        }
                        <PropertyDetail Icon={User} value={property?.landlords && formatLandlords(property?.landlords)}/>                        
                        <div className="flex flex-row gap-3 mt-1">
                            <PropertyDetail Icon={ParkingSquare} value={property?.features?.parking &&
                                typeof(property?.features?.parking ) === "string" ?
                                capitalizeFirstLetter(property?.features?.parking ?? "") :
                                "Parking Available"
                            }/>
                            <PropertyDetail Icon={Shield} value={property?.features?.security &&
                                typeof(property?.features?.security) === "string" ? 
                                capitalizeFirstLetter(property.features.security ?? ""):
                                "Security Available"
                                }/>
                            <PropertyDetail Icon={Power} value={property?.features?.backup_power && 
                                typeof(property?.features?.backup_power) ?
                                capitalizeFirstLetter(property?.features?.backup_power ?? "") : 
                                "Backup Power Available"}
                                />
                        </div>
                        <p className="text-gray-500 dark:text-white mt-5">{property?.description}</p>             
                        <ColumnsContainer numberOfCols={4} marginClass="mt-5" gapClass="gap-5">
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-gray-700 dark:text-white">STATUS</span>
                                <Pill variant="success" className="mt-1">{property?.status}</Pill>
                            </div>
                            <div>
                                <span className="text-sm font-semibold text-gray-700 dark:text-white">YEAR BUILT </span>
                                <h6 className="text-sm text-gray-800 dark:text-white mt-1">{property?.year_built}</h6>
                            </div>
                            <div>
                                <span className="text-sm font-semibold text-gray-700 dark:text-white">TOTAL AREA </span>
                                <h6 className="text-sm text-gray-800 dark:text-white mt-1">{property?.total_area}</h6>
                            </div>
                            <div>
                                <span className="text-sm font-semibold text-gray-700 dark:text-white">PROPERTY TYPE</span>
                                <h6 className="text-sm text-gray-800 dark:text-white mt-1">{capitalizeFirstLetter(typeof(property?.property_type) === "object" ? property?.property_type.name : "")}</h6>
                            </div>
                        </ColumnsContainer>
                    </>
                }
            </div>
            <div className="main-sm-card">
                <div className="flex justify-between">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Units</h2>
                    <CreateUnitDialog open = {open} setOpen = {setOpen}/>
                </div>
                <div className="mt-5">
                    <TableBase headers={PROPERTY_HEADERS} isLoading={unitsLoading} isError={!!unitsError}>
                        {
                            propertyUnits.length === 0 && !unitsLoading && !unitsError &&
                            <TableRow>
                                <TableCell colSpan={PROPERTY_HEADERS.length} className="text-center">
                                    <div className="flex h-[25vh] flex-col gap-3 justify-center items-center">
                                        <TrashIcon className="w-10 h-10 text-gray-300"/>    
                                        <p className="text-gray-500 dark:text-white">No units found</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        }
                        {   
                            propertyUnits.length > 0 && !unitsLoading && !unitsError && 
                                propertyUnits.map((unit) => (
                                    <TableRow key={unit.id}>
                                        <TableCell className="text-center">{unit.id}</TableCell>
                                        <TableCell className="text-center">{unit.unit_number || "-"}</TableCell>
                                        <TableCell className="text-center">{unit.unit_type || "-"}</TableCell>
                                        <TableCell className="text-center">
                                            <Pill variant="ghost">{capitalizeFirstLetter(unit.status ?? "")}</Pill>
                                        </TableCell>
                                    </TableRow>
                                ))
                        }
                    </TableBase>
                </div>
            </div>
        </div>
  )
}

export default Property