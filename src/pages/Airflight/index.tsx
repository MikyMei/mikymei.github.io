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
// const controls = new OrbitControls();


/**
 * 扫光
 * */
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { RGBShiftShader } from 'three/examples//jsm/shaders/RGBShiftShader.js';
import { DotScreenShader } from 'three/examples//jsm/shaders/DotScreenShader.js';

const Airflight: React.FC = () => {


  const loader = new GLTFLoader();


  /**
   *beIntersectObjects是用来存放需要射线检测的物体数组。
   *transformControl可以方便调节物体位置大小。
   *
   * */

  let beIntersectObjects: any = [];
  let transformControl: any = new Object();


  let scene: any,
    objects: any = [],
    camera: any,
    plane: any,
    spotLight: any,
    ambient: any,
    point: any,
    cubeCamera: any,
    INTERSECTED: any,
    chooseMesh: null, // 被点击的网格模型，主要是为了保存下来生成信息窗体

    theta = 0,

    renderer: any;

  const lineCounts = 20;
  let trailList: any = [lineCounts];
  let pointsIndex = 0;

  let pointsMaterial: any, pointsMesh: any, pointsGeoemtry: any;

  let clickX: 0, clickY: 0;
  let lightProbe;
  let trackLineList: any[] = [];
  let trackPointsList: any[] = [];
  let trackCurveList: any[] = [];
  let depthScene: any;
  /**
   * 主要用于扫光
   * */

  let box: any;
  let orthCamera: any;


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
  let clock: any;
  let target: any;
  let neededUpddateMaterial: any;

  const initModel = () => {

    clock = new THREE.Clock();

    // 获得渲染器长度
    mainCanvas = document.getElementById("webgl-output");

    const textureLoader = new THREE.TextureLoader();
    scene = new THREE.Scene();
    /**
     *  只是将图片作为北京图片贴了上去，并没有实现3d效果，尤其是在进行旋转的时候感觉尤为明显
     *  */
    scene.background = textureLoader.load('./img/img_7.png');
    // 获得渲染器所在的标签元素，作为渲染器的尺寸
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xEEEEEE));
    renderer.setSize(mainCanvas.offsetWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    var axes = new THREE.AxisHelper(20);
    scene.add(axes);

    // 创建聚光灯
    spotLight = new THREE.SpotLight(0xFFFFFF);
    spotLight.position.set(30, 30, 30);
    spotLight.castShadow = true;
    spotLight.angle = Math.PI / 7;
    spotLight.shadow.penumbra = 0.05;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    scene.add(spotLight);

    ambient = new THREE.AmbientLight(0x444444);
    // scene.add(ambient);

    point = new THREE.PointLight(0xffffff);
    point.position.set(400, 200, 300);
    scene.add(point);


    var planeGemometry = new THREE.PlaneGeometry(50, 30);
    var planeMeterial = new THREE.MeshStandardMaterial({
      color: 0xcccccc
    })
    plane = new THREE.Mesh(planeGemometry, planeMeterial);

    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;
    plane.castShadow = true;
    plane.receiveShadow = true;
    // scene.add(plane);

    camera = new THREE.PerspectiveCamera(45, mainCanvas.offsetWidth / window.innerHeight, 0.1, 2000);
    camera.position.x = 0;
    camera.position.y = 17;
    camera.position.z = 35;
    camera.lookAt(0, 1, 0);


    /**
     * 定义扫描相关
     * */

    target = new THREE.WebGLRenderTarget(256, 256);
    target.texture.format = THREE.RGBFormat;
    target.texture.minFilter = THREE.NearestFilter;
    target.texture.magFilter = THREE.NearestFilter;
    target.texture.generateMipmaps = false;

    orthCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 2);
    const center = new THREE.Vector3();

    box = new THREE.Box3(
      new THREE.Vector3(-4, 0, -1),
      new THREE.Vector3(4, 10, 1)
    );
    scene.add(camera);
    box.getCenter(center);
    console.log(box.getCenter(center));

    const material = new THREE.LineBasicMaterial({
      color: 0x0000ff
    });

    const points = [];
    points.push(new THREE.Vector3(-4, 0, -1),);
    points.push( new THREE.Vector3(4, 10, 1));
    points.push( box.getCenter(center));

    const geometry = new THREE.BufferGeometry().setFromPoints( points );

    const line = new THREE.Line( geometry, material );
    scene.add( line );


    orthCamera.left = box.min.x - center.x;
    orthCamera.right = box.max.x - center.x;
    orthCamera.top = box.max.z - center.z;
    orthCamera.bottom = box.min.z - center.z;
    orthCamera.near = .1;
    orthCamera.far = box.max.y - box.min.y;

    orthCamera.position.copy(center);
    orthCamera.position.y += box.max.y - center.y;
    orthCamera.lookAt(center);

    depthScene = new THREE.Scene();
    depthScene.overrideMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying float color;
        float decodeRGBA2Float(vec4 rgba)
        {
            return dot(rgba, vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0));
        }
        vec4 encodeFloat2RGBA(float v)
        {
            vec4 enc = vec4(1.0, 255.0, 65025.0, 16581375.0) * v;
            enc = fract(enc);
            enc -= enc.yzww * vec4(1.0/255.0, 1.0/255.0, 1.0/255.0, 0.0);
            return enc;
        }
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          color = gl_Position.z / 2.0 + 0.5;
        }
      `,
      fragmentShader: `
        uniform float cameraNear;
        uniform float cameraFar;
        varying float color;

        vec4 encodeFloat2RGBA(float v)
        {
            vec4 enc = vec4(1.0, 255.0, 65025.0, 16581375.0) * v;
            enc = fract(enc);
            enc -= enc.yzww * vec4(1.0/255.0, 1.0/255.0, 1.0/255.0, 0.0);
            return enc;
        }
        void main() {
            gl_FragColor = encodeFloat2RGBA(1.0 - color);
        }
      `,
      uniforms: {
        cameraNear: {value: orthCamera.near},
        cameraFar: {value: orthCamera.far},
      },
    });

    /**
     * 结束
     * */


    let model, skeleton;
    loader.load('./img/111.gltf', function (gltf: any) {
        model = gltf.scene;
        model.scale.setScalar(40, 40, 40);

        /**
         * beIntersectObjects是用来存放需要射线检测的物体数组。
         * transformControl可以方便调节物体位置大小。
         * */

        model.children[0].geometry.computeBoundingBox();
        var centroid = new THREE.Vector3();
        centroid.addVectors(model.children[0].geometry.boundingBox.min, model.children[0].geometry.boundingBox.max);
        centroid.multiplyScalar(0.5);

        scene.add(model);
        model.traverse(
          processGLTFChild
        );

        renderer.setRenderTarget(target);
        depthScene.children = [model];
        renderer.render(depthScene, orthCamera);
        renderer.setRenderTarget(null);

        skeleton = new SkeletonHelper(model);
        skeleton.scale.setScalar(10, 10, 10)
        skeleton.visible = true;
        scene.add(skeleton);
        // const animations = gltf.animations;
        let mixer = new THREE.AnimationMixer(model);


        /**
         * 在这里进行设置
         *
         * */


      },
      undefined

      , function (error: any) {

        console.error(error);

      });


    // 将渲染器添加到html元素中

    // @ts-ignore
    window.document.getElementById('webgl-output').appendChild(renderer.domElement);


    render();
    var controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true // 是否自动旋转
    controls.autoRotateSpeed = 1.0 // 自动旋转的速度，默认值是 2.0，即渲染满60帧的情况下30秒旋转360度。


  }


  /**
   * 更改立方体（小球位置的）
   * */

  const changePointPosition = (t: any) => {
    /**
     * 对每个小球的位置进行改变，其中，速度是同的，方向也是不同的
     * 40个点分别在20个轨道上，随机生成他们的位置（所在的百分比和方向）
     * */



    let count = 0;

    trackPointsList.map(async (trackPoint: any, index: any) => {
      const position = trackCurveList[Math.floor(index / 2)].getPointAt(index % 2 === 0 ? t : 1 - t);
      await trackPoint.position.copy(position);


      await trailList[Math.floor(index / 2)][index % 2][pointsIndex].position.copy(position);
      await trailList[Math.floor(index / 2)][index % 2][pointsIndex].scale.set(0.3, 0.3, 0.3);


      for (let i = 0; i < trailList[Math.floor(index / 2)][index % 2].length; i++) {

        const sphere = trailList[Math.floor(index / 2)][index % 2][i];
        sphere.scale.multiplyScalar(0.97);
        sphere.scale.clampScalar(0.01, 1);

      }

    })


  }


  const render = () => {
    const loopTime = 10 * 1000;
    const time = Date.now();
    const t = (time * 6 % loopTime) / loopTime; // 计算当前时间进度百分比
    pointsIndex = (pointsIndex + 1) % lineCounts;
    changePointPosition(t)


    const newtime = clock.getElapsedTime() / 5 % 1;


    if (neededUpddateMaterial&&neededUpddateMaterial.uniforms&&neededUpddateMaterial.uniforms.cameraMatrix&&neededUpddateMaterial.uniforms.time) {
      neededUpddateMaterial.uniforms.time.value = newtime;

    }


    if (neededUpddateMaterial) {
      updateMaterial();
    }




    renderer.render(scene, camera); // 执行渲染操作

    requestAnimationFrame(render);


    // 如果选中的有网格模型，就加载信息窗

  }


  // 添加点击监听


  // 着色器渲染
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
        '}'//vVertexNormal视图坐标系中点的法向量
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
      // side: THREE.DoubleSide
    });


    // var material1 = new THREE.MeshBasicMaterial({color:0x000000, side: THREE.DoubleSide});

    // var material1 = new THREE.MeshBasicMaterial({color:'rgba(0, 0, 0,0.5)', side: THREE.DoubleSide});
    material1.onBeforeCompile = function (shader: any, renderer: any) {
      // 声明用到的变量和常量
      const getFoot = `
            uniform mat4 cameraMatrix;
            varying float depth;
            varying vec2 depthUv;
            #include <common>
            `;


      // 此处获取到绘制顶点的世界坐标，并生成当前的深度图的uv
      const begin_vertex = `
            #include <worldpos_vertex>
            vec4 cameraDepth = cameraMatrix * modelMatrix * vec4( transformed, 1.0 );
            depthUv = cameraDepth.xy/2.0 + 0.5;
            `;

      const depth_vary = `
            uniform float time;
            uniform sampler2D tDepth;
            uniform float opacity;
            varying float depth;
            varying vec2 depthUv;
            `;

      const depth_frag = `
            vec3 d = diffuse;
            float step = abs(time - depthUv.x);
              if(step < 0.02){
                d = d * (2.0 - step * 50.0);
              }
              vec4 diffuseColor = vec4( d, opacity );
            `
      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        getFoot
      );
      shader.vertexShader = shader.vertexShader.replace(
        "#include <worldpos_vertex>",
        begin_vertex
      );
      shader.fragmentShader = shader.fragmentShader.replace('uniform float opacity;', depth_vary)
      shader.fragmentShader = shader.fragmentShader.replace('vec4 diffuseColor = vec4( diffuse, opacity );', depth_frag)

      shader.uniforms.time = {
        value: 0.5359
      }
      shader.uniforms.cameraMatrix = {
        value: new THREE.Matrix4()
      }
      shader.uniforms.tDepth = {
        value: target.texture
      }
      material1.uniforms = shader.uniforms;
    };
    var material2 = new THREE.ShaderMaterial({
      uniforms: AeroSphere1.uniforms,
      vertexShader: AeroSphere1.vertexShader,
      fragmentShader: AeroSphere1.fragmentShader,
      blending: THREE.NormalBlending,
      transparent: true,
      depthWrite: false
    });
    var material3 = new THREE.ShaderMaterial({
      uniforms: AeroSphere3.uniforms,
      vertexShader: AeroSphere3.vertexShader,
      fragmentShader: AeroSphere3.fragmentShader,
      blending: THREE.NormalBlending,
      transparent: true,
      depthWrite: false
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

            child.material = Shaders().material1;
            child.castShadow = true;
            neededUpddateMaterial=child.material;
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


  /**
   * 更改材质
   *
   * */
  function updateMaterial() {
    if (neededUpddateMaterial.uniforms && neededUpddateMaterial.uniforms.cameraMatrix) {
      const value = new THREE.Matrix4().multiplyMatrices(
        orthCamera.projectionMatrix,
        orthCamera.matrixWorldInverse
      );

      // if(neededUpddateMaterial.uniforms.cameraMatrix.value.elements.toString()===value.elements.toString()){
      //   console.log("不变");
      // }else{
      //   console.log("改变",neededUpddateMaterial.elements, neededUpddateMaterial.uniforms.cameraMatrix.value.elements);
      // }

      neededUpddateMaterial.uniforms.cameraMatrix.value=value
    }

  }

  const addCube = (pos: any) => {

    const geometry = new THREE.BoxBufferGeometry(0.1, 0.1, 0.1);
    const material = new THREE.MeshBasicMaterial({color: 0xCCFF99, transparent: true, opacity: 0});
    const cube = new THREE.Mesh(geometry, material);
    cube.position.copy(pos)
    cube.castShadow = false;
    scene.add(cube);
    return cube
  }

  /**
   *
   * 先随机生成狠多轨道，
   * 在生成带拖尾的粒子而且粒子放到对应的轨道上，方向应该是交替相反的，然后是递加
   * */
  const generateLinelist = () => {

    // 随机生成line并增加在scene


    let poinTList: any = [];
    for (let i = 0; i < lineCounts; i++) {
      const initialPoints: any;
      if (i <= 3) {
        initialPoints = [
          {x: 3 / 3, y: 0.2 + i / 2, z: -3 / 3},
          {x: 3 / 3, y: 0.1 + i * 3 / 2, z: 3 / 3},
          {x: -3 / 3, y: 0.1 + i * 5 / 2, z: 3 / 3},
          {x: -3 / 3, y: (1 + i - 2) * 7 / 2, z: -3 / 3}
        ];
      } else if (i >= 17) {
        initialPoints = [
          {x: 3 / 2, y: (2 + i) / 3, z: -3 / 2},
          {x: 3 / 2, y: (1 + i) / 3, z: 3 / 2},
          {x: -3 / 2, y: (1 + i) / 3, z: 3 / 2},
          {x: -3 / 2, y: (1 + i + 2) / 3, z: -3 / 2}
        ];
      } else {
        initialPoints = [
          {x: 3 / 2, y: (2 + i) / 3, z: -3 / 2},
          {x: 3 / 2, y: (1 + i) / 3, z: 3 / 2},
          {x: -3 / 2, y: (1 + i) / 3, z: 3 / 2},
          {x: -3 / 2, y: (1 + i) / 3, z: -3 / 2}
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
        cubeList.map((cube: any) => cube.position) // 直接绑定方块的position以便后续用方块调整曲线
      );
      curve.curveType = 'chordal'; // 曲线类型
      curve.closed = true; // 曲线是否闭合
      curve.castShadow = true; // 曲线是否闭合


      const points = curve.getPoints(50); // 50等分获取曲线点数组
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(points),
        new THREE.LineBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.1,
          // linewidth:0.1,
        })
      ); // 绘制实体线条，仅用于示意曲线，后面的向量线条同理，相关代码就省略了


      line.castShadow = false;
      line.className = "lineTrack";

      scene.add(line);
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

    /*
    const vertices=[];
     for ( let i = 0; i < lineCounts; i ++ ) {

       const position = trackCurveList[i].getPointAt(0.5);

       vertices.push( position.x, position.y, position.z );

     }

       const geometry = new THREE.BufferGeometry();
       geometry.setAttribute( 'position', new THREE.Float32BufferAttribute(vertices, 3));
       const material = new THREE.PointsMaterial( { color: 0x888888,  } );
       const points = new THREE.Points( geometry, material );
       points.className="pointsTrack";
       console.log(points);
       scene.add( points );
       trackPointsList.push(points);
       */


    /**
     *
     * 使用几何体代替粒子效果
     * */
    for (let i = 0; i < lineCounts * 2; i++) {

      const position = trackCurveList[Math.floor(i / 2)].getPointAt(Math.random());
      const geometry = new THREE.SphereGeometry(0.1, 32, 16);


      const material = new THREE.ShaderMaterial({color: 0xffff00});
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.copy(position);
      scene.add(sphere);
      trackPointsList.push(sphere);
    }

    generateTrailList();
  }

  const generateTrailList = () => {
    const sphereGeometry = new THREE.SphereGeometry(0.1, 20, 20);
    const sphereMaterial = new THREE.MeshBasicMaterial({color: 0xd9e6ff});

    for (let j = 0; j < lineCounts; j++) {
      trailList[j] = [[], []]
      for (let i = 0; i < 40; i++) {

        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        scene.add(sphere);
        trailList[j][i % 2].push(sphere);

      }
    }

  }

  useEffect(async () => {
    await initModel();
    await generateLinelist();
    // generatePointlist();
  }, [])


  return (
    <div>
      <div className={styles.output} id="webgl-output">
        <Button id={"testAnt"} type="primary" style={{display: "none", position: "absolute"}}>测试antdesign</Button>

      </div>

    </div>
  )
}

export default Airflight;
