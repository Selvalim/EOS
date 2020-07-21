import React, { Component } from 'react';
import * as d3 from 'd3'

class View4 extends Component{
    constructor(props){
        super(props);
        this.state = {
            switch:this.props.switch,
            data:this.props.data
        }
    }
    componentWillReceiveProps(nextProps){
        console.log(nextProps)
        if(nextProps.data){
            if(nextProps.data!=this.props.data){
                this.setState({
                    switch:nextProps.switch,
                    data:nextProps.data
                },()=>{
                    console.log("verchange")
                    this.drawChart();
                })
            }else if(nextProps.switch!=this.props.switch){
                this.setState({
                    switch:nextProps.switch,
                    data:nextProps.data
                },()=>{
                    console.log(this.state)
                    this.drawChart();
                })
            }
        }
    }
    drawChart(){
        d3.select("#pie").selectAll("svg").remove()
        var width=250, height=350,
            data=this.state.data, svg, bodyG,
            radius1=110, innerRadius1=97,
            radius2=96,innerRadius2=92,
            radius3=70,innerRadius3=0,
            radius4=91,innerRadius4=87,
            radius5=86,innerRadius5=73

        if(data){

            console.log(data)
            var up_group1 = groupRank(data).up_group1;
            var up_group2 = groupRank(data).up_group2;
            var down_group1 = groupRank(data).down_group1;
            var down_group2 = groupRank(data).down_group2;
            var place_data = groupPlace(data);
            var arc1=d3.arc().outerRadius(radius1)
                            .innerRadius(innerRadius1)
            var arc2=d3.arc().outerRadius(radius2)
                            .innerRadius(innerRadius2)
            var arc3=d3.arc().outerRadius(radius3)
                            .innerRadius(innerRadius3)
            var arc4=d3.arc().outerRadius(radius4)
                            .innerRadius(innerRadius4)
            var arc5=d3.arc().outerRadius(radius5)
                            .innerRadius(innerRadius5)
            var pie=d3.pie()
                        .sort((d)=>{
                            return d.index
                        })
                        .value((d)=>{
                            return d.value
                        })
                        .padAngle(0.005)
            var pie1=d3.pie()
                        .sort((d)=>{
                            return d.key
                        })
                        .value((d)=>{
                            return d.value
                        })
                        .padAngle(0.005)
            //颜色插值器
            var colorScale = d3.scaleLinear()
                                .domain([-20,0,20])
                                .range(["red","white","green"])
            svg = d3.select("#pie").append("svg")
                        .attr("width",width)
                        .attr("height",height)
                        .attr("class","pie")
            bodyG=svg.append("g")
                    .attr("class","body")
                    .attr("transform","translate(125,170)")

                bodyG.selectAll("path.arc1")
                        .data(pie(up_group1))
                    .enter()
                        .append("path")
                        .attr("class","arc1")
                        .attr("d",(d,i)=>{
                            return arc1(d,i);
                        })
                        .attr("fill",(d)=>{
                            return colorScale(parseInt(d.data.key));
                        })
                bodyG.selectAll("path.arc2")
                        .data(pie(up_group2))
                    .enter()
                        .append("path")
                        .attr("class","arc2")
                        .attr("d",(d,i)=>{
                            return arc2(d,i);
                        })
                        .attr("fill",(d)=>{
                            return colorScale(d.data.color);
                        })
                bodyG.selectAll("path.arc5")
                        .data(pie(down_group1))
                    .enter()
                        .append("path")
                        .attr("class","arc5")
                        .attr("d",(d,i)=>{
                            return arc5(d,i);
                        })
                        .attr("fill",(d)=>{
                            return colorScale(parseInt(d.data.key));
                        })
                bodyG.selectAll("path.arc4")
                        .data(pie(down_group2))
                    .enter()
                        .append("path")
                        .attr("class","arc4")
                        .attr("d",(d,i)=>{
                            return arc4(d,i);
                        })
                        .attr("fill",(d)=>{
                            return colorScale(d.data.color);
                        })
            bodyG.selectAll("path.arc3")
                    .data(pie1(place_data))
                .enter()
                    .append("path")
                    .attr("class","arc3")
                    .attr("d",(d,i)=>{
                        return arc3(d,i);
                    })
                    .attr("fill",(d)=>{
                        return d.data.color;
                    })
            svg.append("text")
                    .attr("transform","translate(40,40)")
                    .text(`当前版本：${data[0].version}`)
            svg.append("text")
                    .attr("transform","translate(40,310)")
                    .text(`${data[0].date[0]}年${data[0].date[1]}月${data[0].date[2]}日`)
            svg.append("text")
                    .attr("transform","translate(70,335)")
                    .text(`${data[0].date[3]}:${data[0].date[4]}:${data[0].date[5]}`)
        }

    }
    render(){
        return(
            <React.Fragment>
            <div className="item item-4" id="pie"></div>
            </React.Fragment>
        )
    }
}
//统计排名差异
function groupRank(arr){
    var result={},
        up_group1=[],
        down_group1=[],
        up_group2=[],
        down_group2=[]
    let up_obj = {
        "0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,
        "12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,
        "-1":0,"-2":0,"-3":0,"-4":0,"-5":0,"-6":0,"-7":0,"-8":0,"-9":0,"-10":0,"-11":0,
        "-12":0,"-13":0,"-14":0,"-15":0,"-16":0,"-17":0,"-18":0,"-19":0,"-20":0,
        "positive":0,"negative":0
    };
    let down_obj = {
        "0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,
        "12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,
        "-1":0,"-2":0,"-3":0,"-4":0,"-5":0,"-6":0,"-7":0,"-8":0,"-9":0,"-10":0,"-11":0,
        "-12":0,"-13":0,"-14":0,"-15":0,"-16":0,"-17":0,"-18":0,"-19":0,"-20":0,
        "positive":0,"negative":0
    };
    for(let i=0;i<arr.length;i++){
        let up = arr[i].v_rank-arr[i].up_rank
        let down = arr[i].v_rank-arr[i].down_rank
        if(up>0){
            up_obj["positive"]=up_obj["positive"]+1
        }else if(up<0){
            up_obj["negative"]=up_obj["negative"]+1
        }
        if(down>0){
            down_obj["positive"]=down_obj["positive"]+1
        }else if(down<0){
            down_obj["negative"]=down_obj["negative"]+1
        }
        up_obj[up.toString()]=up_obj[up.toString()]+1;
        down_obj[down.toString()]=down_obj[down.toString()]+1
    }
    for(var item in up_obj){
        let tempt={}
        if(item=="positive"){
            tempt["key"]=item;
            tempt["value"]=up_obj[item];
            tempt["index"]=1
            tempt["color"]=20
            up_group2.push(tempt)
        }else if(item=="negative"){
            tempt["key"]=item;
            tempt["value"]=up_obj[item];
            tempt["index"]=-1
            tempt["color"]=-20
            up_group2.push(tempt)
        }else if(item=="0"){
            tempt["key"]=item;
            tempt["value"]=up_obj[item];
            tempt["index"]=0
            tempt["color"]=0
            up_group1.push(tempt)
            up_group2.push(tempt)
        }else{ 
            if(up_obj[item]!=0){
                tempt["key"]=item;
                tempt["value"]=up_obj[item];
                tempt["index"]=parseInt(item)
                up_group1.push(tempt)
            }
        }
    }
    for(var item in down_obj){
        let tempt={}
        if(item=="positive"){
            tempt["key"]=item;
            tempt["value"]=down_obj[item];
            tempt["index"]=1
            tempt["color"]=20
            down_group2.push(tempt)
        }else if(item=="negative"){
            tempt["key"]=item;
            tempt["value"]=down_obj[item];
            tempt["index"]=-1
            tempt["color"]=-20
            down_group2.push(tempt)
        }else if(item=="0"){
            tempt["key"]=item;
            tempt["value"]=down_obj[item];
            tempt["index"]=0
            tempt["color"]=0
            down_group1.push(tempt)
            down_group2.push(tempt)
        }else{ 
            if(down_obj[item]!=0){
                tempt["key"]=item;
                tempt["value"]=down_obj[item];
                tempt["index"]=parseInt(item)
                down_group1.push(tempt)
            }
        }
    }
    result={
        up_group1,
        down_group1,
        up_group2,
        down_group2,
    }
    console.log(result)
    return result;
}


//统计地理位置函数
function groupPlace(arr) {
    
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
    var color = d3.scaleOrdinal()
        .domain(placeList)
        .range(colors)
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
        "Germany":0,
    };
    if (Array.isArray(arr)) {
        var result=[]
        for (var i = 0; i < arr.length; i++) {
            var place = arr[i].place;
            obj[place]=obj[place]+1;
        }
        for(var item in obj){
            if(obj[item]>0){
                let tempt={}
                tempt["key"]=item;
                tempt["value"]=obj[item]
                tempt["color"]=color(item)
                result.push(tempt)
            }

        }
    }

    return result;
}
export default View4