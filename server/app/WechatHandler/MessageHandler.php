<?php

namespace App\WechatHandler;

use EasyWeChat\Kernel\Contracts\EventHandlerInterface;
use EasyWeChat\Kernel\Messages\Image;
use EasyWeChat\Kernel\Messages\Transfer;


/**
 * 消息处理器：文本、图片、语音、视频等消息
 *
 * Class MessageHandler
 * @package App\WechatHandler\MessageHandler
 */
class MessageHandler implements EventHandlerInterface
{
    public function handle(array $payload = [])
    {
        if ($payload['MsgType'] === 'text') {
            if ($payload['Content'] === '客服') {
                // 转多客服
                return new Transfer();
            }

            return $payload['Content'] . '<a href="http://www.baidu.com">走起</a>';
        } elseif ($payload['MsgType'] === 'image') {
            return new Image($payload['MediaId']);
        } else {
            return '其他类型' . $payload['MsgType'];
        }
    }
}
