<?php

namespace App\WechatHandler;

use EasyWeChat\Kernel\Contracts\EventHandlerInterface;


/**
 * 事件处理器
 *
 * Class EventHandler
 * @package App\WechatHandler\EventHandler
 */
class EventHandler implements EventHandlerInterface
{
    public function handle(array $payload = [])
    {
        return json_encode($payload);
    }
}
