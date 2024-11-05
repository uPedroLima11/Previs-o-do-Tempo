export function convertVelocidadeVento(velocidadeEmMetrosPorSegundo: number): string {
    const velocidadeEmKmPorHora = velocidadeEmMetrosPorSegundo * 3.6;
    return `${velocidadeEmKmPorHora.toFixed(0)} km/h`;
}