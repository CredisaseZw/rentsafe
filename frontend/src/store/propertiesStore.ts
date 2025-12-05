import {Store} from "@tanstack/store";

interface PropertiesStore {
    refetchProperties : (()=> void) | null
}

export const propertiesStore = new Store<PropertiesStore>({
    refetchProperties : null
})

export const setPropertiesStore = (fn : ()=> void) =>{
    propertiesStore.setState({refetchProperties : fn})
}

export const getPropertiesStore = () => propertiesStore.state.refetchProperties?.()