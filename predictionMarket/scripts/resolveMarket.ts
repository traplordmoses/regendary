import { Address } from '@ton/core';
import { Market, Outcome } from '../wrappers/Market';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const ui = provider.ui();
    
    // Get market address from user
    const marketAddressStr = await ui.input('Enter market address:');
    const marketAddress = Address.parse(marketAddressStr);
    
    const market = provider.open(Market.createFromAddress(marketAddress));
    
    // Get market info
    const info = await market.getMarketInfo();
    console.log('\n📊 Market Info:');
    console.log('Owner:', info.owner.toString());
    console.log('Status:', info.status === 0 ? 'Active' : 'Resolved');
    console.log('Resolution Time:', new Date(info.resolutionTime * 1000).toISOString());
    console.log('Total YES bets:', info.totalYesBets.toString(), 'nanoTON');
    console.log('Total NO bets:', info.totalNoBets.toString(), 'nanoTON');
    
    if (info.status !== 0) {
        console.log('❌ Market is already resolved!');
        return;
    }
    
    const now = Math.floor(Date.now() / 1000);
    if (now < info.resolutionTime) {
        console.log(`❌ Market cannot be resolved yet. Wait until ${new Date(info.resolutionTime * 1000).toISOString()}`);
        return;
    }
    
    // Get winning outcome from user
    const outcomeStr = await ui.choose('Choose winning outcome:', ['YES', 'NO'], (c) => c);
    const winningOutcome = outcomeStr === 'YES' ? Outcome.yes : Outcome.no;
    
    console.log(`\n🏁 Resolving market with outcome: ${outcomeStr}`);
    
    await market.sendResolveMarket(provider.sender(), {
        winningOutcome: winningOutcome,
    });
    
    console.log('✅ Market resolution sent!');
    console.log('Transaction sent. Wait for confirmation...');
}
