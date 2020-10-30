$(function () {
    $('#link_login').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    $('#link_reg').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    var form = layui.form;
    var layer = layui.layer;


    form.verify({
        pwd: [/^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 判断两次密码是否相同
        repwd: function (value) {
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '你输入2次密码不相同'
            }
        }
    })

    $('#form-reg').on('submit', function (e) {
        dataReg = $('#form-reg').serialize();
        e.preventDefault();
        $.post('/api/reguser', dataReg, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg('注册成功')
            $('#link_reg').click()
        })
    })
    $('#form-login').on('submit', function (e) {
        e.preventDefault();
        dataLogin = $('#form-login').serialize();
        $.ajax({
            method: 'post',
            url: '/api/login',
            data: dataLogin,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败')
                }
                layer.msg('登录成功')
                localStorage.setItem('token', res.token)
                location.href = '/index.html'
            }
        })
    })
})