/**

 * @author MikyMei

 * @date 2021-11-22 15:14

 */


import React, {useEffect, useState} from 'react';

// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';

import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';


import styles from './index.less';
// const controls = new OrbitControls();


const Three3D: React.FC = () => {


  const loader = new GLTFLoader();
  // 引入人体
  const createBody = () => {

  }


  // 创建场景，相机，渲染器
  const initModel = () => {

    // 实例化纹理加载器
    const textureLoader = new THREE.TextureLoader()

    var scene = new THREE.Scene();
    console.log(scene);

    scene.background = textureLoader.load('./img/img_2.png');
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);

    // 创建渲染器
    var renderer = new THREE.WebGLRenderer();

    // 设置渲染器额初始颜色

    renderer.setClearColor(new THREE.Color(0xEEEEEE));

    // 设置输出的canvas画面的大小
    renderer.setSize(window.innerWidth, window.innerHeight);

    // 设置渲染物体的阴影
    renderer.shadowMap.enabled = true;


    var axes = new THREE.AxisHelper(20);
    // scene.add(axes);


    // 地面
    var planeGemometry = new THREE.PlaneGeometry(60, 20);
    // 给地面物体上色
    var planeMeterial = new THREE.MeshStandardMaterial({
      color: 0xcccccc
    })


    var geometry1 = new THREE.SphereGeometry(1, 20, 10);
    var material1 = new THREE.MeshPhongMaterial({
      color: 0xcccccc,
      map: textureLoader.load('./img/img_1.png')


      // wireframe:true,
    });
    var cube = new THREE.Mesh(geometry1, material1);

    cube.position.x = 10;
    cube.position.y = 10;
    cube.position.z = 0;


    // 对象是否渲染到贴图中
    cube.castShadow = true;
    cube.receiveShadow = true;
    scene.add(cube);
    // 创建聚光灯
    var spotLight = new THREE.SpotLight(0xFFFFFF);
    spotLight.position.set(30, 30, -30);
    spotLight.castShadow = true;
    spotLight.angle = Math.PI / 10;
    spotLight.shadow.penumbra = 0.05;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;


    scene.add(spotLight);


    var spherGeometry = new THREE.SphereGeometry(4, 20, 20);

    var material2 = new THREE.MeshLambertMaterial({
      // color: "pink",
      map: textureLoader.load('./img/img_3.png') // 加载月球材质
      // wireframe:true,
    });
    var spherGeometry2 = new THREE.Mesh(spherGeometry, material2);

    spherGeometry2.position.x = 0;
    spherGeometry2.position.y = 10;
    spherGeometry2.position.z = 0;
    // spherGeometry2.castShadow=true;
    // spherGeometry2.receiveShadow=true;

    scene.add(spherGeometry2); // 网格模型添加到场景中


    // 加平行光， 点光源
    var ambient = new THREE.AmbientLight(0x444444);
    scene.add(ambient);

    //点光源
    var point = new THREE.PointLight(0xffffff);
    point.position.set(400, 200, 300); //点光源位置
    // 通过add方法插入场景中，不插入的话，渲染的时候不会获取光源的信息进行光照计算
    scene.add(point); //点光源添加到场景中


    // 船舰地面的集合体
    var plane = new THREE.Mesh(planeGemometry, planeMeterial);

    // 物体移动位置
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;
    plane.castShadow = true;
    plane.receiveShadow = true;

    // 将地面添加到场景中
    // scene.add(plane);


    // 定位相机，并且指向场景中心
    camera.position.x = 30;
    camera.position.y = 30;
    camera.position.z = 30;
    // 指向


    camera.lookAt(0,0,0);


    // 画一条线
    //create a blue LineBasicMaterial
    const material = new THREE.LineBasicMaterial({color: "#ffffff", opacity: 0.5});
    const points = [];
    points.push(new THREE.Vector3(-10, 0, 0));
    points.push(new THREE.Vector3(0, 10, 0));
    points.push(new THREE.Vector3(10, 0, 0));

    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const line = new THREE.Line(geometry, material);
    // scene.add( line );

    let model, skeleton ;



    loader.load('./img/111.gltf', function (gltf) {

        model = gltf.scene;


        model.up.setX(1000);
        model.up.setY(1000);
        model.up.setZ(1000);
        scene.add(gltf.scene);
        console.log(gltf);
        model.traverse( function ( object ) {

          if ( object.isMesh ) object.castShadow = true;

        } );

        skeleton = new THREE.SkeletonHelper( model );
        skeleton.visible = true;
        scene.add( skeleton );



      },
      undefined

      , function (error) {

        console.error(error);

      });
    // renderer.render( scene, camera );

    // 将渲染器添加到html元素中

    // @ts-ignore
    window.document.getElementById('webgl-output').appendChild(renderer.domElement);


    let clock = new THREE.Clock();

    function render() {
      renderer.render(scene, camera); // 执行渲染操作

      // 每次绕y轴旋转
      spherGeometry2.rotateY(0.01);
      cube.rotateY(0.05);
      // spherGeometry2.rotateZ(0.15);

      const elapsed = clock.getElapsedTime();
      cube.position.set(Math.sin(elapsed) * 10, 10, Math.cos(elapsed) * 10);

      // 地球自传
      var axis = new THREE.Vector3(0, 10, 0);
      // cube.rotateOnAxis(axis, elapsed*Math.PI/1000);


      requestAnimationFrame(render);


    }

    render();
    var controls = new OrbitControls(camera, renderer.domElement);
  }




  useEffect(() => {
    initModel();

  }, [])


  return (
    <div>
      <div className={styles.output} id="webgl-output"></div>
    </div>
  )
}

export default Three3D;
