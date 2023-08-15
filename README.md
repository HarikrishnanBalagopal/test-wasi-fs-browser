# Test FS in WASM/WASI with Golang

<img src="./image.png" alt="app screenshot"/>

## Prerequisites

- Go version 1.20
- TinyGo 0.28.1

## Usage

Build the Wasm binary

```
$ make ci
```

and then build the website

```
$ make web
```

Then go to http://localhost:8080 in your browser
