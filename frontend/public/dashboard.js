(async ()=>{
  const res = await fetch('/api/public/timetable');
  const data = await res.json();
  const ul = document.getElementById('listaTratte');
  data.forEach(t=>{
    const li=document.createElement('li');
    li.textContent = `${t.stazione_partenza} → ${t.stazione_arrivo}  ${t.orario_partenza}`;
    const btn=document.createElement('button');
    btn.textContent='Compra';
    btn.onclick = async ()=>{
      const token = localStorage.getItem('token');
      if(!token){ alert('Effettua il login'); return; }
      const r = await fetch('/api/tickets/buy',{
        method:'POST',
        headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},
        body:JSON.stringify({tratta_id:t.id, posto:'AUTO'})
      });
      if(r.ok) alert('Biglietto acquistato!');
      else alert('Errore acquisto');
    };
    li.appendChild(btn);
    ul.appendChild(li);
  });
})();
