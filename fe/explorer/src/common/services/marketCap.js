import { apiServiceMarket } from "./api";
 


export const marketCap = {

     getMarketDataPrice(){
        return apiServiceMarket.get(`v3/coins/script-network`, {})
    }
}
 