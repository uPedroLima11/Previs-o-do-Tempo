

export function metrosParaKm(VisibilidadeEmMetros:number): string{
    const visibilidadeInKm = VisibilidadeEmMetros / 1000;
  return `${visibilidadeInKm.toFixed(0)}km`;

}
