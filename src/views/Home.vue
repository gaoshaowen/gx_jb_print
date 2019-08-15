<template>
    
<div class="layout">
    <div id="header">
        <div class="partnerSwiper">
          <swiper :options="swiperOption" ref="mySwiper">
            <!-- slides -->
            <swiper-slide v-for="(item,index) in swipers" :key="index">
                <img :src="item.img"  class="swiperimg"/>
            </swiper-slide>
            <!-- Optional controls -->
            <div class="swiper-pagination"  slot="pagination"></div>
            <div class="swiper-button-prev" slot="button-prev"></div>
            <div class="swiper-button-next" slot="button-next"></div>
            <div class="swiper-scrollbar"   slot="scrollbar"></div>
          </swiper>
        </div>
    </div>
    <div id="container flexbox">

        <div class="flexitem">
            <router-link :to="'/localupload?devid=' + device_id"  >
                <img :src="conf.virtualpath +'static/lunbo/1.jpg'"  />
            </router-link>
        </div>

        <div class="flexitem">
            <div>
                <div id="qrcode"  style="display:inline-block;"></div>
            </div>
            <div>
                扫码上传文件
            </div>
        </div>
        
    </div>

    <div id="footer"></div>

  

</div>


    
    

</template>

<script>

import QRCode from 'qrcodejs2'
import conf from '../config_cli'

export default {
    data(){
        return{
            swiperOption: {
                // 如果需要分页器
                pagination: {
                  el:'.swiper-pagination',
                  type: 'bullets',  
                  clickable: true, //此参数设置为true时，点击分页器的指示点分页器会控制Swiper切换。
                  hideOnClick: true, //默认分页器会一直显示。这个选项设置为true时点击Swiper会隐藏/显示分页器。
                },
                notNextTick: true,
                // 如果需要自动播放
                autoplay : {
                  delay:3000,
                  disableOnInteraction:false,  //用户操作swiper之后，是否禁止autoplay。
                  //reverseDirection: true,   //开启反向自动轮播。
                },
                // 如果需要前进后退按钮
                navigation: {
                  nextEl: '.swiper-button-next', //前进按钮的css选择器或HTML元素。
                  prevEl: '.swiper-button-prev', //后退按钮的css选择器或HTML元素。
                  hideOnClick: true, //点击slide时显示/隐藏按钮
                },
                // 如果需要滚动条
                scrollbar: {
                  el: '.swiper-scrollbar',
                  hide: true, //滚动条是否自动隐藏。默认：false，不会自动隐藏。
                  draggable: true, //该参数设置为true时允许拖动滚动条。
                  snapOnRelease: true, //如果设置为false，释放滚动条时slide不会自动贴合。
                  dragSize: 10, //设置滚动条指示的尺寸。默认'auto': 自动，或者设置num(px)。
                },
                effect:"coverflow",
                grabCursor : true,
                setWrapperSize :true,
                mousewheelControl : true,
                observeParents:true,

            },

            swipers:[
                {url:'static/lunbo',img: conf.virtualpath +'static/lunbo/1.jpg'},
                {url:'static/lunbo',img:conf.virtualpath +'static/lunbo/2.jpg'}
            ],

            device_id:'3b6e9e3694a243214afcbebc18121310',

        }
    },

        // 如果你需要得到当前的swiper对象来做一些事情，你可以像下面这样定义一个方法属性来获取当前的swiper对象，同时notNextTick必须为true
    computed: {
        swiper() {
          return this.$refs.mySwiper.swiper
        }
    },

    methods:{
       generateqr(device_id){
           
            let url = window.location.href;
            let index = url.indexOf('?')

            if ( index>0){
                url =url.substring(0, index)
            }
            
            // console.log('url:' , url);

            // if (url.substring(url.length -1,1 )== '/'){
            //     url = url.substring(0, url.length -2)
            // }
            // console.log('url:' , url);

            let qr_code=  url + 'RemoteUpload?devid=' +device_id
            console.log( 'qr_code:', qr_code)    
        
            let qrcode = new QRCode('qrcode', { // qrcode  html为标签id
                width: 250, // 长度
                height: 250, // 宽度
                text: qr_code, // 内容
            // render: 'canvas' // 设置渲染方式（有两种方式 table和canvas，默认是canvas)
            // background: '#f0f'
            // foreground: '#ff0'
            })
 
        },

    },

    mounted() {
        // you can use current swiper instance object to do something(swiper methods)
        // 然后你就可以使用当前上下文内的swiper对象去做你想做的事了
        // console.log('this is current swiper instance object', this.swiper)
        // this.swiper.slideTo(0, 1000, false)
        //鼠标覆盖停止自动切换
        this.swiper.el.onmouseover = function () {
            this.swiper.autoplay.stop();
        };

        //鼠标离开开始自动切换
        this.swiper.el.onmouseout = function () {
            this.swiper.autoplay.start();
        };

        
        if ( this.$route.query.devid ){
            this.device_id =this.$route.query.devid
        }
        console.log('home device_id: ', this.device_id )
        localStorage.setItem("device_id", this.device_id);

        //得到设备ID
        this.generateqr(this.device_id)
 
    }


}
</script>

<style  scoped>
    .flexbox{
        max-width:960px;
        margin: 0,0; 
        padding:0,0;
        display:-webkit-flex;
        display:flex;
        flex-wrap: row wrap ;
        justify-content:space-around;
        align-items:flex-start;
    } 

    .flexitem{
        box-sizing: border-box;
        display: inline-block;
        margin:10px ,100px;
        padding: 0,0;
        width: 360px;
        height:240px;
        overflow: hidden;
       
    }

    .swiperimg{
        width: 400px;
        height:300px,
    }

    .layout{
        /*width: 960px;*/
        max-width: 960px;
        margin: 0 auto;
    }


 

</style>