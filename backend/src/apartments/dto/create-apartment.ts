export class CreateApartmentDto {
  title: string;
  description: string;
  bedrooms: number;
  maxPeople: number;
  couches: number;
  showers: number;
  viewFromWindow: string;
  hasAc: boolean;
  mainPhoto: string;
  photos: string[];
}
