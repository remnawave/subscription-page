FROM oven/bun:latest AS frontend-builder

WORKDIR /app

COPY package.json .
COPY index.html .
COPY .npmrc .

RUN bun install

COPY . .

RUN bun run start:build


FROM golang:1.24-alpine AS builder

WORKDIR /app

COPY server ./

RUN apk update && apk add --no-cache ca-certificates
RUN update-ca-certificates

RUN go mod download

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /bin/app .


FROM scratch

COPY --from=builder /bin/app /app/app
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

COPY --from=frontend-builder /app/dist ./app/dist

USER 1000

WORKDIR /app

CMD ["./app"]