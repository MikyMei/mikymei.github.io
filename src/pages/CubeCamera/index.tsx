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
import {Button, Card} from "antd";
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


  let scene: any,
    objects: any = [],
    camera: any,
    plane: any,
    spotLight: any,
    ambient: any,
    point: any,
    light:any,
    mesh:any,
    cubeCamera: any,
    INTERSECTED: any,
    chooseMesh: null, // 被点击的网格模型，主要是为了保存下来生成信息窗体

    theta = 0,

    renderer: any;


  const API = {
    lightProbeIntensity: 1.0,
    directionalLightIntensity: 0.2,
    envMapIntensity: 1
  };


  let mainCanvas: any;

  const initModel = () => {



    /**
     *
     * 获得渲染器长度
     * */
    mainCanvas = document.getElementById("webgl-output");

    const textureLoader = new THREE.TextureLoader();
    scene = new THREE.Scene();
    /**
     *  只是将图片作为北京图片贴了上去，并没有实现3d效果，尤其是在进行旋转的时候感觉尤为明显
     *  */
    // scene.background = textureLoader.load('./img/img_7.png');

    // 获得渲染器所在的标签元素，作为渲染器的尺寸
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xEEEEEE));
    renderer.setSize(mainCanvas.offsetWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    /**
     * 坐标轴
     * */
    var axes = new THREE.AxisHelper(200);
    scene.add(axes);

    /**
     * 创建聚光灯
     * */
    spotLight = new THREE.SpotLight(0xFFFFFF);
    spotLight.position.set(30, 30, -30);
    spotLight.castShadow = true;
    spotLight.angle = Math.PI / 10;
    spotLight.shadow.penumbra = 0.05;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    scene.add(spotLight);

    /**
     * 平行光
     * */
    ambient = new THREE.AmbientLight(0x444444);
    scene.add(ambient);
    point = new THREE.PointLight(0xffffff);
    point.position.set(400, 200, 300); //点光源位置
    scene.add(point);

    /**
     * 船舰相机，因为场景渲染的并不是整个窗口，所以获得的尺寸不是全部
     * */
    camera = new THREE.PerspectiveCamera(45, mainCanvas.offsetWidth / window.innerHeight, 0.1, 2000);
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 15;
    camera.lookAt(0, 0, 0);


    /**
     * 创建一个cube来实现反光效果
     * */

    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 256, {
      encoding: THREE.sRGBEncoding, // since gamma is applied during rendering, the cubeCamera renderTarget texture encoding must be sRGBEncoding
      format: THREE.RGBAFormat
    } );

    cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);
    scene.add(cubeCamera);



    /**
     *
     * 添加平行光
     * */
    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 20, 20 );

    light.castShadow = true;
    light.shadow.camera.top = 10;
    light.shadow.camera.bottom = -10;
    light.shadow.camera.left = -10;
    light.shadow.camera.right = 10;

    //告诉平行光需要开启阴影投射
    light.castShadow = true;
    scene.add(light);


    /**
     * 设置场景的cubemap
     * */
      //cubemap
    const path = './img/';
    const format = '.jpg';
    const urls = [
      path + 'px' + format, path + 'nx' + format,
      path + 'py' + format, path + 'ny' + format,
      path + 'pz' + format, path + 'nz' + format
    ];

    const reflectionCube = new THREE.CubeTextureLoader().load( urls );
    const refractionCube = new THREE.CubeTextureLoader().load( urls );
    refractionCube.mapping = THREE.CubeRefractionMapping;

    scene = new THREE.Scene();
    scene.background = reflectionCube;


    /**
     * 增加
     * */

    const geometry2 = new THREE.SphereGeometry( 5, 64, 32 );
    //const geometry = new THREE.TorusKnotGeometry( 4, 1.5, 256, 32, 2, 3 );

    const material2 = new THREE.MeshStandardMaterial( {
      color: "fffffff",
      // transparent: true,
      // opacity: 0.7,
      // side: THREE.BackSide,
      // vertexColors: THREE.VertexColors,
      metalness: 0,
      roughness: 0,
      envMap: reflectionCube,
      envMapIntensity: API.envMapIntensity,
    } );

    // mesh
    mesh = new THREE.Mesh( geometry2, material2 );
    scene.add( mesh );

    //
    ambient = new THREE.AmbientLight(0x444444);
    scene.add(ambient);



    /**
     * 创建一个物体
     * */

      // 添加中间显示的球体
    var geometry = new THREE.SphereBufferGeometry(2, 100, 50);

    console.log("相机",cubeCamera);
    /**
     * 将cubeCamera的立方体纹理赋值给Material的envMap
     * */
    let material = new THREE.MeshBasicMaterial({
      envMap: cubeCamera.renderTarget.texture,
      map: textureLoader.load("./img/img_12.png")
    });

    let cubeMaterial = new THREE.MeshPhongMaterial({
      map: textureLoader.load("./img/img_11.png")
    });
    /**
     * 添加球形
     * */
    let sphereMesh = new THREE.Mesh(geometry, material);
    sphereMesh.position.set(-10, 0, 0);

    scene.add(sphereMesh);

    /**
     *
     * 添加立方体
     * */
    let cubeMesh = new THREE.Mesh(new THREE.SphereGeometry(2, 2, 2), cubeMaterial);
    cubeMesh.position.set(-5, 0, 0);
    scene.add(cubeMesh);

    /**
     * 添加甜甜圈*/
    let torusMesh = new THREE.Mesh(new THREE.TorusGeometry(2, 1, 16, 100), cubeMaterial);
    torusMesh.position.set(-18, 0, 0);
    scene.add(torusMesh);


    console.log(scene);

    /**
     *
     * 测试
     * */


    /**
     将渲染器添加到html元素中
     */

    // @ts-ignore
    window.document.getElementById('webgl-output').appendChild(renderer.domElement);

    render();
    var controls = new OrbitControls(camera, renderer.domElement);


  }


  const render = () => {
    cubeCamera.update( renderer, scene );
    renderer.render(scene, camera); // 执行渲染操作
    requestAnimationFrame(render);
  }


  // 添加点击监听


  useEffect(() => {
    initModel();

  }, [])


  return (
    <div>
      <div className={styles.output} id="webgl-output">
        <Button id={"testAnt"} type="primary" style={{display: "none", position: "absolute"}}>测试antdesign</Button>
      </div>

    </div>
  )
}

export default Three3D;
