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

// Definição da interface para as coordenadas da cidade
interface Coordenadas {
  lat: number;  // Latitude
  lon: number;  // Longitude
}

// Definição da interface para as informações da cidade
interface Cidade {
  id: number;            // ID da cidade
  name: string;         // Nome da cidade
  coord: Coordenadas;   // Coordenadas da cidade
  country: string;      // Código do país
  population: number;   // População da cidade
  timezone: number;     // Fuso horário
  sunrise: number;      // Horário do nascer do sol (timestamp)
  sunset: number;       // Horário do pôr do sol (timestamp)
}

// Definição da interface para a descrição do tempo
interface Weather {
  id: number;          // ID da condição climática
  main: string;       // Condição climática principal (ex: "Clear", "Clouds")
  description: string; // Descrição do clima (ex: "clear sky", "few clouds")
  icon: string;       // Ícone correspondente ao clima
}

// Definição da interface para as condições meteorológicas principais
interface Main {
  temp: number;       // Temperatura
  feels_like: number; // Sensação térmica
  temp_min: number;   // Temperatura mínima
  temp_max: number;   // Temperatura máxima
  pressure: number;   // Pressão atmosférica
  sea_level: number;  // Pressão ao nível do mar
  grnd_level: number; // Pressão ao nível do solo
  humidity: number;   // Umidade
  temp_kf: number;    // Temperatura ajustada (se necessário)
}

// Definição da interface para as condições de vento
interface Wind {
  speed: number; // Velocidade do vento
  deg: number;   // Direção do vento
  gust: number;  // Rajada de vento
}

// Definição da interface para as nuvens
interface Clouds {
  all: number; // Porcentagem de cobertura de nuvens
}

// Definição da interface para cada entrada da previsão
interface Previsao {
  dt: number;      // Data em formato timestamp
  main: Main;      // Informações principais do tempo
  weather: Weather[]; // Array de condições climáticas
  clouds: Clouds;   // Informações sobre nuvens
  wind: Wind;       // Informações sobre vento
  visibility: number; // Visibilidade
  pop: number;      // Probabilidade de precipitação
  sys: { pod: string }; // Parte do dia ("d" para dia, "n" para noite)
  dt_txt: string;   // Data e hora em formato legível
}

// Definição da interface para a resposta completa
interface RespostaAPI {
  cod: string;           // Código da resposta
  message: number;      // Mensagem (geralmente 0 se bem-sucedido)
  cnt: number;          // Contagem de entradas na previsão
  list: Previsao[];     // Lista de previsões
  city: Cidade;         // Informações da cidade
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
        <section>
          <div>
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
                    {convertKelvinParaCelsius(firstData?.main.feels_like ?? 0)}°C
                  </span>

                
                </p>
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
