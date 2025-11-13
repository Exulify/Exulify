import { BookOpen, Music, Trophy, Palette, Code, Users, Dumbbell, Globe } from 'lucide-react';
import { JSX } from 'react';

interface Extracurricular {
  id: number;
  name: string;
  description: string;
  icon: JSX.Element;
  members: number;
  category: string;
}

export default function Home() {
  const extracurriculars: Extracurricular[] = [
    {
      id: 1,
      name: 'Debate Club',
      description: 'Engage in competitive debate and public speaking to develop argumentation skills.',
      icon: <Users className="w-8 h-8" />,
      members: 45,
      category: 'Academic',
    },
    {
      id: 2,
      name: 'Music Ensemble',
      description: 'Join our orchestra and perform classical pieces at school events.',
      icon: <Music className="w-8 h-8" />,
      members: 32,
      category: 'Arts',
    },
    {
      id: 3,
      name: 'Science Olympiad',
      description: 'Compete in science competitions and explore STEM disciplines.',
      icon: <Trophy className="w-8 h-8" />,
      members: 28,
      category: 'Academic',
    },
    {
      id: 4,
      name: 'Art Studio',
      description: 'Create visual art including painting, sculpture, and digital media.',
      icon: <Palette className="w-8 h-8" />,
      members: 38,
      category: 'Arts',
    },
    {
      id: 5,
      name: 'Coding Club',
      description: 'Learn programming languages and build innovative software projects.',
      icon: <Code className="w-8 h-8" />,
      members: 52,
      category: 'Technology',
    },
    {
      id: 6,
      name: 'Literary Magazine',
      description: 'Write, edit, and publish student stories and poetry.',
      icon: <BookOpen className="w-8 h-8" />,
      members: 24,
      category: 'Arts',
    },
    {
      id: 7,
      name: 'Sports Club',
      description: 'Build fitness and team spirit through various athletic activities.',
      icon: <Dumbbell className="w-8 h-8" />,
      members: 67,
      category: 'Sports',
    },
    {
      id: 8,
      name: 'International Club',
      description: 'Explore different cultures and practice language skills with peers.',
      icon: <Globe className="w-8 h-8" />,
      members: 41,
      category: 'Cultural',
    },
  ];

  const categories = ['All', 'Academic', 'Arts', 'Technology', 'Sports', 'Cultural'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#2D5F7F] to-[#5B9BD5] bg-clip-text text-transparent">
            Exulify
          </h1>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Explore Extracurriculars</h2>
          <p className="text-gray-600 text-lg">Discover and join clubs that match your interests</p>
        </div>

        <div className="mb-8 flex gap-3 flex-wrap">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`px-5 py-2 rounded-full font-medium transition-all ${
                index === 0
                  ? 'bg-gradient-to-r from-[#2D5F7F] to-[#1F4A61] text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-[#2D5F7F] hover:shadow-md'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {extracurriculars.map((activity) => (
            <div
              key={activity.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer hover:-translate-y-1"
            >
              <div className="h-24 bg-gradient-to-r from-[#5B9BD5] to-[#2D5F7F] flex items-center justify-center">
                <div className="text-white opacity-80 group-hover:opacity-100 transition-opacity">
                  {activity.icon}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{activity.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{activity.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <span className="inline-block px-3 py-1 bg-blue-50 text-[#2D5F7F] text-xs font-semibold rounded-full">
                    {activity.category}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">{activity.members} members</span>
                </div>

                <button className="w-full py-2.5 bg-gradient-to-r from-[#2D5F7F] to-[#1F4A61] text-white rounded-lg font-medium text-sm hover:shadow-lg transition-all">
                  Join Club
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
