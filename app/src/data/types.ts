export type DeviceOption = { value: string; label: string };

export type Ribbon = {
  id: string;
  name: string;
  precedence: number;
  branches: string[];
  image: { legacyPath: string };
  links: { detailHref?: string };
  device?: { options: DeviceOption[] };
};
