import { Address } from '@ton/core';
import { Market } from '../wrappers/Market';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const ui = provider.ui();
    
    // Get market address from user
    const marketAddressStr = await ui.input('Enter market address:');
    const marketAddress = Address.parse(marketAddressStr);
    
    const market = provider.open(Market.createFromAddress(marketAddress));
    
    // Get market info
    console.log('\n📊 Market Information\n');
    console.log('Address:', marketAddress.toString());
    
    const id = await market.getID();
    console.log('Market ID:', id);
    
    const info = await market.getMarketInfo();
    console.log('\nOwner:', info.owner.toString());
    console.log('Status:', info.status === 0 ? '🟢 Active' : '🔴 Resolved');
    console.log('Resolution Time:', new Date(info.resolutionTime * 1000).toISOString());
    
    if (info.status === 1) {
        console.log('Winning Outcome:', info.winningOutcome === 1 ? '✅ YES' : '❌ NO');
    }
    
    console.log('\n💰 Betting Pool:');
    console.log('Total YES bets:', (Number(info.totalYesBets) / 1e9).toFixed(4), 'TON');
    console.log('Total NO bets:', (Number(info.totalNoBets) / 1e9).toFixed(4), 'TON');
    
    const totalPool = await market.getTotalPool();
    console.log('Total pool:', (Number(totalPool) / 1e9).toFixed(4), 'TON');
    
    // Calculate odds
    if (info.totalYesBets > 0n && info.totalNoBets > 0n) {
        const yesOdds = Number(totalPool) / Number(info.totalYesBets);
        const noOdds = Number(totalPool) / Number(info.totalNoBets);
        console.log('\n📈 Current Odds:');
        console.log('YES:', yesOdds.toFixed(2) + 'x');
        console.log('NO:', noOdds.toFixed(2) + 'x');
    }
    
    // Check user's bet if connected
    const userAddress = provider.sender().address;
    if (userAddress) {
        try {
            const userBet = await market.getUserBet(userAddress);
            if (userBet.outcome !== -1) {
                console.log('\n🎲 Your Bet:');
                console.log('Outcome:', userBet.outcome === 1 ? 'YES' : 'NO');
                console.log('Amount:', (Number(userBet.amount) / 1e9).toFixed(4), 'TON');
            }
        } catch (e) {
            // User has no bet
        }
    }
}
