import config from "../../next.config.mjs";


class ServerRoutes {

    /**
     * Returns chart prices given a symbol ID and start / end dates
     * @param symbolId 
     * @param startDate 
     * @param endDate 
     */
    async getCharts({symbolId, startDate, endDate}: {symbolId: number, startDate?: Date, endDate?: Date}) {
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
        return fetch(endpoint, {
                method: "GET",
                headers: { 'Content-Type': 'application/json' },
            })
                .then(res => {
                    if (res.status === 200) {
                        return res.json()
                    } else { throw new Error(`Request getCharts failed with status: ${res.status}`) }
                })
                .catch(error => { console.log("Error fetching or processing data:", error) });
    }

    /**
     * Return symbol ID given a symbol string
     * @param symbol
     */
    async getSymbolId({symbol}: {symbol: string}) {
        let endpoint = `http://${config?.env?.SERVER_HOST}:${config?.env?.SERVER_PORT}/get_symbolid/${symbol.toUpperCase()}`

        return fetch(endpoint, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' },
        })
            .then(res => {
                if (res.status === 200) {
                    return res.json()
                } else { throw new Error(`Request getSymbolId failed with status: ${res.status}`) }
            })
            .catch(error => { console.log("Error fetching or processing data:", error) });
    }

    /**
     * Return array containing lineage of symbol IDs
     * @param symbolId
     */
    async getParentIds({symbolId}: {symbolId: number}) {
        let endpoint = `http://${config?.env?.SERVER_HOST}:${config?.env?.SERVER_PORT}/get_parent_ids/${symbolId}`;
        fetch(endpoint, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => {
                if (res.status === 200) {
                    return res.json()
                } else { throw new Error(`Request getParentIds failed with status: ${res.status}`) }
            })
            .catch(error => { console.log("Error fetching or processing data:", error) });
    }

    /**
     * Return past 4 quarters of diluted EPS
     * @param symbolId
     */
    async getTTMDilutedEPS({symbolId}: {symbolId: number}) {
        let endpoint = `http://${config?.env?.SERVER_HOST}:${config?.env?.SERVER_PORT}/get_ttm_diluted_eps/${symbolId}`;
        fetch(endpoint, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => {
                if (res.status === 200) {
                    return res.json()
                } else { throw new Error(`Request getTTMDilutedEPS failed with status: ${res.status}`) }
            })
            .catch(error => { console.log("Error fetching or processing data:", error) });
    }

    async getChildIds({symbolId}: {symbolId: number}) {
        let endpoint = `http://${config?.env?.SERVER_HOST}:${config?.env?.SERVER_PORT}/get_child_ids/${symbolId}`;
        fetch(endpoint, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => {
                if (res.status === 200) {
                    return res.json()
                } else { throw new Error(`Request getChildIds failed with status: ${res.status}`) }
            })
            .catch(error => { console.log("Error fetching or processing data:", error) });
    }

    async getSymbolNames({symbolIdArr}: {symbolIdArr: number[]}) {
        let endpoint = `http://${config?.env?.SERVER_HOST}:${config?.env?.SERVER_PORT}/get_symbol_names?symbol_ids=${symbolIdArr.join(",")}`;
        fetch(endpoint, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => {
                if (res.status === 200) {
                    return res.json()
                } else { throw new Error(`Request getSymbolNames failed with status: ${res.status}`) }
            })
            .catch(error => { console.log("Error fetching or processing data:", error) });
    }

    async getSymbolHighlights({symbolId}: {symbolId: number}) {
        let endpoint = `http://${config?.env?.SERVER_HOST}:${config?.env?.SERVER_PORT}/get_symbol_highlights/${symbolId}`
        fetch(endpoint, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => {
                if (res.status === 200) {
                    return res.json()
                } else { throw new Error(`Request getSymbolNames failed with status: ${res.status}`) }
            })
            .catch(error => { console.log("Error fetching or processing data:", error) });
    }
}