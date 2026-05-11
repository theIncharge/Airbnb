import { AsyncLocalStorage } from "async_hooks";

type AsyncLocalStorageType={
    correlationId: string
}

export const asyncLocalStorage=new AsyncLocalStorage<AsyncLocalStorageType>()


export const getCorrelationId=()=>{
    const asyncStorage=asyncLocalStorage.getStore()
return asyncStorage?.correlationId || 'error-while-creating-correlation-id'
}