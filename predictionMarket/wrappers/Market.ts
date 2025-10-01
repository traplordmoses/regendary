import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type MarketConfig = {
    id: number;
    owner: Address;
    status: number;          // 0 = active, 1 = resolved
    resolutionTime: number;  // Unix timestamp
    winningOutcome: number;  // 0 = no, 1 = yes
    totalYesBets: bigint;
    totalNoBets: bigint;
};

export function marketConfigToCell(config: MarketConfig): Cell {
    return beginCell()
        .storeUint(config.id, 32)
        .storeAddress(config.owner)
        .storeUint(config.status, 8)
        .storeUint(config.resolutionTime, 64)
        .storeUint(config.winningOutcome, 8)
        .storeCoins(config.totalYesBets)
        .storeCoins(config.totalNoBets)
        .storeDict(null) // Empty bets dictionary
        .endCell();
}

export const Opcodes = {
    placeBet: 0x1c040e1e,      // "op::place_bet"c
    resolveMarket: 0x7b5c1e42, // "op::resolve_market"c
    claimWinnings: 0x636c6169, // "op::claim_winnings"c
};

export const Outcome = {
    no: 0,
    yes: 1,
};

export class Market implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Market(address);
    }

    static createFromConfig(config: MarketConfig, code: Cell, workchain = 0) {
        const data = marketConfigToCell(config);
        const init = { code, data };
        return new Market(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendPlaceBet(
        provider: ContractProvider,
        via: Sender,
        opts: {
            outcome: number; // 0 for NO, 1 for YES
            value: bigint;   // Amount to bet (must be >= 0.1 TON)
            queryID?: number;
        }
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(Opcodes.placeBet, 32)
                .storeUint(opts.queryID ?? 0, 64)
                .storeUint(opts.outcome, 8)
                .endCell(),
        });
    }

    async sendResolveMarket(
        provider: ContractProvider,
        via: Sender,
        opts: {
            winningOutcome: number; // 0 for NO, 1 for YES
            queryID?: number;
        }
    ) {
        await provider.internal(via, {
            value: 50000000n, // 0.05 TON for gas
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(Opcodes.resolveMarket, 32)
                .storeUint(opts.queryID ?? 0, 64)
                .storeUint(opts.winningOutcome, 8)
                .endCell(),
        });
    }

    async sendClaimWinnings(
        provider: ContractProvider,
        via: Sender,
        opts: {
            queryID?: number;
        }
    ) {
        await provider.internal(via, {
            value: 50000000n, // 0.05 TON for gas
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(Opcodes.claimWinnings, 32)
                .storeUint(opts.queryID ?? 0, 64)
                .endCell(),
        });
    }

    async getID(provider: ContractProvider) {
        const result = await provider.get('get_id', []);
        return result.stack.readNumber();
    }

    async getMarketInfo(provider: ContractProvider) {
        const result = await provider.get('get_market_info', []);
        return {
            owner: result.stack.readAddress(),
            status: result.stack.readNumber(),
            resolutionTime: result.stack.readNumber(),
            winningOutcome: result.stack.readNumber(),
            totalYesBets: result.stack.readBigNumber(),
            totalNoBets: result.stack.readBigNumber(),
        };
    }

    async getUserBet(provider: ContractProvider, userAddress: Address) {
        const result = await provider.get('get_user_bet', [
            { type: 'slice', cell: beginCell().storeAddress(userAddress).endCell() }
        ]);
        return {
            outcome: result.stack.readNumber(),
            amount: result.stack.readBigNumber(),
        };
    }

    async getTotalPool(provider: ContractProvider) {
        const result = await provider.get('get_total_pool', []);
        return result.stack.readBigNumber();
    }
}
