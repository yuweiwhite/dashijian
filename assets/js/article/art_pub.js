$(function () {
    var layer = layui.layer
    var form = layui.form
    initCate()

    // 初始化富文本编辑器
    initEditor()

    //  获取文章列表信息
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章失败')
                }
                // 引用模板引擎渲染数据
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // layui插件监听不到后面添加的元素，需要重新调用插件3
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    $('#coverFile').on('change', function (e) {
        // 拿到上传文件的数组
        var files = e.target.files
        // 判断用户是否选了文件
        if (files.length === 0) {
            return
        }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 定义一个发布状态的变量
    var art_state = '已发布'
    $('#btnSava2').on('click', function () {
        // 如果点击的是草稿按钮， 就让发布状态变成草稿
        art_state = '草稿'
    })
    // 表单submit事件，阻止默认行为
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        // 创建一个ForData对象，传入表单的原生对象
        var fd = new FormData($(this)[0])
        // 让对象里面添加属于草稿还是已发布属性值
        fd.append('state', art_state)
        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
                publishArticle(fd)

            })
    })

    function publishArticle(fd) {

        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 如果数据是一个ForData对象的数据，里面必须加上contentType，processData这两个参数，值都必须是false，不然会请求失败。
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                location.href = '/article/art_list.html'
            }
        })
    }

})