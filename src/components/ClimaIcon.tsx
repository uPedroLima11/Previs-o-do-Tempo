import { cn } from '@/utils/cn';
import Image from 'next/image';
import React from 'react';

type Props = {
    iconName: string;
} & React.HTMLProps<HTMLDivElement>;

export default function ClimaIcon(props: Props) {
    const { iconName, ...divProps } = props;

    return (
        <div {...divProps} title={iconName} className={cn('relative h-20 w-20')}>
            <Image
                width={100}
                height={100}
                alt="Icon-Clima"
                className="absolute h-full w-full"
                src={`http://www.openweathermap.org/img/wn/${iconName}@4x.png`}
            />
        </div>
    );
}
