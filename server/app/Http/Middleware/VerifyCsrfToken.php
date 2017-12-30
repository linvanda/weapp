<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array
     */
    protected $except = [
        'wechat','broadcasting', 'test', 'auth', 'menu', 'oauth_callback', 'jssdk', 'qrcode', 'pay_callback', 'card_pay', 'pay'
    ];
}
