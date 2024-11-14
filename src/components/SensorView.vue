<template>
    <div @click.stop="sensor.favorite = !sensor.favorite">
        <PlotSensor :data="{ value: sensor.lastSample.value, key: sensor.key }"></PlotSensor>
        <Graph v-if="form.showGraph" :values="sensor.history" style="height: 50px" />
        <div v-if="sensor.favorite">
            <!-- {{ sensor.history }} -->
            <Table :items="sensor.history" :columns="['value', 'createdAt']">
                <template #item.createdAt="{ item }">
                    {{ new Date(item.createdAt).toLocaleTimeString() }}
                </template>
            </Table>
        </div>
    </div>
</template>

<script setup>
defineProps({
    sensor: Object,
    form: Object
})
</script>