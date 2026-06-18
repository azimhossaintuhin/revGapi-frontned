export interface MockReviewResponse {
  id: string;
  productName: string;
  category: string;
  rating: number;
  tone: string;
  title: string;
  content: string;
  sentiment: "positive" | "neutral" | "negative";
  reviewer: {
    name: string;
    avatar: string;
    verifiedPurchase: boolean;
  };
  metadata: {
    tokensUsed: number;
    latencyMs: number;
    model: string;
    timestamp: string;
  };
}

export interface MockAnalysisResponse {
  feedback_language: string;
  translation: string | null;
  sentiment: "positive" | "neutral" | "negative";
  summary: string;
  pros: string[];
  cons: string[];
  action_items: string[];
  suggestions: string[];
  customer_repeats: boolean;
  confidence_score: number;
  replay: string;
  metadata: {
    tokensUsed: number;
    latencyMs: number;
    model: string;
    timestamp: string;
  };
}

const REVIEWERS = [
  { name: "Robert Taylor", avatar: "RT" },
  { name: "Alex Rivera", avatar: "AR" },
  { name: "David Chen", avatar: "DC" },
  { name: "Emily Watson", avatar: "EW" },
  { name: "Marcus Thompson", avatar: "MT" },
  { name: "Sophia Martinez", avatar: "SM" }
];

const TEMPLATES: Record<string, Record<string, string[]>> = {
  positive: {
    enthusiastic: [
      "Absolutely blew me away! From the second I opened the box, the quality was evident. The performance is top-tier and it integrates seamlessly into my daily routine. Highly recommend this to anyone looking to level up their setup!",
      "An absolute game-changer! I've been using this for a week now and it has exceeded every single one of my expectations. The engineering is outstanding and it's worth every single penny. 10/10!",
      "Wow, just wow. This is exactly what I've been searching for. The user experience is incredibly smooth, and the feature set is extremely polished. You will not regret buying this!"
    ],
    professional: [
      "A highly competent solution that delivers solid performance. The construction is robust, and the feature implementation aligns perfectly with professional standards. It offers excellent value for demanding workflows.",
      "Impressive build quality and reliable execution. The design strikes a perfect balance between form and function. It has integrated well into our team's daily processes, boosting overall efficiency.",
      "An excellent product that stands out for its reliability and precision. The technical execution is clean, and customer support has been responsive. Highly recommended for commercial or personal projects alike."
    ],
    detailed: [
      "After conducting extensive comparisons with competing brands, this product stands out for several reasons. First, the material quality is superior, showing no signs of fatigue under heavy use. Second, the user interface is intuitive yet offers deep customizability. While the learning curve is slight, the documentation is comprehensive, helping us optimize our configurations within a few hours. A stellar purchase overall.",
      "Let's break this down into features: 1. Setup took less than 5 minutes. 2. Build is highly durable yet lightweight. 3. The actual output performance exceeds the advertised specifications. The power efficiency is also remarkable. Minor complaints: the packaging was a bit difficult to open, but the contents inside were pristine. Definitely a wise long-term investment."
    ]
  },
  neutral: {
    professional: [
      "A solid product that performs as advertised. It does not introduce any revolutionary features, but it handles core duties reliably. The build quality is acceptable for the price point.",
      "Decent performance with a straightforward setup. It gets the job done but lacks some of the refinement found in higher-end models. Meets our baseline requirements adequately.",
      "An average implementation. While it doesn't stand out, it also doesn't suffer from major design flaws. Recommended if you are looking for a simple, budget-conscious option."
    ],
    detailed: [
      "I purchased this model expecting moderate utility, and that is precisely what was delivered. The primary features function fine, though the speed could be improved. The instruction manual is helpful but basic. I've noted a few software quirks, but nothing that breaks the core usability. It is a reasonable option depending on your budget limits.",
      "Here is my honest take after 3 days of testing. On the plus side, the size is very compact and energy draw is minimal. However, the companion application feels slightly outdated and laggy. It performs its basic functions, but does not leave a lasting impression. It represents a fair trade-off between price and features."
    ]
  },
  negative: {
    critical: [
      "Extremely disappointed with this purchase. The item arrived late and the build quality feels remarkably cheap. It stopped working after just three uses, and support has not responded to my requests.",
      "Avoid this if you're looking for reliability. The interface is frustratingly slow, and key options are missing or locked behind confusing paywalls. Does not match the marketing descriptions.",
      "A complete letdown. The design is clunky, and the hardware runs hot within minutes of activation. I would highly suggest looking at alternative brands before spending your money here."
    ],
    sarcastic: [
      "Outstanding product if your goal is to practice returning items. The design is a masterpiece of inconvenience, and I love how the manual leaves out all the actual setup steps. Truly a memorable experience.",
      "It makes a fantastic, expensive paperweight! If you enjoy troubleshooting simple problems for hours on end, this is absolutely the product of your dreams. 1 star for arriving in a box.",
      "I'm deeply impressed by how they managed to fit so many bugs into one small device. It is a spectacular display of cutting-edge frustration. Save yourself the headache."
    ]
  }
};

const TITLES: Record<string, string[]> = {
  positive: [
    "Absolutely Incredible!",
    "Exceeded All My Expectations",
    "Highly Recommended - Worth Every Cent",
    "Stellar Quality and Performance",
    "A Must-Have for Developers",
    "The Best in Class"
  ],
  neutral: [
    "Decent, but room for improvement",
    "Good baseline product",
    "Fair price for what it offers",
    "Meets basic requirements",
    "Average performance"
  ],
  negative: [
    "Do not recommend",
    "Extremely disappointed",
    "Terrible experience",
    "Doesn't work as advertised",
    "Waste of time and money"
  ]
};

export function generateMockReview(
  productName: string,
  category: string,
  rating: number,
  tone: string
): MockReviewResponse {
  let sentiment: "positive" | "neutral" | "negative" = "neutral";
  if (rating >= 4) {
    sentiment = "positive";
  } else if (rating <= 2) {
    sentiment = "negative";
  }

  let toneKey = tone.toLowerCase();
  let sentimentTemplates = TEMPLATES[sentiment];
  let templatesToUse = sentimentTemplates[toneKey] || Object.values(sentimentTemplates)[0];
  
  const templateIdx = Math.floor(Math.random() * templatesToUse.length);
  let content = templatesToUse[templateIdx];
  
  content = content.replace("this product", productName);
  content = content.replace("this item", productName);
  content = content.replace("this device", productName);
  content = content.replace("this model", productName);
  content = content.replace("This is", `The ${productName} is`);
  content = content.replace("this", productName);

  const titleList = TITLES[sentiment];
  const title = titleList[Math.floor(Math.random() * titleList.length)];
  const reviewer = REVIEWERS[Math.floor(Math.random() * REVIEWERS.length)];
  const id = "rev_" + Math.random().toString(36).substr(2, 9);
  const latencyMs = Math.floor(Math.random() * 120) + 40; 
  const tokensUsed = Math.floor(content.length / 4) + 15;

  return {
    id,
    productName,
    category,
    rating,
    tone,
    title,
    content,
    sentiment,
    reviewer: {
      name: reviewer.name,
      avatar: reviewer.avatar,
      verifiedPurchase: Math.random() > 0.3
    },
    metadata: {
      tokensUsed,
      latencyMs,
      model: "review-gen-v1-flash",
      timestamp: new Date().toISOString()
    }
  };
}

export function generateMockAnalysis(reviewText: string): MockAnalysisResponse {
  const text = reviewText.toLowerCase();
  
  let language = "English";
  let translation: string | null = null;
  
  if (text.includes("excelente") || text.includes("bueno") || text.includes("gracias") || text.includes("malo")) {
    language = "Spanish";
    translation = "This is a translated English representation of the Spanish customer review.";
  } else if (text.includes("appareil") || text.includes("très") || text.includes("bon") || text.includes("mauvais") || text.includes("merci")) {
    language = "French";
    translation = "This is a translated English representation of the French customer review.";
  } else if (text.includes("toll") || text.includes("gut") || text.includes("schlecht") || text.includes("danke") || text.includes("nicht")) {
    language = "German";
    translation = "I found the product to be so-so, but the service was good.";
  }

  let sentiment: "positive" | "neutral" | "negative" = "neutral";
  let score = 0.5;
  let repeats = true;
  
  const positiveWords = ["great", "good", "love", "perfect", "excellent", "awesome", "satisfied", "happy", "excelente", "bon", "très", "gut", "toll"];
  const negativeWords = ["bad", "terrible", "cheap", "broken", "worst", "unhappy", "waste", "broke", "malo", "mauvais"];

  let posCount = 0;
  let negCount = 0;

  positiveWords.forEach(w => { if (text.includes(w)) posCount++; });
  negativeWords.forEach(w => { if (text.includes(w)) negCount++; });

  if (posCount > negCount) {
    sentiment = "positive";
    score = 0.85 + Math.random() * 0.13;
    repeats = true;
  } else if (negCount > posCount) {
    sentiment = "negative";
    score = 0.1 + Math.random() * 0.15;
    repeats = false;
  } else {
    sentiment = "neutral";
    score = 0.45 + Math.random() * 0.1;
    repeats = Math.random() > 0.4;
  }

  let summary = "The customer provided general feedback about their product experience.";
  let pros = ["Functional performance"];
  let cons = ["None explicitly detailed"];
  let actionItems = ["Monitor customer activity patterns"];
  let suggestions = ["Invite user to join loyalty program"];
  let replay = "Thank you for your feedback! Your comments will be shared with our team. We are always striving to provide you with better service.";

  if (sentiment === "positive") {
    summary = "Customer expressed high satisfaction with their purchase and highlighted positive features.";
    pros = ["High build quality", "Easy installation", "Great customer service response"];
    actionItems = ["Maintain existing manufacturing specifications", "Share positive feedback with customer success group"];
    suggestions = ["Request permission to quote as testimonial", "Send early-access beta product invitation"];
    replay = "Hi there, thank you so much for your kind review! We are thrilled to hear about your positive experience. Your feedback truly motivates us to keep delivering quality. We look forward to serving you again!";
  } else if (sentiment === "negative") {
    summary = "Customer reported severe quality or delivery issues and requested immediate resolution.";
    cons = ["Poor structural durability", "Unhelpful setup instructions", "High thermal output under stress"];
    actionItems = ["Flag account for customer relations support contact", "Review hardware batch manufacturing controls"];
    suggestions = ["Offer partial refund or immediate replacement product", "Redraft instruction booklet with simplified diagrams"];
    replay = "Hello, we sincerely apologize for the experience you had. This is not the standard we hold ourselves to. Our support team has been notified and will reach out to you within 24 hours to arrange a replacement or full refund.";
  } else {
    if (language === "German") {
      replay = "Vielen Dank für Ihre Bewertung! Wir verstehen Ihre gemischten Gefühle bezüglich des Produkts. Es freut uns zu hören, dass Sie mit unserem Service zufrieden waren. Wir arbeiten daran, die Qualität des Produkts zu verbessern und hoffen, Sie bald wieder bedienen zu dürfen!";
    }
  }

  const latencyMs = Math.floor(Math.random() * 100) + 50; 
  const tokensUsed = Math.floor(reviewText.length / 4.2) + 80;

  return {
    feedback_language: language,
    translation,
    sentiment,
    summary,
    pros,
    cons,
    action_items: actionItems,
    suggestions,
    customer_repeats: repeats,
    confidence_score: parseFloat(score.toFixed(2)),
    replay,
    metadata: {
      tokensUsed,
      latencyMs,
      model: "revgapi-analyser-v1",
      timestamp: new Date().toISOString()
    }
  };
}
