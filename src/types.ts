export interface Collateral {
    symbol: string,
    balance: number,
    wrapped?: number
}

export interface BotAlert {
    bot_type: string,
    address: string,
    level: string,
    title: string,
    description: string
}
