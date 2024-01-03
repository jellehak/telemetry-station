<script setup>
import { ref, reactive, watch } from 'vue'

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
            createdAt: new Date(), // Date.now(),
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
    source: 'test',
    sourceType: 'csv',
    // sensors: {},
})
const state = reactive({
    sensors: {},
})

const sensorLookup = ref(state.sensors)
window.state = form

watch(() => form.source, (source) => {
    console.log({ source })
    // add hash to url
    window.location.hash = source
})

watch(form, (source) => {
    console.log('change')
    // Reset sensors
    sensorLookup.value = {}
})

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
            <!-- <p>Current source: {{ form.source }}</p> -->
            <div>
                <label>
                    source
                    <v-select :items="[{ value: 'serial' }, { value: 'http' }, { value: 'RandomSource' }, { value: 'RandomJsonSource' }]" v-model="form.source" />
                </label>
                <!-- <button @click="form.source = 'serial'">Serial</button>
                <button @click="form.source = 'test'">Test</button> -->
            </div>
    
            <section>
                <RandomSource v-if="form.source === 'RandomSource'" @data="onData" />
                <RandomJsonSource v-if="form.source === 'RandomJsonSource'" @data="onData" />
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

        <section>
            <h2>Raw</h2>
            <pre>{{ lastMessageIn }}</pre>
            <!-- <CodeEditor :modelValue="lastMessageIn" mode="json" /> -->
        </section>
    </aside>
    
    <main>
        <section>
            <h2>Sensors ({{ Object.entries(sensorLookup).length }})</h2>
            <!-- <PlotValues @click="onSensorClick" :values="lastMessageInParsed" /> -->
            <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                <template v-for="(sensor, key) in sensorLookup" :key="key">
                    <button @click.stop="sensor.favorite = !sensor.favorite">
                        <PlotSensor :data="{ value: sensor.lastSample.value, key: sensor.key }"></PlotSensor>
                        <Graph :values="sensor.history" style="height: 50px"/>
                        <div v-if="sensor.favorite">
                            <!-- {{ sensor.history }} -->
                            <Table :items="sensor.history" :columns="['value','createdAt']"/>
                        </div>
                    </button>
                </template>
            </div>
        </section>
    
       
    </main>
</template>

<style>
/* @import url("https://cdn.jsdelivr.net/gh/yegor256/tacit@gh-pages/tacit-css-1.6.0.min.css"); */
/* @import url("https://unpkg.com/mvp.css"); */

/* aside {
  width: 40%;
  padding-left: 0.5rem;
  margin-left: 0.5rem;
} */

/* default, light mode styling */
body {
  --background-color: #1f1f1f;
  --text-color: #ebebeb;
  --title-background-color: #111;
  --title-text-color: #ebebeb;
  --widget-color: #424242;
  --hover-color: #4f4f4f;
  --focus-color: #595959;
  --number-color: #2cc9ff;
  --string-color: #a2db3c;
  --font-size: 11px;
  --input-font-size: 11px;
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial,
    sans-serif;
  --font-family-mono: Menlo, Monaco, Consolas, "Droid Sans Mono", monospace;
  --padding: 4px;
  --spacing: 4px;
  --widget-height: 20px;
  --title-height: calc(var(--widget-height) + var(--spacing) * 1.25);
  --name-width: 45%;
  --slider-knob-width: 2px;
  --slider-input-width: 27%;
  --color-input-width: 27%;
  --slider-input-min-width: 45px;
  --color-input-min-width: 45px;
  --folder-indent: 7px;
  --widget-padding: 0 0 0 3px;
  --widget-border-radius: 2px;
  --checkbox-size: calc(var(--widget-height) * 0.75);
  --scrollbar-width: 5px;
  color: var(--text-color);
  font-family: var(--font-family);
  font-size: var(--font-size);
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  text-align: left;
  touch-action: manipulation;
  user-select: none;
  -webkit-user-select: none;
}

body {
  background-color: #fff;
  color: #000;
}

/* if user switches the system settings to dark mode */
/* this media query will be applied */
@media (prefers-color-scheme: dark) {
  body {
    background-color: #000;
    color: #fff;
  }
}
</style>