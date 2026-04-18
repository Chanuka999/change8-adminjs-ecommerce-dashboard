(function(o,H){"use strict";function Qe(t){return t&&t.__esModule?t:{default:t}}var e=Qe(o);const be=t=>{const a=Number(t||0);return`Rs. ${a.toLocaleString(void 0,{minimumFractionDigits:a%1===0?0:2,maximumFractionDigits:2})}`},Pe=(t,a=960,n="auto")=>{const l=String(t||"").trim();return l?!l.includes("res.cloudinary.com")||!l.includes("/upload/")?l:l.replace("/upload/",`/upload/f_auto,q_${n},w_${a},c_limit,dpr_auto/`):""},ye=t=>{const a=t?.image||t?.imageUrl||t?.thumbnail||t?.cover||"/public/img3.png",n=String(a||"").toLowerCase();return n.includes("img1")||n.includes("img2")?"/public/img3.png":a},Ge=t=>String(t?.name||"product").split(" ").slice(0,2).map(n=>n[0]).join("").toUpperCase(),Ye=t=>{const a=t?.params?t.params:t||{};return{id:a.id??t?.id,name:a.name||"Untitled product",price:Number(a.price||0),imageUrl:a.imageUrl||"",isActive:!!a.isActive,stock:Number(a.stock||0),categoryName:a?.category?.name||a?.categoryName||a?.categoryId||"Shop",recordActions:t?.recordActions||t?.actions||[]}},Ke=t=>{const a=t?.params?t.params:t||{};return{id:a.id??t?.id,status:String(a.status||"pending"),totalAmount:Number(a.totalAmount||0),createdAt:a.createdAt||t?.createdAt||null,userName:a?.user?.name||a?.customerName||a?.shippingName||"Order",recordActions:t?.recordActions||t?.actions||[]}},xe=t=>{const n=(t?.recordActions||[]).find(l=>l?.name==="show");return n?.href?n.href:t?.id?`/admin/resources/Products/records/${encodeURIComponent(t.id)}/show`:""},Ze=()=>{const[t,a]=o.useState({users:0,products:0,categories:0,orders:0}),[n,l]=o.useState([]),[p,m]=o.useState([]),[b,k]=o.useState(!0),[x,i]=o.useState(""),[d,f]=o.useState(0),[c,w]=o.useState(""),[$,F]=o.useState(""),[N,O]=o.useState(!1),[P,C]=o.useState(!1);o.useEffect(()=>{const r=document.documentElement,u=document.body;return r.classList.add("change8-storefront-dashboard-page"),u?.classList.add("change8-storefront-dashboard-page"),()=>{r.classList.remove("change8-storefront-dashboard-page"),u?.classList.remove("change8-storefront-dashboard-page")}},[]),o.useEffect(()=>{let r=!0;return(async()=>{k(!0);try{const[I,X,le]=await Promise.all([fetch("/admin/api/dashboard",{credentials:"same-origin"}),fetch("/api/products?lean=true&limit=24",{credentials:"same-origin"}),fetch("/admin/api/resources/Orders/actions/list",{credentials:"same-origin"})]),he=I.ok?await I.json():{},Je=X.ok?await X.json():[],Xe=le.ok?await le.json():{};if(!r)return;const Ve=Array.isArray(Je)?Je.map(Ye):[],Ma=Array.isArray(Xe?.records)?Xe.records.map(Ke):[];a({users:Number(he?.users||0),products:Number(he?.products||Ve.length||0),categories:Number(he?.categories||0),orders:Number(he?.orders||0)}),l(Ve),m(Ma)}catch{r&&(l([]),m([]))}finally{r&&k(!1)}})(),()=>{r=!1}},[]),o.useEffect(()=>{const r=()=>{C(!1)};return document.addEventListener("click",r),()=>{document.removeEventListener("click",r)}},[]),o.useEffect(()=>{let r=!0;return(async()=>{try{const I=await fetch("/admin/context/current-user",{credentials:"same-origin",headers:{Accept:"application/json"}});if(!I.ok)return;const X=await I.json();if(r){w(String(X?.name||"").trim());const le=String(X?.role||"").trim().toLowerCase();le&&F(le),O(!0)}}catch{r&&(w(""),O(!0))}})(),()=>{r=!1}},[]);const q=o.useMemo(()=>n.filter(r=>r.isActive!==!1),[n]),R=o.useMemo(()=>{const r=x.trim().toLowerCase();return r?q.filter(u=>[u.name,String(u.categoryName||""),String(u.stock||"")].join(" ").toLowerCase().includes(r)):q},[q,x]),A=o.useMemo(()=>[{id:"img9-static",name:"New Collection",categoryName:"Featured",imageUrl:"/public/img9.png",isActive:!0,stock:0,price:0,recordActions:[]},{id:"img4-static",name:"Latest Drop",categoryName:"Featured",imageUrl:"/public/img4.png",isActive:!0,stock:0,price:0,recordActions:[]},{id:"img10-static",name:"New Collection",categoryName:"Featured",imageUrl:"/public/img10.png",isActive:!0,stock:0,price:0,recordActions:[]}],[]);o.useEffect(()=>{if(A.length<=1)return;const r=window.setInterval(()=>{f(u=>(u+1)%A.length)},4200);return()=>window.clearInterval(r)},[A.length]),o.useEffect(()=>{d>=A.length&&f(0)},[d,A.length]);const B=A[d]||q[0]||n[0]||null,K=Pe(ye(B),1400),s=B?.name||"Revive Me Jett",h=B?.categoryName||"Oversize Tee",y=xe(B),z="/admin/resources/Orders/actions/list",v=o.useMemo(()=>R,[R]),E=o.useMemo(()=>{const r=new Map;return n.forEach(u=>{const I=String(u.categoryName||"Shop");r.set(I,(r.get(I)||0)+1)}),Array.from(r.entries()).map(([u,I])=>({name:u,count:I}))},[n]),S=$==="admin",g=Array.isArray(n)?n.slice(0,12):[],j=E.slice(0,6);return N?S?e.default.createElement("div",{className:"change8-admin-dashboard"},e.default.createElement("style",null,`
          html.change8-storefront-dashboard-page,
          html.change8-storefront-dashboard-page body,
          html.change8-storefront-dashboard-page #app,
          html.change8-storefront-dashboard-page .adminjs_Layout,
          html.change8-storefront-dashboard-page [data-testid="layout"],
          html.change8-storefront-dashboard-page [data-css="layout"],
          html.change8-storefront-dashboard-page main,
          body.change8-storefront-dashboard-page,
          body.change8-storefront-dashboard-page #app,
          body.change8-storefront-dashboard-page .adminjs_Layout,
          body.change8-storefront-dashboard-page [data-testid="layout"],
          body.change8-storefront-dashboard-page [data-css="layout"],
          body.change8-storefront-dashboard-page main {
            background: #ffffff !important;
            background-color: #ffffff !important;
            background-image: none !important;
          }

          html.change8-storefront-dashboard-page body::before,
          html.change8-storefront-dashboard-page::before,
          body.change8-storefront-dashboard-page::before {
            content: none !important;
            display: none !important;
            background: none !important;
            background-image: none !important;
          }

          .change8-admin-dashboard {
            min-height: 100vh;
            padding: 28px;
            background: #f8fafc;
            color: #0f172a;
            font-family: "Poppins", "Segoe UI", sans-serif;
          }

          .change8-admin-dashboard-grid {
            display: grid;
            gap: 18px;
          }

          .change8-admin-dashboard-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            flex-wrap: wrap;
          }

          .change8-admin-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
          }

          .change8-admin-action {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 12px 16px;
            border-radius: 14px;
            border: 1px solid rgba(15, 23, 42, 0.1);
            background: #ffffff;
            color: #0f172a;
            text-decoration: none;
            font-weight: 700;
            box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
          }

          .change8-admin-action--primary {
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            color: #ffffff;
            border: none;
          }

          .change8-admin-action--logout {
            background: #fee2e2;
            color: #991b1b;
            border: 1px solid #fecaca;
          }

          .change8-admin-dashboard-title {
            margin: 0;
            font-size: clamp(28px, 4vw, 46px);
            line-height: 1;
            font-weight: 800;
          }

          .change8-admin-dashboard-subtitle {
            margin: 8px 0 0;
            color: #64748b;
          }

          .change8-admin-dashboard-cards {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 16px;
          }

          .change8-admin-card,
          .change8-admin-panel {
            border-radius: 20px;
            border: 1px solid rgba(15, 23, 42, 0.08);
            background: #ffffff;
            box-shadow: 0 16px 30px rgba(15, 23, 42, 0.08);
          }

          .change8-admin-card {
            padding: 18px;
          }

          .change8-admin-card-label {
            color: #64748b;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.14em;
            font-weight: 700;
          }

          .change8-admin-card-value {
            margin-top: 10px;
            font-size: 32px;
            line-height: 1;
            font-weight: 800;
          }

          .change8-admin-dashboard-links {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 16px;
          }

          .change8-admin-link {
            display: block;
            padding: 18px;
            border-radius: 18px;
            border: 1px solid rgba(15, 23, 42, 0.08);
            background: #ffffff;
            color: #0f172a;
            text-decoration: none;
            box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
          }

          .change8-admin-link strong {
            display: block;
            font-size: 18px;
            margin-bottom: 6px;
          }

          .change8-admin-section-title {
            margin: 0;
            font-size: 20px;
            font-weight: 800;
          }

          .change8-admin-category-list {
            margin-top: 14px;
            display: grid;
            gap: 12px;
          }

          .change8-admin-category-item {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            padding: 14px 16px;
            border-radius: 14px;
            border: 1px solid rgba(15, 23, 42, 0.08);
            background: #f8fafc;
          }

          .change8-admin-category-name {
            display: block;
            font-weight: 700;
            margin-bottom: 4px;
          }

          .change8-admin-category-meta {
            color: #64748b;
            font-size: 13px;
          }

          .change8-admin-table-wrap {
            margin-top: 14px;
            width: 100%;
            overflow-x: auto;
            border: 1px solid rgba(15, 23, 42, 0.08);
            border-radius: 14px;
            background: #ffffff;
          }

          .change8-admin-table {
            width: 100%;
            border-collapse: collapse;
            min-width: 760px;
          }

          .change8-admin-table th,
          .change8-admin-table td {
            text-align: left;
            padding: 12px 14px;
            border-bottom: 1px solid rgba(15, 23, 42, 0.07);
            font-size: 14px;
          }

          .change8-admin-table th {
            background: #f8fafc;
            color: #475569;
            font-weight: 700;
            white-space: nowrap;
          }

          .change8-admin-table td {
            color: #0f172a;
          }

          .change8-admin-table tr:last-child td {
            border-bottom: 0;
          }

          .change8-admin-thumb-cell {
            width: 76px;
          }

          .change8-admin-thumb {
            width: 44px;
            height: 44px;
            border-radius: 10px;
            object-fit: cover;
            border: 1px solid rgba(15, 23, 42, 0.08);
            background: #f8fafc;
            display: block;
          }

          .change8-admin-status-pill {
            display: inline-block;
            border-radius: 999px;
            padding: 4px 10px;
            font-size: 12px;
            font-weight: 700;
          }

          .change8-admin-status-pill--active {
            background: #dcfce7;
            color: #166534;
          }

          .change8-admin-status-pill--inactive {
            background: #fee2e2;
            color: #991b1b;
          }

          @media (max-width: 1100px) {
            .change8-admin-dashboard-cards,
            .change8-admin-dashboard-links {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
          }

          @media (max-width: 720px) {
            .change8-admin-dashboard {
              padding: 18px;
            }

            .change8-admin-dashboard-cards,
            .change8-admin-dashboard-links {
              grid-template-columns: 1fr;
            }
          }
        `),e.default.createElement("div",{className:"change8-admin-dashboard-grid"},e.default.createElement("div",{className:"change8-admin-dashboard-header"},e.default.createElement("div",null,e.default.createElement("h1",{className:"change8-admin-dashboard-title"},"Admin Dashboard"),e.default.createElement("p",{className:"change8-admin-dashboard-subtitle"},"Manage your shop data, products, orders, and users from here.")),e.default.createElement("div",{className:"change8-admin-actions"},e.default.createElement("a",{className:"change8-admin-action change8-admin-action--logout",href:"/admin/logout"},"Logout"),e.default.createElement("a",{className:"change8-admin-action change8-admin-action--primary",href:"/admin/resources/Products/actions/new"},"+ Add Product"),e.default.createElement("a",{className:"change8-admin-action",href:"/admin/resources/Categories/actions/new"},"+ Add Category"))),e.default.createElement("div",{className:"change8-admin-dashboard-cards"},e.default.createElement("div",{className:"change8-admin-card"},e.default.createElement("div",{className:"change8-admin-card-label"},"Users"),e.default.createElement("div",{className:"change8-admin-card-value"},t.users)),e.default.createElement("div",{className:"change8-admin-card"},e.default.createElement("div",{className:"change8-admin-card-label"},"Products"),e.default.createElement("div",{className:"change8-admin-card-value"},t.products)),e.default.createElement("div",{className:"change8-admin-card"},e.default.createElement("div",{className:"change8-admin-card-label"},"Orders"),e.default.createElement("div",{className:"change8-admin-card-value"},t.orders)),e.default.createElement("div",{className:"change8-admin-card"},e.default.createElement("div",{className:"change8-admin-card-label"},"Categories"),e.default.createElement("div",{className:"change8-admin-card-value"},t.categories))),e.default.createElement("div",{className:"change8-admin-dashboard-links"},e.default.createElement("a",{className:"change8-admin-link",href:"/admin/resources/Products/actions/list"},e.default.createElement("strong",null,"Products"),"Open product list and manage inventory."),e.default.createElement("a",{className:"change8-admin-link",href:"/admin/resources/Orders/actions/list"},e.default.createElement("strong",null,"Orders"),"Review and process customer orders."),e.default.createElement("a",{className:"change8-admin-link",href:"/admin/resources/Users/actions/list"},e.default.createElement("strong",null,"Users"),"View registered users and roles.")),e.default.createElement("div",{className:"change8-admin-panel",style:{padding:"20px"}},e.default.createElement("h2",{className:"change8-admin-section-title"},"Products Table"),e.default.createElement("div",{className:"change8-admin-table-wrap"},e.default.createElement("table",{className:"change8-admin-table"},e.default.createElement("thead",null,e.default.createElement("tr",null,e.default.createElement("th",null,"Image"),e.default.createElement("th",null,"Name"),e.default.createElement("th",null,"Category"),e.default.createElement("th",null,"Stock"),e.default.createElement("th",null,"Price"),e.default.createElement("th",null,"Status"),e.default.createElement("th",null,"Action"))),e.default.createElement("tbody",null,g.length?g.map(r=>e.default.createElement("tr",{key:r.id},e.default.createElement("td",{className:"change8-admin-thumb-cell"},e.default.createElement("img",{className:"change8-admin-thumb",src:Pe(ye(r),320),alt:r.name,loading:"lazy",decoding:"async"})),e.default.createElement("td",null,r.name),e.default.createElement("td",null,r.categoryName||"-"),e.default.createElement("td",null,Number(r.stock||0)),e.default.createElement("td",null,be(r.price)),e.default.createElement("td",null,e.default.createElement("span",{className:`change8-admin-status-pill ${r.isActive?"change8-admin-status-pill--active":"change8-admin-status-pill--inactive"}`},r.isActive?"Active":"Inactive")),e.default.createElement("td",null,e.default.createElement("a",{href:xe(r)},"View")))):e.default.createElement("tr",null,e.default.createElement("td",{colSpan:7,style:{color:"#64748b"}},"No products available.")))))),e.default.createElement("div",{className:"change8-admin-panel",style:{padding:"20px"}},e.default.createElement("h2",{className:"change8-admin-section-title"},"Categories"),e.default.createElement("div",{className:"change8-admin-category-list"},j.map(r=>e.default.createElement("div",{key:r.name,className:"change8-admin-category-item"},e.default.createElement("span",null,e.default.createElement("strong",{className:"change8-admin-category-name"},r.name),e.default.createElement("span",{className:"change8-admin-category-meta"},"Products in category")),e.default.createElement("span",{style:{fontWeight:700}},r.count))))))):e.default.createElement("div",{className:"change8-storefront-dashboard"},e.default.createElement("style",null,`
        .change8-storefront-dashboard {
          --bg: #f7f7f7;
          --text: #111111;
          --muted: #666666;
          --line: rgba(17, 17, 17, 0.08);
          --accent: #ff2d8b;
          --success: #45d255;
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
          font-family: "Poppins", "Segoe UI", sans-serif;
        }

        .change8-shell {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .change8-top-strip {
          background:#0EA5E9;
          color: #000;
          text-align: center;
          font-size: 13px;
          padding: 7px 12px;
          letter-spacing: 0.01em;
        }

        .change8-nav {
          background: #050505;
          color: white;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 16px;
          padding: 18px 28px;
          position: relative;
          z-index: 30;
        }

        .change8-nav,
        .change8-search,
        .change8-user-toggle,
        .change8-logout-button,
        .change8-hero-button,
        .change8-product-card {
          -webkit-tap-highlight-color: transparent;
        }

        .change8-nav-links {
          display: flex;
          flex-wrap: wrap;
          gap: 28px;
          align-items: center;
          font-weight: 700;
        }

        .change8-nav-user-display {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          min-height: 34px;
          padding: 8px 14px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: white;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.02em;
          white-space: nowrap;
        }

        .change8-nav-user-display::before {
          content: "";
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: var(--accent);
          box-shadow: 0 0 0 4px rgba(255, 45, 139, 0.16);
          flex: 0 0 auto;
        }

        .change8-nav-links a {
          color: white;
          text-decoration: none;
        }

        .change8-nav-links a,
        .change8-nav-links a:visited {
          padding: 6px 0;
        }

        .change8-nav-links a.is-active {
          color: var(--accent);
        }

        .change8-brand {
          width: 86px;
          height: 86px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 28%, #f7ff59 0%, #1ec63a 34%, #111 100%);
          color: white;
          font-weight: 800;
          font-size: 17px;
          line-height: 0.95;
          text-align: center;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);
        }

        .change8-brand img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          border-radius: 50%;
        }

        .change8-brand small {
          display: block;
          font-size: 10px;
          letter-spacing: 0.12em;
          margin-top: 4px;
        }

        .change8-nav-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 14px;
        }

        .change8-search {
          width: min(100%, 280px);
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 18px;
          border-radius: 999px;
          background: white;
          color: #111;
          border: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
        }

        .change8-search svg {
          flex: 0 0 auto;
          stroke: #666;
          opacity: 0.7;
        }

        .change8-search input {
          border: 0;
          outline: 0;
          width: 100%;
          background: #fff !important;
          -webkit-box-shadow: none !important;
          box-shadow: none !important;
          color: #111;
          font: inherit;
          font-size: 14px;
          min-width: 0;
          appearance: none;
          -webkit-appearance: none;
          caret-color: #111;
        }

        .change8-search input::placeholder {
          color: #999;
          opacity: 0.8;
        }

        .change8-search input:-webkit-autofill,
        .change8-search input:-webkit-autofill:hover,
        .change8-search input:-webkit-autofill:focus,
        .change8-search input:-webkit-autofill:active {
          -webkit-text-fill-color: #111 !important;
          -webkit-box-shadow: 0 0 0 1000px #fff inset !important;
          box-shadow: 0 0 0 1000px #fff inset !important;
          caret-color: #111;
        }

        .change8-icon {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          border: 2px solid rgba(255, 255, 255, 0.92);
          color: white;
          position: relative;
        }

        .change8-cart-button {
          padding: 0;
          background: transparent;
          cursor: pointer;
        }

        .change8-user-fallback {
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }

        .change8-user-fallback .change8-icon {
          flex: 0 0 auto;
        }

        .change8-user-menu {
          position: relative;
          display: inline-flex;
          align-items: center;
        }

        .change8-user-toggle {
          appearance: none;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.08);
          color: white;
          border-radius: 999px;
          padding: 8px 14px;
          min-height: 34px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          font: inherit;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.02em;
          white-space: nowrap;
        }

        .change8-user-toggle::before {
          content: "";
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: var(--accent);
          box-shadow: 0 0 0 4px rgba(255, 45, 139, 0.16);
          flex: 0 0 auto;
        }

        .change8-user-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          min-width: 170px;
          padding: 14px 12px;
          border-radius: 16px;
          background: #0d1320;
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 18px 30px rgba(0, 0, 0, 0.32);
          z-index: 20;
          overflow: visible;
        }

        .change8-logout-button {
          width: 100%;
          border: 0;
          cursor: pointer;
          background: #ff2d8b;
          color: white;
          border-radius: 14px;
          padding: 13px 16px;
          font: inherit;
          font-size: 13px;
          font-weight: 700;
          text-align: center;
          letter-spacing: 0.02em;
          transition: background 0.2s ease;
        }

        .change8-logout-button:hover {
          background: #ff4a9b;
        }

        .change8-logout-button:active {
          background: #ff1a7c;
        }

        .change8-icon svg {
          width: 18px;
          height: 18px;
          stroke: currentColor;
          fill: none;
          stroke-width: 2;
        }

        .change8-badge {
          position: absolute;
          top: -7px;
          right: -7px;
          min-width: 17px;
          height: 17px;
          padding: 0 4px;
          border-radius: 999px;
          background: #ff6b6b;
          color: white;
          font-size: 10px;
          display: grid;
          place-items: center;
          font-weight: 700;
        }

        html[data-admin-theme="light"] .change8-storefront-dashboard .change8-nav {
          background: #f3f4f6;
          color: #111827;
          border-bottom: 1px solid rgba(17, 24, 39, 0.08);
        }

        html[data-admin-theme="light"] .change8-storefront-dashboard .change8-nav-links a {
          color: #111827;
        }

        html[data-admin-theme="light"] .change8-storefront-dashboard .change8-nav-links a.is-active {
          color: var(--accent);
        }

        html[data-admin-theme="light"] .change8-storefront-dashboard .change8-icon {
          color: #111827;
          border-color: rgba(17, 24, 39, 0.2);
          background: #ffffff;
        }

        html[data-admin-theme="light"] .change8-storefront-dashboard .change8-user-toggle {
          color: #111827;
          background: #ffffff;
          border-color: rgba(17, 24, 39, 0.15);
        }

        html[data-admin-theme="light"] .change8-storefront-dashboard .change8-user-dropdown {
          background: #ffffff;
          border-color: rgba(17, 24, 39, 0.12);
          box-shadow: 0 12px 26px rgba(15, 23, 42, 0.12);
        }

        .change8-content {
          flex: 1;
          position: relative;
          z-index: 1;
        }

        .change8-hero {
          position: relative;
          min-height: 470px;
          overflow: hidden;
          background: #ffffff;
        }

        .change8-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(0, 0, 0, 0.08) 0%, rgba(0, 0, 0, 0.03) 46%, rgba(0, 0, 0, 0) 100%);
          z-index: 0;
        }

        .change8-hero-image {
          position: absolute;
          inset: 0;
          background-image: url("${K}");
          background-size: cover;
          background-position: center;
          opacity: 1;
          transform: scale(1.01);
        }

        .change8-hero-copy {
          position: relative;
          z-index: 1;
          width: min(100%, 560px);
          margin-left: auto;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          color: white;
          padding: 24px 38px 56px;
        }

        .change8-hero-eyebrow {
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-size: 12px;
          font-weight: 700;
          opacity: 0.95;
          margin-bottom: 12px;
        }

        .change8-hero-title {
          margin: 0;
          font-size: clamp(40px, 4.8vw, 66px);
          line-height: 0.95;
          text-transform: uppercase;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .change8-hero-subtitle {
          margin: 12px 0 0;
          font-size: clamp(18px, 2.2vw, 28px);
          letter-spacing: 0.34em;
          text-transform: uppercase;
          opacity: 0.95;
        }

        .change8-hero-button {
          margin-top: 30px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 170px;
          padding: 16px 22px;
          border-radius: 999px;
          border: 0;
          background: white;
          color: #111;
          font-size: 18px;
          letter-spacing: 0.14em;
          text-decoration: none;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        .change8-slider-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 54px;
          height: 54px;
          border: 0;
          background: transparent;
          color: rgba(255, 255, 255, 0.88);
          font-size: 64px;
          line-height: 1;
          cursor: pointer;
          z-index: 2;
          display: grid;
          place-items: center;
        }

        .change8-slider-arrow:hover {
          color: white;
        }

        .change8-slider-arrow--left {
          left: 8px;
        }

        .change8-slider-arrow--right {
          right: 8px;
        }

        .change8-slider-dots {
          position: absolute;
          left: 50%;
          bottom: 12px;
          transform: translateX(-50%);
          display: flex;
          gap: 10px;
          z-index: 2;
        }

        .change8-slider-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 0;
          background: rgba(255, 255, 255, 0.92);
          cursor: pointer;
        }

        .change8-slider-dot.is-active {
          background: #39d353;
        }

        .change8-products {
          background: white;
          padding: 12px 0 10px;
        }

        .change8-product-card {
          display: block;
          border-radius: 18px;
          overflow: hidden;
          background: #ffffff;
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
          transition:
            transform 0.18s ease,
            box-shadow 0.18s ease;
        }

        .change8-product-card:active {
          transform: scale(0.985);
          box-shadow: 0 6px 16px rgba(15, 23, 42, 0.1);
        }

        .change8-product-card:focus-visible,
        .change8-hero-button:focus-visible,
        .change8-search input:focus-visible,
        .change8-user-toggle:focus-visible,
        .change8-logout-button:focus-visible,
        .change8-slider-arrow:focus-visible,
        .change8-slider-dot:focus-visible {
          outline: 2px solid rgba(255, 45, 139, 0.55);
          outline-offset: 2px;
        }

        .change8-products-head {
          padding: 10px 14px 20px;
        }

        .change8-products-title {
          margin: 0;
          text-align: center;
          font-size: clamp(28px, 3vw, 42px);
          line-height: 1;
          font-weight: 800;
          text-transform: uppercase;
        }

        .change8-product-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 18px;
          padding: 0 14px 18px;
        }

        .change8-product-card {
          color: #111;
          text-decoration: none;
        }

        .change8-product-media {
          position: relative;
          aspect-ratio: 0.95;
          overflow: hidden;
          background: #e5e7eb;
        }

        .change8-product-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .change8-favorite {
          position: absolute;
          top: 10px;
          left: 10px;
          color: white;
          font-size: 21px;
          line-height: 1;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
        }

        .change8-product-name {
          margin: 10px 0 0;
          font-size: 18px;
          line-height: 1.12;
          font-weight: 700;
          min-height: 40px;
        }

        .change8-product-price {
          margin-top: 8px;
          font-size: 14px;
          font-weight: 600;
        }

        .change8-product-price s {
          color: #666;
          margin-right: 6px;
        }

        .change8-empty,
        .change8-loading {
          margin: 0 14px 18px;
          padding: 22px;
          border-radius: 18px;
          border: 1px dashed rgba(17, 17, 17, 0.18);
          background: rgba(255, 255, 255, 0.7);
          color: var(--muted);
        }

        @media (max-width: 1200px) {
          .change8-product-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 820px) {
          .change8-nav {
            grid-template-columns: 1fr;
            justify-items: stretch;
            gap: 12px;
            padding: 16px 16px 14px;
          }

          .change8-nav-links {
            justify-content: flex-start;
            gap: 12px;
            flex-wrap: nowrap;
            overflow-x: auto;
            padding-bottom: 4px;
            -webkit-overflow-scrolling: touch;
          }

          .change8-nav-links a {
            white-space: nowrap;
            padding: 8px 12px;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.08);
          }

          .change8-nav-actions {
            width: 100%;
            justify-content: stretch;
            flex-wrap: wrap;
            gap: 10px;
          }

          .change8-nav-user-display {
            width: 100%;
            justify-content: center;
          }

          .change8-search {
            width: 100%;
            min-width: 0;
          }

          .change8-user-menu,
          .change8-user-fallback,
          .change8-icon,
          .change8-cart-button {
            flex: 0 0 auto;
          }

          .change8-user-dropdown {
            left: 0;
            right: auto;
            width: min(100%, 240px);
          }

          .change8-hero-copy {
            width: 100%;
            padding: 22px 16px 46px;
            align-items: flex-start;
            text-align: left;
          }

          .change8-hero-button {
            width: min(100%, 220px);
            font-size: 16px;
          }

          .change8-product-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
            padding: 0 12px 12px;
          }

          .change8-slider-arrow {
            font-size: 44px;
            width: 40px;
            height: 40px;
          }

          .change8-slider-arrow--left {
            left: 4px;
          }

          .change8-slider-arrow--right {
            right: 4px;
          }
        }

        @media (max-width: 560px) {
          .change8-nav {
            padding: 12px 12px 12px;
          }

          .change8-top-strip {
            font-size: 12px;
            padding: 6px 10px;
          }

          .change8-brand {
            width: 64px;
            height: 64px;
            font-size: 13px;
          }

          .change8-search {
            width: 100%;
            padding: 11px 14px;
          }

          .change8-hero {
            min-height: 380px;
          }

          .change8-hero-copy {
            padding: 18px 14px 42px;
          }

          .change8-hero-title {
            font-size: clamp(30px, 11vw, 42px);
          }

          .change8-hero-subtitle {
            font-size: 14px;
            letter-spacing: 0.18em;
            margin-top: 8px;
          }

          .change8-hero-button {
            width: 100%;
            min-width: 0;
            margin-top: 22px;
            padding: 14px 18px;
          }

          .change8-product-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .change8-product-name {
            font-size: 16px;
            min-height: auto;
          }

          .change8-product-price {
            font-size: 13px;
          }

          .change8-favorite {
            font-size: 18px;
            top: 8px;
            left: 8px;
          }

          .change8-slider-arrow {
            display: none;
          }

          .change8-slider-dots {
            bottom: 10px;
            gap: 8px;
          }

          .change8-slider-dot {
            width: 12px;
            height: 12px;
          }

          .change8-products-title {
            font-size: 22px;
          }

          .change8-products-head {
            padding: 6px 12px 14px;
          }

          .change8-loading,
          .change8-empty {
            margin: 0 12px 14px;
            padding: 18px;
            border-radius: 14px;
          }
        }

        @media (max-width: 420px) {
          .change8-nav-links {
            gap: 8px;
          }

          .change8-nav-links a {
            padding: 7px 10px;
            font-size: 13px;
          }

          .change8-brand {
            width: 58px;
            height: 58px;
          }

          .change8-hero {
            min-height: 350px;
          }

          .change8-hero-title {
            font-size: clamp(28px, 10vw, 38px);
          }

          .change8-hero-subtitle {
            letter-spacing: 0.12em;
          }

          .change8-product-card {
            border-radius: 16px;
          }
        }
      `),e.default.createElement("div",{className:"change8-shell"},e.default.createElement("div",{className:"change8-top-strip"},"FREE SHIPPING now available in Sri Lanka"),e.default.createElement("header",{className:"change8-nav"},e.default.createElement("div",{className:"change8-nav-links","aria-label":"Primary"},e.default.createElement("a",{href:"#hero",className:"is-active"},"Home"),e.default.createElement("a",{href:"#products"},"Product"),e.default.createElement(H.Link,{to:"/admin/pages/About"},"About"),e.default.createElement(H.Link,{to:"/admin/pages/Contact"},"Contact Us")),e.default.createElement("div",{className:"change8-brand","aria-label":"Store brand"},e.default.createElement("img",{src:"/public/icon.png",alt:"Store logo"})),e.default.createElement("div",{className:"change8-nav-actions"},e.default.createElement("label",{className:"change8-search",htmlFor:"change8-search-input"},e.default.createElement("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2"},e.default.createElement("circle",{cx:"11",cy:"11",r:"7"}),e.default.createElement("path",{d:"M20 20l-3.5-3.5"})),e.default.createElement("input",{id:"change8-search-input",type:"search",placeholder:"Search Products",value:x,onChange:r=>i(r.target.value)})),c?e.default.createElement("div",{className:"change8-user-menu"},e.default.createElement("button",{type:"button",className:"change8-user-toggle","aria-label":"Logged in user menu","aria-expanded":P,onClick:r=>{r.stopPropagation(),C(u=>!u)}},c),P?e.default.createElement("div",{className:"change8-user-dropdown",role:"menu",onClick:r=>r.stopPropagation()},e.default.createElement("button",{type:"button",className:"change8-logout-button",onClick:()=>{C(!1),window.location.href="/admin/logout"}},"Logout")):null):e.default.createElement("div",{className:"change8-user-fallback","aria-label":"Account"},e.default.createElement("div",{className:"change8-icon"},e.default.createElement("svg",{viewBox:"0 0 24 24"},e.default.createElement("circle",{cx:"12",cy:"8",r:"4"}),e.default.createElement("path",{d:"M4 20c1.8-4.2 5-6 8-6s6.2 1.8 8 6"})))),e.default.createElement("div",{className:"change8-icon","aria-label":"Wishlist"},e.default.createElement("svg",{viewBox:"0 0 24 24"},e.default.createElement("path",{d:"M12 21s-7-4.6-9.2-9.2C.8 8.2 2.4 5 5.8 5c1.8 0 3.2 1 4.2 2.2C11 6 12.5 5 14.2 5c3.4 0 5 3.2 3 6.8C19 16.4 12 21 12 21z"}))),e.default.createElement("button",{type:"button",className:"change8-icon change8-cart-button","aria-label":"Cart",onClick:()=>{window.location.assign(z)}},e.default.createElement("svg",{viewBox:"0 0 24 24"},e.default.createElement("path",{d:"M3 4h2l2.2 11.3A2 2 0 0 0 9.2 17H18a2 2 0 0 0 2-1.6l1.1-6.4H6.1"}),e.default.createElement("circle",{cx:"9",cy:"20",r:"1.5"}),e.default.createElement("circle",{cx:"17",cy:"20",r:"1.5"})),e.default.createElement("span",{className:"change8-badge"},Math.max(0,Number(t?.orders||0)))))),e.default.createElement("main",{className:"change8-content"},e.default.createElement("section",{className:"change8-hero",id:"hero"},e.default.createElement("div",{className:"change8-hero-image"}),e.default.createElement("button",{type:"button",className:"change8-slider-arrow change8-slider-arrow--left","aria-label":"Previous slide",onClick:()=>{A.length&&f(r=>r===0?A.length-1:r-1)}},"\u2039"),e.default.createElement("button",{type:"button",className:"change8-slider-arrow change8-slider-arrow--right","aria-label":"Next slide",onClick:()=>{A.length&&f(r=>(r+1)%A.length)}},"\u203A"),e.default.createElement("div",{className:"change8-hero-copy"},e.default.createElement("div",{className:"change8-hero-eyebrow"},"New season drop"),e.default.createElement("h1",{className:"change8-hero-title"},s),e.default.createElement("p",{className:"change8-hero-subtitle"},h),e.default.createElement("a",{href:y||"#products",className:"change8-hero-button",onClick:r=>{y||r.preventDefault()}},"Shop Now")),e.default.createElement("div",{className:"change8-slider-dots","aria-label":"Carousel navigation"},A.map((r,u)=>e.default.createElement("button",{key:r.id||`${r.name}-${u}`,type:"button",className:`change8-slider-dot ${u===d?"is-active":""}`,"aria-label":`Go to slide ${u+1}`,onClick:()=>f(u)})))),e.default.createElement("section",{className:"change8-products",id:"products"},e.default.createElement("div",{className:"change8-products-head"},e.default.createElement("h2",{className:"change8-products-title"},"Our Products")),b?e.default.createElement("div",{className:"change8-loading"},"Loading products..."):v.length===0?e.default.createElement("div",{className:"change8-empty"},"No products found."):e.default.createElement("div",{className:"change8-product-grid"},v.map(r=>{const u=xe(r),I=ye(r);return e.default.createElement("article",{key:r.id},e.default.createElement(H.Link,{className:"change8-product-card",to:u||"#",onClick:X=>{u||X.preventDefault()}},e.default.createElement("div",{className:"change8-product-media"},I?e.default.createElement("img",{src:I,alt:r.name}):e.default.createElement("div",{style:{width:"100%",height:"100%",display:"grid",placeItems:"center",color:"#111",fontWeight:800,fontSize:"22px",background:"linear-gradient(135deg, #dbeafe, #fce7f3)"}},Ge(r)),e.default.createElement("span",{className:"change8-favorite"},"\u2661")),e.default.createElement("h3",{className:"change8-product-name"},r.name),e.default.createElement("div",{className:"change8-product-price"},e.default.createElement("s",null,be(r.price*1.14)),be(r.price))))})))))):e.default.createElement("div",{className:"change8-admin-dashboard",style:{display:"grid",placeItems:"center",minHeight:"100vh"}},e.default.createElement("div",{style:{padding:"16px 20px",borderRadius:"14px",border:"1px solid rgba(15, 23, 42, 0.08)",background:"#ffffff",boxShadow:"0 10px 24px rgba(15, 23, 42, 0.08)",color:"#0f172a",fontWeight:700}},"Loading dashboard..."))},et=()=>{const[t,a]=o.useState({name:"",email:"",password:""}),[n,l]=o.useState({type:"",text:""}),[p,m]=o.useState(!1);o.useEffect(()=>{document.body.style.margin="0"},[]);const b=x=>{a(i=>({...i,[x.target.name]:x.target.value}))},k=async x=>{x.preventDefault(),l({type:"",text:""}),m(!0);try{const i=await fetch("/api/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),d=await i.json();if(!i.ok)throw new Error(d.message||"Registration failed");l({type:"success",text:"Account created successfully! Redirecting..."}),setTimeout(()=>{window.location.href="/admin"},2e3)}catch(i){l({type:"error",text:i.message}),m(!1)}};return e.default.createElement("div",{className:"register-page"},e.default.createElement("style",null,`
        .register-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background:
            linear-gradient(rgba(15, 23, 42, 0.35), rgba(15, 23, 42, 0.35)),
            url('/public/img2.jpg') center / cover fixed;
          font-family: "Plus Jakarta Sans", "Segoe UI", sans-serif;
        }

        .register-card {
          width: min(100%, 520px);
          padding: 60px;
          border-radius: 28px;
          background: rgba(15, 23, 42, 0.82);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(30px);
          color: #fff;
        }

        .register-logo {
          margin-bottom: 30px;
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.01em;
        }

        .register-logo span {
          color: #6366f1;
        }

        .register-field {
          margin-bottom: 20px;
        }

        .register-label {
          display: block;
          margin-bottom: 10px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.5);
        }

        .register-input {
          width: 100%;
          padding: 14px 18px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
          font-size: 15px;
          outline: none;
          transition: all 0.3s ease;
        }

        .register-input:focus {
          border-color: #6366f1;
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2);
        }

        .register-button {
          width: 100%;
          margin-top: 10px;
          padding: 16px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4);
        }

        .register-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .register-message {
          margin-bottom: 20px;
          padding: 12px;
          border-radius: 10px;
          font-size: 13px;
          display: none;
        }

        .register-message.is-visible {
          display: block;
        }

        .register-message.error {
          color: #f87171;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .register-message.success {
          color: #4ade80;
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.2);
        }

        .register-footer {
          margin-top: 25px;
          text-align: center;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
        }

        .register-footer a {
          color: #6366f1;
          text-decoration: none;
          font-weight: 600;
        }

        .register-footer a:hover {
          text-decoration: underline;
        }

        @media (max-width: 850px) {
          .register-card {
            padding: 40px;
          }
        }
      `),e.default.createElement("div",{className:"register-card"},e.default.createElement("div",{className:"register-logo"},"Register our site"),e.default.createElement("div",{className:`register-message ${n.type} ${n.text?"is-visible":""}`},n.text),e.default.createElement("form",{onSubmit:k},e.default.createElement("div",{className:"register-field"},e.default.createElement("label",{className:"register-label",htmlFor:"name"},"Full Name"),e.default.createElement("input",{className:"register-input",type:"text",id:"name",name:"name",placeholder:"Enter your full name",value:t.name,onChange:b,required:!0})),e.default.createElement("div",{className:"register-field"},e.default.createElement("label",{className:"register-label",htmlFor:"email"},"Email Address"),e.default.createElement("input",{className:"register-input",type:"email",id:"email",name:"email",placeholder:"example@email.com",value:t.email,onChange:b,required:!0})),e.default.createElement("div",{className:"register-field"},e.default.createElement("label",{className:"register-label",htmlFor:"password"},"Password"),e.default.createElement("input",{className:"register-input",type:"password",id:"password",name:"password",placeholder:"At least 6 characters",minLength:6,value:t.password,onChange:b,required:!0})),e.default.createElement("button",{className:"register-button",type:"submit",disabled:p},p?"Creating account...":"Create Account")),e.default.createElement("div",{className:"register-footer"},"Already have an account? ",e.default.createElement(H.Link,{to:"/admin"},"Log in"),e.default.createElement("br",null),e.default.createElement(H.Link,{to:"/admin/pages/About"},"About")," |"," ",e.default.createElement(H.Link,{to:"/admin/pages/Contact"},"Contact"))))},tt={display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(240px, 1fr))",gap:"16px"},at={borderRadius:"16px",border:"1px solid rgba(148, 163, 184, 0.28)",background:"linear-gradient(160deg, #0b1a38 0%, #09162f 100%)",color:"#f8fafc",overflow:"hidden",boxShadow:"0 12px 22px rgba(2, 6, 23, 0.25)"},rt={width:"100%",height:"200px",background:"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",padding:"8px"},nt={width:"100%",height:"100%",objectFit:"contain"},ot={padding:"14px",display:"grid",gap:"8px"},lt={display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",fontSize:"13px",color:"#cbd5e1"},it=t=>({width:"fit-content",fontSize:"11px",fontWeight:700,letterSpacing:"0.05em",padding:"5px 10px",borderRadius:"999px",color:t?"#14532d":"#7f1d1d",background:t?"#bbf7d0":"#fecaca"}),st={display:"inline-block",marginTop:"4px",color:"#93c5fd",textDecoration:"none",fontSize:"13px",fontWeight:600,cursor:"pointer"},Ee={padding:"18px",borderRadius:"12px",border:"1px dashed rgba(148, 163, 184, 0.45)",color:"#cbd5e1"},ct=(t,a=640,n="auto")=>{const l=String(t||"").trim();return l?!l.includes("res.cloudinary.com")||!l.includes("/upload/")?l:l.replace("/upload/",`/upload/f_auto,q_${n},w_${a},c_limit,dpr_auto/`):""},dt=t=>{const a=Number(t||0);return Number.isFinite(a)?a.toLocaleString(void 0,{minimumFractionDigits:2,maximumFractionDigits:2}):"0.00"},Ie=t=>t?.params?.id||t?.id||t?.param?.id||"",mt=(t,a)=>{const p=(t?.recordActions||t?.actions||[]).find(b=>b?.name==="show")?.href||t?.href||"";if(p)return p;const m=Ie(t);return m?`/admin/resources/${encodeURIComponent(a)}/records/${encodeURIComponent(m)}/show`:""},ut=t=>{const[a,n]=o.useState([]),[l,p]=o.useState(!1),[m,b]=o.useState(""),k=t?.resource?.id==="Product"?"Products":t?.resource?.id||"Products",x=t?.records||[];o.useEffect(()=>{if(x.length)return;let d=!0;return(async()=>{p(!0),b("");try{const c=await fetch(`/admin/api/resources/${encodeURIComponent(k)}/actions/list`,{credentials:"same-origin"}),w=await c.json();if(!c.ok)throw new Error(w?.message||"Failed to load products");d&&n(w?.records||[])}catch(c){d&&b(c?.message||"Failed to load products")}finally{d&&p(!1)}})(),()=>{d=!1}},[x.length,k]);const i=o.useMemo(()=>x.length?x:a,[x,a]);return l?e.default.createElement("div",{style:Ee},"Loading products..."):m?e.default.createElement("div",{style:Ee},m):i.length?e.default.createElement("div",{style:tt},i.map(d=>{const f=d?.params||{},c=Ie(d),w=f?.name||"Unnamed product",$=f?.categoryId||"-",F=f?.imageUrl||"",N=ct(F,560),O=Number(f?.stock||0),P=!!f?.isActive,C=mt(d,k);return e.default.createElement("article",{key:c,style:at},e.default.createElement("div",{style:rt},F?e.default.createElement("img",{src:N||F,alt:w,style:nt,loading:"lazy",decoding:"async"}):e.default.createElement("div",{style:{height:"100%",display:"flex",alignItems:"center",justifyContent:"center",color:"#94a3b8",fontSize:"13px"}},"No image")),e.default.createElement("div",{style:ot},e.default.createElement("div",{style:{fontSize:"18px",fontWeight:700}},w),e.default.createElement("div",{style:lt},e.default.createElement("div",null,"Category: ",$),e.default.createElement("div",null,"Stock: ",O),e.default.createElement("div",null,"Price: Rs. ",dt(f?.price))),e.default.createElement("span",{style:it(P)},P?"ACTIVE":"INACTIVE"),e.default.createElement("a",{href:C||"#",style:st,"aria-disabled":!C},"View details")))})):e.default.createElement("div",{style:Ee},"No products found.")},pt={display:"grid",gridTemplateColumns:"minmax(320px, 1.05fr) minmax(360px, 0.95fr)",gap:"32px",alignItems:"start"},Ae={minHeight:"100%",padding:"24px",color:"#111827",background:"#ffffff"},gt={display:"flex",alignItems:"center",justifyContent:"space-between",gap:"16px",marginBottom:"18px",flexWrap:"wrap"},ft={color:"#111827",textDecoration:"none",display:"grid",gridTemplateColumns:"minmax(320px, 1.05fr) minmax(360px, 0.95fr)",gap:"18px",alignItems:"start"},ve={borderRadius:"22px",border:"1px solid rgba(17, 24, 39, 0.08)",background:"#ffffff",boxShadow:"0 18px 34px rgba(15, 23, 42, 0.08)",overflow:"hidden"},ht={...ve,display:"grid",gridTemplateRows:"1fr auto",minHeight:"500px"},bt={background:"#f8fafc",minHeight:"340px",display:"grid",placeItems:"center"},De={width:"100%",height:"100%",objectFit:"cover",display:"block"},yt={width:"100%",height:"100%",display:"grid",placeItems:"center",color:"#64748b",background:"linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",fontSize:"14px",letterSpacing:"0.08em",textTransform:"uppercase"},xt={display:"flex",alignItems:"center",justifyContent:"space-between",gap:"12px",padding:"16px 18px 18px",background:"#ffffff",borderTop:"1px solid rgba(17, 24, 39, 0.08)",flexWrap:"wrap"},Et={margin:0,fontSize:"clamp(30px, 4vw, 54px)",lineHeight:1,fontWeight:800,color:"#111827",textTransform:"capitalize"},vt={margin:"8px 0 0",color:"#6b7280",fontSize:"14px"},wt=t=>({display:"inline-flex",alignItems:"center",gap:"8px",width:"fit-content",padding:"7px 12px",borderRadius:"999px",fontSize:"11px",fontWeight:800,letterSpacing:"0.1em",textTransform:"uppercase",color:t?"#14532d":"#7f1d1d",background:t?"#bbf7d0":"#fecaca"}),St=t=>({width:"8px",height:"8px",borderRadius:"999px",background:t?"#22c55e":"#ef4444"}),kt={display:"grid",gridTemplateColumns:"repeat(3, minmax(0, 1fr))",gap:"12px",marginTop:"18px"},ie={borderRadius:"16px",border:"1px solid rgba(17, 24, 39, 0.08)",background:"#f8fafc",padding:"14px"},se={fontSize:"11px",textTransform:"uppercase",letterSpacing:"0.18em",color:"#6b7280",marginBottom:"8px"},ce={fontSize:"17px",fontWeight:700,color:"#111827",wordBreak:"break-word"};({...ve});const Ue={margin:0,fontSize:"13px",fontWeight:800,letterSpacing:"0.18em",textTransform:"uppercase",color:"#111827"},Nt={marginTop:"12px",color:"#374151",fontSize:"15px",lineHeight:1.8,whiteSpace:"pre-wrap"},zt={display:"grid",gap:"10px",marginTop:"12px"},Z={display:"flex",justifyContent:"space-between",gap:"12px",paddingBottom:"10px",borderBottom:"1px solid rgba(17, 24, 39, 0.08)"},ee={color:"#6b7280",fontSize:"13px"},te={color:"#111827",fontWeight:600,textAlign:"right",fontSize:"13px"},Ct={display:"flex",gap:"12px",flexWrap:"wrap",marginTop:"18px"},Pt={display:"inline-flex",alignItems:"center",justifyContent:"center",gap:"8px",minWidth:"180px",padding:"14px 18px",borderRadius:"14px",border:"none",background:"linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",color:"#ffffff",fontSize:"15px",fontWeight:700,cursor:"pointer",boxShadow:"0 10px 18px rgba(99, 102, 241, 0.3)"},It=t=>`Rs. ${Number(t||0).toLocaleString(void 0,{minimumFractionDigits:2,maximumFractionDigits:2})}`,Le=t=>{if(!t)return"-";const a=new Date(t);return Number.isNaN(a.getTime())?String(t):a.toLocaleString(void 0,{dateStyle:"medium",timeStyle:"short"})},At=t=>Array.isArray(t?.images)&&t.images.length>0?t.images:t?.imageUrl||t?.image||t?.thumbnail||t?.cover||"",Dt=t=>{if(!t)return{};let a=t;if(typeof a=="string")try{a=JSON.parse(a)}catch{return{}}if(!a||typeof a!="object"||Array.isArray(a))return{};const n={};for(const[l,p]of Object.entries(a)){const m=String(l||"").trim().toUpperCase();if(!m)continue;const b=Number(p);Number.isFinite(b)&&(n[m]=Math.max(0,Math.trunc(b)))}return n},Ut=t=>{const a=t?.record,n=a?.params||{},[l,p]=o.useState(null),[m,b]=o.useState(n),[k,x]=o.useState(!0),i=n?.id||a?.id||"",d=m?.name||"Unnamed product",f=m?.sku||"-",c=m?.categoryId||"-",w=At(m),$=Number(m?.stock||0),F=Dt(m?.sizeStock),N=Object.entries(F),O=!!m?.isActive,P=It(m?.price),C=m?.description||"No description available for this product.",q=i?`/admin/resources/Orders/actions/new?productId=${encodeURIComponent(String(i))}`:"",R=()=>{q&&window.location.assign(q)};return o.useEffect(()=>{x(!0);const A=!n?.sizeStock||!n?.name;i&&A?fetch(`/api/products/${i}`,{method:"GET",credentials:"include"}).then(s=>s.ok?s.json():null).catch(()=>null).then(s=>{s?.id&&b(s),x(!1)}):(b(n),x(!1)),fetch("/admin/context/current-user",{method:"GET",credentials:"include"}).then(s=>s.ok?s.json():null).catch(()=>null).then(s=>{s?.role&&p(s.role)});const B=document.documentElement,K=document.body;return B.classList.add("change8-product-show-active"),K?.classList.add("change8-product-show-active"),()=>{B.classList.remove("change8-product-show-active"),K?.classList.remove("change8-product-show-active")}},[i]),k?e.default.createElement("div",{style:{...Ae,minHeight:"60vh",display:"flex",alignItems:"center",justifyContent:"center"}},e.default.createElement("style",null,`
          html.change8-product-show-active [data-testid="sidebar"],
          html.change8-product-show-active .adminjs_Sidebar,
          html.change8-product-show-active section[data-css="sidebar"],
          html.change8-product-show-active aside[data-css="sidebar"],
          html.change8-product-show-active nav[data-css="sidebar"] {
            display: none !important;
            width: 0 !important;
            min-width: 0 !important;
            max-width: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
            border: 0 !important;
            overflow: hidden !important;
            box-shadow: none !important;
          }
        `),e.default.createElement("div",{style:{fontSize:"1.2rem",color:"#64748b"}},"Loading product details...")):e.default.createElement("div",{style:Ae},e.default.createElement("style",null,`
        html.change8-product-show-active,
        html.change8-product-show-active body,
        html.change8-product-show-active #app,
        html.change8-product-show-active .adminjs_Layout,
        html.change8-product-show-active [data-testid="layout"],
        html.change8-product-show-active [data-css="layout"],
        html.change8-product-show-active main,
        body.change8-product-show-active,
        body.change8-product-show-active #app,
        body.change8-product-show-active .adminjs_Layout,
        body.change8-product-show-active [data-testid="layout"],
        body.change8-product-show-active [data-css="layout"],
        body.change8-product-show-active main {
          background: #ffffff !important;
          background-color: #ffffff !important;
          background-image: none !important;
        }

        html.change8-product-show-active body::before,
        html.change8-product-show-active::before,
        body.change8-product-show-active::before {
          content: none !important;
          display: none !important;
          background: none !important;
          background-image: none !important;
        }

        html.change8-product-show-active [data-testid="sidebar"],
        html.change8-product-show-active .adminjs_Sidebar,
        html.change8-product-show-active section[data-css="sidebar"],
        html.change8-product-show-active aside[data-css="sidebar"],
        html.change8-product-show-active nav[data-css="sidebar"] {
          display: none !important;
          width: 0 !important;
          min-width: 0 !important;
          max-width: 0 !important;
          padding: 0 !important;
          margin: 0 !important;
          border: 0 !important;
          overflow: hidden !important;
          box-shadow: none !important;
        }

        html.change8-product-show-active .adminjs_Layout,
        html.change8-product-show-active [data-testid="layout"],
        html.change8-product-show-active [data-css="layout"] {
          grid-template-columns: 1fr !important;
        }

        html.change8-product-show-active .adminjs_Layout > *:not([data-testid="sidebar"]),
        html.change8-product-show-active [data-testid="layout"] > *:not([data-testid="sidebar"]),
        html.change8-product-show-active [data-css="layout"] > *:not([data-testid="sidebar"]) {
          width: 100% !important;
          max-width: 100% !important;
        }

        html.change8-product-show-active [data-testid="topbar"],
        html.change8-product-show-active .adminjs_TopBar,
        html.change8-product-show-active header[data-css="topbar"],
        html.change8-product-show-active section[data-css="topbar"] {
          display: none !important;
        }

        html:has(.change8-product-show-page),
        body:has(.change8-product-show-page),
        #app:has(.change8-product-show-page),
        .adminjs_Layout:has(.change8-product-show-page),
        [data-testid="layout"]:has(.change8-product-show-page),
        [data-css="layout"]:has(.change8-product-show-page),
        main:has(.change8-product-show-page) {
          background: #ffffff !important;
          background-color: #ffffff !important;
          background-image: none !important;
        }

        html:has(.change8-product-show-page) [data-testid="sidebar"],
        html:has(.change8-product-show-page) .adminjs_Sidebar,
        html:has(.change8-product-show-page) section[data-css="sidebar"],
        html:has(.change8-product-show-page) aside[data-css="sidebar"],
        html:has(.change8-product-show-page) nav[data-css="sidebar"] {
          display: none !important;
          width: 0 !important;
          min-width: 0 !important;
          max-width: 0 !important;
          padding: 0 !important;
          margin: 0 !important;
          border: 0 !important;
          overflow: hidden !important;
          box-shadow: none !important;
        }

        html:has(.change8-product-show-page) .adminjs_Layout,
        html:has(.change8-product-show-page) [data-testid="layout"],
        html:has(.change8-product-show-page) [data-css="layout"] {
          grid-template-columns: 1fr !important;
        }

        html:has(.change8-product-show-page) .adminjs_Layout > *:not([data-testid="sidebar"]),
        html:has(.change8-product-show-page) [data-testid="layout"] > *:not([data-testid="sidebar"]),
        html:has(.change8-product-show-page) [data-css="layout"] > *:not([data-testid="sidebar"]) {
          width: 100% !important;
          max-width: 100% !important;
        }

        html:has(.change8-product-show-page) [data-testid="topbar"],
        html:has(.change8-product-show-page) .adminjs_TopBar,
        html:has(.change8-product-show-page) header[data-css="topbar"],
        html:has(.change8-product-show-page) section[data-css="topbar"] {
          display: none !important;
        }

        .change8-product-show-shell {
          display: grid;
          gap: 18px;
        }

        .change8-product-show-meta-scroll {
          max-height: 320px;
          overflow-y: auto;
          padding-right: 6px;
        }

        .change8-product-show-meta-scroll::-webkit-scrollbar {
          width: 8px;
        }

        .change8-product-show-meta-scroll::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.8);
          border-radius: 999px;
        }

        .change8-product-show-meta-scroll::-webkit-scrollbar-track {
          background: rgba(241, 245, 249, 0.9);
          border-radius: 999px;
        }

        @media (max-width: 1100px) {
          .change8-product-show-layout {
            grid-template-columns: 1fr !important;
          }

          .change8-product-show-info-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }

          .change8-product-show-meta-scroll {
            max-height: none;
            overflow-y: visible;
            padding-right: 0;
          }
        }

        @media (max-width: 720px) {
          .change8-product-show-info-grid {
            grid-template-columns: 1fr !important;
          }

          .change8-product-show-page {
            padding: 16px !important;
            background: #ffffff !important;
          }
        }
      `),e.default.createElement("div",{className:"change8-product-show-shell change8-product-show-page"},e.default.createElement("div",{style:gt},e.default.createElement("a",{href:"/admin/resources/Products/actions/list",style:ft},e.default.createElement("span",{"aria-hidden":"true"},"\u2039"),"Back to Products"),e.default.createElement("div",{style:wt(O)},e.default.createElement("span",{style:St(O)}),O?"Active":"Inactive")),e.default.createElement("div",{className:"change8-product-show-layout",style:pt},e.default.createElement("section",{style:ht},e.default.createElement("div",{style:bt},Array.isArray(m.images)&&m.images.length>0?e.default.createElement("div",{style:{display:"flex",gap:12}},m.images.map((A,B)=>e.default.createElement("img",{key:A,src:A,alt:d+" "+(B+1),style:{...De,width:120,height:120,objectFit:"cover"}}))):w&&typeof w=="string"?e.default.createElement("img",{src:w,alt:d,style:De}):e.default.createElement("div",{style:yt},"No image available")),e.default.createElement("div",{style:xt},e.default.createElement("div",null,e.default.createElement("div",{style:{color:"#64748b",fontSize:"12px"}},"Product ID"),e.default.createElement("div",{style:{color:"#111827",fontWeight:700}},i||"-")),e.default.createElement("div",null,e.default.createElement("div",{style:{color:"#64748b",fontSize:"12px"}},"Price"),e.default.createElement("div",{style:{color:"#111827",fontWeight:700}},P)))),e.default.createElement("section",{style:ve},e.default.createElement("div",{style:{padding:"22px"}},e.default.createElement("h1",{style:Et},d),e.default.createElement("p",{style:vt},"Clean product detail view with quick actions and record info."),e.default.createElement("div",{className:"change8-product-show-info-grid",style:kt},e.default.createElement("div",{style:ie},e.default.createElement("div",{style:se},"Price"),e.default.createElement("div",{style:ce},P)),e.default.createElement("div",{style:ie},e.default.createElement("div",{style:se},"Stock"),e.default.createElement("div",{style:ce},$)),e.default.createElement("div",{style:ie},e.default.createElement("div",{style:se},"SKU"),e.default.createElement("div",{style:ce},f)),e.default.createElement("div",{style:ie},e.default.createElement("div",{style:se},"Sizes"),e.default.createElement("div",{style:ce},N.length))),e.default.createElement("div",{style:Ct},l!=="admin"&&e.default.createElement("button",{type:"button",style:Pt,onClick:R},"Create Order")),e.default.createElement("div",{className:"change8-product-show-meta-scroll",style:{marginTop:"22px",paddingTop:"20px",borderTop:"1px solid rgba(17, 24, 39, 0.08)",display:"grid",gap:"18px"}},e.default.createElement("div",null,e.default.createElement("h2",{style:Ue},"Description"),e.default.createElement("div",{style:Nt},C)),e.default.createElement("div",null,e.default.createElement("h2",{style:Ue},"Product Details"),e.default.createElement("div",{style:zt},e.default.createElement("div",{style:Z},e.default.createElement("span",{style:ee},"Category"),e.default.createElement("span",{style:te},c)),e.default.createElement("div",{style:Z},e.default.createElement("span",{style:ee},"Size Stock"),e.default.createElement("span",{style:te},N.length?N.map(([A,B])=>`${A}: ${B}`).join(" | "):"No size-wise stock")),e.default.createElement("div",{style:Z},e.default.createElement("span",{style:ee},"Created At"),e.default.createElement("span",{style:te},Le(m?.createdAt))),e.default.createElement("div",{style:Z},e.default.createElement("span",{style:ee},"Updated At"),e.default.createElement("span",{style:te},Le(m?.updatedAt))),e.default.createElement("div",{style:Z},e.default.createElement("span",{style:ee},"Record ID"),e.default.createElement("span",{style:te},i||"-"))))))))))},Lt={display:"grid",gap:"20px",color:"#111827",background:"#ffffff"},V={borderRadius:"18px",border:"1px solid rgba(17, 24, 39, 0.08)",background:"#ffffff",boxShadow:"0 14px 28px rgba(15, 23, 42, 0.08)",padding:"18px"},ae={margin:"0 0 14px 0",fontSize:"13px",textTransform:"uppercase",letterSpacing:"0.12em",color:"#111827",fontWeight:800},jt={display:"grid",gridTemplateColumns:"minmax(300px, 0.95fr) minmax(420px, 1.25fr)",gap:"16px"},je={display:"grid",gap:"16px"},U={fontSize:"11px",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"#475569"},T={width:"100%",minWidth:0,boxSizing:"border-box",borderRadius:"12px",border:"1px solid rgba(17, 24, 39, 0.12)",background:"#ffffff",color:"#111827",padding:"11px 13px",fontSize:"14px",fontFamily:"inherit"},L={display:"grid",gap:"8px",minWidth:0},re={display:"grid",gridTemplateColumns:"repeat(2, minmax(0, 1fr))",gap:"10px",alignItems:"start"},Tt={display:"grid",gap:"10px"},de={display:"flex",justifyContent:"space-between",gap:"10px",fontSize:"13px",paddingBottom:"8px",borderBottom:"1px solid rgba(17, 24, 39, 0.08)"},_={color:"#64748b"},me={color:"#111827",fontWeight:700,textAlign:"right"},Ft={border:"1px solid rgba(17, 24, 39, 0.12)",borderRadius:"14px",padding:"12px",display:"grid",gap:"12px",background:"#f8fafc"},Mt={display:"grid",gridTemplateColumns:"1fr auto",gap:"10px",alignItems:"center"},$t={display:"grid",gridTemplateColumns:"56px 1fr",gap:"10px",alignItems:"center"},Te={width:"56px",height:"56px",borderRadius:"10px",objectFit:"cover",background:"#e5e7eb",border:"1px solid rgba(17, 24, 39, 0.12)"},Ot={border:"1px solid rgba(99, 102, 241, 0.35)",borderRadius:"10px",padding:"9px 12px",background:"#eef2ff",color:"#3730a3",cursor:"pointer",fontWeight:700},qt={border:"1px solid #fca5a5",borderRadius:"10px",padding:"8px 10px",background:"#fee2e2",color:"#991b1b",cursor:"pointer",fontSize:"12px",fontWeight:700},Q={display:"flex",justifyContent:"space-between",padding:"7px 0",fontSize:"13px",borderBottom:"1px solid rgba(17, 24, 39, 0.08)"},Bt={...Q,fontSize:"17px",fontWeight:800,color:"#111827",borderBottom:"none",paddingTop:"12px"},_t={display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"},Fe=t=>({borderRadius:"12px",border:t?"none":"1px solid rgba(17, 24, 39, 0.12)",padding:"12px 14px",fontWeight:700,cursor:"pointer",background:t?"linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)":"#ffffff",color:t?"#fff":"#111827"}),Wt={color:"#2563eb",fontSize:"12px",textDecoration:"none"},Rt={display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"},Ht=t=>({borderRadius:"12px",border:t?"1px solid rgba(99, 102, 241, 0.9)":"1px solid rgba(17, 24, 39, 0.12)",background:t?"#eef2ff":"#ffffff",color:"#111827",padding:"10px 12px",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:"8px",fontWeight:700}),Jt={marginTop:"12px",display:"grid",gap:"8px"},we={border:"1px solid rgba(34, 197, 94, 0.42)",borderRadius:"999px",background:"#ecfdf3",color:"#166534",padding:"7px 10px",fontSize:"12px",fontWeight:700,letterSpacing:"0.03em"},Xt=`
.change8-order-grid-2 {
  display: grid !important;
  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  gap: 10px !important;
}

.change8-order-grid-2 > * {
  min-width: 0 !important;
}

.change8-order-grid-2 input,
.change8-order-grid-2 select,
.change8-order-grid-2 textarea {
  width: 100% !important;
  min-width: 0 !important;
  box-sizing: border-box !important;
}

@media (max-width: 1024px) {
  .change8-order-layout {
    grid-template-columns: 1fr !important;
  }
}

@media (max-width: 760px) {
  .change8-order-grid-2 {
    grid-template-columns: 1fr !important;
  }
}
`,Vt=[{value:"Card",label:"Card Payment",icon:"\u{1F4B3}"},{value:"Cash on Delivery",label:"Cash on Delivery",icon:"\u{1F4E6}"}],Qt=["XS","S","M","L","XL","XXL"],Gt=["PickMe Flash","Pronto","Domex","Registered Courier"],D=t=>{const a=Number(t||0);return Number.isFinite(a)?a:0},G=t=>`Rs. ${D(t).toLocaleString(void 0,{minimumFractionDigits:2,maximumFractionDigits:2})}`,Yt=t=>{if(!t)return{};let a=t;if(typeof a=="string")try{a=JSON.parse(a)}catch{return{}}if(!a||typeof a!="object"||Array.isArray(a))return{};const n={};for(const[l,p]of Object.entries(a)){const m=String(l||"").trim().toUpperCase();if(!m)continue;const b=Math.max(0,Math.trunc(Number(p||0)));n[m]=b}return n},Se=t=>{const a=Yt(t?.sizeStock);return Object.entries(a).sort(([n],[l])=>n.localeCompare(l)).map(([n,l])=>({size:n,qty:l}))},Y=t=>{const a=Se(t);return a.length>0?a:Qt.map(n=>({size:n,qty:null}))},Me=()=>({productId:"",size:"",quantity:1,unitPrice:0}),Kt=()=>{const[t,a]=o.useState([]),[n,l]=o.useState([]),[p,m]=o.useState({}),[b,k]=o.useState(null),[x,i]=o.useState(!0),[d,f]=o.useState(!1),[c,w]=o.useState({userId:"",status:"pending",paymentMethod:"Card",paymentStatus:"pending",transactionId:"",shippingName:"",shippingPhone:"",shippingAddress:"",shippingMethod:"PickMe Flash",trackingNumber:"",shippingFee:0,tax:0,discount:0}),[$,F]=o.useState([Me()]);o.useEffect(()=>{const s=document.documentElement,h=document.body,y=s.classList.contains("change8-login-page"),z=h?.classList.contains("change8-login-page"),v=s.classList.contains("change8-storefront-dashboard-page"),E=h?.classList.contains("change8-storefront-dashboard-page"),S=document.getElementById("change8-login-bg-layer"),g=S?.style.display||"",j=Array.from(new Set([s,h,document.getElementById("app"),document.querySelector('[data-testid="layout"]'),document.querySelector('[data-css="layout"]'),document.querySelector(".adminjs_Layout"),document.querySelector("main"),...Array.from(document.querySelectorAll('[data-css*="action-content"], [data-testid*="content"], .adminjs_Main, .adminjs_Main > div, .adminjs_Main > div > div, [data-css$="-content"]'))].filter(Boolean))),r=new Map(j.map(u=>[u,{background:u.style.getPropertyValue("background"),backgroundPriority:u.style.getPropertyPriority("background"),backgroundColor:u.style.getPropertyValue("background-color"),backgroundColorPriority:u.style.getPropertyPriority("background-color"),backgroundImage:u.style.getPropertyValue("background-image"),backgroundImagePriority:u.style.getPropertyPriority("background-image")}]));return s.classList.remove("change8-login-page","change8-storefront-dashboard-page"),h?.classList.remove("change8-login-page","change8-storefront-dashboard-page"),S&&(S.style.display="none"),j.forEach(u=>{u.style.setProperty("background","#ffffff","important"),u.style.setProperty("background-color","#ffffff","important"),u.style.setProperty("background-image","none","important")}),s.classList.add("change8-order-create-active"),h?.classList.add("change8-order-create-active"),()=>{s.classList.remove("change8-order-create-active"),h?.classList.remove("change8-order-create-active"),y&&s.classList.add("change8-login-page"),z&&h?.classList.add("change8-login-page"),v&&s.classList.add("change8-storefront-dashboard-page"),E&&h?.classList.add("change8-storefront-dashboard-page"),S&&(S.style.display=g),r.forEach((u,I)=>{u.background?I.style.setProperty("background",u.background,u.backgroundPriority||""):I.style.removeProperty("background"),u.backgroundColor?I.style.setProperty("background-color",u.backgroundColor,u.backgroundColorPriority||""):I.style.removeProperty("background-color"),u.backgroundImage?I.style.setProperty("background-image",u.backgroundImage,u.backgroundImagePriority||""):I.style.removeProperty("background-image")})}},[]),o.useEffect(()=>{const h=new URLSearchParams(window.location.search).get("productId")||"";(async()=>{try{const z=await fetch(`/admin/context/order-create${h?`?productId=${encodeURIComponent(h)}`:""}`,{credentials:"same-origin"}),v=z.ok?await z.json():{},E=Array.isArray(v?.users)?v.users:[],S=Array.isArray(v?.products)?v.products:[];if(a(E),l(S),m(v?.orderCountByUser||{}),k(v?.currentUser||null),v?.currentUser?.id&&w(g=>({...g,userId:g.userId||String(v.currentUser.id)})),v?.selectedProduct?.id){const g=Y(v.selectedProduct);F([{productId:String(v.selectedProduct.id),size:g[0]?.size||"",quantity:1,unitPrice:D(v.selectedProduct.price)}]);return}if(h&&S.some(g=>String(g.id)===String(h))){const g=S.find(r=>String(r.id)===String(h)),j=Y(g);F([{productId:String(h),size:j[0]?.size||"",quantity:1,unitPrice:D(g?.price)}])}}finally{i(!1)}})()},[]);const N=o.useMemo(()=>t.find(s=>String(s.id)===String(c.userId))||null,[t,c.userId]),O=o.useMemo(()=>N?Number(p[String(N.id)]||0):0,[p,N]);o.useEffect(()=>{N&&w(s=>({...s,shippingName:s.shippingName||N.name||"",shippingPhone:s.shippingPhone||N.phone||N.mobile||""}))},[N]);const P=o.useMemo(()=>{const s=$.reduce((E,S)=>E+D(S.quantity)*D(S.unitPrice),0),h=D(c.shippingFee),y=D(c.tax),z=D(c.discount),v=Math.max(s+h+y-z,0);return{subtotal:s,shippingFee:h,tax:y,discount:z,grandTotal:v}},[$,c.shippingFee,c.tax,c.discount]),C=s=>{const{name:h,value:y}=s.target;w(z=>({...z,[h]:y}))},q=(s,h,y)=>{F(z=>{const v=[...z],E={...v[s]};if(h==="productId"){E.productId=y;const S=n.find(r=>String(r.id)===String(y)),g=Y(S);E.unitPrice=D(S?.price),E.size=g[0]?.size||"";const j=g[0]?.qty===null?null:Math.max(1,Number(g[0]?.qty||0));j!==null&&(E.quantity=Math.max(1,Math.min(D(E.quantity),j)))}else if(h==="size"){E.size=y;const S=n.find(r=>String(r.id)===String(E.productId)),j=Y(S).find(r=>r.size===y);if(j&&j.qty!==null){const r=Math.max(1,Number(j.qty||0));E.quantity=Math.max(1,Math.min(D(E.quantity),r))}}else if(h==="quantity"){const S=n.find(u=>String(u.id)===String(E.productId)),j=Y(S).find(u=>u.size===E.size),r=Math.max(1,D(y));if(j&&j.qty!==null){const u=Math.max(1,Number(j.qty||0));E.quantity=Math.min(r,u)}else E.quantity=r}else h==="unitPrice"&&(E.unitPrice=Math.max(0,D(y)));return v[s]=E,v})},R=()=>{F(s=>[...s,Me()])},A=s=>{F(h=>h.length===1?h:h.filter((y,z)=>z!==s))},B=o.useMemo(()=>c.shippingAddress?.trim()?`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.shippingAddress.trim())}`:"",[c.shippingAddress]),K=async s=>{s.preventDefault();const h=$.filter(y=>y.productId&&D(y.quantity)>0);if(!c.userId){alert("Please select a customer.");return}if(h.length===0){alert("At least one product line item is required.");return}for(const y of h){const z=n.find(E=>String(E.id)===String(y.productId)),v=Se(z);if(v.length>0){if(!y.size){alert("Please select a size for all products.");return}const E=v.find(S=>S.size===String(y.size).toUpperCase());if(!E){alert(`Selected size is not available for ${z?.name||"this product"}.`);return}if(D(y.quantity)>E.qty){alert(`${z?.name||"Product"} (${E.size}) has only ${E.qty} in stock.`);return}}}f(!0);try{const y={userId:Number(c.userId),status:c.status,paymentMethod:c.paymentMethod,paymentStatus:c.paymentStatus,transactionId:c.transactionId||null,shippingName:c.shippingName||null,shippingPhone:c.shippingPhone||null,shippingMethod:c.shippingMethod,trackingNumber:c.trackingNumber||null,subtotal:P.subtotal.toFixed(2),shippingFee:P.shippingFee.toFixed(2),tax:P.tax.toFixed(2),discount:P.discount.toFixed(2),totalAmount:P.grandTotal.toFixed(2),shippingAddress:c.shippingAddress||null,lineItems:h.map(S=>({productId:Number(S.productId),size:S.size||null,quantity:Math.max(1,D(S.quantity)),unitPrice:Math.max(0,D(S.unitPrice)).toFixed(2)}))},z=new FormData;z.append("payload",JSON.stringify(y));const v=await fetch("/admin/context/order-create/submit",{method:"POST",credentials:"same-origin",body:z}),E=await v.json();if(!v.ok)throw new Error(E?.message||"Failed to create order");window.location.assign(`/admin/resources/Orders/records/${E.id}/show`)}catch(y){alert(y.message||"Failed to create order")}finally{f(!1)}};return e.default.createElement("div",{style:Lt},e.default.createElement("style",null,`
        html.change8-order-create-active,
        html.change8-order-create-active body,
        html.change8-order-create-active #app,
        html.change8-order-create-active .adminjs_Layout,
        html.change8-order-create-active [data-testid="layout"],
        html.change8-order-create-active [data-css="layout"],
        html.change8-order-create-active main,
        body.change8-order-create-active,
        body.change8-order-create-active #app,
        body.change8-order-create-active .adminjs_Layout,
        body.change8-order-create-active [data-testid="layout"],
        body.change8-order-create-active [data-css="layout"],
        body.change8-order-create-active main {
          background: #ffffff !important;
          background-color: #ffffff !important;
          background-image: none !important;
        }

        html.change8-order-create-active #app > div,
        html.change8-order-create-active #app > div > div,
        html.change8-order-create-active #app > div > div > div,
        html.change8-order-create-active .adminjs_Main,
        html.change8-order-create-active .adminjs_Main > div,
        html.change8-order-create-active .adminjs_Main > div > div,
        html.change8-order-create-active [data-css*="action-content"],
        html.change8-order-create-active [data-testid*="content"],
        html.change8-order-create-active [data-css$="-content"] {
          background: #ffffff !important;
          background-color: #ffffff !important;
          background-image: none !important;
        }

        html.change8-order-create-active [data-testid="sidebar"],
        html.change8-order-create-active .adminjs_Sidebar,
        html.change8-order-create-active section[data-css="sidebar"],
        html.change8-order-create-active aside[data-css="sidebar"],
        html.change8-order-create-active nav[data-css="sidebar"] {
          display: none !important;
          width: 0 !important;
          min-width: 0 !important;
          max-width: 0 !important;
          padding: 0 !important;
          margin: 0 !important;
          border: 0 !important;
          overflow: hidden !important;
          box-shadow: none !important;
        }

        html.change8-order-create-active [data-testid="topbar"],
        html.change8-order-create-active .adminjs_TopBar,
        html.change8-order-create-active header[data-css="topbar"],
        html.change8-order-create-active section[data-css="topbar"] {
          display: none !important;
        }

        html.change8-order-create-active [data-testid="action-header"],
        html.change8-order-create-active [data-css*="action-header"],
        html.change8-order-create-active [data-testid*="breadcrumbs"],
        html.change8-order-create-active [data-css*="breadcrumbs"],
        html.change8-order-create-active .adminjs_Breadcrumb {
          display: none !important;
        }

        html.change8-order-create-active .adminjs_Layout,
        html.change8-order-create-active [data-testid="layout"],
        html.change8-order-create-active [data-css="layout"] {
          grid-template-columns: 1fr !important;
        }

        html.change8-order-create-active .adminjs_Layout > *:not([data-testid="sidebar"]),
        html.change8-order-create-active [data-testid="layout"] > *:not([data-testid="sidebar"]),
        html.change8-order-create-active [data-css="layout"] > *:not([data-testid="sidebar"]) {
          width: 100% !important;
          max-width: 100% !important;
        }

        html.change8-order-create-active body::before,
        html.change8-order-create-active::before,
        body.change8-order-create-active::before {
          content: none !important;
          display: none !important;
          background: none !important;
          background-image: none !important;
        }

        ${Xt}
      `),e.default.createElement("form",{onSubmit:K,style:{display:"grid",gap:"16px"}},e.default.createElement("div",{className:"change8-order-layout",style:jt},e.default.createElement("div",{style:je},e.default.createElement("div",{style:V},e.default.createElement("h2",{style:ae},"Customer Details"),e.default.createElement("div",{style:L},e.default.createElement("label",{style:U},"Select Customer *"),e.default.createElement("select",{name:"userId",value:c.userId,onChange:C,style:T,required:!0,disabled:x||b?.role==="user"},e.default.createElement("option",{value:""},x?"Loading customers...":"Select a customer"),t.map(s=>e.default.createElement("option",{key:s.id,value:s.id},s.name," (#",s.id,")")))),e.default.createElement("div",{style:{height:12}}),e.default.createElement("div",{style:Tt},e.default.createElement("div",{style:de},e.default.createElement("span",{style:_},"Customer Name & ID"),e.default.createElement("span",{style:me},N?`${N.name} (#${N.id})`:"-")),e.default.createElement("div",{style:de},e.default.createElement("span",{style:_},"Email"),e.default.createElement("span",{style:me},N?.email||"-")),e.default.createElement("div",{style:de},e.default.createElement("span",{style:_},"Phone Number"),e.default.createElement("span",{style:me},N?.phone||N?.mobile||"Not available")),e.default.createElement("div",{style:de},e.default.createElement("span",{style:_},"Order History"),e.default.createElement("span",{style:me},O," previous orders")))),e.default.createElement("div",{style:V},e.default.createElement("h2",{style:ae},"Payment & Billing"),e.default.createElement("div",{style:L},e.default.createElement("label",{style:U},"Payment Options"),e.default.createElement("div",{style:Rt},Vt.map(s=>{const h=c.paymentMethod===s.value;return e.default.createElement("button",{key:s.value,type:"button",style:Ht(h),onClick:()=>w(y=>({...y,paymentMethod:s.value}))},e.default.createElement("span",null,s.icon),e.default.createElement("span",null,s.label))}))),e.default.createElement("div",{style:{height:10}}),e.default.createElement("div",{className:"change8-order-grid-2",style:re},e.default.createElement("div",{style:L},e.default.createElement("label",{style:U},"Selected Method"),e.default.createElement("input",{value:c.paymentMethod,style:T,readOnly:!0})),e.default.createElement("div",{style:L},e.default.createElement("label",{style:U},"Payment Status"),e.default.createElement("select",{name:"paymentStatus",value:c.paymentStatus,onChange:C,style:T},e.default.createElement("option",{value:"pending"},"Pending"),e.default.createElement("option",{value:"paid"},"Paid")))),e.default.createElement("div",{style:{height:10}}),e.default.createElement("div",{style:L},e.default.createElement("label",{style:U},"Transaction ID"),e.default.createElement("input",{name:"transactionId",value:c.transactionId,onChange:C,style:T,placeholder:"e.g. TXN-2026-000124"})))),e.default.createElement("div",{style:je},e.default.createElement("div",{style:V},e.default.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",gap:"8px"}},e.default.createElement("h2",{style:{...ae,marginBottom:0}},"Product Line Items (Required)"),e.default.createElement("button",{type:"button",onClick:R,style:Ot},"+ Add Item")),e.default.createElement("div",{style:{height:12}}),e.default.createElement("div",{style:{display:"grid",gap:"10px"}},$.map((s,h)=>{const y=n.find(g=>String(g.id)===String(s.productId)),z=Y(y),v=z.find(g=>g.size===s.size),E=Se(y).map(g=>`${g.size}: ${g.qty}`).join(" | "),S=D(s.quantity)*D(s.unitPrice);return e.default.createElement("div",{key:`line-item-${h}`,style:Ft},e.default.createElement("div",{style:Mt},e.default.createElement("div",{style:L},e.default.createElement("label",{style:U},"Product"),e.default.createElement("select",{value:s.productId,onChange:g=>q(h,"productId",g.target.value),style:T,required:!0},e.default.createElement("option",{value:""},"Select product"),n.map(g=>e.default.createElement("option",{key:g.id,value:g.id},g.name," (SKU: ",g.sku,")")))),e.default.createElement("button",{type:"button",style:qt,onClick:()=>A(h)},"Remove")),e.default.createElement("div",{style:$t},y?.imageUrl?e.default.createElement("img",{src:y.imageUrl,alt:y.name,style:Te}):e.default.createElement("div",{style:{...Te,display:"flex",alignItems:"center",justifyContent:"center",color:"#94a3b8",fontSize:"11px"}},"No image"),e.default.createElement("div",{style:{display:"grid",gap:"3px"}},e.default.createElement("strong",{style:{fontSize:"14px",color:"#f8fafc"}},y?.name||"Select a product"),e.default.createElement("span",{style:{fontSize:"12px",color:"#94a3b8"}},"SKU/ID:"," ",y?`${y.sku} / #${y.id}`:"-"),e.default.createElement("span",{style:{fontSize:"12px",color:"#cbd5e1"}},"Size: ",s.size||"-"," | Qty: ",s.quantity),E?e.default.createElement("span",{style:{fontSize:"11px",color:"#facc15"}},"Available: ",E):null)),e.default.createElement("div",{style:L},e.default.createElement("label",{style:U},"Size"),e.default.createElement("select",{value:s.size||"",onChange:g=>q(h,"size",g.target.value),style:T,required:!0},e.default.createElement("option",{value:""},"Select size"),z.map(g=>e.default.createElement("option",{key:g.size,value:g.size},g.qty===null?g.size:`${g.size} (${g.qty})`)))),e.default.createElement("div",{className:"change8-order-grid-2",style:re},e.default.createElement("div",{style:L},e.default.createElement("label",{style:U},"Quantity"),e.default.createElement("input",{type:"number",min:"1",max:v?.qty===null||v?.qty===void 0?void 0:Math.max(1,Number(v.qty||0)),value:s.quantity,onChange:g=>q(h,"quantity",g.target.value),style:T,required:!0})),e.default.createElement("div",{style:L},e.default.createElement("label",{style:U},"Unit Price"),e.default.createElement("input",{type:"number",min:"0",step:"0.01",value:s.unitPrice,onChange:g=>q(h,"unitPrice",g.target.value),style:T,required:!0}))),e.default.createElement("div",{style:{...Q,borderBottom:"none",paddingBottom:0}},e.default.createElement("span",{style:_},"Line Total"),e.default.createElement("strong",{style:{color:"#f8fafc"}},G(S))))}))),e.default.createElement("div",{style:V},e.default.createElement("h2",{style:ae},"Shipping & Tracking"),e.default.createElement("div",{className:"change8-order-grid-2",style:re},e.default.createElement("div",{style:L},e.default.createElement("label",{style:U},"Shipping Contact Name *"),e.default.createElement("input",{name:"shippingName",value:c.shippingName,onChange:C,style:T,placeholder:"Receiver full name",required:!0})),e.default.createElement("div",{style:L},e.default.createElement("label",{style:U},"Shipping Phone Number *"),e.default.createElement("input",{name:"shippingPhone",value:c.shippingPhone,onChange:C,style:T,placeholder:"07X XXX XXXX",required:!0}))),e.default.createElement("div",{style:{height:10}}),e.default.createElement("div",{style:L},e.default.createElement("label",{style:U},"Shipping Address *"),e.default.createElement("textarea",{name:"shippingAddress",value:c.shippingAddress,onChange:C,style:{...T,minHeight:"86px",resize:"vertical"},placeholder:"House number, street, city, postal code",required:!0}),B?e.default.createElement("a",{href:B,target:"_blank",rel:"noreferrer",style:Wt},"Open on Google Maps"):null),e.default.createElement("div",{style:{height:10}}),e.default.createElement("div",{className:"change8-order-grid-2",style:re},e.default.createElement("div",{style:L},e.default.createElement("label",{style:U},"Shipping Method"),e.default.createElement("select",{name:"shippingMethod",value:c.shippingMethod,onChange:C,style:T},Gt.map(s=>e.default.createElement("option",{key:s,value:s},s)))),e.default.createElement("div",{style:L},e.default.createElement("label",{style:U},"Tracking Number"),e.default.createElement("input",{name:"trackingNumber",value:c.trackingNumber,onChange:C,style:T,placeholder:"TRK-XXXXXX"})))),e.default.createElement("div",{style:V},e.default.createElement("h2",{style:ae},"Order Summary / Totals"),e.default.createElement("div",{className:"change8-order-grid-2",style:re},e.default.createElement("div",{style:L},e.default.createElement("label",{style:U},"Shipping Fee"),e.default.createElement("input",{type:"number",step:"0.01",min:"0",name:"shippingFee",value:c.shippingFee,onChange:C,style:T})),e.default.createElement("div",{style:L},e.default.createElement("label",{style:U},"Tax / VAT"),e.default.createElement("input",{type:"number",step:"0.01",min:"0",name:"tax",value:c.tax,onChange:C,style:T}))),e.default.createElement("div",{style:{height:10}}),e.default.createElement("div",{style:L},e.default.createElement("label",{style:U},"Discount / Coupon"),e.default.createElement("input",{type:"number",step:"0.01",min:"0",name:"discount",value:c.discount,onChange:C,style:T})),e.default.createElement("div",{style:{height:12}}),e.default.createElement("div",{style:Q},e.default.createElement("span",{style:_},"Subtotal"),e.default.createElement("strong",null,G(P.subtotal))),e.default.createElement("div",{style:Q},e.default.createElement("span",{style:_},"Shipping Fee"),e.default.createElement("strong",null,G(P.shippingFee))),e.default.createElement("div",{style:Q},e.default.createElement("span",{style:_},"Tax / VAT"),e.default.createElement("strong",null,G(P.tax))),e.default.createElement("div",{style:Q},e.default.createElement("span",{style:_},"Discount"),e.default.createElement("strong",null,"- ",G(P.discount))),e.default.createElement("div",{style:Bt},e.default.createElement("span",null,"Grand Total"),e.default.createElement("span",null,G(P.grandTotal))),e.default.createElement("div",{style:Jt},e.default.createElement("div",{style:we},"Secure Payment Protected"),e.default.createElement("div",{style:we},"Encrypted Checkout Channel"),e.default.createElement("div",{style:we},"Trusted Delivery Tracking"))))),e.default.createElement("div",{style:{...V,paddingTop:"14px"}},e.default.createElement("div",{style:_t},e.default.createElement("button",{type:"button",style:Fe(!1),onClick:()=>window.history.back(),disabled:d},"Cancel"),e.default.createElement("button",{type:"submit",style:Fe(!0),disabled:d},d?"Creating Order...":"Create Order")))))},Zt={display:"grid",gap:"16px",color:"#e2e8f0"},ue={borderRadius:"18px",border:"1px solid rgba(148, 163, 184, 0.2)",background:"linear-gradient(155deg, rgba(10, 23, 48, 0.94) 0%, rgba(8, 18, 38, 0.94) 100%)",boxShadow:"0 14px 30px rgba(2, 6, 23, 0.2)",padding:"18px"},ea={display:"flex",justifyContent:"space-between",gap:"12px",alignItems:"center"},ta={margin:0,color:"#f8fafc",fontSize:"34px",lineHeight:1.1},aa={color:"#94a3b8",fontSize:"13px",marginTop:"4px"},ra=t=>{const a=String(t||"pending").toLowerCase(),n={pending:{bg:"#fef3c7",fg:"#7c2d12"},paid:{bg:"#bbf7d0",fg:"#14532d"},processing:{bg:"#bfdbfe",fg:"#1e3a8a"},shipped:{bg:"#ddd6fe",fg:"#4c1d95"},completed:{bg:"#a7f3d0",fg:"#064e3b"},cancelled:{bg:"#fecaca",fg:"#7f1d1d"}},l=n[a]||n.pending;return{display:"inline-flex",padding:"6px 12px",borderRadius:"999px",fontSize:"11px",fontWeight:800,letterSpacing:"0.08em",textTransform:"uppercase",background:l.bg,color:l.fg}},ke={margin:"0 0 12px 0",color:"#f5df90",fontSize:"12px",fontWeight:800,letterSpacing:"0.11em",textTransform:"uppercase"},na={display:"grid",gridTemplateColumns:"minmax(300px, 1fr) minmax(320px, 1fr)",gap:"16px"},oa={display:"grid",gap:"8px"},W={display:"flex",justifyContent:"space-between",gap:"10px",borderBottom:"1px solid rgba(148, 163, 184, 0.12)",paddingBottom:"8px",fontSize:"13px"},la={display:"grid",gap:"10px"},ia={border:"1px solid rgba(148, 163, 184, 0.22)",borderRadius:"14px",padding:"10px",background:"rgba(15, 23, 42, 0.44)",display:"grid",gridTemplateColumns:"60px 1fr auto",gap:"10px",alignItems:"center"},$e={width:"60px",height:"60px",objectFit:"cover",borderRadius:"10px",border:"1px solid rgba(148, 163, 184, 0.22)",background:"#0f172a"},sa={display:"grid",gap:"8px"},ne={display:"flex",justifyContent:"space-between",fontSize:"13px",borderBottom:"1px solid rgba(148, 163, 184, 0.12)",paddingBottom:"7px"},ca={...ne,borderBottom:"none",paddingTop:"6px",fontWeight:800,fontSize:"18px",color:"#f8fafc"},pe={border:"1px dashed rgba(148, 163, 184, 0.35)",borderRadius:"12px",padding:"14px",color:"#cbd5e1"},J=t=>`Rs. ${Number(t||0).toLocaleString(void 0,{minimumFractionDigits:2,maximumFractionDigits:2})}`,Oe=t=>{if(!t)return"-";const a=new Date(t);return Number.isNaN(a.getTime())?String(t):a.toLocaleString(void 0,{dateStyle:"medium",timeStyle:"short"})},da=({record:t})=>{const[a,n]=o.useState(null),[l,p]=o.useState(!0),[m,b]=o.useState(""),k=t?.params?.id||t?.id;o.useEffect(()=>{if(!k){p(!1),b("Order id not found");return}(async()=>{try{b("");const d=await fetch(`/admin/context/orders/${encodeURIComponent(String(k))}/details`,{credentials:"same-origin"}),f=await d.json();if(!d.ok)throw new Error(f?.message||"Failed to load order details");n(f)}catch(d){b(d?.message||"Failed to load order details")}finally{p(!1)}})()},[k]);const x=o.useMemo(()=>{const i=Number(a?.subtotal||0),d=Number(a?.shippingFee||0),f=Number(a?.tax||0),c=Number(a?.discount||0),w=Number(a?.totalAmount||0);return{subtotal:i,shippingFee:d,tax:f,discount:c,totalAmount:w}},[a]);return l?e.default.createElement("div",{style:pe},"Loading order details..."):m?e.default.createElement("div",{style:pe},m):a?e.default.createElement("div",{style:Zt},e.default.createElement("style",null,"@media (max-width: 1040px) { .change8-order-show-grid { grid-template-columns: 1fr !important; } }"),e.default.createElement("div",{style:ue},e.default.createElement("div",{style:ea},e.default.createElement("div",null,e.default.createElement("h1",{style:ta},"Order #",a.id),e.default.createElement("div",{style:aa},"Created ",Oe(a.createdAt)," | Updated"," ",Oe(a.updatedAt))),e.default.createElement("span",{style:ra(a.status)},a.status||"pending"))),e.default.createElement("div",{className:"change8-order-show-grid",style:na},e.default.createElement("div",{style:ue},e.default.createElement("h2",{style:ke},"Customer & Shipping"),e.default.createElement("div",{style:oa},e.default.createElement("div",{style:W},e.default.createElement("span",{style:{color:"#94a3b8"}},"Customer"),e.default.createElement("strong",null,a?.user?.name||"-")),e.default.createElement("div",{style:W},e.default.createElement("span",{style:{color:"#94a3b8"}},"Shipping Contact"),e.default.createElement("strong",null,a?.shippingName||"-")),e.default.createElement("div",{style:W},e.default.createElement("span",{style:{color:"#94a3b8"}},"Shipping Phone"),e.default.createElement("strong",null,a?.shippingPhone||"-")),e.default.createElement("div",{style:W},e.default.createElement("span",{style:{color:"#94a3b8"}},"Email"),e.default.createElement("strong",null,a?.user?.email||"-")),e.default.createElement("div",{style:W},e.default.createElement("span",{style:{color:"#94a3b8"}},"Payment Method"),e.default.createElement("strong",null,a?.paymentMethod||"-")),e.default.createElement("div",{style:W},e.default.createElement("span",{style:{color:"#94a3b8"}},"Payment Status"),e.default.createElement("strong",null,a?.paymentStatus||"-")),e.default.createElement("div",{style:W},e.default.createElement("span",{style:{color:"#94a3b8"}},"Transaction ID"),e.default.createElement("strong",null,a?.transactionId||"-")),e.default.createElement("div",{style:W},e.default.createElement("span",{style:{color:"#94a3b8"}},"Shipping Method"),e.default.createElement("strong",null,a?.shippingMethod||"-")),e.default.createElement("div",{style:W},e.default.createElement("span",{style:{color:"#94a3b8"}},"Tracking Number"),e.default.createElement("strong",null,a?.trackingNumber||"-")),e.default.createElement("div",{style:{fontSize:"13px",color:"#cbd5e1",lineHeight:1.6}},e.default.createElement("div",{style:{color:"#94a3b8",marginBottom:"4px"}},"Shipping Address"),e.default.createElement("div",{style:{whiteSpace:"pre-wrap"}},a?.shippingAddress||"-")))),e.default.createElement("div",{style:ue},e.default.createElement("h2",{style:ke},"Order Summary / Totals"),e.default.createElement("div",{style:sa},e.default.createElement("div",{style:ne},e.default.createElement("span",{style:{color:"#94a3b8"}},"Subtotal"),e.default.createElement("strong",null,J(x.subtotal))),e.default.createElement("div",{style:ne},e.default.createElement("span",{style:{color:"#94a3b8"}},"Shipping Fee"),e.default.createElement("strong",null,J(x.shippingFee))),e.default.createElement("div",{style:ne},e.default.createElement("span",{style:{color:"#94a3b8"}},"Tax / VAT"),e.default.createElement("strong",null,J(x.tax))),e.default.createElement("div",{style:ne},e.default.createElement("span",{style:{color:"#94a3b8"}},"Discount"),e.default.createElement("strong",null,"- ",J(x.discount))),e.default.createElement("div",{style:ca},e.default.createElement("span",null,"Grand Total"),e.default.createElement("span",null,J(x.totalAmount)))))),e.default.createElement("div",{style:ue},e.default.createElement("h2",{style:ke},"Product Line Items"),e.default.createElement("div",{style:la},(a?.items||[]).length===0?e.default.createElement("div",{style:pe},"No line items in this order."):(a.items||[]).map(i=>e.default.createElement("div",{key:i.id,style:ia},i?.product?.imageUrl?e.default.createElement("img",{src:i.product.imageUrl,alt:i?.product?.name||"Product",style:$e}):e.default.createElement("div",{style:{...$e,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px",color:"#94a3b8"}},"No image"),e.default.createElement("div",{style:{display:"grid",gap:"4px"}},e.default.createElement("strong",{style:{color:"#f8fafc",fontSize:"14px"}},i?.product?.name||"Unnamed product"),e.default.createElement("span",{style:{color:"#94a3b8",fontSize:"12px"}},"SKU: ",i?.product?.sku||"-"," | Product ID: #",i?.productId),e.default.createElement("span",{style:{color:"#cbd5e1",fontSize:"12px"}},"Size: ",i?.size||"-"," | Qty: ",i.quantity," x"," ",J(i.unitPrice))),e.default.createElement("strong",{style:{color:"#f8fafc",fontSize:"15px"}},J(i.totalPrice))))))):e.default.createElement("div",{style:pe},"Order details not available.")},ma={display:"grid",gap:"16px",color:"#e2e8f0"},oe={borderRadius:"18px",border:"1px solid rgba(148, 163, 184, 0.2)",background:"linear-gradient(155deg, rgba(10, 23, 48, 0.94) 0%, rgba(8, 18, 38, 0.94) 100%)",boxShadow:"0 14px 30px rgba(2, 6, 23, 0.2)",padding:"18px"},ua={display:"flex",justifyContent:"space-between",gap:"12px",alignItems:"center"},pa={margin:0,fontSize:"34px",lineHeight:1.1,color:"#f8fafc"},ga={margin:"6px 0 0 0",color:"#94a3b8",fontSize:"13px"},fa={display:"inline-flex",alignItems:"center",width:"fit-content",padding:"6px 12px",borderRadius:"999px",fontSize:"11px",fontWeight:800,letterSpacing:"0.08em",textTransform:"uppercase",color:"#14532d",background:"#bbf7d0"},ha={display:"grid",gridTemplateColumns:"minmax(300px, 0.95fr) minmax(320px, 1.05fr)",gap:"16px"},ge={margin:"0 0 12px 0",color:"#f5df90",fontSize:"12px",fontWeight:800,letterSpacing:"0.11em",textTransform:"uppercase"},Ne={display:"grid",gap:"8px"},M={display:"flex",justifyContent:"space-between",gap:"10px",borderBottom:"1px solid rgba(148, 163, 184, 0.12)",paddingBottom:"8px",fontSize:"13px"},qe={width:"100%",height:"280px",objectFit:"cover",borderRadius:"14px",background:"#0f172a",border:"1px solid rgba(148, 163, 184, 0.22)"},ba={display:"grid",gridTemplateColumns:"84px 1fr auto",gap:"12px",alignItems:"center",padding:"12px",borderRadius:"14px",border:"1px solid rgba(148, 163, 184, 0.2)",background:"rgba(15, 23, 42, 0.44)"},ya={width:"84px",height:"84px",borderRadius:"12px",background:"#0f172a",border:"1px solid rgba(148, 163, 184, 0.22)",display:"flex",alignItems:"center",justifyContent:"center",color:"#94a3b8",fontSize:"11px"},ze={border:"1px dashed rgba(148, 163, 184, 0.35)",borderRadius:"12px",padding:"14px",color:"#cbd5e1"},fe=t=>`Rs. ${Number(t||0).toLocaleString(void 0,{minimumFractionDigits:2,maximumFractionDigits:2})}`,xa=t=>{if(!t)return"-";const a=new Date(t);return Number.isNaN(a.getTime())?String(t):a.toLocaleString(void 0,{dateStyle:"medium",timeStyle:"short"})},Ea=({record:t})=>{const[a,n]=o.useState(null),[l,p]=o.useState(!0),[m,b]=o.useState(""),k=t?.params?.id||t?.id;o.useEffect(()=>{if(!k){p(!1),b("Order item id not found");return}(async()=>{try{b("");const w=await fetch(`/admin/context/order-items/${encodeURIComponent(String(k))}/details`,{credentials:"same-origin"}),$=await w.json();if(!w.ok)throw new Error($?.message||"Failed to load order item details");n($)}catch(w){b(w?.message||"Failed to load order item details")}finally{p(!1)}})()},[k]);const x=o.useMemo(()=>Number(a?.totalPrice||0),[a]);if(l)return e.default.createElement("div",{style:ze},"Loading order item details...");if(m)return e.default.createElement("div",{style:ze},m);if(!a)return e.default.createElement("div",{style:ze},"Order item details not available.");const i=a?.product||{},d=a?.order||{},f=d?.user||{};return e.default.createElement("div",{style:ma},e.default.createElement("style",null,"@media (max-width: 1040px) { .change8-order-item-grid { grid-template-columns: 1fr !important; } }"),e.default.createElement("div",{style:oe},e.default.createElement("div",{style:ua},e.default.createElement("div",null,e.default.createElement("h1",{style:pa},i?.name||"Order Item"),e.default.createElement("p",{style:ga},"Order #",d?.id||"-"," \u2022 Item #",a?.id||"-")),e.default.createElement("span",{style:fa},"Active Item"))),e.default.createElement("div",{className:"change8-order-item-grid",style:ha},e.default.createElement("div",{style:oe},i?.imageUrl?e.default.createElement("img",{src:i.imageUrl,alt:i?.name||"Product",style:qe}):e.default.createElement("div",{style:{...qe,display:"flex",alignItems:"center",justifyContent:"center",color:"#94a3b8"}},"No image available"),e.default.createElement("div",{style:{height:14}}),e.default.createElement("h2",{style:ge},"Product Snapshot"),e.default.createElement("div",{style:Ne},e.default.createElement("div",{style:M},e.default.createElement("span",{style:{color:"#94a3b8"}},"Product Name"),e.default.createElement("strong",null,i?.name||"-")),e.default.createElement("div",{style:M},e.default.createElement("span",{style:{color:"#94a3b8"}},"SKU"),e.default.createElement("strong",null,i?.sku||"-")),e.default.createElement("div",{style:M},e.default.createElement("span",{style:{color:"#94a3b8"}},"Product ID"),e.default.createElement("strong",null,"#",i?.id||"-")),e.default.createElement("div",{style:M},e.default.createElement("span",{style:{color:"#94a3b8"}},"Current Stock"),e.default.createElement("strong",null,i?.stock??"-")))),e.default.createElement("div",{style:oe},e.default.createElement("h2",{style:ge},"Order & Customer"),e.default.createElement("div",{style:Ne},e.default.createElement("div",{style:M},e.default.createElement("span",{style:{color:"#94a3b8"}},"Customer"),e.default.createElement("strong",null,f?.name||"-")),e.default.createElement("div",{style:M},e.default.createElement("span",{style:{color:"#94a3b8"}},"Email"),e.default.createElement("strong",null,f?.email||"-")),e.default.createElement("div",{style:M},e.default.createElement("span",{style:{color:"#94a3b8"}},"Order ID"),e.default.createElement("strong",null,"#",d?.id||"-")),e.default.createElement("div",{style:M},e.default.createElement("span",{style:{color:"#94a3b8"}},"Order Status"),e.default.createElement("strong",null,d?.status||"-")),e.default.createElement("div",{style:M},e.default.createElement("span",{style:{color:"#94a3b8"}},"Payment Method"),e.default.createElement("strong",null,d?.paymentMethod||"-")),e.default.createElement("div",{style:M},e.default.createElement("span",{style:{color:"#94a3b8"}},"Shipping Method"),e.default.createElement("strong",null,d?.shippingMethod||"-")),e.default.createElement("div",{style:M},e.default.createElement("span",{style:{color:"#94a3b8"}},"Tracking Number"),e.default.createElement("strong",null,d?.trackingNumber||"-")),e.default.createElement("div",{style:M},e.default.createElement("span",{style:{color:"#94a3b8"}},"Created At"),e.default.createElement("strong",null,xa(a.createdAt)))))),e.default.createElement("div",{style:oe},e.default.createElement("h2",{style:ge},"Pricing Details"),e.default.createElement("div",{style:Ne},e.default.createElement("div",{style:M},e.default.createElement("span",{style:{color:"#94a3b8"}},"Quantity"),e.default.createElement("strong",null,a.quantity)),e.default.createElement("div",{style:M},e.default.createElement("span",{style:{color:"#94a3b8"}},"Unit Price"),e.default.createElement("strong",null,fe(a.unitPrice))),e.default.createElement("div",{style:M},e.default.createElement("span",{style:{color:"#94a3b8"}},"Line Total"),e.default.createElement("strong",null,fe(x))))),e.default.createElement("div",{style:oe},e.default.createElement("h2",{style:ge},"Quick Summary"),e.default.createElement("div",{style:ba},i?.imageUrl?e.default.createElement("img",{src:i.imageUrl,alt:i?.name||"Product",style:{width:"84px",height:"84px",objectFit:"cover",borderRadius:"12px"}}):e.default.createElement("div",{style:ya},"No image"),e.default.createElement("div",{style:{display:"grid",gap:"4px"}},e.default.createElement("strong",{style:{color:"#f8fafc",fontSize:"16px"}},i?.name||"Unnamed product"),e.default.createElement("span",{style:{color:"#94a3b8",fontSize:"12px"}},"SKU: ",i?.sku||"-"),e.default.createElement("span",{style:{color:"#cbd5e1",fontSize:"12px"}},"Qty ",a.quantity," x ",fe(a.unitPrice))),e.default.createElement("strong",{style:{color:"#f8fafc",fontSize:"16px"}},fe(x)))))},Be={display:"flex",alignItems:"center",gap:"12px",minHeight:"56px"},va={width:"64px",height:"42px",objectFit:"cover",borderRadius:"10px",border:"1px solid rgba(148, 163, 184, 0.35)",background:"#f8fafc",flexShrink:0},_e={width:"64px",height:"42px",borderRadius:"10px",border:"1px dashed rgba(148, 163, 184, 0.6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px",color:"#64748b",background:"#f8fafc",flexShrink:0},We={display:"flex",flexDirection:"column",gap:"2px"},wa=(t,a=320,n="auto")=>{const l=String(t||"").trim();return l?!l.includes("res.cloudinary.com")||!l.includes("/upload/")?l:l.replace("/upload/",`/upload/f_auto,q_${n},w_${a},c_limit,dpr_auto/`):""},Sa=t=>{const a=t?.record?.params?.[t?.property?.path],n=wa(a),[l,p]=o.useState(!1);return o.useEffect(()=>{p(!1)},[a]),a?l?e.default.createElement("div",{style:Be},e.default.createElement("div",{style:_e},"Invalid"),e.default.createElement("div",{style:We},e.default.createElement("span",{style:{fontWeight:600,color:"#0f172a"}},"Image URL"),e.default.createElement("a",{href:a,target:"_blank",rel:"noreferrer",style:{color:"#2563eb",textDecoration:"none",fontSize:"12px"}},"Open link"))):e.default.createElement("div",{style:Be},e.default.createElement("img",{src:n||a,alt:"Product",style:va,loading:"lazy",decoding:"async",onError:()=>p(!0)}),e.default.createElement("div",{style:We},e.default.createElement("span",{style:{fontWeight:600,color:"#0f172a"}},"Preview"),e.default.createElement("a",{href:a,target:"_blank",rel:"noreferrer",style:{color:"#2563eb",textDecoration:"none",fontSize:"12px"}},"Open image"))):e.default.createElement("div",{style:_e},"No image")},ka={display:"flex",flexDirection:"column",gap:"10px"},Na={width:"140px",height:"96px",objectFit:"cover",borderRadius:"12px",border:"1px solid rgba(148, 163, 184, 0.35)",background:"#f8fafc"},Re={fontSize:"12px",color:"#64748b"},za=t=>{const{onChange:a,record:n}=t,l=n?.params?.imageUrl||"",p=n?.params?.imagePublicId||"",[m,b]=o.useState(l),[k,x]=o.useState(p),[i,d]=o.useState(!1),[f,c]=o.useState("");o.useEffect(()=>{b(l),x(p)},[l,p]);const w=async F=>{const N=F.target.files?.[0];if(N){d(!0),c("");try{const O=new FormData;O.append("image",N);const P=await fetch("/api/uploads/image",{method:"POST",body:O}),C=await P.json();if(!P.ok)throw new Error(C.message||"Image upload failed");const q=C.url||"",R=C.publicId||"";b(q),x(R),a?.("imageUrl",q),a?.("imagePublicId",R)}catch(O){c(O.message)}finally{d(!1),F.target.value=""}}},$=()=>{b(""),x(""),a?.("imageUrl",""),a?.("imagePublicId","")};return e.default.createElement("div",{style:ka},e.default.createElement("input",{type:"file",accept:"image/*",onChange:w}),e.default.createElement("div",{style:Re},i?"Uploading to Cloudinary...":"Choose an image file to upload"),m?e.default.createElement(e.default.Fragment,null,e.default.createElement("img",{src:m,alt:"Product preview",style:Na}),e.default.createElement("button",{type:"button",onClick:$,style:{width:"fit-content",padding:"6px 10px",borderRadius:"8px",border:"1px solid #ef4444",color:"#ef4444",background:"#fff",cursor:"pointer"}},"Remove image")):null,f?e.default.createElement("div",{style:{...Re,color:"#dc2626"}},f):null,e.default.createElement("input",{type:"hidden",name:"imageUrl",value:m,readOnly:!0}),e.default.createElement("input",{type:"hidden",name:"imagePublicId",value:k,readOnly:!0}))},Ca={display:"grid",gap:"10px"},Pa={display:"grid",gridTemplateColumns:"1fr 140px auto",gap:"8px",alignItems:"center"},He={border:"1px solid rgba(148, 163, 184, 0.45)",borderRadius:"10px",padding:"8px 10px",fontSize:"13px",background:"#fff"},Ia={fontSize:"12px",color:"#64748b"},Aa={width:"fit-content",padding:"7px 12px",borderRadius:"9px",border:"1px solid #6366f1",color:"#3730a3",background:"#eef2ff",cursor:"pointer",fontWeight:700},Da={padding:"7px 9px",borderRadius:"9px",border:"1px solid #fca5a5",color:"#991b1b",background:"#fee2e2",cursor:"pointer",fontWeight:700},Ua=t=>{if(!t)return[];let a=t;if(typeof a=="string")try{a=JSON.parse(a)}catch{return[]}return!a||typeof a!="object"||Array.isArray(a)?[]:Object.entries(a).map(([n,l])=>({size:String(n||"").trim().toUpperCase(),stock:String(Number(l||0))}))},La=t=>{const{record:a,onChange:n}=t,l=o.useMemo(()=>Ua(a?.params?.sizeStock),[a?.params?.sizeStock]),[p,m]=o.useState(l.length?l:[{size:"",stock:""}]);o.useEffect(()=>{m(l.length?l:[{size:"",stock:""}])},[l]),o.useEffect(()=>{const i={};p.forEach(f=>{const c=String(f.size||"").trim().toUpperCase();if(!c)return;const w=Math.max(0,Math.trunc(Number(f.stock||0)));i[c]=w});const d=Object.values(i).reduce((f,c)=>f+Number(c||0),0);n?.("sizeStockText",JSON.stringify(i)),n?.("stock",d)},[p,n]);const b=(i,d,f)=>{m(c=>{const w=[...c];return w[i]={...w[i],[d]:f},w})},k=()=>{m(i=>[...i,{size:"",stock:""}])},x=i=>{m(d=>d.length<=1?[{size:"",stock:""}]:d.filter((f,c)=>c!==i))};return e.default.createElement("div",{style:Ca},e.default.createElement("div",{style:Ia},"Add product sizes and stock per size. Total stock is auto-calculated."),p.map((i,d)=>e.default.createElement("div",{key:`${d}-${i.size}`,style:Pa},e.default.createElement("input",{type:"text",placeholder:"Size (e.g. S, M, L, XL)",value:i.size,onChange:f=>b(d,"size",f.target.value),style:He}),e.default.createElement("input",{type:"number",min:"0",step:"1",placeholder:"Stock",value:i.stock,onChange:f=>b(d,"stock",f.target.value),style:He}),e.default.createElement("button",{type:"button",onClick:()=>x(d),style:Da,"aria-label":"Remove size"},"Remove"))),e.default.createElement("button",{type:"button",onClick:k,style:Aa},"+ Add Size"),e.default.createElement("input",{type:"hidden",name:"sizeStock",value:JSON.stringify(p.reduce((i,d)=>{const f=String(d.size||"").trim().toUpperCase();return f&&(i[f]=Math.max(0,Math.trunc(Number(d.stock||0)))),i},{})),readOnly:!0}))},ja=t=>{const{record:a,resource:n}=t,[l,p]=o.useState(null);if(o.useEffect(()=>{a&&a.params&&p(a.params)},[a]),!l)return e.default.createElement("div",{className:"category-show-loading"},"Loading...");const m=b=>{if(!b)return"\u2014";try{return new Date(b).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"})}catch{return"\u2014"}};return e.default.createElement("div",{className:"category-show-container"},e.default.createElement("style",null,`
        .category-show-container {
          --bg-1: var(--change8-bg-1, #050914);
          --gold: var(--change8-gold, #e2bf66);
          --text-main: var(--change8-text-main, #f8fafc);
          --text-muted: var(--change8-text-muted, #9aa8c1);
          --line: var(--change8-line, rgba(226, 191, 102, 0.22));
          --card-bg: var(--change8-card-bg, linear-gradient(160deg, rgba(21, 34, 66, 0.96) 0%, rgba(10, 18, 36, 0.96) 100%));
          --shadow: var(--change8-shadow, 0 8px 26px rgba(0, 0, 0, 0.3));

          padding: 32px;
          color: var(--text-main);
          font-family: "Poppins", "Segoe UI", sans-serif;
          background: linear-gradient(120deg, var(--bg-1) 0%, rgba(11, 26, 56, 0.8) 50%, var(--bg-1) 100%);
          min-height: 100vh;
        }

        html[data-admin-theme='light'] .category-show-container {
          --change8-bg-1: #f0f6ff;
          --change8-gold: #c08b0f;
          --change8-text-main: #0f172a;
          --change8-text-muted: #475569;
          --change8-line: rgba(15, 23, 42, 0.08);
          --change8-card-bg: #ffffff;
          --change8-shadow: 0 4px 20px rgba(15, 23, 42, 0.06);
        }

        .category-show-inner {
          max-width: 900px;
          margin: 0 auto;
        }

        .category-show-header {
          margin-bottom: 32px;
        }

        .category-show-kicker {
          font-size: 11px;
          font-weight: 700;
          color: var(--gold);
          text-transform: uppercase;
          letter-spacing: 0.36em;
          margin-bottom: 12px;
        }

        .category-show-title {
          font-size: clamp(32px, 5vw, 48px);
          font-weight: 700;
          line-height: 1.1;
          margin: 0 0 8px;
        }

        .category-show-status {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 12px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }

        .category-show-status.active {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.4);
        }

        .category-show-status.inactive {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.4);
        }

        .category-show-card {
          border: 1px solid var(--line);
          border-radius: 24px;
          padding: 32px;
          background: var(--card-bg);
          box-shadow: var(--shadow);
          backdrop-filter: blur(4px);
          margin-bottom: 24px;
          animation: fade-up 560ms ease;
        }

        .category-show-section-title {
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: var(--gold);
          margin-bottom: 20px;
          margin-top: 0;
        }

        .category-show-section {
          margin-bottom: 28px;
        }

        .category-show-section:last-child {
          margin-bottom: 0;
        }

        .category-show-field {
          margin-bottom: 20px;
        }

        .category-show-field:last-child {
          margin-bottom: 0;
        }

        .category-show-label {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: var(--text-muted);
          margin-bottom: 8px;
          display: block;
        }

        .category-show-value {
          font-size: 16px;
          color: var(--text-main);
          line-height: 1.6;
          word-break: break-word;
        }

        .category-show-value.gold {
          color: var(--gold);
          font-weight: 600;
        }

        .category-show-description {
          background: rgba(0, 0, 0, 0.2);
          border-left: 3px solid var(--gold);
          padding: 16px 20px;
          border-radius: 8px;
          line-height: 1.7;
          font-size: 15px;
        }

        html[data-admin-theme='light'] .category-show-description {
          background: rgba(15, 23, 42, 0.05);
        }

        .category-show-details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
          margin-top: 16px;
        }

        .category-show-detail-item {
          padding: 16px;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 12px;
          border: 1px solid var(--line);
        }

        html[data-admin-theme='light'] .category-show-detail-item {
          background: rgba(15, 23, 42, 0.03);
        }

        .category-show-divider {
          height: 1px;
          background: linear-gradient(90deg, rgba(226, 191, 102, 0), rgba(226, 191, 102, 0.28), rgba(226, 191, 102, 0));
          margin: 24px 0;
        }

        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 720px) {
          .category-show-container {
            padding: 20px 16px;
          }

          .category-show-card {
            padding: 24px 20px;
          }

          .category-show-details-grid {
            grid-template-columns: 1fr;
          }
        }
      `),e.default.createElement("div",{className:"category-show-inner"},e.default.createElement("div",{className:"category-show-header"},e.default.createElement("div",{className:"category-show-kicker"},"Category Overview"),e.default.createElement("h1",{className:"category-show-title"},l.name||"\u2014"),e.default.createElement("div",{className:`category-show-status ${l.isActive?"active":"inactive"}`},e.default.createElement("span",null,"\u25CF"),l.isActive?"Active":"Inactive")),e.default.createElement("div",{className:"category-show-card"},e.default.createElement("div",{className:"category-show-section"},e.default.createElement("h3",{className:"category-show-section-title"},"Description"),l.description?e.default.createElement("div",{className:"category-show-description"},l.description):e.default.createElement("div",{className:"category-show-value",style:{color:"var(--text-muted)"}},"No description provided")),e.default.createElement("div",{className:"category-show-divider"}),e.default.createElement("div",{className:"category-show-section"},e.default.createElement("h3",{className:"category-show-section-title"},"Details"),e.default.createElement("div",{className:"category-show-details-grid"},e.default.createElement("div",{className:"category-show-detail-item"},e.default.createElement("label",{className:"category-show-label"},"Category ID"),e.default.createElement("div",{className:"category-show-value gold",style:{fontFamily:"monospace",fontSize:"14px"}},l.id||"\u2014")),e.default.createElement("div",{className:"category-show-detail-item"},e.default.createElement("label",{className:"category-show-label"},"Slug"),e.default.createElement("div",{className:"category-show-value"},l.slug||"\u2014")))),e.default.createElement("div",{className:"category-show-divider"}),e.default.createElement("div",{className:"category-show-section"},e.default.createElement("h3",{className:"category-show-section-title"},"Timeline"),e.default.createElement("div",{className:"category-show-details-grid"},e.default.createElement("div",{className:"category-show-detail-item"},e.default.createElement("label",{className:"category-show-label"},"Created"),e.default.createElement("div",{className:"category-show-value"},m(l.createdAt))),e.default.createElement("div",{className:"category-show-detail-item"},e.default.createElement("label",{className:"category-show-label"},"Last Updated"),e.default.createElement("div",{className:"category-show-value"},m(l.updatedAt))))))))},Ta=()=>e.default.createElement("div",{className:"change8-about-shell"},e.default.createElement("div",{className:"change8-about-top-strip"},"FREE SHIPPING now available in Sri Lanka"),e.default.createElement("div",{className:"change8-about-shell-inner"},e.default.createElement("div",{className:"change8-about-back-wrap"},e.default.createElement(H.Link,{className:"change8-about-back-btn",to:"/admin","aria-label":"Back to user dashboard"},"<- Back to User Dashboard")),e.default.createElement("section",{className:"change8-about-section"},e.default.createElement("div",{className:"change8-about-row"},e.default.createElement("div",null,e.default.createElement("h1",{className:"change8-about-title"},"About Us"),e.default.createElement("h2",{className:"change8-about-sub"},"Who We Are"),e.default.createElement("p",{className:"change8-about-text"},"styleFlow is a fashion-driven destination for curated modern style. We combine thoughtful product choices with a reliable platform, helping customers discover quality outfits and helping teams manage products and orders with confidence."),e.default.createElement("p",{className:"change8-about-text"},"Our focus is simple: quality, speed, and an easy experience from browsing to checkout.")),e.default.createElement("div",{className:"change8-about-img-card"},e.default.createElement("img",{src:"/public/img5.png",alt:"Fashion collection"}))),e.default.createElement("div",{className:"change8-about-row"},e.default.createElement("div",{className:"change8-about-img-card"},e.default.createElement("img",{src:"/public/img4.png",alt:"Mission and platform"})),e.default.createElement("div",null,e.default.createElement("h2",{className:"change8-about-sub"},"Our Mission"),e.default.createElement("h1",{className:"change8-about-title"},"Streamlined management for modern fashion retail"),e.default.createElement("p",{className:"change8-about-text"},"Our mission is to build a fast, dependable eCommerce workflow that supports growing fashion teams. The platform is designed with AdminJS, Node.js, Express, Sequelize, and PostgreSQL to manage products, inventory, and orders in one place.")))),e.default.createElement("section",{className:"change8-about-section change8-about-values"},e.default.createElement("h2",null,"Our Values"),e.default.createElement("div",{className:"change8-about-value-grid"},e.default.createElement("article",{className:"change8-about-value"},e.default.createElement("div",{className:"change8-about-icon quality"},"\u{1F3AF}"),e.default.createElement("h3",null,"Quality & Style"),e.default.createElement("p",null,"Every product and workflow decision is optimized for clarity, consistency, and real-world performance.")),e.default.createElement("article",{className:"change8-about-value"},e.default.createElement("div",{className:"change8-about-icon innovation"},"\u{1F4A1}"),e.default.createElement("h3",null,"Innovation"),e.default.createElement("p",null,"We use practical technology and thoughtful UI patterns to make operations smoother every day.")),e.default.createElement("article",{className:"change8-about-value"},e.default.createElement("div",{className:"change8-about-icon seamless"},"\u{1F33F}"),e.default.createElement("h3",null,"Seamless Experience"),e.default.createElement("p",null,"We reduce friction from browsing to fulfillment so customers and teams can move faster.")))),e.default.createElement("section",{className:"change8-about-section change8-about-team"},e.default.createElement("h2",null,"Our Team"),e.default.createElement("div",{className:"change8-about-team-grid"},e.default.createElement("article",{className:"change8-about-member"},e.default.createElement("img",{src:"/public/img6.png",alt:"Team member one"}),e.default.createElement("div",{className:"meta"},e.default.createElement("h3",null,"Alex Perera"),e.default.createElement("p",null,"Operations Lead"))),e.default.createElement("article",{className:"change8-about-member"},e.default.createElement("img",{src:"/public/img8.png",alt:"Team member two"}),e.default.createElement("div",{className:"meta"},e.default.createElement("h3",null,"Nimal Silva"),e.default.createElement("p",null,"Product Manager"))),e.default.createElement("article",{className:"change8-about-member"},e.default.createElement("img",{src:"/public/img7.png",alt:"Team member three"}),e.default.createElement("div",{className:"meta"},e.default.createElement("h3",null,"Savindi Jayasuriya"),e.default.createElement("p",null,"Creative Director"))))))),Fa=()=>{const[t,a]=o.useState({fullName:"",email:"",subject:"",message:""}),[n,l]=o.useState(!1),[p,m]=o.useState(null),b=x=>{const{name:i,value:d}=x.target;a(f=>({...f,[i]:d}))},k=async x=>{x.preventDefault(),l(!0),m(null);try{await new Promise(i=>setTimeout(i,1e3)),m({type:"success",message:"Thank you! Your message has been sent successfully."}),a({fullName:"",email:"",subject:"",message:""})}catch{m({type:"error",message:"Failed to send message. Please try again."})}finally{l(!1)}};return e.default.createElement("div",{style:Ce.shell},e.default.createElement("style",null,`
        .contact-section {
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.08);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 16px 32px rgba(15, 23, 42, 0.06);
          margin-bottom: 24px;
        }

        .contact-header {
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
          padding: 40px 28px;
          text-align: left;
          border-bottom: 1px solid rgba(15, 23, 42, 0.08);
        }

        .contact-header h1 {
          margin: 0;
          font-size: clamp(32px, 3.6vw, 52px);
          line-height: 0.98;
          letter-spacing: -0.04em;
        }

        .contact-header p {
          margin: 8px 0 0;
          color: #475569;
          font-size: 18px;
          line-height: 1.6;
        }

        .contact-hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          align-items: stretch;
          min-height: 300px;
        }

        .contact-info {
          padding: 40px 28px;
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 28px;
        }

        .contact-item {
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }

        .contact-icon {
          width: 48px;
          height: 48px;
          border-radius: 999px;
          background: #dbeafe;
          display: grid;
          place-items: center;
          font-size: 24px;
          flex-shrink: 0;
          color: #0369a1;
        }

        .contact-item-content h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 700;
          color: #111827;
        }

        .contact-item-content p {
          margin: 4px 0 0;
          font-size: 14px;
          color: #475569;
          line-height: 1.6;
        }

        .contact-links {
          display: flex;
          gap: 10px;
          margin-top: 6px;
        }

        .contact-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 999px;
          background: #dbeafe;
          text-decoration: none;
          color: #0369a1;
          font-size: 16px;
          font-weight: 700;
        }

        .contact-map {
          background: #e0e7ff;
          display: grid;
          place-items: center;
          font-size: 14px;
          color: #64748b;
          min-height: 300px;
        }

        .contact-form-section {
          padding: 40px 28px;
        }

        .contact-form-header {
          margin-bottom: 28px;
        }

        .contact-form-header h2 {
          margin: 0;
          font-size: 32px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .contact-form-header p {
          margin: 10px 0 0;
          color: #475569;
          font-size: 16px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #111827;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid rgba(15, 23, 42, 0.12);
          border-radius: 8px;
          font-family: inherit;
          font-size: 14px;
          color: #111827;
          background: #f8fafc;
          transition: all 0.2s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          background: #ffffff;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .form-group textarea {
          resize: vertical;
          min-height: 140px;
        }

        .form-submit {
          margin-top: 24px;
          padding: 14px 24px;
          background: #1e3a8a;
          color: #ffffff;
          border: 0;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          width: 100%;
        }

        .form-submit:hover:not(:disabled) {
          background: #1e40af;
          box-shadow: 0 8px 16px rgba(30, 58, 138, 0.3);
        }

        .form-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .form-status {
          margin-top: 16px;
          padding: 12px 14px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          text-align: center;
        }

        .form-status.success {
          background: #dcfce7;
          color: #166534;
        }

        .form-status.error {
          background: #fee2e2;
          color: #991b1b;
        }

        .contact-footer {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 20px;
          padding: 40px 28px;
          background: #f8fafc;
          border-top: 1px solid rgba(15, 23, 42, 0.08);
        }

        .footer-column h4 {
          margin: 0;
          font-size: 14px;
          font-weight: 700;
          color: #111827;
          text-transform: uppercase;
        }

        .footer-column p {
          margin: 8px 0 0;
          font-size: 13px;
          color: #475569;
          line-height: 1.6;
        }

        .footer-column a {
          display: inline-block;
          margin-top: 6px;
          color: #475569;
          text-decoration: none;
          font-size: 13px;
          transition: color 0.2s;
        }

        .footer-column a:hover {
          color: #2563eb;
        }

        .footer-socials {
          display: flex;
          gap: 8px;
          margin-top: 12px;
        }

        .footer-social-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 999px;
          background: #e0e7ff;
          color: #2563eb;
          text-decoration: none;
          font-size: 14px;
          font-weight: 700;
        }

        .footer-copyright {
          padding: 16px 28px;
          border-top: 1px solid rgba(15, 23, 42, 0.08);
          font-size: 12px;
          color: #64748b;
          text-align: center;
        }

        @media (max-width: 960px) {
          .contact-hero {
            grid-template-columns: 1fr;
            min-height: auto;
          }

          .contact-footer {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 560px) {
          .contact-hero {
            grid-template-columns: 1fr;
          }

          .contact-info {
            padding: 24px;
          }

          .contact-form-section {
            padding: 24px;
          }

          .contact-footer {
            grid-template-columns: 1fr;
          }

          .contact-header {
            padding: 24px;
          }

          .contact-header h1 {
            font-size: 24px;
          }

          .contact-header p {
            font-size: 14px;
          }
        }
      `),e.default.createElement("div",{style:Ce.container},e.default.createElement("div",{className:"contact-section"},e.default.createElement("div",{className:"contact-header"},e.default.createElement(H.Link,{className:"change8-about-back-btn",to:"/admin","aria-label":"Back to user dashboard"},"<- Back to User Dashboard"),e.default.createElement("h1",null,"Style Flow"),e.default.createElement("p",null,"We're here to help you flow."))),e.default.createElement("div",{className:"contact-section"},e.default.createElement("div",{className:"contact-hero"},e.default.createElement("div",{className:"contact-info"},e.default.createElement("div",{className:"contact-item"},e.default.createElement("div",{className:"contact-icon"},"\u{1F4DE}"),e.default.createElement("div",{className:"contact-item-content"},e.default.createElement("h3",null,"Phone"),e.default.createElement("p",null,e.default.createElement("a",{href:"tel:+94772849767",style:{color:"#0369a1",textDecoration:"none"}},"+94 772849767")),e.default.createElement("p",null,"Monday - Friday, 9am - 5pm EST"))),e.default.createElement("div",{className:"contact-item"},e.default.createElement("div",{className:"contact-icon"},"\u2709\uFE0F"),e.default.createElement("div",{className:"contact-item-content"},e.default.createElement("h3",null,"Email"),e.default.createElement("p",null,e.default.createElement("a",{href:"mailto:support@change8.com",style:{color:"#0369a1",textDecoration:"none"}},"chanukaranditha99@gmail.com")))),e.default.createElement("div",{className:"contact-item"},e.default.createElement("div",{className:"contact-icon"},"\u{1F4CD}"),e.default.createElement("div",{className:"contact-item-content"},e.default.createElement("h3",null,"Headquarters Address"),e.default.createElement("p",null,e.default.createElement("a",{href:"https://maps.google.com/?q=123+Fashion+Ave,+Suite+400,+New+York,+NY+10011",target:"_blank",rel:"noopener noreferrer",style:{color:"#0369a1",textDecoration:"none"}},"6 mail post",e.default.createElement("br",null),"Laxapana")))),e.default.createElement("div",{className:"contact-item"},e.default.createElement("div",{className:"contact-icon"},"\u{1F310}"),e.default.createElement("div",{className:"contact-item-content"},e.default.createElement("h3",null,"Social Media"),e.default.createElement("div",{className:"contact-links"},e.default.createElement("a",{href:"https://twitter.com/change8",className:"contact-link",title:"Twitter",target:"_blank",rel:"noopener noreferrer"},"\u{1D54F}"),e.default.createElement("a",{href:"https://instagram.com/change8",className:"contact-link",title:"Instagram",target:"_blank",rel:"noopener noreferrer"},"\u{1F4F7}"),e.default.createElement("a",{href:"https://linkedin.com/company/change8",className:"contact-link",title:"LinkedIn",target:"_blank",rel:"noopener noreferrer"},"\u{1F4BC}"))))),e.default.createElement("div",{className:"contact-map"},e.default.createElement("iframe",{title:"Change8 HQ Map",src:"https://www.google.com/maps?q=123+Fashion+Ave,+New+York,+NY+10011&output=embed",width:"100%",height:"220",style:{border:0,borderRadius:"12px"},allowFullScreen:"",loading:"lazy",referrerPolicy:"no-referrer-when-downgrade"})))),e.default.createElement("div",{className:"contact-section"},e.default.createElement("div",{className:"contact-form-section"},e.default.createElement("div",{className:"contact-form-header"},e.default.createElement("h2",null,"Send Us a Message"),e.default.createElement("p",null,"Drop Us a Line")),e.default.createElement("form",{onSubmit:k,autoComplete:"off",noValidate:!0},e.default.createElement("div",{className:"form-group"},e.default.createElement("label",{htmlFor:"fullName"},"Full Name"),e.default.createElement("input",{id:"fullName",name:"fullName",type:"text",placeholder:"Your name",value:t.fullName,onChange:b,required:!0,disabled:n,autoFocus:!0}),p&&p.type==="error"&&!t.fullName&&e.default.createElement("span",{style:{color:"#991b1b",fontSize:13}},"Full name is required.")),e.default.createElement("div",{className:"form-group"},e.default.createElement("label",{htmlFor:"email"},"Email Address"),e.default.createElement("input",{id:"email",name:"email",type:"email",placeholder:"e.g., you@example.com",value:t.email,onChange:b,required:!0,disabled:n}),p&&p.type==="error"&&(!t.email||!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(t.email))&&e.default.createElement("span",{style:{color:"#991b1b",fontSize:13}},"Valid email is required.")),e.default.createElement("div",{className:"form-group"},e.default.createElement("label",{htmlFor:"subject"},"Subject"),e.default.createElement("input",{id:"subject",name:"subject",type:"text",placeholder:"How can we help?",value:t.subject,onChange:b,required:!0,disabled:n}),p&&p.type==="error"&&!t.subject&&e.default.createElement("span",{style:{color:"#991b1b",fontSize:13}},"Subject is required.")),e.default.createElement("div",{className:"form-group"},e.default.createElement("label",{htmlFor:"message"},"Your Message"),e.default.createElement("textarea",{id:"message",name:"message",placeholder:"Tell us more about your inquiry...",value:t.message,onChange:b,required:!0,disabled:n}),p&&p.type==="error"&&!t.message&&e.default.createElement("span",{style:{color:"#991b1b",fontSize:13}},"Message is required.")),e.default.createElement("button",{type:"submit",className:"form-submit",disabled:n},n?"Sending...":"Send Message"),p&&e.default.createElement("div",{className:`form-status ${p.type}`,style:{fontSize:16,fontWeight:700}},p.message)))),e.default.createElement("div",{style:Ce.footer},e.default.createElement("div",{className:"contact-footer"},e.default.createElement("div",{className:"footer-column"},e.default.createElement("h4",null,"Change8"),e.default.createElement("p",null,"Change8 is a fashion-driven destination with curated products and streamlined store management.")),e.default.createElement("div",{className:"footer-column"},e.default.createElement("h4",null,"Products"),e.default.createElement("a",{href:"/"},"Home"),e.default.createElement("a",{href:"/#products"},"Products"),e.default.createElement("a",{href:"/#about"},"About"),e.default.createElement("a",{href:"/#contact"},"Contact")),e.default.createElement("div",{className:"footer-column"},e.default.createElement("h4",null,"Links"),e.default.createElement("a",{href:"/"},"Home"),e.default.createElement("a",{href:"/#products"},"Shop"),e.default.createElement("a",{href:"/#about"},"About"),e.default.createElement("a",{href:"/#contact"},"Contact")),e.default.createElement("div",{className:"footer-column"},e.default.createElement("h4",null,"Social Media"),e.default.createElement("div",{className:"footer-socials"},e.default.createElement("a",{href:"#",className:"footer-social-icon",title:"Twitter"},"\u{1D54F}"),e.default.createElement("a",{href:"#",className:"footer-social-icon",title:"Instagram"},"\u{1F4F7}"),e.default.createElement("a",{href:"#",className:"footer-social-icon",title:"LinkedIn"},"\u{1F4BC}"),e.default.createElement("a",{href:"#",className:"footer-social-icon",title:"GitHub"},"\u{1F419}")))),e.default.createElement("div",{className:"footer-copyright"},"Copyright \xA9 Change8.com | All rights reserved"))))},Ce={shell:{minHeight:"100%",padding:"28px 12px",background:"#f7f9fc",color:"#111827",fontFamily:'"Plus Jakarta Sans", system-ui, sans-serif'},container:{width:"100%",maxWidth:"1200px",margin:"0 auto"},footer:{marginTop:"24px"}};AdminJS.UserComponents={},AdminJS.UserComponents.Dashboard=Ze,AdminJS.UserComponents.Register=et,AdminJS.UserComponents.ProductCardsList=ut,AdminJS.UserComponents.ProductShow=Ut,AdminJS.UserComponents.OrderCreate=Kt,AdminJS.UserComponents.OrderShow=da,AdminJS.UserComponents.OrderItemShow=Ea,AdminJS.UserComponents.ProductImage=Sa,AdminJS.UserComponents.ProductImageUpload=za,AdminJS.UserComponents.ProductSizeStockInput=La,AdminJS.UserComponents.CategoryShow=ja,AdminJS.UserComponents.About=Ta,AdminJS.UserComponents.Contact=Fa})(React,ReactRouterDOM);
