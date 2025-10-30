import { useCurrency } from "@/contexts/CurrencyContext";
import useGetVATSettings from "../apiHooks/useGetVATSettings";
import { useEffect, useState } from "react";
import { handleAxiosError } from "@/lib/utils";
import type { Category, GeneralLedgerAccount, VATRow } from "@/types";
import useGetSalesCategories from "../apiHooks/useGetSalesCategories";
import type { PaginationData } from "@/interfaces";
import useGetGeneralLedgerAccounts from "../apiHooks/useGetGeneralLedgerAccounts";

export default function useSalesItemsForm() {
    const [categoriesPage, setCategoriesPage] = useState(1);
    const [vatPage, setVatPage] = useState(1);
    const [generalLedgerPage, setGeneralLedgerPage]= useState(1);
    const {currencies, currencyLoading, currency} = useCurrency()
    const {categories, categoriesError, categoriesLoading} = useGetSalesCategories(categoriesPage)
    const {generalLedgers, generalLedgersLoading, generalLedgersError} = useGetGeneralLedgerAccounts(generalLedgerPage);
    const {data, isLoading, error} = useGetVATSettings(vatPage); 
    const [generalLedgerAccounts, setGeneralLedgerAccounts] = useState<GeneralLedgerAccount[]>([]);
    const [vatSettings, setVatSettings] = useState<VATRow[]>([])
    const [salesCategories, setSalesCategories] = useState<Category[]>([]);
    const [categoriesPagination, setCategoriesPagination] = useState<PaginationData | undefined>(undefined);
    const [vatPagination, setVatPagination] = useState<PaginationData | undefined>(undefined);
    const [generalLedgerPagination, setGeneralLedgerPagination] = useState<PaginationData | undefined>(undefined)

    useEffect(() => {
        if (handleAxiosError("Error fetching sales categories", categoriesError)) return;
        if (!categories) return;

        setSalesCategories(prev =>
            categoriesPage === 1
            ? categories.results
            : [...prev, ...categories.results]
        );

        setCategoriesPagination({
            count: categories.count,
            next: categories.next,
        });
    }, [categories, categoriesError, categoriesPage]);

    useEffect(()=> {
        if(handleAxiosError("Error fetching VAT settings", error)) return;
        if(data){
            setVatSettings((p)=>
                vatPage === 1 
                ? data.results
                : [...p, ...data.results]);
            setVatPagination({  
                count: data.count,
                next: data.next,})
        }   
    }, [data, error])

     useEffect(()=>{
        if(handleAxiosError("Failed to fetch general ledger accounts", generalLedgersError)) return;
        if(generalLedgers){
            setGeneralLedgerAccounts((p)=>
                generalLedgerPage === 1
            ? generalLedgers.results
            : [...p, ...generalLedgers.results]
            )
            setGeneralLedgerPagination({
                count : generalLedgers.count,
                next : generalLedgers.next
            })
        }

    },[generalLedgers, generalLedgersError])

    const handleLoadMoreCategories = () =>{
        if(categoriesPagination?.next){
            const nextPage = new URL(categoriesPagination.next).searchParams.get("page")
            setCategoriesPage(Number(nextPage))
        }        
        return;
    }
    const handleLoadMoreVAT = () =>{
        if(vatPagination?.next){
            const nextPage = new URL(vatPagination.next).searchParams.get("page")
            setVatPage(Number(nextPage))
        }        
        return;
    }

    const handleLoadMoreGLS = () => {
        if(generalLedgerPagination?.next){
            const nextPage = new URL(generalLedgerPagination.next).searchParams.get("page")
            setGeneralLedgerPage(Number(nextPage))
            }        
            return;
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault()
        const FORM_DATA = new FormData(e.currentTarget);
        const data  = Object.fromEntries(FORM_DATA.entries())
     
        const payload = {
            category : data.itemCategory,
            name : "Wireless Keyboard",
            unit_price_currency : 1,
            price : 29.99,
            unit_name : "Piece",
            tax_configuration : 2,
            sales_account : 1
        }
        console.log(payload)
    }

    return{
        salesCategories,
        categoriesLoading,
        currencies,
        currencyLoading,
        currency,
        vatSettings,
        isLoading,
        categoriesPagination,
        vatPagination,
        generalLedgersLoading,
        generalLedgerAccounts,
        generalLedgerPagination,
        handleLoadMoreGLS,
        handleLoadMoreCategories,
        handleSubmit,
        handleLoadMoreVAT
    }
}
