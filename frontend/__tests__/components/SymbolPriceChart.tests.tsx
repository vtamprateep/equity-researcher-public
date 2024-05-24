import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DisplayPeriodModeToggle } from '../../components/SymbolPriceChart'; // Adjust the import path as needed


describe('DisplayPeriodModeToggle', () => {
    test('it updates state and calls callback when a button is clicked', () => {
        const mockCallback = jest.fn();
    
        render(<DisplayPeriodModeToggle callback={mockCallback} />);
    
        const button1WK = screen.getByText('1WK');
        const button1M = screen.getByText('1M');
        const button3M = screen.getByText('3M');
        const button6M = screen.getByText('6M');
        const button1YR = screen.getByText('1YR');
    
        // Check initial state
        expect(button1YR).toHaveClass('bg-blue-500 text-white');
        expect(button1WK).toHaveClass('bg-white text-blue-500');
    
        // Click on the 1WK button
        fireEvent.click(button1WK);
    
        // Check state and callback
        expect(mockCallback).toHaveBeenCalledWith('1WK');
        expect(button1WK).toHaveClass('bg-blue-500 text-white');
        expect(button1YR).toHaveClass('bg-white text-blue-500');
    
        // Click on the 1M button
        fireEvent.click(button1M);
    
        // Check state and callback
        expect(mockCallback).toHaveBeenCalledWith('1M');
        expect(button1M).toHaveClass('bg-blue-500 text-white');
        expect(button1WK).toHaveClass('bg-white text-blue-500');
    
        // Repeat for other buttons if needed
    });
});