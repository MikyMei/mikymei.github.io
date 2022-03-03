/**

 * @author MikyMei

 * @date 2021-09-08 15:24

 */

import React, {useEffect, useState} from 'react';
import axios from "axios";


import AMapLoader from '@amap/amap-jsapi-loader';
import styles from './index.less';
import {Col, Row} from "antd";
import QingData from '../../../public/assets/QingDao.json'
import QingStructData from '../../../public/assets/structPoint.json'
import HangZhouData from '../../../public/assets/HangZhou.json.json'


var colors = ['#F4FFB3', '#BFDDA8', '#96CA8D', '#75BA89', '#5EAC86', '#4D9A96', '#3F748F', '#1D3748'].reverse();
var heights = [100, 200, 300, 900, 1000, 1200, 1500, 3000];

// 计算路口rank之和，
function sum(arr) {
  var sum = 0;
  arr.forEach(a => {
    sum += a.properties.rank;
  });
  return sum;
}



const Gao3D: React.FC = () => {

  const [map, setMap] = useState<any>();  // 初始化地图
  const [mask, setMask] = useState<any>();  // 遮罩层

  const [amap, setAmap] = useState<any>()

  // 初始化地图
  const initMap = () => {
    // @ts-ignore
    AMapLoader.load({
      key: "46b037a6cc07f7eb44b35a2ad953b91d",              // 申请好的Web端开发者Key，首次调用 load 时必填
      version: "1.4.15",   // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: [
        "DistrictSearch,Polyline"
      ],           // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      Loca: {                // 是否加载 Loca， 缺省不加载
        version: '1.3.2',
      },

    }).then((AMap) => {
      let map = new AMap.Map("map", {
        mask: mask,
        resizeEnable: true,
        pitch: 60,
        rotation: 39.19,

        center: [120.382665, 36.066938],  // 深圳市中心点
        // center: [121.47951, 31.231706],  // 上海市中心点
        mapStyle: 'amap://styles/whitesmoke',
        zoom: 10,
        viewMode: '3D',//开启3D视图,默认为关闭
        buildingAnimation: true,//楼块出现是否带动画
      });


      // 创建 Loca 实例

      var layer = new Loca.HexagonLayer({
        map: map,
        fitView: true,
        eventSupport: true,
      });


      const autoResponse = axios.get("https://a.amap.com/Loca/static/mock/qingdao_500m.tsv");

      autoResponse.then(result => {
        // const heatmapData = result.data
        // const heatmapData = QingData
        const heatmapData = QingStructData;
        layer.setData(heatmapData, {
          lnglat: function (obj) {

            return obj.value.center
          },
          value: 'count',
          type: 'json'
        });
        layer.setOptions({
          unit: 'meter',
          mode: 'count',
          style: {
            color: [
              '#CEF8D6',
              '#A1EDB8',
              '#7BE39E',
              '#5FD3A6',
              '#4AC5AF',
              '#34B6B7',
              '#289899',
              '#1D7F7E',
              '#146968',
              '#094D4A',
            ],
            radius: 1000,
            opacity: 1,
            gap: 300,
            height: [0, 11500],

          },
          light: {
            // 环境光
            ambient: {
              // 光照颜色
              color: '#ffffff',
              // 光照强度，范围 [0, 1]
              intensity: 0.5
            },
            // 平行光
            directional: {
              color: '#ffffff',
              // 光照方向，是指从地面原点起，光指向的方向。
              // 数组分别表示 X 轴、Y 轴、Z 轴。
              // 其中 X 正向朝东、Y 正向朝南、Z 正向朝地下。
              direction: [1, -1.5, 2],
              intensity: 0.6
            }
          },
          selectStyle: {
            color: '#e0d812',
            opacity: 1
          }
        });

        // 在这里进行setStyle主要用与动画生成柱高度
        // layer.setStyle({
        //   unit: 'meter',
        //   radius: 120,
        //   gap: 0,
        //   altitude: 0,
        //   height: function (index, feature) {
        //     var ranks = sum(feature.coordinates);
        //     // return ranks < 60 ? heights[2] : heights[6];
        //     return ranks < 20 ?
        //       heights[0] : ranks < 40 ?
        //         heights[1] : ranks < 60 ?
        //           heights[2] : ranks < 80 ?
        //             heights[3] : ranks < 100 ?
        //               heights[4] : ranks < 120 ?
        //                 heights[5] : ranks < 130 ?
        //                   heights[6] : heights[7];
        //   },
        // })


        // 事件 legendupdate: 图例数据更新完成回调此函数
        layer.on('legendupdate', function (ev: any) {
          var colorLegend = ev.colorLegend;
          initLegend(colorLegend);
        });

        // 鼠标事件
        layer.on('mousemove', function (ev: any) {
          updateInfo(ev);
        });

        layer.render();


      })


      setAmap(AMap);
      setMap(map);


      //利用行政区查询获取边界构建mask路径
      //也可以直接通过经纬度构建mask路径
      // 加载热力图


    }).catch(e => {
      console.log(e);
    })
  }


  // 一些外部方法

  // 鼠标事件更新数据
  const updateInfo = (ev: any) => {
    console.log(ev);
    var val = document.getElementById('val');
    // var idx = document.getElementById('indexes');
    var num = document.getElementById('valnum');
    var lngLat = document.getElementById('lng-lat');

    val.innerText = ev.value;
    // idx.innerText = ev.indexes.join(', ');
    num.innerText = ev.rawData[0].count;
    lngLat.innerText = ev.lngLat.valueOf();
  }
  // 更新图例
  const initLegend = (colorLegend: any) => {
    var legends = colorLegend.map((item:any) => {
      // color 为 gradient 传入的格式
      return `<li class='color-item' style="background-color: ${item.color}; width: 40px; height: 8px;"></li>`
    });

    var ranges = colorLegend.map((item: any, index: any) => {
      // range 可能为小数，可以自行取整计算
      item.range[0] = Math.round(item.range[0]);
      item.range[1] = Math.round(item.range[1]);

      if (index == colorLegend.length - 1) {
        /**/
        return `<li class='label-item' style="width: 39px">${item.range[0]}</li><li style="width: 39px" class='label-item'>${item.range[1]}</li>`;
      }
      return `<li class='label-item' style="width: 39px">${item.range[0]}</li>`;
    });


    // @ts-ignore
    document.getElementById('legend-color').innerHTML = legends.join('');
    // @ts-ignore
    document.getElementById('legend-label').innerHTML = ranges.join('');
  }

  // 获取mask
  const GenerateMask = () => {
    map.plugin(["AMap.DistrictSearch", "AMap.Polyline"], function () {
      var opts = {
        subdistrict: 0,
        extensions: 'all',
        level: 'city'
      };

      let district: any = new amap.DistrictSearch(opts);


      let maskFirst: any[] = [];

      district.search('青岛市', function (status: any, result: any) {
        var bounds = result.districtList[0].boundaries;
        for (var i = 0; i < bounds.length; i += 1) {
          maskFirst.push([bounds[i]])
        }

        // 外多边形坐标数组和内多边形坐标数组
        var outer = [
          new AMap.LngLat(-360,90,true),
          new AMap.LngLat(-360,-90,true),
          new AMap.LngLat(360,-90,true),
          new AMap.LngLat(360,90,true),
        ]

        var pathArray = [
          outer
        ];

        pathArray.push.apply(pathArray,bounds)
        var polygon = new AMap.Polygon( {
          pathL:pathArray,
          //线条颜色，使用16进制颜色代码赋值。默认值为#006600
          strokeColor: 'rgb(20,164,173)',
          strokeWeight: 2,
          //轮廓线透明度，取值范围[0,1]，0表示完全透明，1表示不透明。默认为0.9
          strokeOpacity:0.5,
          //多边形填充颜色，使用16进制颜色代码赋值，如：#FFAA00
          fillColor: 'rgb(162,210,238)',
          //多边形填充透明度，取值范围[0,1]，0表示完全透明，1表示不透明。默认为0.9
          fillOpacity: 1,
          //轮廓线样式，实线:solid，虚线:dashed
          strokeStyle:'dashed',
          /*勾勒形状轮廓的虚线和间隙的样式，此属性在strokeStyle 为dashed 时有效， 此属性在
            ie9+浏览器有效 取值：
            实线：[0,0,0]
            虚线：[10,10] ，[10,10] 表示10个像素的实线和10个像素的空白（如此反复）组成的虚线
            点画线：[10,2,10]， [10,2,10] 表示10个像素的实线和2个像素的空白 + 10个像素的实
            线和10个像素的空白 （如此反复）组成的虚线*/
          strokeDasharray:[10,2,10]
        });
        polygon.setPath(pathArray);

        map.add(polygon);


        setMask(maskFirst);



      })
    })
  }


  // 将六边形地图


  useEffect(() => {
    initMap();
  }, [])
  //
  useEffect(() => {
    if (amap && map) {
      GenerateMask();
    //  产生遮罩
    }

  }, [amap, map])



  return (
    <div>
      <div style={{height: "100vh"}} id="map"/>
      <Row>
        <Col span={10} className={styles.info} >
          <h4>热力数据</h4>
          <p>当前数值：<span id="valnum">--</span></p>
          <p>当前热力值：<span id="val">--</span></p>
          <p>热力中心点坐标：
            <span id="lng-lat">--</span>
          </p>
        </Col>
        <Col  className={styles.legend}>
          <ul className={styles.colors} id="legend-color"></ul>
          <ul className={styles.labels} id="legend-label"></ul>
        </Col>
      </Row>

    </div>


  );
}

export default Gao3D;
