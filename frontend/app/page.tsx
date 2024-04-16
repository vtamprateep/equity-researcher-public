'use client'

import { SymbolProfile, PriceChart } from './components';

export default function Home() {

  return (
    <div>
      <PriceChart symbolId={10}/>
      <SymbolProfile symbolId={10}/>
    </div>);
}
