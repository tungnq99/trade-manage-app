import React from 'react';

export interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: React.ReactNode;
    description?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}
