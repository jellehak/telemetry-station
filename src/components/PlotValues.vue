<template>
    <div style="display: flex; flex-wrap: wrap; gap: 10px;">
        <template v-for="(value, key) in values" :key="key">
            <button @click.stop="$emit('click', {value, key})">
                <PlotSensor :data="{ value, key }"></PlotSensor>
            </button>
        </template>
    </div>
</template>

<script setup>
/**
 * show the values from the serial connection
 *  armed:0,CH1:910,CH2:1365,CH3:1365,CH4:1365,CH5:2000,CH6:2000,thro_des:0,roll_des:-48,pitch_des:-48,yaw_des:-43,GyroX:-2,GyroY:-1,GyroZ:0,AccX:0,AccY:0,AccZ:0,MagX:0,MagY:0,MagZ:0,roll:0,pitch:2,yaw:-70,roll_PID:0,pitch_PID:0,yaw_PID:0,m1:120,m2:120,m3:120,m4:120,m5:120,m6:120,s1:90,s2:113,s3:0,s4:169,s5:116,s6:0,s7:0,dt:500,
 */
defineProps({
    values: Object
})
</script>
