/**

 * @author MikyMei

 * @date 2021-11-22 15:14

 */


import React, {useEffect, useState} from 'react';

import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import {GUI} from 'three/examples/jsm/libs/dat.gui.module.js';


import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import html2canvas from 'html2canvas';
import {SkeletonHelper} from 'three/src/helpers/SkeletonHelper.js';
import {CSS2DObject, CSS2DRenderer} from 'three/examples/jsm/renderers/CSS2DRenderer.js';

import {tag, labelRenderer} from '../../utils/css2drander.ts'
// import {LightProbeHelper} from "three";
// import {LightProbeGenerator} from "three";

import styles from './index.less';
import {Avatar, Badge, Button, Slider, Tooltip, Row, Col, Divider, Tag, Carousel} from "antd";
import Utils from "@/pages/scanCity/utils";
import * as TWEEN from '@tweenjs/tween.js';
import {AntDesignOutlined, CloseCircleOutlined, UserOutlined} from "@ant-design/icons";
import Card from "@/utils/card";
// const controls = new OrbitControls();


const NormalProject: React.FC = () => {


  const loader = new GLTFLoader();


  /**
   *beIntersectObjects是用来存放需要射线检测的物体数组。
   *transformControl可以方便调节物体位置大小。
   * */
  let scene: any;
  const objects: any = [];
  let camera: any;
  let plane: any;
  let spotLight: any;
  let ambient: any;
  let point: any;
  let chooseMesh: null; // 被点击的网格模型，主要是为了保存下来生成信息窗体


  let renderer: any;
  let labelRenderer: any;


  let controls: any;
  let mainCanvas: any;
  let BodyShader: any;
  const time = {
    value: 0
  };
  const StartTime = {
    value: 0
  };
  let isStart = false;

  const clock = new THREE.Clock();
  let addTimer = true;


  let flag = 0;
  let heartMeshModel: any;

  const initModel = () => {

    // 获得渲染器长度
    mainCanvas = document.getElementById("webgl-output");


    /**
     * 结束
     * */


    const textureLoader = new THREE.TextureLoader();
    scene = new THREE.Scene();
    /**
     *  只是将图片作为北京图片贴了上去，并没有实现3d效果，尤其是在进行旋转的时候感觉尤为明显
     *  */
    scene.background = textureLoader.load('./img/img_7.png');

    // 获得渲染器所在的标签元素，作为渲染器的尺寸
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(new THREE.Color("#eeeeee"));
    renderer.setSize(mainCanvas.offsetWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    // 2d渲染器
    labelRenderer = new CSS2DRenderer();  // 新增的渲染器
    labelRenderer.setSize(mainCanvas.offsetWidth, window.innerHeight);
    // this.labelRenderer.domElement.style.position = 'absolute';
    // this.labelRenderer.domElement.style.top = 0;
    labelRenderer.domElement.style = "pointer-events: auto;position: absolute;top: 0px;"  // 处理新的渲染器


    const axes = new THREE.AxisHelper(20);
    // scene.add(axes);


    // 创建聚光灯
    spotLight = new THREE.SpotLight(0xFFFFFF);
    spotLight.position.set(30, 30, 30);
    spotLight.castShadow = true;
    spotLight.angle = Math.PI / 10;
    spotLight.shadow.penumbra = 0.05;
    spotLight.shadow.mapSize.width = 3026;
    spotLight.shadow.mapSize.height = 3026;
    scene.add(spotLight);

    ambient = new THREE.AmbientLight(0x444444);
    scene.add(ambient);

    point = new THREE.PointLight(0xffffff);
    point.position.set(400, 200, 300); // 点光源位置
    scene.add(point);


    const planeGemometry = new THREE.PlaneGeometry(50, 30);
    const planeMeterial = new THREE.MeshStandardMaterial({
      color: 0xcccccc
    })
    plane = new THREE.Mesh(planeGemometry, planeMeterial);

    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0;
    plane.position.y = -5;
    plane.position.z = 0;
    plane.castShadow = true;
    plane.receiveShadow = true;
    // scene.add(plane);


    // mainCanvas.offsetWidth,window.innerHeight
    camera = new THREE.PerspectiveCamera(45, mainCanvas.offsetWidth / window.innerHeight, 0.1, 2000);

    // 定位相机，并且指向场景中心
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 15;
    camera.lookAt(0, 0, 0);


    let model;
    let skeleton;
    loader.load('./img/femaleStandardFigure.gltf', function (gltf) {
        model = gltf.scene;
        model.scale.setScalar(5, 5, 5);
        model.position.setY(-5);
        model.position.setY(-5);
        // const box = new THREE.Box3();
        // box.setFromObject(model);
        // var helper = new THREE.Box3Helper(box, 0xffff00);
        // gltf.scene.attach(helper);
        /**
         * beIntersectObjects是用来存放需要射线检测的物体数组。
         * transformControl可以方便调节物体位置大小。
         * */


        scene.add(model);
        model.traverse((child: any) => {
            objects.push(child);
            /**
             * 在这里将不同模型根据他的名字，将
             * */
            if (child.geometry) {
              child.geometry.computeBoundingBox();
              child.geometry.computeBoundingSphere()
            }

            processGLTFChild(child)
          }
        );

        // const animations = gltf.animations;
        const mixer = new THREE.AnimationMixer(model);
      },
      undefined

      , function (error) {

        console.error(error);

      });


    // 将渲染器添加到html元素中

    // @ts-ignore
    window.document.getElementById('webgl-output').appendChild(renderer.domElement);
    window.document.getElementById("webgl-output").appendChild(labelRenderer.domElement);
    // generatePointsCircle();


    render();


    setTimeout(() => {
      isStart = true;


    }, 200)

    // controls = new OrbitControls(camera, labelRenderer.domElement);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;


    // 点击事件，
    // document.getElementById('webgl-output').addEventListener('click', (event) => choose(event));

    window.addEventListener('resize', onWindowResize);

  }

  const onWindowResize = () => {

    // camera.aspect = window.innerWidth/ mainCanvas.offsetHeight;
    camera.aspect = mainCanvas.offsetWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(mainCanvas.offsetWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, mainCanvas.offsetHeight);

  }


  const render = () => {


    /**
     * 实现身体扫光
     * */
    const dt = clock.getDelta();


    if (dt > 1) return false;
    time.value -= dt / 10;


    // if (time.value >= 2.6 || addTimer === true) {
    //   time.value -= dt;
    //   if (time.value <= 0.0) {
    //     addTimer = false
    //   }
    // } else if (time.value <= 0.0 || addTimer === false) {
    //   time.value += dt;
    //   if (time.value >= 2.6) {
    //     addTimer = true
    //   }
    // }
    if (isStart) {
      StartTime.value += dt * 0.6;
      if (StartTime.value >= 1) {
        StartTime.value = 1;
        isStart = false;
      }
    }


    if (controls) {
      controls.update();

    }

    if (TWEEN) {
      TWEEN.update();
    }


    if (renderer && labelRenderer && scene && camera) {
      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
    }




    requestAnimationFrame(render);


  };


  // 着色器渲染
  function Shaders() {
    const vertexShader = [
      'varying vec3	vVertexWorldPosition;',
      'varying vec3	vVertexNormal;',
      'varying vec4	vFragColor;',
      'void main(){',
      '	vVertexNormal	= normalize(normalMatrix * normal);',// 将法线转换到视图坐标系中
      '	vVertexWorldPosition	= (modelMatrix * vec4(position, 1)).xyz;',// 将顶点转换到世界坐标系中
      '	// set gl_Position',
      '	gl_Position	= projectionMatrix * modelViewMatrix * vec4(position, 1);',
      '}'

    ].join('\n');
    // 身体皮肤效果
    const AeroSphere = {
      uniforms: {
        coeficient: {
          type: "f",
          value: 1.0
        },
        power: {
          type: "f",
          value: 0.5
        },
        glowColor: {
          type: "c",
          value: new THREE.Color("#51AEF4")
        }
      },
      vertexShader,
      fragmentShader: [
        'uniform vec3	glowColor;',
        'uniform float	coeficient;',
        'uniform float	power;',

        'varying vec3	vVertexNormal;',
        'varying vec3	vVertexWorldPosition;',

        'varying vec4	vFragColor;',

        'void main(){',
        '	vec3 worldCameraToVertex= vVertexWorldPosition - cameraPosition;',	// 世界坐标系中从相机位置到顶点位置的距离
        '	vec3 viewCameraToVertex	= (viewMatrix * vec4(worldCameraToVertex, 0.0)).xyz;',// 视图坐标系中从相机位置到顶点位置的距离
        '	viewCameraToVertex	= normalize(viewCameraToVertex);',// 规一化
        '	float intensity		= pow(coeficient + dot(vVertexNormal, viewCameraToVertex), power);',
        '	gl_FragColor		= vec4(glowColor, intensity);',
        '}'

      ].join('\n')
    }
    const AeroSphere1 = {
      uniforms: {
        coeficient: {
          type: "f",
          value: 1
        },
        power: {
          type: "f",
          value: 1
        },
        glowColor: {
          type: "c",
          value: new THREE.Color("#336AAC")
        }
      },
      vertexShader,
      fragmentShader: [
        'uniform vec3	glowColor;',
        'uniform float	coeficient;',
        'uniform float	power;',

        'varying vec3	vVertexNormal;',
        'varying vec3	vVertexWorldPosition;',

        'varying vec4	vFragColor;',

        'void main(){',
        '	vec3 worldCameraToVertex= vVertexWorldPosition - cameraPosition;',	// 世界坐标系中从相机位置到顶点位置的距离
        '	vec3 viewCameraToVertex	= (viewMatrix * vec4(worldCameraToVertex, 0.0)).xyz;',// 视图坐标系中从相机位置到顶点位置的距离
        '	viewCameraToVertex	= normalize(viewCameraToVertex);',// 规一化
        '	float intensity		= pow(coeficient + dot(vVertexNormal, viewCameraToVertex), power);',
        '	gl_FragColor		= vec4(glowColor, intensity);',
        '}'// vVertexNormal视图坐标系中点的法向量
        // viewCameraToVertex视图坐标系中点到摄像机的距离向量
        // dot点乘得到它们的夹角的cos值
        // 从中心向外面角度越来越小（从钝角到锐角）从cos函数也可以知道这个值由负变正，不透明度最终从低到高
      ].join('\n')
    }
    const AeroSphere3 = {
      uniforms: {
        coeficient: {
          type: "f",
          value: 1
        },
        power: {
          type: "f",
          value: 0.2
        },
        glowColor: {
          type: "c",
          value: new THREE.Color("red")
        }
      },
      vertexShader,
      fragmentShader: [
        'uniform vec3	glowColor;',
        'uniform float	coeficient;',
        'uniform float	power;',

        'varying vec3	vVertexNormal;',
        'varying vec3	vVertexWorldPosition;',

        'varying vec4	vFragColor;',

        'void main(){',
        '	vec3 worldCameraToVertex= vVertexWorldPosition - cameraPosition;',	// 世界坐标系中从相机位置到顶点位置的距离
        '	vec3 viewCameraToVertex	= (viewMatrix * vec4(worldCameraToVertex, 0.0)).xyz;',// 视图坐标系中从相机位置到顶点位置的距离
        '	viewCameraToVertex	= normalize(viewCameraToVertex);',// 规一化
        '	float intensity		= pow(coeficient + dot(vVertexNormal, viewCameraToVertex), power);',
        '	gl_FragColor		= vec4(glowColor, intensity);',
        '}'// vVertexNormal视图坐标系中点的法向量
        // viewCameraToVertex视图坐标系中点到摄像机的距离向量
        // dot点乘得到它们的夹角的cos值
        // 从中心向外面角度越来越小（从钝角到锐角）从cos函数也可以知道这个值由负变正，不透明度最终从低到高
      ].join('\n')
    }

    const material1 = new THREE.ShaderMaterial({
      uniforms: AeroSphere.uniforms,
      vertexShader: AeroSphere.vertexShader,
      fragmentShader: AeroSphere.fragmentShader,
      blending: THREE.NormalBlending,
      transparent: true,
      depthWrite: false,
    });
    const material2 = new THREE.ShaderMaterial({
      uniforms: AeroSphere1.uniforms,
      vertexShader: AeroSphere1.vertexShader,
      fragmentShader: AeroSphere1.fragmentShader,
      blending: THREE.NormalBlending,
      transparent: true,
      depthWrite: false
    });
    const material3 = new THREE.ShaderMaterial({
      uniforms: AeroSphere3.uniforms,
      vertexShader: AeroSphere3.vertexShader,
      fragmentShader: AeroSphere3.fragmentShader,
      blending: THREE.NormalBlending,
      transparent: true,
      depthWrite: false
    });
    return {material1, material2, material3}
  }


  /**
   * 增加着色器
   * */

  /**
   * 给材质赋值颜色
   * */
  const setCityMaterial = (object: any) => {
    // 确定oject的geometry的box size
    object.geometry.computeBoundingBox();
    object.geometry.computeBoundingSphere();
    let materialBody: any;
    const {geometry} = object;

    // 获取geometry的长宽高 中心点
    const {center, radius} = geometry.boundingSphere;

    /**
     *
     * 把保卫模型的球弄出来
     * */


    /**
     *
     *
     * */

    const {max, min} = geometry.boundingBox;

    const size = new THREE.Vector3(
      max.x - min.x,
      max.y - min.y,
      max.z - min.z,
    );


    Utils.forMaterial(object.material, (material: any) => {
      material.transparent = true;

      material.color.setStyle('#ffffff');
      BodyShader = {
        uniforms: {
          time,
          uStartTime: StartTime,
          uCenter: {
            value: new THREE.Vector3(0, 0, 0),
          },
          uSize: {
            value: size,
          },
          uMax: {
            value: max,
          },
          uMin: {
            value: min,
          },
          uTopColor: {
            value: new THREE.Color('rgb(47,156,255)'),
          },
          uDiffusion: {
            value: new THREE.Vector3(
              1, // 0 1开关
              4, // 范围
              8, // 速度
            ),
          },

          uFlow: {
            value: new THREE.Vector3(
              1, // 0 1开关
              0.4, // 范围
              4 // 速度
            )
          },

          uFlowColor: {
            value: new THREE.Color("#ff000a")
          },

          uColor: {
            value: new THREE.Color('#ff0064'),
          },
          uOpacity: {
            value: 1,
          },
          uRadius: {
            value: radius / 10,
          },
          coeficient: {
            type: 'f',
            value: 1.0,
          },
          power: {
            type: 'f',
            value: 0.9,
          },
          glowColor: {
            type: 'c',
            value: new THREE.Color('rgb(47,156,255)'),
          },
          cameraMatrix: {
            value: new THREE.Matrix4(),
          },
        },
        vertexShader: `
          varying vec3	vVertexWorldPosition;
          varying vec3	vVertexNormal;
          varying vec4	vFragColor;
          varying vec4 vPositionMatrix;
          varying vec3 vPosition;
          uniform float uStartTime;
          void main() {
            vVertexNormal	= normalize(normalMatrix * normal);
            vVertexWorldPosition	= (modelMatrix * vec4(position, 1)).xyz;
            vPositionMatrix = projectionMatrix * vec4(position, 1.0);
            vPosition = position;
            gl_Position	= projectionMatrix * modelViewMatrix * vec4(position, 1);
          }`,
        fragmentShader: `
          float distanceTo(vec2 src, vec2 dst) {
            float dx = src.x - dst.x;
            float dy = src.y - dst.y;
            float dv = dx * dx + dy * dy;
            return sqrt(dv);
        }
          varying vec4 vPositionMatrix;
          varying vec3 vPosition;

          uniform float time;
          // 扩散参数
          uniform float uRadius;
          uniform float uOpacity;
          // 初始动画参数
          uniform float uStartTime;

          uniform vec3 uMin;
          uniform vec3 uMax;
          uniform vec3 uSize;
          uniform vec3 uColor;
          uniform vec3 uCenter;

          // 上下流动的参数
          uniform vec3 uFlow;
          uniform vec3 uFlowColor;



          uniform vec3	glowColor;
          uniform float	coeficient;
          uniform float	power;
          varying vec3	vVertexNormal;
          varying vec3	vVertexWorldPosition;
          varying vec4	vFragColor;

          uniform vec3 uTopColor;
          uniform vec3 uDiffusion;
          uniform vec3 uDiffusionCenter;
          void main() {
          vec3 distColor =  vec3(0.3, 0.6, 1.0);

          float indexMix = vPosition.z / uSize.z ;
          distColor = mix(distColor, uTopColor, indexMix);
          // 开启扩散波
          vec2 position2D = vec2(vPosition.x, vPosition.y);
          // if (uDiffusion.x > 0.5) {
          //     // 扩散速度
          //     float dTime = mod(time * uDiffusion.z, uRadius * 2.0);
          //     // 当前的离中心点距离
          //     float uLen = distanceTo(position2D, vec2(uCenter.x, uCenter.z));
          //     // 扩散范围
          //     if (uLen < dTime && uLen > dTime - uDiffusion.y) {
          //         // 颜色渐变
          //         float dIndex = sin((dTime - uLen) / uDiffusion.y );
          //         distColor = mix(uColor, distColor, dIndex);
          //     }
          // }

            if (uFlow.x > 0.5) {
                // 扩散速度,
                float dTime = mod(time * uFlow.z, uSize.z );
                // 流动范围
                float topY = vPosition.z * 0.3  + 4.0;
                if (dTime > vPosition.z && dTime < topY) {
                    // 颜色渐变
                    float dIndex = sin((topY * 0.8 - dTime) / 0.2 * 3.14);

                    distColor = mix(distColor, uFlowColor,  dIndex);
                }
            }
          vec3 worldCameraToVertex= vVertexWorldPosition - cameraPosition;
          vec3 viewCameraToVertex	= (viewMatrix * vec4(worldCameraToVertex, 0.0)).xyz;
          viewCameraToVertex	= normalize(viewCameraToVertex);
          float intensity	= pow(coeficient + dot(vVertexNormal, viewCameraToVertex),power);
          gl_FragColor	= vec4(distColor, 1) * intensity ;
          }`,
      };

      materialBody = new THREE.ShaderMaterial({
        uniforms: BodyShader.uniforms,
        vertexShader: BodyShader.vertexShader,
        fragmentShader: BodyShader.fragmentShader,
        blending: THREE.NormalBlending,
        transparent: true,
        depthWrite: false,
        visible: true,
      });
    });
    return {materialBody};
  };

  const processGLTFChild = (child: any) => {

    try {
      if (child.isMesh) {


        // 有的child.material 类型是 Array, 有的是 Object
        switch (child.name) {
          case "Body002":
          case "皮肤":
            child.material = setCityMaterial(child).materialBody;
            child.castShadow = true;

            break;
          case "Skeletal001":
            child.material = Shaders().material2;
            child.castShadow = true;
            break;
          case "Circulatory_Heart001":
          case "心脏":
            child.material = Shaders().material3;
            child.castShadow = true

            break;
          default:
            child.material = Shaders().material2;
            child.castShadow = true;
            break;
        }
      }
    } catch (e) {
      console.log('error:', e)
      console.error('设置色彩出错, child:', child)
    }
  }


  useEffect(() => {
    initModel();

  }, [])

  /**
   * 定制化tooltip地展示格式
   * */


  /**
   *
   * 更改选中的模型的透明度，或者是全部,最好在华东的时候展示最近控制的，
   * 采用两种滑块调节透明度，一种是在滑块改变完成之后进行调用，这样在食用地时候使用补间动画
   * 还有就是当模型滑块的值向下取整的时候大于下标的时候就直接设置为visiable不可见
   * */

  /**
   * 主要是当滑动条不是匀速的时候调用，用于将之前的都隐藏掉，之后的都可视，且透明度均为一
   * */


  /**
   * 点击打开进行展示模型
   * 参数为网格模型的名字
   * */


  /**
   * 在人体模型的右侧防止一个器官的栏目，点击具体的栏目会直接展开栏目的模型, 在加载玩模型的时候在重置一个,
   * 不能使用多场景，只能使用图标，对性能要求第一点
   * */


  /**
   * 点击放大或者是打开器官的弹框，或者跳到指定位置
   * */

  /**
   * 根据器官或者身体地某部分生成一个走马灯中的元素
   * */


  return (
    <div>
      <div className={styles.output} id="webgl-output">

      </div>

    </div>
  )
}

export default NormalProject;
