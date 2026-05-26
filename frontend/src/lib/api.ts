import axios from 'axios';
import type { PredictionResult, ChatResponse, ChatRequest } from '@/types';

// API base URL - using environment variable for production
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Predict plant disease from image
 */
export async function predictDisease(file: File, token: string | null = null): Promise<PredictionResult> {
    const formData = new FormData();
    formData.append('file', file);

    const headers: Record<string, string> = {
        'Content-Type': 'multipart/form-data',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await axios.post(`${API_URL}/api/predict/`, formData, {
            headers,
            timeout: 30000, // 30 second timeout
        });

        return response.data;
    } catch (error: any) {
        console.error('Prediction API error:', error);
        throw new Error(
            error.response?.data?.detail ||
            error.message ||
            'Failed to predict disease. Please try again.'
        );
    }
}

/**
 * Chat with AI assistant
 */
export async function chatWithAI(params: ChatRequest): Promise<ChatResponse> {
    try {
        const response = await axios.post(`${API_URL}/api/chat/`, params, {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 30000, // 30 second timeout
        });

        return response.data;
    } catch (error: any) {
        console.error('Chat API error:', error);
        throw new Error(
            error.response?.data?.detail ||
            error.message ||
            'Failed to get response from AI. Please try again.'
        );
    }
}

/**
 * Get supported plants list
 */
export async function getSupportedPlants(): Promise<string[]> {
    try {
        const response = await axios.get(`${API_URL}/api/predict/supported-plants`);
        return response.data.plants || [];
    } catch (error: any) {
        console.error('Supported plants API error:', error);
        return [];
    }
}

/**
 * Health check
 */
export async function healthCheck(): Promise<{ status: string }> {
    try {
        const response = await axios.get(`${API_URL}/health`, {
            timeout: 5000,
        });
        return response.data;
    } catch (error: any) {
        console.error('Health check failed:', error);
        throw new Error('Backend service is unavailable');
    }
}
