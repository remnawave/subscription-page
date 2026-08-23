## Remnawave Subscription Page

### INCY encrypted subscription links

This fork adds support for INCY encrypted deep links (`incy://crypt1/...`), similar to
the existing `HAPP_CRYPT4_LINK` placeholder for Happ.

**Setup:**
1. Install the dependency in `frontend`: `npm install @incy/link-encoder`
2. In your app-config JSON (Subscription Page settings), use the placeholder
   `{{INCY_CRYPT1_LINK}}` as the `link` value for an INCY button.

Encryption happens entirely client-side, the same way `HAPP_CRYPT3_LINK` /
`HAPP_CRYPT4_LINK` already work: the subscription URL is built from the already-loaded,
already-validated subscription info (`constructSubscriptionUrl`), never from
unvalidated user input, so there's no backend endpoint involved and nothing for it to
expose.

Learn more about Remnawave [here](https://docs.rw/).

# Contributors

Check [open issues](https://github.com/remnawave/subscription-page/issues) to help the progress of this project.

<p align="center">
Thanks to the all contributors who have helped improve Remnawave:
</p>
<p align="center">
<a href="https://github.com/remnawave/subscription-page/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=remnawave/subscription-page" />
</a>
</p>
