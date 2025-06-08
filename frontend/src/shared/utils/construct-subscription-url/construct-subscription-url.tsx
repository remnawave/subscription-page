import { joinURL, parseURL, stringifyParsedURL } from 'ufo'

export const constructSubscriptionUrl = (currentUrl: string, shortUuid: string): string => {
    const url = parseURL(currentUrl)

    url.search = ''
    url.hash = ''
    url.auth = ''

    const segments = url.pathname.split('/').filter(Boolean)
    const lastSegment = segments.at(-1)

    if (lastSegment !== shortUuid) {
        segments.pop()
        segments.push(shortUuid)
        url.pathname = joinURL('/', ...segments)
    }

    return stringifyParsedURL(url)
}
