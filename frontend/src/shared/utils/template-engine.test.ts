import { describe, expect, test } from 'vitest'

import { TemplateEngine } from './template-engine'

const metaInfo = {
    subscriptionUrl: 'https://example.com/sub/path?client=surge&name=Remnawave User',
    username: 'alice'
}

describe('TemplateEngine.formatWithMetaInfo', () => {
    test('percent-encodes subscription URLs for Surge install-config links', () => {
        const result = TemplateEngine.formatWithMetaInfo(
            'surge:///install-config?url={{SUBSCRIPTION_LINK}}',
            metaInfo
        )

        expect(result).toBe(
            'surge:///install-config?url=https%3A%2F%2Fexample.com%2Fsub%2Fpath%3Fclient%3Dsurge%26name%3DRemnawave%20User'
        )
    })

    test('keeps regular subscription link templates unchanged', () => {
        const result = TemplateEngine.formatWithMetaInfo(
            'clash://install-config?url={{SUBSCRIPTION_LINK}}',
            metaInfo
        )

        expect(result).toBe(
            'clash://install-config?url=https://example.com/sub/path?client=surge&name=Remnawave User'
        )
    })
})
