(function(n){"use strict";function He(a){return a&&a.__esModule?a:{default:a}}var e=He(n);const ge=a=>{const t=Number(a||0);return`Rs. ${t.toLocaleString(void 0,{minimumFractionDigits:t%1===0?0:2,maximumFractionDigits:2})}`},fe=a=>{const t=a?.image||a?.imageUrl||a?.thumbnail||a?.cover||"/public/img3.png",l=String(t||"").toLowerCase();return l.includes("img1")||l.includes("img2")?"/public/img3.png":t},Je=a=>String(a?.name||"product").split(" ").slice(0,2).map(l=>l[0]).join("").toUpperCase(),Xe=a=>{const t=a?.params?a.params:a||{};return{id:t.id??a?.id,name:t.name||"Untitled product",price:Number(t.price||0),imageUrl:t.imageUrl||"",isActive:!!t.isActive,stock:Number(t.stock||0),categoryName:t?.category?.name||t?.categoryName||t?.categoryId||"Shop",recordActions:a?.recordActions||a?.actions||[]}},Ve=a=>{const t=a?.params?a.params:a||{};return{id:t.id??a?.id,status:String(t.status||"pending"),totalAmount:Number(t.totalAmount||0),createdAt:t.createdAt||a?.createdAt||null,userName:t?.user?.name||t?.customerName||t?.shippingName||"Order",recordActions:a?.recordActions||a?.actions||[]}},he=a=>{const l=(a?.recordActions||[]).find(s=>s?.name==="show");return l?.href?l.href:a?.id?`/admin/resources/Products/records/${encodeURIComponent(a.id)}/show`:""},Ge=()=>{const[a,t]=n.useState({users:0,products:0,categories:0,orders:0}),[l,s]=n.useState([]),[b,m]=n.useState([]),[h,v]=n.useState(!0),[x,o]=n.useState(""),[c,u]=n.useState(0),[i,S]=n.useState(""),[$,L]=n.useState(""),[C,O]=n.useState(!1);n.useEffect(()=>{const r=document.documentElement,f=document.body;return r.classList.add("change8-storefront-dashboard-page"),f?.classList.add("change8-storefront-dashboard-page"),()=>{r.classList.remove("change8-storefront-dashboard-page"),f?.classList.remove("change8-storefront-dashboard-page")}},[]),n.useEffect(()=>{let r=!0;return(async()=>{v(!0);try{const[N,E,_]=await Promise.all([fetch("/admin/api/dashboard",{credentials:"same-origin"}),fetch("/api/products",{credentials:"same-origin"}),fetch("/admin/api/resources/Orders/actions/list",{credentials:"same-origin"})]),pe=N.ok?await N.json():{},We=E.ok?await E.json():[],Re=_.ok?await _.json():{};if(!r)return;const _e=Array.isArray(We)?We.map(Xe):[],ja=Array.isArray(Re?.records)?Re.records.map(Ve):[];t({users:Number(pe?.users||0),products:Number(pe?.products||_e.length||0),categories:Number(pe?.categories||0),orders:Number(pe?.orders||0)}),s(_e),m(ja)}catch{r&&(s([]),m([]))}finally{r&&v(!1)}})(),()=>{r=!1}},[]),n.useEffect(()=>{const r=()=>{O(!1)};return document.addEventListener("click",r),()=>{document.removeEventListener("click",r)}},[]),n.useEffect(()=>{let r=!0;return(async()=>{try{const N=await fetch("/admin/context/current-user",{credentials:"same-origin",headers:{Accept:"application/json"}});if(!N.ok)return;const E=await N.json();r&&(S(String(E?.name||"").trim()),L(String(E?.role||"").trim().toLowerCase()))}catch{r&&(S(""),L(""))}})(),()=>{r=!1}},[]);const z=n.useMemo(()=>l.filter(r=>r.isActive!==!1),[l]),I=n.useMemo(()=>{const r=x.trim().toLowerCase();return r?z.filter(f=>[f.name,String(f.categoryName||""),String(f.stock||"")].join(" ").toLowerCase().includes(r)):z},[z,x]),A=n.useMemo(()=>[{id:"img3-static",name:"New Collection",categoryName:"Featured",imageUrl:"/public/img3.png",isActive:!0,stock:0,price:0,recordActions:[]},{id:"img4-static",name:"Latest Drop",categoryName:"Featured",imageUrl:"/public/img4.png",isActive:!0,stock:0,price:0,recordActions:[]},{id:"img5-static",name:"Latest Drop",categoryName:"Featured",imageUrl:"/public/img5.png",isActive:!0,stock:0,price:0,recordActions:[]}],[]);n.useEffect(()=>{if(A.length<=1)return;const r=window.setInterval(()=>{u(f=>(f+1)%A.length)},4200);return()=>window.clearInterval(r)},[A.length]),n.useEffect(()=>{c>=A.length&&u(0)},[c,A.length]);const q=A[c]||z[0]||l[0]||null,H=fe(q),R=q?.name||"Revive Me Jett",F=q?.categoryName||"Oversize Tee",d=he(q),p="/admin/resources/Orders/actions/list",g=n.useMemo(()=>I,[I]),P=n.useMemo(()=>{const r=new Map;return l.forEach(f=>{const N=String(f.categoryName||"Shop");r.set(N,(r.get(N)||0)+1)}),Array.from(r.entries()).map(([f,N])=>({name:f,count:N}))},[l]),w=$==="admin",y=Array.isArray(l)?l.slice(0,12):[],k=P.slice(0,6);return w?e.default.createElement("div",{className:"change8-admin-dashboard"},e.default.createElement("style",null,`
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
        `),e.default.createElement("div",{className:"change8-admin-dashboard-grid"},e.default.createElement("div",{className:"change8-admin-dashboard-header"},e.default.createElement("div",null,e.default.createElement("h1",{className:"change8-admin-dashboard-title"},"Admin Dashboard"),e.default.createElement("p",{className:"change8-admin-dashboard-subtitle"},"Manage your shop data, products, orders, and users from here.")),e.default.createElement("div",{className:"change8-admin-actions"},e.default.createElement("a",{className:"change8-admin-action change8-admin-action--primary",href:"/admin/resources/Products/actions/new"},"+ Add Product"),e.default.createElement("a",{className:"change8-admin-action",href:"/admin/resources/Categories/actions/new"},"+ Add Category"))),e.default.createElement("div",{className:"change8-admin-dashboard-cards"},e.default.createElement("div",{className:"change8-admin-card"},e.default.createElement("div",{className:"change8-admin-card-label"},"Users"),e.default.createElement("div",{className:"change8-admin-card-value"},a.users)),e.default.createElement("div",{className:"change8-admin-card"},e.default.createElement("div",{className:"change8-admin-card-label"},"Products"),e.default.createElement("div",{className:"change8-admin-card-value"},a.products)),e.default.createElement("div",{className:"change8-admin-card"},e.default.createElement("div",{className:"change8-admin-card-label"},"Orders"),e.default.createElement("div",{className:"change8-admin-card-value"},a.orders)),e.default.createElement("div",{className:"change8-admin-card"},e.default.createElement("div",{className:"change8-admin-card-label"},"Categories"),e.default.createElement("div",{className:"change8-admin-card-value"},a.categories))),e.default.createElement("div",{className:"change8-admin-dashboard-links"},e.default.createElement("a",{className:"change8-admin-link",href:"/admin/resources/Products/actions/list"},e.default.createElement("strong",null,"Products"),"Open product list and manage inventory."),e.default.createElement("a",{className:"change8-admin-link",href:"/admin/resources/Orders/actions/list"},e.default.createElement("strong",null,"Orders"),"Review and process customer orders."),e.default.createElement("a",{className:"change8-admin-link",href:"/admin/resources/Users/actions/list"},e.default.createElement("strong",null,"Users"),"View registered users and roles.")),e.default.createElement("div",{className:"change8-admin-panel",style:{padding:"20px"}},e.default.createElement("h2",{className:"change8-admin-section-title"},"Products Table"),e.default.createElement("div",{className:"change8-admin-table-wrap"},e.default.createElement("table",{className:"change8-admin-table"},e.default.createElement("thead",null,e.default.createElement("tr",null,e.default.createElement("th",null,"Image"),e.default.createElement("th",null,"Name"),e.default.createElement("th",null,"Category"),e.default.createElement("th",null,"Stock"),e.default.createElement("th",null,"Price"),e.default.createElement("th",null,"Status"),e.default.createElement("th",null,"Action"))),e.default.createElement("tbody",null,y.length?y.map(r=>e.default.createElement("tr",{key:r.id},e.default.createElement("td",{className:"change8-admin-thumb-cell"},e.default.createElement("img",{className:"change8-admin-thumb",src:fe(r),alt:r.name})),e.default.createElement("td",null,r.name),e.default.createElement("td",null,r.categoryName||"-"),e.default.createElement("td",null,Number(r.stock||0)),e.default.createElement("td",null,ge(r.price)),e.default.createElement("td",null,e.default.createElement("span",{className:`change8-admin-status-pill ${r.isActive?"change8-admin-status-pill--active":"change8-admin-status-pill--inactive"}`},r.isActive?"Active":"Inactive")),e.default.createElement("td",null,e.default.createElement("a",{href:he(r)},"View")))):e.default.createElement("tr",null,e.default.createElement("td",{colSpan:7,style:{color:"#64748b"}},"No products available.")))))),e.default.createElement("div",{className:"change8-admin-panel",style:{padding:"20px"}},e.default.createElement("h2",{className:"change8-admin-section-title"},"Categories"),e.default.createElement("div",{className:"change8-admin-category-list"},k.map(r=>e.default.createElement("div",{key:r.name,className:"change8-admin-category-item"},e.default.createElement("span",null,e.default.createElement("strong",{className:"change8-admin-category-name"},r.name),e.default.createElement("span",{className:"change8-admin-category-meta"},"Products in category")),e.default.createElement("span",{style:{fontWeight:700}},r.count))))))):e.default.createElement("div",{className:"change8-storefront-dashboard"},e.default.createElement("style",null,`
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
          background-image: url("${H}");
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
            justify-items: center;
          }

          .change8-nav-links {
            justify-content: center;
            gap: 18px;
            flex-wrap: wrap;
          }

          .change8-nav-actions {
            width: 100%;
            justify-content: center;
            flex-wrap: wrap;
          }

          .change8-nav-user-display {
            width: 100%;
            justify-content: center;
          }

          .change8-hero-copy {
            width: 100%;
            padding: 22px 20px 56px;
          }

          .change8-product-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
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
            padding: 14px 16px 16px;
          }

          .change8-brand {
            width: 72px;
            height: 72px;
            font-size: 14px;
          }

          .change8-search {
            width: 100%;
          }

          .change8-hero {
            min-height: 420px;
          }

          .change8-hero-title {
            font-size: clamp(32px, 12vw, 48px);
          }

          .change8-hero-subtitle {
            font-size: 16px;
            letter-spacing: 0.24em;
          }

          .change8-hero-button {
            width: 100%;
          }

          .change8-product-grid {
            grid-template-columns: 1fr;
          }
        }
      `),e.default.createElement("div",{className:"change8-shell"},e.default.createElement("div",{className:"change8-top-strip"},"FREE SHIPPING now available in Sri Lanka"),e.default.createElement("header",{className:"change8-nav"},e.default.createElement("div",{className:"change8-nav-links","aria-label":"Primary"},e.default.createElement("a",{href:"#hero",className:"is-active"},"Home"),e.default.createElement("a",{href:"#products"},"Product"),e.default.createElement("a",{href:"/admin/pages/About"},"About"),e.default.createElement("a",{href:"#contact"},"Contact Us")),e.default.createElement("div",{className:"change8-brand","aria-label":"Store brand"},e.default.createElement("img",{src:"/public/icon.png",alt:"Store logo"})),e.default.createElement("div",{className:"change8-nav-actions"},e.default.createElement("label",{className:"change8-search",htmlFor:"change8-search-input"},e.default.createElement("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2"},e.default.createElement("circle",{cx:"11",cy:"11",r:"7"}),e.default.createElement("path",{d:"M20 20l-3.5-3.5"})),e.default.createElement("input",{id:"change8-search-input",type:"search",placeholder:"Search Products",value:x,onChange:r=>o(r.target.value)})),i?e.default.createElement("div",{className:"change8-user-menu"},e.default.createElement("button",{type:"button",className:"change8-user-toggle","aria-label":"Logged in user menu","aria-expanded":C,onClick:r=>{r.stopPropagation(),O(f=>!f)}},i),C?e.default.createElement("div",{className:"change8-user-dropdown",role:"menu",onClick:r=>r.stopPropagation()},e.default.createElement("button",{type:"button",className:"change8-logout-button",onClick:()=>{O(!1),window.location.href="/admin/logout"}},"Logout")):null):e.default.createElement("div",{className:"change8-user-fallback","aria-label":"Account"},e.default.createElement("div",{className:"change8-icon"},e.default.createElement("svg",{viewBox:"0 0 24 24"},e.default.createElement("circle",{cx:"12",cy:"8",r:"4"}),e.default.createElement("path",{d:"M4 20c1.8-4.2 5-6 8-6s6.2 1.8 8 6"})))),e.default.createElement("div",{className:"change8-icon","aria-label":"Wishlist"},e.default.createElement("svg",{viewBox:"0 0 24 24"},e.default.createElement("path",{d:"M12 21s-7-4.6-9.2-9.2C.8 8.2 2.4 5 5.8 5c1.8 0 3.2 1 4.2 2.2C11 6 12.5 5 14.2 5c3.4 0 5 3.2 3 6.8C19 16.4 12 21 12 21z"}))),e.default.createElement("button",{type:"button",className:"change8-icon change8-cart-button","aria-label":"Cart",onClick:()=>{window.location.assign(p)}},e.default.createElement("svg",{viewBox:"0 0 24 24"},e.default.createElement("path",{d:"M3 4h2l2.2 11.3A2 2 0 0 0 9.2 17H18a2 2 0 0 0 2-1.6l1.1-6.4H6.1"}),e.default.createElement("circle",{cx:"9",cy:"20",r:"1.5"}),e.default.createElement("circle",{cx:"17",cy:"20",r:"1.5"})),e.default.createElement("span",{className:"change8-badge"},Math.max(0,Number(a?.orders||0)))))),e.default.createElement("main",{className:"change8-content"},e.default.createElement("section",{className:"change8-hero",id:"hero"},e.default.createElement("div",{className:"change8-hero-image"}),e.default.createElement("button",{type:"button",className:"change8-slider-arrow change8-slider-arrow--left","aria-label":"Previous slide",onClick:()=>{A.length&&u(r=>r===0?A.length-1:r-1)}},"\u2039"),e.default.createElement("button",{type:"button",className:"change8-slider-arrow change8-slider-arrow--right","aria-label":"Next slide",onClick:()=>{A.length&&u(r=>(r+1)%A.length)}},"\u203A"),e.default.createElement("div",{className:"change8-hero-copy"},e.default.createElement("div",{className:"change8-hero-eyebrow"},"New season drop"),e.default.createElement("h1",{className:"change8-hero-title"},R),e.default.createElement("p",{className:"change8-hero-subtitle"},F),e.default.createElement("a",{href:d||"#products",className:"change8-hero-button",onClick:r=>{d||r.preventDefault()}},"Shop Now")),e.default.createElement("div",{className:"change8-slider-dots","aria-label":"Carousel navigation"},A.map((r,f)=>e.default.createElement("button",{key:r.id||`${r.name}-${f}`,type:"button",className:`change8-slider-dot ${f===c?"is-active":""}`,"aria-label":`Go to slide ${f+1}`,onClick:()=>u(f)})))),e.default.createElement("section",{className:"change8-products",id:"products"},e.default.createElement("div",{className:"change8-products-head"},e.default.createElement("h2",{className:"change8-products-title"},"Our Products")),h?e.default.createElement("div",{className:"change8-loading"},"Loading products..."):g.length===0?e.default.createElement("div",{className:"change8-empty"},"No products found."):e.default.createElement("div",{className:"change8-product-grid"},g.map(r=>{const f=he(r),N=fe(r);return e.default.createElement("article",{key:r.id},e.default.createElement("a",{className:"change8-product-card",href:f||"#",onClick:E=>{f||E.preventDefault()}},e.default.createElement("div",{className:"change8-product-media"},N?e.default.createElement("img",{src:N,alt:r.name}):e.default.createElement("div",{style:{width:"100%",height:"100%",display:"grid",placeItems:"center",color:"#111",fontWeight:800,fontSize:"22px",background:"linear-gradient(135deg, #dbeafe, #fce7f3)"}},Je(r)),e.default.createElement("span",{className:"change8-favorite"},"\u2661")),e.default.createElement("h3",{className:"change8-product-name"},r.name),e.default.createElement("div",{className:"change8-product-price"},e.default.createElement("s",null,ge(r.price*1.14)),ge(r.price))))}))))))},Qe=()=>{const[a,t]=n.useState({name:"",email:"",password:""}),[l,s]=n.useState({type:"",text:""}),[b,m]=n.useState(!1);n.useEffect(()=>{document.body.style.margin="0"},[]);const h=x=>{t(o=>({...o,[x.target.name]:x.target.value}))},v=async x=>{x.preventDefault(),s({type:"",text:""}),m(!0);try{const o=await fetch("/api/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)}),c=await o.json();if(!o.ok)throw new Error(c.message||"Registration failed");s({type:"success",text:"Account created successfully! Redirecting..."}),setTimeout(()=>{window.location.href="/admin/login"},2e3)}catch(o){s({type:"error",text:o.message}),m(!1)}};return e.default.createElement("div",{className:"register-page"},e.default.createElement("style",null,`
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
      `),e.default.createElement("div",{className:"register-card"},e.default.createElement("div",{className:"register-logo"},"Register our site"),e.default.createElement("div",{className:`register-message ${l.type} ${l.text?"is-visible":""}`},l.text),e.default.createElement("form",{onSubmit:v},e.default.createElement("div",{className:"register-field"},e.default.createElement("label",{className:"register-label",htmlFor:"name"},"Full Name"),e.default.createElement("input",{className:"register-input",type:"text",id:"name",name:"name",placeholder:"Enter your full name",value:a.name,onChange:h,required:!0})),e.default.createElement("div",{className:"register-field"},e.default.createElement("label",{className:"register-label",htmlFor:"email"},"Email Address"),e.default.createElement("input",{className:"register-input",type:"email",id:"email",name:"email",placeholder:"example@email.com",value:a.email,onChange:h,required:!0})),e.default.createElement("div",{className:"register-field"},e.default.createElement("label",{className:"register-label",htmlFor:"password"},"Password"),e.default.createElement("input",{className:"register-input",type:"password",id:"password",name:"password",placeholder:"At least 6 characters",minLength:6,value:a.password,onChange:h,required:!0})),e.default.createElement("button",{className:"register-button",type:"submit",disabled:b},b?"Creating account...":"Create Account")),e.default.createElement("div",{className:"register-footer"},"Already have an account? ",e.default.createElement("a",{href:"/admin/login"},"Log in"))))},Ke={display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(240px, 1fr))",gap:"16px"},Ye={borderRadius:"16px",border:"1px solid rgba(148, 163, 184, 0.28)",background:"linear-gradient(160deg, #0b1a38 0%, #09162f 100%)",color:"#f8fafc",overflow:"hidden",boxShadow:"0 12px 22px rgba(2, 6, 23, 0.25)"},Ze={width:"100%",height:"200px",background:"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",padding:"8px"},et={width:"100%",height:"100%",objectFit:"contain"},tt={padding:"14px",display:"grid",gap:"8px"},at={display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",fontSize:"13px",color:"#cbd5e1"},rt=a=>({width:"fit-content",fontSize:"11px",fontWeight:700,letterSpacing:"0.05em",padding:"5px 10px",borderRadius:"999px",color:a?"#14532d":"#7f1d1d",background:a?"#bbf7d0":"#fecaca"}),nt={display:"inline-block",marginTop:"4px",color:"#93c5fd",textDecoration:"none",fontSize:"13px",fontWeight:600,cursor:"pointer"},ye={padding:"18px",borderRadius:"12px",border:"1px dashed rgba(148, 163, 184, 0.45)",color:"#cbd5e1"},ot=a=>{const t=Number(a||0);return Number.isFinite(t)?t.toLocaleString(void 0,{minimumFractionDigits:2,maximumFractionDigits:2}):"0.00"},ke=a=>a?.params?.id||a?.id||a?.param?.id||"",lt=(a,t)=>{const b=(a?.recordActions||a?.actions||[]).find(h=>h?.name==="show")?.href||a?.href||"";if(b)return b;const m=ke(a);return m?`/admin/resources/${encodeURIComponent(t)}/records/${encodeURIComponent(m)}/show`:""},it=a=>{const[t,l]=n.useState([]),[s,b]=n.useState(!1),[m,h]=n.useState(""),v=a?.resource?.id==="Product"?"Products":a?.resource?.id||"Products",x=a?.records||[];n.useEffect(()=>{if(x.length)return;let c=!0;return(async()=>{b(!0),h("");try{const i=await fetch(`/admin/api/resources/${encodeURIComponent(v)}/actions/list`,{credentials:"same-origin"}),S=await i.json();if(!i.ok)throw new Error(S?.message||"Failed to load products");c&&l(S?.records||[])}catch(i){c&&h(i?.message||"Failed to load products")}finally{c&&b(!1)}})(),()=>{c=!1}},[x.length,v]);const o=n.useMemo(()=>x.length?x:t,[x,t]);return s?e.default.createElement("div",{style:ye},"Loading products..."):m?e.default.createElement("div",{style:ye},m):o.length?e.default.createElement("div",{style:Ke},o.map(c=>{const u=c?.params||{},i=ke(c),S=u?.name||"Unnamed product",$=u?.categoryId||"-",L=u?.imageUrl||"",C=Number(u?.stock||0),O=!!u?.isActive,z=lt(c,v),I=()=>{z&&window.location.assign(z)};return e.default.createElement("article",{key:i,style:Ye},e.default.createElement("div",{style:Ze},L?e.default.createElement("img",{src:L,alt:S,style:et}):e.default.createElement("div",{style:{height:"100%",display:"flex",alignItems:"center",justifyContent:"center",color:"#94a3b8",fontSize:"13px"}},"No image")),e.default.createElement("div",{style:tt},e.default.createElement("div",{style:{fontSize:"18px",fontWeight:700}},S),e.default.createElement("div",{style:at},e.default.createElement("div",null,"Category: ",$),e.default.createElement("div",null,"Stock: ",C),e.default.createElement("div",null,"Price: Rs. ",ot(u?.price))),e.default.createElement("span",{style:rt(O)},O?"ACTIVE":"INACTIVE"),e.default.createElement("a",{href:z||"#",style:nt,onClick:A=>{A.preventDefault(),I()},"aria-disabled":!z},"View details")))})):e.default.createElement("div",{style:ye},"No products found.")},dt={minHeight:"100%",padding:"24px",color:"#111827",background:"#ffffff"},st={display:"flex",alignItems:"center",justifyContent:"space-between",gap:"16px",marginBottom:"18px",flexWrap:"wrap"},ct={color:"#111827",textDecoration:"none",display:"inline-flex",alignItems:"center",gap:"8px",fontSize:"14px",fontWeight:700},mt={display:"grid",gridTemplateColumns:"minmax(320px, 1.05fr) minmax(360px, 0.95fr)",gap:"18px",alignItems:"start"},be={borderRadius:"22px",border:"1px solid rgba(17, 24, 39, 0.08)",background:"#ffffff",boxShadow:"0 18px 34px rgba(15, 23, 42, 0.08)",overflow:"hidden"},ut={...be,display:"grid",gridTemplateRows:"1fr auto",minHeight:"500px"},pt={background:"#f8fafc",minHeight:"340px",display:"grid",placeItems:"center"},gt={width:"100%",height:"100%",objectFit:"cover",display:"block"},ft={width:"100%",height:"100%",display:"grid",placeItems:"center",color:"#64748b",background:"linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",fontSize:"14px",letterSpacing:"0.08em",textTransform:"uppercase"},ht={display:"flex",alignItems:"center",justifyContent:"space-between",gap:"12px",padding:"16px 18px 18px",background:"#ffffff",borderTop:"1px solid rgba(17, 24, 39, 0.08)",flexWrap:"wrap"},yt={margin:0,fontSize:"clamp(30px, 4vw, 54px)",lineHeight:1,fontWeight:800,color:"#111827",textTransform:"capitalize"},bt={margin:"8px 0 0",color:"#6b7280",fontSize:"14px"},xt=a=>({display:"inline-flex",alignItems:"center",gap:"8px",width:"fit-content",padding:"7px 12px",borderRadius:"999px",fontSize:"11px",fontWeight:800,letterSpacing:"0.1em",textTransform:"uppercase",color:a?"#14532d":"#7f1d1d",background:a?"#bbf7d0":"#fecaca"}),Et=a=>({width:"8px",height:"8px",borderRadius:"999px",background:a?"#22c55e":"#ef4444"}),vt={display:"grid",gridTemplateColumns:"repeat(3, minmax(0, 1fr))",gap:"12px",marginTop:"18px"},ne={borderRadius:"16px",border:"1px solid rgba(17, 24, 39, 0.08)",background:"#f8fafc",padding:"14px"},oe={fontSize:"11px",textTransform:"uppercase",letterSpacing:"0.18em",color:"#6b7280",marginBottom:"8px"},le={fontSize:"17px",fontWeight:700,color:"#111827",wordBreak:"break-word"};({...be});const Ne={margin:0,fontSize:"13px",fontWeight:800,letterSpacing:"0.18em",textTransform:"uppercase",color:"#111827"},wt={marginTop:"12px",color:"#374151",fontSize:"15px",lineHeight:1.8,whiteSpace:"pre-wrap"},St={display:"grid",gap:"10px",marginTop:"12px"},K={display:"flex",justifyContent:"space-between",gap:"12px",paddingBottom:"10px",borderBottom:"1px solid rgba(17, 24, 39, 0.08)"},Y={color:"#6b7280",fontSize:"13px"},Z={color:"#111827",fontWeight:600,textAlign:"right",fontSize:"13px"},kt={display:"flex",gap:"12px",flexWrap:"wrap",marginTop:"18px"},Nt={display:"inline-flex",alignItems:"center",justifyContent:"center",gap:"8px",minWidth:"180px",padding:"14px 18px",borderRadius:"14px",border:"none",background:"linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",color:"#ffffff",fontSize:"15px",fontWeight:700,cursor:"pointer",boxShadow:"0 10px 18px rgba(99, 102, 241, 0.3)"},zt={display:"inline-flex",alignItems:"center",justifyContent:"center",gap:"8px",minWidth:"180px",padding:"14px 18px",borderRadius:"14px",border:"1px solid rgba(17, 24, 39, 0.12)",background:"#ffffff",color:"#111827",fontSize:"15px",fontWeight:700,cursor:"pointer"},Ct=a=>`Rs. ${Number(a||0).toLocaleString(void 0,{minimumFractionDigits:2,maximumFractionDigits:2})}`,ze=a=>{if(!a)return"-";const t=new Date(a);return Number.isNaN(t.getTime())?String(a):t.toLocaleString(void 0,{dateStyle:"medium",timeStyle:"short"})},Pt=a=>a?.imageUrl||a?.image||a?.thumbnail||a?.cover||"",It=a=>{if(!a)return{};let t=a;if(typeof t=="string")try{t=JSON.parse(t)}catch{return{}}if(!t||typeof t!="object"||Array.isArray(t))return{};const l={};for(const[s,b]of Object.entries(t)){const m=String(s||"").trim().toUpperCase();if(!m)continue;const h=Number(b);Number.isFinite(h)&&(l[m]=Math.max(0,Math.trunc(h)))}return l},At=a=>{const t=a?.record,l=t?.params||{},[s,b]=n.useState(null),[m,h]=n.useState(l),v=l?.id||t?.id||"",x=m?.name||"Unnamed product",o=m?.sku||"-",c=m?.categoryId||"-",u=Pt(m),i=Number(m?.stock||0),S=It(m?.sizeStock),$=Object.entries(S),L=!!m?.isActive,C=Ct(m?.price),O=m?.description||"No description available for this product.",z=v?`/admin/resources/Products/records/${encodeURIComponent(String(v))}/edit`:"",I=v?`/admin/resources/Orders/actions/new?productId=${encodeURIComponent(String(v))}`:"",A=()=>{I&&window.location.assign(I)},q=()=>{z&&window.location.assign(z)};return n.useEffect(()=>{v&&fetch(`/api/products/${v}`,{method:"GET",credentials:"include"}).then(F=>F.ok?F.json():null).catch(()=>null).then(F=>{F?.id&&h(F)}),fetch("/admin/context/current-user",{method:"GET",credentials:"include"}).then(F=>F.ok?F.json():null).catch(()=>null).then(F=>{F?.role&&b(F.role)});const H=document.documentElement,R=document.body;return H.classList.add("change8-product-show-active"),R?.classList.add("change8-product-show-active"),()=>{H.classList.remove("change8-product-show-active"),R?.classList.remove("change8-product-show-active")}},[v]),e.default.createElement("div",{style:dt},e.default.createElement("style",null,`
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
      `),e.default.createElement("div",{className:"change8-product-show-shell change8-product-show-page"},e.default.createElement("div",{style:st},e.default.createElement("a",{href:"/admin/resources/Products/actions/list",style:ct},e.default.createElement("span",{"aria-hidden":"true"},"\u2039"),"Back to Products"),e.default.createElement("div",{style:xt(L)},e.default.createElement("span",{style:Et(L)}),L?"Active":"Inactive")),e.default.createElement("div",{className:"change8-product-show-layout",style:mt},e.default.createElement("section",{style:ut},e.default.createElement("div",{style:pt},u?e.default.createElement("img",{src:u,alt:x,style:gt}):e.default.createElement("div",{style:ft},"No image available")),e.default.createElement("div",{style:ht},e.default.createElement("div",null,e.default.createElement("div",{style:{color:"#64748b",fontSize:"12px"}},"Product ID"),e.default.createElement("div",{style:{color:"#111827",fontWeight:700}},v||"-")),e.default.createElement("div",null,e.default.createElement("div",{style:{color:"#64748b",fontSize:"12px"}},"Price"),e.default.createElement("div",{style:{color:"#111827",fontWeight:700}},C)))),e.default.createElement("section",{style:be},e.default.createElement("div",{style:{padding:"22px"}},e.default.createElement("h1",{style:yt},x),e.default.createElement("p",{style:bt},"Clean product detail view with quick actions and record info."),e.default.createElement("div",{className:"change8-product-show-info-grid",style:vt},e.default.createElement("div",{style:ne},e.default.createElement("div",{style:oe},"Price"),e.default.createElement("div",{style:le},C)),e.default.createElement("div",{style:ne},e.default.createElement("div",{style:oe},"Stock"),e.default.createElement("div",{style:le},i)),e.default.createElement("div",{style:ne},e.default.createElement("div",{style:oe},"SKU"),e.default.createElement("div",{style:le},o)),e.default.createElement("div",{style:ne},e.default.createElement("div",{style:oe},"Sizes"),e.default.createElement("div",{style:le},$.length))),e.default.createElement("div",{style:kt},s!=="admin"&&e.default.createElement("button",{type:"button",style:Nt,onClick:A},"Create Order"),e.default.createElement("button",{type:"button",style:zt,onClick:q},"Edit Product")),e.default.createElement("div",{className:"change8-product-show-meta-scroll",style:{marginTop:"22px",paddingTop:"20px",borderTop:"1px solid rgba(17, 24, 39, 0.08)",display:"grid",gap:"18px"}},e.default.createElement("div",null,e.default.createElement("h2",{style:Ne},"Description"),e.default.createElement("div",{style:wt},O)),e.default.createElement("div",null,e.default.createElement("h2",{style:Ne},"Product Details"),e.default.createElement("div",{style:St},e.default.createElement("div",{style:K},e.default.createElement("span",{style:Y},"Category"),e.default.createElement("span",{style:Z},c)),e.default.createElement("div",{style:K},e.default.createElement("span",{style:Y},"Size Stock"),e.default.createElement("span",{style:Z},$.length?$.map(([H,R])=>`${H}: ${R}`).join(" | "):"No size-wise stock")),e.default.createElement("div",{style:K},e.default.createElement("span",{style:Y},"Created At"),e.default.createElement("span",{style:Z},ze(m?.createdAt))),e.default.createElement("div",{style:K},e.default.createElement("span",{style:Y},"Updated At"),e.default.createElement("span",{style:Z},ze(m?.updatedAt))),e.default.createElement("div",{style:K},e.default.createElement("span",{style:Y},"Record ID"),e.default.createElement("span",{style:Z},v||"-"))))))))))},Ut={display:"grid",gap:"20px",color:"#111827",background:"#ffffff"},X={borderRadius:"18px",border:"1px solid rgba(17, 24, 39, 0.08)",background:"#ffffff",boxShadow:"0 14px 28px rgba(15, 23, 42, 0.08)",padding:"18px"},ee={margin:"0 0 14px 0",fontSize:"13px",textTransform:"uppercase",letterSpacing:"0.12em",color:"#111827",fontWeight:800},Lt={display:"grid",gridTemplateColumns:"minmax(300px, 0.95fr) minmax(420px, 1.25fr)",gap:"16px"},Ce={display:"grid",gap:"16px"},T={fontSize:"11px",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"#475569"},M={width:"100%",minWidth:0,boxSizing:"border-box",borderRadius:"12px",border:"1px solid rgba(17, 24, 39, 0.12)",background:"#ffffff",color:"#111827",padding:"11px 13px",fontSize:"14px",fontFamily:"inherit"},j={display:"grid",gap:"8px",minWidth:0},te={display:"grid",gridTemplateColumns:"repeat(2, minmax(0, 1fr))",gap:"10px",alignItems:"start"},Tt={display:"grid",gap:"10px"},ie={display:"flex",justifyContent:"space-between",gap:"10px",fontSize:"13px",paddingBottom:"8px",borderBottom:"1px solid rgba(17, 24, 39, 0.08)"},B={color:"#64748b"},de={color:"#111827",fontWeight:700,textAlign:"right"},jt={border:"1px solid rgba(17, 24, 39, 0.12)",borderRadius:"14px",padding:"12px",display:"grid",gap:"12px",background:"#f8fafc"},$t={display:"grid",gridTemplateColumns:"1fr auto",gap:"10px",alignItems:"center"},Mt={display:"grid",gridTemplateColumns:"56px 1fr",gap:"10px",alignItems:"center"},Pe={width:"56px",height:"56px",borderRadius:"10px",objectFit:"cover",background:"#e5e7eb",border:"1px solid rgba(17, 24, 39, 0.12)"},Dt={border:"1px solid rgba(99, 102, 241, 0.35)",borderRadius:"10px",padding:"9px 12px",background:"#eef2ff",color:"#3730a3",cursor:"pointer",fontWeight:700},Ot={border:"1px solid #fca5a5",borderRadius:"10px",padding:"8px 10px",background:"#fee2e2",color:"#991b1b",cursor:"pointer",fontSize:"12px",fontWeight:700},V={display:"flex",justifyContent:"space-between",padding:"7px 0",fontSize:"13px",borderBottom:"1px solid rgba(17, 24, 39, 0.08)"},Ft={...V,fontSize:"17px",fontWeight:800,color:"#111827",borderBottom:"none",paddingTop:"12px"},qt={display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"},Ie=a=>({borderRadius:"12px",border:a?"none":"1px solid rgba(17, 24, 39, 0.12)",padding:"12px 14px",fontWeight:700,cursor:"pointer",background:a?"linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)":"#ffffff",color:a?"#fff":"#111827"}),Bt={color:"#2563eb",fontSize:"12px",textDecoration:"none"},Wt={display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"},Rt=a=>({borderRadius:"12px",border:a?"1px solid rgba(99, 102, 241, 0.9)":"1px solid rgba(17, 24, 39, 0.12)",background:a?"#eef2ff":"#ffffff",color:"#111827",padding:"10px 12px",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:"8px",fontWeight:700}),_t={marginTop:"12px",display:"grid",gap:"8px"},xe={border:"1px solid rgba(34, 197, 94, 0.42)",borderRadius:"999px",background:"#ecfdf3",color:"#166534",padding:"7px 10px",fontSize:"12px",fontWeight:700,letterSpacing:"0.03em"},Ht=`
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
`,Jt=[{value:"Card",label:"Card Payment",icon:"\u{1F4B3}"},{value:"Cash on Delivery",label:"Cash on Delivery",icon:"\u{1F4E6}"}],Xt=["XS","S","M","L","XL","XXL"],Vt=["PickMe Flash","Pronto","Domex","Registered Courier"],U=a=>{const t=Number(a||0);return Number.isFinite(t)?t:0},G=a=>`Rs. ${U(a).toLocaleString(void 0,{minimumFractionDigits:2,maximumFractionDigits:2})}`,Gt=a=>{if(!a)return{};let t=a;if(typeof t=="string")try{t=JSON.parse(t)}catch{return{}}if(!t||typeof t!="object"||Array.isArray(t))return{};const l={};for(const[s,b]of Object.entries(t)){const m=String(s||"").trim().toUpperCase();if(!m)continue;const h=Math.max(0,Math.trunc(Number(b||0)));l[m]=h}return l},Ee=a=>{const t=Gt(a?.sizeStock);return Object.entries(t).sort(([l],[s])=>l.localeCompare(s)).map(([l,s])=>({size:l,qty:s}))},Q=a=>{const t=Ee(a);return t.length>0?t:Xt.map(l=>({size:l,qty:null}))},Ae=()=>({productId:"",size:"",quantity:1,unitPrice:0}),Qt=()=>{const[a,t]=n.useState([]),[l,s]=n.useState([]),[b,m]=n.useState({}),[h,v]=n.useState(null),[x,o]=n.useState(!0),[c,u]=n.useState(!1),[i,S]=n.useState({userId:"",status:"pending",paymentMethod:"Card",paymentStatus:"pending",transactionId:"",shippingName:"",shippingPhone:"",shippingAddress:"",shippingMethod:"PickMe Flash",trackingNumber:"",shippingFee:0,tax:0,discount:0}),[$,L]=n.useState([Ae()]);n.useEffect(()=>{const d=document.documentElement,p=document.body,g=d.classList.contains("change8-login-page"),P=p?.classList.contains("change8-login-page"),w=d.classList.contains("change8-storefront-dashboard-page"),y=p?.classList.contains("change8-storefront-dashboard-page"),k=document.getElementById("change8-login-bg-layer"),r=k?.style.display||"",f=Array.from(new Set([d,p,document.getElementById("app"),document.querySelector('[data-testid="layout"]'),document.querySelector('[data-css="layout"]'),document.querySelector(".adminjs_Layout"),document.querySelector("main"),...Array.from(document.querySelectorAll('[data-css*="action-content"], [data-testid*="content"], .adminjs_Main, .adminjs_Main > div, .adminjs_Main > div > div, [data-css$="-content"]'))].filter(Boolean))),N=new Map(f.map(E=>[E,{background:E.style.getPropertyValue("background"),backgroundPriority:E.style.getPropertyPriority("background"),backgroundColor:E.style.getPropertyValue("background-color"),backgroundColorPriority:E.style.getPropertyPriority("background-color"),backgroundImage:E.style.getPropertyValue("background-image"),backgroundImagePriority:E.style.getPropertyPriority("background-image")}]));return d.classList.remove("change8-login-page","change8-storefront-dashboard-page"),p?.classList.remove("change8-login-page","change8-storefront-dashboard-page"),k&&(k.style.display="none"),f.forEach(E=>{E.style.setProperty("background","#ffffff","important"),E.style.setProperty("background-color","#ffffff","important"),E.style.setProperty("background-image","none","important")}),d.classList.add("change8-order-create-active"),p?.classList.add("change8-order-create-active"),()=>{d.classList.remove("change8-order-create-active"),p?.classList.remove("change8-order-create-active"),g&&d.classList.add("change8-login-page"),P&&p?.classList.add("change8-login-page"),w&&d.classList.add("change8-storefront-dashboard-page"),y&&p?.classList.add("change8-storefront-dashboard-page"),k&&(k.style.display=r),N.forEach((E,_)=>{E.background?_.style.setProperty("background",E.background,E.backgroundPriority||""):_.style.removeProperty("background"),E.backgroundColor?_.style.setProperty("background-color",E.backgroundColor,E.backgroundColorPriority||""):_.style.removeProperty("background-color"),E.backgroundImage?_.style.setProperty("background-image",E.backgroundImage,E.backgroundImagePriority||""):_.style.removeProperty("background-image")})}},[]),n.useEffect(()=>{const p=new URLSearchParams(window.location.search).get("productId")||"";(async()=>{try{const P=await fetch(`/admin/context/order-create${p?`?productId=${encodeURIComponent(p)}`:""}`,{credentials:"same-origin"}),w=P.ok?await P.json():{},y=Array.isArray(w?.users)?w.users:[],k=Array.isArray(w?.products)?w.products:[];if(t(y),s(k),m(w?.orderCountByUser||{}),v(w?.currentUser||null),w?.currentUser?.id&&S(r=>({...r,userId:r.userId||String(w.currentUser.id)})),w?.selectedProduct?.id){const r=Q(w.selectedProduct);L([{productId:String(w.selectedProduct.id),size:r[0]?.size||"",quantity:1,unitPrice:U(w.selectedProduct.price)}]);return}if(p&&k.some(r=>String(r.id)===String(p))){const r=k.find(N=>String(N.id)===String(p)),f=Q(r);L([{productId:String(p),size:f[0]?.size||"",quantity:1,unitPrice:U(r?.price)}])}}finally{o(!1)}})()},[]);const C=n.useMemo(()=>a.find(d=>String(d.id)===String(i.userId))||null,[a,i.userId]),O=n.useMemo(()=>C?Number(b[String(C.id)]||0):0,[b,C]);n.useEffect(()=>{C&&S(d=>({...d,shippingName:d.shippingName||C.name||"",shippingPhone:d.shippingPhone||C.phone||C.mobile||""}))},[C]);const z=n.useMemo(()=>{const d=$.reduce((y,k)=>y+U(k.quantity)*U(k.unitPrice),0),p=U(i.shippingFee),g=U(i.tax),P=U(i.discount),w=Math.max(d+p+g-P,0);return{subtotal:d,shippingFee:p,tax:g,discount:P,grandTotal:w}},[$,i.shippingFee,i.tax,i.discount]),I=d=>{const{name:p,value:g}=d.target;S(P=>({...P,[p]:g}))},A=(d,p,g)=>{L(P=>{const w=[...P],y={...w[d]};if(p==="productId"){y.productId=g;const k=l.find(N=>String(N.id)===String(g)),r=Q(k);y.unitPrice=U(k?.price),y.size=r[0]?.size||"";const f=r[0]?.qty===null?null:Math.max(1,Number(r[0]?.qty||0));f!==null&&(y.quantity=Math.max(1,Math.min(U(y.quantity),f)))}else if(p==="size"){y.size=g;const k=l.find(N=>String(N.id)===String(y.productId)),f=Q(k).find(N=>N.size===g);if(f&&f.qty!==null){const N=Math.max(1,Number(f.qty||0));y.quantity=Math.max(1,Math.min(U(y.quantity),N))}}else if(p==="quantity"){const k=l.find(E=>String(E.id)===String(y.productId)),f=Q(k).find(E=>E.size===y.size),N=Math.max(1,U(g));if(f&&f.qty!==null){const E=Math.max(1,Number(f.qty||0));y.quantity=Math.min(N,E)}else y.quantity=N}else p==="unitPrice"&&(y.unitPrice=Math.max(0,U(g)));return w[d]=y,w})},q=()=>{L(d=>[...d,Ae()])},H=d=>{L(p=>p.length===1?p:p.filter((g,P)=>P!==d))},R=n.useMemo(()=>i.shippingAddress?.trim()?`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(i.shippingAddress.trim())}`:"",[i.shippingAddress]),F=async d=>{d.preventDefault();const p=$.filter(g=>g.productId&&U(g.quantity)>0);if(!i.userId){alert("Please select a customer.");return}if(p.length===0){alert("At least one product line item is required.");return}for(const g of p){const P=l.find(y=>String(y.id)===String(g.productId)),w=Ee(P);if(w.length>0){if(!g.size){alert("Please select a size for all products.");return}const y=w.find(k=>k.size===String(g.size).toUpperCase());if(!y){alert(`Selected size is not available for ${P?.name||"this product"}.`);return}if(U(g.quantity)>y.qty){alert(`${P?.name||"Product"} (${y.size}) has only ${y.qty} in stock.`);return}}}u(!0);try{const g={userId:Number(i.userId),status:i.status,paymentMethod:i.paymentMethod,paymentStatus:i.paymentStatus,transactionId:i.transactionId||null,shippingName:i.shippingName||null,shippingPhone:i.shippingPhone||null,shippingMethod:i.shippingMethod,trackingNumber:i.trackingNumber||null,subtotal:z.subtotal.toFixed(2),shippingFee:z.shippingFee.toFixed(2),tax:z.tax.toFixed(2),discount:z.discount.toFixed(2),totalAmount:z.grandTotal.toFixed(2),shippingAddress:i.shippingAddress||null,lineItems:p.map(k=>({productId:Number(k.productId),size:k.size||null,quantity:Math.max(1,U(k.quantity)),unitPrice:Math.max(0,U(k.unitPrice)).toFixed(2)}))},P=new FormData;P.append("payload",JSON.stringify(g));const w=await fetch("/admin/context/order-create/submit",{method:"POST",credentials:"same-origin",body:P}),y=await w.json();if(!w.ok)throw new Error(y?.message||"Failed to create order");window.location.assign(`/admin/resources/Orders/records/${y.id}/show`)}catch(g){alert(g.message||"Failed to create order")}finally{u(!1)}};return e.default.createElement("div",{style:Ut},e.default.createElement("style",null,`
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

        ${Ht}
      `),e.default.createElement("form",{onSubmit:F,style:{display:"grid",gap:"16px"}},e.default.createElement("div",{className:"change8-order-layout",style:Lt},e.default.createElement("div",{style:Ce},e.default.createElement("div",{style:X},e.default.createElement("h2",{style:ee},"Customer Details"),e.default.createElement("div",{style:j},e.default.createElement("label",{style:T},"Select Customer *"),e.default.createElement("select",{name:"userId",value:i.userId,onChange:I,style:M,required:!0,disabled:x||h?.role==="user"},e.default.createElement("option",{value:""},x?"Loading customers...":"Select a customer"),a.map(d=>e.default.createElement("option",{key:d.id,value:d.id},d.name," (#",d.id,")")))),e.default.createElement("div",{style:{height:12}}),e.default.createElement("div",{style:Tt},e.default.createElement("div",{style:ie},e.default.createElement("span",{style:B},"Customer Name & ID"),e.default.createElement("span",{style:de},C?`${C.name} (#${C.id})`:"-")),e.default.createElement("div",{style:ie},e.default.createElement("span",{style:B},"Email"),e.default.createElement("span",{style:de},C?.email||"-")),e.default.createElement("div",{style:ie},e.default.createElement("span",{style:B},"Phone Number"),e.default.createElement("span",{style:de},C?.phone||C?.mobile||"Not available")),e.default.createElement("div",{style:ie},e.default.createElement("span",{style:B},"Order History"),e.default.createElement("span",{style:de},O," previous orders")))),e.default.createElement("div",{style:X},e.default.createElement("h2",{style:ee},"Payment & Billing"),e.default.createElement("div",{style:j},e.default.createElement("label",{style:T},"Payment Options"),e.default.createElement("div",{style:Wt},Jt.map(d=>{const p=i.paymentMethod===d.value;return e.default.createElement("button",{key:d.value,type:"button",style:Rt(p),onClick:()=>S(g=>({...g,paymentMethod:d.value}))},e.default.createElement("span",null,d.icon),e.default.createElement("span",null,d.label))}))),e.default.createElement("div",{style:{height:10}}),e.default.createElement("div",{className:"change8-order-grid-2",style:te},e.default.createElement("div",{style:j},e.default.createElement("label",{style:T},"Selected Method"),e.default.createElement("input",{value:i.paymentMethod,style:M,readOnly:!0})),e.default.createElement("div",{style:j},e.default.createElement("label",{style:T},"Payment Status"),e.default.createElement("select",{name:"paymentStatus",value:i.paymentStatus,onChange:I,style:M},e.default.createElement("option",{value:"pending"},"Pending"),e.default.createElement("option",{value:"paid"},"Paid")))),e.default.createElement("div",{style:{height:10}}),e.default.createElement("div",{style:j},e.default.createElement("label",{style:T},"Transaction ID"),e.default.createElement("input",{name:"transactionId",value:i.transactionId,onChange:I,style:M,placeholder:"e.g. TXN-2026-000124"})))),e.default.createElement("div",{style:Ce},e.default.createElement("div",{style:X},e.default.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",gap:"8px"}},e.default.createElement("h2",{style:{...ee,marginBottom:0}},"Product Line Items (Required)"),e.default.createElement("button",{type:"button",onClick:q,style:Dt},"+ Add Item")),e.default.createElement("div",{style:{height:12}}),e.default.createElement("div",{style:{display:"grid",gap:"10px"}},$.map((d,p)=>{const g=l.find(r=>String(r.id)===String(d.productId)),P=Q(g),w=P.find(r=>r.size===d.size),y=Ee(g).map(r=>`${r.size}: ${r.qty}`).join(" | "),k=U(d.quantity)*U(d.unitPrice);return e.default.createElement("div",{key:`line-item-${p}`,style:jt},e.default.createElement("div",{style:$t},e.default.createElement("div",{style:j},e.default.createElement("label",{style:T},"Product"),e.default.createElement("select",{value:d.productId,onChange:r=>A(p,"productId",r.target.value),style:M,required:!0},e.default.createElement("option",{value:""},"Select product"),l.map(r=>e.default.createElement("option",{key:r.id,value:r.id},r.name," (SKU: ",r.sku,")")))),e.default.createElement("button",{type:"button",style:Ot,onClick:()=>H(p)},"Remove")),e.default.createElement("div",{style:Mt},g?.imageUrl?e.default.createElement("img",{src:g.imageUrl,alt:g.name,style:Pe}):e.default.createElement("div",{style:{...Pe,display:"flex",alignItems:"center",justifyContent:"center",color:"#94a3b8",fontSize:"11px"}},"No image"),e.default.createElement("div",{style:{display:"grid",gap:"3px"}},e.default.createElement("strong",{style:{fontSize:"14px",color:"#f8fafc"}},g?.name||"Select a product"),e.default.createElement("span",{style:{fontSize:"12px",color:"#94a3b8"}},"SKU/ID:"," ",g?`${g.sku} / #${g.id}`:"-"),e.default.createElement("span",{style:{fontSize:"12px",color:"#cbd5e1"}},"Size: ",d.size||"-"," | Qty: ",d.quantity),y?e.default.createElement("span",{style:{fontSize:"11px",color:"#facc15"}},"Available: ",y):null)),e.default.createElement("div",{style:j},e.default.createElement("label",{style:T},"Size"),e.default.createElement("select",{value:d.size||"",onChange:r=>A(p,"size",r.target.value),style:M,required:!0},e.default.createElement("option",{value:""},"Select size"),P.map(r=>e.default.createElement("option",{key:r.size,value:r.size},r.qty===null?r.size:`${r.size} (${r.qty})`)))),e.default.createElement("div",{className:"change8-order-grid-2",style:te},e.default.createElement("div",{style:j},e.default.createElement("label",{style:T},"Quantity"),e.default.createElement("input",{type:"number",min:"1",max:w?.qty===null||w?.qty===void 0?void 0:Math.max(1,Number(w.qty||0)),value:d.quantity,onChange:r=>A(p,"quantity",r.target.value),style:M,required:!0})),e.default.createElement("div",{style:j},e.default.createElement("label",{style:T},"Unit Price"),e.default.createElement("input",{type:"number",min:"0",step:"0.01",value:d.unitPrice,onChange:r=>A(p,"unitPrice",r.target.value),style:M,required:!0}))),e.default.createElement("div",{style:{...V,borderBottom:"none",paddingBottom:0}},e.default.createElement("span",{style:B},"Line Total"),e.default.createElement("strong",{style:{color:"#f8fafc"}},G(k))))}))),e.default.createElement("div",{style:X},e.default.createElement("h2",{style:ee},"Shipping & Tracking"),e.default.createElement("div",{className:"change8-order-grid-2",style:te},e.default.createElement("div",{style:j},e.default.createElement("label",{style:T},"Shipping Contact Name *"),e.default.createElement("input",{name:"shippingName",value:i.shippingName,onChange:I,style:M,placeholder:"Receiver full name",required:!0})),e.default.createElement("div",{style:j},e.default.createElement("label",{style:T},"Shipping Phone Number *"),e.default.createElement("input",{name:"shippingPhone",value:i.shippingPhone,onChange:I,style:M,placeholder:"07X XXX XXXX",required:!0}))),e.default.createElement("div",{style:{height:10}}),e.default.createElement("div",{style:j},e.default.createElement("label",{style:T},"Shipping Address *"),e.default.createElement("textarea",{name:"shippingAddress",value:i.shippingAddress,onChange:I,style:{...M,minHeight:"86px",resize:"vertical"},placeholder:"House number, street, city, postal code",required:!0}),R?e.default.createElement("a",{href:R,target:"_blank",rel:"noreferrer",style:Bt},"Open on Google Maps"):null),e.default.createElement("div",{style:{height:10}}),e.default.createElement("div",{className:"change8-order-grid-2",style:te},e.default.createElement("div",{style:j},e.default.createElement("label",{style:T},"Shipping Method"),e.default.createElement("select",{name:"shippingMethod",value:i.shippingMethod,onChange:I,style:M},Vt.map(d=>e.default.createElement("option",{key:d,value:d},d)))),e.default.createElement("div",{style:j},e.default.createElement("label",{style:T},"Tracking Number"),e.default.createElement("input",{name:"trackingNumber",value:i.trackingNumber,onChange:I,style:M,placeholder:"TRK-XXXXXX"})))),e.default.createElement("div",{style:X},e.default.createElement("h2",{style:ee},"Order Summary / Totals"),e.default.createElement("div",{className:"change8-order-grid-2",style:te},e.default.createElement("div",{style:j},e.default.createElement("label",{style:T},"Shipping Fee"),e.default.createElement("input",{type:"number",step:"0.01",min:"0",name:"shippingFee",value:i.shippingFee,onChange:I,style:M})),e.default.createElement("div",{style:j},e.default.createElement("label",{style:T},"Tax / VAT"),e.default.createElement("input",{type:"number",step:"0.01",min:"0",name:"tax",value:i.tax,onChange:I,style:M}))),e.default.createElement("div",{style:{height:10}}),e.default.createElement("div",{style:j},e.default.createElement("label",{style:T},"Discount / Coupon"),e.default.createElement("input",{type:"number",step:"0.01",min:"0",name:"discount",value:i.discount,onChange:I,style:M})),e.default.createElement("div",{style:{height:12}}),e.default.createElement("div",{style:V},e.default.createElement("span",{style:B},"Subtotal"),e.default.createElement("strong",null,G(z.subtotal))),e.default.createElement("div",{style:V},e.default.createElement("span",{style:B},"Shipping Fee"),e.default.createElement("strong",null,G(z.shippingFee))),e.default.createElement("div",{style:V},e.default.createElement("span",{style:B},"Tax / VAT"),e.default.createElement("strong",null,G(z.tax))),e.default.createElement("div",{style:V},e.default.createElement("span",{style:B},"Discount"),e.default.createElement("strong",null,"- ",G(z.discount))),e.default.createElement("div",{style:Ft},e.default.createElement("span",null,"Grand Total"),e.default.createElement("span",null,G(z.grandTotal))),e.default.createElement("div",{style:_t},e.default.createElement("div",{style:xe},"Secure Payment Protected"),e.default.createElement("div",{style:xe},"Encrypted Checkout Channel"),e.default.createElement("div",{style:xe},"Trusted Delivery Tracking"))))),e.default.createElement("div",{style:{...X,paddingTop:"14px"}},e.default.createElement("div",{style:qt},e.default.createElement("button",{type:"button",style:Ie(!1),onClick:()=>window.history.back(),disabled:c},"Cancel"),e.default.createElement("button",{type:"submit",style:Ie(!0),disabled:c},c?"Creating Order...":"Create Order")))))},Kt={display:"grid",gap:"16px",color:"#e2e8f0"},se={borderRadius:"18px",border:"1px solid rgba(148, 163, 184, 0.2)",background:"linear-gradient(155deg, rgba(10, 23, 48, 0.94) 0%, rgba(8, 18, 38, 0.94) 100%)",boxShadow:"0 14px 30px rgba(2, 6, 23, 0.2)",padding:"18px"},Yt={display:"flex",justifyContent:"space-between",gap:"12px",alignItems:"center"},Zt={margin:0,color:"#f8fafc",fontSize:"34px",lineHeight:1.1},ea={color:"#94a3b8",fontSize:"13px",marginTop:"4px"},ta=a=>{const t=String(a||"pending").toLowerCase(),l={pending:{bg:"#fef3c7",fg:"#7c2d12"},paid:{bg:"#bbf7d0",fg:"#14532d"},processing:{bg:"#bfdbfe",fg:"#1e3a8a"},shipped:{bg:"#ddd6fe",fg:"#4c1d95"},completed:{bg:"#a7f3d0",fg:"#064e3b"},cancelled:{bg:"#fecaca",fg:"#7f1d1d"}},s=l[t]||l.pending;return{display:"inline-flex",padding:"6px 12px",borderRadius:"999px",fontSize:"11px",fontWeight:800,letterSpacing:"0.08em",textTransform:"uppercase",background:s.bg,color:s.fg}},ve={margin:"0 0 12px 0",color:"#f5df90",fontSize:"12px",fontWeight:800,letterSpacing:"0.11em",textTransform:"uppercase"},aa={display:"grid",gridTemplateColumns:"minmax(300px, 1fr) minmax(320px, 1fr)",gap:"16px"},ra={display:"grid",gap:"8px"},W={display:"flex",justifyContent:"space-between",gap:"10px",borderBottom:"1px solid rgba(148, 163, 184, 0.12)",paddingBottom:"8px",fontSize:"13px"},na={display:"grid",gap:"10px"},oa={border:"1px solid rgba(148, 163, 184, 0.22)",borderRadius:"14px",padding:"10px",background:"rgba(15, 23, 42, 0.44)",display:"grid",gridTemplateColumns:"60px 1fr auto",gap:"10px",alignItems:"center"},Ue={width:"60px",height:"60px",objectFit:"cover",borderRadius:"10px",border:"1px solid rgba(148, 163, 184, 0.22)",background:"#0f172a"},la={display:"grid",gap:"8px"},ae={display:"flex",justifyContent:"space-between",fontSize:"13px",borderBottom:"1px solid rgba(148, 163, 184, 0.12)",paddingBottom:"7px"},ia={...ae,borderBottom:"none",paddingTop:"6px",fontWeight:800,fontSize:"18px",color:"#f8fafc"},ce={border:"1px dashed rgba(148, 163, 184, 0.35)",borderRadius:"12px",padding:"14px",color:"#cbd5e1"},J=a=>`Rs. ${Number(a||0).toLocaleString(void 0,{minimumFractionDigits:2,maximumFractionDigits:2})}`,Le=a=>{if(!a)return"-";const t=new Date(a);return Number.isNaN(t.getTime())?String(a):t.toLocaleString(void 0,{dateStyle:"medium",timeStyle:"short"})},da=({record:a})=>{const[t,l]=n.useState(null),[s,b]=n.useState(!0),[m,h]=n.useState(""),v=a?.params?.id||a?.id;n.useEffect(()=>{if(!v){b(!1),h("Order id not found");return}(async()=>{try{h("");const c=await fetch(`/admin/context/orders/${encodeURIComponent(String(v))}/details`,{credentials:"same-origin"}),u=await c.json();if(!c.ok)throw new Error(u?.message||"Failed to load order details");l(u)}catch(c){h(c?.message||"Failed to load order details")}finally{b(!1)}})()},[v]);const x=n.useMemo(()=>{const o=Number(t?.subtotal||0),c=Number(t?.shippingFee||0),u=Number(t?.tax||0),i=Number(t?.discount||0),S=Number(t?.totalAmount||0);return{subtotal:o,shippingFee:c,tax:u,discount:i,totalAmount:S}},[t]);return s?e.default.createElement("div",{style:ce},"Loading order details..."):m?e.default.createElement("div",{style:ce},m):t?e.default.createElement("div",{style:Kt},e.default.createElement("style",null,"@media (max-width: 1040px) { .change8-order-show-grid { grid-template-columns: 1fr !important; } }"),e.default.createElement("div",{style:se},e.default.createElement("div",{style:Yt},e.default.createElement("div",null,e.default.createElement("h1",{style:Zt},"Order #",t.id),e.default.createElement("div",{style:ea},"Created ",Le(t.createdAt)," | Updated"," ",Le(t.updatedAt))),e.default.createElement("span",{style:ta(t.status)},t.status||"pending"))),e.default.createElement("div",{className:"change8-order-show-grid",style:aa},e.default.createElement("div",{style:se},e.default.createElement("h2",{style:ve},"Customer & Shipping"),e.default.createElement("div",{style:ra},e.default.createElement("div",{style:W},e.default.createElement("span",{style:{color:"#94a3b8"}},"Customer"),e.default.createElement("strong",null,t?.user?.name||"-")),e.default.createElement("div",{style:W},e.default.createElement("span",{style:{color:"#94a3b8"}},"Shipping Contact"),e.default.createElement("strong",null,t?.shippingName||"-")),e.default.createElement("div",{style:W},e.default.createElement("span",{style:{color:"#94a3b8"}},"Shipping Phone"),e.default.createElement("strong",null,t?.shippingPhone||"-")),e.default.createElement("div",{style:W},e.default.createElement("span",{style:{color:"#94a3b8"}},"Email"),e.default.createElement("strong",null,t?.user?.email||"-")),e.default.createElement("div",{style:W},e.default.createElement("span",{style:{color:"#94a3b8"}},"Payment Method"),e.default.createElement("strong",null,t?.paymentMethod||"-")),e.default.createElement("div",{style:W},e.default.createElement("span",{style:{color:"#94a3b8"}},"Payment Status"),e.default.createElement("strong",null,t?.paymentStatus||"-")),e.default.createElement("div",{style:W},e.default.createElement("span",{style:{color:"#94a3b8"}},"Transaction ID"),e.default.createElement("strong",null,t?.transactionId||"-")),e.default.createElement("div",{style:W},e.default.createElement("span",{style:{color:"#94a3b8"}},"Shipping Method"),e.default.createElement("strong",null,t?.shippingMethod||"-")),e.default.createElement("div",{style:W},e.default.createElement("span",{style:{color:"#94a3b8"}},"Tracking Number"),e.default.createElement("strong",null,t?.trackingNumber||"-")),e.default.createElement("div",{style:{fontSize:"13px",color:"#cbd5e1",lineHeight:1.6}},e.default.createElement("div",{style:{color:"#94a3b8",marginBottom:"4px"}},"Shipping Address"),e.default.createElement("div",{style:{whiteSpace:"pre-wrap"}},t?.shippingAddress||"-")))),e.default.createElement("div",{style:se},e.default.createElement("h2",{style:ve},"Order Summary / Totals"),e.default.createElement("div",{style:la},e.default.createElement("div",{style:ae},e.default.createElement("span",{style:{color:"#94a3b8"}},"Subtotal"),e.default.createElement("strong",null,J(x.subtotal))),e.default.createElement("div",{style:ae},e.default.createElement("span",{style:{color:"#94a3b8"}},"Shipping Fee"),e.default.createElement("strong",null,J(x.shippingFee))),e.default.createElement("div",{style:ae},e.default.createElement("span",{style:{color:"#94a3b8"}},"Tax / VAT"),e.default.createElement("strong",null,J(x.tax))),e.default.createElement("div",{style:ae},e.default.createElement("span",{style:{color:"#94a3b8"}},"Discount"),e.default.createElement("strong",null,"- ",J(x.discount))),e.default.createElement("div",{style:ia},e.default.createElement("span",null,"Grand Total"),e.default.createElement("span",null,J(x.totalAmount)))))),e.default.createElement("div",{style:se},e.default.createElement("h2",{style:ve},"Product Line Items"),e.default.createElement("div",{style:na},(t?.items||[]).length===0?e.default.createElement("div",{style:ce},"No line items in this order."):(t.items||[]).map(o=>e.default.createElement("div",{key:o.id,style:oa},o?.product?.imageUrl?e.default.createElement("img",{src:o.product.imageUrl,alt:o?.product?.name||"Product",style:Ue}):e.default.createElement("div",{style:{...Ue,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px",color:"#94a3b8"}},"No image"),e.default.createElement("div",{style:{display:"grid",gap:"4px"}},e.default.createElement("strong",{style:{color:"#f8fafc",fontSize:"14px"}},o?.product?.name||"Unnamed product"),e.default.createElement("span",{style:{color:"#94a3b8",fontSize:"12px"}},"SKU: ",o?.product?.sku||"-"," | Product ID: #",o?.productId),e.default.createElement("span",{style:{color:"#cbd5e1",fontSize:"12px"}},"Size: ",o?.size||"-"," | Qty: ",o.quantity," x"," ",J(o.unitPrice))),e.default.createElement("strong",{style:{color:"#f8fafc",fontSize:"15px"}},J(o.totalPrice))))))):e.default.createElement("div",{style:ce},"Order details not available.")},sa={display:"grid",gap:"16px",color:"#e2e8f0"},re={borderRadius:"18px",border:"1px solid rgba(148, 163, 184, 0.2)",background:"linear-gradient(155deg, rgba(10, 23, 48, 0.94) 0%, rgba(8, 18, 38, 0.94) 100%)",boxShadow:"0 14px 30px rgba(2, 6, 23, 0.2)",padding:"18px"},ca={display:"flex",justifyContent:"space-between",gap:"12px",alignItems:"center"},ma={margin:0,fontSize:"34px",lineHeight:1.1,color:"#f8fafc"},ua={margin:"6px 0 0 0",color:"#94a3b8",fontSize:"13px"},pa={display:"inline-flex",alignItems:"center",width:"fit-content",padding:"6px 12px",borderRadius:"999px",fontSize:"11px",fontWeight:800,letterSpacing:"0.08em",textTransform:"uppercase",color:"#14532d",background:"#bbf7d0"},ga={display:"grid",gridTemplateColumns:"minmax(300px, 0.95fr) minmax(320px, 1.05fr)",gap:"16px"},me={margin:"0 0 12px 0",color:"#f5df90",fontSize:"12px",fontWeight:800,letterSpacing:"0.11em",textTransform:"uppercase"},we={display:"grid",gap:"8px"},D={display:"flex",justifyContent:"space-between",gap:"10px",borderBottom:"1px solid rgba(148, 163, 184, 0.12)",paddingBottom:"8px",fontSize:"13px"},Te={width:"100%",height:"280px",objectFit:"cover",borderRadius:"14px",background:"#0f172a",border:"1px solid rgba(148, 163, 184, 0.22)"},fa={display:"grid",gridTemplateColumns:"84px 1fr auto",gap:"12px",alignItems:"center",padding:"12px",borderRadius:"14px",border:"1px solid rgba(148, 163, 184, 0.2)",background:"rgba(15, 23, 42, 0.44)"},ha={width:"84px",height:"84px",borderRadius:"12px",background:"#0f172a",border:"1px solid rgba(148, 163, 184, 0.22)",display:"flex",alignItems:"center",justifyContent:"center",color:"#94a3b8",fontSize:"11px"},Se={border:"1px dashed rgba(148, 163, 184, 0.35)",borderRadius:"12px",padding:"14px",color:"#cbd5e1"},ue=a=>`Rs. ${Number(a||0).toLocaleString(void 0,{minimumFractionDigits:2,maximumFractionDigits:2})}`,ya=a=>{if(!a)return"-";const t=new Date(a);return Number.isNaN(t.getTime())?String(a):t.toLocaleString(void 0,{dateStyle:"medium",timeStyle:"short"})},ba=({record:a})=>{const[t,l]=n.useState(null),[s,b]=n.useState(!0),[m,h]=n.useState(""),v=a?.params?.id||a?.id;n.useEffect(()=>{if(!v){b(!1),h("Order item id not found");return}(async()=>{try{h("");const S=await fetch(`/admin/context/order-items/${encodeURIComponent(String(v))}/details`,{credentials:"same-origin"}),$=await S.json();if(!S.ok)throw new Error($?.message||"Failed to load order item details");l($)}catch(S){h(S?.message||"Failed to load order item details")}finally{b(!1)}})()},[v]);const x=n.useMemo(()=>Number(t?.totalPrice||0),[t]);if(s)return e.default.createElement("div",{style:Se},"Loading order item details...");if(m)return e.default.createElement("div",{style:Se},m);if(!t)return e.default.createElement("div",{style:Se},"Order item details not available.");const o=t?.product||{},c=t?.order||{},u=c?.user||{};return e.default.createElement("div",{style:sa},e.default.createElement("style",null,"@media (max-width: 1040px) { .change8-order-item-grid { grid-template-columns: 1fr !important; } }"),e.default.createElement("div",{style:re},e.default.createElement("div",{style:ca},e.default.createElement("div",null,e.default.createElement("h1",{style:ma},o?.name||"Order Item"),e.default.createElement("p",{style:ua},"Order #",c?.id||"-"," \u2022 Item #",t?.id||"-")),e.default.createElement("span",{style:pa},"Active Item"))),e.default.createElement("div",{className:"change8-order-item-grid",style:ga},e.default.createElement("div",{style:re},o?.imageUrl?e.default.createElement("img",{src:o.imageUrl,alt:o?.name||"Product",style:Te}):e.default.createElement("div",{style:{...Te,display:"flex",alignItems:"center",justifyContent:"center",color:"#94a3b8"}},"No image available"),e.default.createElement("div",{style:{height:14}}),e.default.createElement("h2",{style:me},"Product Snapshot"),e.default.createElement("div",{style:we},e.default.createElement("div",{style:D},e.default.createElement("span",{style:{color:"#94a3b8"}},"Product Name"),e.default.createElement("strong",null,o?.name||"-")),e.default.createElement("div",{style:D},e.default.createElement("span",{style:{color:"#94a3b8"}},"SKU"),e.default.createElement("strong",null,o?.sku||"-")),e.default.createElement("div",{style:D},e.default.createElement("span",{style:{color:"#94a3b8"}},"Product ID"),e.default.createElement("strong",null,"#",o?.id||"-")),e.default.createElement("div",{style:D},e.default.createElement("span",{style:{color:"#94a3b8"}},"Current Stock"),e.default.createElement("strong",null,o?.stock??"-")))),e.default.createElement("div",{style:re},e.default.createElement("h2",{style:me},"Order & Customer"),e.default.createElement("div",{style:we},e.default.createElement("div",{style:D},e.default.createElement("span",{style:{color:"#94a3b8"}},"Customer"),e.default.createElement("strong",null,u?.name||"-")),e.default.createElement("div",{style:D},e.default.createElement("span",{style:{color:"#94a3b8"}},"Email"),e.default.createElement("strong",null,u?.email||"-")),e.default.createElement("div",{style:D},e.default.createElement("span",{style:{color:"#94a3b8"}},"Order ID"),e.default.createElement("strong",null,"#",c?.id||"-")),e.default.createElement("div",{style:D},e.default.createElement("span",{style:{color:"#94a3b8"}},"Order Status"),e.default.createElement("strong",null,c?.status||"-")),e.default.createElement("div",{style:D},e.default.createElement("span",{style:{color:"#94a3b8"}},"Payment Method"),e.default.createElement("strong",null,c?.paymentMethod||"-")),e.default.createElement("div",{style:D},e.default.createElement("span",{style:{color:"#94a3b8"}},"Shipping Method"),e.default.createElement("strong",null,c?.shippingMethod||"-")),e.default.createElement("div",{style:D},e.default.createElement("span",{style:{color:"#94a3b8"}},"Tracking Number"),e.default.createElement("strong",null,c?.trackingNumber||"-")),e.default.createElement("div",{style:D},e.default.createElement("span",{style:{color:"#94a3b8"}},"Created At"),e.default.createElement("strong",null,ya(t.createdAt)))))),e.default.createElement("div",{style:re},e.default.createElement("h2",{style:me},"Pricing Details"),e.default.createElement("div",{style:we},e.default.createElement("div",{style:D},e.default.createElement("span",{style:{color:"#94a3b8"}},"Quantity"),e.default.createElement("strong",null,t.quantity)),e.default.createElement("div",{style:D},e.default.createElement("span",{style:{color:"#94a3b8"}},"Unit Price"),e.default.createElement("strong",null,ue(t.unitPrice))),e.default.createElement("div",{style:D},e.default.createElement("span",{style:{color:"#94a3b8"}},"Line Total"),e.default.createElement("strong",null,ue(x))))),e.default.createElement("div",{style:re},e.default.createElement("h2",{style:me},"Quick Summary"),e.default.createElement("div",{style:fa},o?.imageUrl?e.default.createElement("img",{src:o.imageUrl,alt:o?.name||"Product",style:{width:"84px",height:"84px",objectFit:"cover",borderRadius:"12px"}}):e.default.createElement("div",{style:ha},"No image"),e.default.createElement("div",{style:{display:"grid",gap:"4px"}},e.default.createElement("strong",{style:{color:"#f8fafc",fontSize:"16px"}},o?.name||"Unnamed product"),e.default.createElement("span",{style:{color:"#94a3b8",fontSize:"12px"}},"SKU: ",o?.sku||"-"),e.default.createElement("span",{style:{color:"#cbd5e1",fontSize:"12px"}},"Qty ",t.quantity," x ",ue(t.unitPrice))),e.default.createElement("strong",{style:{color:"#f8fafc",fontSize:"16px"}},ue(x)))))},je={display:"flex",alignItems:"center",gap:"12px",minHeight:"56px"},xa={width:"64px",height:"42px",objectFit:"cover",borderRadius:"10px",border:"1px solid rgba(148, 163, 184, 0.35)",background:"#f8fafc",flexShrink:0},$e={width:"64px",height:"42px",borderRadius:"10px",border:"1px dashed rgba(148, 163, 184, 0.6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px",color:"#64748b",background:"#f8fafc",flexShrink:0},Me={display:"flex",flexDirection:"column",gap:"2px"},Ea=a=>{const t=a?.record?.params?.[a?.property?.path],[l,s]=n.useState(!1);return n.useEffect(()=>{s(!1)},[t]),t?l?e.default.createElement("div",{style:je},e.default.createElement("div",{style:$e},"Invalid"),e.default.createElement("div",{style:Me},e.default.createElement("span",{style:{fontWeight:600,color:"#0f172a"}},"Image URL"),e.default.createElement("a",{href:t,target:"_blank",rel:"noreferrer",style:{color:"#2563eb",textDecoration:"none",fontSize:"12px"}},"Open link"))):e.default.createElement("div",{style:je},e.default.createElement("img",{src:t,alt:"Product",style:xa,onError:()=>s(!0)}),e.default.createElement("div",{style:Me},e.default.createElement("span",{style:{fontWeight:600,color:"#0f172a"}},"Preview"),e.default.createElement("a",{href:t,target:"_blank",rel:"noreferrer",style:{color:"#2563eb",textDecoration:"none",fontSize:"12px"}},"Open image"))):e.default.createElement("div",{style:$e},"No image")},va={display:"flex",flexDirection:"column",gap:"10px"},wa={width:"140px",height:"96px",objectFit:"cover",borderRadius:"12px",border:"1px solid rgba(148, 163, 184, 0.35)",background:"#f8fafc"},De={fontSize:"12px",color:"#64748b"},Sa=a=>{const{onChange:t,record:l}=a,s=l?.params?.imageUrl||"",b=l?.params?.imagePublicId||"",[m,h]=n.useState(s),[v,x]=n.useState(b),[o,c]=n.useState(!1),[u,i]=n.useState("");n.useEffect(()=>{h(s),x(b)},[s,b]);const S=async L=>{const C=L.target.files?.[0];if(C){c(!0),i("");try{const O=new FormData;O.append("image",C);const z=await fetch("/api/uploads/image",{method:"POST",body:O}),I=await z.json();if(!z.ok)throw new Error(I.message||"Image upload failed");const A=I.url||"",q=I.publicId||"";h(A),x(q),t?.("imageUrl",A),t?.("imagePublicId",q)}catch(O){i(O.message)}finally{c(!1),L.target.value=""}}},$=()=>{h(""),x(""),t?.("imageUrl",""),t?.("imagePublicId","")};return e.default.createElement("div",{style:va},e.default.createElement("input",{type:"file",accept:"image/*",onChange:S}),e.default.createElement("div",{style:De},o?"Uploading to Cloudinary...":"Choose an image file to upload"),m?e.default.createElement(e.default.Fragment,null,e.default.createElement("img",{src:m,alt:"Product preview",style:wa}),e.default.createElement("button",{type:"button",onClick:$,style:{width:"fit-content",padding:"6px 10px",borderRadius:"8px",border:"1px solid #ef4444",color:"#ef4444",background:"#fff",cursor:"pointer"}},"Remove image")):null,u?e.default.createElement("div",{style:{...De,color:"#dc2626"}},u):null,e.default.createElement("input",{type:"hidden",name:"imageUrl",value:m,readOnly:!0}),e.default.createElement("input",{type:"hidden",name:"imagePublicId",value:v,readOnly:!0}))},ka={display:"grid",gap:"10px"},Na={display:"grid",gridTemplateColumns:"1fr 140px auto",gap:"8px",alignItems:"center"},Oe={border:"1px solid rgba(148, 163, 184, 0.45)",borderRadius:"10px",padding:"8px 10px",fontSize:"13px",background:"#fff"},za={fontSize:"12px",color:"#64748b"},Ca={width:"fit-content",padding:"7px 12px",borderRadius:"9px",border:"1px solid #6366f1",color:"#3730a3",background:"#eef2ff",cursor:"pointer",fontWeight:700},Pa={padding:"7px 9px",borderRadius:"9px",border:"1px solid #fca5a5",color:"#991b1b",background:"#fee2e2",cursor:"pointer",fontWeight:700},Ia=a=>{if(!a)return[];let t=a;if(typeof t=="string")try{t=JSON.parse(t)}catch{return[]}return!t||typeof t!="object"||Array.isArray(t)?[]:Object.entries(t).map(([l,s])=>({size:String(l||"").trim().toUpperCase(),stock:String(Number(s||0))}))},Aa=a=>{const{record:t,onChange:l}=a,s=n.useMemo(()=>Ia(t?.params?.sizeStock),[t?.params?.sizeStock]),[b,m]=n.useState(s.length?s:[{size:"",stock:""}]);n.useEffect(()=>{m(s.length?s:[{size:"",stock:""}])},[s]),n.useEffect(()=>{const o={};b.forEach(u=>{const i=String(u.size||"").trim().toUpperCase();if(!i)return;const S=Math.max(0,Math.trunc(Number(u.stock||0)));o[i]=S});const c=Object.values(o).reduce((u,i)=>u+Number(i||0),0);l?.("sizeStockText",JSON.stringify(o)),l?.("stock",c)},[b,l]);const h=(o,c,u)=>{m(i=>{const S=[...i];return S[o]={...S[o],[c]:u},S})},v=()=>{m(o=>[...o,{size:"",stock:""}])},x=o=>{m(c=>c.length<=1?[{size:"",stock:""}]:c.filter((u,i)=>i!==o))};return e.default.createElement("div",{style:ka},e.default.createElement("div",{style:za},"Add product sizes and stock per size. Total stock is auto-calculated."),b.map((o,c)=>e.default.createElement("div",{key:`${c}-${o.size}`,style:Na},e.default.createElement("input",{type:"text",placeholder:"Size (e.g. S, M, L, XL)",value:o.size,onChange:u=>h(c,"size",u.target.value),style:Oe}),e.default.createElement("input",{type:"number",min:"0",step:"1",placeholder:"Stock",value:o.stock,onChange:u=>h(c,"stock",u.target.value),style:Oe}),e.default.createElement("button",{type:"button",onClick:()=>x(c),style:Pa,"aria-label":"Remove size"},"Remove"))),e.default.createElement("button",{type:"button",onClick:v,style:Ca},"+ Add Size"),e.default.createElement("input",{type:"hidden",name:"sizeStock",value:JSON.stringify(b.reduce((o,c)=>{const u=String(c.size||"").trim().toUpperCase();return u&&(o[u]=Math.max(0,Math.trunc(Number(c.stock||0)))),o},{})),readOnly:!0}))},Ua=a=>{const{record:t,resource:l}=a,[s,b]=n.useState(null);if(n.useEffect(()=>{t&&t.params&&b(t.params)},[t]),!s)return e.default.createElement("div",{className:"category-show-loading"},"Loading...");const m=h=>{if(!h)return"\u2014";try{return new Date(h).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"})}catch{return"\u2014"}};return e.default.createElement("div",{className:"category-show-container"},e.default.createElement("style",null,`
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
      `),e.default.createElement("div",{className:"category-show-inner"},e.default.createElement("div",{className:"category-show-header"},e.default.createElement("div",{className:"category-show-kicker"},"Category Overview"),e.default.createElement("h1",{className:"category-show-title"},s.name||"\u2014"),e.default.createElement("div",{className:`category-show-status ${s.isActive?"active":"inactive"}`},e.default.createElement("span",null,"\u25CF"),s.isActive?"Active":"Inactive")),e.default.createElement("div",{className:"category-show-card"},e.default.createElement("div",{className:"category-show-section"},e.default.createElement("h3",{className:"category-show-section-title"},"Description"),s.description?e.default.createElement("div",{className:"category-show-description"},s.description):e.default.createElement("div",{className:"category-show-value",style:{color:"var(--text-muted)"}},"No description provided")),e.default.createElement("div",{className:"category-show-divider"}),e.default.createElement("div",{className:"category-show-section"},e.default.createElement("h3",{className:"category-show-section-title"},"Details"),e.default.createElement("div",{className:"category-show-details-grid"},e.default.createElement("div",{className:"category-show-detail-item"},e.default.createElement("label",{className:"category-show-label"},"Category ID"),e.default.createElement("div",{className:"category-show-value gold",style:{fontFamily:"monospace",fontSize:"14px"}},s.id||"\u2014")),e.default.createElement("div",{className:"category-show-detail-item"},e.default.createElement("label",{className:"category-show-label"},"Slug"),e.default.createElement("div",{className:"category-show-value"},s.slug||"\u2014")))),e.default.createElement("div",{className:"category-show-divider"}),e.default.createElement("div",{className:"category-show-section"},e.default.createElement("h3",{className:"category-show-section-title"},"Timeline"),e.default.createElement("div",{className:"category-show-details-grid"},e.default.createElement("div",{className:"category-show-detail-item"},e.default.createElement("label",{className:"category-show-label"},"Created"),e.default.createElement("div",{className:"category-show-value"},m(s.createdAt))),e.default.createElement("div",{className:"category-show-detail-item"},e.default.createElement("label",{className:"category-show-label"},"Last Updated"),e.default.createElement("div",{className:"category-show-value"},m(s.updatedAt))))))))},La={minHeight:"100%",padding:"28px",background:"#ffffff",color:"#111827",display:"grid",gap:"18px"},Fe={borderRadius:"20px",border:"1px solid rgba(17, 24, 39, 0.08)",background:"#ffffff",boxShadow:"0 18px 34px rgba(15, 23, 42, 0.08)",padding:"24px"},qe={margin:0,fontSize:"clamp(28px, 4vw, 44px)",lineHeight:1,fontWeight:800},Be={margin:0,color:"#475569",lineHeight:1.8,fontSize:"15px"},Ta=()=>e.default.createElement("div",{style:La},e.default.createElement("div",{style:Fe},e.default.createElement("h1",{style:qe},"About"),e.default.createElement("p",{style:Be},"This admin dashboard is used to manage shop products, orders, order items, categories, and settings in one place.")),e.default.createElement("div",{style:Fe},e.default.createElement("h2",{style:{...qe,fontSize:"24px",marginBottom:"12px"}},"What you can do here"),e.default.createElement("p",{style:Be},"Browse products, open product details, create orders, and manage the store data from the AdminJS interface.")));AdminJS.UserComponents={},AdminJS.UserComponents.Dashboard=Ge,AdminJS.UserComponents.Register=Qe,AdminJS.UserComponents.ProductCardsList=it,AdminJS.UserComponents.ProductShow=At,AdminJS.UserComponents.OrderCreate=Qt,AdminJS.UserComponents.OrderShow=da,AdminJS.UserComponents.OrderItemShow=ba,AdminJS.UserComponents.ProductImage=Ea,AdminJS.UserComponents.ProductImageUpload=Sa,AdminJS.UserComponents.ProductSizeStockInput=Aa,AdminJS.UserComponents.CategoryShow=Ua,AdminJS.UserComponents.About=Ta})(React);
