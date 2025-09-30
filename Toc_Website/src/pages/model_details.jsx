// import { Separator } from "@/components/ui/separator"

import Navbar from "../components/NavBar";

export default function ModelDetails() {
  return (
    <>
      <Navbar />
      <div className="w-full min-h-screen bg-black text-white flex flex-col items-center">
        {/* Title Section */}
        <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 text-center md:text-start">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            AC Ace (1993 - 1996)
          </h1>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-6xl px-8 flex flex-col lg:flex-row gap-8">
          {/* Image */}
          <img
            src="https://placehold.co/360x230"
            alt="AC Ace"
            className="rounded-xl border border-gray-700 w-[360px] h-[230px] object-cover"
          />

          {/* Description */}
          <div className="flex-1 flex flex-col gap-6">
            <p className="text-gray-300 text-base leading-relaxed">
              After gaining full control over the AC brand, Ford and Brian
              Angliss tried to revive the British brand with innovative products
              to lead the small carmaker into new territories.
              <br />
              <br />
              While the original Ace was worldwide famous, the 1993 model
              started on the wrong foot since everyone expected the same results
              as its '50s and '60s predecessors. Later on, the car was mostly
              known as the Brooklands Ace to cut the confusion.
              <br />
              <br />
              This time, the car was designed by Len Bailey as a 2+2 open-top
              vehicle. The first prototype, known as "Ace of Spades," featured a
              targa-top, but the final model, which arrived in 1993, featured a
              classic roadster shape. Again, to cut costs, Ford provided most of
              the car's underpinnings, including the round headlights and turn
              signals.
              <br />
              <br />
              At the front, the car's narrow end with a small radiator grille
              looked spot-on for a modern roadster. After installing a V8 under
              the hood, the carmaker had to create a bulge to make room for the
              air filter, which it did. Unlike the concept car, this was a
              genuine, two-seat roadster. Its thick A-pillars and steep
              windshield protected them while driving, while an electric
              retractable canvas-top kept them dry from the rain. At the back,
              the carmaker installed a short trunk and a four-round taillights
              setup, and a dual exhaust system.
              <br />
              <br />
              Inside, Ace offered a leather-clad interior and plenty of standard
              features such as a stereo tape CD player, air-conditioning, power
              windows and mirrors, and an electrically heated windshield.
              <br />
              <br />
              Under the aluminum bodywork, the carmaker installed the first-ever
              stainless-steel chassis in the industry. Its nearly 50:50 weight
              distribution made it a nimble car, and the limited-slip
              differential helped in many ways. A standard ABS and a powerful V8
              engine completed the package.
            </p>

            {/* Engine Section */}
            <div className="flex flex-col gap-2 pt-4 border-t border-gray-700 pb-20">
              <h2 className="text-2xl font-bold">Gasoline Engines</h2>
              <p className="text-gray-300 font-medium">
                AC Ace 4.9L V8 4AT RWD (260 HP)
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
