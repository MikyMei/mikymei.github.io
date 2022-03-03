/**

 * @author MikyMei

 * @date 2021-11-23 15:12

 */

import React, {useEffect, useState} from "react"
import {Checkbox, Button} from 'antd';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import {GUI} from 'three/examples/jsm/libs/dat.gui.module.js';

import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {SkeletonHelper} from 'three/src/helpers/SkeletonHelper.js';
import {tag, labelRenderer} from '@/utils/css2drander'
import Card from '@/utils/card'

const label = tag();


const IndexPage: React.FC = () => {


  const params = {
    exposure: 0,
    bloomStrength: 0,
    bloomThreshold: 0,
    bloomRadius: 0
  };
  const initThree = () => {
    let camera: any, axes: any, mesh: any, renderScene: any, shaderMaterial: any, composer: any, scene: any,
      outsideMaterial: any, insideMaterial: any, cube: any, material: any, renderer: any, light: any, loader: any,
      loaderTexture: any, orbitControls: any, mixer: any, clock: any, body: any;
    let container: any = document.getElementById('Subject')
    const created = () => {
      loader = new GLTFLoader();// 异步渲染模型
      scene = new THREE.Scene();// 场景
      scene.position.y = -1;
      scene.background = new THREE.Color(0x000000);

      axes = new THREE.AxisHelper(20);
      scene.add(axes);
      renderer = new THREE.WebGLRenderer({antialias: true});
      renderer.setPixelRatio(window.devicePixelRatio);
      clock = new THREE.Clock()
      // renderScene = new RenderPass(scene, camera);
      // const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth / window.innerHeight), 1.5, 0.4, 0.85);
      // bloomPass.threshold = params.bloomThreshold;
      // bloomPass.strength = params.bloomStrength;
      // bloomPass.radius = params.bloomRadius;
      // renderer.setSize(window.innerWidth, window.innerHeight);
      // composer = new EffectComposer(renderer);
      // composer.setSize(window.innerWidth, window.innerHeight);
      // composer.addPass(renderScene);
      // composer.addPass(bloomPass);
    }
    // 添加相机
    const Camera = () => {
      camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
      camera.position.y = 1;
      camera.position.x = 0;
      camera.position.z = 4;
      const pointLight = new THREE.PointLight(0xffff00, 1);
      camera.add(pointLight);
    }

    // 添加贴图
    function createCubeMap() {
      return new THREE.CubeTextureLoader().load(new Array(6).fill("./start.jpg"));
    }

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
        depthWrite: false
      });
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

    const onMouseClick = (event: any, value: any, model: any) => {
      model.traverse(function (child: any) {
        if (child.isMesh) {// 创建材质贴图
          if (child.name === "Body002") child.material.visible = false
        }
      })
    }

    const onMouseOut = (event: any, value: any, model: any) => {
      model.traverse(function (child: any) {
        if (child.isMesh) {// 创建材质贴图
          if (child.name === "Body002") child.material.visible = true
        }
      })
    }
    const onMouseClickHeart = (event: any, value: any, model: any, child: any) => {
      const obj=child;
      obj.geometry.computeBoundingSphere();
      let realPosition = obj.geometry.boundingSphere.center;
      console.log("点击值", child, realPosition);
      // 调整相机位置
      camera.lookAt(realPosition);
      camera.position.y = 1;
      camera.position.x = 0;
      camera.position.z = 1.5;

      model.traverse(function (child: any) {
        if (child.isMesh) {// 创建材质贴图
          if (child.name === "Circulatory_Heart001") {
            const dir = new THREE.Vector3(10, 0, 6);
            //normalize the direction vector (convert to vector of length 1)
            dir.normalize();
            const origin = new THREE.Vector3(0, 0, 0);
            const length = 10;
            const hex = 0xffffff;
            const arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex);
            arrowHelper.cone.material.visible = false
            child.add(arrowHelper)
            child.add(label);

            // camera.lookAt(child.position)
          }
        }
      })
    }
    //创建3D模型
    const Load = () => {
      loader.load('./img/joker.gltf', function (gltf: any) {
        const model: any = gltf.scene;
        model.traverse(function (child: any) {
          if (child.isMesh) {// 创建材质贴图
            switch (child.name) {
              case "Body002":
                child.material = Shaders().material1

                document.addEventListener('mouseover', (e: any) => {
                  onMouseClick(e, a, child);
                });

                document.addEventListener('mouseout', (e: any) => {
                  onMouseOut(e, a, child);
                });
                break;
              case "Skeletal001":
                child.material = Shaders().material2
                break;
              case "Circulatory_Heart001":
                child.material = Shaders().material3
                let a = document.getElementById("Card")
                const Heart: HTMLElement | null = document.getElementById("Heart");
                Heart.addEventListener('click', (e: any) => {
                  onMouseClickHeart(e, a, model, child);
                });
                break;
              default:
                break;
            }
          }
        });
        scene.add(model)
        model.matrixAutoUpdate = false;
        model.updateMatrix();
      }, undefined, function (e: any) {
        console.error(e);
      });
    }
    // 添加鼠标事件
    const Controls = () => {
      orbitControls = new OrbitControls(camera, renderer.domElement);
      orbitControls.autoRotate = false;
      // 垂直环绕的距离、上限和下限。
      orbitControls.minPolarAngle = 0;
      orbitControls.maxPolarAngle = Math.PI;
      // 您可以移入和移出多远（仅透视照相机）
      orbitControls.minDistance = 0;
      orbitControls.maxDistance = Infinity;
      orbitControls.enablePan = true; // 设置为false以禁用平移（即垂直和水平平移）
      orbitControls.enableDamping = true; // 设置为false以禁用阻尼（即惯性）
      orbitControls.dampingFactor = 0.5;// 设置阻尼数值
    }
    // 初始化画布
    const init = () => {
      created()
      Camera()
      Controls()
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);
      Load()
    }

    function render() {
      renderer.render(scene, camera)
      labelRenderer.render(scene, camera); // 渲染标签
      // composer.render()
    }

    // 开启渲染
    const animate = function () {
      const delta = clock.getDelta();
      mixer && mixer.update(delta);
      render()
      requestAnimationFrame(animate);
    };
    init();
    animate()
  }
  const handleClick = () => {
    console.log('');

  }
  useEffect(() => {
    initThree()
  }, [])

  return (
    <div>
      <Button type="primary" style={{position: "absolute"}} id="Heart" onClick={handleClick}>心脏</Button>
      <div id='Subject' style={{height: "100vh"}}>
      </div>
    </div>

  );
}
export default IndexPage
