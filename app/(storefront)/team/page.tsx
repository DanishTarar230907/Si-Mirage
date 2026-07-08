import Image from 'next/image';

const team = [
  { name: 'Zayn', role: 'Lead Designer', image: 'Team+Member+1' },
  { name: 'Sarah', role: 'Creative Director', image: 'Team+Member+2' },
  { name: 'Omar', role: 'Head of Marketing', image: 'Team+Member+3' },
  { name: 'Ayesha', role: 'Brand Ambassador', image: 'Team+Member+4' },
];

export default function TeamPage() {
  return (
    <div className="container mx-auto px-6 py-12 md:py-20">
      <div className="text-center max-w-3xl mx-auto mb-20">
        <h1 className="text-4xl md:text-5xl font-light mb-6 uppercase tracking-widest">Meet The <span className="font-bold">Team</span></h1>
        <p className="text-foreground/80 font-light leading-relaxed">
          The visionaries behind Si Mirage. Our diverse team of creators, designers, and marketers work relentlessly to redefine luxury eyewear.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {team.map((member, index) => (
          <div key={index} className="group relative overflow-hidden bg-surface aspect-[3/4]">
            <Image
              src={`https://placehold.co/600x800/111111/C0A062?text=${member.image}+[Drive]`}
              alt={member.name}
              fill
              className="object-cover opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <h3 className="text-xl font-bold uppercase tracking-wider text-white mb-1">{member.name}</h3>
              <p className="text-primary text-sm font-medium tracking-widest uppercase">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
