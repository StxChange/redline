document.addEventListener('DOMContentLoaded', ()=>{
  const vid = document.getElementById('heroVideo');
  const btn = document.getElementById('heroMute');
  if(!vid || !btn) return;

  function updateButton(){
    btn.textContent = vid.muted ? '🔇' : '🔊';
    btn.title = vid.muted ? 'Unmute' : 'Mute';
  }
  btn.addEventListener('click', ()=>{
    vid.muted = !vid.muted;
    // Try to play when unmuting (some browsers require a user gesture)
    if(!vid.muted){
      vid.play().catch(()=>{});
    }
    updateButton();
  });

  // initial state
  updateButton();

  // Show button after video is ready
  vid.addEventListener('loadedmetadata', ()=>{
    btn.style.display = 'block';
  });
  
  // Play/pause overlay for touch devices
  const playBtn = document.getElementById('heroPlay');
  if(playBtn){
    // reflect current state
    function updatePlay(){
      playBtn.textContent = vid.paused ? '▶' : '⏸';
    }
    playBtn.addEventListener('click', ()=>{
      if(vid.paused){
        vid.play().catch(()=>{});
      } else {
        vid.pause();
      }
      updatePlay();
    });

    // If autoplay was blocked and video is paused, show play button
    vid.addEventListener('play', ()=>{ updatePlay(); playBtn.style.display='none'; });
    vid.addEventListener('pause', ()=>{ updatePlay(); playBtn.style.display='block'; });

    // initial check: if video is paused after attempting autoplay, show play button
    setTimeout(()=>{
      if(vid.paused){ playBtn.style.display = 'block'; updatePlay(); }
    }, 500);
  }
});
