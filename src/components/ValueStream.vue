<template>
    <span :style="{ color: valueColor }">
        {{ value.toFixed(decimals) }}
        
    </span>
</template>

<script setup>
import { ref, watch } from 'vue';

// Define the prop
const props = defineProps({
    value: {
        type: Number,
        required: true
    },
    decimals: { type: Number, default: 2 }
});

// Define a reactive variable to track the color
const valueColor = ref('');

// Watch for changes in the value prop
watch(() => props.value, (newValue, oldValue) => {
    if (newValue > oldValue) {
        valueColor.value = 'red'; // Set color to green if value goes up
    } else if (newValue < oldValue) {
        valueColor.value = 'green'; // Set color to red if value goes down
    }
});
</script>