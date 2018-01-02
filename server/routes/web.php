<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return config('app.wechat');
    // return view('welcome');
});

Route::get('/wechat', 'OfficialAccountController@index');
Route::get('/auth', 'OfficialAccountController@auth');
Route::get('/test', 'OfficialAccountController@test');
Route::get('/jssdk', 'OfficialAccountController@jssdk');
Route::get('/oauth_callback', 'OfficialAccountController@oauthCallback');
Route::get('/qrcode', 'OfficialAccountController@qrcode')->name('qrcode');
Route::get('/card_pay', 'OfficialAccountController@cardPay');
Route::get('/page', 'OfficialAccountController@page');
Route::get('/pay', 'OfficialAccountController@pay')->name('pay');
Route::post('/wechat', 'OfficialAccountController@handler');
Route::post('/broadcasting', 'OfficialAccountController@broadcasting');
Route::post('/menu', 'OfficialAccountController@addMenu');
Route::post('/pay_callback', 'OfficialAccountController@payCallback');
Route::post('/refund_callback', 'OfficialAccountController@refundCallback');