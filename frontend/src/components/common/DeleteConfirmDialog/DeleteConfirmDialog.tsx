import { BaseModal } from '../BaseModal';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { DeleteConfirmDialogProps } from './DeleteConfirmDialog.types';
import { useTranslation } from 'react-i18next';

export function DeleteConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    loading = false
}: DeleteConfirmDialogProps) {
    const { t } = useTranslation();

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <span>{title}</span>
                </div>
            }
            size="sm"
            footer={
                <>
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        {t('common.cancel')}
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? t('common.deleting') : t('trades.buttons.delete')}
                    </Button>
                </>
            }
        >
            <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    {description}
                </p>
            </div>
        </BaseModal>
    );
}
