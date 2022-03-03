/**

 * @author MikyMei

 * @date 2022-02-21 13:46

 */

import React, {useEffect, useState} from 'react';
import Utils from "./utils";

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
import Three3D from "@/pages/3DBody";


const SliderOrga: React.FC = () => {

  let container: any, camera: any, renderer: any, controls: any;
  let sceneL: any, sceneR: any;
  const clock = new THREE.Clock();
  const time = {
    value: 0
  };
  const addTimer = true;


  const loader = new GLTFLoader();

  const scanMeshModel: any = [];

  const orgaMatchColor = {
    "Retopo_生殖系统": "#fcafaf",
    "Retopo_静脉": "#3a8aff",
    "Retopo_动脉": "#fb7f68",
    "Retopo_大脑": "#D6C0AD",
    "Retopo_消化系统": "#EDBDA9",
    "Retopo_小肠": "#F7D46C",
    "Retopo_胃部": "#EDBDA9",
    "Retopo_肝脏": "#ee934c",
    "Retopo_支气管": "#cc594b",
    "Retopo_肺": "#ff5050",
    "Retopo_肾脏": "#F0834D",
    "Retopo_心脏": "#BC4D2A",
  };
  const orgaTypeList = [["Retopo_皮肤", "皮肤", "超重"],
    ["Retopo_跟骨",
      "Retopo_腕骨",
      "Retopo_颈椎",
      "Retopo_锁骨",
      "Retopo_颅骨",
      "Retopo_牙齿_上",
      "Retopo_股骨",
      "Retopo_腓骨",
      "Retopo_肱骨",
      "Retopo_踝关节",
      "Retopo_下颌骨",
      "Retopo_牙齿_下",
      "Retopo_手",
      "Retopo_脚",
      "Retopo_骨盆",
      "Retopo_桡骨",
      "Retopo_肋骨",
      "Retopo_骶骨",
      "Retopo_肩胛骨",
      "Retopo_胸骨",
      "Retopo_跗骨",
      "Retopo_胫骨",
      "Retopo_尺骨",
      "Retopo_脊柱"],
    ["Retopo_生殖系统",
      "Retopo_静脉",
      "Retopo_动脉",
      "Retopo_大脑",
      "Retopo_消化系统",
      "Retopo_小肠",
      "Retopo_胃部",
      "Retopo_肝脏",
      "Retopo_支气管",
      "Retopo_肺",
      "Retopo_肾脏",
      "Heart__Ani",
      "Retopo_心脏"],
    []
  ];
  let sliderPos = window.innerWidth / 2;

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

      // material.color.setStyle('#ffffff');
      const BodyShader = {
        uniforms: {
          time,
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
            value: new THREE.Color('#e0e0e0'),
          },
          uDiffusion: {
            value: new THREE.Vector3(
              1, // 0 1开关
              4, // 范围
              0.1, // 速度
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
            value: new THREE.Color("#ffffff")
          },

          uColor: {
            value: new THREE.Color('#fffa89'),
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
            value: new THREE.Color('#dcdcdc'),
          },
          cameraMatrix: {
            value: new THREE.Matrix4(),
          },
        },
        vertexShader: `
          varying vec3	vVertexWorldPosition;
          uniform float time;
          varying vec3	vVertexNormal;
          varying vec4	vFragColor;
          varying vec4 vPositionMatrix;
          varying vec3 vPosition;
          void main() {
            vVertexNormal	= normalize(normalMatrix * normal);
            vVertexWorldPosition	= (modelMatrix * vec4(position, 1)).xyz;
            vPositionMatrix = projectionMatrix * vec4(position, 1.0);
            vPosition = position;
            gl_Position	= projectionMatrix * modelViewMatrix * vec4(position.x, position.y, position.z , 1);
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
          vec3 distColor =  vec3(0.9, 0.9, 0.9);

          float indexMix = vPosition.z / uSize.z ;
          distColor = mix(distColor, uTopColor, indexMix);
          // 开启扩散波
          vec2 position2D = vec2(vPosition.x, vPosition.y);


            if (uFlow.x > 0.5) {
                // 扩散速度
                float dTime = mod(time * uFlow.z , uSize.y);
                // 流动范围
                float topY = vPosition.y + uFlow.y;
                if (dTime > vPosition.y && dTime < topY) {
                    // 颜色渐变
                    float dIndex = sin((topY - dTime) / uFlow.y *3.14);

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

  function Shaders(color: any) {
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
          //  "#51AEF4"
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
          value: new THREE.Color(color)
          //  #30D2BD
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
          value: new THREE.Color(color)
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
      // morphTargets: true,

    });
    const material2 = new THREE.ShaderMaterial({
      uniforms: AeroSphere1.uniforms,
      vertexShader: AeroSphere1.vertexShader,
      fragmentShader: AeroSphere1.fragmentShader,
      blending: THREE.NormalBlending,
      transparent: true,
      depthWrite: false,
      visible: true,
      // morphTargets: true,

    });
    const material3 = new THREE.ShaderMaterial({
      uniforms: AeroSphere3.uniforms,
      vertexShader: AeroSphere3.vertexShader,
      fragmentShader: AeroSphere3.fragmentShader,
      blending: THREE.NormalBlending,
      transparent: true,
      depthWrite: false,
      visible: false,
      // morphTargets: true,

    });
    return {material1, material2, material3}
  }

  const JudgeOrgaType = (orgaName: any) => {
    let result = -1;
    orgaTypeList.map((item: any, index: any) => {
      if (item.indexOf(orgaName) != -1) {
        result = index;
      }

    })
    return result;
  }

  const processGLTFChild = (child: any, visible: boolean) => {

    if (child.name==="Retopo_心脏_"){
      child.name="Retopo_心脏"
    }
    try {
      // if (child.isMesh) {


      // 根据器官属于在哪个数组，判断属于哪一类，选择哪一类着色器材质
      const type = JudgeOrgaType(child.name);


      switch (type) {
        case 0:
          scanMeshModel.push(child);
          child.material = setCityMaterial(child).materialBody;

          child.castShadow = true;

          break;
        case 1:
          child.material =new THREE.MeshPhongMaterial(
            {
              color: "#ffffff",
              transparent: true,
              opacity: 1,
              // metalness: 20,
              // roughness: 0,
              // envMapIntensity: 1,
              side: THREE.DoubleSide,
              specular: "#ffffff",
              shininess: 200,
              depthWrite: true,
            });
          break;
        case 2:
          /**
           * 以下为两种方案，着色器的优势在于控制滑动隐藏上，而动画不能用
           * */
          child.material = new THREE.MeshPhongMaterial(
            {
              color: orgaMatchColor[`${child.name}`],
              transparent: true,
              opacity: 1,
              visible: visible,
              metalness: 20,
              roughness: 0,
              envMapIntensity: 1,
              side: THREE.DoubleSide,
              specular: "#ffffff",
              shininess: 200,
              depthWrite: true,
            });
          // child.material = Shaders(orgaMatchColor[`${child.name}`]).material3;
          child.castShadow = true

          break;
        default:
          child.material = Shaders("#30D2BD").material2;
          child.castShadow = true;
          break;
      }
      // }
    } catch (e) {
      console.log('error:', e)
      console.error('设置色彩出错, child:', child)
    }
  };


  const initMeshes = () => {



    loader.load('./img/standardFigure.gltf', function (gltf) {
        let model = gltf.scene;
        model.scale.setScalar(5, 5, 5);
        model.position.setY(-4);
        // scene.add(model);



        model.traverse((child: any) => {
            if (child.isMesh) {
              // objects.push(child);

              processGLTFChild(child, true)

            }
          });
        sceneL.add(model);


      },
      undefined

      , function (error) {

        console.error(error);

      });
    loader.load('./img/standardFigure.gltf', function (gltf) {
        let model = gltf.scene;
        model.scale.setScalar(5, 5, 5);
        model.position.setY(-4);
        // scene.add(model);



        model.traverse((child: any) => {
          if (child.isMesh) {
            // objects.push(child);

            processGLTFChild(child, false)

          }
        });
        sceneR.add(model);


      },
      undefined

      , function (error) {

        console.error(error);

      });

    // const geometry = new THREE.IcosahedronGeometry(1, 3);
    //
    // const meshL = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
    // sceneL.add(meshL);
    //
    // const meshR = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({wireframe: true}));
    // sceneR.add(meshR);

  }


  const initScene = () => {
    container = document.querySelector('#container');
    sliderPos = container.offsetWidth / 2;

    sceneL = new THREE.Scene();
    sceneL.background = new THREE.Color("#e3e3e3");

    sceneR = new THREE.Scene();
    sceneR.background = new THREE.Color("#ffffff");

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 15;

    controls = new OrbitControls(camera, container);
    controls.enableDamping = true;

    const light = new THREE.AmbientLight( 0x444444 );
    light.position.set(-2, 2, 2);
    sceneL.add(light.clone());
    sceneR.add(light.clone());


    const frontPoint = new THREE.PointLight(0xffffff);
    frontPoint.position.set(0, 200, 300); // 点光源位置

    const backPoint = new THREE.PointLight(0xffffff);
    backPoint.position.set(0, 200, -300); // 点光源位置

    sceneL.add(frontPoint.clone());
    sceneR.add(frontPoint.clone());

    sceneL.add(backPoint.clone());
    sceneR.add(backPoint.clone());

    initMeshes();
    initSlider();

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setScissorTest(true);
    container.appendChild(renderer.domElement);
    renderer.setAnimationLoop(render);

    window.addEventListener('resize', onWindowResize);
  }

  const initSlider = () => {

    const slider = document.querySelector('#slider');

    function onPointerDown() {

      if (event.isPrimary === false) return;

      controls.enabled = false;

      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);

    }

    function onPointerUp() {

      controls.enabled = true;

      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);

    }

    function onPointerMove(e: any) {

      if (event.isPrimary === false) return;

      sliderPos = Math.max(0, Math.min(container.offsetWidth, e.pageX));

      slider.style.left = sliderPos - (slider.offsetWidth / 2) + "px";

    }

    slider.style.touchAction = 'none'; // disable touch scroll
    slider.addEventListener('pointerdown', onPointerDown);

  }

  function onWindowResize() {

    camera.aspect = container.offsetWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(container.offsetWidth, window.innerHeight);

  }


  const render = () => {

    //
    // /**
    //  * 实现身体扫光
    //  * */
    // const dt = clock.getDelta();
    // /**
    //  * 模型的动画
    //  * */
    //
    //
    // if (dt > 1) return false;
    //
    // if (time.value >= 0.48 || addTimer === true) {
    //   time.value -= dt / 5;
    //   if (time.value <= 0.0) {
    //     addTimer = false
    //   }
    // } else if (time.value <= 0.0 || addTimer === false) {
    //   time.value += dt / 5;
    //   if (time.value >= 0.48) {
    //     addTimer = true
    //   }
    // }
    //
    // /**
    //  * 这里是固定了皮肤的在最后一个，实际上需要在最开始的时候就整出来
    //  * */
    // if (scanMeshModel.length > 0) {
    //   scanMeshModel.map(item => {
    //     item.material.uniforms.time = time;
    //   })
    //
    // }

    renderer.setScissor(0, 0, sliderPos, window.innerHeight);
    renderer.render(sceneL, camera);

    renderer.setScissor(sliderPos, 0, container.offsetWidth, window.innerHeight);
    renderer.render(sceneR, camera);


    // requestAnimationFrame(render);


  }

  useEffect(() => {
    initScene();

  }, [])


  return (
    <div>
      <div id="container" className={styles.container}>
        <div id="slider" className={styles.slider} />
      </div>
    </div>
  )
}

export default SliderOrga;
