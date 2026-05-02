import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc, addDoc } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const defaultProjects = [
  {
    title: "RinishBD",
    type: "Meta Ads & Strategy",
    image: "https://picsum.photos/seed/rinishbd/800/1000",
    link: "https://www.facebook.com/rinishbd",
    description: "For RinishBD, we overhauled their Meta advertising strategy, injecting a creative approach that completely transformed their ad management. This targeted optimization led to a massive spike in conversions. Client Review: \"Kazi completely transformed my Meta ad management... My conversions are up significantly, highly recommend!\"",
  },
  {
    title: "ShajAlo",
    type: "Organic Viral Growth",
    image: "https://picsum.photos/seed/shajalo/800/1000",
    link: "https://www.facebook.com/SajhAlo",
    description: "In the highly competitive furniture niche, we crafted an organic viral video strategy for ShajAlo. We successfully produced and launched 5 videos that went massively viral—achieving 1.0M to 1.6M views each organically. This explosive visibility directly translated into 50+ high-value confirmed orders.",
  },
  {
    title: "Aurazeh",
    type: "AI Automation",
    image: "https://picsum.photos/seed/aurazeh/800/1000",
    link: "https://www.facebook.com/Aurazeh/",
    description: "We modernized Aurazeh's digital presence by implementing a flawless AI automation pipeline using Make.com. This sophisticated system handles automated Facebook posting, instant conversational AI message replies, and streamlined customer interactions, drastically reducing manual workload and boosting response rates.",
  },
  {
    title: "ApproLeader",
    type: "Full-Stack & Marketing",
    image: "https://picsum.photos/seed/apporleader/800/1000",
    link: "https://apporleader.vercel.app/",
    description: "Serving as the foundational technology and marketing partner for ApproLeader, we provided end-to-end solutions. We built their complete web infrastructure, orchestrated targeted Meta advertising campaigns, and executed a robust LinkedIn growth strategy to establish strong market authority for the founder.",
  },
  {
    title: "Website: Nusrat Jahan",
    type: "Portfolio Web Development",
    image: "https://picsum.photos/seed/nusrat/800/1000",
    link: "https://thenusratjahan.vercel.app/",
    description: "Created a highly personalized portfolio web experience for Nusrat Jahan. We designed and developed a bespoke WordPress landing page, then skillfully extracted and optimized the source code for a lightning-fast, modern deployment directly on Vercel's global edge network.",
  },
  {
    title: "Website: Zayed Ahammed",
    type: "Portfolio Web Development",
    image: "https://picsum.photos/seed/zayed/800/1000",
    link: "https://zayedahammed.vercel.app/",
    description: "Developed a sleek, conversion-focused personal portfolio website for Zayed Ahammed. By building the initial framework in WordPress and strategically exporting the static code, we ensured a high-performance, seamless live deployment utilizing Vercel's modern hosting infrastructure.",
  },
  {
    title: "Colour Fusion",
    type: "Meta Page Management & Ads",
    image: "https://picsum.photos/seed/colourfution/800/1000",
    link: "#",
    description: "We spearheaded the digital launch for Colour Fusion from the ground up. This included complete Meta page architecture and robust ongoing management. By designing 20+ engaging content pieces and executing highly targeted ad campaigns, we quickly established their social proof and brand awareness.",
  }
];

const defaultTestimonials = [
  {
    text: "Oxerfy is a great team! Ora amar Instagram page er ekta boro problem fix kore diyeche. Plus, tara amar jonno besh kichu cool custom edits o kore diyeche. Khub e helpful and talented ekta agency. Highly appreciated!",
    image: "/regenerated_image_1777372990808.png",
    name: "Adnan",
    role: "Client",
  },
  {
    text: "Great job Kazi!! Amar personal website ta eto sundor hobe bhabte pari nai. The whole process was so smooth, and apni amar shob requirement khub carefully shune kaj korechen. I am really happy with the final result!",
    image: "/regenerated_image_1777372992402.png",
    name: "Nusrat Jahan",
    role: "Personal Website",
  },
  {
    text: "Kazi at Oxerfy completely transformed my Meta ad management with his creative approach. Oader kaaj er dhoron khub e professional. Amar page er conversions aager cheye onek bereche. Anyone needing real results shouldn't think twice. Thank you so much for the amazing support!",
    image: "/regenerated_image_1777372993380.png",
    name: "Nasrin Sarkar",
    role: "Founder, RinishBD",
  },
  {
    text: "Thank you Kazi for the amazing personal portfolio! Design ta khub e sundor ar fast hoyeche. Ekdom amar moner moto kore baniye diyechen. Highly recommended. Wish you and Oxerfy grow up faster!",
    image: "/regenerated_image_1777372994150.png",
    name: "Zayed Ahammed",
    role: "Personal Portfolio",
  },
  {
    text: "First to last, Kazi bhai amake amar cousin er page setup and management e help korechen. Kono dhoroner birokti charai bhai continuously support diyechen. Really grateful for their dedication and top-notch service!",
    image: "https://i.pravatar.cc/150?u=ashikul",
    name: "Ashikul Rahman",
    role: "Client",
  },
  {
    text: "He is honestly a great guy to work with! Kaaj er pasapasi Kazi bhaiyer behavior o onek bhalo. He goes out of his way to help you out. Thank you so much for the excellent service!",
    image: "https://i.pravatar.cc/150?u=afridi",
    name: "Afridi",
    role: "Client",
  },
  {
    text: "Their service is simply the best! Ekdom time er moddhe perfect ekta kaaj deliver koreche. The attention to detail is amazing. Next time apni i shobar aage amar first choice thakben.",
    image: "https://i.pravatar.cc/150?u=tanjim",
    name: "Tanjim Parvez",
    role: "Client",
  },
];

async function run() {
  // Clear projects
  const pSnap = await getDocs(collection(db, 'projects'));
  for(const d of pSnap.docs) await deleteDoc(doc(db, 'projects', d.id));
  
  // Seed projects
  for(const p of defaultProjects) await addDoc(collection(db, 'projects'), {...p, image_url: p.image});
  
  // Clear testimonials
  const tSnap = await getDocs(collection(db, 'testimonials'));
  for(const d of tSnap.docs) await deleteDoc(doc(db, 'testimonials', d.id));
  
  // Seed testimonials
  for(const t of defaultTestimonials) await addDoc(collection(db, 'testimonials'), {...t, image_url: t.image});
  
  console.log("Seeded database successfully");
}
run();
