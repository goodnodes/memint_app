export function getDino(stat, setStat) {
  if (stat.dino === 'Tyrano') {
    setStat({...stat, dinoType: '티라노사우르스', fullEnergy: 100});
  } else if (stat.dino === 'Brachio') {
    setStat({...stat, dinoType: '브라키오사우르스', fullEnergy: 90});
  } else if (stat.dino === 'Tricera') {
    setStat({...stat, dinoType: '트리케라톱스', fullEnergy: 60});
  } else if (stat.dino === 'Stego') {
    setStat({...stat, dinoType: '스테고사우르스', fullEnergy: 70});
  }
}
