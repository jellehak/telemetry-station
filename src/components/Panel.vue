<template>
    <div class="panel">
        <div class="panel-header" @click="toggle">
            <h3>
                <slot name="title">
                    {{ title }}
                </slot>
            </h3>
            <button>{{ isOpen ? 'Collapse' : 'Expand' }}</button>
        </div>
        <div v-show="isOpen" class="panel-body">
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    open: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
    }
});

const isOpen = ref(props.open);

function toggle() {
    isOpen.value = !isOpen.value;
}
</script>

<style>
.panel {
    background-color: var(--widget-color);
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 10px;
}
.panel-header {
    /* background-color: #f5f5f5; */
    padding: 10px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.panel-body {
    padding: 10px;
}
</style>
