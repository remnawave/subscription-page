## Yung Link Subscription Page

Yung Link is a focused subscription cabinet based on Remnawave Subscription Page 7.2.6.
It keeps the Remnawave backend, HttpOnly session flow and non-browser subscription responses unchanged while replacing the browser interface.

The cabinet provides Russian and English copy, subscription status and traffic details, the supported Happ and V2RayTun matrix, plain deep-link imports, manual link copy and a QR code. Individual connection keys remain hidden.

### Local checks

```sh
cd frontend
npm ci
npm test
npm run typecheck
npm run lint:eslint
npm run lint:yung-link-css
npm run start:build
```

The deployable browser configuration is stored in [`config/yung-link.subpage.json`](config/yung-link.subpage.json). Production images are published to GHCR with the full Git commit SHA as the immutable tag.

### Typography

Geist and Geist Mono are bundled locally under the SIL Open Font License. Satoshi is loaded from the official Fontshare API because the ITF Free Font License permits API delivery but does not permit publishing the font files in this public repository or on a public download server.

Learn more about the upstream Remnawave project at [remna.st](https://remna.st/) and [github.com/remnawave/subscription-page](https://github.com/remnawave/subscription-page).

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
