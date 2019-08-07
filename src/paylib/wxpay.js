// appid:'', //公众账号ID	是	String(32)	wxd678efh567hg6787	微信支付分配的公众账号ID（企业号corpid即为此appId）
// 	mch_id:'',//	是 商户号	String(32)	1230000109	微信支付分配的商户号
// 	device_info:'WEB',//	否 设备号	String(32)	013467007045764	自定义参数，可以为终端设备号(门店号或收银设备ID)，PC网页或公众号内支付可以传"WEB"
// 	nonce_str:'',	//是 随机字符串	String(32)	5K8264ILTKCH16CQ2502SI8ZNMTM67VS	随机字符串，长度要求在32位以内。推荐随机数生成算法
//     sign:'', //	是 签名	String(32)	C380BEC2BFD727A4B6845133519F3AD6	通过签名算法计算得出的签名值，详见签名生成算法
//             /* 第一步，设所有发送或者接收到的数据为集合M，将集合M内非空参数值的参数按照参数名ASCII码从小到大排序（字典序），使用URL键值对的格式（即key1=value1&key2=value2…）拼接成字符串stringA。
//                第二步，在stringA最后拼接上key得到stringSignTemp字符串，并对stringSignTemp进行MD5运算，再将得到的字符串所有字符转换为大写，得到sign值signValue。
//                 ◆ key设置路径：微信商户平台(pay.weixin.qq.com)-->账户设置-->API安全-->密钥设置
//                 举例：
//                 第一步：对参数按照key=value的格式，并按照参数名ASCII字典序排序如下：
//                 stringA="appid=wxd930ea5d5a258f4f&body=test&device_info=1000&mch_id=10000100&nonce_str=ibuaiVcKdpRxkhJA";

//                 第二步：拼接API密钥：
//                 stringSignTemp=stringA+"&key=192006250b4c09247ec02edce69f6a2d" //注：key为商户平台设置的密钥key
//                 sign=MD5(stringSignTemp).toUpperCase()="9A0A8659F005D6984697E2CA0A9CF3B7" //注：MD5签名方式
//             */  

// 	body:'',	//是	商品描述 String(128)	腾讯充值中心-QQ会员充值	
//                 //商品简单描述，该字段请按照规范传递，具体请见参数规定
//     notify_url: '',	//是 通知地址	String(256)	http://www.weixin.qq.com/wxpay/pay.php	异步接收微信支付结果通知的回调地址，通知url必须为外网可访问的url，不能携带参数。
//     trade_type: '',	//是 交易类型	String(16)	JSAPI	JSAPI -JSAPI支付   , NATIVE -Native支付  , APP -APP支付  

//     out_trade_no:'',//	是 商户订单号	String(32)	20150806125346	商户系统内部订单号，要求32个字符内，只能是数字、大小写字母_-|* 且在同一个商户号下唯一。详见商户订单号
//     total_fee:1,	//是 标价金额	Int	88	订单总金额，单位为分，详见支付金额
// 	spbill_create_ip:'', //	是 终端IP	String(64)	123.12.12.123	支持IPV4和IPV6两种格式的IP地址。用户的客户端IP


//     sign_type:'MD5',	//否 签名类型	String(32)	MD5	签名类型，默认为MD5，支持HMAC-SHA256和MD5。
// 	detail:'',	//否 商品详情	String(6000)	 	商品详细描述，对于使用单品优惠的商户，该字段必须按照规范上传，详见“单品优惠参数说明”
// 	attach:'',	//否 附加数据	String(127)	深圳分店	附加数据，在查询API和支付通知中原样返回，可作为自定义参数使用。
	
// 	fee_type:'',	//否 标价币种	String(16)	CNY	符合ISO 4217标准的三位字母代码，默认人民币：CNY，
// 	time_start:'',  //否 交易起始时间	String(14)	20091225091010	订单生成时间，格式为yyyyMMddHHmmss，如2009年12月25日9点10分10秒表示为20091225091010。其他详见时间规则
// 	time_expire:'',	//否 交易结束时间	String(14)	20091227091010	
//                     //订单失效时间，格式为yyyyMMddHHmmss，如2009年12月27日9点10分10秒表示为20091227091010。订单失效时间是针对订单号而言的，
//                     //由于在请求支付的时候有一个必传参数prepay_id只有两小时的有效期，所以在重入时间超过2小时的时候需要重新请求下单接口获取新的prepay_id。其他详见时间规则
//                     //建议：最短失效时间间隔大于1分钟

//     goods_tag: '',	//否 订单优惠标记	String(32)	WXG	订单优惠标记，使用代金券或立减优惠功能时需要的参数，说明详见代金券或立减优惠
    
//	product_id:'',	//否	商品ID String(32)	12235413214070356458058	trade_type=NATIVE时，此参数必传。此参数为二维码中包含的商品ID，商户自行定义。
const wxpay={
    order_url:'https://api.mch.weixin.qq.com/pay/unifiedorder',
    baseconf:{
        appid:'', //公众账号ID	是	String(32)	wxd678efh567hg6787	微信支付分配的公众账号ID（企业号corpid即为此appId）
        mch_id:'',//	是 商户号	String(32)	1230000109	微信支付分配的商户号
        notify_url: '',	//是 通知地址	String(256)	http://www.weixin.qq.com/wxpay/pay.php	异步接收微信支付结果通知的回调地址，通知url必须为外网可访问的url，不能携带参数。
    },

    native_order:function(out_trade_no, total_fee, product_id ){  //统一下单
        
        let conf={ 
          
            device_info: 'WEB',//	否 设备号	String(32)	013467007045764	自定义参数，可以为终端设备号(门店号或收银设备ID)，PC网页或公众号内支付可以传"WEB"
            nonce_str:'',	//是 随机字符串	String(32)	5K8264ILTKCH16CQ2502SI8ZNMTM67VS	随机字符串，长度要求在32位以内。推荐随机数生成算法

            body:'共享打印-扫码支付',	//是	商品描述 String(128)	腾讯充值中心-QQ会员充值	
                        //商品简单描述，该字段请按照规范传递，具体请见参数规定
    
            trade_type: 'NATIVE',	//是 交易类型	String(16)	JSAPI	JSAPI -JSAPI支付   , NATIVE -Native支付  , APP -APP支付  
            spbill_create_ip:'', //	是 终端IP	String(64)	123.12.12.123	支持IPV4和IPV6两种格式的IP地址。用户的客户端IP

            out_trade_no,//	是 商户订单号	String(32)	20150806125346	商户系统内部订单号，要求32个字符内，只能是数字、大小写字母_-|* 且在同一个商户号下唯一。详见商户订单号
            total_fee,	//是 标价金额	Int	88	订单总金额，单位为分，详见支付金额
          
            product_id,	//否	商品ID String(32)	12235413214070356458058	trade_type=NATIVE时，此参数必传。此参数为二维码中包含的商品ID
        }



    },
    






}

module.exports =wxpay;