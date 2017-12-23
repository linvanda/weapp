<template>
    <el-row>
        <el-col :span="6" class="left">
            <draggable v-model="menus" :options="dragOptions" class="mobile" :move="onMove">
                <transition-group name="menu" tag="ul" class="footer">
                    <li v-for="(menu, index) in menus" :key="index" class="menu"  @click="clickMenu(index)">
                        <span class="menu-title" :class="{ active: activeMenuIndex === index }">
                            <i class="fa fa-align-justify" v-show="draggable"></i>
                            {{ menu.name }}
                        </span>
                        <draggable v-show="activeMenuIndex === index" v-model="menu.children" :options="dragOptions" :move="onMove">
                            <transition-group :name="'submenu-' + index" tag="ul" class="sub-menu">
                                <li
                                    v-for="(smenu, sindex) in menu.children || []" 
                                    :key="index + '-' + sindex" 
                                    class="sub-title" 
                                    :class="{ active: activeSubMenuIndex === sindex }" 
                                    @click.stop="clickSubMenu(sindex)">
                                        <i class="fa fa-align-justify" v-show="draggable"></i>
                                        {{ smenu.name }}
                                </li>
                                <li 
                                    v-if="!menu.children || menu.children.length < maxSubMenuCount" 
                                    class="sub-title" 
                                    @click.stop="addSubMenu(index)"
                                    key="add-submenu">
                                        <span class="el-icon-plus"></span>
                                </li>
                            </transition-group>
                        </draggable>
                    </li>
                    <li v-if="menus.length < maxMenuCount" class="menu" @click="addMenu" key="add-menu">
                        <i class="el-icon-plus"></i>
                    </li>
                </transition-group>
            </draggable>
            <div class="op">
                <el-button @click="orderMenu">{{ dragBtnText }}</el-button>
            </div>
        </el-col>
        <el-col :span="12" class="right">
            <div v-if="!draggable">
                <div class="menu-info">
                    <section class="top">
                        <p class="title">{{ activeItem.name }}</p>
                        <el-button type="text" class="del" @click="removeMenu">删除{{ menuLabel }}</el-button>
                    </section>
                    <el-form label-width="85px" label-position="left" v-model="activeItem">
                        <el-form-item :label="menuLabel + '名称'">
                            <el-input placeholder="不超过 8 个字" v-model="activeItem.name"></el-input>
                        </el-form-item>
                        <div v-if="!activedHasSubMenu">
                            <el-form-item :label="menuLabel + '内容'">
                                <el-radio-group v-model="activeItem.type">
                                    <el-radio label="message">发送消息</el-radio>
                                    <el-radio label="link">跳转链接</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="" label-width="0" v-show="activeItem.type == 'message'">
                                <el-tabs v-model="activeItem.messageType">
                                    <el-tab-pane name="text">
                                        <span slot="label">
                                            <i class="el-icon-edit-outline"></i> 文字</span>
                                        <el-input type="textarea" :rows="6" placeholder="不超过 500 字" v-model="activeItem.text"></el-input>
                                    </el-tab-pane>
                                    <el-tab-pane name="article">
                                        <span slot="label">
                                            <i class="el-icon-document"></i> 图文</span>
                                        <operations v-show="!activeItem.article" :items="opArticleItems" @click="clickOpArticle"></operations>
                                        <article-card v-if="activeItem.article" :article="activeItem.article">
                                            <div slot="bottom-ops" class="bottom-ops">
                                                <el-button type="text" @click="removeArticle">删除</el-button>
                                            </div>
                                        </article-card>
                                    </el-tab-pane>
                                    <el-tab-pane name="image">
                                        <span slot="label">
                                            <i class="el-icon-picture-outline"></i> 图片</span>
                                        <operations v-show="!activeItem.image" :items="opImageItems" @click="clickOpImage"></operations>
                                        <div v-if="activeItem.image" class="image-pane">
                                            <img :src="activeItem.image.src">
                                            <el-button type="text" @click="removeImage">删除</el-button>
                                        </div>
                                    </el-tab-pane>
                                </el-tabs>
                            </el-form-item>
                            <el-form-item label="页面地址" v-show="activeItem.type == 'link'">
                                <el-input type="textarea" :rows="4" v-model="activeItem.link" placeholder="订阅者点击该子菜单会跳到该链接，格式：http://www.example.com"></el-input>
                            </el-form-item>
                        </div>
                    </el-form>
                </div>
                <div class="op">
                    <el-button type="primary">保存并发布</el-button>
                </div>
            </div>
            <div v-else class="dragtip">
                请通过拖拽左边的菜单进行排序
            </div>
            <article-choose :visible.sync="chooseArticleVisible" :selectedArticles.sync="activeItem.article"></article-choose>
            <image-choose :visible.sync="chooseImageVisible" :selectedImages.sync="activeItem.image"></image-choose>
        </el-col>
    </el-row>
</template>

<script>
import Operations from '@/components/Operations'
import ArticleCard from '@/components/ArticleCard'
import ArticleChoose from '@/components/ArticleChoose'
import ImageChoose from '@/components/ImageChoose'
import Draggable from 'vuedraggable'
import { empty } from '@/lib/util'
import _ from 'lodash'

export default {
    components: {
        Operations,
        ArticleCard,
        Draggable,
        ArticleChoose,
        ImageChoose
    },
    data() {
        return {
            activeMenuIndex: 0,
            activeSubMenuIndex: 0,
            maxMenuCount: 3,
            maxSubMenuCount: 5,
            draggable: false,
            dragBtnText: '菜单排序',
            opArticleItems: [
                { key: 'choose-article', label: '从素材库中选择' },
                { key: 'new-article', label: '新建图文消息' }
            ],
            opImageItems: [
                { 
                    key: 'upload-image', 
                    label: '上传图片',
                    type: 'upload',
                    success: (response) => {
                        this.$set(this.activeItem, 'image', response.data[0])
                    }
                },
                { key: 'choose-image', label: '从素材库中选择' }
            ],
            menus: [
                {
                    name: '社区服务',
                    children: [
                        {
                            name: '服务预约',
                            type: 'message',
                            messageType: 'article',
                            article: [
                                {
                                    id: '1234',
                                    image: 
                                        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1513616139261&di=3081f45f67bf0b823a25479fc973038a&imgtype=0&src=http%3A%2F%2Fwww.zhlzw.com%2FUploadFiles%2FArticle_UploadFiles%2F201204%2F20120412123926750.jpg',
                                    title:
                                        '测试图文测试图文测试图文测试图文测试图文测试图文测试图文测试图文测试图文测试图文测试图文'
                                },
                                {
                                    id: '2342',
                                    image:
                                        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1513616139261&di=3081f45f67bf0b823a25479fc973038a&imgtype=0&src=http%3A%2F%2Fwww.zhlzw.com%2FUploadFiles%2FArticle_UploadFiles%2F201204%2F20120412123926750.jpg',
                                    title:
                                        '测试子图文1测试子图文1测试子图文1测试子图文1测试子图文1测试子图文1测试子图文1测试子图文1测试子图文1测试子图文1测试子图文1测试子图文1'
                                },
                                {
                                    id: '4422',
                                    image:
                                        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1513616139261&di=3081f45f67bf0b823a25479fc973038a&imgtype=0&src=http%3A%2F%2Fwww.zhlzw.com%2FUploadFiles%2FArticle_UploadFiles%2F201204%2F20120412123926750.jpg',
                                    title: '测试子图文2'
                                },
                                {
                                    id: '4211',
                                    image:
                                        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1513616139261&di=3081f45f67bf0b823a25479fc973038a&imgtype=0&src=http%3A%2F%2Fwww.zhlzw.com%2FUploadFiles%2FArticle_UploadFiles%2F201204%2F20120412123926750.jpg',
                                    title: '测试子图文3'
                                }
                            ]
                        },
                        {
                            name: '历史上点今天等等',
                            type: 'message',
                            messageType: 'image',
                            image: {
                                id: '131324',
                                src: 
                                'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1513616139261&di=3081f45f67bf0b823a25479fc973038a&imgtype=0&src=http%3A%2F%2Fwww.zhlzw.com%2FUploadFiles%2FArticle_UploadFiles%2F201204%2F20120412123926750.jpg'
                            }
                        }
                    ]
                },
                {
                    name: '签到',
                    type: 'message',
                    messageType: 'text',
                    text: '恭喜你，签到成功！'
                }
            ],
            menuTemplate: {
                name: '菜单名称',
                type: 'message',
                messageType: 'text',
                text: ''
            },
            chooseArticleVisible: false,
            chooseImageVisible: false
        }
    },
    computed: {
        menuCount() {
            return this.menus.length
        },
        activeItem() {
            if (this.activeMenuIndex === -1) {
                return {}
            }

            let menu = this.menus[this.activeMenuIndex]

            if (menu.children && this.activeSubMenuIndex !== -1 && menu.children[this.activeSubMenuIndex]) {
                menu = menu.children[this.activeSubMenuIndex]
            }

            return menu
        },
        activeMenuType() {
            return this.activeSubMenuIndex === -1 ? 'menu' : 'subMenu'
        },
        activedHasSubMenu() {
            return this.activeMenuType === 'menu' && this.activeItem.children && this.activeItem.children.length
        },
        menuLabel() {
            return this.activeSubMenuIndex === -1 ? '菜单' : '子菜单'
        },
        dragOptions() {
            return {
                disabled: !this.draggable
            }
        }
    },
    methods: {
        clickOpArticle(item) {
            if (item.key === 'choose-article') {
                this.chooseArticleVisible = true
            }
        },
        clickOpImage(item) {
            if (item.key === 'choose-image') {
                this.chooseImageVisible = true
            }
        },
        removeArticle() {
            this.activeItem.article = null
        },
        removeImage() {
            this.activeItem.image = null
        },
        addSubMenu(menuIndex) {
            let menu = this.menus[menuIndex]
            !menu.children && this.$set(menu, 'children', [])
            menu.children.unshift(_.cloneDeep(this.menuTemplate))
            this.activeSubMenuIndex = 0
        },
        addMenu() {
            this.menus.push(_.cloneDeep(this.menuTemplate))
            this.clickMenu(this.menus.length - 1)
        },
        orderMenu() {
            this.draggable = !this.draggable
            this.dragBtnText = this.draggable ? '完成' : '菜单排序'
        },
        clickMenu(index) {
            this.activeMenuIndex = index
            this.resetSubMenuIndex()
        },
        clickSubMenu(subIndex) {
            this.activeSubMenuIndex = subIndex
        },
        removeMenu() {
            this.$confirm(`确定删除${this.menuLabel} ${this.activeItem.name} 吗？`)
            .then(() => {
                if (this.activeMenuType === 'menu') {
                    this.menus.splice(this.activeMenuIndex, 1)
                    this.initMenuIndex()
                } else {
                    this.menus[this.activeMenuIndex].children.splice(this.activeSubMenuIndex, 1)
                    this.initSubMenuIndex()
                }
            })
            .catch(() => {})
        },
        initMenuIndex() {
            this.activeMenuIndex = empty(this.menus) ? -1 : 0
        },
        initSubMenuIndex() {
            this.activeSubMenuIndex = empty(this.menus[this.activeMenuIndex].children) ? -1 : this.menus[this.activeMenuIndex].children.length - 1
        },
        resetSubMenuIndex() {
            this.activeSubMenuIndex = -1
        },
        onMove({relatedContext, draggedContext}) {
            if (!relatedContext.element || !draggedContext.element) {
                return false
            }

            return true
        }
    },
    created() {
        this.initMenuIndex()
        this.resetSubMenuIndex()
    }
}
</script>

<style lang="scss">
@import 'src/styles/variable.scss';
@import 'src/styles/mixin.scss';

.left {
    min-width: 325px;
    .mobile {
        position: relative;
        width: 319px;
        height: 582px;
        border: 1px solid $wx-menu-border;
        background: transparent url(/static/img/mobile-head.png) no-repeat 0 0;
        background-origin: padding-box;
        .footer {
            position: absolute;
            display: flex;
            display: -webkit-flex;
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
                flex: 1;
                min-width: 0;
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
                    display: inline-block;
                    height: 100%;
                    width: 100%;
                    @include ellipsis;
                    @include no-user-select;
                    &:hover, &.active {
                        color: $font-main;
                    }
                }
                .sub-menu {
                    position: absolute;
                    bottom: 65px;
                    width: 100%;
                    border: 1px solid $wx-menu-border;
                    border-bottom: 0;
                    text-align: center;
                    @include arrow($size: 12px, $border-color: $wx-menu-border, $direction: bottom-center, $pos-bottom: -6px);
                    .sub-title {
                        border-bottom: 1px solid $wx-menu-border;
                        padding: 0 $padding-five;
                        @include no-user-select;
                        @include ellipsis;
                        &:hover, &.active {
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
    min-height: 582px;
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
    .dragtip {
        color: $font-aide;
        height: 582px;
        line-height: 582px;
        text-align: center;
        border: 1px solid $wx-menu-border;
    }
}
.op {
    margin-top: $padding-large;
}
</style>
