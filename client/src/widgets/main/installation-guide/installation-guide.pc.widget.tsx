import { IconExternalLink } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { Button, Group } from '@mantine/core'

import { IAppList } from '@shared/constants/apps/interfaces/app-list.interface'

import { IPlatformGuideProps } from './interfaces/platform-guide.props.interface'
import { BaseInstallationGuideWidget } from './installation-guide.base.widget'

export const InstallationGuidePcWidget = (props: IPlatformGuideProps) => {
    const { t } = useTranslation()

    const renderFirstStepButton = (app: IAppList) => (
        <Group>
            {app.downloadPCLinks?.windows && (
                <Button
                    component="a"
                    href={app.downloadPCLinks.windows}
                    leftSection={<IconExternalLink size={16} />}
                    target="_blank"
                    variant="light"
                >
                    Windows
                </Button>
            )}
            {app.downloadPCLinks?.macos && (
                <Button
                    component="a"
                    href={app.downloadPCLinks.macos}
                    leftSection={<IconExternalLink size={16} />}
                    target="_blank"
                    variant="light"
                >
                    macOS
                </Button>
            )}
            {app.downloadPCLinks?.linux && (
                <Button
                    component="a"
                    href={app.downloadPCLinks.linux}
                    leftSection={<IconExternalLink size={16} />}
                    target="_blank"
                    variant="light"
                >
                    Linux
                </Button>
            )}
        </Group>
    )

    return (
        <BaseInstallationGuideWidget
            {...props}
            firstStepDescription={t('installation-guide.pc.widget.download-app-description')}
            firstStepTitle={t('installation-guide.pc.widget.download-app', {
                appName: '{appName}'
            })}
            platform="pc"
            renderFirstStepButton={renderFirstStepButton}
            secondStepDescription={t('installation-guide.widget.add-subscription-pc-description')}
            thirdStepDescription={t('installation-guide.pc.widget.connect-description')}
        />
    )
}
