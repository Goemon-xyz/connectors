import { AvailableNetworks } from "../../../chains/available_networks";

export namespace MorphoConfig {
    export interface ProtocolConfig {
        baseURL: string
        availableNetworks: Array<AvailableNetworks.Chain>;
    }

    export const config: ProtocolConfig = {
       baseURL: "https://api-v2.pendle.finance",
       availableNetworks: ["arbitrum", "ethereum"]
    }
}