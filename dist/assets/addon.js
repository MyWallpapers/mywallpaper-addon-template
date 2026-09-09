
const d={primaryColor:"#00ff41",displayText:"MYWALLPAPER TEMPLATE",showMatrixRain:!0,rainOpacity:.7,showClock:!0,showDate:!0},D="アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";function P({layer:o}){const e=o.root;e.classList.add("mwa-template-root");const n=document.createElement("style");n.textContent=`
    .mwa-template-root {
      --mwa-template-color: #00ff41;
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      color: var(--mwa-template-color);
      background: #020502;
      font-family: "Share Tech Mono", "Cascadia Mono", monospace;
    }

    .mwa-template-root .mwa-template-rain {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      opacity: 0.7;
    }

    .mwa-template-root .mwa-template-panel {
      position: absolute;
      top: 50%;
      left: 50%;
      width: min(450px, calc(100% - 32px));
      transform: translate(-50%, -50%);
      border: 2px solid var(--mwa-template-color);
      border-radius: 8px;
      background: rgba(0, 0, 0, 0.88);
      box-shadow: 0 0 20px color-mix(in srgb, var(--mwa-template-color) 60%, transparent), inset 0 0 20px color-mix(in srgb, var(--mwa-template-color) 12%, transparent);
    }

    .mwa-template-root .mwa-template-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 15px;
      border-bottom: 1px solid var(--mwa-template-color);
      background: color-mix(in srgb, var(--mwa-template-color) 15%, transparent);
    }

    .mwa-template-root .mwa-template-version {
      font-size: 0.85rem;
      font-weight: 700;
      text-shadow: 0 0 5px var(--mwa-template-color);
    }

    .mwa-template-root .mwa-template-lights {
      display: flex;
      gap: 7px;
    }

    .mwa-template-root .mwa-template-light {
      width: 10px;
      height: 10px;
      border: 1px solid var(--mwa-template-color);
      border-radius: 50%;
    }

    .mwa-template-root .mwa-template-light:nth-child(1) { background: #f5d90a; }
    .mwa-template-root .mwa-template-light:nth-child(2) { background: #35d05a; }
    .mwa-template-root .mwa-template-light:nth-child(3) { background: #df394f; }

    .mwa-template-root .mwa-template-content {
      min-height: 180px;
      padding: 22px;
    }

    .mwa-template-root .mwa-template-title {
      margin: 0 0 18px;
      color: var(--mwa-template-color);
      font-size: clamp(1.2rem, 4vw, 1.8rem);
      text-align: center;
      text-shadow: 0 0 8px color-mix(in srgb, var(--mwa-template-color) 70%, transparent);
    }

    .mwa-template-root .mwa-template-info {
      display: grid;
      gap: 8px;
      margin: 0 auto;
      max-width: 18rem;
      color: rgba(255, 255, 255, 0.75);
      font-size: 0.85rem;
    }

    .mwa-template-root .mwa-template-info-row {
      display: flex;
      justify-content: space-between;
      gap: 16px;
    }

    .mwa-template-root .mwa-template-value {
      color: var(--mwa-template-color);
      text-align: right;
    }

    .mwa-template-root .mwa-template-cursor {
      margin-top: 18px;
      color: var(--mwa-template-color);
      text-align: center;
      animation: mwa-template-blink 1.1s steps(2, jump-none) infinite;
    }

    @keyframes mwa-template-blink { 50% { opacity: 0; } }
  `,document.head.append(n);const a=document.createElement("canvas");a.className="mwa-template-rain";const p=document.createElement("section");p.className="mwa-template-panel",p.setAttribute("aria-label","MyWallpaper add-on template");const w=document.createElement("header");w.className="mwa-template-header";const h=document.createElement("span");h.className="mwa-template-version",h.textContent="v3.0.0";const g=document.createElement("span");g.className="mwa-template-lights";for(let t=0;t<3;t+=1){const i=document.createElement("span");i.className="mwa-template-light",i.setAttribute("aria-hidden","true"),g.append(i)}w.append(h,g);const u=document.createElement("div");u.className="mwa-template-content";const x=document.createElement("h1");x.className="mwa-template-title";const f=document.createElement("div");f.className="mwa-template-info";const y=M("TIME"),b=M("DATE"),T=M("STATUS");T.value.textContent="ONLINE",f.append(y.row,b.row,T.row);const v=document.createElement("div");v.className="mwa-template-cursor",v.textContent="▊",u.append(x,f,v),p.append(w,u),e.replaceChildren(a,p);const r=a.getContext("2d");let c=1,m=1,R=1,s=[],C=0,A=!0,l={...d};function E(){const t=e.getBoundingClientRect();c=Math.max(1,Math.floor(t.width||window.innerWidth)),m=Math.max(1,Math.floor(t.height||window.innerHeight));const i=Math.min(2,window.devicePixelRatio||1);a.width=Math.floor(c*i),a.height=Math.floor(m*i),r?.setTransform(i,0,0,i,0,0),R=Math.max(1,Math.floor(c/14)),s=Array.from({length:R},()=>Math.random()*m/14)}function O(){if(r){if(r.fillStyle="rgba(0, 0, 0, 0.07)",r.fillRect(0,0,c,m),!l.showMatrixRain){r.clearRect(0,0,c,m);return}r.fillStyle=l.primaryColor,r.font='14px "Cascadia Mono", monospace',r.globalAlpha=l.rainOpacity;for(let t=0;t<s.length;t+=1){const i=t*14,L=s[t]*14;r.fillText(D[Math.floor(Math.random()*D.length)],i,L),L>m&&Math.random()>.975&&(s[t]=0),s[t]=(s[t]??0)+1}r.globalAlpha=1}}function N(){A&&(O(),C=window.requestAnimationFrame(N))}function k(){const t=new Date;y.value.textContent=t.toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!1}),b.value.textContent=t.toLocaleDateString(void 0,{year:"numeric",month:"2-digit",day:"2-digit"}),y.row.hidden=!l.showClock,b.row.hidden=!l.showDate}function S(t){l=I(t),e.style.setProperty("--mwa-template-color",l.primaryColor),x.textContent=l.displayText,a.style.opacity=String(l.rainOpacity),k()}E(),S(o.settings.get());const z=o.settings.subscribe(S),F=window.setInterval(k,1e3);return window.addEventListener("resize",E),C=window.requestAnimationFrame(N),()=>{A=!1,window.cancelAnimationFrame(C),window.clearInterval(F),window.removeEventListener("resize",E),z(),n.remove(),e.classList.remove("mwa-template-root"),e.replaceChildren()}}function M(o){const e=document.createElement("div");e.className="mwa-template-info-row";const n=document.createElement("span");n.textContent=`${o}:`;const a=document.createElement("span");return a.className="mwa-template-value",e.append(n,a),{row:e,value:a}}function I(o){const e=o.primaryColor,n=o.displayText,a=o.rainOpacity;return{primaryColor:typeof e=="string"&&e.trim()?e.trim():d.primaryColor,displayText:typeof n=="string"&&n.trim()?n.trim():d.displayText,showMatrixRain:o.showMatrixRain!==!1,rainOpacity:typeof a=="number"&&Number.isFinite(a)?Math.min(1,Math.max(0,a)):d.rainOpacity,showClock:o.showClock!==!1,showDate:o.showDate!==!1}}export{P as mount};
