(() => {
  'use strict';

  Object.assign(window.App, {
    async init() {
      this.cacheEls(); this.bindGlobalEvents(); await AppDB.open(); await this.loadSettings(); this.initializeLocalOperator(); await this.loadData();
      await AppDB.ensureDailySnapshot().catch(() => null); this.state.snapshots = await AppDB.getSnapshots().catch(() => []);
      this.renderNavigation(); this.enterApp(); this.registerServiceWorker();
    },
    cacheEls() {
      const ids=['appShell','desktopNav','mobileNav','viewContainer','pageTitle','topbarEyebrow','globalSearch','quickAddButton','profileButton','avatarInitials','saveState','toastRegion','confirmDialog','confirmTitle','confirmText','confirmActionButton','recordDialog','recordDialogBody','restoreInput','systemBannerTitle','systemBannerText'];
      ids.forEach(id=>this.els[id]=document.getElementById(id));
    },
    bindGlobalEvents() {
      this.els.quickAddButton.addEventListener('click',()=>this.navigate('new'));
      this.els.profileButton.addEventListener('click',()=>this.navigate('profile'));
      this.els.globalSearch.addEventListener('input',e=>{const value=e.target.value.trim();if(!value)return;this.state.filters.search=value;this.navigate('records');});
      this.els.confirmDialog.addEventListener('close',async()=>{if(this.els.confirmDialog.returnValue==='confirm'&&this.state.pendingConfirm){const fn=this.state.pendingConfirm;this.state.pendingConfirm=null;await fn();}else this.state.pendingConfirm=null;});
      this.els.restoreInput.addEventListener('change',e=>this.handleRestoreFile(e));
      window.addEventListener('hashchange',()=>this.routeFromHash()); window.addEventListener('online',()=>this.setConnectionBanner(true)); window.addEventListener('offline',()=>this.setConnectionBanner(false));
      window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();this.state.deferredInstallPrompt=event;});
      document.addEventListener('visibilitychange',()=>{if(document.hidden&&this.state.currentDraft)this.saveDraftNow().catch(()=>{});});
      window.addEventListener('beforeunload',()=>{if(!this.state.currentDraft)return;const key=this.state.editingExistingId?`editBuffer:${this.state.editingExistingId}`:'unsavedDraftMirror';sessionStorage.setItem(key,JSON.stringify(this.state.currentDraft));});
    },
    async loadSettings() {
      const saved=await AppDB.get('settings','appSettings'); const base=structuredClone(this.defaultSettings); const value=saved?.value||{}; const merged={...base,...value};
      merged.equipmentTypes=Array.isArray(value.equipmentTypes)?value.equipmentTypes:base.equipmentTypes; merged.symptoms=Array.isArray(value.symptoms)?value.symptoms:base.symptoms; merged.faultCategories=Array.isArray(value.faultCategories)?value.faultCategories:base.faultCategories;
      const sourceRules=Array.isArray(value.routingRules)?value.routingRules:base.routingRules; merged.routingRules=base.routingRules.map(template=>{const found=sourceRules.find(rule=>rule.code===template.code)||{};return {...template,...found};});
      const design=value.formDesign||{}; merged.formDesign={...base.formDesign,...design,sectionOrder:Array.isArray(design.sectionOrder)?design.sectionOrder:base.formDesign.sectionOrder,sectionTitles:{...base.formDesign.sectionTitles,...(design.sectionTitles||{})},hiddenOptionalFields:Array.isArray(design.hiddenOptionalFields)?design.hiddenOptionalFields:[]};
      this.state.settings=merged; await AppDB.put('settings',{key:'appSettings',value:merged});
    },
    initializeLocalOperator(){const configured=String(this.state.settings?.localOperatorName||'').trim();this.state.user={email:'local-user',name:configured||'Utilizador local',role:'LOCAL'};},
    async loadData(){this.state.records=(await AppDB.getAll('records')).sort((a,b)=>new Date(b.updatedAt)-new Date(a.updatedAt));this.state.activities=(await AppDB.getAll('activities')).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));},
    setConnectionBanner(online){const title=this.els.systemBannerTitle;const text=this.els.systemBannerText;const dot=document.querySelector('#systemBanner .status-dot');title.textContent=online?'Protótipo local':'Offline · modo local';text.textContent=online?'Dados guardados apenas neste dispositivo. Não utilize informação real/confidencial neste site público.':'Pode continuar offline com dados locais fictícios. Não utilize dados reais neste protótipo público.';if(dot)dot.style.background=online?'var(--success)':'var(--warning)';},

    renderNavigation() {
      const desktop=this.navItems.filter(item=>!item.mobileOnly); const groups=['Operação','Análise','Configuração'];
      this.els.desktopNav.innerHTML=groups.map(group=>`<div class="nav-group"><span class="nav-group-label">${this.escape(group)}</span>${desktop.filter(item=>item.group===group).map(item=>`<button class="nav-item" type="button" data-route="${item.id}"><span class="nav-icon" aria-hidden="true">${this.icon(item.id)}</span><span>${this.escape(item.desktop)}</span></button>`).join('')}</div>`).join('');
      const mobileIds=['dashboard','records','new','statistics','more'];
      this.els.mobileNav.innerHTML=this.navItems.filter(item=>mobileIds.includes(item.id)).sort((a,b)=>mobileIds.indexOf(a.id)-mobileIds.indexOf(b.id)).map(item=>`<button class="mobile-nav-item" type="button" data-route="${item.id}"><span class="nav-icon" aria-hidden="true">${this.icon(item.id)}</span><span>${this.escape(item.label)}</span></button>`).join('');
      document.querySelectorAll('[data-route]').forEach(btn=>btn.addEventListener('click',()=>this.navigate(btn.dataset.route)));
    },
    enterApp(){this.els.appShell.classList.remove('is-hidden');this.updateAvatar();this.setConnectionBanner(navigator.onLine);this.routeFromHash(true);},
    updateAvatar(){const name=this.state.user?.name||'Utilizador local';const initials=name.split(' ').filter(Boolean).slice(0,2).map(part=>part[0]).join('').toUpperCase();this.els.avatarInitials.textContent=initials||'UL';},
    navigate(route,params=''){const next=`#/${route}${params}`;if(location.hash===next)this.renderRoute(route);else location.hash=next;},
    routeFromHash(force=false){const match=location.hash.match(/^#\/([^/?]+)/);const route=match?.[1]||'dashboard';if(!this.navItems.some(item=>item.id===route)&&!['edit'].includes(route))return this.navigate('dashboard');if(force||this.state.route!==route||route==='edit')this.renderRoute(route);},
    async renderRoute(route){
      this.state.route=route;this.setActiveNav(route==='edit'?'records':route);
      const titles={dashboard:'Resumo',new:'Novo Registo',records:'Registos',clients:'Clientes',statistics:'Estatísticas',designer:'Designer de Formulário',routing:'Encaminhamento',activity:'Atividade',productivity:'Produtividade',drafts:'Rascunhos',archive:'Arquivo',settings:'Configurações',help:'Guia de Utilização',profile:'Identificação Local',more:'Mais',edit:'Editar Registo'};
      this.els.pageTitle.textContent=titles[route]||'Formulários Operacionais';this.els.topbarEyebrow.textContent=route==='new'||route==='edit'?'Serviço técnico':'Coca-Cola · Operações';this.els.viewContainer.innerHTML='<div class="empty-state">A carregar…</div>';await this.loadData();
      const renderers={dashboard:()=>this.renderDashboard(),new:()=>this.renderRecordForm(),records:()=>this.renderRecords(),clients:()=>this.renderClients(),statistics:()=>this.renderStatistics(),designer:()=>this.renderFormDesigner(),routing:()=>this.renderRouting(),activity:()=>this.renderActivity(),productivity:()=>this.renderProductivity(),drafts:()=>this.renderDrafts(),archive:()=>this.renderArchive(),settings:()=>this.renderSettings(),help:()=>this.renderHelp(),profile:()=>this.renderProfile(),more:()=>this.renderMore(),edit:()=>this.renderEditFromHash()};
      await renderers[route]?.();this.els.viewContainer.focus({preventScroll:true});
    },
    setActiveNav(route){document.querySelectorAll('[data-route]').forEach(el=>el.classList.toggle('active',el.dataset.route===route));},
  });
})();
