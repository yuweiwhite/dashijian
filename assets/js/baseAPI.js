$.ajaxPrefilter(function (options) {
    //使用ajax函数 让url根路径的拼接
    options.url = 'http://ajax.frontend.itheima.net' + options.url
})