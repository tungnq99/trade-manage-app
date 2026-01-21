import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RiskParametersForm } from './components/RiskParametersForm';
import { RiskCalculator } from './components/RiskCalculator';
import { DisplaySettingsForm } from './components/DisplaySettingsForm';
import { AccountSettingsForm } from './components/AccountSettingsForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCapitalStore } from '@/store/useCapitalStore';


const SettingsPage = () => {
    const { t } = useTranslation();
    const { fetchSummary } = useCapitalStore();

    // Fetch capital summary once for all settings tabs
    useEffect(() => {
        fetchSummary();
    }, [fetchSummary]);

    return (
        <div className="container mx-auto py-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{t('settings.title')}</h1>
                <p className="text-muted-foreground">{t('settings.subtitle')}</p>
            </div>

            <Tabs defaultValue="capital" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="capital">{t('settings.tabs.capital')}</TabsTrigger>
                    <TabsTrigger value="account">{t('settings.tabs.account')}</TabsTrigger>
                    <TabsTrigger value="display">{t('settings.tabs.display')}</TabsTrigger>
                </TabsList>

                <TabsContent value="capital" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('settings.capital.risk.title')}</CardTitle>
                            <CardDescription>
                                {t('settings.capital.risk.description')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <RiskParametersForm />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t('settings.capital.calculator.title')}</CardTitle>
                            <CardDescription>
                                {t('settings.capital.calculator.description')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <RiskCalculator />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Account Tab */}
                <TabsContent value="account" className="space-y-6">
                    <Card>
                        <CardContent className="pt-6">
                            <AccountSettingsForm />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Display Tab */}
                <TabsContent value="display" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('settings.display.title')}</CardTitle>
                            <CardDescription>
                                {t('settings.display.description')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DisplaySettingsForm />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default SettingsPage;
