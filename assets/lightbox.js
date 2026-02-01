document.addEventListener('DOMContentLoaded', ()=>{
  const triggers = Array.from(document.querySelectorAll('.lightbox-trigger'));
  if(!triggers.length) return;

  // Build overlay
  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.innerHTML = `
    <div class="lightbox-nav">
      <button class="lightbox-prev" aria-label="Previous">◀</button>
      <button class="lightbox-next" aria-label="Next">▶</button>
    </div>
    <div class="lightbox-content"><img src="" alt=""/></div>
    <button class="lightbox-close" aria-label="Close">✕</button>
  `;
  document.body.appendChild(overlay);

  const imgEl = overlay.querySelector('.lightbox-content img');
  const closeBtn = overlay.querySelector('.lightbox-close');
  const nextBtn = overlay.querySelector('.lightbox-next');
  const prevBtn = overlay.querySelector('.lightbox-prev');

  let currentIndex = -1;

  // Lazy-load helper: swap data-src/data-srcset into src/srcset when visible
  const lazyImages = Array.from(document.querySelectorAll('img.lazyload'));
  function loadImage(img){
    const ds = img.getAttribute('data-src');
    const dss = img.getAttribute('data-srcset');
    if(ds) img.src = ds;
    if(dss) img.srcset = dss;
    img.classList.remove('lazyload');
  }

  if('IntersectionObserver' in window && lazyImages.length){
    const observer = new IntersectionObserver((entries, obs)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          loadImage(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },{rootMargin:'200px 0px'});
    lazyImages.forEach(i=>observer.observe(i));
  } else {
    // Fallback: load immediately
    lazyImages.forEach(loadImage);
  }

  function openAt(i){
    const href = triggers[i].getAttribute('href');
    imgEl.src = href;
    imgEl.alt = triggers[i].querySelector('img')?.alt || '';
    overlay.classList.add('open');
    currentIndex = i;
  }
  function close(){ overlay.classList.remove('open'); imgEl.src=''; currentIndex=-1; }
  function next(){ if(currentIndex< triggers.length-1) openAt(currentIndex+1); }
  function prev(){ if(currentIndex>0) openAt(currentIndex-1); }

  triggers.forEach((t,i)=>{
    t.addEventListener('click', (e)=>{
      e.preventDefault();
      openAt(i);
    });
  });

  overlay.addEventListener('click', (e)=>{
    if(e.target === overlay || e.target === closeBtn) close();
  });
  closeBtn.addEventListener('click', close);
  nextBtn.addEventListener('click', (e)=>{ e.stopPropagation(); next(); });
  prevBtn.addEventListener('click', (e)=>{ e.stopPropagation(); prev(); });

  document.addEventListener('keydown', (e)=>{
    if(currentIndex === -1) return;
    if(e.key === 'Escape') close();
    if(e.key === 'ArrowRight') next();
    if(e.key === 'ArrowLeft') prev();
  });
});
