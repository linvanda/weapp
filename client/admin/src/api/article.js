import { listConfig } from './_util'
// 图文
export default {
    list: {
        url: 'articles',
        data: listConfig
    },
    info: {
        url: 'articles/:id',
        data: {
            id: true
        }
    }
}
