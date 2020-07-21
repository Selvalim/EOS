
//ver没有1494


//设置svg1
var height1 = 350
var width = 1000
var bargin = 80
var svg1=d3.select("#rank")
    .append('svg');

svg1.attr('height',height1)
.attr('width',width)
.attr("viewbox","0 0 1000 350")
.attr("class","rank")
.attr("preserveAspectRatio","none meet")
.attr("display","block")

//设置svg2
var height2=350
var svg2=d3.select("#place")
    .append("svg");

svg2.attr("height",height2)
    .attr("width",width)
    .attr("class","place")
    .attr("display","block")

//颜色插值器
var colorScale = d3.scaleLinear()
.domain([-20,0,20])
.range(["red","white","green"])

function getResult(svg1,svg2,ver){
    axios({
        method:'post',
        url:'/init',
        data:{
            "ver":ver
        }
    })
    .then(res=>{

        //rank视图

        var results = res.data.results;
        var d=d3.select("svg.rank").attr("width");
        var h=d3.select("svg.rank").attr("height");
        var len=ver.length
        var scaleX = d3.scaleLinear()//横坐标插值器
            .domain([0,len-1])
            .range([30,d-30])
        var scaleY = d3.scaleLinear()//纵坐标插值器
            .domain([0,22])
            .range([20,h-20])
        var r = 0;
        if((scaleX(2)-scaleX(1))/12>6){
            r=6;
        }else if((scaleX(2)-scaleX(1))/12<3){
            r=3
        }else{
            r=(scaleX(2)-scaleX(1))/12;
        }
        if(len<50){
            for(var j=0;j<len;j++){
            svg1.selectAll('g.ver'+ String(ver[j])+"")
                    .data(results[j])
                .enter()
                    .append('g')
                    .attr("class",(d)=>{
                        return  "ver"+ver[j]+" ";
                    })
                    .attr("id",(d)=>{
                        return d.account0.replace(".","");
                    })
                    .append("circle")
                    .attr("cy",(d)=>{
                        d.y=scaleY(d.loc);
                        return d.y;
                    })
                    .attr('r',r)
                    .attr("cx",(d)=>{
                        d.x1=scaleX(j)-r-1;
                        return d.x1;
                    })
                    .style("fill",(d)=>{
                        return colorScale(d.v_rank-d.up_rank);
                    })
                    .style("stroke",'black')
                    .style("stroke-width",0.5)

            d3.selectAll('.ver'+String(ver[j])+'')
                    .append("circle")
                    .attr("cy",(d)=>{
                        return d.y;
                    })
                    .attr("state",(d)=>{
                        return d.state;
                    })
                    .attr('r',r)
                    .attr("cx",(d)=>{
                        d.x2=scaleX(j)+r+1;
                        return d.x2;
                    })
                    .style("fill",(d)=>{
                        return colorScale(d.v_rank-d.down_rank);
                    })
                    .style("stroke",'black')
                    .style("stroke-width",0.5)
            }
            link(ver[ver.length-1],ver[0],scaleX,scaleY,r);
            svg1.append("line")
                .attr("x1",0)
                .attr("y1",scaleY(21))
                .attr("x2",width-5)
                .attr("y2",scaleY(21))
                .style("stroke",'black')
            d3.selectAll("circle")
                .on("click",(d)=>{
                    let a = svg1.selectAll("path#"+d.account0.replace(".","")).attr("stroke-width")
                    if (a!=1){
                        svg1.selectAll("path#"+d.account0.replace(".","")).attr("stroke-width",1)
                    }else{
                        svg1.selectAll("path#"+d.account0.replace(".","")).attr("stroke-width",3)
                    }
                })
        }else{
            for(var j=0;j<len;j++){
                svg1.selectAll('g.ver'+ String(ver[j])+"")
                        .data(results[j])
                    .enter()
                        .append('g')
                        .attr("class",(d)=>{
                            return  "ver"+ver[j]+" ";
                        })
                        .attr("id",(d)=>{
                            return d.account0.replace(".","");
                        })
                        .append("rect")
                        .attr("y",(d)=>{
                            d.y=scaleY(d.loc);
                            return d.y;
                        })
                        .attr('width',d/len)
                        .attr("height",(scaleY(2)-scaleY(1)))
                        .attr("x",(d)=>{
                            d.x1=scaleX(j);
                            return d.x1;
                        })
                        .style("fill",(d)=>{
                            return colorScale(d.v_rank-d.down_rank);
                        })
    
/*                 d3.selectAll('.ver'+String(ver[j])+'')
                        .append("rect")
                        .attr("y",(d)=>{
                            return d.y;
                        })
                        .attr("state",(d)=>{
                            return d.state;
                        })
                        .attr('width',d/len)
                        .attr("height",(scaleY(2)-scaleY(1)))
                        .attr("x",(d)=>{
                            d.x2=scaleX(j)+r+1;
                            return d.x2;
                        })
                        .style("fill",(d)=>{
                            return colorScale(d.v_rank-d.down_rank);
                        }) */
    
                }
    
        }


        //place视图

        var placeList =[
            "China",
            "US",
            "UK",
            "Singapore",
            "Canada",
            "Japan",
            "SouthKorea",
            "Argentina",
            "Cook",
            "Ukraine",
            "Brazil",
            "Sweden",
            "thailand",
            "Nederlanden",
            "Germany",
            "others",
        ]
        var colors=[
            "#fb8072",
            "#b3de69",
            "#80b1d3",
            "#ffffb3",
            "#bebada",
            "#fdb462",
            "#ccebc5",
            "#fccde5",
            "#bc80bd",
            "#41ae76",
            "#f0f0f0",
            "#d9d9d9",
            "#bdbdbd",
            "#969696",
            "#737373",
            "#252525",
        ]
        var place =[];
        for(var i=0;i<len;i++){
            var group=groupPlace(results[i]);
            group['index']=i;
            place[i]=group;
        }
        var color = d3.scaleOrdinal()
            .domain(placeList)
            .range(colors)

        var stack = d3.stack()
                        .keys(placeList)
                        .offset(d3.stackOffsetNone);
        var series = stack(place)
        var area = d3.area()
            .x(d => scaleX(d.data.index))
            .y0(d => scaleY(d[0]))
            .y1(d => scaleY(d[1]))
            .curve(d3.curveLinear)

        svg2.append("g")
            .selectAll("path")
            .data(series)
            .join("path")
              .attr("fill", ({key}) => color(key))
              .attr("opacity",1)
              .attr("d", area)
            .append("title")
              .text(({key}) => key);


    })
    .catch(err=>{
        console.error(err);
    })
}

//遍历每一个bp进行连线
function link(n,s,scaleX,scaleY,r){
    const bp=[
        "argentinaeos",
        "bitfinexeos1",
        "cypherglasss",
        "eos42freedom",
        "eosasia11111",
        "eosauthority",
        "eosbeijingbp",
        "eoscafeblock",
        "eoscanadacom",
        "eoscannonchn",
        "eosdacserver",
        "eoseouldotio",
        "eoshuobipool",
        "eosiomeetone",
        "eosisgravity",
        "eosliquideos",
        "eosnewyorkio",
        "eosriobrazil",
        "eosstorebest",
        "eosswedenorg",
        "eosyskoreabp",
        "helloeoscnbp",
        "zbeosbp11111",
        "jedaaaaaaaaa",
        "eosgenblockp",
        "cryptolions1",
        "eosflytomars",
        "teamgreymass",
        "libertyblock",
        "starteosiobp",
        "eosantpoolbp",
        "eoscleanerbp",
        "eosnationftw",
        "eosbixinboot",
        "eosamsterdam",
        "eosfishrocks",
        "eoslaomaocom",
        "eostribeprod",
        "eosiosg11111",
        "eospaceioeos",
        "atticlabeosb",
        "cochainworld",
        "eoshenzhenio",
        "games.eos",
        "eos.fish",
        "eossv12eossv",
        "dilidilifans",
        "eosdotwikibp",
        "big.one",
        "whaleex.com",
        "eosinfstones",
        "hoo.com",
        "newdex.bp",
        "slowmistiobp",
        "certikeosorg",
        "okcapitalbp1",
        "eosrapidprod",
        "eoslambdacom",
        "hashfineosio",
        "blockpooleos"
    ]
    for(var k=0,len=bp.length;k<len;k++){
        lint(bp[k],s,n,scaleX,scaleY,r);
    }
}

//具体的连线过程
function lint(bp,s,n,scaleX,scaleY,r){
    var ddd="";
    svg1.selectAll("g#"+bp.replace(".",""))
        .each((d,i)=>{
            if(d.state==0){
                if(d.version==String(s)){
                    ddd="M"+(d.x2+r)+" "+d.y+" ";
                }
                else{
                    ddd=ddd+"L"+(d.x1-r)+" "+d.y+" M"+(d.x2+r)+" "+d.y+" ";
                }
            }else if(d.state==1){
                if(d.version==String(s)){
                    ddd="M"+(d.x2+r)+" "+d.y+" ";
                }
                else{
                    ddd=ddd+"M"+(d.x1+4*r+2-scaleX(2)+scaleX(1))+" "+ scaleY(21) +" "+"L"+(d.x1-r)+" "+d.y+" M"+(d.x2+r)+" "+d.y+" ";
                }
            }else if(d.state==-1){
                if(i==0){
                    ddd="M"+(d.x2+r)+" "+d.y+" ";
                }
                else{
                    if(d.version==String(n)){
                        ddd=ddd+"L"+(d.x1-r)+" "+d.y+" M"+(d.x2+r)+" "+d.y+" ";
                    }else{
                        ddd=ddd+"L"+(d.x1-r)+" "+d.y+" M"+(d.x2+r)+" "+d.y+" L" +(d.x2-4*r-2+scaleX(2)-scaleX(1))+" "+ scaleY(21) +" ";
                    }
                }
            }else{
                ddd=ddd;
            }
        });
    svg1.append("path")
        .attr("d",ddd)
        .attr("stroke","gray")
        .attr("stroke-width",1)
        .attr("id",bp.replace(".",""))
}

//调用画图函数
getResult(svg1,svg2,setRange(500,600))

//加载数据计算
function setRange(a,b){
    let data = []
    for(var i=a;i<b;i++){
        if(i!=1494){
            data.push(i);
        }
    }
    return data;
}
//统计地理位置函数
function groupPlace(arr) {
    var obj = {
        "Argentina":0,
        "UK":0,
        "US":0,
        "China":0,
        "Canada":0,
        "SouthKorea":0,
        "Singapore":0,
        "others":0,
        "Cook":0,
        "Brazil":0,
        "Sweden":0,
        "Japan":0,
        "Ukraine":0,
        "thailand":0,
        "Nederlanden":0,
        "Germany":0
    };
    if (Array.isArray(arr)) {
        for (var i = 0; i < arr.length; ++i) {
            var place = arr[i].place;
            obj[place]=obj[place]+1;
        }
    }
    return obj;
}
