import React, { Component } from 'react';
import go from 'gojs';
import { Layout, Menu, Breadcrumb,Button } from 'antd';
import './App.css';
const { Header, Content, Footer } = Layout;
const $ = go.GraphObject.make;

var CellSize = new go.Size(20, 20);
var groupFill = "rgba(128,128,128,0.2)";
var groupStroke = "rgba(128,128,128,0.4)";

var dropFill = "rgba(128,255,255,0.2)";
var dropStroke = "red";

class App extends Component {
    renderCanvas () {

        function showMessage(s) {
            document.getElementById("diagramEventsMsg").textContent = s;
        }

        function checkcontainbox() {
            document.getElementById("diagramEventsMsg2").textContent = "contain";
        }

        function highlightGroup(grp, show) {
          if (!grp) return;
          if (show) {  // check that the drop may really happen into the Group
              grp.isHighlighted = true;
              return;
          }
          grp.isHighlighted = false;
        }

        var myDiagram = //定义画布
        $(go.Diagram, "myDiagramDiv",
        {
            "toolManager.mouseWheelBehavior":go.ToolManager.WheelNone,//鼠标滚轮事件禁止
            //显示网格
            grid: $(go.Panel, "Grid",
              { gridCellSize: CellSize },
              $(go.Shape, "LineH", { stroke: "lightgray" }),
              $(go.Shape, "LineV", { stroke: "lightgray" })
            ),
            //initialContentAlignment: go.Spot.Center, // 画布居中
            "undoManager.isEnabled": true, // 可以撤销
            allowZoom: true, // 可以缩放
            allowDrop: true, // 可以释放拖拽对象
            maxSelectionCount: 1 //最多选择一个节点
        });

        myDiagram.groupTemplate = //定义箱位
            $(go.Group, 
                {
                  layerName: "Background",
                  resizable:  false, //不能改变大小
                  movable: false, //不能移动
                  selectionAdorned: false, //选中后不显示选中框
                  //mouseEnter: function(e, node) { showMessage(node.key + "-Current Loc " + node.location); }
                  click: function(e, node) {
                       var data = node.data;
                       showMessage(node.key + "-Current Loc of Group " + node.position + "/" + data.pos); 
                  },
                  mouseDragEnter: function(e, grp, prev) { highlightGroup(grp, true); },
                  mouseDragLeave: function(e, grp, next) { highlightGroup(grp, false); },
                  mouseDrop: function(e, grp) {
                    showMessage(grp.key + "-Droped " + grp.position + "/" + grp.data.pos);
                    var ok = grp.addMembers(grp.diagram.selection, true);
                    console.log(grp.diagram.selection);

                    checkcontainbox();
                  },
                },
                
                new go.Binding("position", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
                //Point.parse允许位置以字符串（“100 50”）的形式来指定，而不是作为一个表达式的点。
                //Point.stringify可以将位置信息输出成字符串string类型，用node.data.pos来取。
                $(go.Shape, "Rectangle",
                  { name: "SHAPE", // 取名
                    fill: groupFill,
                    stroke: groupStroke,
                  },
                  new go.Binding("desiredSize", "size", go.Size.parse),
                  new go.Binding("fill", "isHighlighted", function(h) { return h ? dropFill : groupFill; }).ofObject(),
                  new go.Binding("stroke", "isHighlighted", function(h) { return h ? dropStroke: groupStroke; }).ofObject()),
            );

        myDiagram.nodeTemplate = //定义箱子
            $(go.Node, "Auto",
                {   selectionAdorned: false,
                    click: function(e, node) { 
                        var data = node.data;
                        showMessage(node.key + "-Current Loc of Box" + node.position + "/" + data.pos); 
                        //通过key获取node对象
                        //var obj = myDiagram.findNodeForKey("B1");
                        //console.log(obj);
                    }
                },
                new go.Binding("position", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
                $(go.Shape, "Rectangle",
                  {
                    fill: "#1890ff",
                    stroke: "rgba(128,128,128,0.4)",
                  },
                  new go.Binding("desiredSize", "size", go.Size.parse)),
            );

        var myModel = $(go.GraphLinksModel);
        myModel.nodeDataArray = [
              { key: "G1", isGroup: true, pos: "0 0", size: "40 60" },
              { key: "G2", isGroup: true, pos: "40 0", size: "40 60" },
              { key: "G3", isGroup: true, pos: "80 0", size: "40 60" },
              { key: "G4", isGroup: true, pos: "120 0", size: "40 60" },
              { key: "G5", isGroup: true, pos: "160 0", size: "40 60" },
              { key: "B1", group: "G1", size: "40 20" },
              { key: "B2", group: "G2", size: "40 20" },
              { key: "B3", group: "G5", size: "40 20" },
        ];
        myDiagram.model = myModel;
    }

    componentDidMount () {
        this.renderCanvas ();
    }

    render() {
        return (
          <div className="App">
            <Layout className="layout">
                <Header>
                    <div className="logo" />
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['1']}
                        style={{ lineHeight: '64px' }}
                    >
                        <Menu.Item key="1">nav 1</Menu.Item>
                        <Menu.Item key="2">nav 2</Menu.Item>
                        <Menu.Item key="3">nav 3</Menu.Item>
                    </Menu>
                </Header>
                <Content style={{ padding: '0 50px' }}>
                    <div id="diagramEventsMsg">msg</div>
                    <div id="diagramEventsMsg2">msg</div>
                    <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                        <div id="myDiagramDiv" style={{'width': '1000px', 'height': '600px', 'backgroundColor': '#DAE4E4'}}></div>
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Rails ©2018 Created by ST
                </Footer>
            </Layout>
          </div>
        );
    }
}

export default App;