// Debug script to see what Blueprint is doing
const fs = require('fs');
const path = require('path');

// Check .env file
const envPath = path.join(__dirname, '.env');
console.log('=== Checking .env file ===');
console.log('Path:', envPath);
console.log('Exists:', fs.existsSync(envPath));

if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    console.log('\n.env content:');
    console.log(content);
    console.log('\n.env content (with visible spaces):');
    console.log(content.replace(/ /g, '·'));
}

// Check environment variables
console.log('\n=== Environment Variables ===');
console.log('WALLET_MNEMONIC:', process.env.WALLET_MNEMONIC);
console.log('WALLET_VERSION:', process.env.WALLET_VERSION);

// Try loading with dotenv
require('dotenv').config();
console.log('\n=== After dotenv.config() ===');
console.log('WALLET_MNEMONIC:', process.env.WALLET_MNEMONIC);
console.log('WALLET_VERSION:', process.env.WALLET_VERSION);

if (process.env.WALLET_MNEMONIC) {
    const words = process.env.WALLET_MNEMONIC.split(' ').filter(w => w.length > 0);
    console.log('\nWord count:', words.length);
    console.log('Words:', words);
}
