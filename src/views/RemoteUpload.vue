<template>
    <div class="layout" >

        <div class="header">
            <h2> 共享打印 </h2> 
        </div>

        <div class="main">

            <div class="page1"  v-show="pageindex==1">
                <input
                type="file"
                @change="getFile( upload_file ,$event, 'print_file')"
                ref="print_file"
                id="print_file"
                style="display:none;"
           
                />
                
                <div>
                    <button class="el-button el-button-primary"   @click="selectfile('print_file')"> 选择要打印的文件</button>
                </div>
               
                <div v-show="upload_file.filename"> 
                    {{upload_file.filename}} ( {{upload_file.size }} {{upload_file.unit}} )
                    <span class="el-button-text" @click="upload_file.filename=''">删除</span>
                    <!-- 
                    <iframe
                        :src="'//ow365.cn/?i=18679&ssl=1&furl='+upload_file.url"
                        width="100%"
                        height="100%"
                        frameborder="0">
                    </iframe> -->

                </div>

                <div class="footer" v-show="upload_file.filename">
                    <button class="el-button el-button-primary"   @click="pageindex++"> 提交订单 </button>
                </div>
                
            </div>
            
            <div class="page2" v-show="pageindex==2">
                <div>

                    <div class="row" >
                        <div class="title_col">
                            文件
                        </div>
                        <div class="main_col">
                            {{upload_file.filename}} ( {{upload_file.size }} {{upload_file.unit}} ) 
                        </div>
                    </div>

                    <div class="row" >
                        <div class="title_col">
                            色彩
                        </div>
                        <div class="main_col">
                            {{ print_args.color }} 
                        </div>
                    </div> 

                    <div class="row" >
                        <div class="title_col">
                            单双面
                        </div>
                        <div class="main_col">
                            {{ print_args.side }} 
                        </div>
                    </div> 

                    <div class="row" >
                        <div class="title_col">
                            纸张大小
                        </div>
                        <div class="main_col">
                            {{ print_args.pagesize }} 
                        </div>
                    </div> 

                    <div class="row" >
                        <div class="title_col">
                            份数
                        </div>
                        <div class="main_col">
                            {{ print_args.qty }} 
                        </div>
                    </div> 

                    <div class="row" >
                        <div class="title_col">
                            支付方式
                        </div>
                        <div class="main_col">
                           <template  v-for="item, ind in pay_types">
                               <input type="radio"   v-model="pay_type"  :value="item.id"  :key="ind"/> {{ item.text }} 
                           </template>

                            {{pay_type}}
                        </div>
                    </div> 
                    
                </div>

                <div class="footer">
                    <button class="el-button el-button-primary"   @click="pageindex--"> 上一步 </button>
                    <button class="el-button el-button-primary"   @click="pay"> 支付 </button>
                </div>
            
            </div>

            <div class ="page3" v-show="pageindex==3">
                <div v-show="upload_type == 'local'" >
                    <div id="qrcode"  ref="qrcode" style="display:inline-block;"></div>
                </div>
                
                <div >
                    {{ print_status}}
                </div>

                <div class="footer">
                    <button class="el-button el-button-primary"  v-show="upload_type == 'local'"  @click="pageindex--"> 上一步 </button>
                    <button class="el-button el-button-primary"  v-show="upload_type == 'local'" @click="refleshcode_rule" > 刷新支付码 </button>

                    <button class="el-button el-button-primary" @click="backhome"  > 返回首页 </button>
                    <button class="el-button el-button-primary"  @click="shensu"  v-show="upload_type == 'local'"> 打印失败申诉 </button>
                </div>
                
            </div>


        </div>
        
    </div>

</template>



<script>

//import axios from 'axios'
// import conf from '../config_cli'
import QRCode from 'qrcodejs2'
// import { clearTimeout } from 'timers';

export default {
    data(){
        return {
            pageindex:1,

            upload_file:{  
                type:'upload_file',
                filename: "",
                ufile: null,
                result: "",
                uping: 0,
                size: 0,
                unit: "kb",
                url:''
            },

            print_args:{
                color:'black',
                side:'one-side',
                pagesize:'A4',
                qty: 1
            },

            total_fee:0.01,

            pay_type:1,
            pay_types:[ {id:1, text:'微信'}],


            qr_url:'', //用于打码支付
            
            upload_type:'remote', // local: 直接本地上传文件 , remote：移动端打码远程打开

            payStatus:false,
            retryCount:0,
            print_status_id:1,

            order_id:'',
            timeout:null,

            device_id:'',

        }
    
    },

    watch:{
        pageindex:function(newval, oldval) {
            if ( newval <3){
                if ( this.timeout) {
                    window.clearInterval(this.timeout)
                  //  clearTimeout( this.timeout)
                    this.timeout =null
                }      
            }
        },

        payStatus:function(newval, oldval) {
            if ( newval ){
                if ( this.print_status_id <1 )
                    this.print_status_id = 1
            }
        },

    },

    computed:{
        print_status(){
            switch( this.print_status_id){
                case 1:
                    return '打印下发中...'

                case 2: 
                    return '打印中...'

                case 3: 
                    return '打印成功'
                case 4:
                    return '打印失败'
                default:
                    return '支付中...'
            }
        }

    },

    methods:{
        backhome(){
            this.pageindex=1

            //this.$router.replace({path:'/'});//替换路由，没有历史记录
        },

        shensu(){  //申诉


        },
        selectfile(ref) {
            document.getElementById(ref).click()
          //  this.$refs[ref].dispatchEvent(new MouseEvent("click"));
        },

        getFile(upload_file , event, ref) {
            var file = event.target.files[0];

            console.log(file);
            
            let filesize =file.size 

            //限制文件大小为100M
            if( filesize >100 *1024*1024 ){
                this.$alert( '上传文件不能超过 100M')
                return 
            }

            //判断图片类型 webp，bmp,jpg,png,tif,gif 等
            let lastindex = event.target.files[0].name.lastIndexOf(".")    
            let extname =  event.target.files[0].name.substring(lastindex)
            extname =extname.toLowerCase();

            // if (extname !='.webp' && extname !='.bmp' && extname !='.jpg' && extname !='.jpeg' && extname !='.png'  && extname !='.tif'  && extname !='.gif' && extname !='.ico' ){
            //     this.$alert( event.target.files[0].name  + this.$t('Application.notfiletype') +  '  (ico,bmp,png,gif,tif,jpg,jpeg,webp)')
            //     return 
            // }

        
            upload_file.ufile = file;
            upload_file.filename = file.name;

            upload_file.size = ((filesize* 1.0) / 1024).toFixed(3);
            if (upload_file.size >= 1024) {
                upload_file.size = (upload_file.size / 1024).toFixed(3);
                upload_file.unit = "MB";
            } else {
                upload_file.unit = "KB";
            }

            this.$refs[ref].value = "";

        },

        generateqr(){

            this.$refs['qrcode'].value='';
            var element_div = document.getElementById("qrcode");
		  //window.alert("element_div"+element_div);
		    element_div.innerHTML = "";

            let qrcode = new QRCode('qrcode', { // qrcode  html为标签id
                width: 300, // 长度
                height: 300, // 宽度
                text: this.qr_url, // 内容
            // render: 'canvas' // 设置渲染方式（有两种方式 table和canvas，默认是canvas)
            // background: '#f0f'
            // foreground: '#ff0'
            })
 
        },

        pay(){
            this.payStatus=false
            this.retryCount=0

            if ( this.upload_type == 'local') {
                this.nativepay()  //生成二维码
            }else {
                this.h5pay()
            }
        },

        nativepay(){  //二维码生成

            this.axios.get( this.conf.server +'/printapi/order', {
                params:{
                    total_fee:this.total_fee
                }
            }).then(res => {

                console.log(res.data)

                this.order_id = res.data.out_trade_no
                this.total_fee = res.data.total_fee      

                this.refleshcode_rule()

            })
        	
        },

        refleshcode_rule(){
            let dataPost = {
				    out_trade_no:this.order_id, //后台生成的订单号
                    total_fee:this.total_fee, //交易金额
                    product_id: this.device_id, //'3b6e9e3694a243214afcbebc18121310'  //32位
            }


            this.axios.get(this.conf.server + '/pay/wxpay/unifiedOrder',
                {params: dataPost}
            ).then(res => {
                let data = res.data
                //返回的二维码信息，需要自己转为二维码图片
                this.qr_url = data.code_url
                this.order_id = data.order_id

                this.pageindex=3

                this.generateqr()

                //根据订单号向后台循环查询交易是否成功
                this.handleCheckBill(data.order_id)
    
                    
            }).catch(err =>{
                console.log(err)
                this.$throwError(err)
            })


        },


        handleCheckBill (order_id) {
            //参考https://juejin.im/post/5afb873f51882542ac7d6998
            //超过10m内循环
            if ( this.timeout ){
                return
            }

            this.timeout = setTimeout(() => {

                if ( this.timeout){
                    window.clearInterval(this.timeout)
                    this.timeout =null
                }

                this.axios.get( this.conf.server +'/printapi/getorder', {
                // 向后端请求订单支付信息
                    params:{ order_id: order_id}
                })
                .then(res => {

                    console.log(res.data)

                    if ( res.data.code ){

                        let data = res.data.data;

                        this.print_status_id = data.print_status_id;

                        if (data.pay_status >0 ) { //数据库里的交易状态码，1为成功，0为失败
                            payStatus = true //交易成功

                            console.log( order_id, ': 支付成功')

                            // window.alert('支付成功')
                
                        }
                    }
                    else{

                        console.log( res.data.msg)
                        this.handleCheckBill( order_id);

                    }

                }).catch(err=>{

                    console.log( err)
                    
                    this.handleCheckBill( order_id)
                   
                        
                })

                this.retryCount++

            }, 5*1000)


        },

    
        h5pay(){ 
             //H5 付款
            this.axios.get( this.conf.server  +'/printapi/order', { 
                params:{
                    total_fee:this.total_fee
                } 
            })
            .then( (res) => {

                this.order_id = res.data.out_trade_no
                this.total_fee = res.data.total_fee   

				let dataPost = {
				    out_trade_no:res.data.out_trade_no, //后台生成的订单号
                    total_fee:res.data.total_fee, //交易金额
                }
                
				//请求到node 层unifiedOrder
                return  this.axios.get(this.conf.server+'/pay/wxpay/unifiedOrder/',{ params: dataPost})
                .then(res=>{
                    //返回的支付地址拼接上redirect_url，支付完返回到原来的页面时，如果有需要查询支付结果，可利用query的checkBill字段去发起查询 
                  
                    let url = window.location.href;
                    let index = url.indexOf('?')

                    if ( index>0){
                        url =url.substring(0, index)
                    }
      
                    window.location.href=(res.data.next+'&redirect_url='+encodeURI(url+`?upload_type=${this.upload_type}pageindex=3&order_id=${res.data.order_id}`))
                }).catch(err => {
                    
                    alert('支付失败！'+ err )
                    
                })
                
			})
			
        },


    },

    mounted(){
     
        // this.axios.get( 'http://tms.topwisesz.com:8989/api/user/clientip'
        // //this.axios.get(this.conf.server + '/pay/wxpay/unifiedOrder',

        // ).then(res => {
        //     let data = res.data
        //     console.log('clientip:', data)
                
        // }).catch(err =>{
        //     console.log(err)
        //     this.$throwError(err)
        // })

        console.log( this.$route.query)

        if ( this.$route.query.devid ){
            this.device_id =this.$route.query.devid
        }

        console.log('device_id: ', this.device_id )

        if ( this.$route.query.order_id ){
             this.order_id =this.$route.query.order_id
        }

        if ( this.$route.query.upload_type ){
             this.upload_type =this.$route.query.upload_type
        }

        if (this.$route.query.pageindex) {
            this.pageindex =this.$route.query.pageindex          
        }

        if ( this.pageindex>=3 && this.order_id  ){
            this.handleCheckBill(this.order_id)
        }

    }


}
</script>

<style scoped>

.layout{
    /*width: 960px;*/
    max-width: 960px;
    margin: 0 auto;
}

.header{
    text-align: center;
}
.main{
    /* position:absolute; */
    margin-top:40px;
}
.footer{
    margin-top: 20px;
}
.el-button {
    
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #dcdfe6;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    transition: .1s;
    font-weight: 500;
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 4px;
    margin:10px 20px;
}

.el-button-primary {
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
}

.el-button-mini,.el-button-small {
    font-size: 9px;
    border-radius: 3px;
}

.el-button-text {
    color: #409eff;
    background: 0 0;
    padding-left: 0;
    padding-right: 0;
}

.el-button-text:hover{
    cursor: pointer;
    color:white;
    background-color:darkgreen;
}

.row{
    color: #337ab7;
    display: flex;
    display:-webkit-flex;
    flex-wrap: row wrap ;
    justify-content:flex-start;
    align-items:flex-start;
    margin:10px,10px;
}

.title_col{
    width:150px;
    text-align: left;
    padding-top:10px;
}
.main_col{
    width:100%;
    text-align: left;
    padding-top:10px;
}

#canvas{
    width:500px;
    height: 500px;
}

</style>