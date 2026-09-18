// ---------- mobile nav ----------
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  menuToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));

  document.getElementById('year').textContent = new Date().getFullYear();

  // ---------- service data (category -> issues with price range in INR) ----------
  const REPAIR_DATA = {
    "AC & Refrigerator": [
      {name:"Gas refill", min:1200, max:2200},
      {name:"Not cooling", min:800, max:1800},
      {name:"General service", min:499, max:699},
      {name:"Compressor issue", min:2500, max:6000}
    ],
    "Washing Machine": [
      {name:"Not draining", min:399, max:799},
      {name:"Motor / drum issue", min:900, max:2200},
      {name:"General service", min:349, max:599}
    ],
    "RO & Water Purifier": [
      {name:"Filter change", min:599, max:1200},
      {name:"Leakage fix", min:299, max:599},
      {name:"New installation", min:499, max:899}
    ],
    "Geyser & Water Heater": [
      {name:"No heating", min:399, max:899},
      {name:"Leakage", min:349, max:699},
      {name:"New installation", min:599, max:999}
    ],
    "Mobile / Laptop / TV": [
      {name:"Screen replacement", min:1499, max:7999},
      {name:"Battery replacement", min:899, max:2499},
      {name:"Software issue", min:299, max:599}
    ],
    "Kitchen Appliances": [
      {name:"Mixer / grinder repair", min:249, max:599},
      {name:"Microwave repair", min:399, max:1299},
      {name:"Chimney service", min:499, max:999}
    ],
    "Furniture & Modular": [
      {name:"Hinge / drawer repair", min:199, max:499},
      {name:"Wardrobe repair", min:399, max:999}
    ],
    "Fans & Electricals": [
      {name:"Fan repair", min:149, max:399},
      {name:"Switchboard / wiring", min:299, max:799}
    ]
  };

  const catSelect = document.getElementById('calcCategory');
  const issueSelect = document.getElementById('calcIssue');
  Object.keys(REPAIR_DATA).forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat; opt.textContent = cat;
    catSelect.appendChild(opt);
  });
  catSelect.addEventListener('change', () => {
    issueSelect.innerHTML = '';
    if (!catSelect.value) {
      issueSelect.disabled = true;
      issueSelect.innerHTML = '<option value="">Choose a category first</option>';
      return;
    }
    issueSelect.disabled = false;
    const placeholder = document.createElement('option');
    placeholder.value = ''; placeholder.textContent = 'Choose the issue';
    issueSelect.appendChild(placeholder);
    REPAIR_DATA[catSelect.value].forEach(issue => {
      const opt = document.createElement('option');
      opt.value = issue.name; opt.textContent = issue.name;
      issueSelect.appendChild(opt);
    });
  });

  document.getElementById('calcBtn').addEventListener('click', () => {
    const out = document.getElementById('calcOutput');
    const copy = document.getElementById('calcCopy');
    if (!catSelect.value || !issueSelect.value) {
      out.innerHTML = '<small>Estimated range</small>Pick both fields';
      copy.textContent = 'Choose a category and an issue to see the estimate.';
      return;
    }
    const issue = REPAIR_DATA[catSelect.value].find(i => i.name === issueSelect.value);
    out.innerHTML = '<small>Estimated range</small>₹' + issue.min.toLocaleString('en-IN') + ' – ₹' + issue.max.toLocaleString('en-IN');
    copy.textContent = 'Typical range for "' + issue.name + '" on ' + catSelect.value + '. Final price is confirmed after a free doorstep diagnosis — you approve it before any work starts.';
  });

  // ---------- service tabs filter ----------
  const tabButtons = document.querySelectorAll('.tab-btn');
  const serviceCards = document.querySelectorAll('.service-card');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
      const filter = btn.dataset.filter;
      serviceCards.forEach(card => {
        card.classList.toggle('hide', filter !== 'all' && card.dataset.group !== filter);
      });
    });
  });

  // ---------- pincode checker ----------
  const SERVICEABLE_PREFIXES = ['110','400','560','500','600','411','700','302','380','226'];
  document.getElementById('pinBtn').addEventListener('click', () => {
    const val = document.getElementById('pincode').value.trim();
    const result = document.getElementById('pinResult');
    result.classList.add('show');
    if (!/^\d{6}$/.test(val)) {
      result.className = 'pin-result mono show no';
      result.textContent = 'Enter a valid 6-digit pincode.';
      return;
    }
    const prefix = val.slice(0,3);
    if (SERVICEABLE_PREFIXES.includes(prefix)) {
      result.className = 'pin-result mono show yes';
      result.textContent = '✓ Yes, we currently service this area.';
    } else {
      result.className = 'pin-result mono show no';
      result.textContent = '✗ Not yet in this area — expanding soon. Book anyway and we\'ll confirm.';
    }
  });

  // ---------- animated stat counters ----------
  const counters = document.querySelectorAll('.count');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    if (reduceMotion) { el.textContent = target.toLocaleString('en-IN'); return; }
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();
    function tick(now){
      const progress = Math.min((now - startTime) / duration, 1);
      const value = Math.floor(progress * target);
      el.textContent = value.toLocaleString('en-IN');
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString('en-IN');
    }
    requestAnimationFrame(tick);
  };
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, {threshold: 0.5});
  counters.forEach(c => counterObserver.observe(c));

  // ---------- testimonial carousel ----------
  const track = document.getElementById('carTrack');
  const slides = document.querySelectorAll('.car-slide');
  const dotsWrap = document.getElementById('carDots');
  let current = 0;
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'car-dot';
    dot.setAttribute('aria-label', 'Go to review ' + (i+1));
    if (i === 0) dot.setAttribute('aria-current', 'true');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = dotsWrap.querySelectorAll('.car-dot');
  function goTo(i){
    current = (i + slides.length) % slides.length;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dots.forEach((d, idx) => d.toggleAttribute('aria-current', idx === current));
  }
  document.getElementById('carPrev').addEventListener('click', () => goTo(current - 1));
  document.getElementById('carNext').addEventListener('click', () => goTo(current + 1));

  // ---------- FAQ accordion ----------
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click', () => {
      const isOpen = item.dataset.open === 'true';
      document.querySelectorAll('.faq-item').forEach(other => {
        other.dataset.open = 'false';
        other.querySelector('.faq-a').style.maxHeight = null;
      });
      if (!isOpen) {
        item.dataset.open = 'true';
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  // ---------- booking form ----------
  const form = document.getElementById('workOrderForm');
  const confirmTicket = document.getElementById('confirmTicket');
  const confirmNum = document.getElementById('confirmNum');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const num = 'FM-' + Math.floor(2000 + Math.random() * 7999);
    confirmNum.textContent = '#' + num;
    form.style.display = 'none';
    confirmTicket.classList.add('show');
    confirmTicket.scrollIntoView({behavior:'smooth', block:'center'});
  });

  document.getElementById('waSend').addEventListener('click', () => {
    const name = document.getElementById('name').value || 'there';
    const contact = document.getElementById('contact').value || '';
    const category = document.getElementById('category').value || 'a repair';
    const issue = document.getElementById('issue').value || '';
    const pin = document.getElementById('pincodeForm').value || '';
    const msg = 'Hi FixMistri, I am ' + name + ' (' + contact + '). I need help with: ' + category + '. Issue: ' + issue + '. Pincode: ' + pin;
    window.open('https://wa.me/919812345678?text=' + encodeURIComponent(msg), '_blank');
  });
