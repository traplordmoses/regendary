require('dotenv').config();
const { mnemonicToPrivateKey, keyPairFromSecretKey } = require('@ton/crypto');
const { WalletContractV5R1 } = require('@ton/ton');

async function testBlueprintMethod() {
    const mnemonic = process.env.WALLET_MNEMONIC;
    console.log('Testing Blueprint\'s exact method for v5r1...\n');
    console.log('Expected address: UQCxrL_NNuZF939zg7Sphxniq_8EJPjbnIuCtBqdmC90YXVX\n');
    
    const mnemonicArray = mnemonic.split(' ');
    
    // Blueprint's method
    const keyPair = await mnemonicToPrivateKey(mnemonicArray);
    const kp = keyPairFromSecretKey(keyPair.secretKey);
    
    console.log('Testing different networkGlobalId and subwalletNumber combinations:\n');
    
    const configs = [
        { networkGlobalId: -3, subwalletNumber: 0, desc: 'Testnet default (networkGlobalId: -3, subwallet: 0)' },
        { networkGlobalId: -239, subwalletNumber: 0, desc: 'Mainnet default (networkGlobalId: -239, subwallet: 0)' },
        { networkGlobalId: -3, subwalletNumber: 1, desc: 'Testnet subwallet 1' },
        { networkGlobalId: -239, subwalletNumber: 1, desc: 'Mainnet subwallet 1' },
    ];
    
    for (const config of configs) {
        const wallet = WalletContractV5R1.create({
            publicKey: kp.publicKey,
            walletId: {
                networkGlobalId: config.networkGlobalId,
                context: {
                    workchain: 0,
                    subwalletNumber: config.subwalletNumber,
                    walletVersion: 'v5r1',
                },
            },
        });
        
        const address = wallet.address.toString({ testOnly: config.networkGlobalId === -3, bounceable: false });
        const match = address === 'UQCxrL_NNuZF939zg7Sphxniq_8EJPjbnIuCtBqdmC90YXVX' ? ' ✅ MATCH!' : '';
        console.log(`${config.desc}:`);
        console.log(`  ${address}${match}\n`);
    }
}

testBlueprintMethod().catch(console.error);
