/**

 * @author MikyMei

 * @date 2021-11-23 15:12

 */

import React, {useEffect, useState} from "react"
import {Checkbox, Button} from 'antd';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

import Stats from 'three/examples/jsm/libs/stats.module.js';
// import GUI from 'three/examples/jsm/libs/dat.gui.module.js';
import {GUI} from 'three/examples/jsm/libs/dat.gui.module.js';


import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {TransformControls} from 'three/examples/jsm/controls/TransformControls.js'; // 引入模块
import {SkeletonHelper} from 'three/src/helpers/SkeletonHelper.js';
import {tag, labelRenderer} from '@/utils/css2drander';
import Card from '@/utils/card';
import {
  RollerCoasterGeometry,
  RollerCoasterShadowGeometry,
  RollerCoasterLiftersGeometry,
  TreesGeometry,
  SkyGeometry
} from 'three/examples/jsm/misc/RollerCoaster.js';


const IndexPage: React.FC = () => {


  const params = {
    exposure: 0,
    bloomStrength: 0,
    bloomThreshold: 0,
    bloomRadius: 0
  };
  /**
   * 定义3D场景相关的参数，场景相机渲染器，
   * 模型相关，模型，骨骼，
   * */
  let scene: any;
  let renderer: any;
  let camera: any;
  let stats: any;
  let model: any;
  let skeleton: any;
  let mixer: any;
  let clock: any;
  let point: any;
  let prePositionY: any; // 记录之前的y轴，如果大于就向下看，小于就像上看

  let curve: any;
  let controls: any;

  /**
   * 主要用作道路模型
   * */

  let roadMesh: any;
  let roadMaterial: any;
  let roadGeometry: any;
  let roadLifterMesh: any;
  let roadLifterMaterial: any;
  let roadLifterGeometry: any;
  let roadShadowMesh: any;
  let roadShadowMaterial: any;
  let roadShadowGeometry: any;

  const crossFadeControls: any = [];

  const mouse = new THREE.Vector2();


  /**
   * 定义动作相关
   * */
  let idleAction: any;
  let walkAction: any;
  let runAction: any;
  let nowAction: any;
  let idleWeight: any;
  let walkWeight: any;
  let runWeight: any;
  let spotLight: any;

  let line1: any;
  let line2: any;
  let line: any;
  let matLine: any;
  let matLineBasic: any;
  let matLineDashed: any;

  let actions: any;
  let settings: any;
  let cubeList: any;

  let singleStepMode = false;
  let sizeOfNextStep = 0;
  let container: any;
  let loopTime = 10 * 1000;
  let time;


  /**
   * 创建相关初始化
   * */
  const initThree = () => {

    const ua = (navigator.userAgent || navigator.vendor || window.opera).toLowerCase();


    // 识别设备
    const lll = /(iPad|iPhone|Android)/i.test(ua) ? ' is-mobile' : ' is-desktop';


    container = document.getElementById('container');

    camera = new THREE.PerspectiveCamera(45, container.offsetWidth / window.innerHeight, 1, 1000);
    camera.position.set(1, 3, -10);
    camera.lookAt(0, 1, 0);

    clock = new THREE.Clock();

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xa0a0a0);
    scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemiLight.position.set(0, 20, 0);
    // scene.add(hemiLight);

    const axes = new THREE.AxesHelper(20);
    scene.add(axes);



    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(-3, 5, -10);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 80;
    dirLight.shadow.camera.bottom = -20;
    dirLight.shadow.camera.left = -80;
    dirLight.shadow.camera.right = 25;
    // dirLight.shadow.camera.near = 0.1;
    // dirLight.shadow.camera.far = 4;
    dirLight.shadow.mapSize.width = 30000;
    dirLight.shadow.mapSize.height = 36000;
    scene.add(dirLight);


    /**
     * ground(地面)
     * */

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshPhongMaterial({
      color: 0x999999,
      depthWrite: false
    }));
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    scene.add(mesh);



    /**
     * 船舰聚光灯
     * */

    // 创建聚光灯
    spotLight = new THREE.SpotLight('rgb(242, 242, 242)');
    spotLight.position.set(3, 3, -3);
    spotLight.castShadow = true;
    spotLight.angle = Math.PI / 8;
    // spotLight.shadow.penumbra = 0.05;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    scene.add(spotLight);


    /**
     * 点光源
     * */

    point = new THREE.PointLight(0xffffff);
    point.position.set(400, 200, 300); // 点光源位置
    scene.add(point);
    /**
     * 加载模型
     * */

    const loader = new GLTFLoader();
    loader.load('./img/Soldier.glb', function (gltf: any) {

      console.log(gltf);

      model = gltf.scene;
      scene.add(model);
      console.log(model);

      /**
       * 遍历模型的child
       * */
      model.traverse(function (object: any) {
        if (object.isMesh) {

          object.castShadow = true;
        }
      })


      /**
       * 是否展示骨骼
       * */
      skeleton = new THREE.SkeletonHelper(model);
      skeleton.visiable = false;
      scene.add(skeleton);


      createPanel();

      /**
       * 配置setting
       *
       * */



      const {animations} = gltf;

      mixer = new THREE.AnimationMixer(model);


      idleAction = mixer.clipAction(animations[0]);
      walkAction = mixer.clipAction(animations[3]);
      runAction = mixer.clipAction(animations[1]);
      nowAction = mixer.clipAction(animations[2]);
      console.log("动画", idleAction);

      actions = [idleAction, walkAction, runAction, nowAction];


      activateAllActions();

      animate();
      const control = new OrbitControls(camera, renderer.domElement);
      // control.update();
      // control.addEventListener( 'change', ()=>animate() );


      controls = new TransformControls(camera, renderer.domElement);
      // controls.addEventListener( 'change', animate );

      renderer.domElement.addEventListener(
        'click',
        (event: any) => {
          dragCube(event);

        },
        false
      );


    });



    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.offsetWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // stats = new Stats();
    // container.appendChild(stats.dom);


    /**
     * 创建一条曲线，作为模型的运动轨迹
     * */


    /**
     * 当屏幕发生变化的时候调用的
     * */

    window.addEventListener('resize', onWindowResize);

  }


  function Shaders() {
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
      extends: THREE.MeshBasicMaterial,
      uniforms: AeroSphere3.uniforms,
      vertexShader: AeroSphere3.vertexShader,
      fragmentShader: AeroSphere3.fragmentShader,
      blending: THREE.NormalBlending,
      transparent: true,
      depthWrite: true,
    });

    // const myMaterial = new THREE.MeshStandardMaterial({
    //   uniforms: AeroSphere3.uniforms,
    //   onBeforeC
    // })
    return {material1, material2, material3}
  }


  /**
   * 绘制运动轨迹并实现物体按照轨迹移动，让相机也跟着在模型后面的几个点位移动
   * */

  const drawLine = () => {
    const initialPoints = [
      {x: 5, y: 2, z: -3},
      {x: 5, y: 1, z: 5},
      {x: -5, y: 1, z: 5},
      {x: -5, y: 1, z: -3}
    ];


    const addCube = (pos: any) => {

      const geometry = new THREE.BoxBufferGeometry(0.1, 0.1, 0.1);
      const material = new THREE.MeshBasicMaterial(0xCCFF99);
      const cube = new THREE.Mesh(geometry, material);
      cube.position.copy(pos)
      cube.castShadow = true;
      scene.add(cube);
      return cube
    }

    cubeList = initialPoints.map(p => {
      return addCube(p);
    })


    curve = new THREE.CatmullRomCurve3(
      cubeList.map((cube: any) => cube.position) // 直接绑定方块的position以便后续用方块调整曲线
    );
    curve.curveType = 'chordal'; // 曲线类型
    curve.closed = true; // 曲线是否闭合
    curve.castShadow = true; // 曲线是否闭合


    const points = curve.getPoints(50); // 50等分获取曲线点数组
    line = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(points),
      new THREE.LineBasicMaterial({
        color: 0x00ff00,
        opacity:0.0,
        // linewidth:1
      })
    ); // 绘制实体线条，仅用于示意曲线，后面的向量线条同理，相关代码就省略了


    line.castShadow = true;
    scene.add(line);
    addRoad();


  }

  /**
   * 运动相关， 改变模型的运动轨迹
   * */
  const changePosition = (t: any, t2: any) => {
    const position = curve.getPointAt(1 - t); // 当前点在线条上的位置的百分比，后面计算
    model.position.copy(position);

    // console.log("相对百分比",Math.abs(1- t2));
    const position2 = curve.getPointAt(Math.abs(1 - t2));
    const newPosition = position2.add(new THREE.Vector3(2, 5, 1))
    // camera.position.copy(newPosition);


  }

  /**
   * 获得当前位置的切线，作为物体的朝向和相机的朝向
   * */

  const changeLookAt = (t: any) => {
    const tangent = curve.getTangentAt(1 - t);
    const lookAtVec = tangent.add(model.position);

    model.lookAt(lookAtVec);
    // if (prePositionY<=lookAtVec.y){
    //   model.lookAt(new THREE.Vector3(lookAtVec.x, lookAtVec.y-0.05, lookAtVec.z));
    // }else{
    //   model.lookAt(new THREE.Vector3(lookAtVec.x, lookAtVec.y+0.15, lookAtVec.z));
    // }

    // prePositionY=lookAtVec.y;

    camera.lookAt(lookAtVec.add(new THREE.Vector3(0, 1, 0)));
  }


  /**
   * 实现曲线位置修改功能，通过更改四个位置的方式
   * */





  /**
   * 渲染
   * */

  const animate = () => {
    // 让模型移动

     time = Date.now();
    const t = (time % loopTime) / loopTime; // 计算当前时间进度百分比
    const t2 = ((time - 1000) % loopTime) / loopTime;

    changePosition(t, t2);
    changeLookAt(t);


    // Render loop

    requestAnimationFrame(animate);

    idleWeight = idleAction.getEffectiveWeight();
    walkWeight = walkAction.getEffectiveWeight();
    runWeight = runAction.getEffectiveWeight();

    // Update the panel values if weights are modified from "outside" (by crossfadings)

    updateWeightSliders();

    // Enable/disable crossfade controls according to current weight values

    // updateCrossFadeControls();

    // Get the time elapsed since the last frame, used for mixer update (if not in single step mode)

    let mixerUpdateDelta = clock.getDelta();

    // If in single step mode, make one step and then do nothing (until the user clicks again)

    if (singleStepMode) {

      mixerUpdateDelta = sizeOfNextStep;
      sizeOfNextStep = 0;

    }

    // Update the animation mixer, the stats panel, and render this frame

    mixer.update(mixerUpdateDelta);

    // stats.update();

    renderer.render(scene, camera);


  }

  /**
   * 实现拖拽方块
   * */

  const dragCube = (event: any) => {

    mouse.x = ((event.clientX - container.getBoundingClientRect().left) / container.offsetWidth) * 2 - 1;
    mouse.y = -((event.clientY - container.getBoundingClientRect().top) / container.offsetHeight) * 2 + 1;
    // mouse.x = (event.clientX / container.offsetWidth) * 2 - 1;
    // mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    // 方块点击检测
    const rayCaster = new THREE.Raycaster();

    rayCaster.setFromCamera(mouse, camera);
    const intersects = rayCaster.intersectObjects(cubeList);
    // console.log(" 点击",intersects, cubeList);
    if (intersects.length) {
      const target = intersects[0].object;
      controls.attach(target); // 绑定controls和方块
      scene.add(controls);
    }

    // // 修改曲线后同步修改实体线条
    controls.addEventListener('dragging-changed', (event: any) => {
      if (!event.value) {
        const points = curve.getPoints(50);
        line.geometry.setFromPoints(points);
        roadMesh.geometry.setFromPoints(points);
        // roadMesh.geometry.setCurve(curve);

        // 重新画线
        roadGeometry = new RollerCoasterGeometry(curve, 1500);
        roadMesh = new THREE.Mesh(roadGeometry, roadMaterial);
        roadMesh.castShadow = true;
        roadMesh.receiveShadow = true;
        scene.add(roadMesh);


        roadLifterMesh.geometry.setFromPoints(points);
        roadLifterGeometry = new RollerCoasterLiftersGeometry(curve, 100);
        roadLifterMesh = new THREE.Mesh(roadLifterGeometry, roadLifterMaterial);
        roadLifterMesh.castShadow = true;
        roadLifterMesh.receiveShadow = true;

        roadLifterMesh.position.y = 0.1;
        scene.add(roadLifterMesh);


        roadShadowMesh.geometry.setFromPoints(points);
        roadShadowGeometry = new RollerCoasterShadowGeometry(curve, 100);
        roadShadowMesh = new THREE.Mesh(roadShadowGeometry, roadShadowMaterial);
        roadShadowMesh.castShadow = true;
        roadShadowMesh.receiveShadow = true;

        roadShadowMesh.position.y = 0.1;
        scene.add(roadShadowMesh);
      }
    });
    // addRoad();
  }


  /**
   * 在轨迹表面添加道路模型
   * */

  const addRoad = () => {
    // 轨道分段数

    roadGeometry = new RollerCoasterGeometry(curve, 1500);

    roadMaterial = new THREE.MeshPhongMaterial({
      vertexColors: true
    });
    roadMesh = new THREE.Mesh(roadGeometry, roadMaterial);
    roadMesh.castShadow = true;
    roadMesh.receiveShadow = true;
    scene.add(roadMesh);

    roadLifterGeometry = new RollerCoasterLiftersGeometry(curve, 100);
    roadLifterMaterial = new THREE.MeshPhongMaterial();
    roadLifterMesh = new THREE.Mesh(roadLifterGeometry, roadLifterMaterial);
    roadLifterMesh.castShadow = true;
    roadLifterMesh.receiveShadow = true;

    roadLifterMesh.position.y = 0.1;
    scene.add(roadLifterMesh);


    roadShadowGeometry = new RollerCoasterShadowGeometry(curve, 500);
    roadShadowMaterial = new THREE.MeshBasicMaterial({
      color: 0x305000, depthWrite: false, transparent: true
    });
    roadShadowMesh = new THREE.Mesh(roadShadowGeometry, roadShadowMaterial);
    roadLifterMesh.castShadow = true;
    roadLifterMesh.receiveShadow = true;
    roadShadowMesh.position.y = 0.1;
    scene.add(roadShadowMesh);
  }


  /**
   *
   * */

    const createPanel = () => {
      const panel = new GUI({width: 310});

      const folder1 = panel.addFolder('Visibility');
      const folder2 = panel.addFolder('Activation/Deactivation');
      const folder3 = panel.addFolder('Pausing/Stepping');
      const folder4 = panel.addFolder('Crossfading');
      const folder5 = panel.addFolder('Blend Weights');
      const folder6 = panel.addFolder('General Speed');


    settings = {
        'show model': true,
        'show skeleton': false,
        'deactivate all': deactivateAllActions,
        'activate all': activateAllActions,
        'pause/continue': pauseContinue,
        'make single step': toSingleStepMode,
        'modify step size': 0.05,
        'from walk to idle': function () {
          prepareCrossFade(walkAction, idleAction, 1.0);
        },
        'from idle to walk': function () {
          prepareCrossFade(idleAction, walkAction, 0.5);

        },
        'from walk to run': function () {
          prepareCrossFade(walkAction, runAction, 2.5);

        },
        'from run to walk': function () {
          prepareCrossFade(runAction, walkAction, 5.0);
        },
        'use default duration': true,
        'set custom duration': 3.5,
        'modify idle weight': 0.0,
        'modify walk weight': 0.0,
        'modify run weight': 1.0,
        'modify time scale': 1.0

      }

      folder1.add(settings, 'show model').onChange(showModel);
      folder1.add(settings, 'show skeleton').onChange(showSkeleton);
      folder2.add(settings, 'deactivate all');
      folder2.add(settings, 'activate all');
      folder3.add(settings, 'pause/continue');
      folder3.add(settings, 'make single step');
      folder3.add(settings, 'modify step size', 0.01, 0.1, 0.001);
      crossFadeControls.push(folder4.add(settings, 'from walk to idle'));
      crossFadeControls.push(folder4.add(settings, 'from idle to walk'));
      crossFadeControls.push(folder4.add(settings, 'from walk to run'));
      crossFadeControls.push(folder4.add(settings, 'from run to walk'));
      folder4.add(settings, 'use default duration');
      folder4.add(settings, 'set custom duration', 0, 10, 0.01);
      folder5.add(settings, 'modify idle weight', 0.0, 1.0, 0.01).listen().onChange(function (weight: any) {
        setWeight(idleAction, weight)
      });
      folder5.add(settings, 'modify walk weight', 0.0, 1.0, 0.01).listen().onChange(function (weight: any) {
        if (weight===0){
          loopTime=Date.now();
        }else{
          loopTime=(2.5-weight+0.0001)*10*1000
        }
        setWeight(walkAction, weight);
      });
      folder5.add(settings, 'modify run weight', 0.0, 1.0, 0.01).listen().onChange(function (weight: any) {

        if (weight===0){
          loopTime=Date.now();
        }else{
          loopTime=(2-weight+0.0001)*10*1000
        }
        //
        setWeight(runAction, weight);
      });
      folder6.add(settings, 'modify time scale', 0.0, 1.5, 0.01).onChange(modifyTimeScale);
      folder1.open();
      folder2.open();
      folder3.open();
      folder4.open();
      folder5.open();
      folder6.open();
    }


  const showModel = (visibility: any) => {

      model.visiable = visibility;
    }

  const showSkeleton = (visibility: any) => {
    console.log(visibility);
    skeleton.visiable = visibility;
  }

  const modifyTimeScale = (speed: any) => {
    mixer.timeScale = speed;
  }

  const deactivateAllActions = () => {
      loopTime=0.1;
    actions.forEach(function (action: any) {
      action.stop();
    })
  }

  const activateAllActions = () => {
    loopTime=10*1000;
    setWeight(idleAction, settings['modify idle weight']);
    setWeight(walkAction, settings['modify walk weight']);
    setWeight(runAction, settings['modify run weight']);
    setWeight(nowAction, settings['modify tpos weight']);

    console.log("动画工作",runAction);

    actions.forEach(function (action: any) {
      console.log(action);
      action.play();
    });


  }

  const pauseContinue = () => {
    if (singleStepMode) {
      singleStepMode = false;
      unPauseAllActions();
    } else if (idleAction.paused) {
      unPauseAllActions();
    } else {
      pauseAllActions();
    }
  }


  const pauseAllActions = () => {
    actions.forEach(function (action: any) {
      action.paused = true;
    })
  }

  function unPauseAllActions() {
    actions.forEach(function (action: any) {
      action.paused = false;
    })

  }

  const toSingleStepMode = () => {
    unPauseAllActions();

    singleStepMode = true;
    sizeOfNextStep = settings['modify step size'];
  }

  const prepareCrossFade = (startAction: any, endAction: any, defaultDuration: any) => {
    const duration = setCrossFadeDuration(defaultDuration);

    singleStepMode = false;
    unPauseAllActions();






    if (startAction === idleAction) {
      executeCrossFade(startAction, endAction, duration);
    } else {
      synchronizeCrossFade(startAction, endAction, duration);
    }

  }

  const setCrossFadeDuration = (defaultDuration: any) => {

    // Switch default crossfade duration <-> custom crossfade duration

    if (settings['use default duration']) {

      return defaultDuration;

    }

    return settings['set custom duration'];


  }


  const synchronizeCrossFade = (startAction: any, endAction: any, duration: any) => {

    mixer.addEventListener('loop', onLoopFinished);

    function onLoopFinished(event: any) {

      if (event.action === startAction) {

        mixer.removeEventListener('loop', onLoopFinished);

        executeCrossFade(startAction, endAction, duration);

      }

    }

  }


  const executeCrossFade = (startAction: any, endAction: any, duration: any) => {

    // Not only the start action, but also the end action must get a weight of 1 before fading
    // (concerning the start action this is already guaranteed in this place)

    setWeight(endAction, 1);
    endAction.time = 0;

    // Crossfade with warping - you can also try without warping by setting the third parameter to false

    startAction.crossFadeTo(endAction, duration, true);

  }


  const setWeight = (action: any, weight: any) => {

      // loopTime=(1.1-weight)*1000;
    action.enabled = true;
    action.setEffectiveTimeScale(1);
    action.setEffectiveWeight(weight);

  }


  const updateWeightSliders = () => {

    settings['modify idle weight'] = idleWeight;
    settings['modify walk weight'] = walkWeight;
    settings['modify run weight'] = runWeight;

  }


  const updateCrossFadeControls = () => {

    if (idleWeight === 1 && walkWeight === 0 && runWeight === 0) {

      crossFadeControls[0].disable();
      crossFadeControls[1].enable();
      crossFadeControls[2].disable();
      crossFadeControls[3].disable();

    }

    if (idleWeight === 0 && walkWeight === 1 && runWeight === 0) {

      crossFadeControls[0].enable();
      crossFadeControls[1].disable();
      crossFadeControls[2].enable();
      crossFadeControls[3].disable();

    }

    if (idleWeight === 0 && walkWeight === 0 && runWeight === 1) {

      crossFadeControls[0].disable();
      crossFadeControls[1].disable();
      crossFadeControls[2].disable();
      crossFadeControls[3].enable();

    }

  }


  const onWindowResize = () => {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

  }


  useEffect(async () => {
    await initThree();
    await drawLine();
  }, [])

  return (
    <div>
      <div id='container' style={{height: "100vh", width: "100%"}}>
      </div>
    </div>

  );
}
export default IndexPage
