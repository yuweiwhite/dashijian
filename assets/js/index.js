$(function () {
    var layer = layui.layer
    getUserInfo()

    $('#btnLogout').on('click', function () {
        //弹出提示框，确定才会执行里面的代码
        layer.confirm('确定退出吗？', { icon: 3, title: '提示' }, function (index) {
            localStorage.removeItem('token')
            location.href = '/login.html'
            layer.close(index);
        })
    })




})

function getUserInfo() {
    $.ajax({
        method: 'GET',
        //使用ajax函数 让url根路径的拼接
        url: '/my/userinfo',
        // 每次申请都判断是否带my开头的， 是的话就得获取headers
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            renderAvatar(res.data)
        }
        //不管失败或者成功都有个complete函数，函数有返回值
    })
}

// 渲染用户头像
function renderAvatar(user) {
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    if (user.user_pic == null) {
        $('.layui-nav-img').hide();
        // 字符串[0]可以拿到第一个字母或者文字
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first);
    } else {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    }
}
