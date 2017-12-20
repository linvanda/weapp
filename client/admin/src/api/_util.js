export const listConfig = {
    page: {
        type: Number,
        default: 1
    },
    pageSize: {
        type: Number,
        default: 20
    },
    filters: {
        type: Object,
        default: {}
    },
    orderBy: {
        type: Array,
        default: []
    }
}
