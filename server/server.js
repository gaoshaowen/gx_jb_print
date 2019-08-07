(  ()=>{
  const path =require('path')
 
  const {unifiedOrder, wechatApi, notifyVerify} = require('./wepay.js')
  const Koa=require('koa')
  var app=new Koa();

  const router=require('koa-router')()

  const koaBody = require('koa-body');

  const static = require('koa-static')

  //设置静态资源的路径 
  const staticPath = './static'

  app.use(static(
    path.join( __dirname,  staticPath), { }
  ))

  var cors = require('koa2-cors')


 

  //允许跨域
  app.use(cors());


  //微信支付
  // app.use(koaBody({
  //   enableTypes: ['json', 'form', 'text'],
  //   extendTypes: {
  //     text: ['text/xml', 'application/xml']
  //   }
  // }))
  const rootdir = path.join(__dirname,'../static/upload')

  app.use(koaBody({
      enableTypes: ['json', 'form', 'text'],
      extendTypes: {
        text: ['text/xml', 'application/xml']
      },

      multipart: true,
      formidable: {
        maxFileSize: 200*1024*1024, // 设置上传文件大小最大限制，默认200M
        keepExtensions: true,    // 保持文件的后缀  
        maxFieldsSize: 200 * 1024 * 1024, // 文件上传大小
        uploadDir: rootdir, // 设置文件上传目录
        onFileBegin:(name,file) => { // 文件上传前的设置
           
            const ext = dirhelper.getUploadFileExt(file.name);
            // 最终要保存到的文件夹目录
            const dirName = dirhelper.getFileNameNoExt( file.name) // +'/'+ dirhelper.getUploadDirName();
            
            const dir = rootdir+ `/${dirName}`;
            //console.log(dir)
            // 检查文件夹是否存在如果不存在则新建文件夹
            dirhelper.checkDirExist(dir);
    
            // 获取文件名称
            const fileName = dirhelper.getUploadFileName(ext);
            // 重新覆盖 file.path 属性
            file.path = `${dir}/${fileName}`;
    
        },
        onError:(err)=>{
          console.log(err);
        }
    
      }
    }));



  //统一下单
  router.post('/unifiedOrder', unifiedOrder)
  
  //支付结果通知
  router.post('/notify', wechatApi.middleware(), notifyVerify)


  //启动路由
  app.use(router.routes()).use(router.allowedMethods());

  var server =app.listen(8888);
  server.setTimeout(0); 
  server.keepAliveTimeout =1000000;

  server.on('connection', socket=>{
    socket.setTimeout(10*60 *1000); //
    // console.log(socket);
    app.request.remoteip= socket.remoteAddress;

  })

  console.log("service is running with http://localhost:8888");



})()