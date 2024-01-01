<template>
    <div>
        <div id="editor"></div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
    modelValue: {
        type: String,
        required: true
    },
    mode: {
        type: String,
        default: 'javascript'
    }
})
const emit = defineEmits(['update:modelValue'])

const editorValue = ref(props.modelValue);

onMounted(() => {
    const script = document.createElement('script');
    script.src =
        'https://cdn.jsdelivr.net/npm/ace-builds@1.4.12/src/ace.js';
    script.async = true;
    script.onload = initializeEditor;
    document.head.appendChild(script);
});

const initializeEditor = () => {
    const editor = ace.edit('editor');
    // Configure the editor as needed
    editor.setValue(editorValue.value); // Set the editor value with modelValue

    editor.getSession().setMode('ace/mode/' + props.mode); // Set the editor mode

    editor.getSession().on('change', () => {
        editorValue.value = editor.getValue();
        emit('update:modelValue', editorValue.value);
    });
};

watch(
    () => props.modelValue,
    (newValue) => {
        const editor = ace.edit('editor');
        editor.setValue(newValue);
    }
);
</script>

<style>
#editor {
    width: 100%;
    height: 200px;
}
</style>
