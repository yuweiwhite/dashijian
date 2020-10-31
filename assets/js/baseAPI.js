$.ajaxPrefilter(function (options) {
    //使用ajax函数 让url根路径的拼接
    options.url = 'http://ajax.frontend.itheima.net' + options.url;

    // 每次申请都判断是否带my开头的， 是的话就得获取headers
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = { Authorization: localStorage.getItem('token') || '' }
    }
    // 每次都调用complete
    //不管失败或者成功都有个complete函数，函数有返回值
    options.complete = function (res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //强制清空token， 强制回到登录页面
            localStorage.removeItem('token')
            location.href = '/login.html'
        }
    }
})