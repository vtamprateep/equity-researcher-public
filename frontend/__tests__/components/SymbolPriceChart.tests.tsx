import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DisplayPeriodModeToggle } from '../../components/SymbolPriceChart';


describe('DisplayPeriodModeToggle', () => {
    it("has initial state set to 1YR", () => {
        const mockCallback = jest.fn();
        render(<DisplayPeriodModeToggle callback={mockCallback} />);

        const button1YR = screen.getByText('1YR');
        expect(button1YR).toHaveClass("px-4 py-2 mr-2 font-semibold border rounded bg-blue-500 text-white");
    })

    it("updates state and calls callback when a button is clicked", () => {
        const mockCallback = jest.fn();
        render(<DisplayPeriodModeToggle callback={mockCallback} />);
    
        const button1WK = screen.getByText('1WK');
        const button1M = screen.getByText('1M');
        const button3M = screen.getByText('3M');
        const button6M = screen.getByText('6M');
    
        // Click on the 1WK button
        fireEvent.click(button1WK);
        expect(mockCallback).toHaveBeenCalledWith('1WK');

        // Click on 1M
        fireEvent.click(button1M);
        expect(mockCallback).toHaveBeenCalledWith('1M');

        // Click on 3M
        fireEvent.click(button3M);
        expect(mockCallback).toHaveBeenCalledWith('3M');

        // Click on 6M
        fireEvent.click(button6M);
        expect(mockCallback).toHaveBeenCalledWith('6M');
    });
});