<template>
    HTTP
    <label>
        url
        {{ form }}
        <input type='text' v-model="form.url" />
    </label>
</template>

<script setup>
import { reactive } from 'vue'

const emit = defineEmits()

const form = reactive({
    url: 'http://192.168.4.1/data.json',
    interval: 3000
})

setInterval(async () => {
    const resp = await fetch(form.url)
    // console.log(resp)
    const data = await resp.text()
    // console.log(data)

    // const raw = JSON.stringify({
    //     key: 'value'
    // })
    emit('data', data)
}, form.interval)
</script>