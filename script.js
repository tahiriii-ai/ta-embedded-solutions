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
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var v=function(id){return f.elements[id].value.trim()};
      var s=document.getElementById('formStatus'),btn=f.querySelector('button[type=submit]');
      var payload={name:v('name'),email:v('email'),'Project type':v('type'),message:v('message'),'File or project link':v('link')||'(none)',
        _subject:'New PCB project inquiry: '+v('type')+' from '+v('name'),_cc:'tahiralielectrical@gmail.com',_template:'table',_captcha:'false',_honey:''};
      var fallback=function(){
        var body='Project type: '+v('type')+'\n\n'+v('message')+(v('link')?'\n\nFiles / project link: '+v('link'):'')+'\n\n- '+v('name')+' ('+v('email')+')';
        if(s)s.innerHTML='Could not send automatically. Please email <a class="link" href="mailto:tahiraliaiml@gmail.com">tahiraliaiml@gmail.com</a> or call +92 304 9037412.';
        location.href='mailto:tahiraliaiml@gmail.com?cc=tahiralielectrical@gmail.com&subject='+encodeURIComponent('PCB project inquiry: '+v('type')+' - '+v('name'))+'&body='+encodeURIComponent(body);
      };
      if(btn){btn.disabled=true;btn.textContent='Sending...'}
      if(s)s.textContent='Sending your message...';
      fetch('https://formsubmit.co/ajax/tahiraliaiml@gmail.com',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload)})
        .then(function(r){return r.json()})
        .then(function(d){
          if(d&&(d.success===true||d.success==='true')){f.reset();if(s)s.textContent='Thank you! Your message was sent. I will reply to your email soon.'}
          else{fallback()}
        })
        .catch(fallback)
        .finally(function(){if(btn){btn.disabled=false;btn.textContent='Send project inquiry'}});
    });
  }
})();

/* scroll reveal */
(function(){
  var sel='.sec-head,.value-grid article,.svc article,.case,.mini,.skills>div,.ev figure,.rcard,.quote,.pkg,.form,.about-img,.cs-grid,.shot,.flow li,.list li';
  var els=[].slice.call(document.querySelectorAll(sel));
  if(!('IntersectionObserver' in window)){return}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
  els.forEach(function(el,i){el.classList.add('rv');el.style.transitionDelay=(i%4)*70+'ms';io.observe(el)});
})();
