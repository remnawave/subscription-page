import { IconExternalLink } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@mantine/core'

import { IAppList } from '@shared/constants/apps/interfaces/app-list.interface'

import { IPlatformGuideProps } from './interfaces/platform-guide.props.interface'
import { BaseInstallationGuideWidget } from './installation-guide.base.widget'

export const InstallationGuideIosWidget = (props: IPlatformGuideProps) => {
    const { t } = useTranslation()

    const renderFirstStepButton = (app: IAppList) => (
        <Button
            component="a"
            href={app.downloadUrl}
            leftSection={<IconExternalLink size={16} />}
            target="_blank"
            variant="light"
        >
            {t('installation-guide.ios.widget.open-in-app-store')}
        </Button>
    )

    return (
        <BaseInstallationGuideWidget
            {...props}
            firstStepDescription={t('installation-guide.ios.widget.appstore-description')}
            firstStepTitle={t('installation-guide.ios.widget.install-and-open-app', {
                appName: '{appName}'
            })}
            platform="ios"
            renderFirstStepButton={renderFirstStepButton}
            secondStepDescription={t('installation-guide.widget.add-ios-subscription-description')}
        />
    )
}
