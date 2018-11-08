var needle = require('needle');
var fs = require('fs');

var token="";
var msg = "";
var att = "";

fs.readFile('vk.txt', 'utf8', function(err, contents) {
    var sId = [];
    sId=contents.split("\n");
    var i=0;

    var t = setInterval(function(){
        if(sId[i] !== undefined)
        {
            var url = "https://api.vk.com/api.php?oauth=1&method=wall.post&owner_id="+sId[i]+"&message="+msg+"&attachments="+att+"&v=5.74&access_token="+token;
            needle.get(url, function(err, res){
                        if (err) throw err;
                        console.log(sId[i],res.body)
                });
        }
        
        i++;
        if(i > sId.length)
            clearInterval(t);
        },10000);
    
});
