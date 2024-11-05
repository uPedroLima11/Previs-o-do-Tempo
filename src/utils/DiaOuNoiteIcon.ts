export function DiaOuNoiteIcon(
    iconName: string,
    dateTimeString: string
): string {
    const horas = new Date(dateTimeString).getHours();

    const eDia = horas > 6 && horas < 18;

    return eDia ? iconName.replace(/.$/,"d") : iconName.replace(/.$/,"n");
}
