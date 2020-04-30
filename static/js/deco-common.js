function getCookie(name) {
     var cookieValue = null;
     if (document.cookie && document.cookie != '') {
         var cookies = document.cookie.split(';');
         for (var i = 0; i < cookies.length; i++) {
             var cookie = jQuery.trim(cookies[i]);
             // Does this cookie string begin with the name we want?
             if (cookie.substring(0, name.length + 1) == (name + '=')) {
                 cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                 break;
             }
         }
     }
     return cookieValue;
 };

//顶部搜索栏搜索方法
function search_click(){
    var type = $('#jsSelectOption').attr('data-value'),
        keywords = $('#search_keywords').val(),
        request_url = '';
    if(keywords == ""){
        return
    }
    if(type == "course"){
        request_url = "/course/list?keywords="+keywords
    }else if(type == "teacher"){
        request_url = "/org/teachers?keywords="+keywords
    }else if(type == "org"){
        request_url = "/org/list?keywords="+keywords
    }
    window.location.href = request_url
}

//刷新验证码
function refresh_captcha(event){
    $.get("/captcha/refresh/?"+Math.random(), function(result){
        $('#'+event.data.form_id+' .captcha').attr("src",result.image_url)
        $('#id_captcha_0').attr("value",result.key);
    });
    return false;
}

//手机注册发送手机验证码
function send_sms_code(sendBtn,tipsId){
    var $sendBtn = $(sendBtn),
        $tipsId = $(tipsId),
        $inpRegMobile = $("#jsRegMobile"),
        $inpRegCaptcha = $('#mobile-register-captcha_1'),
        verify = verifyDialogSubmit(
            [
                {id: '#jsRegMobile', tips: Dml.Msg.epPhone, errorTips: Dml.Msg.erPhone, regName: 'phone', require: true},
                {id: '#mobile-register-captcha_1', tips: Dml.Msg.epVerifyCode, errorTips: Dml.Msg.erVerifyCode, regName: 'verifyCode', require: true}
            ]
        );
    if(!verify){
        return;
    }
    $.ajax({
        cache: false,
        type: 'get',
        dataType:'json',
        url:"/user/send_sms_code_change/",
        data:{
            sms_type: 0,
            mobile:$inpRegMobile.val(),
            "captcha_1":$inpRegCaptcha.val(),
            "captcha_0":$('#mobile-register-captcha_0').val(),
        },
        async: true,
        beforeSend:function(XMLHttpRequest){
            $sendBtn.val("发送中...");
        },
        success: function(data){
            $sendBtn.removeAttr("disabled");
            $sendBtn.val("发送验证码");
            if(data.mobile){
                Dml.fun.showValidateError($inpRegMobile, data.mobile);
                refresh_captcha({"data":{"form_id":"jsRefreshCode"}});
            }else if(data.captcha){
                Dml.fun.showValidateError($inpRegCaptcha, data.captcha);
                refresh_captcha({"data":{"form_id":"jsRefreshCode"}});
            }else if(data.msg){
                Dml.fun.showValidateError($inpRegMobile, data.msg);
                $sendBtn.val("重新发送");
                refresh_captcha({"data":{"form_id":"jsRefreshCode"}});
            }else if(data.status == 'success'){
                Dml.fun.showErrorTips($tipsId, "短信验证码已发送");
                $sendBtn.attr("disabled","disabled");
                show_send_sms(60);
            }
        }
    });
}

//手机注册发送手机验证码
$('#jsSetNewPwdBtn').on('click', function(){
    var _self = $(this),
         $idAccount = $("#account");
         verify = verifyDialogSubmit(
            [
                {id: '#jsResetPwd', tips: Dml.Msg.epResetPwd, errorTips: Dml.Msg.erResetPwd, regName: 'pwd', require: true},
                {id: '#jsResetPwd2', tips: Dml.Msg.epRePwd, repwd: '#jsResetPwd', require: true},
                {id: '#jsResetCode', tips: Dml.Msg.epPhCode, errorTips: Dml.Msg.erPhCode, regName: 'phoneCode', require: true}
            ]
        );
    if(!verify){
       return;
    }

    $.ajax({
        cache: false,
        type: 'post',
        dataType:'json',
        url:"/user/mobile/resetpassword/",
        data:$('#jsSetNewPwdForm').serialize(),
        async: true,
        beforeSend:function(XMLHttpRequest){
            _self.val("提交中...")
            _self.attr("disabled","disabled")
        },
        success: function(data) {
            if(data.status == 'success'){
                Dml.fun.showTipsDialog({
                    title:'重置成功',
                    h2:'重置密码成功！'
                });
                $('#jsSetNewPwdForm')[0].reset();
            }else if(data.status == 'faliuer'){
                 Dml.fun.showTipsDialog({
                    title:'重置失败',
                    h2:data.msg,
                    type:'failbox'
                })
            }else if(data.code){
                 Dml.fun.showValidateError($('#jsResetCode'), data.code);
            }
        },
        complete: function(XMLHttpRequest){
            _self.val("提交");
            _self.removeAttr("disabled");
        }
    });
})

//收藏分享
function favPraise($elem, fun ,typeid){
    var num = parseInt($elem.text()),
        favid = $elem.attr('data-favid'),url = '',
        styleClass1 = '',styleClass2 = '',numChange = '',
        btnFont = arguments[3] || '',btnFont2 = '',styleType = btnFont;

    if($elem.hasClass('collected')){
        if(fun == 'fav'){
            url = '/common/delfavorite/';
        }else if(fun == 'pra'){
            url = '/common/delpraise/';
        }
        styleClass1 = 'collected';
        styleClass2 = 'uncollect';
        btnFont = '已' + btnFont;
        btnFont2 = arguments[3] || '';
        if(num > 0) numChange = num - 1;
    } else {
        if(fun == 'fav'){
            url = '/common/addfavorite/';
        }else if(fun == 'pra'){
            url = '/common/addpraise/';
        }
        styleClass1 = 'uncollect';
        styleClass2 = 'collected';
        btnFont2 = '已' + btnFont;
        numChange = num + 1;
    }
    var csrftoken = getCookie('csrftoken');
    $.ajax({
        cache: false,
        type: "POST",
        url: url,
        data: {
            typeid: typeid,
            favid: favid
        },
        async: true,
        beforeSend:function(xhr, settings){
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
            $elem.removeClass(styleClass1).addClass(styleClass2);
            if(!styleType){
                $elem.text(numChange);
            } else {
                $elem.html(btnFont2);
            }
        },
        success: function(data) {
            if(data.status == 'failure'){
                $elem.addClass(styleClass1).removeClass(styleClass2);
                if(!styleType) {
                    $elem.text(num);
                } else {
                    $elem.html(btnFont);
                }
            }
        },
        error:function(){
            $elem.addClass(styleClass1).removeClass(styleClass2);
            if(!styleType) {
                $elem.text(num);
            } else {
                $elem.html(btnFont);
            }
        }
    });
}


function getCookie(name) {
     var cookieValue = null;
     if (document.cookie && document.cookie != '') {
         var cookies = document.cookie.split(';');
         for (var i = 0; i < cookies.length; i++) {
             var cookie = jQuery.trim(cookies[i]);
             // Does this cookie string begin with the name we want?
             if (cookie.substring(0, name.length + 1) == (name + '=')) {
                 cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                 break;
             }
         }
     }
     return cookieValue;
}

$(function() {
    $(window).resize(function(){
        $('.dialogbox').each(function(){
            if($(this).css('display') == 'block'){
                centerDialog($(this));
            }
        });
    });
    $(".scrollLoading").scrollLoading();
    //兼容IE9下placeholder不显示问题
    function isPlaceholder(){
        var input = document.createElement('input');
        return 'placeholder' in input;
    }
    if(!isPlaceholder()){
        $("input").not("input[type='password']").each(
            function(){
                if($(this).val()=="" && $(this).attr("placeholder")!=""){
                    $(this).val($(this).attr("placeholder"));
                    $(this).focus(function(){
                        if($(this).val()==$(this).attr("placeholder")) $(this).val("");
                    });
                    $(this).blur(function(){
                        if($(this).val()=="") $(this).val($(this).attr("placeholder"));
                    });
                }
        });
        $("textarea").each(
            function(){
                if($(this).val()=="" && $(this).attr("placeholder")!=""){
                    $(this).val($(this).attr("placeholder"));
                    $(this).focus(function(){
                        if($(this).val()==$(this).attr("placeholder")) $(this).val("");
                    });
                    $(this).blur(function(){
                        if($(this).val()=="") $(this).val($(this).attr("placeholder"));
                    });
                }
        });
        var pwdField    = $("input[type=password]");
        var pwdVal      = pwdField.attr('placeholder');
        pwdField.after('<input id="pwdPlaceholder" type="text" value='+pwdVal+' autocomplete="off" />');
        var pwdPlaceholder = $('#pwdPlaceholder');
        pwdPlaceholder.show();
        pwdField.hide();

        pwdPlaceholder.focus(function(){
            pwdPlaceholder.hide();
            pwdField.show();
            pwdField.focus();
        });

        pwdField.blur(function(){
            if(pwdField.val() == '') {
                pwdPlaceholder.show();
                pwdField.hide();
            }
        });
    }
    //右边悬浮按钮组
	$(window).scroll(function(){
		if($(window).scrollTop()>200){
			$('.sidebar').show();
		}else{
			$('.sidebar').hide();
		};
	});
	//二维码
	$('.sidebar .code').hover(function(){
		$('.sidebar .sidecode').stop(true).fadeToggle();
	});
	//分享
	$('.sidebar .share').hover(function(){
		$('.sidebar .bdsharebuttonbox').stop(true).fadeToggle();
	});
	//返回顶部
	$('.totop').click(function(){
		$('html,body').animate({scrollTop:0},100);
		return false;
	});

    //顶部个人中心下拉框
    $('.header .personal').hover(function(){
        $('.header .userdetail').stop(true).show();
    },function(){
        $('.header .userdetail').stop(true).hide();
    });
    var msg_show = true,
        msg = +$('#MsgNum').text();
    function msgFlash(){
        var $elem = $('#MsgNum');
        if(!msg){
            clearInterval(m);
        }
        if(msg_show){
            $elem.text(msg);
            msg_show = false;
        }else{
            $elem.text('');
            msg_show = true;
        }
    }
    var m = setInterval(msgFlash,500);

    //顶部导航菜单
    $('.nav .arrow').mousemove(function(){
        $(this).find('.drop').stop(true,true).slideDown();
    });
    $('.nav .arrow').mouseleave(function(){
        $(this).find('.drop').stop(true,true).slideUp();
    });

    //顶部搜索栏搜索按钮事件
    $('#jsSelectOption').on('click', function(){
        var $jsSelectMenu = $('#jsSelectMenu');
        if($jsSelectMenu.css('display') == 'block') return;
        $jsSelectMenu.addClass('dis');
    });
    $('#jsSelectMenu > li').on('click', function(){
        var searchType = $(this).attr('data-value'),
            searchName = $(this).text(),
            $jsSelectOption = $('#jsSelectOption');
        $jsSelectOption.attr('data-value',searchType).text(searchName);
        $(this).parent().removeClass('dis');
    });
    $(document).on('click', function(e){
        if(e.target != $('#jsSelectOption')[0] && e.target != $('#jsSelectMenu')[0]){
            $('#jsSelectMenu').removeClass('dis');
        }
    });


    $('#jsSearchBtn').on('click',function(){
        search_click()
    });
    //搜索表单键盘事件
    $("#search_keywords").keydown(function(event){
        if(event.keyCode == 13){
             $('#jsSearchBtn').trigger('click');
        }
    });

    //input的focus和blur效果
	$('.dialogbox .box input').focus(function(){
		$(this).parent('.box').removeClass().addClass('box focus');
	});
	$('.dialogbox .box input').blur(function(){
		$(this).parent('.box').removeClass().addClass('box blur');
	});

    //顶部登录按钮弹窗
    // $('.loginbtn').on('click', function(){
    //     Dml.fun.showDialog('.loginbox','#jsLoginTips');
    // });

    //$('.registerbtn').on('click', function(){
     //   Dml.fun.showDialog('.registbox', '#jsEmailTips', '#jsMobileTips');
	//});

    //其他需要登录的链接弹窗
    $('.notlogin').on('click', function(){
        Dml.fun.showDialog('.loginbox','#jsLoginTips');
	});
    //登录链接弹窗
    $('.dialogbox .login').on('click', function(){
        Dml.fun.showDialog('.loginbox','#jsLoginTips');
    });

    //注册链接弹窗
    $('.dialogbox .regist').on('click', function(){
        Dml.fun.showDialog('.registbox', '#jsEmailTips', '#jsMobileTips');
    });
    //其他需注册链接弹窗
    $('.jsOtherRegBtn').on('click', function(){
         Dml.fun.showDialog('.registbox', '#jsEmailTips', '#jsMobileTips');
	});

    //忘记密码链接弹窗
    $('.dialogbox .forget').on('click', function(){
        Dml.fun.showDialog('.forgetbox', '#jsForgetTips');
    });

    //邮箱注册和手机注册弹窗tab事件
    $('.jsRegTab').on('click', function(){
        var tabindex = $(this).index();
        $('.jsTabBox').addClass('hide').eq(tabindex).removeClass('hide');
        $(this).addClass('active').siblings().removeClass('active');
        $('#jsEmailTips').hide();
        $('#jsMobileTips').hide();
	});

    //layer加载扩展模块
    layer.config({
        extend: 'extend/layer.ext.js'
    });
    $('.jsLayerBox').one('mouseover', function(){
        var _self = $(this);
        layer.ready(function(){
            layer.photos({
                shift: false,
                shade: [0.8, '#000'],
                photos: _self,
                area: 'auto'
            });
        });
    });

    $('#jsDialog').on('click', '.laydate', function(){
        laydate({
            format: 'YYYY-MM-DD',
            min: laydate.now()
        });
    });

    $('.jsShowPerfect2').on('click',function(){
        var companyId = $(this).attr('data-id');
            $('#jsCompanyId').val(companyId);
        Dml.fun.showDialog('.groupbox02', '#jsPerfetTips2');
    });

    //弹出框关闭按钮
	$('.jsCloseDialog').on('click', function(){
        $('#jsDialog').hide();
        $('html').removeClass('dialog-open');
		$(this).parents('.dialogbox').hide();
        $('#dialogBg').hide();
        if($(this).parent().find('form')[0]){
            $(this).parent().find('form')[0].reset();
        }
	});

    // 发送手机注册验证码
	$('#jsSendCode').on('click',function(){
        send_sms_code(this,$('#jsMobileTips'));
    });

    //注册刷新验证码点击事件
    $('#email_register_form .captcha-refresh').click({'form_id':'email_register_form'},refresh_captcha);
    $('#email_register_form .captcha').click({'form_id':'email_register_form'},refresh_captcha);
    $('#mobile_register_form .captcha').click({'form_id':'jsRefreshCode'},refresh_captcha);
    $('#changeCode').click({'form_id':'jsRefreshCode'},refresh_captcha);
    $('#jsFindPwdForm .captcha-refresh').click({'form_id':'jsFindPwdForm'},refresh_captcha);
    $('#jsFindPwdForm .captcha').click({'form_id':'jsFindPwdForm'},refresh_captcha);
    $('#jsChangePhoneForm .captcha').click({'form_id':'jsChangePhoneForm'},refresh_captcha);
    //登录
    $('#jsLoginBtn').on('click',function(){
        login_form_submit();
    })
    //登录表单键盘事件
    $("#jsLoginForm").keydown(function(event){
        if(event.keyCode == 13) {
            $('#jsLoginBtn').trigger('click');
        }
    });

    //邮箱注册
    // $('#jsEmailRegBtn').on('click',function(){
    //     register_form_submit(this,'emailReg');
    // });
    // $("#email_register_form").keydown(function(event){
    //     if(event.keyCode == 13){
    //      $('#jsEmailRegBtn').trigger('click');
    //     }
    // });
    // $("#mobile_register_form").keydown(function(event){
    //     if(event.keyCode == 13){
    //          $('#jsMobileRegBtn').trigger('click');
    //     }
    // });

    //首页-忘记密码表单键盘事件
    $('#jsFindPwdBtn').on('click', function(){
        find_password_form_submit();
    });
    $("#jsFindPwdForm").keydown(function(event){
        if(event.keyCode == 13){
           $('#jsFindPwdBtn').trigger('click');
        }
    });

    //再次发送激活邮件事件
	$('#jsSenEmailAgin').on('click', function(e){
        e.preventDefault();
		$(".zy_success").removeClass("upmove");
		$(this).parent().hide();
		$(".sendE2").show().find("span").html("60s");
        $.ajax({
            cache:false,
            type:'get',
            dataType:'json',
            url: "/user/send_again_email/",
            data: {username:zyUname},
             success: function(data){
                 zy_str="验证邮件发送成功";
                 //console.log(data)
                 if(data)
                    zy_Countdown();
             },
            error:function(){
                zy_str="验证邮件发送失败";
            }

         });
	});

    $(".toolbar-item-fankui,.toolbar-item-gotop").hover(function(){
        $(this).children().stop().show("fast")
    },function(){
        $(this).children().stop().hide("fast")
    });
    $(".toolbar-item-gotop").click(function(){
        $('html,body').stop().animate({scrollTop: '0px'}, 800);
    });

	/*列表更多按钮*/
    $('.listoptions').find('.more').click(function(){
        var height = $('.listoptions .cont').height();
        if(!$('.listoptions .cont').hasClass("opened")){
            $('.listoptions .cont').css({
                "height":"auto",
                "overflow":"visible"
            }).addClass("opened");
            $('.listoptions').find('.more').html('收起')
        }else{

            $('.listoptions .cont').css({
                "height":"50px",
                "overflow":"hidden"
            }).removeClass("opened");

            $('.listoptions').find('.more').html('更多')
        }
    });

    $('img').on('error', function(){
        $(this).off('error').attr('src', '/static/images/error-img.png');
    });
});