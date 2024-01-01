
<script setup>
import { ref, reactive } from 'vue'

const code = `function(sample) {
    return sample;
}`

const lastMessageInParsed = ref({})
const lastMessageIn = ref('')
const connected = ref(false)
const count = ref(0)

class Sensor {
    key = ""
    unit = ""

    log = false
    history = []

    limit = 20

    constructor(key) {
        this.key = key
    }

    get lastSample() {
        return this.history[this.history.length - 1]
    }

    setValue(value) {
        this.history.push({
            createdAt: Date.now(),
            value
        })
        if (this.history.length > this.limit) {
            this.history.shift()
        }
    }
}

/** @todo sync with localStorage */
const form = reactive({
    code,
    source: 'http',
    sourceType: 'json',
    favorites: [],
    favoritesLog: [],
    sensors: {},
})
const sensorLookup = ref(form.sensors)
window.state = form

const ui = reactive({})

function onError(e) {
    ui.error = e
}

function onData(rawMessage = '') {
    lastMessageIn.value = rawMessage
    count.value++

    if (form.log) console.log({ ...lastMessageInParsed.value })

    // Parse incoming data
    if (form.sourceType === 'csv') {
        lastMessageInParsed.value = convertCsvToObject(rawMessage)
    }
    if (form.sourceType === 'json') {
        /** @todo safe parse */
        lastMessageInParsed.value = JSON.parse(rawMessage)
    }

    // Update sensors
    const _lastMessageIn = lastMessageInParsed.value
    for (const key in _lastMessageIn) {
        if (!sensorLookup.value[key]) {
            sensorLookup.value[key] = reactive(new Sensor(key))
        }
        sensorLookup.value[key].setValue(_lastMessageIn[key])
    }
}

/** armed:0,CH1:910,CH2:1365 */
function convertCsvToObject(csv) {
    const lines = csv.split(',')
    const obj = {}
    for (const line of lines) {
        const [key, value] = line.split(':')
        if (!key) continue

        obj[key] = value
    }
    return obj
}
</script>

<template>
    <aside>
        <section>
            <h1>Select source</h1>
            <p>Current source: {{ form.source }}</p>
            <div>
                {{ form.source }}
                <v-select :items="[{ value: 'serial' }, { value: 'http' }, { value: 'test' }]" v-model="form.source" />
                <!-- <button @click="form.source = 'serial'">Serial</button>
                <button @click="form.source = 'test'">Test</button> -->
            </div>
    
            <section>
                <RandomSource v-if="form.source === 'test'" @data="onData" />
                <div v-if="form.source === 'serial'">
                    <SerialConnection v-model:connected="connected" autoconnect @error="onError" @data="onData" />
                </div>
                <div v-if="form.source === 'http'">
                    <HttpSource @data="onData" />
                </div>
            </section>
    
            <section>
                <h2>Processing</h2>
                <v-select :items="[{ value: 'csv' }, { value: 'json' }, { value: 'custom' }]" v-model="form.sourceType" />
                <!-- <CodeEditor v-model="form.code"/> -->
            </section>
        </section>
    
        <!-- <Graph :values="form.favoritesLog" /> -->
        <!-- {{ form.favoritesLog.map(e=>e.value) }} -->
        <!-- {{ form.favoritesLog }} -->
    
        <section>
            <h2>Statistics</h2>
            {{ count }} messages received
        </section>
    </aside>
    
    <main>
        <section>
            <h2>Values</h2>
            <!-- <PlotValues @click="onSensorClick" :values="lastMessageInParsed" /> -->
            <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                <template v-for="(sensor, key) in form.sensors" :key="key">
                    <button @click.stop="sensor.favorite = !sensor.favorite">
                        <PlotSensor :data="{ value: sensor.lastSample.value, key: sensor.key }"></PlotSensor>
                        <div v-if="sensor.favorite">
                            <Graph :values="sensor.history" />
                        </div>
                    </button>
                </template>
            </div>
        </section>
    
        <section>
            <h2>Raw</h2>
            <!-- <pre>{{ sensorLookup }}</pre> -->
            <CodeEditor :modelValue="lastMessageIn" mode="json" />
        </section>
    </main>
</template>

<style>
aside {
  width: 40%;
  padding-left: 0.5rem;
  margin-left: 0.5rem;
}
</style>