import _ from 'lodash'

export default file => require('@/views/' + _.trimStart(file, '/') + '.vue').default
