<?php

namespace App\Http\Controllers;

use EasyWeChat\Factory;

/**
 * 微信平台基础控制器
 *
 * Class WechatBaseController
 * @package App\Http\Controllers
 */
class WechatBaseController extends Controller
{
    protected $officialAccount;
    protected $pay;

    public function __construct()
    {
        $this->officialAccount = Factory::officialAccount(config('app.wechat'));
        $this->pay = Factory::payment(config('app.wechat'));
    }
}
