BIN_DIR=bin
BIN_PATH=${BIN_DIR}/test
WASM_BIN_PATH=${BIN_DIR}/test.wasm
WAT_PATH=${BIN_DIR}/test.wat

.PHONY: build
build:
	go build -o ${BIN_PATH} .
	# tinygo build -o ${BIN_PATH} .

.PHONY: build-wasm
build-wasm:
	# CGO_ENABLED=0 GOOS=wasip1 GOARCH=wasm go build -o ${WASM_BIN_PATH} .
	CGO_ENABLED=0 tinygo build -o ${WASM_BIN_PATH} -target=wasi .

.PHONY: run
run:
	${BIN_PATH}

.PHONY: run-wasm
run-wasm:
	wasmedge --dir .:. ${WASM_BIN_PATH}
	# wasmer run --mapdir .:. ${WASM_BIN_PATH}
	# wasmtime run --dir . ${WASM_BIN_PATH}

.PHONY: clean
clean:
	rm -rf ${BIN_DIR}

.PHONY: copy
copy:
	cp ${WASM_BIN_PATH} public/assets/wasm/test.wasm

.PHONY: disassemble
disassemble:
	wasm2wat ${WASM_BIN_PATH} > ${WAT_PATH}

.PHONY: serve
serve:
	cd public/dist && python3 -m http.server 8080

.PHONY: ci
ci: clean build build-wasm disassemble copy
	echo 'done'

.PHONY: web
web:
	cd public && pnpm install && pnpm run build && pnpm run serve
