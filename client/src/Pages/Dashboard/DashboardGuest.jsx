import React from "react";
import { useHistory } from "react-router-dom";
import Illustration1 from "../../Images/illustration1.jpg";
import Illustration2 from "../../Images/illustration2.jpg";

export default function () {
  const history = useHistory();
  return (
    <>
      <section className="text-gray-700 body-font">
        <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
          <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
              Er du klar
              <br className="hidden lg:inline-block" />
              til det nye?
            </h1>
            <p className="mb-8 leading-relaxed">
              Coingo er Danmarks nye fakturering- og lagerstyringsapp! Og som
              det bedste, det er helt gratis at bruge! Scroll ned for at få et
              overblik over de features som Coingo tilbyder.
            </p>
            <div className="flex justify-center">
              <a
                href="#features"
                className="inline-flex text-white bg-blue-500 border-0 py-2 px-6 focus:outline-none hover:bg-blue-600 rounded text-lg"
              >
                Lær Mere
              </a>
              <button
                onClick={() => history.push("/auth/register")}
                className="ml-4 inline-flex text-gray-700 bg-gray-200 border-0 py-2 px-6 focus:outline-none hover:bg-gray-300 rounded text-lg"
              >
                Opret Bruget
              </button>
            </div>
          </div>
          <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
            <img
              className="object-cover object-center rounded"
              alt="hero"
              src={Illustration1}
            />
          </div>
        </div>
      </section>

      <section id="features" className="text-gray-700 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-20">
            <h2 className="text-xs text-blue-500 tracking-widest font-medium title-font mb-1">
              LÆR OM COINGO
            </h2>
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
              FEATURES
            </h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
              Coingo er helt gratis at bruge, og det er nok den bedste feature
              der er. Men bare rolig, Coingo er et kraftfuldt program designet
              til at styre dit firmas økonomi. Læs nedenunder, hvad Coingo kan!
            </p>
          </div>
          <div className="flex flex-wrap">
            <div className="xl:w-1/4 lg:w-1/2 md:w-full px-8 py-6 border-l-2 border-gray-200">
              <h2 className="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2">
                Ressourser
              </h2>
              <p className="leading-relaxed text-base mb-4">
                Hold styr på dit lager ved at oprette Steder. Steder er blot
                containere som bruges til at organisere dine Produkter. Ved at
                oprette et Produkt, kan du angive dets købspris, salgspris,
                antal på lageret, og om det er et digitalt produkt. Du kan
                desuden oprette kunder og leverandører, som skal bruges i dine
                fakturer.
              </p>
            </div>
            <div className="xl:w-1/4 lg:w-1/2 md:w-full px-8 py-6 border-l-2 border-gray-200">
              <h2 className="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2">
                Fakturering
              </h2>
              <p className="leading-relaxed text-base mb-4">
                Du kan nemt og hurtigt oprette købs- og salgsfakturer, og
                tilføje enten kunde eller leverandør til en faktura. Du kan
                desuden tilføje fakturalinjer, og dér kan du angive om linjen
                indeholder et produkt eller fritekst. Så er der mulighed for at
                tilføje pris og antal og om fakturaen er med eller uden moms.
                Når du har oprettet fakturaen, kan du enten udskrive den (PDF)
                eller sende via email til enten kunden eller leverandøren (også
                PDF).
              </p>
            </div>
            <div className="xl:w-1/4 lg:w-1/2 md:w-full px-8 py-6 border-l-2 border-gray-200">
              <h2 className="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2">
                Statistikker
              </h2>
              <p className="leading-relaxed text-base mb-4">
                Du kan angive start- og (eller) slutdato, og så henter
                programmet de nødvendige data, som programmet også beregner din
                momsopgørelse ud fra. Du kan også undlade at angive slutdato, så
                vil det automatisk være idag slutning af dagen.
              </p>
            </div>
            <div className="xl:w-1/4 lg:w-1/2 md:w-full px-8 py-6 border-l-2 border-gray-200">
              <h2 className="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2">
                Lager
              </h2>
              <p className="leading-relaxed text-base mb-4">
                Få et hurtigt og nemt overblik over dit lager. Totalpris
                beregnes ud fra købsprisen på de enkelte produkter.
              </p>
            </div>
          </div>
          <div className="flex justify-center">
            <a
              href="#features2"
              className="inline-block mt-16 text-white bg-blue-500 border-0 py-2 px-8 focus:outline-none hover:bg-blue-600 rounded text-lg"
            >
              Læs Videre
            </a>
          </div>
        </div>
      </section>

      <section id="features2" className="text-gray-700 body-font">
        <div className="container px-5 py-24 mx-auto flex flex-wrap">
          <div className="lg:w-1/2 w-full mb-10 lg:mb-0 rounded-lg overflow-hidden">
            <img
              alt="feature"
              className="object-cover object-center h-full w-full"
              src={Illustration2}
            />
          </div>
          <div className="flex flex-col flex-wrap lg:py-6 -mb-10 lg:w-1/2 lg:pl-12 lg:text-left text-center">
            <div className="flex flex-col mb-10 lg:items-start items-center">
              <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-500 mb-5">
                <svg
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <div className="flex-grow">
                <h2 className="text-gray-900 text-lg title-font font-medium mb-3">
                  Hurtig
                </h2>
                <p className="leading-relaxed text-base">
                  Appen er designet så den er ekstrem hurtig i betjening. Du
                  behøver slet ikke refreshe siden, når du foretager dig
                  operationerne.
                </p>
              </div>
            </div>
            <div className="flex flex-col mb-10 lg:items-start items-center">
              <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-500 mb-5">
                <svg
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                >
                  <circle cx="6" cy="6" r="3"></circle>
                  <circle cx="6" cy="18" r="3"></circle>
                  <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"></path>
                </svg>
              </div>
              <div className="flex-grow">
                <h2 className="text-gray-900 text-lg title-font font-medium mb-3">
                  Nem
                </h2>
                <p className="leading-relaxed text-base">
                  Betjening af appen er utrolig nem, da der kun er de
                  funktioner, som du skal bruge til effektiv lager- og
                  fakturastyring.
                </p>
              </div>
            </div>
            <div className="flex flex-col mb-10 lg:items-start items-center">
              <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-500 mb-5">
                <svg
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div className="flex-grow">
                <h2 className="text-gray-900 text-lg title-font font-medium mb-3">
                  Gratis
                </h2>
                <p className="leading-relaxed text-base">
                  Programmet er helt gratis at bruge.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="text-gray-700 body-font">
        <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
          <a className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
            <span className="ml-3 text-xl">coingo.dk</span>
          </a>
          <p className="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
            © 2020 Coingo —
            <a
              href="https://mikolaj.dk"
              className="text-gray-600 ml-1"
              rel="noopener noreferrer"
              target="_blank"
            >
              Mikolaj Marciniak
            </a>
          </p>
          <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
            <a
              className="text-gray-500"
              href="https://www.facebook.com/1991Miko/"
              target="_blank"
            >
              <i class="fab fa-facebook-f"></i>
            </a>
            <a
              className="ml-3 text-gray-500"
              target="_blank"
              href="https://www.youtube.com/channel/UCYRV3vmAKt1rxxZiDcQXd9A?view_as=subscriber"
            >
              <i class="fab fa-youtube"></i>
            </a>

            <a
              className="ml-3 text-gray-500"
              href="https://mikolaj.dk"
              target="_blank"
            >
              <i class="fas fa-globe-europe"></i>
            </a>
          </span>
        </div>
      </footer>
    </>
  );
}
