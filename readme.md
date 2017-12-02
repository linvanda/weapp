### 前后台开发模板
- client: 前端，分为 前台 和 后台 两个独立的 Vue 项目。
    - app: 用户前台
    - admin: 管理后台
- server: 后端，lavavel框架。注意：和client不同，server端不分成两个，而是根据业务领域划分

  server 为 client 提供各种 Restful Api 服务。

#### 目录结构
##### client/app | client/admin
  + build : webpack 构建相关配置
  + config : 项目配置参数
  + dist : 构建后的文件
  + node_modules : 外部模块
  + src : 源文件代码
    + api : 和 server 端的 api 通信
    + assets : 需要 webpack 处理点静态资源，如图片等
    + components : 公共组件
    + views : 视图组件
    + directive : 自定义指令（可选）
    + filters : 自定义过滤器（可选）
    + mocks : 模拟数据
    + router : 路由
    + stores : 仓储
    + styles : 公共样式文件（如scss）
    + lib : 库
    + App.vue
    + main.js
  + static : 静态资源，如 jQuery、主题文件、独立js文件等

#### 注意：
- store 属于数据仓库，只负责存取数据，不要在里面写过多的业务逻辑。而且，store 作为外界数据统一出入口，负责数据的具体存取实现（如 persist、api 获取等，但当不仅仅简单涉及到数据存取时，应当采用专门的服务逻辑层，由服务逻辑层调用 store）。
- 组件级业务应写在单独组件里面，通用业务写在 lib 中。
- 本地持久化存储：lib/persist.js，采用 localStorage 存储。一般来说，只在 store 中调用。
- 所有的 mutation 大写，下划线分割

### api 响应体结构：
```
{
  "code": 1000, // number
  "msg": "", // string
  "data": ... // object
}
```
** code **
- 1000 操作成功
- 1001 未登录
- 1002 无权操作