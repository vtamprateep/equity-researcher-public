import config from "../../next.config.mjs";
import { RouteGetLatestPriceChangeData, SymbolChartData, SymbolHighlights } from "@/types/server";


export class ServerRoutes {

    static GET_REQUEST_CONFIG = {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
    }

    /**
     * Returns chart prices given a symbol ID and start / end dates
     * @param symbolId 
     * @param startDate 
     * @param endDate 
     */
    static async getCharts(symbolId: number, startDate?: Date, endDate?: Date): Promise<SymbolChartData[]> {
        // Construct URL
        if (startDate === undefined) {
            let year = new Date().getFullYear() - 1;
            let month = new Date().getMonth();
            let day = new Date().getDate()
            startDate = new Date(year, month, day);
        }
        if (endDate === undefined) { endDate = new Date() }
        let endpoint = `http://${config?.env?.SERVER_HOST}:${config?.env?.SERVER_PORT}/get_charts/${symbolId}?start_date=${startDate.toISOString().slice(0,10)}&end_date=${endDate.toISOString().slice(0,10)}`

        // Execute request
        return fetch(endpoint, ServerRoutes.GET_REQUEST_CONFIG)
                .then(res => {
                    if (res.status === 200) {
                        return res.json().then(data => data.rows);
                    } else { throw new Error(`Request getCharts failed with status: ${res.status}`) }
                })
                .catch(error => { console.log("Error fetching or processing data:", error) });
    }

    /**
     * Return symbol ID given a symbol string
     * @param symbol
     */
    static async getSymbolId(symbol: string): Promise<{id: number, symbol: string, type: string}[]> {
        let endpoint = `http://${config?.env?.SERVER_HOST}:${config?.env?.SERVER_PORT}/get_symbolid/${symbol.toUpperCase()}`

        return fetch(endpoint, ServerRoutes.GET_REQUEST_CONFIG)
            .then(res => {
                if (res.status === 200) {
                    return res.json().then(data => data.rows);
                } else { throw new Error(`Request getSymbolId failed with status: ${res.status}`) }
            })
            .catch(error => { console.log("Error fetching or processing data:", error) });
    }

    /**
     * Return array containing lineage of symbol IDs
     * @param symbolId
     */
    static async getParentIds(symbolId: number): Promise<{symbol_id: number, symbol: string, type: string}[]> {
        let endpoint = `http://${config?.env?.SERVER_HOST}:${config?.env?.SERVER_PORT}/get_parent_ids/${symbolId}`;
        return fetch(endpoint, ServerRoutes.GET_REQUEST_CONFIG)
            .then(res => {
                if (res.status === 200) {
                    return res.json().then(data => data.rows);
                } else { throw new Error(`Request getParentIds failed with status: ${res.status}`) }
            })
            .catch(error => { console.log("Error fetching or processing data:", error) });
    }

    /**
     * Return past 4 quarters of diluted EPS
     * @param symbolId
     */
    static async getTTMDilutedEPS(symbolId: number) {
        let endpoint = `http://${config?.env?.SERVER_HOST}:${config?.env?.SERVER_PORT}/get_ttm_diluted_eps/${symbolId}`;
        return fetch(endpoint, ServerRoutes.GET_REQUEST_CONFIG)
            .then(res => {
                if (res.status === 200) {
                    return res.json().then(data => data.rows);
                } else { throw new Error(`Request getTTMDilutedEPS failed with status: ${res.status}`) }
            })
            .catch(error => { console.log("Error fetching or processing data:", error) });
    }

    static async getChildIds(symbolId: number, type: string): Promise<{symbol_id: number, type: string}[]> {
        let endpoint = `http://${config?.env?.SERVER_HOST}:${config?.env?.SERVER_PORT}/get_child_ids/${symbolId}?type=${type}`;
        return fetch(endpoint, ServerRoutes.GET_REQUEST_CONFIG)
            .then(res => {
                if (res.status === 200) {
                    return res.json().then(data => data.rows);
                } else { throw new Error(`Request getChildIds failed with status: ${res.status}`) }
            })
            .catch(error => { console.log("Error fetching or processing data:", error) });
    }

    static async getSymbolNames(symbolIdArr: number[]): Promise<{id: number, symbol: string}[]> {
        let endpoint = `http://${config?.env?.SERVER_HOST}:${config?.env?.SERVER_PORT}/get_symbol_names?symbol_ids=${symbolIdArr.join(",")}`;
        return fetch(endpoint, ServerRoutes.GET_REQUEST_CONFIG)
            .then(res => {
                if (res.status === 200) {
                    return res.json().then(data => data.rows);
                } else { throw new Error(`Request getSymbolNames failed with status: ${res.status}`) }
            })
            .catch(error => { console.log("Error fetching or processing data:", error) });
    }

    static async getSymbolHighlights(symbolId: number): Promise<SymbolHighlights[]> {
        let endpoint = `http://${config?.env?.SERVER_HOST}:${config?.env?.SERVER_PORT}/get_symbol_highlights/${symbolId}`
        return fetch(endpoint, ServerRoutes.GET_REQUEST_CONFIG)
            .then(res => {
                if (res.status === 200) {
                    return res.json().then(data => data.rows);
                } else { throw new Error(`Request getSymbolNames failed with status: ${res.status}`) }
            })
            .catch(error => { console.log("Error fetching or processing data:", error) });
    }

    static async getLatestPriceChange(symbolIdArr: number[]): Promise<{symbol_id: number, symbol: string, day_pct_change: number}[]> {
        let endpoint = `http://${config?.env?.SERVER_HOST}:${config?.env?.SERVER_PORT}/get_latest_price_change/?symbol_ids=${symbolIdArr.join(",")}`;
        return fetch(endpoint, ServerRoutes.GET_REQUEST_CONFIG)
            .then(res => {
                if (res.status === 200) {
                    return res.json().then(data => data.rows);
                } else { throw new Error(`Request getLatestPriceChange failed with status: ${res.status}`) }
            })
            .catch(error => { console.log("Error fetching or processing data:", error) });
    }
}