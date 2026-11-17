document.addEventListener("DOMContentLoaded", function () {
  // 1. Tahun Dinamis pada Footer
  const tahunSpan = document.getElementById("tahunSekarang");
  if (tahunSpan) {
    tahunSpan.textContent = new Date().getFullYear();
  }

  // 2. Efek Bayangan Navbar saat Halaman Di-scroll
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", function () {
    if (navbar) {
      if (window.scrollY > 20) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    }
  });

  // 3. Toggle Menu Navigasi Mobile (Hamburger)
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", function () {
      const isOpen = navMenu.classList.toggle("active");
      menuToggle.classList.toggle("open", isOpen);
      menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    const navLinks = navMenu.querySelectorAll("a");
    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        navMenu.classList.remove("active");
        menuToggle.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // 4. Animasi Muncul Bertahap (Scroll Reveal)
  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  // 5. Tombol Layanan Otomatis Memilih Dropdown Form (Perumahan / Sekolah)
  const serviceButtons = document.querySelectorAll(".btn-service");
  const layananSelect = document.getElementById("layananSelect");
  const kontakSection = document.getElementById("kontak");

  serviceButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const layananDipilih = button.getAttribute("data-service");
      if (layananSelect && layananDipilih) {
        layananSelect.value = layananDipilih;
      }
      if (kontakSection) {
        kontakSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // 6. Kirim Formulir Penawaran ke WhatsApp Perusahaan (+62 882-7177-2818)
  const quoteForm = document.getElementById("quoteForm");
  const formMessage = document.getElementById("formMessage");

  if (quoteForm) {
    quoteForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const nama = document.getElementById("nama").value.trim();
      const instansi = document.getElementById("instansi").value.trim();
      const telepon = document.getElementById("telepon").value.trim();
      const jumlah = document.getElementById("jumlah").value.trim();
      const layanan = document.getElementById("layananSelect").value;
      const catatan = document.getElementById("catatan").value.trim();

      const nomorAdminWA = "6288271772818";
      const pesanWA =
        "Halo *PT. ASBHARA GLOBAL SAKTI (Global Security)*,\n\n" +
        "Saya ingin mengajukan permintaan penawaran jasa Satpam:\n" +
        "• *Nama:* " + nama + "\n" +
        "• *Nama Perumahan/Sekolah:* " + instansi + "\n" +
        "• *No. WhatsApp:* " + telepon + "\n" +
        "• *Jenis Layanan:* " + layanan + "\n" +
        "• *Jumlah Personel:* " + jumlah + " Orang\n" +
        (catatan ? "• *Catatan/Lokasi:* " + catatan + "\n" : "") +
        "\nMohon informasi rincian penawaran dan jadwal survei lokasi. Terima kasih.";

      const urlWhatsApp = "https://wa.me/" + nomorAdminWA + "?text=" + encodeURIComponent(pesanWA);

      if (formMessage) {
        formMessage.textContent = "Membuka WhatsApp PT. Asbhara Global Sakti...";
      }

      window.open(urlWhatsApp, "_blank");
    });
  }

  // 7. Filter Kategori & Lightbox 10 Foto Kegiatan (Dukung Klik, Keyboard & Swipe HP)
  const filterButtons = document.querySelectorAll(".filter-btn");
  const galleryCards = Array.from(document.querySelectorAll(".gallery-card"));
  const photoModal = document.getElementById("photoModal");
  const modalImage = document.getElementById("modalImage");
  const modalCaption = document.getElementById("modalCaption");
  const modalCounter = document.getElementById("modalCounter");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const prevPhotoBtn = document.getElementById("prevPhotoBtn");
  const nextPhotoBtn = document.getElementById("nextPhotoBtn");
  const modalSwipeArea = document.getElementById("modalSwipeArea");

  let activeIndex = 0;

  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterButtons.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");
      galleryCards.forEach(function (card) {
        const category = card.getAttribute("data-category");
        if (filter === "all" || category === filter) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });

  function tampilkanFotoModal(index) {
    const visibleCards = galleryCards.filter(function (c) {
      return !c.classList.contains("hidden");
    });
    if (visibleCards.length === 0) return;

    if (index < 0) index = visibleCards.length - 1;
    if (index >= visibleCards.length) index = 0;
    activeIndex = index;

    const card = visibleCards[activeIndex];
    const img = card.querySelector("img");
    const caption = card.getAttribute("data-caption");

    if (img && modalImage && modalCaption) {
      modalImage.src = img.src;
      modalCaption.textContent = caption || img.alt;
      if (modalCounter) {
        modalCounter.textContent = (activeIndex + 1) + " / " + visibleCards.length;
      }
    }
  }

  if (photoModal && modalImage && modalCaption) {
    galleryCards.forEach(function (card) {
      card.addEventListener("click", function () {
        const visibleCards = galleryCards.filter(function (c) {
          return !c.classList.contains("hidden");
        });
        const idx = visibleCards.indexOf(card);
        tampilkanFotoModal(idx >= 0 ? idx : 0);
        photoModal.classList.add("open");
        photoModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
      });
    });

    if (prevPhotoBtn) {
      prevPhotoBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        tampilkanFotoModal(activeIndex - 1);
      });
    }

    if (nextPhotoBtn) {
      nextPhotoBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        tampilkanFotoModal(activeIndex + 1);
      });
    }

    function tutupModal() {
      photoModal.classList.remove("open");
      photoModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    if (closeModalBtn) {
      closeModalBtn.addEventListener("click", tutupModal);
    }

    photoModal.addEventListener("click", function (e) {
      if (e.target === photoModal) {
        tutupModal();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (!photoModal.classList.contains("open")) return;
      if (e.key === "Escape") tutupModal();
      if (e.key === "ArrowLeft") tampilkanFotoModal(activeIndex - 1);
      if (e.key === "ArrowRight") tampilkanFotoModal(activeIndex + 1);
    });

    // Dukungan geser jari (Swipe) di layar HP
    let touchStartX = 0;
    if (modalSwipeArea) {
      modalSwipeArea.addEventListener("touchstart", function (e) {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      modalSwipeArea.addEventListener("touchend", function (e) {
        const touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 40) {
          if (diff > 0) {
            tampilkanFotoModal(activeIndex + 1);
          } else {
            tampilkanFotoModal(activeIndex - 1);
          }
        }
      }, { passive: true });
    }
  }
});