import { toNano, Address } from '@ton/core';
import { Market } from '../wrappers/Market';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    // Get the deployer's address
    const deployerAddress = provider.sender().address;
    
    if (!deployerAddress) {
        throw new Error('Deployer address is required');
    }
    
    // Set resolution time to 24 hours from now
    const resolutionTime = Math.floor(Date.now() / 1000) + (24 * 60 * 60);
    
    const market = provider.open(
        Market.createFromConfig(
            {
                id: Math.floor(Math.random() * 10000),
                owner: deployerAddress,
                status: 0, // Active
                resolutionTime: resolutionTime,
                winningOutcome: 0, // Not resolved yet
                totalYesBets: 0n,
                totalNoBets: 0n,
            },
            await compile('Market')
        )
    );

    await market.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(market.address);

    console.log('✅ Market deployed successfully!');
    console.log('Market ID:', await market.getID());
    console.log('Market Address:', market.address.toString());
    console.log('Owner:', deployerAddress.toString());
    console.log('Resolution Time:', new Date(resolutionTime * 1000).toISOString());
    console.log('\nYou can now place bets on this market!');
}
