$(function () {
    var layer = layui.layer
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    $('#btnChooseImage').on('click', function () {
        $('#file').click()
    })

    $('#file').on('change', function (e) {
        // 获取用户选择的文件
        var filelist = e.target.files
        // 判断有没有上传文件
        if (filelist.length === 0) {
            return layer.msg('请上传文件')
        }
        // 选择用户的第一个文件
        var file = e.target.files[0]
        // 将文件转化成路径
        var imgURL = URL.createObjectURL(file)
        // 重新初始化裁剪区
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', imgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域

    })
    //确定按钮点击事件
    $('#btnUpload').on('click', function () {
        // 得到BS64图片格式
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')

        //调用ajax请求更换图片
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            // 服务器必带的一个参数avatar
            data: { avatar: dataURL },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取头像失败')
                }
                layer.msg('获取头像成功')
                window.parent.getUserInfo();
            }

        })
    })

})