### 前后台开发模板
- client: 前端，分为 前台 和 后台 两个独立的 Vue 项目。
    - app: 用户前台
    - admin: 管理后台
- server: 后端，lavavel框架。注意：和client不同，server端不分成两个，而是根据业务领域划分

  server 为 client 提供各种 Re stful Api 服务。

#### 目录结构
##### client/app | client/admin
  + build : webpack 构建相关配置
  + config : 项目配置参数
  + dist : 构建后的文件
  + node_modules : 外部模块
  + src : 源文件代码
    + api : 和 server 端的 api 通信
    + assets : 需要 webpack 处理点静态资源，如图片等
    + components : 公共组件
    + views : 视图组件
    + directive : 自定义指令（可选）
    + filters : 自定义过滤器（可选）
    + mocks : 模拟数据
    + router : 路由
    + stores : 仓储
    + styles : 公共样式文件（如scss）
    + utils : 工具
    + App.vue
    + main.js
  + static : 静态资源，如 jQuery、主题文件、独立js文件等