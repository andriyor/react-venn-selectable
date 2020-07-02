declare module 'venn.js';

export interface VennSet {
  sets: string[],
  size: number,
  label?: string
}

export interface Dataset {
  vennSets: string
}

export interface GElement extends Element {
  dataset: Dataset
}

export interface VennArea {
  d: string,
  sets: string[],
}

export interface IntersectionAreas {
  vennArea: VennArea,
  intersectedAreas: VennArea[]
}

export interface IntersectionAreasMapping {
  [key: string]: IntersectionAreas
}
