var express= require('express');
const app =express();

var path = require('path');
const fs = require('fs');

const bodyParser = require("body-parser");
const axios = require('axios');
const { parse } = require('node-html-parser');

app.use(express.static(path.join(__dirname+'/public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
const PORT=process.env.PORT || 3000;

app.get('/', (req,res)=>{
    res.send({"Status":"200", "Message":"Success"})
})
app.get('/vidsrc', (req,res)=>{
    var url  =  "https://api.whvx.net/source?resourceId="
     axios.get('https://api.whvx.net/search?query={"title":"Spider-Man: No Way Home","releaseYear":2021,"tmdbId":"634649","imdbId":"tt10872600","type":"movie","season":"","episode":""}&provider=nova',{ headers:{origin:"https://www.vidbinge.com"}}).then(resp=>{
      url= url+ resp.data.url +"&provider="+resp.data.embedId
      console.log(url)
      //res.send(resp.data)     
     }).then(uri=>{
        // fetch(url).then(d=>{
        //     console.log(d)
        // })
        var dat ={}
        axios.get(url,{ headers:{origin:"https://www.vidbinge.com",authority:"api.whvx.net" ,"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36"}}).then(r=>{
           dat=r.data
            res.send(dat) 
           }).catch(err=>{
            console.log(err)
            console.log(url)
            res.send(dat)
           })
     })  
  })
app.get('/autoembed/:type/:id/:s/:e', (req, res)=>{
    var type= req.params.type
    var id= req.params.id
    var s= req.params.s
    var e= req.params.e
    var result={};
    var url  =  ""
    if(type=="mv"){url="https://autoembed.cc/embed/player.php?id="+ id}else{url="https://autoembed.cc/embed/mlplayer.php?id="+id+"&s="+s+"&e="+e+"&lang=english"}
   
    axios.get(url).then(resp=>{
    const root = parse(String(resp.data));       
    var str = String(root.querySelectorAll('script')[1]).substring(34).slice(0,-14)
     result = JSON.parse(str+"]}")
     Object.assign(result, {"server":"autoembed"})
     res.send(result )     
    }).catch(err=>{
        console.log(err);
        res.send(result)
    })
})
app.get('/filmxy/:id', (req, res)=>{
    var id= req.params.id
    var result={};
    var url  =  "https://filmxy.wafflehacker.io/search?id="+ id
    axios.get(url).then(resp=>{
        result=resp.data
        res.send(result)
    }).catch(err=>{
        console.log(err);
        res.send(result)
    })
})

/*
 authority:
api.whvx.net
*/
  app.listen(PORT,()=>{
    console.log(`stream started at ${'http://localhost:3000'}`);
});