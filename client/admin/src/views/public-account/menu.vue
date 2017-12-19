<template>
    <el-row>
        <el-col :span="6" class="left">
            <div class="mobile">
                <ul class="footer">
                    <li class="menu" :style="{ width: menuWidth + 'px' }">
                        <span class="menu-title">菜单名称</span>
                        <ul class="sub-menu">
                            <li class="sub-title">
                                <span>子菜单一</span>
                            </li>
                            <li class="sub-title">
                                <span>子菜单一</span>
                            </li>
                            <li class="sub-title">
                                <span>子菜单一</span>
                            </li>
                            <li class="sub-title">
                                <span class="el-icon-plus"></span>
                            </li>
                        </ul>
                    </li>
                    <li class="menu" :style="{ width: menuWidth + 'px' }">
                        <span class="menu-title">菜单名称</span>
                    </li>
                    <li class="menu" :style="{ width: menuWidth + 'px' }">
                        <i class="el-icon-plus"></i>
                    </li>
                </ul>
            </div>
            <div class="op">
                <el-button>菜单排序</el-button>
            </div>
        </el-col>
        <el-col :span="12" class="right">
            <div class="menu-info">
                <section class="top">
                    <p class="title">子菜单名称</p>
                    <el-button type="text" class="del">删除子菜单</el-button>
                </section>
                <el-form label-width="85px" label-position="left" v-model="menu">
                    <el-form-item label="子菜单名称">
                        <el-input placeholder="不超过 8 个字"></el-input>
                    </el-form-item>
                    <el-form-item label="子菜单内容">
                        <el-radio-group v-model="menu.type">
                            <el-radio label="message">发送消息</el-radio>
                            <el-radio label="link">跳转链接</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="" label-width="0" v-show="menu.type == 'message'">
                        <el-tabs v-model="menu.messageType" type="card">
                            <el-tab-pane name="text">
                                <span slot="label">
                                    <i class="el-icon-edit-outline"></i> 文字</span>
                                <el-input type="textarea" :rows="6" placeholder="不超过 500 字"></el-input>
                            </el-tab-pane>
                            <el-tab-pane name="article">
                                <span slot="label">
                                    <i class="el-icon-document"></i> 图文</span>
                                <operations v-show="!menu.article" :items="opArticleItems" @click="clickOpArticle"></operations>
                                <article-card v-if="menu.article" :main="menu.article" :sub="menu.article.sub">
                                    <div slot="bottom-ops" class="bottom-ops">
                                        <el-button type="text" @click="removeArticle">删除</el-button>
                                    </div>
                                </article-card>
                            </el-tab-pane>
                            <el-tab-pane name="image">
                                <span slot="label">
                                    <i class="el-icon-picture-outline"></i> 图片</span>
                                <operations v-show="!menu.image" :items="opImageItems" @click="clickOpImage"></operations>
                                <div v-if="menu.image" class="image-pane">
                                    <img :src="menu.image">
                                    <el-button type="text" @click="removeImage">删除</el-button>
                                </div>
                            </el-tab-pane>
                        </el-tabs>
                    </el-form-item>
                    <el-form-item label="页面地址" v-show="menu.type == 'link'">
                        <el-input type="textarea" :rows="4" placeholder="订阅者点击该子菜单会跳到该链接，格式：http://www.example.com"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="op">
                <el-button type="primary">保存并发布</el-button>
            </div>
        </el-col>
    </el-row>
</template>

<script>
import Operations from '@/components/Operations'
import ArticleCard from '@/components/ArticleCard'

export default {
    components: {
        Operations,
        ArticleCard
    },
    data() {
        return {
            menuCount: 3,
            maxMenuCount: 3,
            maxSubMenuCount: 5,
            opArticleItems: [
                { key: 'choose-article', label: '从素材库中选择' },
                { key: 'new-article', label: '新建图文消息' }
            ],
            opImageItems: [
                { key: 'upload-image', label: '上传图片' },
                { key: 'choose-image', label: '从素材库中选择' }
            ],
            menus: [
                {
                    key: '111',
                    name: '会员',
                    type: 'link',
                    link: 'http://www.baidu.com'
                },
                {
                    key: '121',
                    name: '签到',
                    type: 'message',
                    messageType: 'text',
                    text: '恭喜你，签到成功！'
                },
                {
                    key: '123',
                    name: '社区',
                    children: [
                        {
                            key: '12345',
                            name: '服务预约',
                            type: 'message',
                            messageType: 'article',
                            article: {
                                id: '1234',
                                image:
                                    'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1513616139261&di=3081f45f67bf0b823a25479fc973038a&imgtype=0&src=http%3A%2F%2Fwww.zhlzw.com%2FUploadFiles%2FArticle_UploadFiles%2F201204%2F20120412123926750.jpg',
                                title:
                                    '测试图文测试图文测试图文测试图文测试图文测试图文测试图文测试图文测试图文测试图文测试图文',
                                sub: [
                                    {
                                        image:
                                            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1513616139261&di=3081f45f67bf0b823a25479fc973038a&imgtype=0&src=http%3A%2F%2Fwww.zhlzw.com%2FUploadFiles%2FArticle_UploadFiles%2F201204%2F20120412123926750.jpg',
                                        title:
                                            '测试子图文1测试子图文1测试子图文1测试子图文1测试子图文1测试子图文1测试子图文1测试子图文1测试子图文1测试子图文1测试子图文1测试子图文1'
                                    },
                                    {
                                        image:
                                            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1513616139261&di=3081f45f67bf0b823a25479fc973038a&imgtype=0&src=http%3A%2F%2Fwww.zhlzw.com%2FUploadFiles%2FArticle_UploadFiles%2F201204%2F20120412123926750.jpg',
                                        title: '测试子图文2'
                                    },
                                    {
                                        image:
                                            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1513616139261&di=3081f45f67bf0b823a25479fc973038a&imgtype=0&src=http%3A%2F%2Fwww.zhlzw.com%2FUploadFiles%2FArticle_UploadFiles%2F201204%2F20120412123926750.jpg',
                                        title: '测试子图文3'
                                    }
                                ]
                            }
                        },
                        {
                            key: '12346',
                            name: '历史上点今天',
                            type: 'message',
                            messageType: 'image',
                            image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1513616139261&di=3081f45f67bf0b823a25479fc973038a&imgtype=0&src=http%3A%2F%2Fwww.zhlzw.com%2FUploadFiles%2FArticle_UploadFiles%2F201204%2F20120412123926750.jpg'
                        }
                    ]
                }
            ]
        }
    },
    computed: {
        menuWidth() {
            return 274 / this.menuCount
        }
    },
    methods: {
        clickOpArticle(item) {
            console.log(item)
        },
        clickOpImage(item) {},
        removeArticle() {
            this.menu.article = null
        },
        removeImage() {
            this.menu.image = ''
        }
    }
}
</script>


<style lang="scss">
@import 'src/styles/variable.scss';
@import 'src/styles/mixin.scss';

.left {
    .mobile {
        position: relative;
        width: 319px;
        height: 582px;
        border: 1px solid $wx-menu-border;
        background: transparent url(/static/img/mobile-head.png) no-repeat 0 0;
        background-origin: padding-box;
        .footer {
            position: absolute;
            box-sizing: border-box;
            height: 51px;
            line-height: 50px;
            border-top: 1px solid $wx-menu-border;
            bottom: 0;
            left: 0;
            right: 0;
            padding-left: 43px;
            background: transparent url(/static/img/mobile-foot.png) no-repeat 0
                0;
            background-origin: padding-box;
            .menu {
                position: relative;
                box-sizing: border-box;
                float: left;
                height: 100%;
                border-right: 1px solid $wx-menu-border;
                text-align: center;
                cursor: pointer;
                color: $font-aide;
                &:last-child {
                    border-right: 0;
                }
                .menu-title {
                    &:hover {
                        color: $font-main;
                    }
                }
                .sub-menu {
                    position: absolute;
                    bottom: 65px;
                    width: 100%;
                    border: 1px solid $wx-menu-border;
                    text-align: center;

                    @include arrow($size: 12px, $border-color: $wx-menu-border, $direction: bottom-center, $pos-bottom: -8px);

                    .sub-title {
                        span {
                            display: inline-block;
                            width: 80%;
                            border-bottom: 1px solid $wx-menu-border;
                        }
                        &:last-child span {
                            border-bottom: 0;
                        }
                        &:hover {
                            color: $font-main;
                        }
                    }
                }
            }

            @include clearfix;
        }

        @include arrow($size: 12px, $border-color: $wx-menu-border, $direction: left, $pos-bottom: 20px, $pos-right: -34px);
    }
    .op {
        text-align: center;
    }
}
.right {
    padding: 0 $padding-two;
    .menu-info {
        border: 1px solid $wx-menu-border;
        min-height: 582px;
        position: relative;
        padding: $padding-two;
        box-sizing: border-box;
        .top {
            width: 100%;
            overflow: hidden;
            margin-bottom: $padding-one;
            border-bottom: 1px solid $border-three;
            .title {
                float: left;
                padding: $padding-three 0;
                line-height: 1;
            }
            .del {
                float: right;
            }
            @include clearfix;
        }
        .el-tabs {
            .el-tab-pane {
                padding: 0 $padding-four;
            }
            .bottom-ops {
                text-align: right;
            }
            .image-pane {
                width: 100%;
                text-align: right;
                img {
                    width: 100%;
                    height: auto;
                }
            }
        }
    }
    .op {
        text-align: left;
    }
}
.op {
    margin-top: $padding-large;
}
</style>
