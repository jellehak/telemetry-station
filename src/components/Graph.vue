<template>
    <div>
        <canvas ref="chart"></canvas>
    </div>
</template>

<script setup>
import { ref, onMounted, toRef } from 'vue';

const props = defineProps({
  values: {
    type: Array,
    required: true
  }
});

const values = toRef(props, 'values');

onMounted(() => {
    renderChart();
});

const chart = ref();

function renderChart() {
    const canvas = chart.value;
    const ctx = canvas.getContext('2d');

    // Set canvas width and height
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Calculate the maximum and minimum values
    const maxValue = Math.max(...values.value.map(value => value.value));
    const minValue = Math.min(...values.value.map(value => value.value));

    // Calculate the x and y scale factors
    const xScale = canvas.width / (values.value.length - 1);
    const yScale = canvas.height / (maxValue - minValue);

    // Draw the graph
    ctx.beginPath();
    values.value.forEach((value, index) => {
        const x = index * xScale;
        const y = canvas.height - (value.value - minValue) * yScale;
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.strokeStyle = 'rgba(0, 123, 255, 1)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Request animation frame for smooth animation
    requestAnimationFrame(renderChart);
}
</script>
