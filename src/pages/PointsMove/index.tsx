/**

 * @author MikyMei

 * @date 2021-11-22 15:14

 */


import React, {useEffect, useState} from 'react';

import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {SkeletonHelper} from 'three/src/helpers/SkeletonHelper.js';

import * as TWEEN from '@tweenjs/tween.js';
import {TrackballControls} from 'three/examples/jsm/controls/TrackballControls.js';
import {CSS3DRenderer, CSS3DSprite} from 'three/examples/jsm/renderers/CSS3DRenderer.js';


import styles from './index.less';
import {Button, Card, Slider} from "antd";


const Three3D: React.FC = () => {


  const loader = new GLTFLoader();
  let scene: any;
  let objects: any = [];
  let camera: any;
  let plane: any;
  let spotLight: any;
  let ambient: any;
  let point: any;
  let renderer: any;
  const particlesTotal = 556;
  const positions: any[] = [];
  let current = 0;
  let controls: any;


  let points = 0;


  let mainCanvas: any;

  const initModel = () => {

    mainCanvas = document.getElementById("webgl-output");


    const textureLoader = new THREE.TextureLoader();
    scene = new THREE.Scene();


    var axes = new THREE.AxisHelper(20);
    scene.add(axes);


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


    camera = new THREE.PerspectiveCamera(45, mainCanvas.offsetWidth / window.innerHeight, 0.1, 20000);

    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 2500;
    camera.lookAt(0, 0, 0);




    /**
     * 在这里生成一些正方形，地面，波浪，圆
     * */




    const image = document.createElement('img');
    image.addEventListener('load', function () {

      for (let i = 0; i < particlesTotal; i++) {


        const object = new CSS3DSprite(image.cloneNode());
        // const map =  textureLoader.load( "./img/img_15.png" );
        // const material = new THREE.SpriteMaterial( { map: map } );
        //
        // const object = new THREE.Sprite( material );
        object.scale.set(1, 1, 1)
        object.position.x = Math.random() * 4000 - 2000;
        object.position.y = Math.random() * 4000 - 2000,
          object.position.z = Math.random() * 4000 - 2000;
        scene.add(object);

        objects.push(object);

      }

      transition();

    });

    image.src = './img/img_15.png';

    // Plane

    const amountX = 16;
    const amountZ = 32;
    const separationPlane = 150;
    const offsetX = ((amountX - 1) * separationPlane) / 2;
    const offsetZ = ((amountZ - 1) * separationPlane) / 2;

    for (let i = 0; i < particlesTotal; i++) {

      const x = (i % amountX) * separationPlane;
      const z = Math.floor(i / amountX) * separationPlane;
      const y = (Math.sin(x * 0.5) + Math.sin(z * 0.5)) * 200;

      positions.push(x - offsetX, y, z - offsetZ);

    }

    // Cube

    const amount = 8;
    const separationCube = 150;
    const offset = ((amount - 1) * separationCube) / 2;

    for (let i = 0; i < particlesTotal; i++) {

      const x = (i % amount) * separationCube;
      const y = Math.floor((i / amount) % amount) * separationCube;
      const z = Math.floor(i / (amount * amount)) * separationCube;

      positions.push(x - offset, y - offset, z - offset);

    }

    // Random

    for (let i = 0; i < particlesTotal; i++) {

      positions.push(
        Math.random() * 4000 - 2000,
        Math.random() * 4000 - 2000,
        Math.random() * 4000 - 2000
      );

    }

    // Sphere

    const radius = 750;

    for (let i = 0; i < particlesTotal; i++) {

      const phi = Math.acos(-1 + (2 * i) / particlesTotal);
      const theta = Math.sqrt(particlesTotal * Math.PI) * phi;

      positions.push(
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi)
      );

    }


    /**
     * 在这里加载出来3D心脏并获得3D模型的所有顶点
     * */

    let model: any;

    const modelPosition: any[] = [];

    loader.load('./img/houtou.glb', function (gltf) {
        model = gltf.scene;
        console.log(model);

        model.traverse(async (child: any) => {
          if (child.isMesh) {
            console.log(child.name, child.geometry.attributes.position.count);

            console.log(child.geometry.attributes.position);
            await child.geometry.attributes.position.array.map((item: any, index: any) => {
              // if (Math.floor(Math.floor(index / 3) % 2) === 1) {
              positions.push(item * 2000 - 1000)
              // }
            })
              // console.log("555",positions);
            }
          }

        );


      },
      undefined

      , function (error) {

        console.error(error);

      });





    renderer = new CSS3DRenderer({antialias: true});
    renderer.setSize(mainCanvas.offsetWidth, window.innerHeight);
    // @ts-ignore
    document.getElementById('webgl-output').appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize);


    render();
    controls = new TrackballControls(camera, renderer.domElement);
    controls.autoRotate = true // 是否自动旋转
    controls.autoRotateSpeed = 1.0 // 自动旋转的速度，默认值是 2.0，即渲染满60帧的情况下30秒旋转360度。


  }

  const transition = () => {

    const offset = current * particlesTotal * 3;
    const duration = 2000;

    for (let i = 0, j = offset; i < particlesTotal; i++, j += 3) {

      const object = objects[i];

      new TWEEN.Tween(object.position)
        .to({
          x: positions[j],
          y: positions[j + 1],
          z: positions[j + 2]
        }, Math.random() * duration + duration)
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();

    }

    new TWEEN.Tween()
      .to({}, duration * 3)
      .onComplete(transition)
      .start();

    current = (current + 1) % 5;

  }

  function onWindowResize() {

    camera.aspect = mainCanvas.offsetWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

  }

  const generatePOints = () => {

    const image = document.createElement('img');
    image.addEventListener('load', function () {

      for (let i = 0; i < particlesTotal; i++) {

        const object = new CSS3DSprite(image.cloneNode());
        object.position.x = Math.random() * 4000 - 2000,
          object.position.y = Math.random() * 4000 - 2000,
          object.position.z = Math.random() * 4000 - 2000;
        scene.add(object);

        objects.push(object);

      }

      // transition();

    });
    image.src = 'textures/img_1.png';

  }


  const render = () => {


    /**
     * 让粒子动起来
     * */


    if (controls && TWEEN) {
      controls.update();
      TWEEN.update();
    }

    const time = performance.now();

    for (let i = 0, l = objects.length; i < l; i++) {

      const object = objects[i];
      const scale = Math.sin((Math.floor(object.position.x) + time) * 0.002) * 0.3 + 1;
      object.scale.set(scale, scale, scale);

    }


    renderer.render(scene, camera); // 执行渲染操作

    requestAnimationFrame(render);


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
      <div className={styles.output} id="webgl-output">
        <Button id={"testAnt"} type="primary" style={{display: "none", position: "absolute"}}>测试antdesign</Button>

      </div>

    </div>
  )
}

export default Three3D;
