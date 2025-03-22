import { motion } from "framer-motion";
import { useState } from "react";
import checkmark from "../assets/images/checkmark-svgrepo-com.svg"; // Se till att ikonen finns

const SubscriptionCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const plans = [
    {
      title: "Basic",
      price: "59kr",
      features: [
        "Nå ut till fler kunder",
        "Skapa & hantera dina produkter",
        "Ta emot & hantera beställningar",
        "Direkt kontakt med kunder",
        "Ingen provision på försäljning bara en fast månadskostnad",
      ],
      priceId: 'price_1R3hkTCI58R9VXqMaWjIwCx3' // Ersätt med ditt pris-ID
    },
    {
      title: "Pro",
      price: "99kr",
      features: [
        "Alla Basic-funktioner",
        "Ingen annonsering",
        "Prioriterad support",
        "Avancerad statistik och rapporter",
      ],
      priceId: 'price_1R3hkTCI58R9VXqMaWjIwCx4' // Ersätt med ditt pris-ID
    },
  ];

interface Plan {
    title: string;
    price: string;
    features: string[];
    priceId: string;
}

interface CheckoutSessionResponse {
    url: string;
}

const handleCheckout = (priceId: string): void => {
  fetch('https://vg5mm4d3yihvovmnh7wiqqkc2e0rbnsm.lambda-url.eu-north-1.on.aws/', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          line_items: [
              {
                  price: priceId,
                  quantity: 1,
              },
          ],
          subscription_data: {
              trial_period_days: 14, // Lägg till en 14-dagars provperiod
          },
      }),
  })
      .then((res) => {
          if (!res.ok) {
              throw new Error('Network response was not ok');
          }
          return res.json();
      })
      .then((data: CheckoutSessionResponse) => {
          console.log('Checkout session created:', data);
          // Redirect to checkout page
          window.location.href = data.url;
      })
      .catch((error) => {
          console.error('Error creating checkout session:', error);
      });
};

  return (
    <div className="relative w-full mb-32 overflow-hidden">
      <motion.div
        className="flex"
        animate={{ x: `-${currentIndex * 80}%` }}
        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
        initial={{ x: "0%" }}
      >
        {plans.map((plan, index) => (
          <div key={index} className={`min-w-[80%] sm:min-w-[60%] md:min-w-[40%] lg:min-w-[30%] px-2`} style={{ marginLeft: index === 0 ? '10%' : '0' }}>
            <div className="h-full w-full pt-10 px-6 pb-8 bg-gray-900 rounded-3xl shadow-lg">
              <div className="text-center mb-6">
                <span className="block text-5xl italic mb-6 text-white">{plan.title}</span>
                <span className="block text-4xl font-bold text-white mb-3">{plan.price}</span>
                <span className="block text-gray-300 font-medium mb-6">per månad</span>
                <button
                  className="relative group inline-block w-full py-4 px-6 text-center text-gray-50 hover:text-gray-900 bg-yellow-600 font-semibold rounded-full overflow-hidden transition duration-200"
                  onClick={() => handleCheckout(plan.priceId)}
                >
                  <div className="absolute top-0 right-full w-full h-full bg-white transform group-hover:translate-x-full group-hover:scale-102 transition duration-500"></div>
                  <span className="relative">Prova på</span>
                </button>
              </div>
              <ul>
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex mb-4 items-center">
                    <img src={checkmark} alt="Check" />
                    <span className="ml-2 text-white">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Navigationsknappar */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2">
        <button
          onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
          className="bg-secondary text-white p-2 rounded-full"
        >
          ◀
        </button>
      </div>
      <div className="absolute top-1/2 right-4 -translate-y-1/2">
        <button
          onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, plans.length - 1))}
          className="bg-secondary text-white p-2 rounded-full"
        >
          ▶
        </button>
      </div>
    </div>
  );
};

export default SubscriptionCarousel;
