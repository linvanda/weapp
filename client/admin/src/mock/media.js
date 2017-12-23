import Mock from 'mockjs'
import URI from 'urijs'

Mock.setup({
  timeout: 300
})

Mock.mock(/admin\/media\/images/, 'get', options => {
  const params = URI.parseQuery(options.url.split('?')[1])
  let images = []
  for (let i = 0; i < 20; i++) {
    images.push(
      Mock.mock({
        id: params['page'] + '-' + i,
        src: '@image'
      })
    )
  }

  return {
    code: 1000,
    data: {
      total: 150,
      data: images
    }
  }
})

Mock.mock(/admin\/media\/images/, 'post', () => {
  return {
    code: 1000,
    data: [
      {
        id: '1234',
        src:
          'http://imgsrc.baidu.com/imgad/pic/item/5ab5c9ea15ce36d32ae0f90a31f33a87e950b120.jpg'
      }
    ]
  }
})
