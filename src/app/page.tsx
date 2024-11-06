"use client";
import Navbar from "@/components/Navbar";
import axios from "axios";
import { fromUnixTime, parseISO } from "date-fns";
import { useQuery } from "react-query";
import { pt } from 'date-fns/locale';
import Container from "@/components/Container";
import { convertKelvinParaCelsius } from "@/utils/converterKelvinParaCelsius";
import ClimaIcon from "@/components/ClimaIcon";
import { DiaOuNoiteIcon } from "@/utils/DiaOuNoiteIcon";
import PrevisaoClimaDetalhe from "@/components/PrevisaoClimaDetalhe";
import { metrosParaKm } from "@/utils/metrosParaKm";
import { format } from 'date-fns-tz';
import { convertVelocidadeVento } from "@/utils/converterVelocidadeVento";
import PrevisaoTempoDetalhe from "@/components/PrevisaoTempoDetalhe";
import { placeAtom } from "./atom";
import { useAtom } from "jotai";


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

function capitalizarPrimeiraLetra(texto: string) {
  return texto
    .split(' ')
    .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase())
    .join(' ');
}

export default function Home() {

  const { isLoading, error, data } = useQuery<RespostaAPI>(
    "repoData", 
    async () => {
        const { data } = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?q=pune&appid=${process.env.NEXT_PUBLIC_CLIMA_KEY}&cnt=56`
        );
        return data;
    }
);



  const firstData = data?.list[0];

  console.log("data", data)

  const uniqueDates = [
    ...new Set(
      data?.list.map(
        (entry) => new Date(entry.dt * 1000).toISOString().split("T")[0]
      )
    )
  ];




  const diasDaSemana: Record<string, string> = {
    "Sunday": "Domingo",
    "Monday": "Segunda-feira",
    "Tuesday": "Terça-feira",
    "Wednesday": "Quarta-feira",
    "Thursday": "Quinta-feira",
    "Friday": "Sexta-feira",
    "Saturday": "Sábado",
  };

  const traducoesClima: { [key: string]: string } = {
    "clear sky": "céu limpo",
    "few clouds": "poucas nuvens",
    "scattered clouds": "nuvens esparsas",
    "broken clouds": "nuvens quebradas",
    "shower rain": "chuva rápida",
    "rain": "chuva",
    "thunderstorm": "tempestade",
    "snow": "neve",
    "mist": "neblina",
  };



  const firstDataForEachDate = uniqueDates.map((date) => {
    return data?.list.find((entry) => {
      const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
      const entryTime = new Date(entry.dt * 1000).getHours();
      return entryDate === date && entryTime >= 6;
    });
  });

  if (isLoading) {
    return (
      <div className="flex items-center min-h-screen justify-center">
        <p className="animate-bounce">Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center min-h-screen justify-center">
        <p className="text-red-500">Ocorreu um erro ao buscar os dados.</p>
      </div>
    );
  }
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
              <div className="flex flex-col px-4">
                <span className="text-5xl">
                  {convertKelvinParaCelsius(firstData?.main.temp ?? 295.51)}°C
                </span>
                <p className="text-xs space-x-1 whitespace-nowrap">
                  <span> Sensação Térmica</span>
                  <span>
                    {convertKelvinParaCelsius(firstData?.main.feels_like ?? 0)}°C
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
                    className="flex flex-col justify-between gap-2 items-center text-xs font-semibold"
                  >
                    <p className="whitespace-nowrap">{format(parseISO(d.dt_txt), "h:mm a", { locale: pt })}</p>
                    <ClimaIcon
                      iconName={DiaOuNoiteIcon(d.weather[0].icon, d.dt_txt)} />
                    <p>{convertKelvinParaCelsius(d?.main.temp ?? 0)}°</p>
                  </div>
                ))}
              </div>
            </Container>
          </div>
          <div className="flex gap-4">
            <Container className="w-fit justify-center flex-col px-4 items-center">
              <p className="capitalize text-center">
                {firstData && firstData.weather && firstData.weather.length > 0
                  ? capitalizarPrimeiraLetra(traducoesClima[firstData.weather[0].description] ?? firstData.weather[0].description)
                  : "Descrição não disponível"}
              </p>
              <ClimaIcon
                iconName={firstData && firstData.weather && firstData.weather.length > 0
                  ? DiaOuNoiteIcon(firstData.weather[0].icon ?? "", firstData.dt_txt ?? "")
                  : ""}
              />
            </Container>
            <Container className="overflow-x-auto bg-yellow-300/80 px-6 gap-4 justify-between">
              <PrevisaoClimaDetalhe
                visibilidade={metrosParaKm(firstData?.visibility ?? 10000)}
                pressaoAr={`${firstData?.main.pressure} hPa`}
                umidade={`${firstData?.main.humidity}%`}
                nascerSol={format(
                  fromUnixTime(data?.city.sunrise ?? 1730768771),
                  "HH:mm",
                  { timeZone: 'America/Sao_Paulo' }
                )}
                porSol={format(
                  fromUnixTime(data?.city.sunset ?? 1730809808),
                  "HH:mm",
                  { timeZone: 'America/Sao_Paulo' }
                )}
                velocidadeVento={convertVelocidadeVento(firstData?.wind.speed ?? 1.64)}
              />
            </Container>
          </div>

        </section>

        <section className="flex w-full flex-col gap-4">
          <p className="text-2xl">Previsão Para (7 dias)</p>
          {firstDataForEachDate.map((d, i) => {
            const descricaoOriginal = d?.weather[0].description ?? "";
            const descricaoEmPortugues = traducoesClima[descricaoOriginal as keyof typeof traducoesClima] || descricaoOriginal;

            const diaOriginal = format(parseISO(d?.dt_txt ?? ""), "EEEE");
            const diaEmPortugues = diasDaSemana[diaOriginal as keyof typeof diasDaSemana] || diaOriginal;

            return (
              <PrevisaoTempoDetalhe
                key={i}
                description={descricaoEmPortugues}
                weatherIcon={d?.weather[0].icon ?? "01d"}
                date={format(parseISO(d?.dt_txt ?? ""), "dd.MM")}
                day={diaEmPortugues}
                feels_Like={d?.main.feels_like ?? 0}
                temp={d?.main.temp ?? 0}
                temp_max={d?.main.temp_max ?? 0}
                temp_min={d?.main.temp_min ?? 0}
                pressaoAr={`${d?.main.pressure} hPa`}
                umidade={`${d?.main.humidity}%`}
                nascerSol={format(
                  fromUnixTime(data?.city.sunrise ?? 1730768771), "H:mm"
                )}
                porSol={format(
                  fromUnixTime(data?.city.sunset ?? 1730809808), "H:mm",
                )}
                visibilidade={`${metrosParaKm(d?.visibility ?? 10000)}`}
                velocidadeVento={`${convertVelocidadeVento(d?.wind.speed ?? 1.64)}`}
              />

            );
          })}
        </section>


      </main>
    </div>
  );
}
