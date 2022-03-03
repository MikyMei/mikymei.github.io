(window.webpackJsonp=window.webpackJsonp||[]).push([[25],{"3buQ":function(N,T,s){"use strict";T.a={forMaterial:function(g,b){if(!b||!g)return!1;Array.isArray(g)?g.forEach(function(w){b(w)}):b(g)}}},dYlh:function(N,T,s){"use strict";s.r(T);var S=s("ULjY"),g=s("tGGB"),b=s("NUIj"),w=s.n(b),G=s("1QO0"),Me=s.n(G),ee=s("tWIW"),t=s("8GEk"),M=s("R5+H"),re=s("4DJe"),te=s("vxRp"),oe=s.n(te),ne=s("3buQ"),R=s("t12N"),Pe=s.n(R),ae=function(){var m,d,p,K,h,x,Y,k,Se,L,be,_,De=null,Ee,D,ie,Ve,Le,O,Oe="add",z=!0,J=[],C={value:0},B={value:0},j=!1,le=new ee.a,E=20,ze=[E],H=0,Be,We,Ae,Fe,Re,je,ve=[],Q=[],I=[],se=Math.PI*2,P=-se,W,V=30,X=70,y=0,$=new Array,ue=function(){K=new t.p,h=document.getElementById("webgl-output");var e=new t.Mb;m=new t.zb,p=new t.Wb({antialias:!0}),p.setPixelRatio(window.devicePixelRatio),p.setClearColor(new t.q("#403f3f")),p.setSize(h.offsetWidth,window.innerHeight),p.shadowMap.enabled=!0,p.alpha=!0;var n=new t.f;x=new t.Ib(16777215),x.position.set(30,30,0),x.castShadow=!0,x.angle=Math.PI/7,x.shadow.penumbra=.05,x.shadow.mapSize.width=1024,x.shadow.mapSize.height=1024,Y=new t.b(16777215),m.add(Y),k=new t.pb("#ffffff"),k.position.set(400,200,300),d=new t.nb(45,h.offsetWidth/window.innerHeight,.1,1e4),d.position.set(0,10,40),d.lookAt(0,10,0),window.document.getElementById("webgl-output").appendChild(p.domElement),L=new re.a(d,p.domElement),L.enableDamping=!0,window.addEventListener("resize",me),D=new t.D,le.load("./img/111.gltf",function(){var o=Object(g.a)(w.a.mark(function r(a){var i;return w.a.wrap(function(l){for(;;)switch(l.prev=l.next){case 0:_=a.scene,_.scale.setScalar(80,80,80),_.position.setY(-10),de(),m.add(_),_.traverse(we),ie=_.children[0],i=new t.d(_);case 8:case"end":return l.stop()}},r)}));return function(r){return o.apply(this,arguments)}}(),void 0,function(o){console.error(o)}),W=new t.D,m.add(W),pe(),document.getElementById("webgl-output").addEventListener("click",function(o){return ye(o)}),setTimeout(function(){j=!0},200)},de=function(){for(var e=new t.Fb(.05,10,10),n=0,o=0;o<V;o++)for(var r=0;r<X;r++){var a=new t.q,i=o*10-V*10/2,u=r*10-V*10,l=o*10-V*10/2,f=new t.rb({color:"#ffffff",size:1,opacity:1,transparent:!0,blending:t.a,depthTest:!0}),c=new t.Y(e,f);$.push(c),c.position.x=i,c.position.y=u,c.position.z=l,D.add(c)}m.add(D)},ce=function(){for(var e=new t.Rb(0,-10,0),n=0,o=0;o<V;o++)for(var r=0;r<X;r++){var a=$[n++];if(a){a.position.x=Math.cos(r+y*.1)*Math.sin(r+o+y*.1)*10,a.position.y=-12,a.position.z=Math.cos(o+y*.1)*Math.sin(r+y*.1)*10,a.scale.x=a.scale.x=(Math.sin((o+y)*.1)+1)*1+(Math.cos((r+y)*.2)+1)*1*.5;var i=a.position.distanceTo(e);i>11&&console.log(i),a.material.color.setRGB(i*23/255,1,208/255),a.rotateY(-.02)}}p.render(m,d)},fe=function(e){e.geometry.computeBoundingBox(),e.geometry.computeBoundingSphere();var n,o=e.geometry,r=o.boundingSphere,a=r.center,i=r.radius,u=o.boundingBox,l=u.max,f=u.min,c=new t.Rb(l.x-f.x,l.y-f.y,l.z-f.z);return ne.a.forMaterial(e.material,function(A){A.transparent=!0,A.color.setStyle("#ffffff"),O={uniforms:{time:C,uStartTime:B,uCenter:{value:new t.Rb(0,0,0)},uSize:{value:c},uMax:{value:l},uMin:{value:f},uTopColor:{value:new t.q("#003300")},uDiffusion:{value:new t.Rb(1,4,8)},uColor:{value:new t.q("#fffa89")},uOpacity:{value:1},uRadius:{value:i},coeficient:{type:"f",value:1},power:{type:"f",value:.9},glowColor:{type:"c",value:new t.q("rgb(47,156,255)")},cameraMatrix:{value:new t.X}},vertexShader:`
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
          }`,fragmentShader:`
          float distanceTo(vec2 src, vec2 dst) {
            float dx = src.x - dst.x;
            float dy = src.y - dst.y;
            float dv = dx * dx + dy * dy;
            return sqrt(dv);
        }
          varying vec4 vPositionMatrix;
          varying vec3 vPosition;

          uniform float time;
          // \u6269\u6563\u53C2\u6570
          uniform float uRadius;
          uniform float uOpacity;
          // \u521D\u59CB\u52A8\u753B\u53C2\u6570
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
          // \u5F00\u542F\u6269\u6563\u6CE2
          vec2 position2D = vec2(vPosition.x, vPosition.y);
          if (uDiffusion.x > 0.5) {
              // \u6269\u6563\u901F\u5EA6
              float dTime = mod(time * uDiffusion.z, uRadius * 2.0);
              // \u5F53\u524D\u7684\u79BB\u4E2D\u5FC3\u70B9\u8DDD\u79BB
              float uLen = distanceTo(position2D, vec2(uCenter.x, uCenter.z));
              // \u6269\u6563\u8303\u56F4
              if (uLen < dTime && uLen > dTime - uDiffusion.y) {
                  // \u989C\u8272\u6E10\u53D8
                  float dIndex = sin((dTime - uLen) / uDiffusion.y );
                  distColor = mix(uColor, distColor, dIndex);
              }
          }
          vec3 worldCameraToVertex= vVertexWorldPosition - cameraPosition;
          vec3 viewCameraToVertex	= (viewMatrix * vec4(worldCameraToVertex, 0.0)).xyz;
          viewCameraToVertex	= normalize(viewCameraToVertex);
          float intensity	= pow(coeficient + dot(vVertexNormal, viewCameraToVertex),power);
          gl_FragColor	= vec4(distColor, 1) * intensity ;
          }`},n=new t.Ab({uniforms:O.uniforms,vertexShader:O.vertexShader,fragmentShader:O.fragmentShader,blending:t.ib,transparent:!0,depthWrite:!1})}),{materialBody:n}},me=function(){d.aspect=h.offsetWidth/window.innerHeight,d.updateProjectionMatrix(),p.setSize(h.offsetWidth,window.innerHeight)},pe=function v(){he();var e=10*1e3,n=Date.now(),o=n*6%e/e;H=(H+1)%E,L&&M&&(L.update(),M.update()),D.children.length>0&&D.rotateY(-.02),window.requestAnimationFrame(v)},ge=function(e){Q.map(function(){var n=Object(g.a)(w.a.mark(function o(r,a){var i;return w.a.wrap(function(l){for(;;)switch(l.prev=l.next){case 0:return i=I[Math.floor(a/2)].getPointAt(a%2==0?e:1-e),l.next=3,r.position.copy(i);case 3:case"end":return l.stop()}},o)}));return function(o,r){return n.apply(this,arguments)}}())},Z=function(){var e=["varying vec3	vVertexWorldPosition;","varying vec3	vVertexNormal;","varying vec4	vFragColor;","void main(){","	vVertexNormal	= normalize(normalMatrix * normal);","	vVertexWorldPosition	= (modelMatrix * vec4(position, 1)).xyz;","	// set gl_Position","	gl_Position	= projectionMatrix * modelViewMatrix * vec4(position, 1);","}"].join(`
`),n={uniforms:{coeficient:{type:"f",value:1},power:{type:"f",value:.5},glowColor:{type:"c",value:new t.q("#51AEF4")}},vertexShader:e,fragmentShader:["uniform vec3	glowColor;","uniform float	coeficient;","uniform float	power;","varying vec3	vVertexNormal;","varying vec3	vVertexWorldPosition;","varying vec4	vFragColor;","void main(){","	vec3 worldCameraToVertex= vVertexWorldPosition - cameraPosition;","	vec3 viewCameraToVertex	= (viewMatrix * vec4(worldCameraToVertex, 0.0)).xyz;","	viewCameraToVertex	= normalize(viewCameraToVertex);","	float intensity		= pow(coeficient + dot(vVertexNormal, viewCameraToVertex), power);","	gl_FragColor		= vec4(glowColor, intensity);","}"].join(`
`)},o={uniforms:{coeficient:{type:"f",value:1},power:{type:"f",value:1},glowColor:{type:"c",value:new t.q("#336AAC")}},vertexShader:e,fragmentShader:["uniform vec3	glowColor;","uniform float	coeficient;","uniform float	power;","varying vec3	vVertexNormal;","varying vec3	vVertexWorldPosition;","varying vec4	vFragColor;","void main(){","	vec3 worldCameraToVertex= vVertexWorldPosition - cameraPosition;","	vec3 viewCameraToVertex	= (viewMatrix * vec4(worldCameraToVertex, 0.0)).xyz;","	viewCameraToVertex	= normalize(viewCameraToVertex);","	float intensity		= pow(coeficient + dot(vVertexNormal, viewCameraToVertex), power);","	gl_FragColor		= vec4(glowColor, intensity);","}"].join(`
`)},r={uniforms:{coeficient:{type:"f",value:1},power:{type:"f",value:.2},glowColor:{type:"c",value:new t.q("red")}},vertexShader:e,fragmentShader:["uniform vec3	glowColor;","uniform float	coeficient;","uniform float	power;","varying vec3	vVertexNormal;","varying vec3	vVertexWorldPosition;","varying vec4	vFragColor;","void main(){","	vec3 worldCameraToVertex= vVertexWorldPosition - cameraPosition;","	vec3 viewCameraToVertex	= (viewMatrix * vec4(worldCameraToVertex, 0.0)).xyz;","	viewCameraToVertex	= normalize(viewCameraToVertex);","	float intensity		= pow(coeficient + dot(vVertexNormal, viewCameraToVertex), power);","	gl_FragColor		= vec4(glowColor, intensity);","}"].join(`
`)},a=new t.Ab({uniforms:n.uniforms,vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,blending:t.ib,transparent:!0,depthWrite:!1,visible:!0}),i=new t.Ab({uniforms:o.uniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader,blending:t.ib,transparent:!0,depthWrite:!1,visible:!0}),u=new t.Ab({uniforms:r.uniforms,vertexShader:r.vertexShader,fragmentShader:r.fragmentShader,blending:t.ib,transparent:!0,depthWrite:!1,visible:!0});return{material1:a,material2:i,material3:u}},we=function(e){try{if(e.isMesh)switch(J.push(e),e.name){case"Body001":e.material=fe(e).materialBody,e.castShadow=!0;break;case"Skeletal":e.material=Z().material2,e.castShadow=!0;break;case"Circulatory_Heart":e.material=Z().material3,e.castShadow=!0;break;default:break}}catch(n){console.log("error:",n),console.error("\u8BBE\u7F6E\u8272\u5F69\u51FA\u9519, child:",e)}},he=function(){var e=K.getDelta();if(e>1)return!1;C.value>=2.6||z===!0?(C.value-=e,C.value<=0&&(z=!1)):(C.value<=0||z===!1)&&(C.value+=e,C.value>=2.6&&(z=!0)),j&&(B.value+=e*.6,B.value>=1&&(B.value=1,j=!1)),P+=.02,P>Math.PI*.7&&(P=-Math.PI*.7),ge(Math.abs(P%Math.PI/Math.PI)),W.children.forEach(function(n,o){n.material.uniforms.time.value=P}),y+=.03,ce()},xe=function(e){var n=new t.j(.1,.1,.1),o=new t.Z({color:13434777,transparent:!0,opacity:0}),r=new t.Y(n,o);return r.position.copy(e),r.castShadow=!1,r},_e=function(){for(var e=[{x:0,z:3},{x:3,z:0},{x:0,z:-3},{x:-3,z:0}],n=E-1-4,o=[],r=0;r<E;r++){var a=void 0;r>=n?a=[Object(S.a)({y:-10},e[(r-n+0)%e.length]),Object(S.a)({y:-3},e[(r-n+1)%e.length]),Object(S.a)({y:2},e[(r-n+2)%e.length]),Object(S.a)({y:5},e[(r-n+3)%e.length])]:a=[{x:(-3-r/3)/2,y:Math.floor((r-12)/2),z:-5/2},{x:(-3-r/3)/2,y:Math.floor((r-12)/2),z:3/2},{x:0,y:Math.floor((r-12)/2),z:3/2},{x:(3+r/3)/2,y:Math.floor((r-12)/2),z:3/2},{x:(3+r/3)/2,y:Math.floor((r-12)/2),z:-5/2}],o.push(a)}o.map(function(i){var u=i.map(function(U){return xe(U)}),l=new t.n(u.map(function(U){return U.position}),{closed:i.length>4});l.curveType="centripetal",l.closed=i.length>4,l.castShadow=!0;var f=l.getPoints(200),c;i.length>=5?c=Math.random()>.5:c=!0;var A=c?q(u[0].position,u[u.length-1].position):q(u[u.length-1].position,u[0].position),F=new t.L(new t.m().setFromPoints(f),A);F.castShadow=!1,F.className="lineTrack",W.add(F),I.push(l),ve.push(F)}),Ce()},Ce=function(){for(var e=0;e<E*2;e++){var n=I[Math.floor(e/2)].getPointAt(Math.random()),o=new t.Gb(.05,32,16),r=new t.Z({color:"#ffff00",opacity:.1}),a=new t.Y(o,r);a.position.copy(n),Q.push(a)}},Ie=function(){var e=document.createElement("canvas");e.width=16,e.height=16;var n=e.getContext("2d"),o=n.createRadialGradient(e.width/2,e.height/2,0,e.width/2,e.height/2,e.width/2);o.addColorStop(0,"rgba(255,255,255,1)"),o.addColorStop(.005,"rgba(139,69,19,1)"),o.addColorStop(.4,"rgba(139,69,19,1)"),o.addColorStop(1,"rgba(0,0,0,1)"),n.fillStyle=o,n.fillRect(0,0,e.width,e.height);var r=new t.Lb(e);return r.needsUpdate=!0,r},q=function(e,n){var o=` varying vec3 vPosition;
    varying vec4 vColor;
    void main() {
        vPosition = position;
        vColor = vec4(color, 1);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,r=`uniform vec3 targetPos; // \u76EE\u6807\u4F4D\u7F6E
    uniform float vLength;  // \u8DDD\u79BB
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
    }`,a={targetPos:{value:n},vLength:{value:e.distanceTo(n)},time:{value:P},color:{value:new t.q("#4ff6ca")}},i=new t.Ab({uniforms:a,vertexShader:o,fragmentShader:r,transparent:!0,vertexColors:t.Tb});return i},Ue=function(e){new M.Tween(d.position).to({x:e.point.x,y:e.point.y,z:1},3e3).easing(M.Easing.Quadratic.InOut).onUpdate(function(){m.position.x=e.point.x,m.position.y=-e.point.y*2,m.position.z=e.point.z*1,d.updateMatrixWorld()}).start(),d.lookAt(d.position)},ye=function(e){var n=(e.clientX-h.getBoundingClientRect().left)/h.offsetWidth*2-1,o=-((e.clientY-h.getBoundingClientRect().top)/window.innerHeight)*2+1,r=e.clientX/window.innerWidth*2-1,a=-(e.clientY/window.innerHeight)*2+1;console.log("\u5C4F\u5E55\u70B9\u51FB\u4F4D\u7F6E:",e.clientX,e.clientY),console.log("\u5C4F\u5E55\u70B9\u51FB\u4F4D\u7F6E\u8F6C\u5316\u4E3A\u4E16\u754C\u5750\u6807(\u4EE5maincanvs):",n,o),console.log("\u5C4F\u5E55\u70B9\u51FB\u4F4D\u7F6E\u8F6C\u5316\u4E3A\u4E16\u754C\u5750\u6807(\u4EE5window):",r,a);var i=new t.xb;i.setFromCamera(new t.Qb(n,o),d);var u=J,l=2e3,f=i.intersectObjects(u,!0);if(console.log("\u70B9\u51FB\u9009\u4E2D\u7684\u7F51\u683C\u6A21\u578B",f),f.length>0){f[0].object.geometry.computeBoundingBox(),console.log(f[0]);var c=f[0];new M.Tween(d.position).to({x:c.point.x,y:c.point.y,z:10},3e3).easing(M.Easing.Quadratic.InOut).onUpdate(function(){m.position.x=c.point.x,m.position.y=-c.point.y,m.position.z=-10,d.updateMatrixWorld()}).start(),d.lookAt(d.position)}};return Object(G.useEffect)(Object(g.a)(w.a.mark(function v(){return w.a.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,ue();case 2:return n.next=4,_e();case 4:case"end":return n.stop()}},v)}))),Object(R.jsx)("div",{children:Object(R.jsx)("div",{className:oe.a.output,id:"webgl-output"})})};T.default=ae},vxRp:function(N,T,s){}}]);
