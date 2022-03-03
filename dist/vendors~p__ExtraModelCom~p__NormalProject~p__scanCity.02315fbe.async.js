(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{"4DJe":function(pt,m,g){"use strict";g.d(m,"a",function(){return j});var u=g("8GEk");const R={type:"change"},w={type:"start"},P={type:"end"};class j extends u.y{constructor(L,D){super();D===void 0&&console.warn('THREE.OrbitControls: The second parameter "domElement" is now mandatory.'),D===document&&console.error('THREE.OrbitControls: "document" should not be used as the target "domElement". Please use "renderer.domElement" instead.'),this.object=L,this.domElement=D,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new u.Rb,this.minDistance=0,this.maxDistance=Infinity,this.minZoom=0,this.maxZoom=Infinity,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-Infinity,this.maxAzimuthAngle=Infinity,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:u.U.ROTATE,MIDDLE:u.U.DOLLY,RIGHT:u.U.PAN},this.touches={ONE:u.Jb.ROTATE,TWO:u.Jb.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return b.phi},this.getAzimuthalAngle=function(){return b.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(n){n.addEventListener("keydown",ut),this._domElementKeyEvents=n},this.saveState=function(){e.target0.copy(e.target),e.position0.copy(e.object.position),e.zoom0=e.object.zoom},this.reset=function(){e.target.copy(e.target0),e.object.position.copy(e.position0),e.object.zoom=e.zoom0,e.object.updateProjectionMatrix(),e.dispatchEvent(R),e.update(),f=d.NONE},this.update=function(){const n=new u.Rb,l=new u.tb().setFromUnitVectors(L.up,new u.Rb(0,1,0)),y=l.clone().invert(),E=new u.Rb,M=new u.tb,F=2*Math.PI;return function(){const dt=e.object.position;n.copy(dt).sub(e.target),n.applyQuaternion(l),b.setFromVector3(n),e.autoRotate&&f===d.NONE&&Z(k()),e.enableDamping?(b.theta+=O.theta*e.dampingFactor,b.phi+=O.phi*e.dampingFactor):(b.theta+=O.theta,b.phi+=O.phi);let I=e.minAzimuthAngle,S=e.maxAzimuthAngle;return isFinite(I)&&isFinite(S)&&(I<-Math.PI?I+=F:I>Math.PI&&(I-=F),S<-Math.PI?S+=F:S>Math.PI&&(S-=F),I<=S?b.theta=Math.max(I,Math.min(S,b.theta)):b.theta=b.theta>(I+S)/2?Math.max(I,b.theta):Math.min(S,b.theta)),b.phi=Math.max(e.minPolarAngle,Math.min(e.maxPolarAngle,b.phi)),b.makeSafe(),b.radius*=N,b.radius=Math.max(e.minDistance,Math.min(e.maxDistance,b.radius)),e.enableDamping===!0?e.target.addScaledVector(A,e.dampingFactor):e.target.add(A),n.setFromSpherical(b),n.applyQuaternion(y),dt.copy(e.target).add(n),e.object.lookAt(e.target),e.enableDamping===!0?(O.theta*=1-e.dampingFactor,O.phi*=1-e.dampingFactor,A.multiplyScalar(1-e.dampingFactor)):(O.set(0,0,0),A.set(0,0,0)),N=1,U||E.distanceToSquared(e.object.position)>Y||8*(1-M.dot(e.object.quaternion))>Y?(e.dispatchEvent(R),E.copy(e.object.position),M.copy(e.object.quaternion),U=!1,!0):!1}}(),this.dispose=function(){e.domElement.removeEventListener("contextmenu",ct),e.domElement.removeEventListener("pointerdown",at),e.domElement.removeEventListener("pointercancel",rt),e.domElement.removeEventListener("wheel",lt),e.domElement.removeEventListener("pointermove",X),e.domElement.removeEventListener("pointerup",Q),e._domElementKeyEvents!==null&&e._domElementKeyEvents.removeEventListener("keydown",ut)};const e=this,d={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let f=d.NONE;const Y=1e-6,b=new u.Hb,O=new u.Hb;let N=1;const A=new u.Rb;let U=!1;const t=new u.Qb,i=new u.Qb,o=new u.Qb,s=new u.Qb,a=new u.Qb,r=new u.Qb,h=new u.Qb,p=new u.Qb,T=new u.Qb,c=[],v={};function k(){return 2*Math.PI/60/60*e.autoRotateSpeed}function H(){return Math.pow(.95,e.zoomSpeed)}function Z(n){O.theta-=n}function K(n){O.phi-=n}const J=function(){const n=new u.Rb;return function(y,E){n.setFromMatrixColumn(E,0),n.multiplyScalar(-y),A.add(n)}}(),W=function(){const n=new u.Rb;return function(y,E){e.screenSpacePanning===!0?n.setFromMatrixColumn(E,1):(n.setFromMatrixColumn(E,0),n.crossVectors(e.object.up,n)),n.multiplyScalar(y),A.add(n)}}(),x=function(){const n=new u.Rb;return function(y,E){const M=e.domElement;if(e.object.isPerspectiveCamera){const F=e.object.position;n.copy(F).sub(e.target);let z=n.length();z*=Math.tan(e.object.fov/2*Math.PI/180),J(2*y*z/M.clientHeight,e.object.matrix),W(2*E*z/M.clientHeight,e.object.matrix)}else e.object.isOrthographicCamera?(J(y*(e.object.right-e.object.left)/e.object.zoom/M.clientWidth,e.object.matrix),W(E*(e.object.top-e.object.bottom)/e.object.zoom/M.clientHeight,e.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),e.enablePan=!1)}}();function B(n){e.object.isPerspectiveCamera?N/=n:e.object.isOrthographicCamera?(e.object.zoom=Math.max(e.minZoom,Math.min(e.maxZoom,e.object.zoom*n)),e.object.updateProjectionMatrix(),U=!0):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),e.enableZoom=!1)}function V(n){e.object.isPerspectiveCamera?N*=n:e.object.isOrthographicCamera?(e.object.zoom=Math.max(e.minZoom,Math.min(e.maxZoom,e.object.zoom/n)),e.object.updateProjectionMatrix(),U=!0):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),e.enableZoom=!1)}function $(n){t.set(n.clientX,n.clientY)}function bt(n){h.set(n.clientX,n.clientY)}function q(n){s.set(n.clientX,n.clientY)}function gt(n){i.set(n.clientX,n.clientY),o.subVectors(i,t).multiplyScalar(e.rotateSpeed);const l=e.domElement;Z(2*Math.PI*o.x/l.clientHeight),K(2*Math.PI*o.y/l.clientHeight),t.copy(i),e.update()}function yt(n){p.set(n.clientX,n.clientY),T.subVectors(p,h),T.y>0?B(H()):T.y<0&&V(H()),h.copy(p),e.update()}function mt(n){a.set(n.clientX,n.clientY),r.subVectors(a,s).multiplyScalar(e.panSpeed),x(r.x,r.y),s.copy(a),e.update()}function Et(){}function Tt(n){n.deltaY<0?V(H()):n.deltaY>0&&B(H()),e.update()}function Pt(n){let l=!1;switch(n.code){case e.keys.UP:x(0,e.keyPanSpeed),l=!0;break;case e.keys.BOTTOM:x(0,-e.keyPanSpeed),l=!0;break;case e.keys.LEFT:x(e.keyPanSpeed,0),l=!0;break;case e.keys.RIGHT:x(-e.keyPanSpeed,0),l=!0;break}l&&(n.preventDefault(),e.update())}function tt(){if(c.length===1)t.set(c[0].pageX,c[0].pageY);else{const n=.5*(c[0].pageX+c[1].pageX),l=.5*(c[0].pageY+c[1].pageY);t.set(n,l)}}function et(){if(c.length===1)s.set(c[0].pageX,c[0].pageY);else{const n=.5*(c[0].pageX+c[1].pageX),l=.5*(c[0].pageY+c[1].pageY);s.set(n,l)}}function nt(){const n=c[0].pageX-c[1].pageX,l=c[0].pageY-c[1].pageY,y=Math.sqrt(n*n+l*l);h.set(0,y)}function Ot(){e.enableZoom&&nt(),e.enablePan&&et()}function vt(){e.enableZoom&&nt(),e.enableRotate&&tt()}function it(n){if(c.length==1)i.set(n.pageX,n.pageY);else{const y=G(n),E=.5*(n.pageX+y.x),M=.5*(n.pageY+y.y);i.set(E,M)}o.subVectors(i,t).multiplyScalar(e.rotateSpeed);const l=e.domElement;Z(2*Math.PI*o.x/l.clientHeight),K(2*Math.PI*o.y/l.clientHeight),t.copy(i)}function ot(n){if(c.length===1)a.set(n.pageX,n.pageY);else{const l=G(n),y=.5*(n.pageX+l.x),E=.5*(n.pageY+l.y);a.set(y,E)}r.subVectors(a,s).multiplyScalar(e.panSpeed),x(r.x,r.y),s.copy(a)}function st(n){const l=G(n),y=n.pageX-l.x,E=n.pageY-l.y,M=Math.sqrt(y*y+E*E);p.set(0,M),T.set(0,Math.pow(p.y/h.y,e.zoomSpeed)),B(T.y),h.copy(p)}function Mt(n){e.enableZoom&&st(n),e.enablePan&&ot(n)}function Rt(n){e.enableZoom&&st(n),e.enableRotate&&it(n)}function wt(){}function at(n){e.enabled!==!1&&(c.length===0&&(e.domElement.setPointerCapture(n.pointerId),e.domElement.addEventListener("pointermove",X),e.domElement.addEventListener("pointerup",Q)),Nt(n),n.pointerType==="touch"?Ct(n):At(n))}function X(n){e.enabled!==!1&&(n.pointerType==="touch"?Dt(n):It(n))}function Q(n){e.enabled!==!1&&(n.pointerType==="touch"?Lt():St(n),ht(n),c.length===0&&(e.domElement.releasePointerCapture(n.pointerId),e.domElement.removeEventListener("pointermove",X),e.domElement.removeEventListener("pointerup",Q)))}function rt(n){ht(n)}function At(n){let l;switch(n.button){case 0:l=e.mouseButtons.LEFT;break;case 1:l=e.mouseButtons.MIDDLE;break;case 2:l=e.mouseButtons.RIGHT;break;default:l=-1}switch(l){case u.U.DOLLY:if(e.enableZoom===!1)return;bt(n),f=d.DOLLY;break;case u.U.ROTATE:if(n.ctrlKey||n.metaKey||n.shiftKey){if(e.enablePan===!1)return;q(n),f=d.PAN}else{if(e.enableRotate===!1)return;$(n),f=d.ROTATE}break;case u.U.PAN:if(n.ctrlKey||n.metaKey||n.shiftKey){if(e.enableRotate===!1)return;$(n),f=d.ROTATE}else{if(e.enablePan===!1)return;q(n),f=d.PAN}break;default:f=d.NONE}f!==d.NONE&&e.dispatchEvent(w)}function It(n){if(e.enabled!==!1)switch(f){case d.ROTATE:if(e.enableRotate===!1)return;gt(n);break;case d.DOLLY:if(e.enableZoom===!1)return;yt(n);break;case d.PAN:if(e.enablePan===!1)return;mt(n);break}}function St(n){Et(n),e.dispatchEvent(P),f=d.NONE}function lt(n){e.enabled===!1||e.enableZoom===!1||f!==d.NONE||(n.preventDefault(),e.dispatchEvent(w),Tt(n),e.dispatchEvent(P))}function ut(n){e.enabled===!1||e.enablePan===!1||Pt(n)}function Ct(n){switch(ft(n),c.length){case 1:switch(e.touches.ONE){case u.Jb.ROTATE:if(e.enableRotate===!1)return;tt(),f=d.TOUCH_ROTATE;break;case u.Jb.PAN:if(e.enablePan===!1)return;et(),f=d.TOUCH_PAN;break;default:f=d.NONE}break;case 2:switch(e.touches.TWO){case u.Jb.DOLLY_PAN:if(e.enableZoom===!1&&e.enablePan===!1)return;Ot(),f=d.TOUCH_DOLLY_PAN;break;case u.Jb.DOLLY_ROTATE:if(e.enableZoom===!1&&e.enableRotate===!1)return;vt(),f=d.TOUCH_DOLLY_ROTATE;break;default:f=d.NONE}break;default:f=d.NONE}f!==d.NONE&&e.dispatchEvent(w)}function Dt(n){switch(ft(n),f){case d.TOUCH_ROTATE:if(e.enableRotate===!1)return;it(n),e.update();break;case d.TOUCH_PAN:if(e.enablePan===!1)return;ot(n),e.update();break;case d.TOUCH_DOLLY_PAN:if(e.enableZoom===!1&&e.enablePan===!1)return;Mt(n),e.update();break;case d.TOUCH_DOLLY_ROTATE:if(e.enableZoom===!1&&e.enableRotate===!1)return;Rt(n),e.update();break;default:f=d.NONE}}function Lt(n){wt(n),e.dispatchEvent(P),f=d.NONE}function ct(n){e.enabled!==!1&&n.preventDefault()}function Nt(n){c.push(n)}function ht(n){delete v[n.pointerId];for(let l=0;l<c.length;l++)if(c[l].pointerId==n.pointerId){c.splice(l,1);return}}function ft(n){let l=v[n.pointerId];l===void 0&&(l=new u.Qb,v[n.pointerId]=l),l.set(n.pageX,n.pageY)}function G(n){const l=n.pointerId===c[0].pointerId?c[1]:c[0];return v[l.pointerId]}e.domElement.addEventListener("contextmenu",ct),e.domElement.addEventListener("pointerdown",at),e.domElement.addEventListener("pointercancel",rt),e.domElement.addEventListener("wheel",lt,{passive:!1}),this.update()}}class C extends j{constructor(L,D){super(L,D);this.screenSpacePanning=!1,this.mouseButtons.LEFT=u.U.PAN,this.mouseButtons.RIGHT=u.U.ROTATE,this.touches.ONE=u.Jb.PAN,this.touches.TWO=u.Jb.DOLLY_ROTATE}}},"R5+H":function(pt,m,g){"use strict";g.r(m),function(u){g.d(m,"Easing",function(){return R}),g.d(m,"Group",function(){return j}),g.d(m,"Interpolation",function(){return C}),g.d(m,"Sequence",function(){return _}),g.d(m,"Tween",function(){return D}),g.d(m,"VERSION",function(){return e}),g.d(m,"add",function(){return O}),g.d(m,"getAll",function(){return Y}),g.d(m,"nextId",function(){return d}),g.d(m,"now",function(){return P}),g.d(m,"remove",function(){return N}),g.d(m,"removeAll",function(){return b}),g.d(m,"update",function(){return A});var R={Linear:{None:function(t){return t}},Quadratic:{In:function(t){return t*t},Out:function(t){return t*(2-t)},InOut:function(t){return(t*=2)<1?.5*t*t:-.5*(--t*(t-2)-1)}},Cubic:{In:function(t){return t*t*t},Out:function(t){return--t*t*t+1},InOut:function(t){return(t*=2)<1?.5*t*t*t:.5*((t-=2)*t*t+2)}},Quartic:{In:function(t){return t*t*t*t},Out:function(t){return 1- --t*t*t*t},InOut:function(t){return(t*=2)<1?.5*t*t*t*t:-.5*((t-=2)*t*t*t-2)}},Quintic:{In:function(t){return t*t*t*t*t},Out:function(t){return--t*t*t*t*t+1},InOut:function(t){return(t*=2)<1?.5*t*t*t*t*t:.5*((t-=2)*t*t*t*t+2)}},Sinusoidal:{In:function(t){return 1-Math.cos(t*Math.PI/2)},Out:function(t){return Math.sin(t*Math.PI/2)},InOut:function(t){return .5*(1-Math.cos(Math.PI*t))}},Exponential:{In:function(t){return t===0?0:Math.pow(1024,t-1)},Out:function(t){return t===1?1:1-Math.pow(2,-10*t)},InOut:function(t){return t===0?0:t===1?1:(t*=2)<1?.5*Math.pow(1024,t-1):.5*(-Math.pow(2,-10*(t-1))+2)}},Circular:{In:function(t){return 1-Math.sqrt(1-t*t)},Out:function(t){return Math.sqrt(1- --t*t)},InOut:function(t){return(t*=2)<1?-.5*(Math.sqrt(1-t*t)-1):.5*(Math.sqrt(1-(t-=2)*t)+1)}},Elastic:{In:function(t){return t===0?0:t===1?1:-Math.pow(2,10*(t-1))*Math.sin((t-1.1)*5*Math.PI)},Out:function(t){return t===0?0:t===1?1:Math.pow(2,-10*t)*Math.sin((t-.1)*5*Math.PI)+1},InOut:function(t){return t===0?0:t===1?1:(t*=2,t<1?-.5*Math.pow(2,10*(t-1))*Math.sin((t-1.1)*5*Math.PI):.5*Math.pow(2,-10*(t-1))*Math.sin((t-1.1)*5*Math.PI)+1)}},Back:{In:function(t){var i=1.70158;return t*t*((i+1)*t-i)},Out:function(t){var i=1.70158;return--t*t*((i+1)*t+i)+1},InOut:function(t){var i=1.70158*1.525;return(t*=2)<1?.5*(t*t*((i+1)*t-i)):.5*((t-=2)*t*((i+1)*t+i)+2)}},Bounce:{In:function(t){return 1-R.Bounce.Out(1-t)},Out:function(t){return t<1/2.75?7.5625*t*t:t<2/2.75?7.5625*(t-=1.5/2.75)*t+.75:t<2.5/2.75?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375},InOut:function(t){return t<.5?R.Bounce.In(t*2)*.5:R.Bounce.Out(t*2-1)*.5+.5}}},w;typeof self=="undefined"&&typeof u!="undefined"&&u.hrtime?w=function(){var t=u.hrtime();return t[0]*1e3+t[1]/1e6}:typeof self!="undefined"&&self.performance!==void 0&&self.performance.now!==void 0?w=self.performance.now.bind(self.performance):Date.now!==void 0?w=Date.now:w=function(){return new Date().getTime()};var P=w,j=function(){function t(){this._tweens={},this._tweensAddedDuringUpdate={}}return t.prototype.getAll=function(){var i=this;return Object.keys(this._tweens).map(function(o){return i._tweens[o]})},t.prototype.removeAll=function(){this._tweens={}},t.prototype.add=function(i){this._tweens[i.getId()]=i,this._tweensAddedDuringUpdate[i.getId()]=i},t.prototype.remove=function(i){delete this._tweens[i.getId()],delete this._tweensAddedDuringUpdate[i.getId()]},t.prototype.update=function(i,o){i===void 0&&(i=P()),o===void 0&&(o=!1);var s=Object.keys(this._tweens);if(s.length===0)return!1;for(;s.length>0;){this._tweensAddedDuringUpdate={};for(var a=0;a<s.length;a++){var r=this._tweens[s[a]],h=!o;r&&r.update(i,h)===!1&&!o&&delete this._tweens[s[a]]}s=Object.keys(this._tweensAddedDuringUpdate)}return!0},t}(),C={Linear:function(t,i){var o=t.length-1,s=o*i,a=Math.floor(s),r=C.Utils.Linear;return i<0?r(t[0],t[1],s):i>1?r(t[o],t[o-1],o-s):r(t[a],t[a+1>o?o:a+1],s-a)},Bezier:function(t,i){for(var o=0,s=t.length-1,a=Math.pow,r=C.Utils.Bernstein,h=0;h<=s;h++)o+=a(1-i,s-h)*a(i,h)*t[h]*r(s,h);return o},CatmullRom:function(t,i){var o=t.length-1,s=o*i,a=Math.floor(s),r=C.Utils.CatmullRom;return t[0]===t[o]?(i<0&&(a=Math.floor(s=o*(1+i))),r(t[(a-1+o)%o],t[a],t[(a+1)%o],t[(a+2)%o],s-a)):i<0?t[0]-(r(t[0],t[0],t[1],t[1],-s)-t[0]):i>1?t[o]-(r(t[o],t[o],t[o-1],t[o-1],s-o)-t[o]):r(t[a?a-1:0],t[a],t[o<a+1?o:a+1],t[o<a+2?o:a+2],s-a)},Utils:{Linear:function(t,i,o){return(i-t)*o+t},Bernstein:function(t,i){var o=C.Utils.Factorial;return o(t)/o(i)/o(t-i)},Factorial:function(){var t=[1];return function(i){var o=1;if(t[i])return t[i];for(var s=i;s>1;s--)o*=s;return t[i]=o,o}}(),CatmullRom:function(t,i,o,s,a){var r=(o-t)*.5,h=(s-i)*.5,p=a*a,T=a*p;return(2*i-2*o+r+h)*T+(-3*i+3*o-2*r-h)*p+r*a+i}}},_=function(){function t(){}return t.nextId=function(){return t._nextId++},t._nextId=0,t}(),L=new j,D=function(){function t(i,o){o===void 0&&(o=L),this._object=i,this._group=o,this._isPaused=!1,this._pauseStart=0,this._valuesStart={},this._valuesEnd={},this._valuesStartRepeat={},this._duration=1e3,this._initialRepeat=0,this._repeat=0,this._yoyo=!1,this._isPlaying=!1,this._reversed=!1,this._delayTime=0,this._startTime=0,this._easingFunction=R.Linear.None,this._interpolationFunction=C.Linear,this._chainedTweens=[],this._onStartCallbackFired=!1,this._id=_.nextId(),this._isChainStopped=!1,this._goToEnd=!1}return t.prototype.getId=function(){return this._id},t.prototype.isPlaying=function(){return this._isPlaying},t.prototype.isPaused=function(){return this._isPaused},t.prototype.to=function(i,o){return this._valuesEnd=Object.create(i),o!==void 0&&(this._duration=o),this},t.prototype.duration=function(i){return this._duration=i,this},t.prototype.start=function(i){if(this._isPlaying)return this;if(this._group&&this._group.add(this),this._repeat=this._initialRepeat,this._reversed){this._reversed=!1;for(var o in this._valuesStartRepeat)this._swapEndStartRepeatValues(o),this._valuesStart[o]=this._valuesStartRepeat[o]}return this._isPlaying=!0,this._isPaused=!1,this._onStartCallbackFired=!1,this._isChainStopped=!1,this._startTime=i!==void 0?typeof i=="string"?P()+parseFloat(i):i:P(),this._startTime+=this._delayTime,this._setupProperties(this._object,this._valuesStart,this._valuesEnd,this._valuesStartRepeat),this},t.prototype._setupProperties=function(i,o,s,a){for(var r in s){var h=i[r],p=Array.isArray(h),T=p?"array":typeof h,c=!p&&Array.isArray(s[r]);if(!(T==="undefined"||T==="function")){if(c){var v=s[r];if(v.length===0)continue;v=v.map(this._handleRelativeValue.bind(this,h)),s[r]=[h].concat(v)}if((T==="object"||p)&&h&&!c){o[r]=p?[]:{};for(var k in h)o[r][k]=h[k];a[r]=p?[]:{},this._setupProperties(h,o[r],s[r],a[r])}else typeof o[r]=="undefined"&&(o[r]=h),p||(o[r]*=1),c?a[r]=s[r].slice().reverse():a[r]=o[r]||0}}},t.prototype.stop=function(){return this._isChainStopped||(this._isChainStopped=!0,this.stopChainedTweens()),this._isPlaying?(this._group&&this._group.remove(this),this._isPlaying=!1,this._isPaused=!1,this._onStopCallback&&this._onStopCallback(this._object),this):this},t.prototype.end=function(){return this._goToEnd=!0,this.update(Infinity),this},t.prototype.pause=function(i){return i===void 0&&(i=P()),this._isPaused||!this._isPlaying?this:(this._isPaused=!0,this._pauseStart=i,this._group&&this._group.remove(this),this)},t.prototype.resume=function(i){return i===void 0&&(i=P()),!this._isPaused||!this._isPlaying?this:(this._isPaused=!1,this._startTime+=i-this._pauseStart,this._pauseStart=0,this._group&&this._group.add(this),this)},t.prototype.stopChainedTweens=function(){for(var i=0,o=this._chainedTweens.length;i<o;i++)this._chainedTweens[i].stop();return this},t.prototype.group=function(i){return this._group=i,this},t.prototype.delay=function(i){return this._delayTime=i,this},t.prototype.repeat=function(i){return this._initialRepeat=i,this._repeat=i,this},t.prototype.repeatDelay=function(i){return this._repeatDelayTime=i,this},t.prototype.yoyo=function(i){return this._yoyo=i,this},t.prototype.easing=function(i){return this._easingFunction=i,this},t.prototype.interpolation=function(i){return this._interpolationFunction=i,this},t.prototype.chain=function(){for(var i=[],o=0;o<arguments.length;o++)i[o]=arguments[o];return this._chainedTweens=i,this},t.prototype.onStart=function(i){return this._onStartCallback=i,this},t.prototype.onUpdate=function(i){return this._onUpdateCallback=i,this},t.prototype.onRepeat=function(i){return this._onRepeatCallback=i,this},t.prototype.onComplete=function(i){return this._onCompleteCallback=i,this},t.prototype.onStop=function(i){return this._onStopCallback=i,this},t.prototype.update=function(i,o){if(i===void 0&&(i=P()),o===void 0&&(o=!0),this._isPaused)return!0;var s,a,r=this._startTime+this._duration;if(!this._goToEnd&&!this._isPlaying){if(i>r)return!1;o&&this.start(i)}if(this._goToEnd=!1,i<this._startTime)return!0;this._onStartCallbackFired===!1&&(this._onStartCallback&&this._onStartCallback(this._object),this._onStartCallbackFired=!0),a=(i-this._startTime)/this._duration,a=this._duration===0||a>1?1:a;var h=this._easingFunction(a);if(this._updateProperties(this._object,this._valuesStart,this._valuesEnd,h),this._onUpdateCallback&&this._onUpdateCallback(this._object,a),a===1)if(this._repeat>0){isFinite(this._repeat)&&this._repeat--;for(s in this._valuesStartRepeat)!this._yoyo&&typeof this._valuesEnd[s]=="string"&&(this._valuesStartRepeat[s]=this._valuesStartRepeat[s]+parseFloat(this._valuesEnd[s])),this._yoyo&&this._swapEndStartRepeatValues(s),this._valuesStart[s]=this._valuesStartRepeat[s];return this._yoyo&&(this._reversed=!this._reversed),this._repeatDelayTime!==void 0?this._startTime=i+this._repeatDelayTime:this._startTime=i+this._delayTime,this._onRepeatCallback&&this._onRepeatCallback(this._object),!0}else{this._onCompleteCallback&&this._onCompleteCallback(this._object);for(var p=0,T=this._chainedTweens.length;p<T;p++)this._chainedTweens[p].start(this._startTime+this._duration);return this._isPlaying=!1,!1}return!0},t.prototype._updateProperties=function(i,o,s,a){for(var r in s)if(o[r]!==void 0){var h=o[r]||0,p=s[r],T=Array.isArray(i[r]),c=Array.isArray(p),v=!T&&c;v?i[r]=this._interpolationFunction(p,a):typeof p=="object"&&p?this._updateProperties(i[r],h,p,a):(p=this._handleRelativeValue(h,p),typeof p=="number"&&(i[r]=h+(p-h)*a))}},t.prototype._handleRelativeValue=function(i,o){return typeof o!="string"?o:o.charAt(0)==="+"||o.charAt(0)==="-"?i+parseFloat(o):parseFloat(o)},t.prototype._swapEndStartRepeatValues=function(i){var o=this._valuesStartRepeat[i],s=this._valuesEnd[i];typeof s=="string"?this._valuesStartRepeat[i]=this._valuesStartRepeat[i]+parseFloat(s):this._valuesStartRepeat[i]=this._valuesEnd[i],this._valuesEnd[i]=o},t}(),e="18.6.4",d=_.nextId,f=L,Y=f.getAll.bind(f),b=f.removeAll.bind(f),O=f.add.bind(f),N=f.remove.bind(f),A=f.update.bind(f),U={Easing:R,Group:j,Interpolation:C,now:P,Sequence:_,nextId:d,Tween:D,VERSION:e,getAll:Y,removeAll:b,add:O,remove:N,update:A};m.default=U}.call(this,g("BBhR"))}}]);
