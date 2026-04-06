console.log("JS chargé");

let selectedSize = null; // 🔥 taille globale

document.addEventListener("DOMContentLoaded", () => {

  const cartIcon = document.querySelector('.cart');
  const cartDrawer = document.getElementById('cartDrawer');
  const closeCart = document.getElementById('closeCart');
  const overlay = document.getElementById('overlay');

  const cartItemsContainer = document.getElementById('cartItems');
  const cartCount = document.querySelector('.cart-count');
  const cartTotal = document.getElementById('cartTotal');

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // OUVRIR PANIER
  if (cartIcon) {
    cartIcon.addEventListener('click', () => {
      cartDrawer.classList.add('active');
      overlay.classList.add('show');
    });
  }

  // FERMER
  function closeCartDrawer() {
    cartDrawer.classList.remove('active');
    overlay.classList.remove('show');
  }

  if (closeCart) closeCart.addEventListener('click', closeCartDrawer);
  if (overlay) overlay.addEventListener('click', closeCartDrawer);

  // AJOUT PRODUIT
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {

      const name = button.dataset.name;
      const price = parseFloat(button.dataset.price);
      const img = button.dataset.img;

      // 🔥 vérifie taille
      if (!selectedSize) {
        alert("Choisis une taille !");
        return;
      }

      cart.push({ name, price, img, quantity: 1, size: selectedSize });

      saveCart();
      updateCart();
    });
  });

  // SAUVEGARDE
  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // PANIER
  function updateCart() {
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {

      if (!item.quantity) item.quantity = 1;

      total += item.price * item.quantity;

      cartItemsContainer.innerHTML += `
        <div class="cart-item">
          <img src="${item.img}">
          <div>
            <p>${item.name}</p>
            <small>${item.price}€</small><br>
            <small>Taille: ${item.size}</small>

            <div class="qty-controls">
              <button onclick="decreaseQty(${index})">-</button>
              <span>${item.quantity}</span>
              <button onclick="increaseQty(${index})">+</button>

              <button class="remove-btn" onclick="removeItem(${index})">
                ❌
              </button>
            </div>
          </div>
        </div>
      `;
    });

    if (cartCount) cartCount.textContent = cart.length;
    if (cartTotal) cartTotal.textContent = total.toFixed(2) + "€";

    saveCart();
  }

  // QUANTITÉ
  window.increaseQty = function(index) {
    cart[index].quantity++;
    updateCart();
  };

  window.decreaseQty = function(index) {
    if (cart[index].quantity > 1) {
      cart[index].quantity--;
    } else {
      cart.splice(index, 1);
    }
    updateCart();
  };

  window.removeItem = function(index) {
    cart.splice(index, 1);
    updateCart();
  };

  updateCart();
});

// 🔥 IMAGE PRODUIT
window.changeImage = function(element) {
  document.getElementById("mainImage").src = element.src;
};

// 🔥 SÉLECTION TAILLE
window.selectSize = function(button) {

  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  button.classList.add('active');

  selectedSize = button.textContent;

  console.log("Taille sélectionnée :", selectedSize);
};

// 🔥 CHARGER CHECKOUT
function loadCheckout() {

  const container = document.getElementById("checkoutItems");
  const totalEl = document.getElementById("checkoutTotal");

  if (!container) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let total = 0;
  container.innerHTML = "";

  cart.forEach(item => {

    if (!item.quantity) item.quantity = 1;

    total += item.price * item.quantity;

    container.innerHTML += `
      <div class="checkout-item">
        <img src="${item.img}">
        <div>
          <p>${item.name}</p>
          <small>${item.price}€ x ${item.quantity}</small><br>
          <small>Taille: ${item.size}</small>
        </div>
      </div>
    `;
  });

  totalEl.textContent = total.toFixed(2) + "€";
}

// 🔥 COMMANDER


// AUTO LOAD
document.addEventListener("DOMContentLoaded", loadCheckout);



// 🔥 COMMANDER + ENVOI DISCORD EMBED
async function checkout() {

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const address = document.getElementById("address").value;
  const city = document.getElementById("city").value;
  const zip = document.getElementById("zip").value;

  if (!name || !email || !address || !city || !zip) {
    alert("Remplis toutes les infos !");
    return;
  }

  // 🔥 construire liste produits
  let items = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;

    items += `• ${item.name}
Taille: ${item.size}
${item.price}€ x ${item.quantity}

`;
  });

  // 🔥 ENVOI DISCORD EMBED
  await fetch("https://discord.com/api/webhooks/1490707823640711188/J-Pfvo8XG9TRWY6wRuVIJ9K7bSoWi3dF41H41JNGvcUk7fuXR1-vn0nwF1VgpkzVH5DO", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      embeds: [
        {
          title: "🟢 Nouvelle commande",
          color: 65280,

          fields: [
            {
              name: "👤 Client",
              value: `${name}\n${email}`,
              inline: false
            },
            {
              name: "📍 Livraison",
              value: `${address}\n${city} ${zip}`,
              inline: false
            },
            {
              name: "📦 Produits",
              value: items || "Aucun",
              inline: false
            },
            {
              name: "💰 Total",
              value: `${total.toFixed(2)}€`,
              inline: false
            }
          ],

          footer: {
            text: "Mon Maillot de Foot"
          },

          timestamp: new Date()
        }
      ]
    })
  });

  alert("Commande envoyée ✅");

  localStorage.removeItem("cart");

  window.location.href = "Index.html";
}

async function sendContact() {

  const name = document.getElementById("contactName").value;
  const email = document.getElementById("contactEmail").value;
  const message = document.getElementById("contactMessage").value;

  if (!name || !email || !message) {
    alert("Remplis tous les champs !");
    return;
  }

  await fetch("https://discord.com/api/webhooks/1490787622983958659/9D07kLw5zOcSkEDlH_wdY0JZW9DHLeO19ody88wxR7XIkcMhCQhhP3sHA2yvcSYFGFKW", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      embeds: [
        {
          title: "📩 Nouveau message contact",
          color: 16753920,
          fields: [
            { name: "👤 Nom", value: name },
            { name: "📧 Email", value: email },
            { name: "💬 Message", value: message }
          ],
          timestamp: new Date()
        }
      ]
    })
  });

  alert("Message envoyé ✅");

  document.getElementById("contactName").value = "";
  document.getElementById("contactEmail").value = "";
  document.getElementById("contactMessage").value = "";
}