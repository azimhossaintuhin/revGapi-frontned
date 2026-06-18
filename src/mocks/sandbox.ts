export const PRESETS = [
  {
    name: "Happy Multilingual (German)",
    review: "Ich fand das Produkt so-lala, aber der Service war gut.",
  },
  {
    name: "Angry English",
    review: "Terrible experience. The order arrived late and the item was broken.",
  },
  {
    name: "Happy English",
    review: "Absolutely loved it! Fast delivery and amazing quality. Will buy again.",
  },
  {
    name: "Neutral English",
    review: "The product is okay. Nothing special but it works as described.",
  }
];

export const MOCK_USE_CASE_DATA = {
  product: {
    review: "Excelente sonido pero no incluye baterías para el control remoto.",
    language: "Spanish",
    translation: "Excellent sound but does not include batteries for the remote control.",
    sentiment: "neutral" as const,
    summary: "Good audio performance, remote power supply accessory missing.",
    pros: ["Excellent sound quality"],
    cons: ["Missing accessories (batteries)"],
    repeats: true,
    confidence: 0.88,
    replay: "Hola, gracias por tu reseña. Nos alegra saber que disfrutas del sonido. Lamentamos el inconveniente con las baterías — lo revisaremos y mejoraremos en futuros pedidos."
  },
  slack: {
    review: "Terrible! L'appareil chauffe trop et se déconnecte sans cesse.",
    language: "French",
    translation: "Terrible! The device gets too hot and disconnects constantly.",
    sentiment: "negative" as const,
    summary: "Severe hardware heating & connection instability.",
    pros: [],
    cons: ["Excessive thermal output", "Bluetooth disconnects"],
    repeats: false,
    confidence: 0.96,
    replay: "Bonjour, nous sommes désolés pour ce problème de surchauffe et de déconnexion. Notre équipe technique va vous contacter pour organiser un remplacement ou remboursement immédiat."
  },
  crm: {
    review: "Avoid this product! Customer support was rude and refused my return requests.",
    language: "English",
    translation: null,
    sentiment: "negative" as const,
    summary: "Customer support interaction refusal & return issues.",
    pros: [],
    cons: ["Rude customer support team", "Return request rejected"],
    repeats: false,
    confidence: 0.95,
    replay: "Hello, we sincerely apologize for your experience with our support team. We have escalated your ticket to our senior support manager to review your return request."
  }
};
