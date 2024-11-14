<template>
    HTTP
    <label>
        url
        {{ form }}
        <input type='text' v-model="form.url" />
    </label>
    <label>
        Interval
        <input type='number' v-model="form.interval" />ms
    </label>
    {{ form }}
</template>

<script setup>
import { reactive, watch, onMounted, onBeforeUnmount } from 'vue'

const emit = defineEmits()

const form = reactive({
    url: 'http://192.168.4.1/data.json',
    interval: 3000
})

let intervalId

const fetchData = async () => {
    const resp = await fetch(form.url)
    const data = await resp.text()
    emit('data', data)
}

const setupInterval = () => {
    if (intervalId) clearInterval(intervalId)
    intervalId = setInterval(fetchData, form.interval)
}

watch(() => form.interval, setupInterval)

onMounted(setupInterval)
onBeforeUnmount(() => clearInterval(intervalId))
</script>