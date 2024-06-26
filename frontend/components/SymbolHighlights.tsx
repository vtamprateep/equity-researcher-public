import { useEffect, useState, useRef } from 'react';
import { ServerRoutes } from '../util/server';


function LoadingText() {
    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
        setDots(prevDots => (prevDots.length < 3 ? prevDots + '.' : ''));
        }, 500); // Change the interval time to control the speed of the dots

        return () => clearInterval(interval); // Clear interval on component unmount
    }, []);

    return (
        <div className="flex justify-center items-center h-full">
            <div className="text-lg font-semibold mb-2">
                Fetching recent news{dots}
            </div>
        </div>
    );
  };

export function SymbolHighlights({symbolId}: {symbolId: number}) {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [summaryText, setSummaryText] = useState<string>();
    const [summaryCitations, setSummaryCitations] = useState<string[]>([]);
    const [showCitations, setShowCitations] = useState<boolean>(false);
    const abortControllerRef = useRef<AbortController>();

    useEffect(() => {
        // Reset states
        setIsLoading(true);
        setSummaryText(undefined);
        setSummaryCitations([]);
        setShowCitations(false);

        // Set abort controller
        const controller = new AbortController();
        abortControllerRef.current = controller;

        // Retrieve highlights, update isLoading state
        ServerRoutes.getSymbolHighlights(symbolId, controller.signal)
            .then(data => {
                if (data.length > 0) {
                    setSummaryText(data[0].highlights);
                    setSummaryCitations(data[0].documents);
                } else {
                    setSummaryText("No highlights to show.");
                    setSummaryCitations([]);
                }
                setIsLoading(false);
            })
            .catch(error => {
                if (error.name !== 'AbortError') {
                    console.error('Fetch error:', error);
                }
            })

        // Abort request if change symbolId
        return () => { controller.abort(); }
    }, [symbolId])

    if (isLoading) { 
        return (
            <div className="p-4 border border-gray-300 rounded-lg text-white container">
                <LoadingText />
            </div>
        )
    } else {
        return (
            <div className="p-4 border border-gray-300 rounded-lg text-white container">
                <div className="mb-4">
                    <h2 className="text-lg font-semibold mb-2">News Summary</h2>
                    <p style={{whiteSpace: "pre-line"}}>{summaryText}</p>
                </div>
                {showCitations && (
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Citations</h3>
                        <ul>
                            {summaryCitations.map((citation, index) => (
                                <li key={index} className="mb-1">
                                    <a href={citation} target="_blank" rel="noopener noreferrer">{citation}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <div className="flex justify-center">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4"
                        onClick={() => setShowCitations(!showCitations)}
                    >
                        {showCitations ? "Hide Citations" : "See Citations"}
                    </button>
                </div>
            </div>
        )
    }
}
