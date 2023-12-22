<script setup>
const s = "armed:0,CH1:910,CH2:1365,CH3:1365,CH4:1365,CH5:2000,CH6:2000,thro_des:0,roll_des:-48,pitch_des:-48,yaw_des:-43,GyroX:-2,GyroY:-1,GyroZ:0,AccX:0,AccY:0,AccZ:0,MagX:0,MagY:0,MagZ:0,roll:0,pitch:2,yaw:-70,roll_PID:0,pitch_PID:0,yaw_PID:0,m1:120,m2:120,m3:120,m4:120,m5:120,m6:120,s1:90,s2:113,s3:0,s4:169,s5:116,s6:0,s7:0,dt:500,"
const sObj = convertCsvToObject(s)

/** armed:0,CH1:910,CH2:1365 */
function convertCsvToObject(csv) {
    const lines = csv.split(',')
    const obj = {}
    for (const line of lines) {
        const [key, value] = line.split(':')
        if(!key) continue

        obj[key] = value
    }
    return obj
}

function convertObjectToCsv(obj) {
    const lines = []
    const entries = Object.entries(obj).filter(e=>e)
    for (const [key, value] of entries) {
        lines.push(`${key}:${value}`)
    }
    return lines.join(',')
}

const emit = defineEmits(['data'])

setInterval(() => {
    const sample = {
        ...sObj,
        CH1: (Math.random() * 100).toFixed(),
        CH2: (Math.random() * 100).toFixed(),
        CH3: (Math.random() * 100).toFixed()
    }
    emit('data', convertObjectToCsv(sample))
}, 1000)

setInterval(() => {
    const sample = {
        ...sObj,
        CH4: (Math.random() * 100).toFixed()
    }
    emit('data', convertObjectToCsv(sample))
}, 5000)
</script>

<template>
    <slot/>
</template>