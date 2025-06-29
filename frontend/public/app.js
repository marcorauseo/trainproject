fetch('https://tuo-backend.onrender.com/api/tickets/routes')
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById('tratte');
    data.forEach(t => {
      const li = document.createElement('li');
      li.textContent = `${t.stazione_partenza} → ${t.stazione_arrivo} alle ${t.orario_partenza}`;
      list.appendChild(li);
    });
  });