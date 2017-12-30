<?php

namespace App\Http\Controllers;

use App\WechatHandler\EventHandler;
use App\WechatHandler\MessageHandler;

/**
 * 公众号控制器
 *
 * Class OfficialAccountController
 * @package App\Http\Controllers
 */
class OfficialAccountController extends WechatBaseController
{
    /**
     * 微信服务器检测用
     *
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws \EasyWeChat\Kernel\Exceptions\BadRequestException
     */
    public function index()
    {
        return $this->officialAccount->server->serve();
    }

    /**
     * 事件和消息接收处理
     *
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws \EasyWeChat\Kernel\Exceptions\BadRequestException
     * @throws \EasyWeChat\Kernel\Exceptions\InvalidArgumentException
     */
    public function handler()
    {
        $this->officialAccount->server->push(function ($message) {
            \Log::info($message);
            switch ($message['MsgType']) {
                case 'event':
                    return (new EventHandler())->handle($message);
                    break;
                default:
                    return (new MessageHandler())->handle($message);
                    break;
            }
        });

        return $this->officialAccount->server->serve();
    }

    /**
     * 群发
     */
    public function broadcasting()
    {
        $broadcasting = $this->officialAccount->broadcasting;

        // 文字
        $broadcasting->sendText('群发测试', ['o6cjTwK2uvveSk5Ct0rsZ6TCtEsM', 'o6cjTwF-C3949wUD5Tjur6DzADvQ']);
    }

    /**
     * 测试用
     */
    public function test()
    {
        return json_decode('{"return_code":"FAIL","return_msg":"\u6c99\u7bb1\u652f\u4ed8\u91d1\u989d(10)\u65e0\u6548\uff0c\u8bf7\u68c0\u67e5\u9700\u8981\u9a8c\u6536\u7684case"}', true);
        $openId = 'o6cjTwK2uvveSk5Ct0rsZ6TCtEsM';

        // 发客服消息给用户
//        $this->officialAccount->customer_service->message('我是客服消息')->to($openId)->send();

        // 邀请指定用户加入客服
        $this->officialAccount->customer_service->invite('xiaoliangua@test', 'o6cjTwF-C3949wUD5Tjur6DzADvQ');

        return $this->officialAccount->user->get($openId);
    }

    /**
     * 网页授权
     *
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     */
    public function auth()
    {
        return $this->officialAccount->oauth->redirect();
    }

    /**
     * 网页授权回调
     */
    public function oauthCallback()
    {
        return $this->officialAccount->oauth->user()->getAccessToken();
    }

    /**
     * 添加自定义菜单
     */
    public function addMenu()
    {
        $this->officialAccount->menu->create([
            [
                "type" => "view",
                "name" => "授权测试",
                "url"  => "http://app-server.qobala.com/auth"
            ],
            [
                "type" => "view",
                "name" => "jssdk",
                "url"  => "http://app-server.qobala.com/jssdk"
            ],
        ]);
    }

    /**
     * jssdk测试
     */
    public function jssdk()
    {
        return view('wechat.jssdk', ['jssdk' => $this->officialAccount->jssdk->buildConfig(['onMenuShareQQ', 'chooseImage', 'uploadImage'], false)]);
    }

    /**
     * 二维码
     */
    public function qrcode()
    {
        $result = $this->officialAccount->qrcode->temporary('foo', 6 * 24 * 3600);
        $url = $this->officialAccount->qrcode->url($result['ticket']);

        return view('wechat.qrcode', ['qrcode' => $result, 'url' => $url]);
    }

    /**
     * 刷卡支付
     */
    public function cardPay()
    {
        // auth_code 是扫码枪扫描用户支付二维码获取的
        $result = $this->pay->pay([
            'body' => 'image形象店-深圳腾大- QQ公仔',
            'out_trade_no' => '1217752501201407033233368018',
            'total_fee' => 0.1,
            'auth_code' => '120061098828009406',
        ]);
    }

    /**
     * 公众号支付发起页
     */
    public function pay()
    {
        // 调用统一下单接口获取 prepayId
        $result = $this->pay->order->unify([
            'body' => '支付测试',
            'out_trade_no' => mt_rand(1, 100000) . 'avc',
            'total_fee' => 10,
            'trade_type' => 'JSAPI',
            'openid' => 'o6cjTwK2uvveSk5Ct0rsZ6TCtEsM',
        ]);

        \Log::info($result, ['group' => 'pay']);

        // 生成 jsapi 配置
        $prepayId = $result['prepay_id'];

        return view('wechat.pay', ['config' => $this->pay->jssdk->bridgeConfig($prepayId)]);
    }

    /**
     * 订单回调地址
     */
    public function payCallback()
    {
        // 支付回调处理
        return $this->pay->handlePaidNotify(function ($message, $fail) {
            \Log::info('支付回调：' . json_encode($message));
            return true;
        });
    }

    /**
     * 退款结果通知
     */
    public function refundCallback()
    {
        // 退款回调
        return $this->pay->handleRefundedNotify(function ($message, $fail) {
            \Log::info('退款回调：' . json_encode($message));
            $reqInfo = $this->reqInfo();
            return true;
        });
    }
}
