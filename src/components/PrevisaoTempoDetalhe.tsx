import React from 'react'
import Container from './Container'
import ClimaIcon from './ClimaIcon'
import PrevisaoClimaDetalhe, { PrevisaoClimaDetalheProps } from './PrevisaoClimaDetalhe';
import { convertKelvinParaCelsius } from '@/utils/converterKelvinParaCelsius';



const descricaoEmPortugues: { [key: string]: string } = {
    "clear sky": "Céu limpo",
    "few clouds": "Poucas nuvens",
    "scattered clouds": "Nuvens dispersas",
    "broken clouds": "Nuvens quebradas",
    "shower rain": "Chuva leve",
    "rain": "Chuva",
    "thunderstorm": "Trovoada",
    "snow": "Neve",
    "mist": "Neblina",
    "overcast clouds": "Nublado",
    "light rain": "Chuva leve",
    "light snow": "Chuva",
    "moderate rain": "Chuva moderada",
    "heavy intensity rain": "Chuva intensa",
    "light intensity shower rain": "Chuva leve",
    "drizzle": "Garôa",
    "thunderstorm with light rain": "Trovoada com chuva leve",
    "thunderstorm with rain": "Trovoada com chuva",
    "thunderstorm with heavy rain": "Trovoada com chuva intensa",
    "snow shower": "Aguaceiro de neve",
    "fog": "Névoa",
    "haze": "Nebulosidade",
    "sleet": "Granizo",
};


export interface PrevisaoTempoDetalheProps extends PrevisaoClimaDetalheProps {
    weatherIcon: string;
    date: string;
    day: string;
    temp: number;
    feels_Like: number;
    temp_min: number;
    temp_max: number;
    description: string;
}

export default function PrevisaoTempoDetalhe(props: PrevisaoTempoDetalheProps) {

    const {
        weatherIcon = "02d",
        date = "19.09",
        day = "Terça-Feira",
        temp = 0,
        feels_Like = 0,
        temp_min = 0,
        temp_max = 0,
        description = "Sem descrição"
    } = props;

    return (
        <Container className='gap-4'>

            <section className='flex gap-4 items-center px-4'>
                <div className='flex flex-col gap-1 items-center '>
                    <ClimaIcon iconName={weatherIcon} />
                    <p className='text-black capitalize'>{date}</p>
                    <p className='text-sm text-black capitalize'>{day}</p>
                </div>
                <div className='flex flex-col px-4'>
                    <span className='text-5xl text-black capitalize'>{convertKelvinParaCelsius(temp ?? 0)}°</span>
                    <p className='text-xs space-x-1 whitespace-nowrap capitalize text-black'>
                        <span className='text-black capitalize'>Sensação De</span>
                        <span className='text-black capitalize'>{convertKelvinParaCelsius(feels_Like ?? 0)}°</span>
                    </p>
                    <p className='capitalize text-black'>{descricaoEmPortugues[description] || description}</p>
                </div>
            </section>

            <section className="capitalize text-black overflow-x-auto flex justify-between gap-4 px-4  w-full pr-10">
                <PrevisaoClimaDetalhe {...props} />
            </section>
        </Container>
    );
}