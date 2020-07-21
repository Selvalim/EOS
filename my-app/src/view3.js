import React, { Component } from 'react';
import * as d3 from 'd3'
import {  Select,Button  } from 'antd';

class SelectWithHiddenSelectedOptions extends React.Component {
      constructor(props){
        super(props);
        this.state = {
            selectedItems: [],
        }
    }

    handleDeselect=(bp)=>{
      console.log("handle")
      this.props.bpDel(bp)
    }
    render() {
      return (
        <React.Fragment>
        <Select
          mode="multiple"
          placeholder="请选择超级节点"
          maxTagTextLength={9}
          value={this.props.selectedItems}
          onDeselect={this.handleDeselect}
          style={{ width: '100%' }}
          open={false}
        >
        </Select>
        </React.Fragment>
      );
    }
  }


class View3 extends Component{
    constructor(props){
        super(props);
        this.state = {
          ver:this.props.ver,
          switch:this.props.switch,
          data:this.props.data
        }
    }    

    componentWillReceiveProps(nextProps){
      if(this.props.selectedItems!=nextProps.selectedItems){
          console.log("huatu")
          this.setState({
            selectedItems:nextProps.selectedItems,
            ver:nextProps.ver,
          },()=>{
          })
        }else if(this.props.data!=nextProps.data){
          this.setState({
            data:nextProps.data
          },()=>{
            this.drawChart();
          })
        }else if(this.props.switch!=nextProps.switch){
          this.setState({
            switch:nextProps.switch
          },()=>{
            this.drawChart();
          })
        }
          
    }
    drawChart(){
      console.log(this.state.data)
      let bps=this.state.selectedItems
      d3.select("div#bp > svg").remove();
      //颜色插值器
      var colorScale = d3.scaleLinear()
      .domain([-20,0,20])
      .range(["red","white","green"])        
      var svg3 = d3.select("#bp")
                      .append("svg")
          svg3.attr("width",250)
              .attr("height",650)
              .attr("viewbox","0 210 250 710")
              .attr("class","bp")
              .attr("preserveAspectRatio","none meet")
              .attr("display","block")   

      if(this.state.data.length>0){
        for(let j=0;j<bps.length;j++){
          let data=this.state.data[j]
          let a=0,ver=this.props.ver,blank=[]
          if(data.length){
              for(let i=0;i<ver.length;i++){
                if(ver[i]==data[a].version){
                  data[a].loc=i
                  if(a<data.length-1){
                    a=a+1
                  }
                  continue;
                }else{
                  blank.push(i)
                  continue;
                }
            }
          }
          //画图
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

        var Yscale=d3.scaleLinear()
                      .domain([0,ver.length+1])
                      .range([0,500])
        var Xscale=d3.scaleLinear()
                      .domain([0,bps.length+1])
                      .range([0,250])
        var Xscale1=d3.scaleLinear()
                      .domain([0,6])
                      .range([0,250])
        var r=(Yscale(1)-Yscale(0))*9/20
        svg3.append("line")
              .attr("x1",0)
              .attr("x2",250)
              .attr("y1",500)
              .attr("y2",500)
              .style("stroke","black")
        if(ver.length<50){
          svg3.selectAll("g."+bps[j])
              .data(data)
            .enter()
              .append("g")
              .attr("class",bps[j])
              .append("circle")
                .attr("r",r)
                .attr("cx",Xscale(j+1))
                .attr("cy",(d)=>{return Yscale(d.loc+1)})
                .style("fill",(d)=>{
                  if(this.state.switch){
                    return colorScale(d.uprank);
                  }else{
                    return colorScale(d.downrank)
                  }
              })
              .style("stroke",'gray')
              .style("stroke-width",0.5)
          svg3.selectAll("line."+bps[j])
                .data(blank)
              .enter()
                .append("line")
                .attr("class",bps[j])
                .attr("x1",Xscale(j+1))
                .attr("x2",Xscale(j+1))
                .attr("y1",(d)=>{
                  return Yscale(d+1)-r;
                })
                .attr("y2",(d)=>{
                  return Yscale(d+1)+r;
                })
                .style("stroke",'gray')
                .style("stroke-width",0.5)
                
                svg3.append("text")
                    .attr("transform","translate("+(Xscale(j+1)-5)+",516) rotate(90)")
                    .attr("font-size",13)
                    .text(bps[j])
                svg3.append("circle")
                    .attr("cx",(Xscale(j+1)))
                    .attr("cy",510)
                    .attr("r",5)
                    .style("fill",color(placeCheck(bps[j])))
          
        }else{
          svg3.selectAll("g."+bps[j])
            .data(data)
          .enter()
            .append("g")
            .attr("class",bps[j])
            .append("rect")
              .attr("x",Xscale1(j)+5)
              .attr("y",(d)=>{return Yscale(d.loc+1)})
              .attr("width",30)
              .attr("height",Yscale(1)-Yscale(0))
              .style("fill",(d)=>{
                if(this.state.switch){
                  return colorScale(d.uprank);
                }else{
                  return colorScale(d.downrank)
                }
            })
        svg3.selectAll("line."+bps[j])
            .data(blank)
          .enter()
            .append("line")
            .attr("class",bps[j])
            .attr("x1",Xscale1(j)+20)
            .attr("x2",Xscale1(j)+20)
            .attr("y1",(d)=>{
              return Yscale(d+1);
            })
            .attr("y2",(d)=>{
              return Yscale(d+1)+Yscale(1)-Yscale(0);
            })
            .style("stroke",'gray')
            .style("stroke-width",0.5)

      
         svg3.append("text")
            .attr("transform","translate("+(Xscale1(j)+15)+",516) rotate(90)")
            .attr("font-size",13)
            .text(bps[j])
        



          svg3.append("circle")
            .attr("cx",(Xscale1(j)+18))
            .attr("cy",510)
            .attr("r",5)
            .style("fill",color(placeCheck(bps[j])))

        }
      }
    }

        

    }
    render(){
        return(
            <React.Fragment>
            <div className="item item-3" id="bp">
            <SelectWithHiddenSelectedOptions
            selectedItems={this.props.selectedItems}
            bpDel={this.props.bpDel}
             />
            </div>
            </React.Fragment>
        )
    }
}

function placeCheck(bp){
  let result="";
  switch (bp) {
    case 'eoshuobipool':case "okcapitalbp1":case "helloeoscnbp":case "zbeosbp11111":case "eosflytomars":case "starteosiobp":case "blockpooleos":
    case "eoscannonchn":case "bigone":case "cochainworld":case "eosbeijingbp":case "slowmistiobp":case "eoslambdacom":case "eosisgravity":
    case "eosstorebest":case "eoscleanerbp":case "eosfish":case "eoshenzhenio":case "eosfishrocks":case "eosgenblockp":
      result = "China";
      break;
    case "eoseouldotio":case "eosyskoreabp":
      result = "SouthKorea";
      break;
    case "eosnationftw":case "eoscafeblock":case "eoscanadacom":case "libertyblock":case "teamgreymass":
      result = "Canada";
      break;
    case "newdexbp":case "bitfinexeos1":case "eosdotwikibp":case "eosasia11111":case "eossv12eossv":case "eos42freedom":case "eosauthority":
    case "eospaceioeos":case "eosdacserver":
      result = "UK";
      break;
    case "hashfineosio":case "whaleexcom":case "eosiomeetone":case "eosiosg11111":case "hoocom":case "eosantpoolbp":case "dilidilifans":
      result = "Singapore";
      break;
    case "eosinfstones":case "eosrapidprod":case "certikeosorg":case "cypherglasss":
      result = "US";
      break;
    case "atticlabeosb":case "cryptolions1":
      result = "Ukraine";
      break;
    case "eoslaomaocom":case "jedaaaaaaaaa":
      result = "Japan";
      break;
    case "eosnewyorkio":
      result = "Cook";
      break;
    case "eosriobrazil":
      result = "Brazil";
      break;
    case "argentinaeos":
      result = "Argentina";
      break;
    case "eosswedenorg":
      result = "Sweden";
      break;
    case "eostribeprod":
      result = "Germany";
      break;
    case "eosamsterdam":
      result = "Nederlanden";
      break;
    case "eosbixinboot":
      result = "thailand";
    default:
      result = "others";
      break;
  }
  return result;
}



export default View3