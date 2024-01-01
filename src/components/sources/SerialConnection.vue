<script setup>
import {onUnmounted, defineProps, defineEmits} from 'vue'

/** 
 * TODO
 * - handle close https://developer.chrome.com/docs/capabilities/serial#close-port
 * - expose serial
 * - flexible transform to handle different formats
 */
const emit = defineEmits(['data', 'error'])

const props = defineProps({
    autoconnect: Boolean
})

navigator.serial.addEventListener("connect", handleConnect);
navigator.serial.addEventListener("disconnect", handleDisconnect);

function handleConnect(e) {
    console.log("handleConnect", e)
    // Connect to `e.target` or add it to a list of available ports.
    if (props.autoconnect) {
        autoConnectToFirstPort()
    }
}
function handleDisconnect(e) {
    console.log("handleDisconnect", e)
}

onUnmounted(() => {
    navigator.serial.removeEventListener("connect", handleConnect);
    navigator.serial.removeEventListener("disconnect", handleDisconnect);
})


if (props.autoconnect) {
    autoConnectToFirstPort()
}

function autoConnectToFirstPort() {
    navigator.serial.getPorts().then((ports) => {
        console.log('autoConnectToFirstPort')
        if (ports.length === 0) {
            console.warn('No serial ports found')
            return
        }
        // Initialize the list of available ports with `ports` on page load.
        connect(ports[0])
    });
}

class LineBreakTransformer {
    constructor() {
        // A container for holding stream data until a new line.
        this.chunks = "";
    }

    transform(chunk, controller) {
        // Append new chunks to existing chunks.
        this.chunks += chunk;
        // For each line breaks in chunks, send the parsed lines out.
        const lines = this.chunks.split("\r\n");
        this.chunks = lines.pop();
        lines.forEach((line) => controller.enqueue(line));
    }

    flush(controller) {
        // When the stream is closed, flush any remaining chunks out.
        controller.enqueue(this.chunks);
    }
}

// https://developer.chrome.com/docs/capabilities/serial
async function requestPort() {
    try {
        const port = await navigator.serial.requestPort();
        connect(port)
    } catch (error) {
        console.error('Error connecting to serial port:', error);
        emit('error', error);
    }
}

async function connect(port) {
    await port.open({ baudRate: 9600 });
    console.log('Serial port connected');

    // Use the port for reading and writing data
    while (port.readable) {
        // const reader = port.readable.getReader();
        const textDecoder = new TextDecoderStream();
        const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
        const reader = textDecoder.readable
            .pipeThrough(new TransformStream(new LineBreakTransformer()))
            .getReader();

        try {
            while (true) {
                const { value, done } = await reader.read();
                if (done) {
                    // Allow the serial port to be closed later.
                    reader.releaseLock();
                    break;
                }

                // console.log(value)
                emit('data', value)
                // Do something with |value|...
            }
        } catch (error) {
            // Handle |error|...
            emit('error', error)
        } finally {
            reader.releaseLock();
        }
    }
}

function close() {
    // TODO
}
</script>

<template>
    <div>
        <!-- add button -->
        <button @click="requestPort">Connect</button>
        <button @click="close">Close</button>
    </div>
</template>