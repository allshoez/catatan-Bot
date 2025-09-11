// ===== Load data =====
if (localStorage.getItem("botRules")) {
  try {
    botRules = JSON.parse(localStorage.getItem("botRules"));
    botRules.forEach(rule => {
      if (!Array.isArray(rule.Jawab)) rule.Jawab = [rule.Jawab];
    });
  } catch(e) {
    console.warn("Gagal load data dari LocalStorage, pakai default botdata.js");
  }
}

// ===== Cari jawaban =====
function cariJawaban(input) {
  input = input.toLowerCase().trim();

  // 1️⃣ Exact match dulu
  for (let rule of botRules) {
    for (let t of rule.Tanya) {
      if (input === t.toLowerCase().trim()) {
        return rule.Jawab[Math.floor(Math.random() * rule.Jawab.length)];
      }
    }
  }

  // 2️⃣ Partial match
  const sortedRules = [...botRules].sort((a,b) => b.Tanya[0].length - a.Tanya[0].length);
  for (let rule of sortedRules) {
    for (let t of rule.Tanya) {
      if (input.includes(t.toLowerCase().trim())) {
        return rule.Jawab[Math.floor(Math.random() * rule.Jawab.length)];
      }
    }
  }

  return null;
}

// ===== Variabel =====
let pertanyaanPending = "";
let ruleSedangEdit = null;

// ===== Kirim pesan =====
function kirimPesan() {
  const input = document.getElementById("userInput");
  const pesan = input.value.trim();
  if (!pesan) return;

  tampilkanPesan(pesan, "user");

  let jawaban = cariJawaban(pesan);
  if (jawaban) {
    setTimeout(() => tampilkanPesan(jawaban, "bot"), 600);
  } else {
    pertanyaanPending = pesan;
    document.getElementById("pertanyaanBaru").textContent = `"${pesan}"`;
    document.getElementById("inputJawabanBaru").value = "";
    document.getElementById("modalJawab").style.display = "flex";
  }

  input.value = "";
}

// ===== Tampilkan pesan =====
function tampilkanPesan(teks, tipe) {
  const chatBox = document.getElementById("chatBox");
  const bubble = document.createElement("div");
  bubble.classList.add("bubble", tipe);
  bubble.style.fontFamily = '"Segoe UI Emoji", "Noto Color Emoji", "Apple Color Emoji", sans-serif';
  bubble.innerText = teks;

  const copyBtn = document.createElement("button");
  copyBtn.className = "copy-btn";
  copyBtn.textContent = "\uD83D\uDCCB"; // 📋
  copyBtn.onclick = () => {
    navigator.clipboard.writeText(teks).then(() => alert("Teks berhasil dicopy!"));
  };
  bubble.appendChild(copyBtn);

  chatBox.appendChild(bubble);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// ===== Modal jawaban baru =====
function tutupModal() {
  document.getElementById("modalJawab").style.display = "none";
  pertanyaanPending = "";
}

function simpanJawabanBaru() {
  const jawabanUser = document.getElementById("inputJawabanBaru").value.trim();
  if (!jawabanUser) return alert("Tulis jawaban dulu bro \u2705"); // ✅

  let ruleAda = botRules.find(rule =>
    rule.Tanya.some(t => t.toLowerCase() === pertanyaanPending.toLowerCase())
  );

  if (ruleAda) {
    if (!ruleAda.Jawab.includes(jawabanUser)) {
      ruleAda.Jawab.push(jawabanUser);
      tampilkanPesan("Jawaban ditambahkan ke rule yang ada \u2705", "bot");
    } else {
      tampilkanPesan("Jawaban sudah ada \u2705", "bot");
    }
  } else {
    botRules.push({ Tanya: [pertanyaanPending], Jawab: [jawabanUser] });
    tampilkanPesan("Rule baru berhasil dibuat \u2705", "bot");
  }

  localStorage.setItem("botRules", JSON.stringify(botRules));
  tutupModal();
}

// ===== Modal edit jawaban =====
function bukaModalEdit(pertanyaan) {
  ruleSedangEdit = botRules.find(rule =>
    rule.Tanya.some(t => t.toLowerCase() === pertanyaan.toLowerCase())
  );
  if (!ruleSedangEdit) return;

  document.getElementById("pertanyaanEdit").innerText = pertanyaan;
  renderListJawaban();
  document.getElementById("modalEditJawab").style.display = "flex";
}

function renderListJawaban() {
  const list = document.getElementById("listJawaban");
  list.innerHTML = "";
  ruleSedangEdit.Jawab.forEach((jawaban, idx) => {
    const li = document.createElement("li");
    li.style.marginBottom = "5px";
    li.innerText = jawaban;

    const hapusBtn = document.createElement("button");
    hapusBtn.innerText = "\u274C"; // ❌
    hapusBtn.style.marginLeft = "10px";
    hapusBtn.onclick = () => {
      ruleSedangEdit.Jawab.splice(idx, 1);
      localStorage.setItem("botRules", JSON.stringify(botRules));
      renderListJawaban();
    };

    li.appendChild(hapusBtn);
    list.appendChild(li);
  });
}

function tambahJawabanEdit() {
  const val = document.getElementById("inputJawabanEdit").value.trim();
  if (!val) return alert("Tulis jawaban dulu bro \u2705");

  if (!ruleSedangEdit.Jawab.includes(val)) {
    ruleSedangEdit.Jawab.push(val);
    localStorage.setItem("botRules", JSON.stringify(botRules));
    document.getElementById("inputJawabanEdit").value = "";
    renderListJawaban();
  } else {
    alert("Jawaban sudah ada \u2705");
  }
}

function tutupModalEdit() {
  document.getElementById("modalEditJawab").style.display = "none";
  ruleSedangEdit = null;
}

// ===== Download & Upload =====
function downloadData() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(botRules, null, 2));
  const dlAnchor = document.createElement("a");
  dlAnchor.setAttribute("href", dataStr);
  dlAnchor.setAttribute("download", "botdata.json");
  dlAnchor.click();
  toggleMenu();
}

function uploadData(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      botRules = JSON.parse(e.target.result);
      botRules.forEach(rule => {
        if (!Array.isArray(rule.Jawab)) rule.Jawab = [rule.Jawab];
      });
      localStorage.setItem("botRules", JSON.stringify(botRules));
      alert("Data bot berhasil di-upload!");
      document.getElementById("editor").value = JSON.stringify(botRules, null, 2);
    } catch (err) {
      alert("Format JSON tidak valid!");
    }
  };
  reader.readAsText(file);
}

// ===== Switch editor =====
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

function saveEditedData() {
  try {
    const newData = JSON.parse(document.getElementById("editor").value);
    newData.forEach(rule => {
      if (!Array.isArray(rule.Jawab)) rule.Jawab = [rule.Jawab];
    });
    botRules = newData;
    localStorage.setItem("botRules", JSON.stringify(botRules));
    alert("Data bot berhasil diperbarui dan disimpan!");
  } catch (err) {
    alert("JSON salah format!");
  }
}

// ===== Popup menu =====
function toggleMenu() {
  document.getElementById("menuPopup").classList.toggle("show");
}

document.addEventListener("click", function(event) {
  const menu = document.getElementById("menuPopup");
  const tombol = event.target.closest("header span"); 
  if (!tombol && !menu.contains(event.target)) {
    menu.classList.remove("show");
  }
});