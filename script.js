// Initialize particles.js for the interactive background
particlesJS("particles-js", {
    "particles": {
      "number": {
        "value": 80,
        "density": { "enable": true, "value_area": 800 }
      },
      "color": { "value": "#00ccff" },
      "shape": {
        "type": "circle",
        "stroke": { "width": 0, "color": "#000000" }
      },
      "opacity": { "value": 0.5, "random": false },
      "size": { "value": 3, "random": true },
      "line_linked": {
        "enable": true,
        "distance": 150,
        "color": "#00ccff",
        "opacity": 0.4,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 4,
        "direction": "none",
        "random": false,
        "straight": false,
        "out_mode": "out",
        "bounce": false
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": { "enable": true, "mode": "repulse" },
        "onclick": { "enable": true, "mode": "push" }
      },
      "modes": {
        "repulse": { "distance": 100, "duration": 0.4 },
        "push": { "particles_nb": 4 }
      }
    },
    "retina_detect": true
  });
  
  // Smooth keyword transition
  const phrases = ["Disseminating Alerts", "Autonomous","Public Safety", "Machine-Vision"];
  let index = 0;
  function changeKeyword() {
    const element = document.getElementById("keyword-text");
    element.style.opacity = 0;
    setTimeout(() => {
      element.innerText = phrases[index];
      element.style.opacity = 1;
      index = (index + 1) % phrases.length;
    }, 800);
  }
  changeKeyword();
  setInterval(changeKeyword, 3000);
  
  // IntersectionObserver for active nav underline
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-link");
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove("active"));
        const activeLink = document.querySelector(`a[href="#${entry.target.id}"]`);
        if (activeLink) {
          activeLink.classList.add("active");
        }
      }
    });
  }, { threshold: 0.6 });
  
  sections.forEach(section => observer.observe(section));
  
  // Initialize AOS for scroll animations
  AOS.init({ duration: 1000, once: true });
  