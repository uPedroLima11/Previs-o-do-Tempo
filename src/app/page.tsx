"use client";
import Navbar from "@/components/Navbar";
import axios from "axios";
import { format, parseISO } from "date-fns";
import Image from "next/image";
import { useQuery } from "react-query";
import { pt } from 'date-fns/locale';
import Container from "@/components/Container";
import { convertKelvinParaCelsius } from "@/utils/converterKelvinParaCelsius";


// https://api.openweathermap.org/data/2.5/forecast?q=pune&appid=1d33c60514cdd37f80fbe52321b49773&cnt=56

interface Coordenadas {
  lat: number;
  lon: number;
}

interface Cidade {
  id: number;
  name: string;
  coord: Coordenadas;
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}

interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface Main {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  sea_level: number;
  grnd_level: number;
  humidity: number;
  temp_kf: number;
}

interface Wind {
  speed: number;
  deg: number;
  gust: number;
}

interface Clouds {
  all: number;
}

interface Previsao {
  dt: number;
  main: Main;
  weather: Weather[];
  clouds: Clouds;
  wind: Wind;
  visibility: number;
  pop: number;
  sys: { pod: string };
  dt_txt: string;
}

interface RespostaAPI {
  cod: string;
  message: number;
  cnt: number;
  list: Previsao[];
  city: Cidade;
}



export default function Home() {
  const { isLoading, error, data } = useQuery<RespostaAPI>('repoData', async () => {
    const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=pune&appid=${process.env.
      NEXT_PUBLIC_CLIMA_KEY}&cnt=56`);

    return data;
  }

  );

  const firstData = data?.list[0];

  console.log("data", data);

  if (isLoading)
    return (
      <div className="flex items-center min-h-screen justify-center">
        <p className="animate-bounce">Carregando...</p>
      </div>
    );
  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <Navbar />
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="flex gap-1 text-2xl items-end">
              <p className="capitalize">
                {firstData?.dt_txt &&
                  format(parseISO(firstData.dt_txt), "EEEE", { locale: pt }).charAt(0).toUpperCase() +
                  format(parseISO(firstData.dt_txt), "EEEE", { locale: pt }).slice(1)
                }
              </p>
              <p className="text-lg">
                ({format(parseISO(firstData?.dt_txt ?? ""), "dd.MM.yyyy", { locale: pt })})
              </p>
            </h2>
            <Container className="gap-10 px-6 items-center">
              <div className=" flex flex-col px-4">
                <span className="text-5xl">
                  {convertKelvinParaCelsius(firstData?.main.temp ?? 295.51)}°C
                </span>
                <p className="text-xs space-x-1 whitespace-nowrap">
                  <span> Sensação Térmica</span>
                  <span>
                    {convertKelvinParaCelsius(firstData?.main.feels_like ?? 0,)}°C
                  </span>
                </p>
                <p className="text-xs space-x-2">
                  <span>
                    {convertKelvinParaCelsius(firstData?.main.temp_min ?? 0)}°↓
                  </span>
                  <span>
                    {convertKelvinParaCelsius(firstData?.main.temp_max ?? 0)}°↑
                  </span>
                </p>
              </div>

              <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
                {data?.list.map((d, i) => (

                  <div key={i}
                    className="flex flex-col justify between gap-2 items-center text-xs font-semibold"
                  >
                    <p className="whitespace-nowrap">{format(parseISO(d.dt_txt), "h:mm a", { locale: pt })}</p>
                    
                    <p>{convertKelvinParaCelsius(d?.main.temp ?? 0)}°</p>
                  </div>
                  
                ))}
              </div>
            </Container>
            <div></div>

          </div>

        </section>


        <section></section>
      </main>
    </div>
  );
}
