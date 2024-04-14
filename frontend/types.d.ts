export {}

declare global {
    interface ChartData {
        labels: string[],
        datasets: {label: string, data: number[]}[]
    }
}