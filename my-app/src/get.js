import React, { Component } from 'react';
import axios from './axios';
import View12 from './view12';
import { Button,InputNumber,DatePicker,Switch } from "antd"
import View3 from "./view3"
import View4 from "./view4"
import moment from 'moment'
const {RangePicker} =DatePicker


class Get extends Component {
    constructor(props){
        super(props);
        this.state = {
            ver:[],
            list: [],
            start:3,
            end:1589,
            date_start:3,
            date_end:1589,
            draw:{
                ver:[],
                data:[]
            },
            bps:[],
            switch:true,
            view3_data:[],
            view4_data:[],
            view4_ver:50
        }
        this.bpAdd=this.bpAdd.bind(this)
        this.bpDel=this.bpDel.bind(this)
        this.handleSwich=this.handleSwich.bind(this)
        this.handleView3=this.handleView3.bind(this)
    }
    handleView4=(value)=>{
        if(this.state.ver.length>1){
            let index=ArrayIndexOf(this.state.ver,value)
            this.setState({
                view4_ver:value,
                view4_data:this.state.list[index]
            },()=>{
                //console.log(this.state.view4_data)
            })
        }  
    }
    handleView3(data){
        this.setState({
            view3_data:data
        },()=>{
            console.log(this.state.view3_data)
        })
    }
    handleSwich(checked){
        this.setState({
            switch:checked
        },()=>{
            console.log(this.state.switch)
        })
        
    }
    bpAdd(bp){
        let oldbps=this.state.bps.slice()
        if(oldbps.length>=6){
            alert("最多选择6个节点")
        }else{
            let index=ArrayIndexOf(oldbps,bp)
            oldbps.push(bp)
            if(index==-1){
                this.setState({
                    bps:oldbps
                })
            }else{
                console.log('节点已存在');
            }
        }

        console.log(this.state.bps)
    }
    bpDel(bp){
        console.log('bpdel');
        
        let oldbps=this.state.bps.slice()
        let index=ArrayIndexOf(oldbps,bp)
        oldbps.splice(index,1)
        if(index!=-1){
            this.setState({
                bps:oldbps
            })
        }else{
            console.log("节点不存在")
        }
    }

    componentDidMount() {
        var ver =setRange(2,1590);
        if(this.state.list.length===0){
            this.getData(ver);
        }
    }
    //获取数据
    getData = (ver) => {
        axios({
            method:'post',
            url:'/api/init',
            data:{
                "ver":JSON.stringify(ver),
                "number":ver.length
            }
        })
        .then((response) => {
            this.setState({
                list: response.data.results,
                ver:ver,
                draw:{
                    ver:ver,
                    data:response.data.results,
                },
                view4_data:response.data.results[ArrayIndexOf(ver,this.state.view4_ver)]
            })
            console.log(this.state);
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    getStart=(value)=> {
        this.state.start=value;
    }
    getEnd=(value)=> {
        this.state.end=value;
    }
    redraw1=()=>{
        console.log(this.state)
        let d =setRange(this.state.start,this.state.end)
        let c=this.state.ver
        let aaa=this.state.start,bbb=this.state.end
        if(aaa==1494){
            aaa =aaa+1
        }
        if(bbb==1494){
            bbb =bbb-1
        }
        aaa=c.indexOf(aaa);
        bbb=c.indexOf(bbb)
        if(aaa>=bbb){
            alert("起始时间格式不对")
        }else{
            this.setState({
                draw:{
                    data:this.state.list.slice(aaa,bbb),
                    ver:d
                }
            })
        }

    }
    redraw2=()=>{
        let c=this.state.ver
        let aaa=parseInt(this.state.date_start)
        let bbb=parseInt(this.state.date_end)
        aaa=c.indexOf(aaa);
        bbb=c.indexOf(bbb);
        this.setState({
            draw:{
                data:this.state.list.slice(aaa,bbb),
                ver:c.slice(aaa,bbb)
            }
        })
    }
    handleData(time){
        if(!time){
            return false
        }else{
            return time < moment("2018-6-14") || time > moment("2019-12-28")
        }
    }
    setDate=(value)=>{
        console.log(value[0].date());
        axios({
            method:"post",
            url:"api/setDate",
            data:{
                start:{
                    year:value[0].year(),
                    month:value[0].month()+1,
                    day:value[0].date()
                },
                end:{
                    year:value[1].year(),
                    month:value[1].month()+1,
                    day:value[1].date()
                }
            }
        }).then((response)=>{
            console.log(response.data)
            this.setState({
                date_start:response.data.start,
                date_end:response.data.end
            })
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    render(){
        return (
            <React.Fragment>
            <div className="item item-1" id="1">
            EOS共识机制效用<br></br>
            可视分析系统<br></br><br></br><br></br>
            <InputNumber size={"small"} min={3} max={1590} defaultValue={3} onChange={this.getStart} />
            <InputNumber size={"small"} min={this.start} max={1590} defaultValue={1589} onChange={this.getEnd} />
            <Button
            type="primary"
            onClick={this.redraw1}
            >按起始版本画图</Button><br></br><br></br>
            <RangePicker 
            onChange={this.setDate}
            defaultPickerValue={[moment("2018-6-14"),moment("2019-12-28")]}
            disabledDate={this.handleData}
            defaultValue={[moment("2018-6-14"),moment("2019-12-28")]}
            />
            <Button
            type="primary"
            onClick={this.redraw2}
            >按起始日期画图</Button><br></br><br></br>
            <Switch 
            checkedChildren="变化前" 
            unCheckedChildren="变化后"
            defaultChecked={true}
            onChange={this.handleSwich}
             />
             <InputNumber 
             size={"small"} 
             min={3} 
             max={1590} 
             defaultValue={this.state.view4_ver} 
             onChange={this.handleView4} />
            </div>
            <View12 
            bpAdd={this.bpAdd}
            bpDel={this.bpDel}
            value={this.state.draw}
            selectedItems={this.state.bps}
            switch={this.state.switch}
            handleView3={this.handleView3}
            />
            <View3 
            selectedItems={this.state.bps}
            bpDel={this.bpDel}
            ver={this.state.draw.ver}
            switch={this.state.switch}
            data={this.state.view3_data}
            />
            <View4
            ver={this.state.view4_ver}
            data={this.state.view4_data}
            switch={this.state.switch}
            />
            </React.Fragment>
        )
    }
}

//加载数据计算
function setRange(a,b){
    let data = []
    for(var i=a;i<b;i++){
        if(i!==1494){
            data.push(i);
        }
    }
    return data;
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
   
export default Get;