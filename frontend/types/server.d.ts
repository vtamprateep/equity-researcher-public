export interface SymbolChartData {
    symbol: string,
    close_date: Date,
    adj_close: number
}

export interface SymbolHighlights {
    highlights: string,
    documents: string[],
    created_on: Date
}
