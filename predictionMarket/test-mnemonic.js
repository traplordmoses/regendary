require('dotenv').config();
const { mnemonicToWalletKey } = require('@ton/crypto');
const { WalletContractV1R1, WalletContractV1R2, WalletContractV1R3, WalletContractV2R1, WalletContractV2R2, WalletContractV3R1, WalletContractV3R2, WalletContractV4, WalletContractV5R1 } = require('@ton/ton');

async function testMnemonic() {
    const mnemonic = process.env.WALLET_MNEMONIC;
    console.log('Testing mnemonic with different wallet versions...');
    console.log('Expected address: UQCxrL_NNuZF939zg7Sphxniq_8EJPjbnIuCtBqdmC90YXVX\n');
    
    if (!mnemonic) {
        console.error('WALLET_MNEMONIC not found in .env');
        return;
    }
    
    const mnemonicArray = mnemonic.split(' ').filter(word => word.length > 0);
    console.log('Word count:', mnemonicArray.length);
    
    const key = await mnemonicToWalletKey(mnemonicArray);
    
    const versions = [
        { name: 'v1r1', contract: WalletContractV1R1 },
        { name: 'v1r2', contract: WalletContractV1R2 },
        { name: 'v1r3', contract: WalletContractV1R3 },
        { name: 'v2r1', contract: WalletContractV2R1 },
        { name: 'v2r2', contract: WalletContractV2R2 },
        { name: 'v3r1', contract: WalletContractV3R1 },
        { name: 'v3r2', contract: WalletContractV3R2 },
        { name: 'v4', contract: WalletContractV4 },
        { name: 'v5r1', contract: WalletContractV5R1 },
    ];
    
    for (const version of versions) {
        try {
            const wallet = version.contract.create({ publicKey: key.publicKey, workchain: 0 });
            const address = wallet.address.toString();
            const match = address === 'UQCxrL_NNuZF939zg7Sphxniq_8EJPjbnIuCtBqdmC90YXVX' ? ' ✅ MATCH!' : '';
            console.log(`${version.name.padEnd(6)}: ${address}${match}`);
        } catch (e) {
            console.log(`${version.name.padEnd(6)}: Error - ${e.message}`);
        }
    }
}

testMnemonic().catch(console.error);
