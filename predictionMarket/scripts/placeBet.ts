import { toNano, Address } from '@ton/core';
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
    console.log('Status:', info.status === 0 ? 'Active' : 'Resolved');
    console.log('Resolution Time:', new Date(info.resolutionTime * 1000).toISOString());
    console.log('Total YES bets:', info.totalYesBets.toString(), 'nanoTON');
    console.log('Total NO bets:', info.totalNoBets.toString(), 'nanoTON');
    console.log('Total pool:', (info.totalYesBets + info.totalNoBets).toString(), 'nanoTON');
    
    if (info.status !== 0) {
        console.log('❌ Market is already resolved!');
        return;
    }
    
    // Get bet details from user
    const outcomeStr = await ui.choose('Choose outcome:', ['YES', 'NO'], (c) => c);
    const outcome = outcomeStr === 'YES' ? Outcome.yes : Outcome.no;
    
    const amountStr = await ui.input('Enter bet amount in TON (minimum 0.1):');
    const amount = toNano(amountStr);
    
    if (amount < toNano('0.1')) {
        console.log('❌ Minimum bet is 0.1 TON');
        return;
    }
    
    console.log(`\n🎲 Placing bet: ${amountStr} TON on ${outcomeStr}`);
    
    await market.sendPlaceBet(provider.sender(), {
        outcome: outcome,
        value: amount,
    });
    
    console.log('✅ Bet placed successfully!');
    console.log('Transaction sent. Wait for confirmation...');
}
