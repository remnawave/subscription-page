# Yung Link subpage configuration

`yung-link.subpage.json` is the browser configuration for the Yung Link subscription cabinet.
It keeps individual connection keys hidden, allows copying the common subscription link and exposes only Happ and V2RayTun according to the supported platform matrix.

To rebuild it from a Remnawave 7.2.6 config export:

```sh
node tools/build-yung-link-config.mjs path/to/export.json config/yung-link.subpage.json
```

The generated config contains no credentials or user data. Production response headers and deployment values are managed separately from this file.
