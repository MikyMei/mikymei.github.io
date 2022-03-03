(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{"t5+4":function(K,O,v){},zP0X:function(K,O,v){"use strict";v.r(O);var me=v("ld8g"),k=v("SJBw"),R=v("tGGB"),J=v("NUIj"),E=v.n(J),I=v("1QO0"),de=v.n(I),Y=v("tWIW"),e=v("8GEk"),H=v("4DJe"),X=v("twqD"),Q=v("t5+4"),j=v.n(Q),S=v("t12N"),fe=v.n(S),Z=function(){var $=new Y.a,pe=[],we=new Object,m,q=[],x,y,h,ee,A,_e,ge,xe,he=0,_,M=20,b=[M],P=0,ye,Ce,be,Me,Ee,Se,re=[],U=[],V=[],T,p,s,z=document.createElement("img");document.body.appendChild(z),z.style.position="absolute",z.style.display="block";var W=document.createElement("div");document.body.appendChild(W),W.id="infoWindow",W.className=j.a.infoWindow;var Pe=new e.Qb,Te=100,De=new e.xb,L,G,C,g,ae=function(){G=new e.p,L=document.getElementById("webgl-output");var a=new e.Mb;m=new e.zb,m.background=a.load("./img/img_7.png"),_=new e.Wb,_.setClearColor(new e.q(15658734)),_.setSize(L.offsetWidth,window.innerHeight),_.shadowMap.enabled=!0;var r=new e.g(20);m.add(r),h=new e.Ib(16777215),h.position.set(30,30,30),h.castShadow=!0,h.angle=Math.PI/7,h.shadow.penumbra=.05,h.shadow.mapSize.width=1024,h.shadow.mapSize.height=1024,m.add(h),ee=new e.b(4473924),A=new e.pb(16777215),A.position.set(400,200,300),m.add(A);var o=new e.ob(50,30),n=new e.db({color:13421772});y=new e.Y(o,n),y.rotation.x=-.5*Math.PI,y.position.x=0,y.position.y=0,y.position.z=0,y.castShadow=!0,y.receiveShadow=!0,x=new e.nb(45,L.offsetWidth/window.innerHeight,.1,2e3),x.position.x=0,x.position.y=17,x.position.z=35,x.lookAt(0,1,0),C=new e.Vb(256,256),C.texture.format=e.wb,C.texture.minFilter=e.fb,C.texture.magFilter=e.fb,C.texture.generateMipmaps=!1,s=new e.mb(-1,1,1,-1,1,2);var t=new e.Rb;p=new e.i(new e.Rb(-4,0,-1),new e.Rb(4,10,1)),m.add(x),p.getCenter(t),console.log(p.getCenter(t));var l=new e.M({color:255}),i=[];i.push(new e.Rb(-4,0,-1)),i.push(new e.Rb(4,10,1)),i.push(p.getCenter(t));var u=new e.m().setFromPoints(i),w=new e.L(u,l);m.add(w),s.left=p.min.x-t.x,s.right=p.max.x-t.x,s.top=p.max.z-t.z,s.bottom=p.min.z-t.z,s.near=.1,s.far=p.max.y-p.min.y,s.position.copy(t),s.position.y+=p.max.y-t.y,s.lookAt(t),T=new e.zb,T.overrideMaterial=new e.Ab({vertexShader:`
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
      `,fragmentShader:`
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
      `,uniforms:{cameraNear:{value:s.near},cameraFar:{value:s.far}}});var d,f;$.load("./img/111.gltf",function(B){d=B.scene,d.scale.setScalar(40,40,40),d.children[0].geometry.computeBoundingBox();var N=new e.Rb;N.addVectors(d.children[0].geometry.boundingBox.min,d.children[0].geometry.boundingBox.max),N.multiplyScalar(.5),m.add(d),d.traverse(ne),_.setRenderTarget(C),T.children=[d],_.render(T,s),_.setRenderTarget(null),f=new X.a(d),f.scale.setScalar(10,10,10),f.visible=!0,m.add(f);var Oe=new e.d(d)},void 0,function(B){console.error(B)}),window.document.getElementById("webgl-output").appendChild(_.domElement),oe();var D=new H.a(x,_.domElement);D.autoRotate=!0,D.autoRotateSpeed=1},te=function(a){var r=0;U.map(function(){var o=Object(R.a)(E.a.mark(function n(t,l){var i,u,w;return E.a.wrap(function(f){for(;;)switch(f.prev=f.next){case 0:return i=V[Math.floor(l/2)].getPointAt(l%2==0?a:1-a),f.next=3,t.position.copy(i);case 3:return f.next=5,b[Math.floor(l/2)][l%2][P].position.copy(i);case 5:return f.next=7,b[Math.floor(l/2)][l%2][P].scale.set(.3,.3,.3);case 7:for(u=0;u<b[Math.floor(l/2)][l%2].length;u++)w=b[Math.floor(l/2)][l%2][u],w.scale.multiplyScalar(.97),w.scale.clampScalar(.01,1);case 8:case"end":return f.stop()}},n)}));return function(n,t){return o.apply(this,arguments)}}())},oe=function c(){var a=10*1e3,r=Date.now(),o=r*6%a/a;P=(P+1)%M,te(o);var n=G.getElapsedTime()/5%1;g&&g.uniforms&&g.uniforms.cameraMatrix&&g.uniforms.time&&(g.uniforms.time.value=n),g&&ie(),_.render(m,x),requestAnimationFrame(c)};function F(){var c=["varying vec3	vVertexWorldPosition;","varying vec3	vVertexNormal;","varying vec4	vFragColor;","void main(){","	vVertexNormal	= normalize(normalMatrix * normal);","	vVertexWorldPosition	= (modelMatrix * vec4(position, 1)).xyz;","	// set gl_Position","	gl_Position	= projectionMatrix * modelViewMatrix * vec4(position, 1);","}"].join(`
`),a={uniforms:{coeficient:{type:"f",value:1},power:{type:"f",value:.5},glowColor:{type:"c",value:new e.q("#51AEF4")}},vertexShader:c,fragmentShader:["uniform vec3	glowColor;","uniform float	coeficient;","uniform float	power;","varying vec3	vVertexNormal;","varying vec3	vVertexWorldPosition;","varying vec4	vFragColor;","void main(){","	vec3 worldCameraToVertex= vVertexWorldPosition - cameraPosition;","	vec3 viewCameraToVertex	= (viewMatrix * vec4(worldCameraToVertex, 0.0)).xyz;","	viewCameraToVertex	= normalize(viewCameraToVertex);","	float intensity		= pow(coeficient + dot(vVertexNormal, viewCameraToVertex), power);","	gl_FragColor		= vec4(glowColor, intensity);","}"].join(`
`)},r={uniforms:{coeficient:{type:"f",value:1},power:{type:"f",value:1},glowColor:{type:"c",value:new e.q("#336AAC")}},vertexShader:c,fragmentShader:["uniform vec3	glowColor;","uniform float	coeficient;","uniform float	power;","varying vec3	vVertexNormal;","varying vec3	vVertexWorldPosition;","varying vec4	vFragColor;","void main(){","	vec3 worldCameraToVertex= vVertexWorldPosition - cameraPosition;","	vec3 viewCameraToVertex	= (viewMatrix * vec4(worldCameraToVertex, 0.0)).xyz;","	viewCameraToVertex	= normalize(viewCameraToVertex);","	float intensity		= pow(coeficient + dot(vVertexNormal, viewCameraToVertex), power);","	gl_FragColor		= vec4(glowColor, intensity);","}"].join(`
`)},o={uniforms:{coeficient:{type:"f",value:1},power:{type:"f",value:.2},glowColor:{type:"c",value:new e.q("red")}},vertexShader:c,fragmentShader:["uniform vec3	glowColor;","uniform float	coeficient;","uniform float	power;","varying vec3	vVertexNormal;","varying vec3	vVertexWorldPosition;","varying vec4	vFragColor;","void main(){","	vec3 worldCameraToVertex= vVertexWorldPosition - cameraPosition;","	vec3 viewCameraToVertex	= (viewMatrix * vec4(worldCameraToVertex, 0.0)).xyz;","	viewCameraToVertex	= normalize(viewCameraToVertex);","	float intensity		= pow(coeficient + dot(vVertexNormal, viewCameraToVertex), power);","	gl_FragColor		= vec4(glowColor, intensity);","}"].join(`
`)},n=new e.Ab({uniforms:a.uniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader,blending:e.ib,transparent:!0,depthWrite:!1});n.onBeforeCompile=function(i,u){var w=`
            uniform mat4 cameraMatrix;
            varying float depth;
            varying vec2 depthUv;
            #include <common>
            `,d=`
            #include <worldpos_vertex>
            vec4 cameraDepth = cameraMatrix * modelMatrix * vec4( transformed, 1.0 );
            depthUv = cameraDepth.xy/2.0 + 0.5;
            `,f=`
            uniform float time;
            uniform sampler2D tDepth;
            uniform float opacity;
            varying float depth;
            varying vec2 depthUv;
            `,D=`
            vec3 d = diffuse;
            float step = abs(time - depthUv.x);
              if(step < 0.02){
                d = d * (2.0 - step * 50.0);
              }
              vec4 diffuseColor = vec4( d, opacity );
            `;i.vertexShader=i.vertexShader.replace("#include <common>",w),i.vertexShader=i.vertexShader.replace("#include <worldpos_vertex>",d),i.fragmentShader=i.fragmentShader.replace("uniform float opacity;",f),i.fragmentShader=i.fragmentShader.replace("vec4 diffuseColor = vec4( diffuse, opacity );",D),i.uniforms.time={value:.5359},i.uniforms.cameraMatrix={value:new e.X},i.uniforms.tDepth={value:C.texture},n.uniforms=i.uniforms};var t=new e.Ab({uniforms:r.uniforms,vertexShader:r.vertexShader,fragmentShader:r.fragmentShader,blending:e.ib,transparent:!0,depthWrite:!1}),l=new e.Ab({uniforms:o.uniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader,blending:e.ib,transparent:!0,depthWrite:!1});return{material1:n,material2:t,material3:l}}var ne=function(a){try{if(a.isMesh)switch(q.push(a),a.name){case"Body001":a.material=F().material1,a.castShadow=!0,g=a.material;break;case"Skeletal":a.material=F().material2,a.castShadow=!0;break;case"Circulatory_Heart":a.material=F().material3,a.castShadow=!0;break;default:break}}catch(r){console.log("error:",r),console.error("\u8BBE\u7F6E\u8272\u5F69\u51FA\u9519, child:",a)}};function ie(){if(g.uniforms&&g.uniforms.cameraMatrix){var c=new e.X().multiplyMatrices(s.projectionMatrix,s.matrixWorldInverse);g.uniforms.cameraMatrix.value=c}}var le=function(a){var r=new e.j(.1,.1,.1),o=new e.Z({color:13434777,transparent:!0,opacity:0}),n=new e.Y(r,o);return n.position.copy(a),n.castShadow=!1,m.add(n),n},ve=function(){for(var a=[],r=0;r<M;r++){var o=void 0;r<=3?o=[{x:3/3,y:.2+r/2,z:-3/3},{x:3/3,y:.1+r*3/2,z:3/3},{x:-3/3,y:.1+r*5/2,z:3/3},{x:-3/3,y:(1+r-2)*7/2,z:-3/3}]:r>=17?o=[{x:3/2,y:(2+r)/3,z:-3/2},{x:3/2,y:(1+r)/3,z:3/2},{x:-3/2,y:(1+r)/3,z:3/2},{x:-3/2,y:(1+r+2)/3,z:-3/2}]:o=[{x:3/2,y:(2+r)/3,z:-3/2},{x:3/2,y:(1+r)/3,z:3/2},{x:-3/2,y:(1+r)/3,z:3/2},{x:-3/2,y:(1+r)/3,z:-3/2}],a.push(o)}a.map(function(n){var t=n.map(function(w){return le(w)}),l=new e.n(t.map(function(w){return w.position}));l.curveType="chordal",l.closed=!0,l.castShadow=!0;var i=l.getPoints(50),u=new e.L(new e.m().setFromPoints(i),new e.M({color:16777215,transparent:!0,opacity:.1}));u.castShadow=!1,u.className="lineTrack",m.add(u),V.push(l),re.push(u)}),ce()},ce=function(){for(var a=0;a<M*2;a++){var r=V[Math.floor(a/2)].getPointAt(Math.random()),o=new e.Gb(.1,32,16),n=new e.Ab({color:16776960}),t=new e.Y(o,n);t.position.copy(r),m.add(t),U.push(t)}se()},se=function(){for(var a=new e.Gb(.1,20,20),r=new e.Z({color:14280447}),o=0;o<M;o++){b[o]=[[],[]];for(var n=0;n<40;n++){var t=new e.Y(a,r);m.add(t),b[o][n%2].push(t)}}};return Object(I.useEffect)(Object(R.a)(E.a.mark(function c(){return E.a.wrap(function(r){for(;;)switch(r.prev=r.next){case 0:return r.next=2,ae();case 2:return r.next=4,ve();case 4:case"end":return r.stop()}},c)})),[]),Object(S.jsx)("div",{children:Object(S.jsx)("div",{className:j.a.output,id:"webgl-output",children:Object(S.jsx)(k.a,{id:"testAnt",type:"primary",style:{display:"none",position:"absolute"},children:"\u6D4B\u8BD5antdesign"})})})};O.default=Z}}]);
