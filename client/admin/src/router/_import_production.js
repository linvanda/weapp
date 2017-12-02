import _ from 'lodash'

export default file => () => import('@/views/' + _.trimStart(file, '/') + '.vue')
