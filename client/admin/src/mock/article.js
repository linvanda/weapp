import Mock from 'mockjs'
import URI from 'urijs'

Mock.setup({
  timeout: 500
})

Mock.mock(/admin\/articles/, 'get', options => {
  const params = URI.parseQuery(options.url.split('?')[1])

  let articles = []
  for (let i = 0; i < 20; i++) {
    articles.push(
      Mock.mock({
        id: params['page'] + '-' + i,
        title: '@ctitle(5, 12)',
        image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1513616139261&di=3081f45f67bf0b823a25479fc973038a&imgtype=0&src=http%3A%2F%2Fwww.zhlzw.com%2FUploadFiles%2FArticle_UploadFiles%2F201204%2F20120412123926750.jpg',
        date: '@datetime',
        sub: [
          {
            id: 'sub-' + params['page'] + '-' + i,
            title: '@ctitle(5, 18)',
            image: '@image("358x160")',
            date: '@datetime'
          },
          {
            id: 'sub-' + params['page'] + '-' + (i + 1),
            title: '@ctitle(5, 12)',
            image: '@image("358x160")',
            date: '@datetime'
          }
        ]
      })
    )
  }

  return {
    code: 1000,
    data: {
      total: 150,
      data: articles
    }
  }
})
