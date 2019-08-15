var fs = require("fs");
var path =require('path');

function getdevid(){

    var fileName = "device.txt"; //文件名称
    var dirName = "/deviceinfo"; //文件夹名称
    var fullname = path.join( dirName, fileName)

    console.log(fullname)

    //创建文件夹
    let exists = fs.existsSync(dirName);

    console.log(exists ? "文件夹存在" : "文件夹不存在");
        
    if ( ! exists){
        fs.mkdirSync(dirName);     
    }

    //判断文件是否存在
    let exists2 = fs.existsSync(fullname)
    console.log(exists ? "文件存在" : "文件不存在");
    var content = "111111111222222222333333344444";
 
    if ( ! exists2){
        //创建文本 
        fs.writeFile(fullname, content, function(err) {
            console.log("文本创建成功");
        });

    }else {
        content =  fs.readFileSync( fullname ).toString()
    }
    
    return content

}

var devid= getdevid()
console.log('index.js devid:', devid)


