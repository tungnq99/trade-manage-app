import { apiClient } from '@/lib/api';
import { CreateTradeDto, Trade, TradeFilters, TradeListResponse } from '@/types/trade.types';

export const tradeService = {
    /**
     * Lấy danh sách trades với filters và pagination
     */
    getTrades: async (filters?: TradeFilters): Promise<TradeListResponse> => {
        const response = await apiClient.get<TradeListResponse>('/api/trades', {
            params: filters,
        });
        return response.data;
    },

    /**
     * Lấy chi tiết 1 trade
     */
    getTradeById: async (id: string): Promise<Trade> => {
        const response = await apiClient.get<{ success: boolean; trade: Trade }>(
            `/api/trades/${id}`
        );
        return response.data.trade;
    },

    /**
     * Tạo trade mới
     */
    createTrade: async (data: CreateTradeDto): Promise<Trade> => {
        const response = await apiClient.post<{
            success: boolean;
            trade: Trade;
            message: string;
        }>('/api/trades', data);
        return response.data.trade;
    },

    /**
     * Update trade
     */
    updateTrade: async (id: string, data: Partial<CreateTradeDto>): Promise<Trade> => {
        const response = await apiClient.put<{
            success: boolean;
            trade: Trade;
            message: string;
        }>(`/api/trades/${id}`, data);
        return response.data.trade;
    },

    /**
     * Xóa trade
     */
    deleteTrade: async (id: string): Promise<void> => {
        await apiClient.delete(`/api/trades/${id}`);
    },
};
