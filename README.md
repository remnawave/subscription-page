## Remnawave Subscription Page

Learn more about Remnawave [here](https://remna.st/).

### Health check

The container ships a `HEALTHCHECK` that performs a TCP connect to `APP_PORT` on
loopback, so `docker ps` and orchestrators report liveness correctly.

An HTTP probe cannot be used for this. The application deliberately destroys the
socket instead of returning a status for unauthorised or unknown requests -- a
request without `X-Forwarded-For` and `X-Forwarded-Proto: https`, or for a
subscription the panel does not know, receives no response at all. That is
intentional, but it means a reverse proxy or monitoring script sees the same
empty reply whether the service is healthy or broken.

The liveness contract is therefore:

| observation | meaning |
| --- | --- |
| connection refused | service is down |
| connection accepted, then closed with no response | service is up, request was rejected |
| HTTP response | service is up, request was accepted |

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
