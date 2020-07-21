import React, { Component } from 'react';
import {Popover} from "antd"
import * as d3 from 'd3'


class View12 extends Component {
    constructor(props){
        super(props);
        this.state = {
            ver:[],
            list:[],
            switch:this.props.switch
        }
    }
    componentDidMount() {

    }
    componentWillReceiveProps(nextProps){
        if(nextProps.value.ver!=this.state.ver||this.props.selectedItems!=nextProps.selectedItems){
            let ver = nextProps.value.ver
            let list = nextProps.value.data
            this.setState({
                ver:ver,
                list:list
            },()=>{
                this.passdata();
            });
        }else if(this.props.switch!=nextProps.switch){
            this.setState({
                switch:nextProps.switch
            },()=>{
                this.drawChart();
            })

        }
    }
    passdata=async ()=>{
        await this.drawChart();
        //给view3传值
        let view3_Data=[]
        for(let j=0;j<this.props.selectedItems.length;j++){
            let data=[]
                //取值
            d3.selectAll("g#"+this.props.selectedItems[j])
              .each((d,i)=>{
                data.push({
                  index:i,
                  place:d.place,
                  version:d.version,
                  uprank:d.v_rank-d.up_rank,
                  downrank:d.v_rank-d.down_rank
                })
              })
            view3_Data.push(data)
        }
        console.log(view3_Data)
        this.props.handleView3(view3_Data);
    }
    drawChart=async ()=> {
        const bp=[
            "argentinaeos","bitfinexeos1","cypherglasss","eos42freedom","eosasia11111","eosauthority","eosbeijingbp",
            "eoscafeblock","eoscanadacom","eoscannonchn","eosdacserver","eoseouldotio","eoshuobipool","eosiomeetone",
            "eosisgravity","eosliquideos","eosnewyorkio","eosriobrazil","eosstorebest","eosswedenorg","eosyskoreabp",
            "helloeoscnbp","zbeosbp11111","jedaaaaaaaaa","eosgenblockp","cryptolions1","eosflytomars","teamgreymass",
            "libertyblock","starteosiobp","eosantpoolbp","eoscleanerbp","eosnationftw","eosbixinboot","eosamsterdam",
            "eosfishrocks","eoslaomaocom","eostribeprod","eosiosg11111","eospaceioeos","atticlabeosb","cochainworld",
            "eoshenzhenio","games.eos","eos.fish","eossv12eossv","dilidilifans","eosdotwikibp","big.one",
            "whaleex.com","eosinfstones","hoo.com","newdex.bp","slowmistiobp","certikeosorg","okcapitalbp1","eosrapidprod",
            "eoslambdacom","hashfineosio","blockpooleos"
        ]
        d3.select("#rank > svg").remove();
        d3.select("#place > svg").remove();
        //设置svg1
        var ver = this.state.ver;
        var height1 = 350
        var width = 1000
        var svg1=d3.select("#rank")
            .append('svg');
        svg1.attr('height',height1)
            .attr('width',width)
            .attr("viewbox","0 0 1000 350")
            .attr("class","rank")
            .attr("preserveAspectRatio","none meet")
            .attr("display","block")
        //颜色插值器
        var colorScale = d3.scaleLinear()
            .domain([-20,0,20])
            .range(["red","white","green"])
        var results=this.state.list
        var bps=this.props.selectedItems
        var wd=d3.select("svg.rank").attr("width");
        var h=d3.select("svg.rank").attr("height");
        var len=ver.length
        var scaleX = d3.scaleLinear()//横坐标插值器
            .domain([0,len-1])
            .range([30,wd-30])
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
    //画圆
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


    //画线
        for(var k=0;k<bp.length;k++){
            var ddd="";
            var n=ver[ver.length-1],s=ver[0]
            svg1.selectAll("g#"+bp[k].replace(".",""))
            .each((d,i)=>{
                if(d.state===0){
                    if(d.version===String(s)){
                        ddd="M"+(d.x2+r)+" "+d.y+" ";
                    }
                    else{
                        ddd=ddd+"L"+(d.x1-r)+" "+d.y+" M"+(d.x2+r)+" "+d.y+" ";
                    }
                }else if(d.state===1){
                    if(d.version===String(s)){
                        ddd="M"+(d.x2+r)+" "+d.y+" ";
                    }
                    else{
                        ddd=ddd+"M"+(d.x1+4*r+2-scaleX(2)+scaleX(1))+" "+ scaleY(21) +" "+"L"+(d.x1-r)+" "+d.y+" M"+(d.x2+r)+" "+d.y+" ";
                    }
                }else if(d.state==2){
                    if(d.version==String(s)){
                        ddd=ddd+"M"+(d.x2+r)+" "+d.y+" L"+(d.x2-4*r-2+scaleX(2)-scaleX(1))+" "+ scaleY(21) +" "
                    }else{
                        ddd=ddd+"M"+(d.x1+4*r+2-scaleX(2)+scaleX(1))+" "+ scaleY(21) +" "+"L"+(d.x1-r)+" "+d.y+" M"+(d.x2+r)+" "+d.y+" L"+(d.x2-4*r-2+scaleX(2)-scaleX(1))+" "+ scaleY(21) +" "
                    }
                }else if(d.state===-1){
                    if(i==0){
                        ddd="M"+(d.x2+r)+" "+d.y+" ";
                    }
                    else{
                        if(d.version===String(n)){
                            ddd=ddd+"L"+(d.x1-r)+" "+d.y+" M"+(d.x2+r)+" "+d.y+" ";
                        }else{
                            ddd=ddd+"L"+(d.x1-r)+" "+d.y+" M"+(d.x2+r)+" "+d.y+" L"+(d.x2-4*r-2+scaleX(2)-scaleX(1))+" "+ scaleY(21) +" ";
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
                .attr("id",bp[k].replace(".",""))
        }
            svg1.append("line")
                .attr("x1",0)
                .attr("y1",scaleY(21))
                .attr("x2",width-5)
                .attr("y2",scaleY(21))
                .style("stroke",'black')
            svg1.selectAll("circle")
                .on("click",(d)=>{
                    if(ArrayIndexOf(bps,d.account0.replace(".",""))==-1){
                        this.props.bpAdd(d.account0.replace(".",""))
                    }else{
                        this.props.bpDel(d.account0.replace(".",""))
                    }
                })
            for(let i=0;i<bps.length;i++){
                svg1.selectAll("path#"+bps[i]).attr("stroke-width",3)
            }
    }else{
        if(this.state.switch){
            for(var m=0;m<len;m++){
                svg1.selectAll('g.ver'+ String(ver[m])+"")
                        .data(results[m])
                    .enter()
                        .append('g')
                        .attr("class",(d)=>{
                            return  "ver"+ver[m]+" ";
                        })
                        .attr("id",(d)=>{
                            return d.account0.replace(".","");
                        })
                        .append("rect")
                        .attr("y",(d)=>{
                            d.y=scaleY(d.loc);
                            return d.y;
                        })
                        .attr("id",(d)=>{return d.account0.replace(".","")})
                        .attr('width',wd/len)
                        .attr("height",(scaleY(2)-scaleY(1)))
                        .attr("x",(d)=>{
                            d.x=scaleX(m);
                            return d.x;
                        })
                        .attr("class",(d)=>{
                            return d.account0.replace(".","")
                        })
                        .style("fill",(d)=>{
                            return colorScale(d.v_rank-d.up_rank);
                        })
            }
        }else{
            for(var m=0;m<len;m++){
                svg1.selectAll('g.ver'+ String(ver[m])+"")
                        .data(results[m])
                    .enter()
                        .append('g')
                        .attr("class",(d)=>{
                            return  "ver"+ver[m]+" ";
                        })
                        .attr("id",(d)=>{
                            return d.account0.replace(".","");
                        })
                        .append("rect")
                        .attr("y",(d)=>{
                            d.y=scaleY(d.loc);
                            return d.y;
                        })
                        .attr("id",(d)=>{return d.account0.replace(".","")})
                        .attr('width',wd/len)
                        .attr("height",(scaleY(2)-scaleY(1)))
                        .attr("x",(d)=>{
                            d.x=(scaleX(m)-(wd/len/2));
                            return d.x;
                        })
                        .attr("class",(d)=>{
                            return d.account0.replace(".","")
                        })
                        .style("fill",(d)=>{
                            return colorScale(d.v_rank-d.down_rank);
                        })
            }
        }

            svg1.append("line")
                .attr("x1",0)
                .attr("y1",scaleY(22))
                .attr("x2",width-5)
                .attr("y2",scaleY(22))
                .style("stroke",'black')
            svg1.selectAll("rect")
                .on("click",(d)=>{
                    if(ArrayIndexOf(bps,d.account0.replace(".",""))==-1){
                        this.props.bpAdd(d.account0.replace(".",""))
                    }else{
                        this.props.bpDel(d.account0.replace(".",""))
                    }
                })                
            var rline = ""
            let rectData = []
            for(let i=0;i<bps.length;i++){
                svg1.selectAll("rect."+bps[i])
                    .each((d,i)=>{
                        rectData[i]={x:d.x,y:d.y}
                        if(i==0){
                            if(d.version!=String(ver[0])){
                                rline=rline+"M"+(d.x-wd/len/2)+" "+scaleY(22)+" L"+(d.x+wd/len/2)+" "+(d.y+(scaleY(22)-scaleY(21))/2)+" "
                            }else{
                                rline=rline+"M"+(d.x+wd/len/2)+" "+(d.y+(scaleY(22)-scaleY(21))/2)+" "
                            }
                        }else{
                            if(d.state==1){
                                rline=rline+"M"+(d.x-wd/len/2)+" "+scaleY(22)+" L"+(d.x+wd/len/2)+" "+(d.y+(scaleY(22)-scaleY(21))/2)+" "
                            }else if(d.state==-1){
                                if(d.version==String(ver[ver.length-1])){
                                    rline=rline+"L"+(d.x+wd/len/2)+" "+(d.y+(scaleY(22)-scaleY(21))/2)+" "
                                }else{
                                    rline=rline+"L"+(d.x+wd/len/2)+" "+(d.y+(scaleY(22)-scaleY(21))/2)+" L"+(d.x+(wd/len)*3/2)+" "+scaleY(22)+" "
                                }
                            }else if(d.state==2){
                                rline=rline+"M"+(d.x-wd/len/2)+" "+scaleY(22)+" L"+(d.x+wd/len/2)+" "+(d.y+(scaleY(22)-scaleY(21))/2)+" L"+(d.x+(wd/len)*3/2)+" "+scaleY(22)+" "
                            }else{
                                rline=rline+"L"+(d.x+wd/len/2)+" "+(d.y+(scaleY(22)-scaleY(21))/2)+" "
                            }
                        }
                    })
            }
            svg1.append("g")
                .attr("id","linelineline")
                    .append("path")
                    .attr("class","line")
                    .attr("d",rline)
                    .attr("stroke","black")
                    .attr("stroke-width",0.4)
                    .attr("fill","none")

                }


        //place视图

        //设置svg2
        var height2=350
        var svg2=d3.select("#place")
            .append("svg");

        svg2.attr("height",height2)
            .attr("width",width)
            .attr("class","place")
            .attr("display","block")


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


        //图例
        var symbol_loc=30
        var symbol2=svg2.selectAll("g#symbol2")
                .data(placeList)    
            .enter()
                .append("g")
                .attr("id","symbol2")
                
        symbol2.append("circle")
                .attr("cx",(d,i)=>{
                    if(i==2||i==1){
                        symbol_loc+=40;
                        return (symbol_loc-40)
                    }else if(i==6||i==13){
                        symbol_loc=symbol_loc+80;
                        return (symbol_loc-80)
                    }else if(i==3||i==7||i==14){
                        symbol_loc=symbol_loc+70;
                        return (symbol_loc-70)
                    }else if(i==0||i==5||i==8||i==10){
                        symbol_loc=symbol_loc+50;
                        return (symbol_loc-50)
                    }else{
                        symbol_loc=symbol_loc+60;
                        return (symbol_loc-60)
                    }
                })
                .attr("cy",330)
                .attr("r",5)
                .style("fill",(d)=>{
                    return color(d);
                })
                .style("stroke",'black')
                .style("stroke-width",0.5)
        var text_loc=36
        symbol2.append("text")
                .attr("transform",(d,i)=>{
                    if(i==2||i==1){
                        text_loc+=40;
                        return "translate("+(text_loc-40)+",335)"
                    }else if(i==0||i==5||i==8||i==10){
                        text_loc+=50;
                        return "translate("+(text_loc-50)+",335)"
                    }else if(i==6||i==13){
                        text_loc+=80;
                        return "translate("+(text_loc-80)+",335)"
                    }else if(i==3||i==7||i==14){
                        text_loc+=70;
                        return "translate("+(text_loc-70)+",335)"
                    }else{
                        text_loc+=60;
                        return "translate("+(text_loc-60)+",335)"
                    }
                })
                .attr("font-size",11)
                .text((d)=>{
                    return d
                })
        


        //图例1
        var ddd = [-21,-17,-15,-13,-10,-7,-5,-3,0,3,5,7,10,13,15,17,21]
        var symbol1=svg1.selectAll("g#symbol1")
                    .data(ddd)
                .enter()
                    .append("g")
                    .attr("id","symbol1")
        var rect=symbol1.append("rect")
                .attr("x",(d,i)=>{
                    return 30+i*20
                })
                .attr("y",scaleY(22)+4)
                .attr("width",20)
                .attr("height",20)
                .style("fill",(d)=>{
                    return colorScale(d)
                })
        symbol1.append("text")
                .text((d)=>{
                    return d;
                })
                .attr("fill","black")
                .attr("x",(d,i)=>{
                    return 40+i*20
                })
                .attr("y",scaleY(22)+16)
                .attr('text-anchor', 'middle')
                .style('font-size', '10px')



        }





        //渲染
    render(){
        return (
            <React.Fragment>
            <div className="item item-2" id="rank">
            </div>
            <div className="item item-5" id="place"></div>
            </React.Fragment>
        )
    }
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
        for (var i = 0; i < arr.length; i++) {
            var place = arr[i].place;
            obj[place]=obj[place]+1;
        }
    }
    return obj;
}



//封装一个方法实现indexOf的功能
function ArrayIndexOf(arr,value){
    　　//检测value在arr中出现的位置
    　　for(var i=0;i<arr.length;i++){
    　　　　if(arr[i]===value){
    　　　　　　return i;
    　　　　}
    　　}
    　　return -1;
    }


export default View12;