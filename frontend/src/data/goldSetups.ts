export interface SetupVariation {
    trend: string;
    cvdTrades: string;
    cvdVolume: string;
    priceAction: string;
    meaning: string;
    action?: string;
}

export interface GoldSetup {
    id: string;
    name: string;
    isTop3Reliable: boolean;
    variations: SetupVariation[];
}

export const goldSetups: GoldSetup[] = [
    {
        id: "1",
        name: "QUÉT THANH KHOẢN",
        isTop3Reliable: true,
        variations: [
            {
                trend: "Tăng",
                cvdTrades: "Bán mạnh đột biến",
                cvdVolume: "Bán mạnh, rút râu hoặc không",
                priceAction: "Quét đáy rồi quay lên",
                meaning: "Tay to quét lệnh dừng lỗ phía dưới",
                action: "Mua khi giá quay lên"
            },
            {
                trend: "Giảm",
                cvdTrades: "Mua mạnh đột biến",
                cvdVolume: "Mua mạnh, rút râu hoặc không",
                priceAction: "Quét đỉnh rồi quay xuống",
                meaning: "Tay to quét lệnh dừng lỗ phía trên",
                action: "Bán khi giá quay xuống"
            }
        ]
    },
    {
        id: "2",
        name: "HẤP THỤ HỒI",
        isTop3Reliable: true,
        variations: [
            {
                trend: "Tăng",
                cvdTrades: "Bán nhẹ",
                cvdVolume: "Đi ngang",
                priceAction: "Hồi nhẹ, không phá đáy trước",
                meaning: "Lệnh bán hồi của retail bị hấp thụ",
                action: "Mua theo xu hướng chính"
            },
            {
                trend: "Giảm",
                cvdTrades: "Mua nhẹ",
                cvdVolume: "Đi ngang",
                priceAction: "Hồi lên, không vượt đỉnh trước",
                meaning: "Lệnh mua hồi của retail bị hấp thụ",
                action: "Bán theo xu hướng chính"
            }
        ]
    },
    {
        id: "3",
        name: "CHẤP NHẬN GIÁ",
        isTop3Reliable: true,
        variations: [
            {
                trend: "Tăng",
                cvdTrades: "Lực mua đều",
                cvdVolume: "Lực mua mạnh, liên tục",
                priceAction: "Đồng pha, breakout",
                meaning: "Thị trường chấp nhận giá cao hơn",
                action: "Mua khi giá điều chỉnh"
            },
            {
                trend: "Giảm",
                cvdTrades: "Lực bán đều",
                cvdVolume: "Lực bán mạnh, liên tục",
                priceAction: "Đồng pha, breakout",
                meaning: "Thị trường chấp nhận giá thấp hơn",
                action: "Bán khi giá hồi"
            }
        ]
    },
    {
        id: "4",
        name: "ĐỠ / CHẶN GIÁ",
        isTop3Reliable: false,
        variations: [
            {
                trend: "Tăng",
                cvdTrades: "Mua tiếp diễn",
                cvdVolume: "Lực mua lớn",
                priceAction: "Giá đi ngang",
                meaning: "Có lực bán chặn",
                action: "Chờ đảo chiều hoặc né"
            },
            {
                trend: "Giảm",
                cvdTrades: "Bán tiếp diễn",
                cvdVolume: "Lực bán lớn",
                priceAction: "Giá đi ngang",
                meaning: "Có lực mua đỡ",
                action: "Chờ đảo chiều hoặc né"
            }
        ]
    },
    {
        id: "5",
        name: "ĐẨY ÂM",
        isTop3Reliable: false,
        variations: [
            {
                trend: "Tăng",
                cvdTrades: "Lực mua ít",
                cvdVolume: "Lực mua mạnh",
                priceAction: "Giá lên đều",
                meaning: "Tay to đẩy âm thầm",
                action: "Mua theo nhịp nhỏ"
            },
            {
                trend: "Giảm",
                cvdTrades: "Lực bán ít",
                cvdVolume: "Lực bán mạnh",
                priceAction: "Giá xuống đều",
                meaning: "Tay to đạp âm thầm",
                action: "Bán theo nhịp nhỏ"
            }
        ]
    },
    {
        id: "6",
        name: "PHÁ GIẢ",
        isTop3Reliable: false,
        variations: [
            {
                trend: "Tăng",
                cvdTrades: "Mua đuổi mạnh",
                cvdVolume: "Không theo hoặc chững",
                priceAction: "Phá cản rồi quay lại",
                meaning: "Bẫy mua",
                action: "Bán ngược"
            },
            {
                trend: "Giảm",
                cvdTrades: "Bán tháo mạnh",
                cvdVolume: "Không theo hoặc chững",
                priceAction: "Phá hỗ trợ rồi quay lại",
                meaning: "Bẫy bán",
                action: "Mua ngược"
            }
        ]
    },
    {
        id: "7",
        name: "KẸT GIÁ",
        isTop3Reliable: false,
        variations: [
            {
                trend: "Trung tính",
                cvdTrades: "Đi ngang",
                cvdVolume: "Đi ngang",
                priceAction: "Đi ngang",
                meaning: "Không phe nào thắng",
                action: "Không giao dịch"
            }
        ]
    }
];

// Export data for easier consumption
export const allSetups = goldSetups;
export const top3Setups = goldSetups.filter(setup => setup.isTop3Reliable);
