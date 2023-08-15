import 'xterm/css/xterm.css';

import { WASI, Fd, File, OpenFile, PreopenDirectory } from "@bjorn3/browser_wasi_shim";
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

const poll_oneoff = (in_, out, nsubscriptions) => {
    // throw "my simple: async io not supported";
    console.log('poll_oneoff in_, out, nsubscriptions', in_, out, nsubscriptions);
    return 0;
};

const main = async () => {
    console.log('main start');

    // create terminal element
    const rootE = document.createElement('div');
    rootE.id = 'div-root';
    rootE.style.width = '640px';
    rootE.style.height = '480px';
    rootE.style.border = '1px solid red';
    document.body.appendChild(rootE);

    // create terminal object and attach to the element
    const term = new Terminal({
        convertEol: true,
    });
    console.log('term', term);
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(rootE);
    fitAddon.fit();

    // terminal as a file descriptor
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    class XtermStdio extends Fd {
        constructor(term/*: Terminal*/) {
            super();
            this.term = term;
        }
        fd_write(view8/*: Uint8Array*/, iovs/*: [wasi.Iovec]*/)/*: {ret: number, nwritten: number}*/ {
            let nwritten = 0;
            for (let iovec of iovs) {
                // console.log(iovec.buf, iovec.buf_len, view8.slice(iovec.buf, iovec.buf + iovec.buf_len));
                const buffer = view8.slice(iovec.buf, iovec.buf + iovec.buf_len);
                const msg = decoder.decode(buffer);
                console.log('XtermStdio.fd_write msg', msg);
                // this.term.writeUtf8(buffer);
                // this.term.write(msg);
                this.term.write(buffer);
                nwritten += iovec.buf_len;
            }
            return { ret: 0, nwritten };
        }
    }

    const args = ["bin", "arg1", "arg2"];
    const env = ["FOO=bar"];
    const fds = [
        // new OpenFile(new File([])), // stdin
        // new OpenFile(new File([])), // stdout
        // new OpenFile(new File([])), // stderr
        new XtermStdio(term), // stdin
        new XtermStdio(term), // stdout
        new XtermStdio(term), // stderr
        new PreopenDirectory(".", {
            "example.c": new File(encoder.encode(`#include "a"`)),
            "hello.rs": new File(encoder.encode(`fn main() { println!("Hello World!"); }`)),
            "dep.json": new File(encoder.encode(`{"a": 42, "b": 12}`)),
        }),
    ];
    const wasi = new WASI(args, env, fds);

    const importObject = {
        "wasi_snapshot_preview1": wasi.wasiImport,
    };
    importObject.wasi_snapshot_preview1['poll_oneoff'] = poll_oneoff;
    const wasmUrl = '/test.wasm';
    const wasmModule = await WebAssembly.instantiateStreaming(fetch(wasmUrl), importObject);
    console.log(wasmModule);
    console.log(wasmModule.instance.exports);
    // console.log(m.instance.exports._start());
    wasi.start(wasmModule.instance);

    console.log('main done');
};

main().catch(console.error);
