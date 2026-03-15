import apiClient from './client';

export interface PaymentIntentResponse {
    clientSecret: string;
    paymentIntentId: string;
}

export const paymentApi = {
    // Create payment intent
    createPaymentIntent: async (
        amount: number,
        bookingRef: string
    ): Promise<PaymentIntentResponse> => {
        const response = await apiClient.post<PaymentIntentResponse>('/api/payments/create', {
            amount,
            bookingRef,
        });
        return response.data;
    },
};
