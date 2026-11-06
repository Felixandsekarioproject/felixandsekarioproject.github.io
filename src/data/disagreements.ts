// Content for the "Disagreements" page.
// Every quotation below was checked word for word against an official or first-party transcript
// (see the `check` field). Page numbers for Obama and LaPierre are from the Blair Academy US History Reader.

export type Person = {
  id: "obama" | "lapierre" | "trump" | "biden";
  name: string;
  role: string;
  year: string;
  photo: string;
  photoAlt: string;
  photoCredit: string;
  /** Historical facts: dates, events, who said what, when. */
  context: string;
  /** What they argued (their claims, not established facts). */
  argument: string;
  solution: string;
  /** This project's reading of how they understand liberty. */
  liberty: string;
  quote: { text: string; cite: string };
  /** Historical facts about what happened afterwards (with a link into the site where possible). */
  next: { text: string; link?: { label: string; href: string } };
  source: { title: string; date: string; where: string; url?: string; check: string };
};

export const people: Person[] = [
  {
    id: "lapierre",
    name: "Wayne LaPierre",
    role: "Executive vice president, National Rifle Association (NRA)",
    year: "2012",
    photo: "/portraits/lapierre.jpg",
    photoAlt: "Photo of Wayne LaPierre",
    photoCredit: "Photo by Gage Skidmore, CC BY-SA 3.0, via Wikimedia Commons",
    context:
      "On December 14, 2012, a gunman killed children and staff at Sandy Hook Elementary School in Newtown, Connecticut. One week later, LaPierre gave the NRA's public response.",
    argument:
      "Gun-free school zones leave children unprotected. New gun restrictions burden law-abiding citizens instead of stopping attackers.",
    solution: "Put armed police officers in every school.",
    liberty:
      "Liberty includes the right to armed self-defense. Safety comes from armed protection, not from stricter gun laws.",
    quote: {
      text: "The only thing that stops a bad guy with a gun is a good guy with a gun.",
      cite: "LaPierre, 2012 (Reader, p. 59)",
    },
    next: {
      text: "In April 2013, the Senate voted on a plan to expand background checks to gun shows and online sales. It got 54 votes, short of the 60 it needed, and failed.",
    },
    source: {
      title: "NRA Statement Following the Sandy Hook Elementary School Shooting",
      date: "December 21, 2012",
      where: "Blair Academy US History Reader, pp. 58–59",
      url: "https://www.americanhunter.org/content/nra-proposes-national-school-safety-program",
      check: "Checked against the transcript published by the NRA (American Hunter).",
    },
  },
  {
    id: "obama",
    name: "Barack Obama",
    role: "President of the United States",
    year: "2015",
    photo: "/portraits/obama.jpg",
    photoAlt: "Official portrait of President Barack Obama",
    photoCredit: "Official White House photo by Pete Souza (public domain)",
    context:
      "On October 1, 2015, a gunman attacked Umpqua Community College in Roseburg, Oregon. President Obama spoke from the White House the same day.",
    argument:
      "Mass shootings keep happening because lawmakers choose not to act. Reasonable gun-safety laws would not take away gun rights.",
    solution: "Change the law through politics, as other countries did after mass shootings.",
    liberty:
      "Government has a duty to protect citizens from preventable harm, and that duty can sit alongside constitutional rights.",
    quote: { text: "This is a political choice that we make", cite: "Obama, 2015 (Reader, p. 57)" },
    next: {
      text: "In January 2016, Obama announced executive actions without a new law from Congress. One said that people in the business of selling guns, in shops, at gun shows or online, need a license and must run background checks.",
    },
    source: {
      title: "Remarks on the Shooting at Umpqua Community College",
      date: "October 1, 2015",
      where: "Blair Academy US History Reader, pp. 56–57",
      url: "https://obamawhitehouse.archives.gov/the-press-office/2015/10/01/statement-president-shootings-umpqua-community-college-roseburg-oregon",
      check: "Checked against the official White House transcript.",
    },
  },
  {
    id: "trump",
    name: "Donald Trump",
    role: "President of the United States",
    year: "2019",
    photo: "/portraits/trump.jpg",
    photoAlt: "Official portrait of President Donald Trump, 2017",
    photoCredit: "Official White House photo by Shealah Craighead (public domain)",
    context:
      "On August 5, 2019, after mass shootings in El Paso, Texas, and Dayton, Ohio, President Trump spoke from the White House. In 2018 his administration had banned bump stocks.",
    argument:
      "Violence is driven by the person, not the gun. Dangerous individuals, not all gun owners, should be the target of action.",
    solution: "Red flag laws (extreme risk protection orders), mental-health reform, and stronger background checks.",
    liberty:
      "Protect gun rights for most people, but let courts quickly remove guns from someone judged to be a danger.",
    quote: { text: "Mental illness and hatred pulls the trigger, not the gun.", cite: "Trump, 2019" },
    next: {
      text: "Congress did not pass a national red flag law, but the 2022 Bipartisan Safer Communities Act gave states money for red flag programs. In 2024, the Supreme Court struck down his administration’s bump stock ban.",
      link: { label: "You be the judge: Garland v. Cargill", href: "/judge/cargill/" },
    },
    source: {
      title: "Remarks by President Trump on the Mass Shootings in Texas and Ohio",
      date: "August 5, 2019",
      where: "The White House (archived)",
      url: "https://trumpwhitehouse.archives.gov/briefings-statements/remarks-president-trump-mass-shootings-texas-ohio/",
      check:
        "Checked against the official White House transcript. Bump stock ban: Garland v. Cargill (2024), dissent.",
    },
  },
  {
    id: "biden",
    name: "Joe Biden",
    role: "President of the United States",
    year: "2022",
    photo: "/portraits/biden.jpg",
    photoAlt: "Official portrait of President Joe Biden",
    photoCredit: "Official White House photo by Adam Schultz (public domain)",
    context:
      "On June 25, 2022, a month after a shooting at Robb Elementary School in Uvalde, Texas, President Biden signed the Bipartisan Safer Communities Act, a gun law with support from both parties.",
    argument:
      "Gun violence needs action from Congress. A compromise law is not everything he wanted, but it is better than doing nothing.",
    solution:
      "A bipartisan law: new crimes for straw purchasing and gun trafficking, and money for state crisis and red flag programs.",
    liberty:
      "Freedom from gun violence can be protected through law, even a compromise that both parties accept.",
    quote: { text: "Lives will be saved.", cite: "Biden, 2022" },
    next: {
      text: "Two days before he signed the law, the Supreme Court decided Bruen, which created a new history test for gun laws. In September 2023, Biden created the first White House Office of Gun Violence Prevention.",
      link: { label: "You be the judge: Bruen", href: "/judge/bruen/" },
    },
    source: {
      title: "Remarks on Signing the Bipartisan Safer Communities Act",
      date: "June 25, 2022",
      where: "The American Presidency Project (UC Santa Barbara)",
      url: "https://www.presidency.ucsb.edu/node/356599",
      check: "Checked against the American Presidency Project transcript. Law details: Public Law 117-159.",
    },
  },
];

/** Comparison table: short summaries of each statement, not facts about the world. */
export const compare: { topic: string; cells: Record<Person["id"], string> }[] = [
  {
    topic: "Individual freedom",
    cells: {
      obama: "Gun rights and reasonable rules can exist together.",
      lapierre: "Armed self-defense is part of liberty; restrictions burden law-abiding citizens.",
      trump: "Blames “mental illness and hatred,” not the gun.",
      biden: "Accepts limits that both parties could agree on.",
    },
  },
  {
    topic: "Gun regulation",
    cells: {
      obama: "More is needed; inaction is “a political choice.”",
      lapierre: "Opposes new restrictions.",
      trump: "Targeted rules aimed at dangerous people (red flag laws).",
      biden: "More is needed; a compromise is a start.",
    },
  },
  {
    topic: "Public safety",
    cells: {
      obama: "Fewer guns in the wrong hands, through law.",
      lapierre: "Armed protection where people are vulnerable.",
      trump: "Spot and stop dangerous individuals early.",
      biden: "Keep guns from people barred from having them.",
    },
  },
  {
    topic: "Government responsibility",
    cells: {
      obama: "Congress must change the law.",
      lapierre: "Fund armed security in schools.",
      trump: "Courts act fast through “rapid due process.”",
      biden: "Congress and the president act together, across parties.",
    },
  },
  {
    topic: "Proposed solution",
    cells: {
      obama: "New gun-safety laws.",
      lapierre: "Armed police in every school.",
      trump: "Red flag laws, mental-health reform, background checks.",
      biden: "The Bipartisan Safer Communities Act (2022).",
    },
  },
];

export const positions = [
  {
    id: "regulation",
    label: "Stronger gun regulations",
    claim:
      "Liberty means being free to live without fear of preventable violence. Laws that limit who can get guns protect everyone’s freedom.",
    voices: "Closest to Obama (2015) and Biden (2022). Trump’s call for red flag laws borrows from this side.",
    strengths: [
      "Acts before harm happens, and applies everywhere, not only in schools.",
      "The Supreme Court has said the Second Amendment right is “not unlimited” (Heller, 2008).",
    ],
    limits: [
      "Rules also apply to law-abiding gun owners.",
      "Courts can strike laws down; since Bruen (2022), a gun law must fit the nation’s historical tradition.",
      "People disagree about which rules actually work.",
    ],
  },
  {
    id: "rights",
    label: "Stronger protection of the right to bear arms",
    claim:
      "Liberty means being able to defend yourself and your family. Limits on guns weaken that right and mostly affect people who obey the law.",
    voices: "Closest to LaPierre (2012) and Trump (2019), who both focus on the person, not the gun.",
    strengths: [
      "Rests on the text of the Second Amendment and on Heller (2008), which protects an individual right.",
      "Does not limit the freedom of people who have done nothing wrong.",
    ],
    limits: [
      "Armed protection usually responds after an attack has started.",
      "Does little about suicides, which are most gun deaths in the U.S. (see the home page).",
      "Critics argue that more guns in more places brings its own risks.",
    ],
  },
] as const;
