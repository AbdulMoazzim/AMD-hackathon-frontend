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
  number: string; // as displayed
  tel: string; // digits for tel: link
  label: string;
  note?: string;
};

export type Country = {
  id: CountryId;
  name: string;
  lang: Lang; // language of the doctor-facing summary
  primary: Contact; // the big call button
  contacts: Contact[]; // everything else
  note: string;
  source: { label: string; href: string };
};

export const COUNTRIES: Country[] = [
  {
    id: "PK",
    name: "Pakistan",
    lang: "ur",
    primary: { number: "1122", tel: "1122", label: "Rescue 1122 · ambulance, fire & rescue" },
    contacts: [
      { number: "115", tel: "115", label: "Edhi ambulance", note: "Charity-run, widely available" },
      { number: "15", tel: "15", label: "Police" },
      { number: "16", tel: "16", label: "Fire brigade" },
    ],
    note: "Pakistan has no single nationwide emergency number, and 1122 is run provincially, so coverage varies by area. 112 may not work reliably. Operators may speak limited English.",
    source: { label: "rescue.gov.pk", href: "https://rescue.gov.pk/" },
  },
  {
    id: "US",
    name: "United States",
    lang: "en",
    primary: { number: "911", tel: "911", label: "Police, fire & ambulance" },
    contacts: [
      { number: "988", tel: "988", label: "Suicide & Crisis Lifeline", note: "Call or text, 24/7" },
      { number: "1-800-222-1222", tel: "18002221222", label: "Poison Help", note: "Free and confidential" },
    ],
    note: "Emergency rooms must see anyone in an emergency, and bills can be high. Ask about costs for non-emergency care.",
    source: { label: "usa.gov", href: "https://www.usa.gov/emergency-services" },
  },
  {
    id: "GB",
    name: "United Kingdom",
    lang: "en",
    primary: { number: "999", tel: "999", label: "Police, fire, ambulance & coastguard" },
    contacts: [
      { number: "112", tel: "112", label: "Also connects to emergency services" },
      { number: "111", tel: "111", label: "NHS 111 · urgent, not life-threatening", note: "England, Scotland and Wales" },
      { number: "116 123", tel: "116123", label: "Samaritans", note: "Free, 24/7 emotional support" },
    ],
    note: "999 is for emergencies. For urgent problems that are not life-threatening, use NHS 111 or an urgent treatment centre.",
    source: { label: "nhs.uk", href: "https://www.nhs.uk/nhs-services/urgent-and-emergency-care-services/when-to-call-999/" },
  },
  {
    id: "DE",
    name: "Germany",
    lang: "de",
    primary: { number: "112", tel: "112", label: "Ambulance & fire" },
    contacts: [
      { number: "116 117", tel: "116117", label: "On-call doctor · urgent, not life-threatening", note: "Answers in German only" },
      { number: "110", tel: "110", label: "Police" },
      { number: "0800 111 0 111", tel: "08001110111", label: "Telefonseelsorge", note: "Free crisis support, German" },
    ],
    note: "112 is for life-threatening situations. Call 116 117 for urgent medical needs outside practice hours.",
    source: { label: "116117.de", href: "https://www.116117.de/de/englisch.php" },
  },
  {
    id: "FR",
    name: "France",
    lang: "fr",
    primary: { number: "112", tel: "112", label: "European emergency number" },
    contacts: [
      { number: "15", tel: "15", label: "SAMU · medical emergencies" },
      { number: "18", tel: "18", label: "Fire & rescue (pompiers)" },
      { number: "17", tel: "17", label: "Police" },
      { number: "3114", tel: "3114", label: "Suicide prevention line", note: "Free, 24/7" },
      { number: "114", tel: "114", label: "Emergency by SMS or fax", note: "For deaf or hard-of-hearing callers" },
    ],
    note: "112 works everywhere in France. 15 reaches the SAMU directly for medical emergencies.",
    source: { label: "service-public.gouv.fr", href: "https://www.service-public.gouv.fr/particuliers/actualites/A17758?lang=fr" },
  },
];

export const WARNING_SIGNS = [
  "Chest pain or pressure",
  "Severe difficulty breathing",
  "Face drooping, arm weakness or trouble speaking",
  "Heavy bleeding that will not stop",
  "Fainting or not responding",
  "Swelling of the face or throat after a sting, food or medicine",
  "Thoughts of harming yourself",
];

/* ------------------------------ translations ------------------------------ */
// Standard phrases only. REVIEW with a native/medical translator before launch.

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