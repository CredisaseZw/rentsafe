import{R as x,c as m}from"./main-7714b93d.js";function y(n,s){if(n==null)return{};var o={},a=Object.keys(n),e,t;for(t=0;t<a.length;t++)e=a[t],!(s.indexOf(e)>=0)&&(o[e]=n[e]);return o}function b(n,s){return b=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(a,e){return a.__proto__=e,a},b(n,s)}function k(n,s){n.prototype=Object.create(s.prototype),n.prototype.constructor=n,b(n,s)}const O={disabled:!1},g=x.createContext(null);var R=function(s){return s.scrollTop},v="unmounted",f="exited",c="entering",h="entered",N="exiting",p=function(n){k(s,n);function s(a,e){var t;t=n.call(this,a,e)||this;var i=e,r=i&&!i.isMounting?a.enter:a.appear,u;return t.appearStatus=null,a.in?r?(u=f,t.appearStatus=c):u=h:a.unmountOnExit||a.mountOnEnter?u=v:u=f,t.state={status:u},t.nextCallback=null,t}s.getDerivedStateFromProps=function(e,t){var i=e.in;return i&&t.status===v?{status:f}:null};var o=s.prototype;return o.componentDidMount=function(){this.updateStatus(!0,this.appearStatus)},o.componentDidUpdate=function(e){var t=null;if(e!==this.props){var i=this.state.status;this.props.in?i!==c&&i!==h&&(t=c):(i===c||i===h)&&(t=N)}this.updateStatus(!1,t)},o.componentWillUnmount=function(){this.cancelNextCallback()},o.getTimeouts=function(){var e=this.props.timeout,t,i,r;return t=i=r=e,e!=null&&typeof e!="number"&&(t=e.exit,i=e.enter,r=e.appear!==void 0?e.appear:i),{exit:t,enter:i,appear:r}},o.updateStatus=function(e,t){if(e===void 0&&(e=!1),t!==null)if(this.cancelNextCallback(),t===c){if(this.props.unmountOnExit||this.props.mountOnEnter){var i=this.props.nodeRef?this.props.nodeRef.current:m.findDOMNode(this);i&&R(i)}this.performEnter(e)}else this.performExit();else this.props.unmountOnExit&&this.state.status===f&&this.setState({status:v})},o.performEnter=function(e){var t=this,i=this.props.enter,r=this.context?this.context.isMounting:e,u=this.props.nodeRef?[r]:[m.findDOMNode(this),r],l=u[0],E=u[1],T=this.getTimeouts(),C=r?T.appear:T.enter;if(!e&&!i||O.disabled){this.safeSetState({status:h},function(){t.props.onEntered(l)});return}this.props.onEnter(l,E),this.safeSetState({status:c},function(){t.props.onEntering(l,E),t.onTransitionEnd(C,function(){t.safeSetState({status:h},function(){t.props.onEntered(l,E)})})})},o.performExit=function(){var e=this,t=this.props.exit,i=this.getTimeouts(),r=this.props.nodeRef?void 0:m.findDOMNode(this);if(!t||O.disabled){this.safeSetState({status:f},function(){e.props.onExited(r)});return}this.props.onExit(r),this.safeSetState({status:N},function(){e.props.onExiting(r),e.onTransitionEnd(i.exit,function(){e.safeSetState({status:f},function(){e.props.onExited(r)})})})},o.cancelNextCallback=function(){this.nextCallback!==null&&(this.nextCallback.cancel(),this.nextCallback=null)},o.safeSetState=function(e,t){t=this.setNextCallback(t),this.setState(e,t)},o.setNextCallback=function(e){var t=this,i=!0;return this.nextCallback=function(r){i&&(i=!1,t.nextCallback=null,e(r))},this.nextCallback.cancel=function(){i=!1},this.nextCallback},o.onTransitionEnd=function(e,t){this.setNextCallback(t);var i=this.props.nodeRef?this.props.nodeRef.current:m.findDOMNode(this),r=e==null&&!this.props.addEndListener;if(!i||r){setTimeout(this.nextCallback,0);return}if(this.props.addEndListener){var u=this.props.nodeRef?[this.nextCallback]:[i,this.nextCallback],l=u[0],E=u[1];this.props.addEndListener(l,E)}e!=null&&setTimeout(this.nextCallback,e)},o.render=function(){var e=this.state.status;if(e===v)return null;var t=this.props,i=t.children;t.in,t.mountOnEnter,t.unmountOnExit,t.appear,t.enter,t.exit,t.timeout,t.addEndListener,t.onEnter,t.onEntering,t.onEntered,t.onExit,t.onExiting,t.onExited,t.nodeRef;var r=y(t,["children","in","mountOnEnter","unmountOnExit","appear","enter","exit","timeout","addEndListener","onEnter","onEntering","onEntered","onExit","onExiting","onExited","nodeRef"]);return x.createElement(g.Provider,{value:null},typeof i=="function"?i(e,r):x.cloneElement(x.Children.only(i),r))},s}(x.Component);p.contextType=g;p.propTypes={};function d(){}p.defaultProps={in:!1,mountOnEnter:!1,unmountOnExit:!1,appear:!1,enter:!0,exit:!0,onEnter:d,onEntering:d,onEntered:d,onExit:d,onExiting:d,onExited:d};p.UNMOUNTED=v;p.EXITED=f;p.ENTERING=c;p.ENTERED=h;p.EXITING=N;const _=p;function D(n,s){return n.classList?!!s&&n.classList.contains(s):(" "+(n.className.baseVal||n.className)+" ").indexOf(" "+s+" ")!==-1}function M(n,s){n.classList?n.classList.add(s):D(n,s)||(typeof n.className=="string"?n.className=n.className+" "+s:n.setAttribute("class",(n.className&&n.className.baseVal||"")+" "+s))}function S(n,s){return n.replace(new RegExp("(^|\\s)"+s+"(?:\\s|$)","g"),"$1").replace(/\s+/g," ").replace(/^\s*|\s*$/g,"")}function P(n,s){n.classList?n.classList.remove(s):typeof n.className=="string"?n.className=S(n.className,s):n.setAttribute("class",S(n.className&&n.className.baseVal||"",s))}export{c as E,_ as T,k as _,h as a,M as b,y as c,g as d,N as e,R as f,O as g,b as h,P as r};
