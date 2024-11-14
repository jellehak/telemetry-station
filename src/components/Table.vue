<template>
    <table>
        <thead>
            <tr>
                <th v-for="column in columns" :key="column.field">{{ column.label || column }}</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in items" :key="item.id">
                <td v-for="column in columns" :key="column.field">
                    <slot :name="`item.${column}`" v-bind="{ item }">
                        {{ item[column || column] }}
                    </slot>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
export default {
    props: {
        items: {
            type: Array,
            required: true
        },
        columns: {
            type: Array,
            // default: function() {
            //     if (this.items.length > 0) {
            //         return Object.keys(this.items[0]).map(key => ({ field: key, label: key }));
            //     } else {
            //         return [];
            //     }
            // }
        }
    }
}
</script>
