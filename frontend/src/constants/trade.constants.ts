export const SYMBOLS = {
    GOLD: 'XAU',
    AlsoGOLD: 'GOLD',
    SILVER: 'XAG',
    OIL: 'OIL',
    BTC: 'BTC',
    JPY: 'JPY'
};

export const PIP_VALUES = {
    GOLD: 0.10,      // 1 pip = $0.10 per oz
    COMMODITY: 0.01,
    FOREX_JPY: 0.01,
    FOREX_STD: 0.0001
};

export const LOT_SIZE = {
    STANDARD: 100000,
    GOLD: 100, // 100 oz per lot
};

export const DOLLARS_PER_PIP = {
    STANDARD_LOT: 10,  // Standard forex lot
    GOLD_LOT: 10,      // 100oz * $0.10/oz
};

// Minutes from start of day (00:00)
export const SESSION_TIME = {
    ASIAN_START: 420,  // 07:00
    LONDON_START: 900, // 15:00
    NY_START: 1200,    // 20:00
};

export const INSTRUMENT_TYPES = {
    GOLD: 'gold',
    COMMODITY: 'commodity',
    FOREX: 'forex'
} as const;
