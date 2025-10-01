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
    const info = await market.getMarketInfo();
    console.log('\n📊 Market Info:');
    console.log('Status:', info.status === 0 ? 'Active' : 'Resolved');
    console.log('Winning Outcome:', info.winningOutcome === 1 ? 'YES' : 'NO');
    console.log('Total YES bets:', info.totalYesBets.toString(), 'nanoTON');
    console.log('Total NO bets:', info.totalNoBets.toString(), 'nanoTON');
    
    if (info.status !== 1) {
        console.log('❌ Market is not resolved yet!');
        return;
    }
    
    // Get user's bet
    const userAddress = provider.sender().address;
    if (!userAddress) {
        console.log('❌ Could not get user address');
        return;
    }
    
    const userBet = await market.getUserBet(userAddress);
    
    if (userBet.outcome === -1) {
        console.log('❌ You have no bet in this market!');
        return;
    }
    
    console.log('\n🎲 Your Bet:');
    console.log('Outcome:', userBet.outcome === 1 ? 'YES' : 'NO');
    console.log('Amount:', userBet.amount.toString(), 'nanoTON');
    
    if (userBet.outcome !== info.winningOutcome) {
        console.log('❌ You bet on the losing outcome. No winnings to claim.');
        return;
    }
    
    // Calculate expected winnings
    const totalPool = info.totalYesBets + info.totalNoBets;
    const totalWinningBets = info.winningOutcome === 1 ? info.totalYesBets : info.totalNoBets;
    const expectedWinnings = (userBet.amount * totalPool) / totalWinningBets;
    
    console.log('\n💰 Expected Winnings:', expectedWinnings.toString(), 'nanoTON');
    console.log(`(~${(Number(expectedWinnings) / 1e9).toFixed(4)} TON)`);
    
    const confirm = await ui.choose('Claim your winnings?', ['Yes', 'No'], (c) => c);
    
    if (confirm === 'No') {
        console.log('Cancelled.');
        return;
    }
    
    console.log('\n💸 Claiming winnings...');
    
    await market.sendClaimWinnings(provider.sender(), {});
    
    console.log('✅ Claim transaction sent!');
    console.log('Wait for confirmation to receive your winnings...');
}
