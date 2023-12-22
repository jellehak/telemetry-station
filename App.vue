<template>
    <section>
        <h1>Select source</h1>
        <p>Current source: {{ form.source }}</p>
        <div>
            <button @click="form.source = 'serial'">Serial</button>
            <button @click="form.source = 'test'">Test</button>
        </div>
        <div v-if="form.source === 'serial'">
            <SerialConnection v-model:connected="connected" autoconnect @error="onError" @data="onData" />
        </div>
    </section>

    <RandomSource v-if="form.source === 'test'" @data="onData" />

    <section>
        <h2>Values</h2>
        <PlotValues :serialValues="serialValues" />
    </section>
</template>

<script setup>
import { ref, reactive } from 'vue'

const serialValues = ref({})
const connected = ref(false)
const count = ref(0)
const form = reactive({})
const ui = reactive({})

function onError(e) {
    ui.error = e
}

function onData(e) {
    serialValues.value = convertCsvToObject(e)
    count.value++
    if (form.log) console.log({ ...serialValues.value })
}

/** armed:0,CH1:910,CH2:1365 */
function convertCsvToObject(csv) {
    const lines = csv.split(',')
    const obj = {}
    for (const line of lines) {
        const [key, value] = line.split(':')
        if(!key) continue

        obj[key] = value
    }
    return obj
}
</script>