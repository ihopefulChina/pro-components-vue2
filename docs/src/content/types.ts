export interface ApiRow {
  name: string;
  description: string;
  type: string;
  defaultValue?: string;
}

export interface DocEntry {
  slug: string;
  name: string;
  title: string;
  category: string;
  description: string;
  since?: string;
  code: string;
  props?: ApiRow[];
  events?: ApiRow[];
  slots?: ApiRow[];
  methods?: ApiRow[];
}

export interface GuideEntry {
  slug: string;
  title: string;
  kicker: string;
  summary: string;
}
