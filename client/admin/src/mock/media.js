import Mock from 'mockjs'
import URI from 'urijs'

Mock.setup({
  timeout: 1000
})

Mock.mock(/admin\/media\/images/, 'get', options => {
  const params = URI.parseQuery(options.url.split('?')[1])
  let images = []
  for (let i = 0; i < 20; i++) {
    images.push(
      {
          id: params['page'] + '-' + i,
          src: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1513616139261&di=3081f45f67bf0b823a25479fc973038a&imgtype=0&src=http%3A%2F%2Fwww.zhlzw.com%2FUploadFiles%2FArticle_UploadFiles%2F201204%2F20120412123926750.jpg'
      }
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
        src: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1513616139261&di=3081f45f67bf0b823a25479fc973038a&imgtype=0&src=http%3A%2F%2Fwww.zhlzw.com%2FUploadFiles%2FArticle_UploadFiles%2F201204%2F20120412123926750.jpg'
      }
    ]
  }
})
