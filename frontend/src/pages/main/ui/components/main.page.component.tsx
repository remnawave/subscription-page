import {
    IconBrandAndroid,
    IconBrandApple,
    IconBrandTelegram,
    IconBrandUbuntu,
    IconBrandWindows,
    IconCopy,
    IconDownload,
    IconExternalLink,
    IconLink,
    IconQrcode,
    IconRoute,
    IconShieldCheck,
    IconX
} from '@tabler/icons-react'
import {
    TSubscriptionPageAppConfig,
    TSubscriptionPageButtonConfig,
    TSubscriptionPagePlatformKey
} from '@remnawave/subscription-page-types'
import { useEffect, useMemo, useRef, useState } from 'react'
import { renderSVG } from 'uqr'

import { useAppConfig, useAppConfigStoreActions, useCurrentLang } from '@entities/app-config-store'
import { constructSubscriptionUrl } from '@shared/utils/construct-subscription-url'
import { useSubscription } from '@entities/subscription-info-store'
import { TemplateEngine } from '@shared/utils/template-engine'

import {
    formatDaysLeft,
    formatExpiryDate,
    normalizeLanguage,
    statusTone
} from '../../lib/page-model'
import classes from './main.page.module.css'
import { pageCopy } from '../../i18n/copy'

interface IMainPageComponentProps {
    isMobile: boolean
    platform: TSubscriptionPagePlatformKey | undefined
}

const platformOrder: TSubscriptionPagePlatformKey[] = [
    'android',
    'androidTV',
    'ios',
    'macos',
    'windows',
    'appleTV',
    'linux'
]

const platformIcons: Record<
    TSubscriptionPagePlatformKey,
    React.ComponentType<{ size?: number }>
> = {
    android: IconBrandAndroid,
    androidTV: IconBrandAndroid,
    ios: IconBrandApple,
    macos: IconBrandApple,
    windows: IconBrandWindows,
    appleTV: IconBrandApple,
    linux: IconBrandUbuntu
}

const translate = (value: Record<string, string>, language: 'en' | 'ru'): string =>
    value[language] ?? value.ru ?? value.en ?? Object.values(value)[0] ?? ''

const getAppButtons = (
    app: TSubscriptionPageAppConfig,
    type: TSubscriptionPageButtonConfig['type']
) => app.blocks.flatMap((block) => block.buttons).filter((button) => button.type === type)

const AppIcon = ({ name }: { name: string }) =>
    name.toLowerCase().includes('happ') ? <IconShieldCheck size={21} /> : <IconRoute size={21} />

export const MainPageComponent = ({ platform }: IMainPageComponentProps) => {
    const config = useAppConfig()
    const subscription = useSubscription()
    const currentLanguage = useCurrentLang()
    const { setLanguage } = useAppConfigStoreActions()
    const language = normalizeLanguage(currentLanguage)
    const copy = pageCopy[language]
    const { user } = subscription

    const availablePlatforms = platformOrder.filter((key) =>
        Boolean(config.platforms[key]?.apps.length)
    )
    const [selectedPlatform, setSelectedPlatform] = useState<TSubscriptionPagePlatformKey>(() =>
        platform && availablePlatforms.includes(platform)
            ? platform
            : (availablePlatforms[0] ?? 'android')
    )
    const [isQrOpen, setIsQrOpen] = useState(false)
    const [hasCopied, setHasCopied] = useState(false)
    const closeButtonRef = useRef<HTMLButtonElement>(null)

    const subscriptionUrl = constructSubscriptionUrl(window.location.href, user.shortUuid)
    const selectedApps = config.platforms[selectedPlatform]?.apps ?? []
    const supportUrl = config.brandingSettings.supportUrl || 'https://t.me/skyy3'
    const isUnlimited = user.trafficLimitBytes === '0' || user.trafficLimit === '0'
    const qrCode = useMemo(
        () =>
            renderSVG(subscriptionUrl, {
                whiteColor: '#ECECEE',
                blackColor: '#0E0E10'
            }),
        [subscriptionUrl]
    )

    useEffect(() => {
        document.documentElement.lang = language
    }, [language])

    useEffect(() => {
        if (!isQrOpen) return undefined

        closeButtonRef.current?.focus()
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setIsQrOpen(false)
        }

        document.addEventListener('keydown', handleEscape)
        return () => {
            document.removeEventListener('keydown', handleEscape)
        }
    }, [isQrOpen])

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(subscriptionUrl)
        } catch {
            const field = document.createElement('textarea')
            field.value = subscriptionUrl
            field.style.position = 'fixed'
            field.style.opacity = '0'
            document.body.appendChild(field)
            field.select()
            document.execCommand('copy')
            field.remove()
        }

        setHasCopied(true)
        window.setTimeout(() => setHasCopied(false), 2_000)
    }

    const renderAppButton = (
        button: TSubscriptionPageButtonConfig,
        app: TSubscriptionPageAppConfig,
        index: number
    ) => {
        const isImport = button.type === 'subscriptionLink'
        let href = button.link

        if (isImport) {
            href = TemplateEngine.formatWithMetaInfo(button.link, {
                username: user.username,
                subscriptionUrl
            })
        }
        const label = translate(button.text, language) || (isImport ? copy.import : copy.install)

        return (
            <a
                className={isImport ? classes.primaryButton : classes.secondaryButton}
                href={href}
                key={`${app.name}-${button.type}-${index}`}
                rel={isImport ? undefined : 'noopener noreferrer'}
                target={isImport ? undefined : '_blank'}
            >
                {isImport ? <IconLink size={17} /> : <IconDownload size={17} />}
                {label}
                {!isImport && <IconExternalLink size={15} />}
            </a>
        )
    }

    return (
        <div className={classes.page}>
            <header className={classes.header}>
                <div className={classes.headerInner}>
                    <a aria-label="Yung Link" className={classes.brand} href={subscriptionUrl}>
                        <img alt="" src="/assets/yung-link-logo.svg" />
                        <span>Yung Link</span>
                    </a>

                    <div className={classes.headerActions}>
                        <div aria-label="Language" className={classes.language} role="group">
                            <button
                                aria-pressed={language === 'ru'}
                                data-active={language === 'ru'}
                                onClick={() => setLanguage('ru')}
                                type="button"
                            >
                                RU
                            </button>
                            <button
                                aria-pressed={language === 'en'}
                                data-active={language === 'en'}
                                onClick={() => setLanguage('en')}
                                type="button"
                            >
                                EN
                            </button>
                        </div>
                        <a
                            aria-label={copy.support}
                            className={classes.supportLink}
                            href={supportUrl}
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            <IconBrandTelegram size={18} />
                            <span>{copy.support}</span>
                        </a>
                    </div>
                </div>
            </header>

            <main className={classes.content}>
                <section className={classes.hero}>
                    <div className={classes.intro}>
                        <div>
                            <span className={classes.eyebrow}>{copy.greeting}</span>
                            <h1>{user.username}</h1>
                        </div>
                        <p>{copy.accountHint}</p>
                    </div>

                    <div className={classes.summary}>
                        <div className={classes.stat}>
                            <span className={classes.statLabel}>{copy.expires}</span>
                            <span className={classes.statValue}>
                                {formatExpiryDate(user.expiresAt, language)}
                            </span>
                            <span className={classes.statHint}>
                                {formatDaysLeft(user.daysLeft, language)} {copy.daysLeft}
                            </span>
                        </div>
                        <div className={classes.stat}>
                            <span className={classes.statLabel}>{copy.traffic}</span>
                            <span className={classes.statValue}>
                                {user.trafficUsed} /{' '}
                                {isUnlimited ? copy.unlimited : user.trafficLimit}
                            </span>
                        </div>
                        <div className={classes.stat}>
                            <span className={classes.statLabel}>{copy.status}</span>
                            <span
                                className={`${classes.statValue} ${classes.statusValue}`}
                                data-tone={statusTone(user.userStatus)}
                            >
                                <span className={classes.statusDot} />
                                {copy.statusLabels[user.userStatus]}
                            </span>
                        </div>
                    </div>
                </section>

                <section className={classes.section}>
                    <div className={classes.sectionHeader}>
                        <div>
                            <span className={classes.sectionEyebrow}>01</span>
                            <h2>{copy.choosePlatform}</h2>
                            <p>{copy.choosePlatformHint}</p>
                        </div>
                    </div>

                    <div
                        aria-label={copy.choosePlatform}
                        className={classes.platforms}
                        role="tablist"
                    >
                        {availablePlatforms.map((key) => {
                            const Icon = platformIcons[key]
                            return (
                                <button
                                    aria-selected={selectedPlatform === key}
                                    className={classes.platformButton}
                                    data-active={selectedPlatform === key}
                                    key={key}
                                    onClick={() => setSelectedPlatform(key)}
                                    role="tab"
                                    type="button"
                                >
                                    <Icon size={17} />
                                    {translate(config.platforms[key]!.displayName, language)}
                                </button>
                            )
                        })}
                    </div>

                    {selectedApps.length ? (
                        <div className={classes.appsGrid} role="tabpanel">
                            {selectedApps.map((app) => {
                                const installButtons = getAppButtons(app, 'external')
                                const importButtons = getAppButtons(app, 'subscriptionLink')

                                return (
                                    <article className={classes.appCard} key={app.name}>
                                        <div className={classes.appTitleRow}>
                                            <div className={classes.appIdentity}>
                                                <span className={classes.appIcon}>
                                                    <AppIcon name={app.name} />
                                                </span>
                                                <div>
                                                    <span className={classes.appMeta}>
                                                        {copy.clientLabel}
                                                    </span>
                                                    <h3>{app.name}</h3>
                                                </div>
                                            </div>
                                            {app.featured && (
                                                <span className={classes.recommended}>
                                                    {copy.recommended}
                                                </span>
                                            )}
                                        </div>

                                        <ol className={classes.instructions}>
                                            {app.blocks.map((block, index) => (
                                                <li
                                                    className={classes.instruction}
                                                    key={`${app.name}-${index}`}
                                                >
                                                    <span className={classes.instructionNumber}>
                                                        {index + 1}
                                                    </span>
                                                    <span>
                                                        <strong>
                                                            {translate(block.title, language)}
                                                        </strong>
                                                        {translate(block.description, language)}
                                                    </span>
                                                </li>
                                            ))}
                                        </ol>

                                        <div className={classes.buttonRow}>
                                            {installButtons.map((button, index) =>
                                                renderAppButton(button, app, index)
                                            )}
                                            {importButtons.map((button, index) =>
                                                renderAppButton(button, app, index)
                                            )}
                                        </div>
                                    </article>
                                )
                            })}
                        </div>
                    ) : (
                        <p className={classes.empty}>{copy.noApps}</p>
                    )}
                </section>

                {!config.baseSettings.hideGetLinkButton && (
                    <section className={classes.manualCard}>
                        <div className={classes.manualHeader}>
                            <div>
                                <span className={classes.sectionEyebrow}>02</span>
                                <h2>{copy.manual}</h2>
                                <p>{copy.manualHint}</p>
                            </div>
                        </div>
                        <div className={classes.manualContent}>
                            <label className={classes.srOnly} htmlFor="subscription-link">
                                {copy.manual}
                            </label>
                            <input
                                className={classes.linkField}
                                id="subscription-link"
                                readOnly
                                value={subscriptionUrl}
                            />
                            <div className={classes.manualActions}>
                                <button
                                    className={classes.secondaryButton}
                                    onClick={handleCopy}
                                    type="button"
                                >
                                    <IconCopy size={17} />
                                    {hasCopied ? copy.copied : copy.copy}
                                </button>
                                <button
                                    className={classes.primaryButton}
                                    onClick={() => setIsQrOpen(true)}
                                    type="button"
                                >
                                    <IconQrcode size={17} />
                                    {copy.showQr}
                                </button>
                            </div>
                        </div>
                        <span aria-live="polite" className={classes.srOnly}>
                            {hasCopied ? copy.copied : ''}
                        </span>
                    </section>
                )}

                <section className={classes.supportRow}>
                    <p>{copy.needHelp}</p>
                    <a
                        className={classes.secondaryButton}
                        href={supportUrl}
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        <IconBrandTelegram size={18} />
                        {copy.contactSupport}
                    </a>
                </section>
            </main>

            {isQrOpen && (
                <div
                    aria-labelledby="qr-dialog-title"
                    aria-modal="true"
                    className={classes.dialogBackdrop}
                    onMouseDown={(event) => {
                        if (event.currentTarget === event.target) setIsQrOpen(false)
                    }}
                    role="dialog"
                >
                    <div className={classes.dialog}>
                        <h2 id="qr-dialog-title">{copy.qrTitle}</h2>
                        <p>{copy.qrHint}</p>
                        <img
                            alt={copy.qrTitle}
                            className={classes.qrImage}
                            src={`data:image/svg+xml;utf8,${encodeURIComponent(qrCode)}`}
                        />
                        <div className={classes.dialogActions}>
                            <button
                                className={classes.secondaryButton}
                                onClick={handleCopy}
                                type="button"
                            >
                                <IconCopy size={17} />
                                {hasCopied ? copy.copied : copy.copy}
                            </button>
                            <button
                                className={classes.ghostButton}
                                onClick={() => setIsQrOpen(false)}
                                ref={closeButtonRef}
                                type="button"
                            >
                                <IconX size={17} />
                                {copy.close}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
