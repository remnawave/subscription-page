package utils

import (
	"bytes"
	"compress/gzip"
	"io"

	"github.com/klauspost/compress/zstd"
)

func DecompressGzip(data []byte) ([]byte, error) {
	buf := bytes.NewBuffer(data)
	reader, err := gzip.NewReader(buf)
	if err != nil {
		return nil, err
	}
	defer reader.Close()
	
	return io.ReadAll(reader)
}

func DecompressZstd(data []byte) ([]byte, error) {
	decoder, err := zstd.NewReader(bytes.NewReader(data))
	if err != nil {
		return nil, err
	}
	defer decoder.Close()
	
	return io.ReadAll(decoder)
}

func IsBrowser(userAgent string) bool {
	browserKeywords := []string{"Mozilla", "Chrome", "Safari", "Firefox", "Opera", "Edge", "TelegramBot"}
	for _, keyword := range browserKeywords {
		if bytes.Contains([]byte(userAgent), []byte(keyword)) {
			return true
		}
	}
	return false
} 