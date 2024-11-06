"use client";

import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import axios from "axios";
import { format, fromUnixTime, parseISO } from "date-fns";
import { useQuery } from "react-query";
import { loadingCityAtom, placeAtom } from "./atom";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { convertKelvinParaCelsius } from "@/utils/converterKelvinParaCelsius";
import ClimaIcon from "@/components/ClimaIcon";
import PrevisaoClimaDetalhe from "@/components/PrevisaoClimaDetalhe";
import { convertVelocidadeVento } from "@/utils/converterVelocidadeVento";
import { DiaOuNoiteIcon } from "@/utils/DiaOuNoiteIcon";
import PrevisaoTempoDetalhe from "@/components/PrevisaoTempoDetalhe";
import { metrosParaKm } from "@/utils/metrosParaKm";
import { toZonedTime } from "date-fns-tz";
import { ptBR } from "date-fns/locale";
import { addSeconds } from "date-fns";


interface WeatherDetail {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number;
  sys: {
    pod: string;
  };
  dt_txt: string;
}

interface WeatherData {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherDetail[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}


const climaEmPortugues: { [key: string]: string } = {
  "clear sky": "Céu limpo",
  "few clouds": "Poucas nuvens",
  "scattered clouds": "Nuvens dispersas",
  "broken clouds": "Nuvens quebradas",
  "shower rain": "Chuva",
  "rain": "Chuva",
  "thunderstorm": "Trovoada",
  "snow": "Neve",
  "mist": "Névoa",
  "overcast clouds": "Nuvens densas",
};



export default function Home() {
  const [place, setPlace] = useAtom(placeAtom);
  const [loadingCity] = useAtom(loadingCityAtom);

  const { isLoading, error, data, refetch } = useQuery<WeatherData>(
    "repoData",
    async () => {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_CLIMA_KEY}&cnt=56`
      );
      return data;
    }
  );

  useEffect(() => {
    refetch();
  }, [place, refetch]);

  const firstData = data?.list[0];

  console.log("data", data);

  const uniqueDates = [
    ...new Set(
      data?.list.map(
        (entry) => new Date(entry.dt * 1000).toISOString().split("T")[0]
      )
    )
  ];

  const firstDataForEachDate = uniqueDates.map((date) => {
    return data?.list.find((entry) => {
      const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
      const entryTime = new Date(entry.dt * 1000).getHours();
      return entryDate === date && entryTime >= 6;
    });
  });

  if (isLoading)
    return (
      <div className="flex items-center min-h-screen justify-center">
        <p className="animate-bounce text-black">Carregando...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex items-center min-h-screen justify-center">
        {/* @ts-ignore */}
        <p className="text-red-400">{error.message}</p>
      </div>
    );
  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen ">
      <Navbar location={data?.city.name} />
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9  w-full  pb-10 pt-4 ">
        {loadingCity ? (
          <ClimaEsqueleto />
        ) : (
          <>
            <section className="space-y-4 ">
              <div className="space-y-2">
                <h2 className="text-black flex gap-1 text-2xl  items-end capitalize ">
                  <p className="text-black">{format(parseISO(firstData?.dt_txt ?? ""), "EEEE", { locale: ptBR })}</p>
                  <p className="text-lg text-black">
                    ({format(parseISO(firstData?.dt_txt ?? ""), "dd.MM.yyyy", { locale: ptBR })})
                  </p>
                </h2>
                <Container className=" gap-10 px-6 items-center">
                  <div className=" flex flex-col px-4 ">
                    <span className="text-5xl text-black">
                      {convertKelvinParaCelsius(firstData?.main.temp ?? 296.37)}°
                    </span>
                    <p className="text-black text-xs space-x-1 whitespace-nowrap">
                      <span className="text-black"> Sensação térmica</span>
                      <span className="text-black">
                        {convertKelvinParaCelsius(firstData?.main.feels_like ?? 0)}°
                      </span>
                    </p>
                    <p className="text-xs space-x-2">
                      <span className="text-black">
                        {convertKelvinParaCelsius(firstData?.main.temp_min ?? 0)}°↓{" "}
                      </span>
                      <span className="text-black">
                        {" "}
                        {convertKelvinParaCelsius(firstData?.main.temp_max ?? 0)}°↑
                      </span>
                    </p>
                  </div>

                  <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3 ">
                    {data?.list.map((d, i) => (
                      <div
                        key={i}
                        className="flex flex-col justify-between gap-2 items-center text-xs font-semibold "
                      >
                        <p className="text-black whitespace-nowrap">
                          {format(parseISO(d.dt_txt), "h:mm a", { locale: ptBR })}
                        </p>

                        <ClimaIcon
                          iconName={DiaOuNoiteIcon(d.weather[0].icon, d.dt_txt)}
                        />
                        <p className="text-black">{convertKelvinParaCelsius(d?.main.temp ?? 0)}°</p>
                      </div>
                    ))}
                  </div>
                </Container>
              </div>
              <div className=" flex gap-4">
                <Container className="w-fit justify-center flex-col px-4 items-center text-black">
                  <p className="capitalize text-center text-black">
                    {climaEmPortugues[firstData?.weather[0]?.description ?? "default"]}
                  </p>
                  <ClimaIcon
                    iconName={DiaOuNoiteIcon(
                      firstData?.weather[0].icon ?? "",
                      firstData?.dt_txt ?? ""
                    )}
                  />
                </Container>
                <Container className="bg-yellow-300/80  px-6 gap-4 justify-between overflow-x-auto">
                  <PrevisaoClimaDetalhe
                    visibilidade={metrosParaKm(firstData?.visibility ?? 10000)}
                    pressaoAr={`${firstData?.main.pressure} hPa`}
                    umidade={`${firstData?.main.humidity}%`}
                    nascerSol={format(toZonedTime(data?.city.sunrise ?? 1730855200, 'America/Sao_Paulo'), "H:mm")}
                    porSol={format(toZonedTime(data?.city.sunset ?? 1730896186, 'America/Sao_Paulo'), "H:mm")}
                    velocidadeVento={convertVelocidadeVento(firstData?.wind.speed ?? 1.64)}
                  />
                </Container>
              </div>
            </section>

            <section className="flex w-full flex-col gap-4  ">
              <p className="text-2xl text-black">Previsão para os próximos 7 dias</p>
              {firstDataForEachDate.map((d, i) => (
                <PrevisaoTempoDetalhe
                  key={i}
                  description={d?.weather[0].description ?? ""}
                  weatherIcon={d?.weather[0].icon ?? "01d"}
                  date={d ? format(parseISO(d.dt_txt), "dd.MM", { locale: ptBR }) : ""}
                  day={d ? format(parseISO(d.dt_txt), "EEEE", { locale: ptBR }) : ""}
                  feels_Like={d?.main.feels_like ?? 0}
                  temp={d?.main.temp ?? 0}
                  temp_max={d?.main.temp_max ?? 0}
                  temp_min={d?.main.temp_min ?? 0}
                  pressaoAr={`${d?.main.pressure} hPa `}
                  umidade={`${d?.main.humidity}% `}
                  porSol={format(
                    fromUnixTime(data?.city.sunset ?? 1730896186),
                    "H:mm"
                  )}
                  nascerSol={format(
                    fromUnixTime(data?.city.sunrise ?? 1730855200),
                    "H:mm"
                  )}
                  visibilidade={`${metrosParaKm(d?.visibility ?? 10000)} `}
                  velocidadeVento={`${convertVelocidadeVento(d?.wind.speed ?? 1.64)} `}
                />
              ))}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function ClimaEsqueleto() {
  return (
    <section className="space-y-8 ">
      <div className="space-y-2 animate-pulse">
        <div className="flex gap-1 text-2xl items-end ">
          <div className="h-6 w-24 bg-gray-300 rounded"></div>
          <div className="h-6 w-24 bg-gray-300 rounded"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div className="h-6 w-16 bg-gray-300 rounded "></div>
              <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
              <div className="h-6 w-16 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 animate-pulse">
        <p className="text-2xl h-8 w-36 bg-gray-300 rounded"></p>

        {[1, 2, 3, 4, 5, 6, 7].map((index) => (
          <div key={index} className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
            <div className="h-8 w-28 bg-gray-300 rounded"></div>
            <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
            <div className="h-8 w-28 bg-gray-300 rounded"></div>
            <div className="h-8 w-28 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    </section>
  );
}