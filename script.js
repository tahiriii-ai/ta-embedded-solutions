(function(){
  var t=document.getElementById('navToggle'),l=document.getElementById('navLinks');
  if(t&&l){
    var close=function(){l.classList.remove('open');t.setAttribute('aria-expanded','false')};
    t.addEventListener('click',function(){var o=l.classList.toggle('open');t.setAttribute('aria-expanded',o)});
    l.addEventListener('click',function(e){if(e.target.closest('a'))close()});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
    window.addEventListener('resize',function(){if(innerWidth>820)close()});
  }
  /* board inspector */
  var insp=document.getElementById('insp');
  if(insp){
    var tabs=[].slice.call(insp.querySelectorAll('.tab')),panes=[].slice.call(insp.querySelectorAll('.pane')),T=document.getElementById('inspT'),C=document.getElementById('inspC');
    var show=function(i,focus){
      tabs.forEach(function(b,j){b.setAttribute('aria-selected',j===i);b.tabIndex=j===i?0:-1});
      panes.forEach(function(p,j){p.hidden=j!==i});
      T.textContent=panes[i].dataset.t;C.textContent=panes[i].dataset.c;
      if(focus)tabs[i].focus();
    };
    tabs.forEach(function(b,i){
      b.addEventListener('click',function(){show(i)});
      b.addEventListener('keydown',function(e){
        var k=e.key,n=k==='ArrowRight'?(i+1)%tabs.length:k==='ArrowLeft'?(i+tabs.length-1)%tabs.length:k==='Home'?0:k==='End'?tabs.length-1:-1;
        if(n>-1){e.preventDefault();show(n,true)}
      });
    });
    show(0);
  }
  /* process: trace fills as you scroll */
  var flow=document.getElementById('flow');
  if(flow){
    var items=[].slice.call(flow.children),ticking=false;
    var upd=function(){
      ticking=false;
      var r=flow.getBoundingClientRect(),mid=innerHeight*.6;
      flow.style.setProperty('--p',Math.max(0,Math.min(1,(mid-r.top)/r.height)).toFixed(3));
      items.forEach(function(li){li.classList.toggle('on',li.getBoundingClientRect().top<mid)});
    };
    addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(upd)}},{passive:true});
    addEventListener('resize',upd);upd();
  }
  var f=document.getElementById('contactForm');
  if(f){
    var busy=false,s=document.getElementById('formStatus'),btn=document.getElementById('sendBtn');
    var val=function(id){var e=f.elements[id];return e?e.value.trim():''};
    var setErr=function(id,msg){
      var e=f.elements[id],m=document.getElementById(id+'-err');
      if(!e||!m)return;
      if(msg){m.textContent=msg;m.hidden=false;e.setAttribute('aria-invalid','true')}
      else{m.hidden=true;e.removeAttribute('aria-invalid')}
    };
    var check=function(){
      var bad=[];
      var r=function(id,msg,ok){var good=ok===undefined?val(id)!=='':ok;setErr(id,good?'':msg);if(!good)bad.push(id)};
      r('name','Please enter your name.');
      r('email','Please enter a valid email address.',/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val('email')));
      r('type','Please choose a project type.');
      r('message','Please describe your project in a sentence or two.');
      var l=val('link');r('link','Please enter a full link starting with https://',l===''||/^https?:\/\/\S+$/.test(l));
      return bad;
    };
    ['name','email','type','message','link'].forEach(function(id){f.elements[id].addEventListener('input',function(){if(f.elements[id].getAttribute('aria-invalid'))setErr(id,'')})});
    var status=function(cls,html,alert){s.className='note '+cls;s.setAttribute('role',alert?'alert':'status');s.innerHTML=html};
    var mailto=function(){
      var rows=[['Project type',val('type')],['Company',val('company')],['Budget',val('budget')],['Timeline',val('timeline')],['Link',val('link')]].filter(function(r){return r[1]}).map(function(r){return r[0]+': '+r[1]}).join('\n');
      var body=val('message')+(val('extra')?'\n\nAdditional requirements: '+val('extra'):'')+(rows?'\n\n'+rows:'')+'\n\n- '+val('name')+' ('+val('email')+')';
      return 'mailto:tahiraliaiml@gmail.com?subject='+encodeURIComponent('PCB project inquiry: '+val('type')+' - '+val('name'))+'&body='+encodeURIComponent(body);
    };
    var fail=function(){
      status('bad','Your message could not be sent. Nothing was lost: your details are still in the form. Please <a class="link" href="'+mailto()+'">open it in your email app</a>, write to <a class="link" href="mailto:tahiraliaiml@gmail.com">tahiraliaiml@gmail.com</a>, or message me on <a class="link" href="https://wa.me/923049037412" target="_blank" rel="noopener">WhatsApp</a>.',true);
    };
    f.addEventListener('submit',function(e){
      e.preventDefault();
      if(busy)return;
      if(val('_honey'))return;
      var bad=check();
      if(bad.length){status('bad','Please fix the highlighted fields and send again.',true);f.elements[bad[0]].focus();return}
      busy=true;btn.disabled=true;btn.textContent='Sending...';f.setAttribute('aria-busy','true');
      status('','Sending your message...',false);
      var payload={name:val('name'),email:val('email'),'Project type':val('type'),message:val('message'),Company:val('company')||'(not given)','Budget range':val('budget')||'(not given)',Timeline:val('timeline')||'(not given)','Project link':val('link')||'(none)','Additional requirements':val('extra')||'(none)',
        _subject:'New PCB project inquiry: '+val('type')+' from '+val('name'),_cc:'tahiralielectrical@gmail.com',_template:'table',_captcha:'false',_honey:''};
      var ctl=window.AbortController?new AbortController():null,to=setTimeout(function(){if(ctl)ctl.abort()},15000);
      fetch('https://formsubmit.co/ajax/tahiraliaiml@gmail.com',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload),signal:ctl?ctl.signal:undefined})
        .then(function(r){return r.json()})
        .then(function(d){
          if(d&&(d.success===true||d.success==='true')){var n=val('name');f.reset();status('good','Thank you, '+n.replace(/[<>&"]/g,'')+'. Your inquiry was sent. I usually reply within a day.',false)}
          else{fail()}
        })
        .catch(fail)
        .finally(function(){clearTimeout(to);busy=false;btn.disabled=false;btn.textContent='Send Project Inquiry';f.removeAttribute('aria-busy')});
    });
  }
  /* service links preselect the project type */
  [].forEach.call(document.querySelectorAll('[data-type]'),function(a){
    a.addEventListener('click',function(){var t=document.getElementById('type');if(!t)return;[].forEach.call(t.options,function(o){if(o.value===a.dataset.type||o.text===a.dataset.type)t.value=o.value})});
  });
  /* project filters */
  var fl=[].slice.call(document.querySelectorAll('.flt')),cards=[].slice.call(document.querySelectorAll('#pgrid .mini')),fc=document.getElementById('fcount');
  fl.forEach(function(b){
    b.addEventListener('click',function(){
      var k=b.dataset.f,n=0;
      fl.forEach(function(x){x.setAttribute('aria-pressed',x===b)});
      cards.forEach(function(c){var ok=k==='all'||(' '+c.dataset.cat+' ').indexOf(' '+k+' ')>-1;c.hidden=!ok;if(ok){n++;c.classList.add('in')}});
      if(fc)fc.textContent=k==='all'?'Showing all '+n+' projects':'Showing '+n+' of '+cards.length+' projects';
    });
  });
  /* lightbox */
  var dlg=null;
  var openLb=function(src,alt,opener){
    if(!dlg){
      dlg=document.createElement('dialog');dlg.className='lb';dlg.setAttribute('aria-label','Enlarged image');
      dlg.innerHTML='<div class="lb-in"><button type="button" aria-label="Close enlarged image">&times;</button><img alt=""><p></p></div>';
      document.body.appendChild(dlg);
      dlg.querySelector('button').addEventListener('click',function(){dlg.close()});
      dlg.addEventListener('click',function(e){if(e.target===dlg||e.target.classList.contains('lb-in'))dlg.close()});
      dlg.addEventListener('close',function(){if(dlg._op)dlg._op.focus()});
    }
    dlg._op=opener;dlg.querySelector('img').src=src;dlg.querySelector('img').alt=alt;dlg.querySelector('p').textContent=alt;
    if(dlg.showModal)dlg.showModal();else dlg.setAttribute('open','');
  };
  [].forEach.call(document.querySelectorAll('.ev img,.shot img,.pane img,.big img,.vid img'),function(im){
    if(im.closest('a[href$=".html"]'))return;
    var a=im.closest('a');
    im.setAttribute('data-zoom','');im.tabIndex=0;im.setAttribute('role','button');im.setAttribute('aria-label','Enlarge image: '+im.alt);
    var go=function(e){if(e)e.preventDefault();openLb(a&&a.href?a.href:im.currentSrc||im.src,im.alt,im)};
    im.addEventListener('click',go);
    im.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' ')go(e)});
  });
})();

/* scroll reveal */
(function(){
  var sel='.sec-head,.value-grid article,.svc article,.case,.mini,.skills>div,.ev figure,.rcard,.quote,.pkg,.form,.about-img,.cs-grid,.shot,.flow li,.list li';
  var els=[].slice.call(document.querySelectorAll(sel));
  if(!('IntersectionObserver' in window)){return}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
  els.forEach(function(el,i){el.classList.add('rv');el.style.transitionDelay=(i%4)*70+'ms';io.observe(el)});
})();

/* mobile floating CTA: hide while the contact form is on screen */
(function(){
  var fab=document.querySelector('.fab'),c=document.getElementById('contact');
  if(!fab||!c||!('IntersectionObserver' in window))return;
  new IntersectionObserver(function(es){fab.classList.toggle('off',es[0].isIntersecting)},{threshold:.15}).observe(c);
})();
