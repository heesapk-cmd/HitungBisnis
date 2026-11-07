const pages = document.querySelectorAll(".page");
const nav = document.getElementById("navMenu");
const menuToggle = document.getElementById("menuToggle");

function showTool(id){
  pages.forEach(p => p.classList.toggle("active", p.id === id));
  nav.classList.remove("open");
  window.scrollTo({top:0, behavior:"smooth"});
}
document.querySelectorAll("[data-tool]").forEach(el=>{
  el.addEventListener("click", e=>{
    e.preventDefault();
    showTool(el.dataset.tool);
  });
});
menuToggle.addEventListener("click",()=>nav.classList.toggle("open"));
document.getElementById("year").textContent = new Date().getFullYear();

const rupiah = n => new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n);
const num = id => Number(document.getElementById(id).value);
function result(id, html){const el=document.getElementById(id);el.innerHTML=html;el.classList.add("show");}

document.getElementById("hjCalc").onclick=()=>{
  const modal = num("hjModal");
  const p = num("hjProfit");
  const method = document.getElementById("hjMethod").value;

  if(
    modal < 0 ||
    p < 0 ||
    !Number.isFinite(modal) ||
    !Number.isFinite(p)
  ){
    return alert("Masukkan angka yang valid.");
  }

  let jual;
  let profit;

  if(method === "markup"){
    // Markup dihitung dari modal/HPP
    profit = modal * p / 100;
    jual = modal + profit;
  }else{
    // Margin dihitung dari harga jual
    if(p >= 100){
      return alert("Margin harus kurang dari 100%.");
    }

    jual = modal / (1 - p / 100);
    profit = jual - modal;
  }
  jual = Math.ceil(jual / 500) * 500;
  profit = jual - modal;

  const namaMetode = method === "markup" ? "Markup" : "Margin";

  result(
    "hjResult",
    `
      <div class="label">Harga jual yang disarankan</div>

      <div class="main-value">
        ${rupiah(jual)}
      </div>

      <div class="line">
        <span>Metode</span>
        <b>${namaMetode}</b>
      </div>

      <div class="line">
        <span>Keuntungan</span>
        <b>${rupiah(profit)}</b>
      </div>
    `
  );
};

// =========================
// HPP - BIAYA DINAMIS
// =========================

const costList = document.getElementById("costList");
const addCost = document.getElementById("addCost");

// Tambah baris biaya
addCost.addEventListener("click", () => {

  const row = document.createElement("div");

  row.className = "cost-row";

  row.innerHTML = `
    <input
      type="text"
      class="cost-name"
      placeholder="Contoh: Ongkir"
    >

    <input
      type="number"
      class="cost-value"
      min="0"
      step="any"
      placeholder="500000"
    >

    <button
      type="button"
      class="remove-cost"
      title="Hapus biaya"
    >
      ×
    </button>
  `;

  costList.appendChild(row);

  updateRemoveButtons();
});


// Hapus baris biaya
function updateRemoveButtons(){

  document.querySelectorAll(".remove-cost").forEach(button => {

    button.onclick = () => {

      const rows = document.querySelectorAll(".cost-row");

      // Minimal harus tersisa satu baris
      if(rows.length <= 1){
        alert("Minimal harus ada satu biaya.");
        return;
      }

      button.parentElement.remove();

    };

  });

}


// Aktifkan tombol hapus pertama
updateRemoveButtons();


// Hitung HPP
document.getElementById("hppCalc").onclick = () => {

  const qty = num("hppQty");

  if(
    qty <= 0 ||
    !Number.isFinite(qty)
  ){

    return alert("Masukkan jumlah produk yang valid.");

  }


  const rows = document.querySelectorAll(".cost-row");

  let totalBiaya = 0;

  let biayaTerisi = 0;


  rows.forEach(row => {

    const valueInput = row.querySelector(".cost-value");

    const value = Number(valueInput.value);

    if(
      Number.isFinite(value) &&
      value > 0
    ){

      totalBiaya += value;

      biayaTerisi++;

    }

  });


  if(biayaTerisi === 0){

    return alert("Masukkan minimal satu biaya.");

  }


  const hpp = totalBiaya / qty;


  result(
    "hppResult",
    `
      <div class="label">
        HPP per unit
      </div>

      <div class="main-value">
        ${rupiah(hpp)}
      </div>

      <div class="line">
        <span>Total biaya</span>
        <b>${rupiah(totalBiaya)}</b>
      </div>

      <div class="line">
        <span>Jumlah produk</span>
        <b>${qty.toLocaleString("id-ID")}</b>
      </div>
    `
  );

};

document.getElementById("mmCalc").onclick=()=>{

  const modal = num("mmModal");
  const jual = num("mmJual");

  if(
    modal < 0 ||
    jual <= 0 ||
    !Number.isFinite(modal) ||
    !Number.isFinite(jual)
  ){
    return alert("Masukkan angka yang valid.");
  }

  const profit = jual - modal;

  const margin = (profit / jual) * 100;

  const markup = modal === 0
    ? 0
    : (profit / modal) * 100;

  result(
    "mmResult",
    `
      <div class="label">
        Keuntungan per unit
      </div>

      <div class="main-value">
        ${rupiah(profit)}
      </div>

      <div class="line">
        <span>Margin</span>
        <b>${margin.toFixed(2)}%</b>
      </div>

      <div class="line">
        <span>Markup</span>
        <b>${markup.toFixed(2)}%</b>
      </div>
    `
  );

};

document.getElementById("dkCalc").onclick=()=>{

  const harga = num("dkHarga");
  const p = num("dkPersen");

  if(
    harga < 0 ||
    p < 0 ||
    p > 100 ||
    !Number.isFinite(harga) ||
    !Number.isFinite(p)
  ){
    return alert("Diskon harus antara 0% dan 100%.");
  }

  const potongan = harga * p / 100;

  const hargaAkhir = harga - potongan;

  result(
    "dkResult",
    `
      <div class="label">
        Harga setelah diskon
      </div>

      <div class="main-value">
        ${rupiah(hargaAkhir)}
      </div>

      <div class="line">
        <span>Harga awal</span>
        <b>${rupiah(harga)}</b>
      </div>

      <div class="line">
        <span>Potongan</span>
        <b>${rupiah(potongan)}</b>
      </div>

      <div class="line">
        <span>Diskon</span>
        <b>${p}%</b>
      </div>
    `
  );

};

document.getElementById("bepCalc").onclick=()=>{

  const tetap = num("bepTetap");
  const jual = num("bepJual");
  const variabel = num("bepVariabel");

  if(
    tetap < 0 ||
    jual <= 0 ||
    variabel < 0 ||
    !Number.isFinite(tetap) ||
    !Number.isFinite(jual) ||
    !Number.isFinite(variabel)
  ){
    return alert("Masukkan semua angka dengan benar.");
  }

  const marginKontribusi = jual - variabel;

  if(marginKontribusi <= 0){
    return alert(
      "Harga jual harus lebih besar daripada biaya variabel."
    );
  }

  const bepUnit = tetap / marginKontribusi;

  const bepUnitBulat = Math.ceil(bepUnit);

  const bepOmzet = bepUnitBulat * jual;

  result(
    "bepResult",
    `
      <div class="label">
        Minimal penjualan untuk BEP
      </div>

      <div class="main-value">
        ${bepUnitBulat.toLocaleString("id-ID")} unit
      </div>

      <div class="line">
        <span>BEP omzet</span>
        <b>${rupiah(bepOmzet)}</b>
      </div>

      <div class="line">
        <span>Sisa untuk menutup biaya tetap</span>
        <b>${rupiah(marginKontribusi)}</b>
      </div>

      <div class="line">
        <span>Total biaya tetap per bulan</span>
        <b>${rupiah(tetap)}</b>
      </div>
    `
  );

};
