require('dotenv').config();
const { mnemonicToWalletKey, mnemonicToPrivateKey } = require('@ton/crypto');
const { WalletContractV5R1 } = require('@ton/ton');

async function testV5Variants() {
    const mnemonic = process.env.WALLET_MNEMONIC;
    console.log('Testing V5R1 wallet with different configurations...');
    console.log('Expected address: UQCxrL_NNuZF939zg7Sphxniq_8EJPjbnIuCtBqdmC90YXVX\n');
    
    const mnemonicArray = mnemonic.split(' ').filter(word => word.length > 0);
    
    // Method 1: Using mnemonicToWalletKey
    const key1 = await mnemonicToWalletKey(mnemonicArray);
    const wallet1 = WalletContractV5R1.create({ publicKey: key1.publicKey, workchain: 0 });
    console.log('Method 1 (mnemonicToWalletKey):');
    console.log('  Address:', wallet1.address.toString());
    
    // Method 2: Using mnemonicToPrivateKey
    const key2 = await mnemonicToPrivateKey(mnemonicArray);
    const wallet2 = WalletContractV5R1.create({ publicKey: key2.slice(32), workchain: 0 });
    console.log('\nMethod 2 (mnemonicToPrivateKey):');
    console.log('  Address:', wallet2.address.toString());
    
    // Method 3: Different workchain
    const wallet3 = WalletContractV5R1.create({ publicKey: key1.publicKey, workchain: -1 });
    console.log('\nMethod 3 (workchain -1):');
    console.log('  Address:', wallet3.address.toString());
}

testV5Variants().catch(console.error);
