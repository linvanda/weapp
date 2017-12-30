<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="http://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
    <script src="js/vconsole.min.js"></script>
</head>
<body>
<img id="img1" src="" alt="" style="width: 100%;">
<button id="btn1">click</button>
<a href="<?=route('qrcode')?>">qrcode</a><br>
<a href="<?=route('pay')?>">pay</a>
<script type="text/javascript" charset="utf-8">
new VConsole();

wx.config(<?=$jssdk?>);
wx.ready(function() {
    // 分享给朋友
    wx.onMenuShareAppMessage({
        title: '测试分享', // 分享标题
        desc: '描述', // 分享描述
        link: 'http://app-server.qobala.com/auth', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        success: function () {
            alert('分享成功')
        },
        cancel: function () {
            alert('取消分享')
        }
    });
    // 分享到朋友圈
    wx.onMenuShareTimeline({
        title: '测试分享', // 分享标题
        success: function () {
            alert('成功')
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });

    // 选择照片
    document.getElementById('btn1').onclick = function() {
        wx.chooseImage({
            count: 6, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                console.log(res);
                document.getElementById('img1').src = localIds[0];

                // 预览图片
                // wx.previewImage({
                //     current: localIds[0],
                //     urls: localIds
                // })

                // 上传图片
                wx.uploadImage({
                    localId: res.localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
                    isShowProgressTips: 1, // 默认为1，显示进度提示
                    success: function (res) {
                        var serverId = res.serverId; // 返回图片的服务器端ID
                        console.log('serverId', serverId);
                    }
                });
            }
        });
    }
});
wx.error(function(res) {
    alert(res)
});
</script>
</body>
</html>