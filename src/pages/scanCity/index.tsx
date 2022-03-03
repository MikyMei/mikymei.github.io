/**

 * @author MikyMei

 * @date 2021-12-09 16:57

 */


import React, {useEffect, useState} from 'react';

import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';


import * as THREE from "three";
import * as TWEEN from '@tweenjs/tween.js';

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

import {
  FBXLoader
} from 'three/examples/jsm/loaders/FBXLoader.js'
import styles from './index.less';
import CityClass from './city/city.js';
import Utils from "@/pages/scanCity/utils";
import Effects from "@/pages/scanCity/utils/effect";
import Shader from "@/pages/scanCity/utils/shader";
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {ShaderPass} from 'three/examples/jsm/postprocessing/ShaderPass.js';


/**
 * 扫光
 * */



const ScanCity: React.FC = () => {


  let scene: any;
  let camera: any;
  let renderer: any;
  let clock: any;
  let mainCanvas: any;
  let spotLight: any;
  let ambient: any;
  let point: any;
  let plane: any;
  let controls: any;
  let city: any;
  let model: any;
  let surroundLineMaterial: any = null;
  let effectGroup: any;
  let group: any;
  let bodyMaterial: any;
  let SweepingLightShader: any;
  let composer: any;
  let BodyShader: any;
  let type = 'add';
  let addTimer = true;
  const objects: any=[];


  let time = {
    value: 0
  };
  let StartTime = {
    value: 0
  };
  let isStart = false;
  const loader = new GLTFLoader();


  /**
   * 光纤
   * */

  const lineCounts = 20;
  let trailList: any = [lineCounts];
  let pointsIndex = 0;

  let pointsMaterial: any, pointsMesh: any, pointsGeoemtry: any;

  let clickX: 0;
  let clickY: 0;
  let lightProbe;
  let trackLineList: any[] = [];
  let trackPointsList: any[] = [];
  let trackCurveList: any[] = [];
  const PI2 = Math.PI * 2; // 弧度的取值为0-2π
  let timer = -PI2;
  let groupLines: any;

  let AMOUNTX: any = 30;
  let AMOUNTY: any = 70;
  let count = 0;
  let particles: any[] = new Array();


  const initModel = () => {


    clock = new THREE.Clock();

    // 获得渲染器长度
    mainCanvas = document.getElementById("webgl-output");

    const textureLoader = new THREE.TextureLoader();
    scene = new THREE.Scene();
    /**
     *  只是将图片作为北京图片贴了上去，并没有实现3d效果，尤其是在进行旋转的时候感觉尤为明显
     *  */

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(new THREE.Color('#403f3f'));
    // renderer.setSize(window.innerWidth, mainCanvas.offsetHeight);
    renderer.setSize(mainCanvas.offsetWidth,  window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.alpha = true;

    let axes = new THREE.AxesHelper();
    // scene.add(axes);

    // 创建聚光灯
    spotLight = new THREE.SpotLight(0xFFFFFF);
    spotLight.position.set(30, 30, 0);
    spotLight.castShadow = true;
    spotLight.angle = Math.PI / 7;
    spotLight.shadow.penumbra = 0.05;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    // scene.add(spotLight);

    ambient = new THREE.AmbientLight(0xFFFFFF);
    scene.add(ambient);

    point = new THREE.PointLight('#ffffff');
    point.position.set(400, 200, 300);
    // scene.add(point);


    camera = new THREE.PerspectiveCamera(45, mainCanvas.offsetWidth / window.innerHeight, 0.1, 10000)
    // camera = new THREE.PerspectiveCamera(45, mainCanvas.offsetWidth / mainCanvas.offsetHeight, 0.1, 10000)
    camera.position.set(0, 10, 40)
    camera.lookAt(0, 10, 0);

    // @ts-ignore
    window.document.getElementById('webgl-output').appendChild(renderer.domElement);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    window.addEventListener('resize', onWindowResize);

    /**
     * 加载gltlf模型，并为设置材质
     * */
    group = new THREE.Group();
    // effectGroup = new THREE.Group();
    // group.add(effectGroup);

    loader.load('./img/111.gltf', async function (gltf) {
        model = gltf.scene;
        model.scale.setScalar(80, 80, 80);
        model.position.setY(-10);

        /**
         * beIntersectObjects是用来存放需要射线检测的物体数组。
         * transformControl可以方便调节物体位置大小。
         * */

        // model.scale.copy(model.children[0].scale);


        CreateSphere();
        scene.add(model);
        model.traverse(
          processGLTFChild
        );


        // await surroundLine(model.children[0]);
        bodyMaterial = model.children[0];


        // const animations = gltf.animations;
        let mixer = new THREE.AnimationMixer(model);
      },
      undefined

      , function (error) {

        console.error(error);

      });

    // composer.addPass(new RenderPass(scene, camera));


    /**
     * 线group
     * */
    groupLines = new THREE.Group();
    scene.add(groupLines);

    render();

    document.getElementById('webgl-output').addEventListener('click', (event) => clickMesh(event));


    setTimeout(() => {
      isStart = true;


    }, 200)


  }


  /**
   * 创建粒子
   * */
  const CreateSphere = () => {
    // 创建球体
    let geometry = new THREE.SphereBufferGeometry(0.05, 10, 10);
    // console.log(geometry);
    // geometry.position.set(0,-10,0)


    /**
     * 动态设置渐变颜色
     * 计算点到点的距离来动态设置
     * */



    let i = 0;
    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {

        const pointsColor=new THREE.Color();

        const x = ix * 10 - (AMOUNTX * 10) / 2;
        const y = iy * 10 - AMOUNTX * 10;
        const z = ix * 10 - (AMOUNTX * 10) / 2;


        // pointsColor.setRGB( (7+vx*200)/255, (186+vy*50)/255,(151+vz*100)/255 ,);
        // console.log(pointsColor);


        let material = new THREE.PointsMaterial({
          color: "#ffffff",
          size: 1,
          opacity: 1,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthTest: true,
        });
        // 创建球体实例 并且摆放位置
        let particle = new THREE.Mesh(geometry, material);
        particles.push(particle);

        particle.position.x = x;
        particle.position.y = y;
        particle.position.z = z;



        group.add(particle);
      }
    }

    scene.add(group);
  };

  const BallMotionAlgorithm = () => {
    // 这里就是小球波动的算法了
    const  originPosition = new THREE.Vector3( 0, -10, 0 );

    let i = 0;
    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        let particle = particles[i++];
        if (particle) {
          // 总是搞混这里的Math.sin()是js自带的 不是three.js里的 那里的只是补充
          particle.position.x =
            Math.cos(iy + count * 0.1) * Math.sin(iy + ix + count * 0.1) * 10;
          particle.position.y =
            -12;
          particle.position.z =
            Math.cos(ix + count * 0.1) * Math.sin(iy + count * 0.1) * 10;

          // 放大缩小 这样才有海浪那个远近感
          particle.scale.x = particle.scale.x =
            (Math.sin((ix + count) * 0.1) + 1) * 1 +
            (Math.cos((iy + count) * 0.2) + 1) * 1 * 0.5;


          /**
           * 动态设置
           * */
          const distance=particle.position.distanceTo(originPosition);
          if (distance>11){
            console.log(distance);
          }


          particle.material.color.setRGB((distance*23)/255, 1,208/255)

          particle.rotateY(-0.02)
        }
      }
    }
    renderer.render(scene, camera);
  };

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
          time: time,
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
            value: new THREE.Color('#003300'),
          },
          uDiffusion: {
            value: new THREE.Vector3(
              1, // 0 1开关
              4, // 范围
              8, // 速度
            ),
          },

          uColor: {
            value: new THREE.Color('#fffa89'),
          },
          uOpacity: {
            value: 1,
          },
          uRadius: {
            value: radius,
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
          if (uDiffusion.x > 0.5) {
              // 扩散速度
              float dTime = mod(time * uDiffusion.z, uRadius * 2.0);
              // 当前的离中心点距离
              float uLen = distanceTo(position2D, vec2(uCenter.x, uCenter.z));
              // 扩散范围
              if (uLen < dTime && uLen > dTime - uDiffusion.y) {
                  // 颜色渐变
                  float dIndex = sin((dTime - uLen) / uDiffusion.y );
                  distColor = mix(uColor, distColor, dIndex);
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
      });
    });
    return {materialBody};
  };


  const onWindowResize = () => {

    // camera.aspect = window.innerWidth/ mainCanvas.offsetHeight;
    camera.aspect = mainCanvas.offsetWidth /  window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(mainCanvas.offsetWidth, window.innerHeight);
    // renderer.setSize(window.innerWidth, mainCanvas.offsetHeight);

  }


  const render = () => {

    animate();
    const loopTime = 10 * 1000;
    const changeTime = Date.now();
    const t = (changeTime * 6 % loopTime) / loopTime; // 计算当前时间进度百分比
    pointsIndex = (pointsIndex + 1) % lineCounts;


    if (controls&&TWEEN){
      controls.update();
      TWEEN.update();
    }

    if (group.children.length>0){
      group.rotateY(-0.02)
    }




    window.requestAnimationFrame(render);


  }

  const changePointPosition = (t: any) => {
    /**
     * 对每个小球的位置进行改变，其中，速度是同的，方向也是不同的
     * 40个点分别在20个轨道上，随机生成他们的位置（所在的百分比和方向）
     * */


    trackPointsList.map(async (trackPoint: any, index: any) => {
      const position = trackCurveList[Math.floor(index / 2)].getPointAt(index % 2 === 0 ? t : 1 - t);
      await trackPoint.position.copy(position);


    })


  }


  // 着色器渲染
  const Shaders = () => {
    let vertexShader = [
      'varying vec3	vVertexWorldPosition;',
      'varying vec3	vVertexNormal;',
      'varying vec4	vFragColor;',
      'void main(){',
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

    let material1 = new THREE.ShaderMaterial({
      uniforms: AeroSphere.uniforms,
      vertexShader: AeroSphere.vertexShader,
      fragmentShader: AeroSphere.fragmentShader,
      blending: THREE.NormalBlending,
      transparent: true,
      depthWrite: false,
      visible: true,

    });
    let material2 = new THREE.ShaderMaterial({
      uniforms: AeroSphere1.uniforms,
      vertexShader: AeroSphere1.vertexShader,
      fragmentShader: AeroSphere1.fragmentShader,
      blending: THREE.NormalBlending,
      transparent: true,
      depthWrite: false,
      visible: true,

    });
    let material3 = new THREE.ShaderMaterial({
      uniforms: AeroSphere3.uniforms,
      vertexShader: AeroSphere3.vertexShader,
      fragmentShader: AeroSphere3.fragmentShader,
      blending: THREE.NormalBlending,
      transparent: true,
      depthWrite: false,
      visible: true,

    });
    return {material1, material2, material3}
  }

  const processGLTFChild = (child: any) => {

    try {
      if (child.isMesh) {

        objects.push(child)
        // 有的child.material 类型是 Array, 有的是 Object
        switch (child.name) {
          case "Body001":
            child.material = setCityMaterial(child).materialBody;
            child.castShadow = true;

            break;
          case "Skeletal":
            child.material = Shaders().material2;
            child.castShadow = true;
            break;
          case "Circulatory_Heart":
            child.material = Shaders().material3;
            child.castShadow = true

            break;
          default:
            break;
        }
      }
    } catch (e) {
      console.log('error:', e)
      console.error('设置色彩出错, child:', child)
    }
  }


  // @ts-ignore
  // eslint-disable-next-line consistent-return
  const animate = () => {


    const dt = clock.getDelta();


    if (dt > 1) return false;
    if (time.value >= 2.6 || addTimer === true) {
      time.value -= dt;
      if (time.value <= 0.0) {
        addTimer = false
      }
    } else if (time.value <= 0.0 || addTimer === false) {
      time.value += dt;
      if (time.value >= 2.6) {
        addTimer = true
      }
    }
    if (isStart) {
      StartTime.value += dt * 0.6;
      if (StartTime.value >= 1) {
        StartTime.value = 1;
        isStart = false;
      }
    }
    ;

    timer += 0.02;
    if (timer > Math.PI * 0.7) {
      timer = -Math.PI * 0.7;
    }


    changePointPosition(Math.abs((timer % Math.PI) / Math.PI));

    // console.log(timer, );
    groupLines.children.forEach(function (item: any, index: any) {
      // setTimeout(()=>{
      item.material.uniforms.time.value = timer;

      // },100)

    });

    count += 0.03;
    BallMotionAlgorithm();


  }

  /**
   * 生成绕轨迹运动的小球
   *
   * */

  const addCube = (pos: any) => {

    const geometry = new THREE.BoxBufferGeometry(0.1, 0.1, 0.1);
    const material = new THREE.MeshBasicMaterial({color: 0xCCFF99, transparent: true, opacity: 0});
    const cube = new THREE.Mesh(geometry, material);
    cube.position.copy(pos)
    cube.castShadow = false;
    // scene.add(cube);
    return cube
  }

  /**
   *
   * 先随机生成狠多轨道，
   * 在生成带拖尾的粒子而且粒子放到对应的轨道上，方向应该是交替相反的，然后是递加
   * */
  const generateLinelist = () => {

    // 随机生成line并增加在scene

    const changePost = [
      {x: 0, z: 3},
      // {x:1.5, z:1.5},
      {x: 3, z: 0},
      // {x:1.5, z:-1.5},
      {x: 0, z: -3},
      // {x:-1.5, z:-1.5},
      {x: -3, z: 0},
      // {x:-1.5, z:1.5},
    ]


    /**
     *
     * 定义需要自下而上的数量
     * */

    const upCounts = lineCounts - 1 - 4;

    let poinTList: any = [];
    for (let i = 0; i < lineCounts; i++) {
      const initialPoints: any;
       if (i >= upCounts) {
        initialPoints = [
          {y: -10, ...changePost[(i - upCounts + 0) % changePost.length]},
          {y: -3, ...changePost[(i - upCounts + 1) % changePost.length]},
          {y: 2, ...changePost[(i - upCounts + 2) % changePost.length]},
          {y: 5, ...changePost[(i - upCounts + 3) % changePost.length]},
        ];
      } else {
        initialPoints = [
          {x: (-3 - i / 3) / 2, y: Math.floor((i - 12) / 2), z: -5 / 2},
          {x: (-3 - i / 3) / 2, y: Math.floor((i - 12) / 2), z: 3 / 2},
          {x: (0), y: Math.floor((i - 12) / 2), z: 3 / 2},
          {x: (3 + i / 3) / 2, y: Math.floor((i - 12) / 2), z: 3 / 2},
          {x: (3 + i / 3) / 2, y: Math.floor((i - 12) / 2), z: -5 / 2},
        ];
      }

      poinTList.push(initialPoints);
    }
    ;


    poinTList.map(point => {

      const cubeList = point.map(p => {
        return addCube(p);
      })


      const curve = new THREE.CatmullRomCurve3(
        cubeList.map((cube: any) => cube.position), // 直接绑定方块的position以便后续用方块调整曲线
        {closed: point.length > 4 ? true : false,}
      );
      /*
      * centripetal、chordal和catmullrom。
      *
      * */
      curve.curveType = 'centripetal'; // 曲线类型
      curve.closed = point.length > 4 ? true : false; // 曲线是否闭合
      curve.castShadow = true; // 曲线是否闭合


      const points = curve.getPoints(200); // 50等分获取曲线点数组

      /**
       * 随机的实现方向
       * */


      let randomDir: any;
      if (point.length >= 5) {
        randomDir = Math.random() > 0.5;
      } else {
        randomDir = true
      }

      // const randomDir = Math.random() > 0.5;

      const lineMaterial = randomDir ? createLineMaterial(cubeList[0].position, cubeList[cubeList.length - 1].position) : createLineMaterial(cubeList[cubeList.length - 1].position, cubeList[0].position);
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(points),
        lineMaterial,
      ); // 绘制实体线条，仅用于示意曲线，后面的向量线条同理，相关代码就省略了


      line.castShadow = false;
      line.className = "lineTrack";

      groupLines.add(line);
      trackCurveList.push(curve);
      trackLineList.push(line);
    })


    generatePointlist();


  }

  const generatePointlist = () => {


    /**
     * 放弃使用points，因为他们生成的是一个整体，目前没能单独控制每个粒子
     *
     * */


    /**
     *
     * 使用几何体代替粒子效果
     * */
    for (let i = 0; i < lineCounts * 2; i++) {

      const position = trackCurveList[Math.floor(i / 2)].getPointAt(Math.random());
      const geometry = new THREE.SphereGeometry(0.05, 32, 16);


      const material = new THREE.MeshBasicMaterial({color: '#ffff00', opacity: 0.1});
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.copy(position);
      // scene.add(sphere);
      trackPointsList.push(sphere);
    }

  }

  /**
   * 创建发光材质，主要用于线自发光
   * */

  const createLightMaterial = () => {
    let canvasDom = document.createElement('canvas');
    canvasDom.width = 16;
    canvasDom.height = 16;
    let ctx = canvasDom.getContext('2d');
    // 根据参数确定两个圆的坐标，绘制放射性渐变的方法，一个圆在里面，一个圆在外面
    let gradient = ctx.createRadialGradient(
      canvasDom.width / 2,
      canvasDom.height / 2,
      0,
      canvasDom.width / 2,
      canvasDom.height / 2,
      canvasDom.width / 2);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.005, 'rgba(139,69,19,1)');
    gradient.addColorStop(0.4, 'rgba(139,69,19,1)');

    gradient.addColorStop(1, 'rgba(0,0,0,1)');
    // 设置ctx为渐变色
    ctx.fillStyle = gradient;
    // 绘图
    ctx.fillRect(0, 0, canvasDom.width, canvasDom.height);

    // 贴图使用
    let texture = new THREE.Texture(canvasDom);
    texture.needsUpdate = true;// 使用贴图时进行更新
    return texture;


  }

  // 可以随机的设置他们的起始点来实现
  const createLineMaterial = (myPos: any, targetPos: any) => {
    const vertexShader = ` varying vec3 vPosition;
    varying vec4 vColor;
    void main() {
        vPosition = position;
        vColor = vec4(color, 1);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`;
    const fragmentShader = `uniform vec3 targetPos; // 目标位置
    uniform float vLength;  // 距离
    varying vec3 vPosition;
    uniform float time;
    uniform vec3 color;
    varying vec4 vColor;
    void main() {
        float dist = distance(vPosition, targetPos);

        vec4 color = vec4(vec3(color),1);
        float p = dist/vLength * 2.0 + time * 1.0;


        if (p < 3.1415926/2.0){
            p = 0.0;
        }
        if (p > 3.1415926*2.0){
            p = 0.0;
        }

        float a = sin(p);
        color.a = a;

        gl_FragColor = color;
    }`

    let uniforms = {
      targetPos: {
        value: targetPos
      },
      vLength: {
        value: myPos.distanceTo(targetPos)
      },
      time: {
        value: timer
      },
      color: {
        value: new THREE.Color("#4ff6ca")
      }
    };

    let material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      vertexColors: THREE.VertexColors,

    });

    return material;
  }


  // 第一次点击模型执行缓冲动画
  const initTween = (cube: any) => {
    // let position = { x: 0, y: 0, z: 0 }; // 起始点
     new TWEEN.Tween(camera.position)
      .to({ x: cube.point.x, y: cube.point.y, z: 1 }, 3000) // 在1s内移动至 (0, 0)
      .easing(TWEEN.Easing.Quadratic.InOut) // 使用缓动功能使的动画更加平滑
      .onUpdate(() => {
        // 在 tween.js 更新 'position' 后调用
        // 移动到 'position' 所描述的位置，配合 CSS 过渡
        // window.scrollTo(cube.position.x, cube.position.y)
        scene.position.x = cube.point.x;
        scene.position.y = -cube.point.y * 2;
        scene.position.z = cube.point.z * 1;
        camera.updateMatrixWorld();
      })
      .start(); // 执行tween
    camera.lookAt(camera.position);
  };

  /**
   * 实现点击功能
   * */
  const clickMesh=(mouseEvent: any)=>{





    const x = ((mouseEvent.clientX - mainCanvas.getBoundingClientRect().left) / mainCanvas.offsetWidth) * 2 - 1;
    const y = -((mouseEvent.clientY - mainCanvas.getBoundingClientRect().top) / window.innerHeight) * 2 + 1;


    const x1 = ( mouseEvent.clientX / window.innerWidth ) * 2 - 1;
    const y1 = - ( mouseEvent.clientY / window.innerHeight ) * 2 + 1;


    console.log("屏幕点击位置:", mouseEvent.clientX, mouseEvent.clientY);
    console.log("屏幕点击位置转化为世界坐标(以maincanvs):",x,y);
    console.log("屏幕点击位置转化为世界坐标(以window):",x1,y1);

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

    const Arr: any = objects;
    const duration = 2000;

    const intersects = raycaster.intersectObjects(Arr, true);
    console.log("点击选中的网格模型",intersects);

    // 将相机位置进行改变调用补间动画

    if(intersects.length>0){
      intersects[0].object.geometry.computeBoundingBox();
      console.log(intersects[0]);

      const cube=intersects[0];

      new TWEEN.Tween(camera.position)
        .to({ x: cube.point.x, y: cube.point.y, z: 10 }, 3000) // 在1s内移动至 (0, 0)
        .easing(TWEEN.Easing.Quadratic.InOut) // 使用缓动功能使的动画更加平滑
        .onUpdate(() => {
          // 在 tween.js 更新 'position' 后调用
          // 移动到 'position' 所描述的位置，配合 CSS 过渡
          // window.scrollTo(cube.position.x, cube.position.y)
          scene.position.x = cube.point.x;
          scene.position.y = -cube.point.y ;
          scene.position.z =-10;
          camera.updateMatrixWorld();
        })
        .start(); // 执行tween
      camera.lookAt(camera.position);


    }


  }


  useEffect(async (): void => {
    await initModel();
    await generateLinelist();
  })
  return (
    <div>
      <div className={styles.output} id="webgl-output"></div>

    </div>
  )
}


export default ScanCity;
