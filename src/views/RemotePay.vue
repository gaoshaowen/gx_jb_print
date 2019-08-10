<template>
    <div>

    </div>
</template>

<script>
import { create } from 'domain';
    export default {
       
        methods:{

            getCode () { // 非静默授权，第一次有弹框
                const code = this.getUrlParam('code') // 截取路径中的code，如果没有就去微信授权，如果已经获取到了就直接传code给后台获取openId
                const local = encodeURIComponent(window.location.href)
                console.log(code)
                if (code == null || code === '') {
                    window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${appid}&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect`
                } else {
                    //this.getOpenId(code) //把code传给后台获取用户信息
                    this.code=code;
                }
            },

            getUrlParam: function (name) {
                var reg=new RegExp('(^|&)'+name+'=([^&]*)(&|$)')
                var r=window.location.search.substr(1).match(reg)
                if(r!=null) return unescape(r[2])
                return null
            },

        },

        create(){

            this.getCode()

        }

    }
</script>

<style lang="scss" scoped>

</style>