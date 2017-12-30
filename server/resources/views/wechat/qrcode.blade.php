<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="js/vconsole.min.js"></script>
</head>
<body>
<div><img src="<?=$url?>" alt=""></div>
<div>
    <?=json_encode($qrcode)?>
</div>
<div>
    <?=$url?>
</div>
<script>
    new VConsole();
</script>
</body>
</html>