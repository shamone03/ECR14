(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{10:function(e,t,n){e.exports=n(24)},19:function(e,t,n){e.exports=n.p+"static/media/logo.06e73328.svg"},20:function(e,t,n){},24:function(e,t,n){"use strict";n.r(t);var a=n(1),r=n.n(a),l=n(9),c=n.n(l),o=n(6),u=n(0);n(19),n(20);var s=function(){return r.a.createElement("div",{className:"App"},r.a.createElement("h1",null,"ECR14"),r.a.createElement("nav",null,r.a.createElement(o.b,{to:"/home"},"Home"),r.a.createElement(o.b,{to:"/login"},"Login"),r.a.createElement(o.b,{to:"/register"},"Register")))},i=n(4),m=n.n(i),p=n(5),f=n(2),h=function(){var e=Object(a.useState)(""),t=Object(f.a)(e,2),n=t[0],l=t[1],c=Object(a.useState)(""),o=Object(f.a)(c,2),u=o[0],s=o[1],i=function(){var e=Object(p.a)(m.a.mark(function e(t){var a,r;return m.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t.preventDefault(),e.next=3,fetch("http://localhost:8080/api/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({houseNo:n,password:u})});case 3:if(200!==(a=e.sent).status){e.next=11;break}return e.next=7,a.json();case 7:r=e.sent,localStorage.setItem("token",r.token),e.next=12;break;case 11:alert("invalid houseNo or password");case 12:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}();return r.a.createElement(r.a.Fragment,null,r.a.createElement("h1",{className:"text-center",id:"login-heading"},"Login"),r.a.createElement("div",null,r.a.createElement("small",null,"House number"),r.a.createElement("input",{type:"text",onChange:function(e){return l(e.target.value)}}),r.a.createElement("small",null,"Password"),r.a.createElement("input",{type:"password",onChange:function(e){return s(e.target.value)}}),r.a.createElement("button",{onClick:i},"Login")))},E=n(7),d=function(){var e=Object(a.useState)(""),t=Object(f.a)(e,2),n=t[0],l=t[1],c=Object(a.useState)([{name:"",key:1}]),o=Object(f.a)(c,2),u=o[0],s=o[1],i=Object(a.useState)(""),h=Object(f.a)(i,2),d=h[0],b=h[1],g=Object(a.useState)(""),v=Object(f.a)(g,2),y=v[0],j=v[1],k=Object(a.useState)(""),x=Object(f.a)(k,2),O=x[0],w=x[1],C=function(){var e=Object(p.a)(m.a.mark(function e(t){var a;return m.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(y===O||(alert("passwords do not match"),0)){e.next=2;break}return e.abrupt("return");case 2:return t.preventDefault(),e.next=5,fetch("http://localhost:8080/api/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({houseNo:n,email:d,names:u,password:y})});case 5:if(200!==(a=e.sent).status){e.next=12;break}return e.next=9,a.json();case 9:e.sent,e.next=13;break;case 12:alert("invalid houseNo or password");case 13:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),S={display:"flex",flexDirection:"row"},N={margin:"5%"};return r.a.createElement("div",{style:{width:"25%",display:"flex",flexDirection:"column"}},r.a.createElement("h1",null,"register"),r.a.createElement("small",null,"Enter Apt number"),r.a.createElement("input",{type:"text",onChange:function(e){return l(e.target.value)}}),r.a.createElement("small",null,"enter email"),r.a.createElement("input",{type:"text",onChange:function(e){return b(e.target.value)}}),r.a.createElement("small",null,"Add residents in your house"),r.a.createElement("div",{style:{display:"flex",flexDirection:"column",padding:"5%"}},Object(E.a)(u).map(function(e){return r.a.createElement("div",{style:S,key:e.key},r.a.createElement("input",{type:"text",style:N,key:e.key,value:e.name,onChange:function(t){return function(e,t){var n=Object(E.a)(u);n[e-1].name=t,s(n),console.log(u)}(e.key,t.target.value)}}),r.a.createElement("button",{onClick:function(){return function(e){console.log(e);for(var t=Object(E.a)(u).filter(function(t){return e!==t.name}),n=0;n<t.length;n++)t[n].key=n+1;s(t),console.log(u)}(e.name)}},"remove"))}),r.a.createElement("button",{onClick:function(){s([].concat(Object(E.a)(u),[{name:"",key:u[u.length-1].key+1}])),console.log(u)},style:N},"add member")),r.a.createElement("small",null,"Enter password"),r.a.createElement("input",{type:"text",onChange:function(e){return j(e.target.value)}}),r.a.createElement("small",null,"Confirm password"),r.a.createElement("input",{type:"text",onChange:function(e){return w(e.target.value)}}),r.a.createElement("button",{onClick:C},"Register"))},b=function(){var e=Object(a.useState)(""),t=Object(f.a)(e,2),n=t[0],l=t[1],c=Object(a.useState)([]),o=Object(f.a)(c,2),u=o[0],s=o[1];return Object(a.useEffect)(function(){!function(){var e=Object(p.a)(m.a.mark(function e(){var t,n;return m.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("http://localhost:8080/api/getUser",{method:"GET",headers:{"Content-Type":"application/json",Authorization:localStorage.getItem("token")}});case 2:if(200!==(t=e.sent).status){e.next=10;break}return e.next=6,t.json();case 6:n=e.sent,console.log(n),l(n.houseNo),s(n.names);case 10:case"end":return e.stop()}},e)}));return function(){return e.apply(this,arguments)}}()()},[]),r.a.createElement(r.a.Fragment,null,r.a.createElement("h1",null,n),r.a.createElement(function(){return u.map(function(e){return r.a.createElement("p",{key:e._id},e.name)})},null))},g=function(){var e=Object(a.useState)(!1),t=Object(f.a)(e,2),n=t[0],l=t[1],c=Object(u.g)();return Object(a.useEffect)(function(){!function(){var e=Object(p.a)(m.a.mark(function e(){var t,n,a;return m.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,t="http://localhost:8080/api/".concat(c.id,"/verify/").concat(c.token),e.next=4,fetch(t,{method:"GET",headers:{"Content-Type":"application/json"}});case 4:if(200!==(n=e.sent).status){e.next=11;break}return e.next=8,n.json();case 8:a=e.sent,console.log(a),l(!0);case 11:e.next=17;break;case 13:e.prev=13,e.t0=e.catch(0),console.log("invalid link"),l(!1);case 17:case"end":return e.stop()}},e,null,[[0,13]])}));return function(){return e.apply(this,arguments)}}()()},[c]),r.a.createElement(r.a.Fragment,null,n?r.a.createElement(r.a.Fragment,null,r.a.createElement("h1",null,"verified"),r.a.createElement(o.b,{to:"/login"},"login")):r.a.createElement("h1",null,"invalid link"))};c.a.createRoot(document.getElementById("root")).render(r.a.createElement(o.a,null,r.a.createElement(u.c,null,r.a.createElement(u.a,{path:"/",element:r.a.createElement(s,null)}),r.a.createElement(u.a,{path:"/login",element:r.a.createElement(h,null)}),r.a.createElement(u.a,{path:"/register",element:r.a.createElement(d,null)}),r.a.createElement(u.a,{path:"/home",element:r.a.createElement(b,null)}),r.a.createElement(u.a,{path:"/api/:id/verify/:token",element:r.a.createElement(g,null)}))))}},[[10,2,1]]]);
//# sourceMappingURL=main.f91cccb9.chunk.js.map