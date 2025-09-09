// Load data dari LocalStorage
if (localStorage.getItem("botRules")) {
  try {
    botRules = JSON.parse(localStorage.getItem("botRules"));
  } catch(e) {
    console.warn("Gagal load data dari LocalStorage, pakai default botdata.js");
  }
}

// Cari jawaban
function cariJawaban(input) {
  input = input.toLowerCase();
  for (let rule of botRules) {
    for (let t of rule.Tanya) {
      if (input.includes(t.toLowerCase())) {
        if (Array.isArray(rule.Jawab)) {
          return rule.Jawab[Math.floor(Math.random() * rule.Jawab.length)];
        } else {
          return rule.Jawab;
        }
      }
    }
  }
  return null; // Tidak ada jawaban
}

// Variabel pertanyaan baru
let pertanyaanPending = "";

// Kirim pesan
function kirimPesan() {
  const input = document.getElementById("userInput");
  const pesan = input.value.trim();
  if (!pesan) return;

  tampilkanPesan(pesan, "user");

  let jawaban = cariJawaban(pesan);
  if (jawaban) {
    setTimeout(() => tampilkanPesan(jawaban, "bot"), 600);
  } else {
    // Tampilkan modal minta jawaban baru
    pertanyaanPending = pesan;
    document.getElementById("pertanyaanBaru").textContent = `"${pesan}"`;
    document.getElementById("inputJawabanBaru").value = "";
    document.getElementById("modalJawab").style.display = "flex";
  }

  input.value = "";
}

// Tampilkan pesan
function tampilkanPesan(teks, tipe) {
  const chatBox = document.getElementById("chatBox");
  const bubble = document.createElement("div");
  bubble.classList.add("bubble", tipe);
  bubble.textContent = teks;

  // Tombol copy
  const copyBtn = document.createElement("button");
  copyBtn.className = "copy-btn";
  copyBtn.textContent = "📋";
  copyBtn.onclick = () => {
    navigator.clipboard.writeText(teks).then(() => alert("Teks berhasil dicopy!"));
  };
  bubble.appendChild(copyBtn);

  chatBox.appendChild(bubble);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Popup menu
function toggleMenu() {
  document.getElementById("menuPopup").classList.toggle("show");
}

// Tutup popup kalau klik di luar
document.addEventListener("click", function(event) {
  const menu = document.getElementById("menuPopup");
  const tombol = event.target.closest("header span"); // span 3 titik
  if (!tombol && !menu.contains(event.target)) {
    menu.classList.remove("show");
  }
});

// Download data
function downloadData() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(botRules, null, 2));
  const dlAnchor = document.createElement("a");
  dlAnchor.setAttribute("href", dataStr);
  dlAnchor.setAttribute("download", "botdata.json");
  dlAnchor.click();
  toggleMenu();
}

// Upload data
function uploadData(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      botRules = JSON.parse(e.target.result);
      localStorage.setItem("botRules", JSON.stringify(botRules));
      alert("Data bot berhasil di-upload!");
      document.getElementById("editor").value = JSON.stringify(botRules, null, 2);
    } catch (err) {
      alert("Format JSON tidak valid!");
    }
  };
  reader.readAsText(file);
}

// Edit data switcher
function switchMode() {
  const chat = document.getElementById("chatSection");
  const editor = document.getElementById("editSection");
  if (chat.style.display === "none") {
    chat.style.display = "block";
    editor.style.display = "none";
  } else {
    chat.style.display = "none";
    editor.style.display = "block";
    document.getElementById("editor").value = JSON.stringify(botRules, null, 2);
  }
  toggleMenu();
}

// Simpan hasil edit
function saveEditedData() {
  try {
    const newData = JSON.parse(document.getElementById("editor").value);
    botRules = newData;
    localStorage.setItem("botRules", JSON.stringify(botRules));
    alert("Data bot berhasil diperbarui dan disimpan!");
  } catch (err) {
    alert("JSON salah format!");
  }
}

// Modal jawaban baru
function tutupModal() {
  document.getElementById("modalJawab").style.display = "none";
  pertanyaanPending = "";
}

function simpanJawabanBaru() {
  const jawabanUser = document.getElementById("inputJawabanBaru").value.trim();
  if (!jawabanUser) {
    alert("Tulis jawaban dulu bro 😅");
    return;
  }
  // Simpan ke rules
  botRules.push({ Tanya: [pertanyaanPending], Jawab: [jawabanUser] });
  localStorage.setItem("botRules", JSON.stringify(botRules));
  tampilkanPesan("Jawaban baru berhasil disimpan ✅", "bot");
  tutupModal();
}