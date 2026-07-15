import classes from './ServerError.module.css'

export function ErrorPageComponent() {
    const isEnglish = window.localStorage.getItem('i18nextLng')?.startsWith('en')
    const copy = isEnglish
        ? {
            description: 'Please refresh the page. If the issue continues, contact support.',
            retry: 'Refresh page',
            support: 'Contact support',
            title: 'The page could not be loaded'
        }
        : {
            description:
                  'Обновите страницу. Если ошибка повторится, напишите в поддержку.',
            retry: 'Обновить страницу',
            support: 'Написать в поддержку',
            title: 'Не удалось загрузить страницу'
        }

    const handleRefresh = () => {
        window.location.reload()
    }

    return (
        <div className={classes.root}>
            <main className={classes.card}>
                <div className={classes.brand}>
                    <img alt="" src="/assets/yung-link-logo.svg" />
                    <span>Yung Link</span>
                </div>
                <span className={classes.label}>500</span>
                <h1 className={classes.title}>{copy.title}</h1>
                <p className={classes.description}>{copy.description}</p>
                <div className={classes.actions}>
                    <button className={classes.primaryButton} onClick={handleRefresh} type="button">
                        {copy.retry}
                    </button>
                    <a
                        className={classes.secondaryButton}
                        href="https://t.me/skyy3"
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        {copy.support}
                    </a>
                </div>
            </main>
        </div>
    )
}
