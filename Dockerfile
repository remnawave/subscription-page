FROM golang:1.24-alpine AS builder

WORKDIR /app

COPY server ./

RUN apk update && apk add --no-cache ca-certificates
RUN update-ca-certificates

RUN go mod download

ARG TARGETARCH
RUN CGO_ENABLED=0 GOOS=linux GOARCH=${TARGETARCH} go build -o /bin/app .


FROM scratch

COPY --from=builder /bin/app /app/app
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

COPY ./dist ./app/dist

USER 1000

WORKDIR /app

CMD ["./app"]