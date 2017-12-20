import Mock from 'mockjs'

Mock.setup({
  timeout: 500
})

Mock.mock(/admin\/articles/, 'get', () => {
  let articles = []
  for (let i = 0; i < 40; i++) {
    articles.push(
      Mock.mock({
        id: '@guid',
        title: '@ctitle(5, 12)',
        image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1513616139261&di=3081f45f67bf0b823a25479fc973038a&imgtype=0&src=http%3A%2F%2Fwww.zhlzw.com%2FUploadFiles%2FArticle_UploadFiles%2F201204%2F20120412123926750.jpg',
        date: '@datetime',
        sub: [
          {
            id: '@guid',
            title: '@ctitle(5, 12)',
            image: '@image("358x160")',
            date: '@datetime'
          },
          {
            id: '@guid',
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
