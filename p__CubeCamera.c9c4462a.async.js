(window.webpackJsonp=window.webpackJsonp||[]).push([[14],{"2Xcd":function(te,S,p){te.exports={"webgl-output":"webgl-output___27Ftf",infoWindow:"infoWindow___rqOPQ"}},"4DJe":function(te,S,p){"use strict";p.d(S,"a",function(){return Q});var o=p("8GEk");const X={type:"change"},x={type:"start"},Z={type:"end"};class Q extends o.y{constructor(I,R){super();R===void 0&&console.warn('THREE.OrbitControls: The second parameter "domElement" is now mandatory.'),R===document&&console.error('THREE.OrbitControls: "document" should not be used as the target "domElement". Please use "renderer.domElement" instead.'),this.object=I,this.domElement=R,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new o.Rb,this.minDistance=0,this.maxDistance=Infinity,this.minZoom=0,this.maxZoom=Infinity,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-Infinity,this.maxAzimuthAngle=Infinity,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:o.U.ROTATE,MIDDLE:o.U.DOLLY,RIGHT:o.U.PAN},this.touches={ONE:o.Jb.ROTATE,TWO:o.Jb.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return c.phi},this.getAzimuthalAngle=function(){return c.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(t){t.addEventListener("keydown",ye),this._domElementKeyEvents=t},this.saveState=function(){e.target0.copy(e.target),e.position0.copy(e.object.position),e.zoom0=e.object.zoom},this.reset=function(){e.target.copy(e.target0),e.object.position.copy(e.position0),e.object.zoom=e.zoom0,e.object.updateProjectionMatrix(),e.dispatchEvent(X),e.update(),r=s.NONE},this.update=function(){const t=new o.Rb,n=new o.tb().setFromUnitVectors(I.up,new o.Rb(0,1,0)),u=n.clone().invert(),d=new o.Rb,y=new o.tb,C=2*Math.PI;return function(){const Te=e.object.position;t.copy(Te).sub(e.target),t.applyQuaternion(n),c.setFromVector3(t),e.autoRotate&&r===s.NONE&&v(O()),e.enableDamping?(c.theta+=P.theta*e.dampingFactor,c.phi+=P.phi*e.dampingFactor):(c.theta+=P.theta,c.phi+=P.phi);let _=e.minAzimuthAngle,D=e.maxAzimuthAngle;return isFinite(_)&&isFinite(D)&&(_<-Math.PI?_+=C:_>Math.PI&&(_-=C),D<-Math.PI?D+=C:D>Math.PI&&(D-=C),_<=D?c.theta=Math.max(_,Math.min(D,c.theta)):c.theta=c.theta>(_+D)/2?Math.max(_,c.theta):Math.min(D,c.theta)),c.phi=Math.max(e.minPolarAngle,Math.min(e.maxPolarAngle,c.phi)),c.makeSafe(),c.radius*=U,c.radius=Math.max(e.minDistance,Math.min(e.maxDistance,c.radius)),e.enableDamping===!0?e.target.addScaledVector(l,e.dampingFactor):e.target.add(l),t.setFromSpherical(c),t.applyQuaternion(u),Te.copy(e.target).add(t),e.object.lookAt(e.target),e.enableDamping===!0?(P.theta*=1-e.dampingFactor,P.phi*=1-e.dampingFactor,l.multiplyScalar(1-e.dampingFactor)):(P.set(0,0,0),l.set(0,0,0)),U=1,Y||d.distanceToSquared(e.object.position)>oe||8*(1-y.dot(e.object.quaternion))>oe?(e.dispatchEvent(X),d.copy(e.object.position),y.copy(e.object.quaternion),Y=!1,!0):!1}}(),this.dispose=function(){e.domElement.removeEventListener("contextmenu",Pe),e.domElement.removeEventListener("pointerdown",be),e.domElement.removeEventListener("pointercancel",Ee),e.domElement.removeEventListener("wheel",ge),e.domElement.removeEventListener("pointermove",ce),e.domElement.removeEventListener("pointerup",ue),e._domElementKeyEvents!==null&&e._domElementKeyEvents.removeEventListener("keydown",ye)};const e=this,s={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let r=s.NONE;const oe=1e-6,c=new o.Hb,P=new o.Hb;let U=1;const l=new o.Rb;let Y=!1;const m=new o.Qb,A=new o.Qb,f=new o.Qb,b=new o.Qb,g=new o.Qb,h=new o.Qb,w=new o.Qb,E=new o.Qb,j=new o.Qb,i=[],k={};function O(){return 2*Math.PI/60/60*e.autoRotateSpeed}function N(){return Math.pow(.95,e.zoomSpeed)}function v(t){P.theta-=t}function G(t){P.phi-=t}const J=function(){const t=new o.Rb;return function(u,d){t.setFromMatrixColumn(d,0),t.multiplyScalar(-u),l.add(t)}}(),z=function(){const t=new o.Rb;return function(u,d){e.screenSpacePanning===!0?t.setFromMatrixColumn(d,1):(t.setFromMatrixColumn(d,0),t.crossVectors(e.object.up,t)),t.multiplyScalar(u),l.add(t)}}(),T=function(){const t=new o.Rb;return function(u,d){const y=e.domElement;if(e.object.isPerspectiveCamera){const C=e.object.position;t.copy(C).sub(e.target);let ee=t.length();ee*=Math.tan(e.object.fov/2*Math.PI/180),J(2*u*ee/y.clientHeight,e.object.matrix),z(2*d*ee/y.clientHeight,e.object.matrix)}else e.object.isOrthographicCamera?(J(u*(e.object.right-e.object.left)/e.object.zoom/y.clientWidth,e.object.matrix),z(d*(e.object.top-e.object.bottom)/e.object.zoom/y.clientHeight,e.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),e.enablePan=!1)}}();function F(t){e.object.isPerspectiveCamera?U/=t:e.object.isOrthographicCamera?(e.object.zoom=Math.max(e.minZoom,Math.min(e.maxZoom,e.object.zoom*t)),e.object.updateProjectionMatrix(),Y=!0):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),e.enableZoom=!1)}function V(t){e.object.isPerspectiveCamera?U*=t:e.object.isOrthographicCamera?(e.object.zoom=Math.max(e.minZoom,Math.min(e.maxZoom,e.object.zoom/t)),e.object.updateProjectionMatrix(),Y=!0):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),e.enableZoom=!1)}function M(t){m.set(t.clientX,t.clientY)}function L(t){w.set(t.clientX,t.clientY)}function H(t){b.set(t.clientX,t.clientY)}function $(t){A.set(t.clientX,t.clientY),f.subVectors(A,m).multiplyScalar(e.rotateSpeed);const n=e.domElement;v(2*Math.PI*f.x/n.clientHeight),G(2*Math.PI*f.y/n.clientHeight),m.copy(A),e.update()}function ae(t){E.set(t.clientX,t.clientY),j.subVectors(E,w),j.y>0?F(N()):j.y<0&&V(N()),w.copy(E),e.update()}function ie(t){g.set(t.clientX,t.clientY),h.subVectors(g,b).multiplyScalar(e.panSpeed),T(h.x,h.y),b.copy(g),e.update()}function se(){}function re(t){t.deltaY<0?V(N()):t.deltaY>0&&F(N()),e.update()}function le(t){let n=!1;switch(t.code){case e.keys.UP:T(0,e.keyPanSpeed),n=!0;break;case e.keys.BOTTOM:T(0,-e.keyPanSpeed),n=!0;break;case e.keys.LEFT:T(e.keyPanSpeed,0),n=!0;break;case e.keys.RIGHT:T(-e.keyPanSpeed,0),n=!0;break}n&&(t.preventDefault(),e.update())}function W(){if(i.length===1)m.set(i[0].pageX,i[0].pageY);else{const t=.5*(i[0].pageX+i[1].pageX),n=.5*(i[0].pageY+i[1].pageY);m.set(t,n)}}function B(){if(i.length===1)b.set(i[0].pageX,i[0].pageY);else{const t=.5*(i[0].pageX+i[1].pageX),n=.5*(i[0].pageY+i[1].pageY);b.set(t,n)}}function K(){const t=i[0].pageX-i[1].pageX,n=i[0].pageY-i[1].pageY,u=Math.sqrt(t*t+n*n);w.set(0,u)}function q(){e.enableZoom&&K(),e.enablePan&&B()}function pe(){e.enableZoom&&K(),e.enableRotate&&W()}function he(t){if(i.length==1)A.set(t.pageX,t.pageY);else{const u=de(t),d=.5*(t.pageX+u.x),y=.5*(t.pageY+u.y);A.set(d,y)}f.subVectors(A,m).multiplyScalar(e.rotateSpeed);const n=e.domElement;v(2*Math.PI*f.x/n.clientHeight),G(2*Math.PI*f.y/n.clientHeight),m.copy(A)}function me(t){if(i.length===1)g.set(t.pageX,t.pageY);else{const n=de(t),u=.5*(t.pageX+n.x),d=.5*(t.pageY+n.y);g.set(u,d)}h.subVectors(g,b).multiplyScalar(e.panSpeed),T(h.x,h.y),b.copy(g)}function fe(t){const n=de(t),u=t.pageX-n.x,d=t.pageY-n.y,y=Math.sqrt(u*u+d*d);E.set(0,y),j.set(0,Math.pow(E.y/w.y,e.zoomSpeed)),F(j.y),w.copy(E)}function Me(t){e.enableZoom&&fe(t),e.enablePan&&me(t)}function _e(t){e.enableZoom&&fe(t),e.enableRotate&&he(t)}function De(){}function be(t){e.enabled!==!1&&(i.length===0&&(e.domElement.setPointerCapture(t.pointerId),e.domElement.addEventListener("pointermove",ce),e.domElement.addEventListener("pointerup",ue)),je(t),t.pointerType==="touch"?ve(t):Ae(t))}function ce(t){e.enabled!==!1&&(t.pointerType==="touch"?xe(t):Le(t))}function ue(t){e.enabled!==!1&&(t.pointerType==="touch"?Ie():Re(t),Oe(t),i.length===0&&(e.domElement.releasePointerCapture(t.pointerId),e.domElement.removeEventListener("pointermove",ce),e.domElement.removeEventListener("pointerup",ue)))}function Ee(t){Oe(t)}function Ae(t){let n;switch(t.button){case 0:n=e.mouseButtons.LEFT;break;case 1:n=e.mouseButtons.MIDDLE;break;case 2:n=e.mouseButtons.RIGHT;break;default:n=-1}switch(n){case o.U.DOLLY:if(e.enableZoom===!1)return;L(t),r=s.DOLLY;break;case o.U.ROTATE:if(t.ctrlKey||t.metaKey||t.shiftKey){if(e.enablePan===!1)return;H(t),r=s.PAN}else{if(e.enableRotate===!1)return;M(t),r=s.ROTATE}break;case o.U.PAN:if(t.ctrlKey||t.metaKey||t.shiftKey){if(e.enableRotate===!1)return;M(t),r=s.ROTATE}else{if(e.enablePan===!1)return;H(t),r=s.PAN}break;default:r=s.NONE}r!==s.NONE&&e.dispatchEvent(x)}function Le(t){if(e.enabled!==!1)switch(r){case s.ROTATE:if(e.enableRotate===!1)return;$(t);break;case s.DOLLY:if(e.enableZoom===!1)return;ae(t);break;case s.PAN:if(e.enablePan===!1)return;ie(t);break}}function Re(t){se(t),e.dispatchEvent(Z),r=s.NONE}function ge(t){e.enabled===!1||e.enableZoom===!1||r!==s.NONE||(t.preventDefault(),e.dispatchEvent(x),re(t),e.dispatchEvent(Z))}function ye(t){e.enabled===!1||e.enablePan===!1||le(t)}function ve(t){switch(we(t),i.length){case 1:switch(e.touches.ONE){case o.Jb.ROTATE:if(e.enableRotate===!1)return;W(),r=s.TOUCH_ROTATE;break;case o.Jb.PAN:if(e.enablePan===!1)return;B(),r=s.TOUCH_PAN;break;default:r=s.NONE}break;case 2:switch(e.touches.TWO){case o.Jb.DOLLY_PAN:if(e.enableZoom===!1&&e.enablePan===!1)return;q(),r=s.TOUCH_DOLLY_PAN;break;case o.Jb.DOLLY_ROTATE:if(e.enableZoom===!1&&e.enableRotate===!1)return;pe(),r=s.TOUCH_DOLLY_ROTATE;break;default:r=s.NONE}break;default:r=s.NONE}r!==s.NONE&&e.dispatchEvent(x)}function xe(t){switch(we(t),r){case s.TOUCH_ROTATE:if(e.enableRotate===!1)return;he(t),e.update();break;case s.TOUCH_PAN:if(e.enablePan===!1)return;me(t),e.update();break;case s.TOUCH_DOLLY_PAN:if(e.enableZoom===!1&&e.enablePan===!1)return;Me(t),e.update();break;case s.TOUCH_DOLLY_ROTATE:if(e.enableZoom===!1&&e.enableRotate===!1)return;_e(t),e.update();break;default:r=s.NONE}}function Ie(t){De(t),e.dispatchEvent(Z),r=s.NONE}function Pe(t){e.enabled!==!1&&t.preventDefault()}function je(t){i.push(t)}function Oe(t){delete k[t.pointerId];for(let n=0;n<i.length;n++)if(i[n].pointerId==t.pointerId){i.splice(n,1);return}}function we(t){let n=k[t.pointerId];n===void 0&&(n=new o.Qb,k[t.pointerId]=n),n.set(t.pageX,t.pageY)}function de(t){const n=t.pointerId===i[0].pointerId?i[1]:i[0];return k[n.pointerId]}e.domElement.addEventListener("contextmenu",Pe),e.domElement.addEventListener("pointerdown",be),e.domElement.addEventListener("pointercancel",Ee),e.domElement.addEventListener("wheel",ge,{passive:!1}),this.update()}}class a extends Q{constructor(I,R){super(I,R);this.screenSpacePanning=!1,this.mouseButtons.LEFT=o.U.PAN,this.mouseButtons.RIGHT=o.U.ROTATE,this.touches.ONE=o.Jb.PAN,this.touches.TWO=o.Jb.DOLLY_ROTATE}}},tsdP:function(te,S,p){"use strict";p.r(S);var o=p("ld8g"),X=p("SJBw"),x=p("1QO0"),Z=p.n(x),Q=p("tWIW"),a=p("8GEk"),ne=p("4DJe"),I=p("2Xcd"),R=p.n(I),e=p("t12N"),s=p.n(e),r=function(){var c=new Q.a,P=[],U=new Object,l,Y=[],m,A,f,b,g,h,w,E,j,i,k=0,O,N={lightProbeIntensity:1,directionalLightIntensity:.2,envMapIntensity:1},v,G=function(){v=document.getElementById("webgl-output");var T=new a.Mb;l=new a.zb,O=new a.Wb,O.setClearColor(new a.q(15658734)),O.setSize(v.offsetWidth,window.innerHeight),O.shadowMap.enabled=!0;var F=new a.g(200);l.add(F),f=new a.Ib(16777215),f.position.set(30,30,-30),f.castShadow=!0,f.angle=Math.PI/10,f.shadow.penumbra=.05,f.shadow.mapSize.width=1024,f.shadow.mapSize.height=1024,l.add(f),b=new a.b(4473924),l.add(b),g=new a.pb(16777215),g.position.set(400,200,300),l.add(g),m=new a.nb(45,v.offsetWidth/window.innerHeight,.1,2e3),m.position.x=0,m.position.y=0,m.position.z=15,m.lookAt(0,0,0);var V=new a.Ub(256,{encoding:a.Xb,format:a.vb});E=new a.r(.1,1e3,V),l.add(E),h=new a.v(16777215),h.position.set(0,20,20),h.castShadow=!0,h.shadow.camera.top=10,h.shadow.camera.bottom=-10,h.shadow.camera.left=-10,h.shadow.camera.right=10,h.castShadow=!0,l.add(h);var M="./img/",L=".jpg",H=[M+"px"+L,M+"nx"+L,M+"py"+L,M+"ny"+L,M+"pz"+L,M+"nz"+L],$=new a.t().load(H),ae=new a.t().load(H);ae.mapping=a.s,l=new a.zb,l.background=$;var ie=new a.Gb(5,64,32),se=new a.db({color:"fffffff",metalness:0,roughness:0,envMap:$,envMapIntensity:N.envMapIntensity});w=new a.Y(ie,se),l.add(w),b=new a.b(4473924),l.add(b);var re=new a.Fb(2,100,50);console.log("\u76F8\u673A",E);var le=new a.Z({envMap:E.renderTarget.texture,map:T.load("./img/img_12.png")}),W=new a.bb({map:T.load("./img/img_11.png")}),B=new a.Y(re,le);B.position.set(-10,0,0),l.add(B);var K=new a.Y(new a.Gb(2,2,2),W);K.position.set(-5,0,0),l.add(K);var q=new a.Y(new a.Nb(2,1,16,100),W);q.position.set(-18,0,0),l.add(q),console.log(l),window.document.getElementById("webgl-output").appendChild(O.domElement),J();var pe=new ne.a(m,O.domElement)},J=function z(){E.update(O,l),O.render(l,m),requestAnimationFrame(z)};return Object(x.useEffect)(function(){G()},[]),Object(e.jsx)("div",{children:Object(e.jsx)("div",{className:R.a.output,id:"webgl-output",children:Object(e.jsx)(X.a,{id:"testAnt",type:"primary",style:{display:"none",position:"absolute"},children:"\u6D4B\u8BD5antdesign"})})})};S.default=r}}]);