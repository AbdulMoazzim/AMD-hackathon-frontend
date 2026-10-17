export type Lang = "en" | "fr" | "de" | "ur";
export type T = Record<Lang, string>;
export type CountryId = "PK" | "US" | "GB" | "DE" | "FR";

export const LANG_NAME: Record<Lang, string> = {
  en: "English",
  fr: "Français",
  de: "Deutsch",
  ur: "اردو",
};


export type Contact = {
  id: string;
  number: string;
  tel: string;
  hasNote?: boolean;
};

export type Country = {
  id: CountryId; 
  lang: Lang; 
  primary: { number: string; tel: string };
  contacts: Contact[];
  source: { label: string; href: string };
};

export const COUNTRIES: Country[] = [
  {
    id: "PK",
    lang: "ur",
    primary: { number: "1122", tel: "1122" },
    contacts: [
      { id: "edhi", number: "115", tel: "115", hasNote: true },
      { id: "police", number: "15", tel: "15" },
      { id: "fire", number: "16", tel: "16" },
    ],
    source: { label: "rescue.gov.pk", href: "https://rescue.gov.pk/" },
  },
  {
    id: "US",
    lang: "en",
    primary: { number: "911", tel: "911" },
    contacts: [
      { id: "crisis", number: "988", tel: "988", hasNote: true },
      { id: "poison", number: "1-800-222-1222", tel: "18002221222", hasNote: true },
    ],
    source: { label: "usa.gov", href: "https://www.usa.gov/emergency-services" },
  },
  {
    id: "GB",
    lang: "en",
    primary: { number: "999", tel: "999" },
    contacts: [
      { id: "e112", number: "112", tel: "112" },
      { id: "nhs111", number: "111", tel: "111", hasNote: true },
      { id: "samaritans", number: "116 123", tel: "116123", hasNote: true },
    ],
    source: {
      label: "nhs.uk",
      href: "https://www.nhs.uk/nhs-services/urgent-and-emergency-care-services/when-to-call-999/",
    },
  },
  {
    id: "DE",
    lang: "de",
    primary: { number: "112", tel: "112" },
    contacts: [
      { id: "onCall", number: "116 117", tel: "116117", hasNote: true },
      { id: "police", number: "110", tel: "110" },
      { id: "telefonseelsorge", number: "0800 111 0 111", tel: "08001110111", hasNote: true },
    ],
    source: { label: "116117.de", href: "https://www.116117.de/de/englisch.php" },
  },
  {
    id: "FR",
    lang: "fr",
    primary: { number: "112", tel: "112" },
    contacts: [
      { id: "samu", number: "15", tel: "15" },
      { id: "fire", number: "18", tel: "18" },
      { id: "police", number: "17", tel: "17" },
      { id: "suicide", number: "3114", tel: "3114", hasNote: true },
      { id: "sms", number: "114", tel: "114", hasNote: true },
    ],
    source: {
      label: "service-public.gouv.fr",
      href: "https://www.service-public.gouv.fr/particuliers/actualites/A17758?lang=fr",
    },
  },
];

export type Opt = { id: string; t: T };

const o = (id: string, en: string, fr: string, de: string, ur: string): Opt => ({
  id,
  t: { en, fr, de, ur },
});

export const OPTIONS: Record<"area" | "start" | "onset" | "pattern" | "assoc", Opt[]> = {
  area: [
    o("head", "Headache", "Mal de tête", "Kopfschmerzen", "سر درد"),
    o("throat", "Sore throat or cold", "Mal de gorge ou rhume", "Halsschmerzen oder Erkältung", "گلے میں خراش یا نزلہ"),
    o("chest", "Chest or breathing", "Poitrine ou respiration", "Brust oder Atmung", "سینہ یا سانس"),
    o("stomach", "Stomach or abdomen", "Ventre ou estomac", "Magen oder Bauch", "معدہ یا پیٹ"),
    o("back", "Back, joints or muscles", "Dos, articulations ou muscles", "Rücken, Gelenke oder Muskeln", "کمر، جوڑ یا پٹھے"),
    o("skin", "Skin", "Peau", "Haut", "جلد"),
    o("fever", "Fever or feeling unwell", "Fièvre ou malaise général", "Fieber oder allgemeines Unwohlsein", "بخار یا طبیعت کی خرابی"),
    o("eyeear", "Eyes or ears", "Yeux ou oreilles", "Augen oder Ohren", "آنکھیں یا کان"),
    o("other", "Something else", "Autre chose", "Etwas anderes", "کچھ اور"),
  ],
  start: [
    o("today", "Today", "Aujourd'hui", "Heute", "آج"),
    o("d12", "1 to 2 days ago", "Il y a 1 à 2 jours", "Vor 1 bis 2 Tagen", "1 سے 2 دن پہلے"),
    o("d37", "3 to 7 days ago", "Il y a 3 à 7 jours", "Vor 3 bis 7 Tagen", "3 سے 7 دن پہلے"),
    o("wk", "More than a week ago", "Il y a plus d'une semaine", "Vor mehr als einer Woche", "ایک ہفتے سے زیادہ پہلے"),
  ],
  onset: [
    o("sudden", "Suddenly", "Soudainement", "Plötzlich", "اچانک"),
    o("gradual", "Gradually", "Progressivement", "Allmählich", "آہستہ آہستہ"),
  ],
  pattern: [
    o("constant", "Constant", "Constante", "Dauerhaft", "مسلسل"),
    o("comes", "Comes and goes", "Par moments", "Kommt und geht", "آتا جاتا رہتا ہے"),
  ],
  assoc: [
    o("fever", "Fever", "Fièvre", "Fieber", "بخار"),
    o("nausea", "Nausea", "Nausées", "Übelkeit", "متلی"),
    o("vomit", "Vomiting", "Vomissements", "Erbrechen", "الٹی"),
    o("dizzy", "Dizziness", "Vertiges", "Schwindel", "چکر آنا"),
    o("tired", "Unusual tiredness", "Fatigue inhabituelle", "Ungewöhnliche Müdigkeit", "غیر معمولی تھکن"),
    o("cough", "Cough", "Toux", "Husten", "کھانسی"),
    o("rash", "Rash", "Éruption cutanée", "Hautausschlag", "جلد پر دانے"),
    o("diarrhea", "Diarrhea", "Diarrhée", "Durchfall", "دست"),
    o("none", "None of these", "Aucun de ceux-ci", "Keines davon", "ان میں سے کوئی نہیں"),
  ],
};

export const LABELS: Record<string, T> = {
  area: { en: "Main concern", fr: "Motif principal", de: "Hauptanliegen", ur: "بنیادی شکایت" },
  start: { en: "Started", fr: "Début", de: "Beginn", ur: "آغاز" },
  onset: { en: "How it began", fr: "Mode d'apparition", de: "Art des Beginns", ur: "شروع کیسے ہوا" },
  sev: { en: "Pain or discomfort level", fr: "Niveau de douleur ou de gêne", de: "Schmerz- oder Beschwerdegrad", ur: "درد یا تکلیف کی شدت" },
  pattern: { en: "Pattern", fr: "Évolution", de: "Verlauf", ur: "انداز" },
  assoc: { en: "Other symptoms", fr: "Autres symptômes", de: "Weitere Symptome", ur: "دیگر علامات" },
  allergies: { en: "Allergies", fr: "Allergies", de: "Allergien", ur: "الرجی" },
  meds: { en: "Current medication", fr: "Médicaments en cours", de: "Aktuelle Medikamente", ur: "موجودہ ادویات" },
  conditions: { en: "Known conditions", fr: "Maladies connues", de: "Bekannte Erkrankungen", ur: "معلوم بیماریاں" },
  notes: { en: "Additional notes", fr: "Remarques", de: "Zusätzliche Hinweise", ur: "اضافی نوٹس" },
};

export const MISC = {
  sev: { en: "{n} out of 10", fr: "{n} sur 10", de: "{n} von 10", ur: "10 میں سے {n}" } as T,
  unanswered: { en: "Not answered", fr: "Non renseigné", de: "Nicht beantwortet", ur: "جواب نہیں دیا گیا" } as T,
  noneKnown: { en: "None that I know of", fr: "Aucun à ma connaissance", de: "Keine, soweit mir bekannt", ur: "میرے علم کے مطابق کوئی نہیں" } as T,
};