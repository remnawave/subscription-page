package utils

import (
	b64 "encoding/base64"
)

func Base64UrlSafeEncode(data string) string {
	return b64.StdEncoding.EncodeToString([]byte(data))
}

