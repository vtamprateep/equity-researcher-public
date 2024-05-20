export interface SymbolChartData {
    symbol: string,
    close_date: Date,
    adj_close: number
}

export interface SymbolHighlights {
    id: number,
    symbol: string,
    highlights: string,
    documents: string[],
    created_on: Date
}
