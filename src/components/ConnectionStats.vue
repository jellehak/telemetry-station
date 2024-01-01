<template>
    <div>
        <p>Total Messages: {{ totalMessages }}</p>
        <p>Duration (in seconds): {{ duration }}</p>
        <p>Average Messages per Second: {{ averageMessagesPerSecond }}</p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            totalMessages: 1000, // Replace with the actual total number of messages
            duration: 60, // Replace with the actual duration in seconds
        };
    },
    computed: {
        averageMessagesPerSecond() {
            return this.totalMessages / this.duration;
        },
    },
};
</script>
