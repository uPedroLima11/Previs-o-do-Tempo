import React from 'react';
import { FiDroplet } from 'react-icons/fi';
import { ImMeter } from 'react-icons/im';
import { LuEye, LuSunrise, LuSunset } from 'react-icons/lu';
import { MdAir } from 'react-icons/md';

export interface PrevisaoClimaDetalheProps {
  visibilidade: string;
  umidade: string;
  velocidadeVento: string;
  pressaoAr: string;
  nascerSol: string;
  porSol: string;
}

export default function PrevisaoClimaDetalhe(props: PrevisaoClimaDetalheProps) {
  const {
    visibilidade = "25km", 
    umidade = "61%",
    velocidadeVento = "7 km/h",
    pressaoAr = "1012 hPa",
    nascerSol = "6.20",
    porSol = "18:48"
  } = props;

  return (
    <>
      <SingleClimaDetalhe
        icon={<LuEye />}
        informacao="Visibilidade"
        value={visibilidade}
      />
      <SingleClimaDetalhe
        icon={<FiDroplet />}
        informacao="Umidade"
        value={umidade}
      />
      <SingleClimaDetalhe
        icon={<MdAir />}
        informacao="Velocidade do Vento"
        value={velocidadeVento}
      />
      <SingleClimaDetalhe
        icon={<ImMeter />}
        informacao="Pressão do Ar"
        value={pressaoAr}
      />
      <SingleClimaDetalhe
        icon={<LuSunrise />}
        informacao="Nascer do Sol"
        value={nascerSol}
      />
      <SingleClimaDetalhe
        icon={<LuSunset />}
        informacao="Pôr do Sol"
        value={porSol}
      />
    </>
  );
}

export interface SingleClimaDetalheProps {
  informacao: string;
  icon: React.ReactNode;
  value: string;
}

function SingleClimaDetalhe(props: SingleClimaDetalheProps) {
  return (
    <div className='flex flex-col justify-between gap-2 items-center text-xs font-semibold text-black/80'>
      <p className='whitespace-nowrap'>{props.informacao}</p>
      <div className='text-3xl'>{props.icon}</div>
      <p>{props.value}</p>
    </div>
  );
}
