<template>
    <select v-model="selectedOption" @change="$emit('update:modelValue', selectedOption)">
        <option v-for="option in items" :value="option.value" :key="option.value">{{ option.label || option.value }}</option>
    </select>
</template>

<script setup>
import { ref,watch } from 'vue';

const props = defineProps({
    items: {
        type: Array,
        required: true,
    },
    modelValue: {
        type: [String, Number],
        required: true,
    },
});

const emit = defineEmits(['update:modelValue']);

const selectedOption = ref(props.modelValue);
watch(() => props.modelValue, (newValue) => {
    selectedOption.value = newValue;
});
watch(selectedOption, (newValue) => {
    emit('update:modelValue', newValue);
});
</script>

<style scoped>
/* Add custom styles here */
</style>