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
                    <!-- <button class="el-button el-button-primary"   @click="pageindex++"> 提交订单 </button> -->

                    <button class="el-button el-button-primary"   @click="uploadfile"> 上传该文件 </button>
                    <button class="el-button el-button-primary"  @click="tongbufile"   v-show="upload_file.url" > 同步文件</button>

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
                    <button class="el-button el-button-primary" :disabled="! openid"   @click="callpay"> 立即支付 </button>
                </div>
            
            </div>

            <div class ="page3" v-show="pageindex==3">
            
                <div >
                    {{ print_status}}
                </div>

                <div class="footer">
                    <button class="el-button el-button-primary"  v-show="upload_type == 'local'"  @click="pageindex--"> 上一步 </button>
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
//import { clearScreenDown } from 'readline';
// import { clearTimeout } from 'timers';

export default {
    data(){
        return {
            pageindex:1,

            upload_file:{  
                type:'upload_file',
                filename: "",
                pdffilename:'',
                ufile: null,
                result: "",
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

            openid:'hello ',

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

        is_valid_file_type($file_type){
            if (($file_type == "image/gif")
                    || ($file_type == "image/jpeg")
                || ($file_type == "image/jpg")
                || ($file_type == "image/png")
                || ($file_type == "image/doc")
                || ($file_type == "application/pdf")
                || ($file_type == "application/wps-office.pptx")
                || ($file_type == "application/wps-office.xlsx")
                || ($file_type == "application/wps-office.docx")
                || ($file_type == "application/wps-office.ppt")
                || ($file_type == "application/vnd.ms-excel")
                || ($file_type == "application/wps-office.doc")
                || ($file_type == "application/msword")
                || ($file_type == "application/vnd.ms-powerpoint")
                || ($file_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
                || ($file_type == "application/vnd.openxmlformats-officedocument.presentationml.presentation")
                || ($file_type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")){
                return  true ;
            }else{
                return  false;
            }
        },


        async getFile(upload_file , event, ref) {
            var file = event.target.files[0];

            if ( ! this.is_valid_file_type( file.type )){
                alert('不支持的文件')
                return;
            }

            console.log(file);
            
            let filesize =file.size 

            //限制文件大小为100M
            if( filesize >100 *1024*1024 ){
                alert( '上传文件不能超过 100M')
                return 
            }

            //判断图片类型 webp，bmp,jpg,png,tif,gif 等
            let lastindex = event.target.files[0].name.lastIndexOf(".")    
            let extname =  event.target.files[0].name.substring(lastindex)
            extname =extname.toLowerCase();

            // if (extname !='.webp' && extname !='.bmp' && extname !='.jpg' && extname !='.jpeg' && extname !='.png'  && extname !='.tif'  && extname !='.gif' && extname !='.ico' ){
            //     alert( event.target.files[0].name  + this.$t('Application.notfiletype') +  '  (ico,bmp,png,gif,tif,jpg,jpeg,webp)')
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


            await this.uploadfile(ref)
  
        },

        async uploadfile(ref){  //确定要打印当前文件同步到平板上
            //1. 上传文件

            let vm = this;
            this.uploadRate = 0;
            this.uploadStyle.width = '0%';
            this.uping =true

            //上传文件
            let config = {
                headers: {
                "Content-Type": "multipart/form-data"
                },

                onUploadProgress: function (e) {
                    //属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
                    //如果lengthComputable为false，就获取不到e.total和e.loaded
                    if (e.lengthComputable) {
                        var rate = vm.uploadRate = e.loaded / e.total;  //已上传的比例
                        if (rate < 1) {
                            //这里的进度只能表明文件已经上传到后台，但是后台有没有处理完还不知道
                            //因此不能直接显示为100%，不然用户会误以为已经上传完毕，关掉浏览器的话就可能导致上传失败
                            //等响应回来时，再将进度设为100%
                            vm.uploadRate = rate;
                            vm.uploadStyle.width = (rate *100).toFixed(2)+ '%';
                        }
                    }
                }

            }

     
            let params =new FormData();
            params.append("file", this.upload_file.ufile); 

            try {
           
                let data =await  this.axios.post(this.fileUploadAPI,params,config);
                data= data.data;
                console.log('upload return: ', JSON.stringify( data))

                if ( data.code !=0){
                    alert(data.msg);
                }

                this.upload_file.url = data.url.file.path
                this.upload_file.pdffilename = data.url.file.pdffilename

  
                //2. 把上传的文件URL 同步到平板电脑显示
                this.tongbufile()

                console.log( 'upload_file: ' , JSON.stringify( this.upload_file) )
            }
            catch(err){
                this.upload_file.result =err
                console.log('err:', err)
            }


            this.uploadRate = 0;
            this.uploadStyle.width = '0%';
            this.uping =false;

            this.$refs[ref].value = "";

        },

        tongbufile(){

            this.$socket.emit('remoteupload',{devid:this.device_id });

            if ( ! this.upload_file.filename){
                alert('请选择文件再同步')
                return
            }

            let obj ={
                devid: this.device_id,
                upload_file:{  
                    filename:  this.upload_file.filename,
                    pdffilename: this.upload_file.pdffilename,
                    size:  this.upload_file.size,
                    unit:  this.upload_file.unit,
                    url: this.upload_file.url
                }

            }

            this.$socket.emit('tongbufile',obj );
    

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


        getCode() {
            // 非静默授权，第一次有弹框
            const code = this.getUrlParam("code"); // 截取路径中的code，如果没有就去微信授权，如果已经获取到了就直接传code给后台获取openId
            var url = window.location.href;
            //const url = encodeURIComponent(url.split('#')[0]); //获取#之前的当前路径
            url = encodeURIComponent(url); 

            if (code == null || code == "") {
            window.location.href =`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.APPID}&redirect_uri=${url}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`;
            } else {
            //return code

            this.code = code 
            console.log(code);
            // this.getOpenId(code); //把code传给后台获取用户信息
            }
        },

        getUrlParam(name) {
            // 如果用户同意授权，页面将跳转至 redirect_uri/?code=CODE&state=STATE。
            // code说明 ： code作为换取access_token的票据，每次用户授权带上的code将不一样，code只能使用一次，5分钟未被使用自动过期。

            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");

            var r = window.location.search.substr(1).match(reg);
            console.log(r);

            if (r != null) return unescape(r[2]);

            return null;
            },
            getUrlParam(name) {
            // 如果用户同意授权，页面将跳转至 redirect_uri/?code=CODE&state=STATE。
            // code说明 ： code作为换取access_token的票据，每次用户授权带上的code将不一样，code只能使用一次，5分钟未被使用自动过期。

            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");

            var r = window.location.search.substr(1).match(reg);
            console.log(r);

            if (r != null) return unescape(r[2]);

            return null;
        },

        getOpenId(code) {
            // 通过code获取 openId等用户信息，/api/user/wechat/login 为后台接口
            let _this = this;
            console.log(code);
            this.axios.get(`https://api.weixin.qq.com/sns/oauth2/access_token?appid=${this.APPID}&secret=${this.SECRET}&code=${code}&grant_type=authorization_code`).then(res => {
            console.log(res);
            let openid ;
            if (res.data.code == 2000) {
            openid = res.data.data;
            }else{
            console.log(res);
            return;
            }
            this.openid = openid 

            localStorage.setItem("openid", openid);
            // _this.getindexOne(userId);
            });
        },

        getindexOne(userId) {
            let params = {
            'channel': "qyvx",
            'openID': userId
            };
            api("/app/arrange/judgeOrder", "get", params).then(res => {
            if (res.data.data == 0) {
            this.$router.push({ name: "index" });
            // window.location.replace("/#/index");
            } else {
            this.$router.push({ name: "about" });
            // window.location.replace("/#/about");
            }
            });
        },


    
        //调用微信JS api 支付
        jsApiCall()
        {
            
            //统一下单   H5 付款
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
                    openid: this.openid
                }

                this.pageindex =3
                this.handleCheckBill( this.order_id);
                
				//请求到node 层unifiedOrder
                this.axios.get(this.conf.server+'/pay/wxpay/unifiedOrder/',{ params: dataPost})
                .then(res=>{
             
                    var prepay_id = res.data.prepay_id  //商户订单
                    console.log( prepay_id)

                    WeixinJSBridge.invoke(
                        'getBrandWCPayRequest', {
                             ...res.data.jsapiobj,

                            // "appId":"wx2421b1c4370ec43b",     //公众号名称，由商户传入     
                            // "timeStamp":"1395712654",         //时间戳，自1970年以来的秒数     
                            // "nonceStr":"e61463f8efa94090b1f366cccfbbb444", //随机串     
                            // "package":"prepay_id=u802345jgfjsdfgsdg888",     
                            // "signType":"MD5",         //微信签名方式：     
                            // "paySign":"70EA570631E4BB79628FBCA90534C63FF7FADD89" //微信签名 
                        },
                        async function(res){
                            if(res.err_msg == "get_brand_wcpay_request:ok" ){

                                //更新订单支付状态
                                try{
                                    let res =await this.axios.post({
                                        url: api_url+'/printapi/orderpaystatus',
                                        data: {
                                        pay_account: info.openid,  //用户在商户appid下的唯一标识  
                                        order_id: info.out_trade_no,  //商户订单号
                                        pay_order: info.transaction_id, //微信交易流水号 
                                        pay_status: 1, //交易状态
                                        }
                                    })

                                    console.log(res.data)

                                    if ( res.data.code ){

                                        handleCheckBill( this.order_id)
                                    }
                                                    

                                }
                                catch (e) {
                                    console.log(e)
                                }

                                // 使用以上方式判断前端返回,微信团队郑重提示：
                                //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                            }
                        
                    })
                  
                }).catch(err => {
                    
                    alert('支付失败！'+ err )
                    
                })
                
			})

           
        },

        callpay(){
            if (typeof WeixinJSBridge == "undefined"){
                if( document.addEventListener ){
                    document.addEventListener('WeixinJSBridgeReady', jsApiCall, false);
                }else if (document.attachEvent){
                    document.attachEvent('WeixinJSBridgeReady', jsApiCall); 
                    document.attachEvent('onWeixinJSBridgeReady', jsApiCall);
                }
            }else{
                jsApiCall();
            }
        }

    },


    mounted(){    

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


        this.$socket.emit('remoteupload',{devid:this.device_id });

        this.sockets.subscribe('tongbufile_back', (data ) => {
            console.log('tongbufile_back:', data)
            
            if ( data.code ){
                console.log('同步成功')
            }else{
                console.log('同步失败:' , data.msg)
            }

        })

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