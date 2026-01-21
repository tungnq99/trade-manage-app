import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { LoginPage } from '@/pages/auth/LoginPage';
import * as authService from '@/services/auth.service';
import { useAuthStore } from '@/store';

// Mock dependencies
vi.mock('@/services/auth.service');
vi.mock('@/store');
vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('LoginPage', () => {
    const mockSetAuth = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useAuthStore).mockReturnValue(mockSetAuth as any);
    });

    it('should render login form', () => {
        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );

        expect(screen.getByText('TradeManager')).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('should show validation error for empty email', async () => {
        const user = userEvent.setup();

        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );

        const submitButton = screen.getByRole('button', { name: /login/i });

        // Click submit without filling form
        await user.click(submitButton);

        // Should show validation error for required email
        expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });

    it('should show validation error for short password', async () => {
        const user = userEvent.setup();

        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /login/i });

        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, '123'); // Too short
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
        });
    });

    it('should successfully login with valid credentials', async () => {
        const user = userEvent.setup();
        const mockUser = {
            id: '1',
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
            createdAt: new Date().toISOString(),
        };
        const mockToken = 'mock-token';

        vi.mocked(authService.login).mockResolvedValue({
            user: mockUser,
            token: mockToken,
        });

        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /login/i });

        // Fill form with valid data
        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'password123');
        await user.click(submitButton);

        // Should call auth service
        await waitFor(() => {
            expect(authService.login).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
            });
        });

        // Should set auth and navigate
        expect(mockSetAuth).toHaveBeenCalledWith(mockToken, mockUser);
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
});
