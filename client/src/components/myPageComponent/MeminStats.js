export function getDino(stat, setStat) {
  if (stat.dino === 'Tyrano') {
    setStat({...stat, dinoType: 'TYRANNOSAURUS', fullEnergy: 100});
  } else if (stat.dino === 'Brachio') {
    setStat({...stat, dinoType: 'BRACHIOSAURUS', fullEnergy: 90});
  } else if (stat.dino === 'Tricera') {
    setStat({...stat, dinoType: 'TRICERATOPS', fullEnergy: 60});
  } else if (stat.dino === 'Stego') {
    setStat({...stat, dinoType: 'STEGOSAURUS', fullEnergy: 70});
  }
}
