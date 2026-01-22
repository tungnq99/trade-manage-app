import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuthStore } from '@/store';
import { updateProfile, changePassword } from '@/services/user.service';
import {
    profileUpdateSchema,
    passwordChangeSchema,
    type ProfileUpdateFormData,
    type PasswordChangeFormData,
} from '@/schemas/account.schema';

export const AccountSettingsForm = () => {
    const { t } = useTranslation();
    const { user, setAuth, token, refreshToken } = useAuthStore();

    // Profile Form
    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        formState: { errors: profileErrors, isSubmitting: isSubmittingProfile },
    } = useForm<ProfileUpdateFormData>({
        resolver: zodResolver(profileUpdateSchema),
        defaultValues: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.email || '',
        },
    });

    // Password Form
    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        reset: resetPassword,
        formState: { errors: passwordErrors, isSubmitting: isSubmittingPassword },
    } = useForm<PasswordChangeFormData>({
        resolver: zodResolver(passwordChangeSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    const onSubmitProfile = async (data: ProfileUpdateFormData) => {
        try {
            const response = await updateProfile(data);
            // Update auth store with new user data
            setAuth(token || '', refreshToken || '', response.user);
            toast.success(t('settings.account.profile.saveSuccess'));
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || 'Failed to update profile';
            toast.error(errorMessage);
        }
    };

    const onSubmitPassword = async (data: PasswordChangeFormData) => {
        try {
            await changePassword(data);
            toast.success(t('settings.account.password.changeSuccess'));
            resetPassword();
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || 'Failed to change password';
            toast.error(errorMessage);
        }
    };

    return (
        <div className="space-y-8 max-w-2xl">
            {/* Profile Section */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold">{t('settings.account.profile.title')}</h3>
                    <p className="text-sm text-muted-foreground">
                        {t('settings.account.profile.description')}
                    </p>
                </div>

                <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* First Name */}
                        <div className="space-y-2">
                            <Label htmlFor="firstName">{t('settings.account.profile.firstName')}</Label>
                            <Input
                                id="firstName"
                                {...registerProfile('firstName')}
                                disabled={isSubmittingProfile}
                            />
                            {profileErrors.firstName && (
                                <p className="text-xs text-destructive">{profileErrors.firstName.message}</p>
                            )}
                        </div>

                        {/* Last Name */}
                        <div className="space-y-2">
                            <Label htmlFor="lastName">{t('settings.account.profile.lastName')}</Label>
                            <Input
                                id="lastName"
                                {...registerProfile('lastName')}
                                disabled={isSubmittingProfile}
                            />
                            {profileErrors.lastName && (
                                <p className="text-xs text-destructive">{profileErrors.lastName.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email">{t('settings.account.profile.email')}</Label>
                        <Input
                            id="email"
                            type="email"
                            {...registerProfile('email')}
                            disabled={isSubmittingProfile}
                        />
                        {profileErrors.email && (
                            <p className="text-xs text-destructive">{profileErrors.email.message}</p>
                        )}
                    </div>

                    <Button type="submit" disabled={isSubmittingProfile}>
                        {isSubmittingProfile ? t('common.saving') : t('settings.account.profile.saveButton')}
                    </Button>
                </form>
            </div>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* Password Section */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold">{t('settings.account.password.title')}</h3>
                    <p className="text-sm text-muted-foreground">
                        {t('settings.account.password.description')}
                    </p>
                </div>

                <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-4">
                    {/* Current Password */}
                    <div className="space-y-2">
                        <Label htmlFor="currentPassword">{t('settings.account.password.currentPassword')}</Label>
                        <Input
                            id="currentPassword"
                            type="password"
                            {...registerPassword('currentPassword')}
                            disabled={isSubmittingPassword}
                        />
                        {passwordErrors.currentPassword && (
                            <p className="text-xs text-destructive">{passwordErrors.currentPassword.message}</p>
                        )}
                    </div>

                    {/* New Password */}
                    <div className="space-y-2">
                        <Label htmlFor="newPassword">{t('settings.account.password.newPassword')}</Label>
                        <Input
                            id="newPassword"
                            type="password"
                            {...registerPassword('newPassword')}
                            disabled={isSubmittingPassword}
                        />
                        {passwordErrors.newPassword && (
                            <p className="text-xs text-destructive">{passwordErrors.newPassword.message}</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">{t('settings.account.password.confirmPassword')}</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            {...registerPassword('confirmPassword')}
                            disabled={isSubmittingPassword}
                        />
                        {passwordErrors.confirmPassword && (
                            <p className="text-xs text-destructive">{passwordErrors.confirmPassword.message}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            {t('settings.account.password.requirements')}
                        </p>
                    </div>

                    <Button type="submit" disabled={isSubmittingPassword}>
                        {isSubmittingPassword ? t('common.saving') : t('settings.account.password.changeButton')}
                    </Button>
                </form>
            </div>
        </div>
    );
};
