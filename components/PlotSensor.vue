<template>
    <a-card :class="isChanged && 'blink_me'">
        <small>{{ data.key }}</small>

        <div>
            <b>
                {{ data.value }}
            </b>
        </div>
        <!-- add units? -->
    </a-card>
</template>

<script setup>
import { watch, ref } from 'vue';

const props = defineProps({
    data: Object
})

let lastSampleValue = null

const isChanged = ref(false)

watch(() => props.data, () => {
    isChanged.value = false
    // change?
    if (lastSampleValue !== props.data.value) {
        isChanged.value = true
    }
    lastSampleValue = props.data.value
})
</script>

<style>
a-card {
    padding: 5px;
    display: block;
    width: 50px;
    height: 50px;
    background: rgba(0, 128, 0, 0.186);
}

.blink_me {
    animation: blinker 1s linear infinite;
}

@keyframes blinker {
    50% {
        /* opacity: 0.5; */
        background: yellow;
    }
}
</style>