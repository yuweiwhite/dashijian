$(function () {
    var form = layui.form
    var layer = layui.layer
    // layui中的表单验证方法
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '你输入的长度必须1-6之间'
            }
        }
    })

    initUserInfo()
    // 重置按钮点击事件
    $('#btnReset').on('click', function (e) {
        e.preventDefault();
        initUserInfo()
    })
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取失败')
                }
                return layer.msg('获取成功')
                window.parent.getUserInfo();
            }
        })
    })

    // 获取个人信息数据
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取失败')
                }
                // layui 里面一个赋值取值的方法，form必须加上lay-filter=“”属性，后面出入object数据
                form.val('formUserInfo', res.data)

            }

        })
    }


})


