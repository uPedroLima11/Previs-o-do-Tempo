'use client';
import React from 'react';
import { useState } from 'react';
import { MdWbSunny } from "react-icons/md";
import { MdMyLocation } from "react-icons/md";
import { MdOutlineLocationOn } from "react-icons/md";
import Pesquisa from './Pesquisa';
import axios from 'axios';
import { placeAtom } from '@/app/atom';
import { useAtom } from 'jotai';

type Props = {};

const API_KEY = process.env.NEXT_PUBLIC_CLIMA_KEY;

export default function Navbar({ }: Props) {
    const [city, setCity] = useState("");
    const [error, setError] = useState("");

    const [sugestoes, setSugestoes] = useState<string[]>([]);
    const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
    
    const [place, setPlace] = useAtom(placeAtom);

    async function handleInputChange(value: string) {
        setCity(value);
        if (value.length >= 3) {
            try {
                const response = await axios.get(
                    `https://api.openweathermap.org/data/2.5/weather?q=${value}&appid=${API_KEY}`
                )
                const sugestoes = response.data.list.map((item: any) => item.name);
                setSugestoes(sugestoes);
                setError('')
                setMostrarSugestoes(true);
            } catch (error) { }
            setSugestoes([]);
            setMostrarSugestoes(false);
        }
        else {
            setSugestoes([]);
            setMostrarSugestoes(false);
        }
    }

    function handleSugestaoClick(value: string) {
        setCity(value);
        setMostrarSugestoes(false);
    }

    function handleCampoPesquisa(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (sugestoes.length == 0) {
            setError("Localização Inválida")

        }else {
            setError("");
            setPlace(city);
            setMostrarSugestoes(false);
        }
    }

    return (
        <nav className='shadow-sm sticky top-0 left-0 z-50 bg-white'>
            <div className='h-[80px] w-full flex justify-between items-center max-w-7xl px-3 mx-auto'>
                <p className='flex items-center justify-center gap-2'>
                    <h2 className='text-gray-500 text-3xl'>Clima</h2>
                    <MdWbSunny className='text-3xl mt-1 text-yellow-500' />
                </p>
                <section className='flex gap-2 items-center'>
                    <MdMyLocation className='text-2xl text-gray-400 hover:opacity-80 cursor-pointer' />
                    <MdOutlineLocationOn className='text-3xl ' />
                    <p className='text-slate-900/80 text-sm'>Pelotas</p>
                    <div className='relative'>
                        <Pesquisa
                            value={city}
                            onSubmit={handleCampoPesquisa}
                            onChange={(e) => handleInputChange(e.target.value)}
                        />
                        <SugestaoBox
                            {...{
                                mostrarSugestoes,
                                sugestoes,
                                handleSugestaoClick,
                                error
                            }}
                        />
                    </div>
                </section>
            </div>
        </nav>
    );
}

function SugestaoBox({
    mostrarSugestoes,
    sugestoes,
    handleSugestaoClick,
    error
}: {
    mostrarSugestoes: boolean;
    sugestoes: string[];
    handleSugestaoClick: (item: string) => void;
    error: string;

}) {
    return (
        <>
        
        {((mostrarSugestoes && sugestoes.length > 1) || error) && (
            <ul className='mb-4 bg-white absolute bordedr top-[44px] left-0 border-gray-300 rounded-md min-w-[200px] 
    flex flex-col gap-1 py-2 px-2'>
                {error && sugestoes.length < 1 && (
                    <li className='text-red-500 p-1'> {error}</li>
                )}
                {sugestoes.map((item, i) => (
                    <li key={i}
                        onClick={() => handleSugestaoClick(item)}
                        className='cursor-pointer p-1 rounded hover:bg-gray-200'>


                    </li>
                ))}

                <li className='cursor-pointer p-1 rounded hover:bg-gray-200'></li>
            </ul>
        )}
        </>
    );
}