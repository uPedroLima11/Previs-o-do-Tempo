import React from 'react'
import Container from './Container'
import ClimaIcon from './ClimaIcon'
import { PrevisaoClimaDetalheProps } from './PrevisaoClimaDetalhe';
import { convertKelvinParaCelsius } from '@/utils/converterKelvinParaCelsius';

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
                <div>
                    <ClimaIcon iconName={weatherIcon} />
                    <p>{date}</p>
                    <p className='text-sm'>{day}</p>
                </div>
                <div className='flex flex-col px-4'>
                    <span className='text-5xl'>{convertKelvinParaCelsius(temp?? 0)}°</span>
                    <p className='text-xs space-x-1 whitespace-nowrap'>
                        <span>Feels Like</span>
                        <span>{convertKelvinParaCelsius(feels_Like ?? 0)}°</span>
                    </p>
                    <p className='capitalize'>{description}</p>
                </div>
            </section>

            <section className='overflow-x-auto flex justify-between gap-4 px-4 w-full pr-10'>
            </section>
        </Container>
    )
}