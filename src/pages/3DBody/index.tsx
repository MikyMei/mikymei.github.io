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
import {SkeletonHelper} from 'three/src/helpers/SkeletonHelper.js';

// import {LightProbeHelper} from "three";
// import {LightProbeGenerator} from "three";


import styles from './index.less';
import {Button, Card, Slider} from "antd";
// import Utils from "@/pages/scanCity/utils";
// const controls = new OrbitControls();


const Three3D: React.FC = () => {


  const loader = new GLTFLoader();


  /**
   *beIntersectObjects是用来存放需要射线检测的物体数组。
   *transformControl可以方便调节物体位置大小。
   *
   * */

  let beIntersectObjects: any = [];
  let transformControl: any = new Object();

  let counts = 0;

  let scene: any;
  let objects: any = [];
  let camera: any;
  let plane: any;
  let spotLight: any;
  let ambient: any;
  let point: any;
  let cubeCamera: any;
  let INTERSECTED: any;
  let chooseMesh: null; // 被点击的网格模型，主要是为了保存下来生成信息窗体

  let theta = 0;

  let renderer: any;

  let childMesh: any;

  let clickX: 0, clickY: 0;
  let lightProbe;

  let particles: any;
  let count = 0;

  const AMOUNTX = 50;
  const AMOUNTY = 50;

  const circlePointsNum = 100;

  let flag = 0;
  let heartMeshModel: any;
  let positionTemp: any;


  const time = {
    value: 0
  };
  const StartTime = {
    value: 0
  };
  let isStart = false;


  // 信息窗体
  let img = document.createElement("img");
  document.body.appendChild(img)
  img.style.position = 'absolute';
  img.style.display = 'block';

  // 重新设置一个元素，作为信息展示交互
  let infoWindow = document.createElement("div");
  document.body.appendChild(infoWindow)

  infoWindow.id = "infoWindow";

  infoWindow.className = styles.infoWindow;

  const pointer = new THREE.Vector2();
  const radius = 100;
  const raycaster = new THREE.Raycaster();
  let mainCanvas: any;
  let mixer: any;
  let action: any;
  const clock = new THREE.Clock();

  const initModel = () => {

    // 获得渲染器长度
    mainCanvas = document.getElementById("webgl-output");


    /**
     * 使场景也跟着旋转
     * */

    const path = '/img/';
    const format = '.jpg';
    const urls = [
      path + 'px' + format, path + 'nx' + format,
      path + 'py' + format, path + 'ny' + format,
      path + 'pz' + format, path + 'nz' + format
    ];


    const refractionCube = new THREE.CubeTextureLoader().load(urls);
    refractionCube.mapping = THREE.CubeRefractionMapping;

    refractionCube.encoding = THREE.sRGBEncoding;


    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
      encoding: THREE.sRGBEncoding, // since gamma is applied during rendering, the cubeCamera renderTarget texture encoding must be sRGBEncoding
      format: THREE.RGBAFormat
    });

    cubeCamera = new THREE.CubeCamera(1, 1000, cubeRenderTarget);


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
    renderer.setClearColor(new THREE.Color(0xEEEEEE));
    renderer.setSize(mainCanvas.offsetWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;


    // var axes = new THREE.AxisHelper(20);
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
    point.position.set(400, 200, 300); //点光源位置
    // scene.add(point);


    var planeGemometry = new THREE.PlaneGeometry(50, 30);
    var planeMeterial = new THREE.MeshStandardMaterial({
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


    let model, skeleton;
    loader.load('./img/standardFigure5.gltf', function (gltf) {
        model = gltf.scene;
        model.scale.setScalar(5, 5, 5);
        model.position.setY(-5);
        // const box = new THREE.Box3();
        // box.setFromObject(model);
        // var helper = new THREE.Box3Helper(box, 0xffff00);
        // gltf.scene.attach(helper);
        /**
         * beIntersectObjects是用来存放需要射线检测的物体数组。
         * transformControl可以方便调节物体位置大小。
         * */

        // console.log(action);


        scene.add(model);
        model.traverse(
          processGLTFChild
        );
        mixer = new THREE.AnimationMixer(model);
        // mixer = new THREE.AnimationMixer( model );


        // let clip = THREE.AnimationClip.CreateFromMorphTargetSequence('run', model.geometry.morphTargets, 30);
        action = mixer.clipAction(gltf.animations[0]);
        // action.enabled = true;
        // //
        // action.setEffectiveTimeScale(1);
        // action.setLoop(10, 120);
        // action.setEffectiveWeight(0.5);
        action.play();


        // skeleton = new SkeletonHelper(model);
        // skeleton.scale.setScalar(10, 10, 10)
        // skeleton.visible = true;
        // scene.add(skeleton);
        // const animations = gltf.animations;
        // let mixer = new THREE.AnimationMixer(model);
      },
      undefined

      , function (error) {

        console.error(error);

      });


    // 将渲染器添加到html元素中

    // @ts-ignore
    window.document.getElementById('webgl-output').appendChild(renderer.domElement);
    // generatePointsCircle();


    render();
    var controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true // 是否自动旋转
    controls.autoRotateSpeed = 1.0 // 自动旋转的速度，默认值是 2.0，即渲染满60帧的情况下30秒旋转360度。


    // document.getElementById('webgl-output').addEventListener('click', (event) => choose(event));

  }


  const render = () => {

    const delta = clock.getDelta();


    const dt = clock.getDelta();
    // while (flag < 10000 && heartMeshModel) {
    //   console.log(heartMeshModel.geometry.attributes.position.data.array[1500] );
    //   // eslint-disable-next-line prefer-destructuring
    //   // positionTemp = heartMeshModel.geometry.attributes.position.data.array[10];
    //   flag += 1;
    // }


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

    if (mixer) {
      mixer.update(delta);
      // childMesh.geometry.verticesNeedUpdate=true;

      // while (counts<10){
      //   //
      //   // console.log(childMesh.geometry.attributes.position.data.array);
      //
      //   // childMesh.geometry.faceVertexUvs=new THREE.BufferAttribute(childMesh.geometry.attributes.position.data.array,3);
      //   console.log(new THREE.BufferAttribute(childMesh.geometry.attributes.position.data.array, 3));
      //
      //   counts+=1;
      // }


    }


    /**
     * 让粒子动起来
     * */
    const height = (Math.sin((25 + count) * 0.3) * 2);

    if (particles) {
      const positions = particles.geometry.attributes.position.array;
      const scales = particles.geometry.attributes.scale.array;


      let i = 0, j = 0;

      for (let ix = 0; ix < AMOUNTX; ix++) {

        for (let iy = 0; iy < AMOUNTY; iy++) {
          //
          // 只改变了y
          positions[i + 1] = height;

          //
          // scales[ j ] = ( Math.sin( ( ix + count ) * 0.3 ) + 0.5 )  +
          //   ( Math.sin( ( iy + count ) * 0.3 ) + 0.5 ) ;

          i += 3;
          j++;

        }

      }

      particles.geometry.attributes.position.needsUpdate = true;
      particles.geometry.attributes.scale.needsUpdate = true;
      count += 0.1;
    }


    renderer.render(scene, camera); // 执行渲染操作

    requestAnimationFrame(render);

    // 如果选中的有网格模型，就加载信息窗
    if (chooseMesh) {


      /**
       * 计算位置
       * */


      chooseMesh.geometry.computeBoundingBox();
      var centroid = new THREE.Vector3();
      centroid.addVectors(chooseMesh.geometry.boundingBox.min, chooseMesh.geometry.boundingBox.max);
      centroid.multiplyScalar(0.5);
      centroid.applyMatrix4(chooseMesh.matrixWorld);


      let newWorldVector = centroid;


      var standardVector1 = newWorldVector.project(camera);
      var a1 = window.innerWidth / 2;
      var b1 = window.innerHeight / 2;
      var x1 = Math.round(standardVector1.x * a1 + a1);
      var y1 = Math.round(-standardVector1.y * b1 + b1);

      /**
       * 结束
       *
       * */




        // 根据模型的position来获得信息窗体一类位置，还需要获得模型的相对位置
      var worldVector = new THREE.Vector3(
        chooseMesh.position.x,
        chooseMesh.position.y,
        chooseMesh.position.z
        );
      var standardVector = worldVector.project(camera);
      var a = window.innerWidth / 2;
      var b = window.innerHeight / 2;
      var x = Math.round(standardVector.x * a + a);
      var y = Math.round(-standardVector.y * b + b);


      // console.log(chooseMesh.name, "模型中心初始位置:",x,y, "模型相对位置:",x1,y1 );


      /**
       * 加载交互的窗体，设置相对位置
       * */
      img.style.left = x + 200 + 'px';
      img.style.top = y - 280 + 'px';

      // 信息窗体
      infoWindow.style.top = y - 280 + 'px';
      infoWindow.style.left = x - 200 + 'px';

      const testAnt = document.getElementById("testAnt");
      testAnt.innerText = chooseMesh.name || "00";
      testAnt.style.display = "inline";
      testAnt.style.top = y1 + 'px';
      testAnt.style.left = x1 + 'px';


    }

  }


  // const setCityMaterial = (object: any) => {
  //   // 确定oject的geometry的box size
  //   object.geometry.computeBoundingBox();
  //   object.geometry.computeBoundingSphere();
  //   let materialBody: any;
  //   const {geometry} = object;
  //
  //   // 获取geometry的长宽高 中心点
  //   const {center, radius} = geometry.boundingSphere;
  //
  //   /**
  //    *
  //    * 把保卫模型的球弄出来
  //    * */
  //
  //
  //   /**
  //    *
  //    *
  //    * */
  //
  //   const {max, min} = geometry.boundingBox;
  //
  //   const size = new THREE.Vector3(
  //     max.x - min.x,
  //     max.y - min.y,
  //     max.z - min.z,
  //   );
  //
  //
  //   Utils.forMaterial(object.material, (material: any) => {
  //     material.transparent = true;
  //
  //     material.color.setStyle('#ffffff');
  //     let BodyShader = {
  //       uniforms: {
  //         time,
  //         uStartTime: StartTime,
  //         uCenter: {
  //           value: new THREE.Vector3(0, 0, 0),
  //         },
  //         uSize: {
  //           value: size,
  //         },
  //         uMax: {
  //           value: max,
  //         },
  //         uMin: {
  //           value: min,
  //         },
  //         uTopColor: {
  //           value: new THREE.Color('rgb(47,156,255)'),
  //         },
  //         uDiffusion: {
  //           value: new THREE.Vector3(
  //             1, // 0 1开关
  //             4, // 范围
  //             8, // 速度
  //           ),
  //         },
  //
  //         uFlow: {
  //           value: new THREE.Vector3(
  //             1, // 0 1开关
  //             0.4, // 范围
  //             4 // 速度
  //           )
  //         },
  //
  //         uFlowColor: {
  //           value: new THREE.Color("#ff000a")
  //         },
  //
  //         uColor: {
  //           value: new THREE.Color('#ff0064'),
  //         },
  //         uOpacity: {
  //           value: 1,
  //         },
  //         uRadius: {
  //           value: radius / 10,
  //         },
  //         coeficient: {
  //           type: 'f',
  //           value: 1.0,
  //         },
  //         power: {
  //           type: 'f',
  //           value: 0.9,
  //         },
  //         glowColor: {
  //           type: 'c',
  //           value: new THREE.Color('rgb(47,156,255)'),
  //         },
  //         cameraMatrix: {
  //           value: new THREE.Matrix4(),
  //         },
  //       },
  //       vertexShader: `
  //         varying vec3	vVertexWorldPosition;
  //         varying vec3	vVertexNormal;
  //         varying vec4	vFragColor;
  //         varying vec4 vPositionMatrix;
  //         varying vec3 vPosition;
  //         uniform float uStartTime;
  //         void main() {
  //           vVertexNormal	= normalize(normalMatrix * normal);
  //           vVertexWorldPosition	= (modelMatrix * vec4(position, 1)).xyz;
  //           vPositionMatrix = projectionMatrix * vec4(position, 1.0);
  //           vPosition = position;
  //           gl_Position	= projectionMatrix * modelViewMatrix * vec4(position, 1);
  //         }`,
  //       fragmentShader: `
  //         float distanceTo(vec2 src, vec2 dst) {
  //           float dx = src.x - dst.x;
  //           float dy = src.y - dst.y;
  //           float dv = dx * dx + dy * dy;
  //           return sqrt(dv);
  //       }
  //         varying vec4 vPositionMatrix;
  //         varying vec3 vPosition;
  //
  //         uniform float time;
  //         // 扩散参数
  //         uniform float uRadius;
  //         uniform float uOpacity;
  //         // 初始动画参数
  //         uniform float uStartTime;
  //
  //         uniform vec3 uMin;
  //         uniform vec3 uMax;
  //         uniform vec3 uSize;
  //         uniform vec3 uColor;
  //         uniform vec3 uCenter;
  //
  //         // 上下流动的参数
  //         uniform vec3 uFlow;
  //         uniform vec3 uFlowColor;
  //
  //
  //
  //         uniform vec3	glowColor;
  //         uniform float	coeficient;
  //         uniform float	power;
  //         varying vec3	vVertexNormal;
  //         varying vec3	vVertexWorldPosition;
  //         varying vec4	vFragColor;
  //
  //         uniform vec3 uTopColor;
  //         uniform vec3 uDiffusion;
  //         uniform vec3 uDiffusionCenter;
  //         void main() {
  //         vec3 distColor =  vec3(0.3, 0.6, 1.0);
  //
  //         float indexMix = vPosition.z / uSize.z ;
  //         distColor = mix(distColor, uTopColor, indexMix);
  //         // 开启扩散波
  //         vec2 position2D = vec2(vPosition.x, vPosition.y);
  //         // if (uDiffusion.x > 0.5) {
  //         //     // 扩散速度
  //         //     float dTime = mod(time * uDiffusion.z, uRadius * 2.0);
  //         //     // 当前的离中心点距离
  //         //     float uLen = distanceTo(position2D, vec2(uCenter.x, uCenter.z));
  //         //     // 扩散范围
  //         //     if (uLen < dTime && uLen > dTime - uDiffusion.y) {
  //         //         // 颜色渐变
  //         //         float dIndex = sin((dTime - uLen) / uDiffusion.y );
  //         //         distColor = mix(uColor, distColor, dIndex);
  //         //     }
  //         // }
  //
  //           if (uFlow.x > 0.5) {
  //               // 扩散速度,
  //               float dTime = mod(time * uFlow.z, uSize.z );
  //               // 流动范围
  //               float topY = vPosition.z * 0.3  + 4.0;
  //               if (dTime > vPosition.z && dTime < topY) {
  //                   // 颜色渐变
  //                   float dIndex = sin((topY * 0.8 - dTime) / 0.2 * 3.14);
  //
  //                   distColor = mix(distColor, uFlowColor,  dIndex);
  //               }
  //           }
  //         vec3 worldCameraToVertex= vVertexWorldPosition - cameraPosition;
  //         vec3 viewCameraToVertex	= (viewMatrix * vec4(worldCameraToVertex, 0.0)).xyz;
  //         viewCameraToVertex	= normalize(viewCameraToVertex);
  //         float intensity	= pow(coeficient + dot(vVertexNormal, viewCameraToVertex),power);
  //         gl_FragColor	= vec4(distColor, 1) * intensity ;
  //         }`,
  //     };
  //
  //     materialBody = new THREE.ShaderMaterial({
  //       uniforms: BodyShader.uniforms,
  //       vertexShader: BodyShader.vertexShader,
  //       fragmentShader: BodyShader.fragmentShader,
  //       blending: THREE.NormalBlending,
  //       transparent: true,
  //       depthWrite: false,
  //       visible: true,
  //     });
  //   });
  //   return {materialBody};
  // };


  // 添加点击监听


  const choose = (event: any) => {
    const testAnt = document.getElementById("testAnt");
    testAnt.style.display = "none";

    img.src = '';
    infoWindow.style.display = "none";


    chooseMesh = null;


    const x = ((event.clientX - mainCanvas.getBoundingClientRect().left) / mainCanvas.offsetWidth) * 2 - 1;
    const y = -((event.clientY - mainCanvas.getBoundingClientRect().top) / mainCanvas.offsetHeight) * 2 + 1;


    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
    const Arr: any = objects;


    const intersects = raycaster.intersectObjects(Arr, true);

    /**
     * 遍历当前点击的模型，和objects比较，如果点击的有，就删除
     * */

    if (intersects.length > 0) {
      intersects.forEach(function (Mesh: any) {


        /**
         *
         * 对每个网格模型获得相对坐标
         *
         * */

        Mesh.object.geometry.computeBoundingBox();
        var centroid = new THREE.Vector3();
        centroid.addVectors(Mesh.object.geometry.boundingBox.min, Mesh.object.geometry.boundingBox.max);
        centroid.multiplyScalar(0.5);
        centroid.applyMatrix4(Mesh.object.matrixWorld);

        // console.log(Mesh.object.name, centroid, "模型包围盒:", Mesh.object.geometry.boundingBox);

        /**
         * 将边框的线画出来
         *
         * */

          // 原点向量
        var a = new THREE.Vector3(0, 0, 0);

        const points: any = [];
        points.push(centroid);
        points.push(a);

        var material = new THREE.LineBasicMaterial({color: 0x0000ff});  // 定义线条的材料，接收字典类型的参数
        var geometry = new THREE.BufferGeometry().setFromPoints(points);
        ;  // 声明一个几何体geometry


        var line = new THREE.Line(geometry, material);  // 根据材料创建线条

        scene.add(line);  // 将线条添加到场景内


        /**
         * 结束
         * */


          // 判断当前颜色，组成一个数组， 或者是对象
          // mesh.material.uniforms.glowColor.set( new THREE.Color("black"))
        const tempMaterialColor = ["black"];
        // 每次判断一下当前的颜色下标，再换
        if (Mesh.object.material.uniforms.glowColor.value.r === 0 &&
          Mesh.object.material.uniforms.glowColor.value.g === 0 &&
          Mesh.object.material.uniforms.glowColor.value.b === 0
        ) {
          // 那就向后移动一格

          switch (Mesh.object.name) {
            case "Body001":
              Mesh.object.material = Shaders().material1;
              Mesh.object.castShadow = true;

              break;
            case "Skeletal":
              Mesh.object.material = Shaders().material2;
              Mesh.object.castShadow = true;
              break;
            case "Circulatory_Heart":
              Mesh.object.material = new THREE.MeshLambertMaterial({color: "#71adde", transparent: true, opacity: 0.5});
              Mesh.object.castShadow = true

              break;
            default:
              break;
          }

        } else {
          Mesh.object.material.uniforms.glowColor.value.set(new THREE.Color("black"))
        }

      })


      // infoWindow.style.display = "inline";
      // infoWindow.innerHTML = `<Button type="primary" label="测试">${intersects[0].object.name} </Button>`
      // img.src = './img/img_9.png';


      // 一般把第一个作为选中的网格模型
      chooseMesh = intersects[0].object
    }

    // render2()
  }

  // 着色器渲染
  function Shaders() {
    let vertexShader = [
      'varying vec3	vVertexWorldPosition;',
      'varying vec3	vVertexNormal;',
      'varying vec4	vFragColor;',
      'varying vec2 vUv;',
      'void main(){',
      ' vUv = uv;',
      '	vVertexNormal	= normalize(normalMatrix * normal);',//将法线转换到视图坐标系中
      '	vVertexWorldPosition	= (modelMatrix * vec4(position, 1)).xyz;',//将顶点转换到世界坐标系中
      '	// set gl_Position',
      '	gl_Position	= projectionMatrix * modelViewMatrix * vec4(position, 1);',
      '}'

    ].join('\n');
    //身体皮肤效果
    let AeroSphere = {
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
      vertexShader: vertexShader,
      fragmentShader: [
        'uniform vec3	glowColor;',
        'uniform float	coeficient;',
        'uniform float	power;',

        'varying vec3	vVertexNormal;',
        'varying vec3	vVertexWorldPosition;',

        'varying vec4	vFragColor;',

        'void main(){',
        '	vec3 worldCameraToVertex= vVertexWorldPosition - cameraPosition;',	//世界坐标系中从相机位置到顶点位置的距离
        '	vec3 viewCameraToVertex	= (viewMatrix * vec4(worldCameraToVertex, 0.0)).xyz;',//视图坐标系中从相机位置到顶点位置的距离
        '	viewCameraToVertex	= normalize(viewCameraToVertex);',//规一化
        '	float intensity		= pow(coeficient + dot(vVertexNormal, viewCameraToVertex), power);',
        '	gl_FragColor		= vec4(glowColor, intensity);',
        '}'//vVertexNormal视图坐标系中点的法向量
        //viewCameraToVertex视图坐标系中点到摄像机的距离向量
        //dot点乘得到它们的夹角的cos值
        //从中心向外面角度越来越小（从钝角到锐角）从cos函数也可以知道这个值由负变正，不透明度最终从低到高
      ].join('\n')
    }
    let AeroSphere1 = {
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
      vertexShader: vertexShader,
      fragmentShader: [
        'uniform vec3	glowColor;',
        'uniform float	coeficient;',
        'uniform float	power;',

        'varying vec3	vVertexNormal;',
        'varying vec3	vVertexWorldPosition;',

        'varying vec4	vFragColor;',

        'void main(){',
        '	vec3 worldCameraToVertex= vVertexWorldPosition - cameraPosition;',	//世界坐标系中从相机位置到顶点位置的距离
        '	vec3 viewCameraToVertex	= (viewMatrix * vec4(worldCameraToVertex, 0.0)).xyz;',//视图坐标系中从相机位置到顶点位置的距离
        '	viewCameraToVertex	= normalize(viewCameraToVertex);',//规一化
        '	float intensity		= pow(coeficient + dot(vVertexNormal, viewCameraToVertex), power);',
        '	gl_FragColor		= vec4(glowColor, intensity);',
        '}'//vVertexNormal视图坐标系中点的法向量
        //viewCameraToVertex视图坐标系中点到摄像机的距离向量
        //dot点乘得到它们的夹角的cos值
        //从中心向外面角度越来越小（从钝角到锐角）从cos函数也可以知道这个值由负变正，不透明度最终从低到高
      ].join('\n')
    }
    let vertexShader2 = [
      'varying vec3	vVertexWorldPosition;',
      'varying vec3	vVertexNormal;',
      'attribute float displacement;',
      'varying vec4	vFragColor;',
      'varying vec2 vUv;',
      'void main(){',
      ' vUv = uv;',
      '	vVertexNormal	= normalize(normalMatrix * normal);',//将法线转换到视图坐标系中
      '	vVertexWorldPosition	= (modelMatrix * vec4(position, 1)).xyz;',//将顶点转换到世界坐标系中
      '	// set gl_Position',
      '	gl_Position	= projectionMatrix * modelViewMatrix * vec4(position, 1);',
      '}'

    ].join('\n');

    let AeroSphere3 = {
      uniforms: {
        coeficient: {
          type: "f",
          value: 1.0
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
      vertexShader: vertexShader2,
      fragmentShader: [
        'uniform vec3	glowColor;',
        'uniform float	coeficient;',
        'uniform float	power;',

        'varying vec3	vVertexNormal;',
        'varying vec3	vVertexWorldPosition;',

        'varying vec4	vFragColor;',
        'varying vec2 vUv;',

        'void main(){',
        '	vec3 worldCameraToVertex= vVertexWorldPosition - cameraPosition;',	//世界坐标系中从相机位置到顶点位置的距离
        '	vec3 viewCameraToVertex	= (viewMatrix * vec4(worldCameraToVertex, 0.0)).xyz;',//视图坐标系中从相机位置到顶点位置的距离
        '	viewCameraToVertex	= normalize(viewCameraToVertex);',//规一化
        '	float intensity		= pow(coeficient + dot(vVertexNormal, viewCameraToVertex), power);',
        '	gl_FragColor		= vec4(glowColor, intensity);',
        '}'
        //vVertexNormal视图坐标系中点的法向量
        //viewCameraToVertex视图坐标系中点到摄像机的距离向量
        //dot点乘得到它们的夹角的cos值
        //从中心向外面角度越来越小（从钝角到锐角）从cos函数也可以知道这个值由负变正，不透明度最终从低到高
      ].join('\n')
    }

    var material1 = new THREE.ShaderMaterial({
      uniforms: AeroSphere.uniforms,
      vertexShader: AeroSphere.vertexShader,
      fragmentShader: AeroSphere.fragmentShader,
      blending: THREE.NormalBlending,
      transparent: true,
      depthWrite: false,
    });
    var material2 = new THREE.ShaderMaterial({
      uniforms: AeroSphere1.uniforms,
      vertexShader: AeroSphere1.vertexShader,
      fragmentShader: AeroSphere1.fragmentShader,
      blending: THREE.NormalBlending,
      transparent: true,
      depthWrite: false,

    });

    var material3 = new THREE.ShaderMaterial({
      uniforms: AeroSphere3.uniforms,
      vertexShader: AeroSphere3.vertexShader,
      fragmentShader: AeroSphere3.fragmentShader,
      blending: THREE.NormalBlending,
      transparent: true,
      depthWrite: true,
      // morphTargets: true
    });

    // const myMaterial = new THREE.MeshStandardMaterial({
    //   uniforms: AeroSphere3.uniforms,
    //   onBeforeC
    // })
    return {material1, material2, material3}
  }


  const processGLTFChild = (child: any) => {

    try {
      if (child.isMesh) {


        // 有的child.material 类型是 Array, 有的是 Object
        switch (child.name) {
          case "Body001":
          case "Retopo_皮肤":
            child.material = Shaders().material1;
            child.material.visible = false;
            child.castShadow = true;

            break;
          case "Skeletal":
            child.material = Shaders().material2;
            child.castShadow = true;
            break;
          case "Retopo_心脏_":


            heartMeshModel = child;

            child.material = new THREE.MeshPhongMaterial({
              color: "#ff5050",
              transparent: true,
              opacity: 1,
              specular: "#ffffff",
              shininess: 2000
            });


            break;
          default:
            child.material = Shaders().material2;
            child.material.visible = false;

            child.castShadow = true;
            break;
        }
        // if (child.name==="Retopo_心脏_"){
        //   childMesh=child
        // }
      }
    } catch (e) {
      console.log('error:', e)
      console.error('设置色彩出错, child:', child)
    }
  }


  /**
   * 添加粒子运动
   *
   * */

  useEffect(() => {
    initModel();

  }, [])


  /**
   *
   * 更改选中的模型的透明度，或者是全部
   * */

  return (
    <div>
      <Button onClick={() => {
        // action.reset();
        action.stop();

      }}>暂停动画</Button>
      <div className={styles.output} id="webgl-output">
        <Button id={"testAnt"} type="primary" style={{display: "none", position: "absolute"}}>测试antdesign</Button>

      </div>

    </div>
  )
}

export default Three3D;
