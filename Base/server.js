const express = require("express");
const stripe = require("stripe")("TA_CLE_SECRETE");
const bodyParser = require("body-parser");

const app = express();

// ⚠️ IMPORTANT pour Stripe webhook
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Backend OK 🚀");
});

// route test
app.post("/create-checkout-session", async (req, res) => {
  res.json({ id: "test" });
});

// ⚠️ PORT OBLIGATOIRE POUR RENDER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

    await fetch("https://discord.com/api/webhooks/1490729575729336410/uSNaf5uG9GT6H-WkV_i1iyCERbTe4o30ye80p26VkH9iFRwJJ_DbChq7KzkKYIVF0jBc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `🟢 COMMANDE PAYÉE

👤 Nom: ${session.metadata.name}
📧 Email: ${session.customer_email}

📍 Adresse:
${session.metadata.address}, ${session.metadata.city} ${session.metadata.zip}

📦 Produits:
${items}

💰 Total: ${session.amount_total / 100}€`
      })
    });
  }

  res.sendStatus(200);
});