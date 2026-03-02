import { useSearchParams } from "react-router"

function useURLParamFilter() {
    const [searchParams, setSearchParams] = useSearchParams();
  
    function updateURLFilters(filters: Record<string, string>){
      const new_params = new URLSearchParams(searchParams);

      Object.entries(filters).forEach(([key, value]) =>{
        if(value === "default"  || value === "all"){
          new_params.delete(key);
        } else {
          new_params.set(key, value)
        }
      })

      new_params.set("page", "1")
      setSearchParams(new_params)
    }
    const getUrlParams = () => Object.fromEntries(searchParams.entries());
    const resetFilters = () => {
        const params = getUrlParams();
        if (Object.keys(params).length === 0) return false
        setSearchParams({})
        return true
    }
    
    function setSingleURLParam(param:string, value : string){
      const new_params = new URLSearchParams(searchParams)
      new_params.set(param, value)
      setSearchParams(new_params)
    }

    return{
      updateURLFilters,
      setSingleURLParam,
      resetFilters,
      getUrlParams
    }
}

export default useURLParamFilter