/**

 * @author MikyMei

 * @date 2022-01-25 13:51

 */

import { Color } from 'three'
import { StandardMaterial } from 'troisjs'

export default {
  extends: StandardMaterial,
  created() {
    this.material.onBeforeCompile = (shader) => {
      shader.uniforms =  {
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
      }


      shader.vertexShader = `
        varying vec3 vNN;
        varying vec3 vEye;
      ` + shader.vertexShader

      shader.vertexShader = shader.vertexShader.replace(
        '#include <fog_vertex>',
        `
          #include <fog_vertex>

          mat4 LM = modelMatrix;
          LM[2][3] = 0.0;
          LM[3][0] = 0.0;
          LM[3][1] = 0.0;
          LM[3][2] = 0.0;

          vec4 GN = LM * vec4(objectNormal.xyz, 1.0);
          vNN = normalize(GN.xyz);
          vEye = normalize(GN.xyz-cameraPosition);
        `
      )

      shader.fragmentShader = `
        uniform vec3 fresnelColor;
        varying vec3 vNN;
        varying vec3 vEye;
      ` + shader.fragmentShader

      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <output_fragment>',
        `
          #include <output_fragment>
          gl_FragColor.rgb +=  ( 1.0 - -min(dot(vEye, normalize(vNN) ), 0.0) ) * fresnelColor;
        `
      )
    }
  }
}

