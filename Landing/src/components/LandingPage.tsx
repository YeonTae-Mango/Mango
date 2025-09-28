import { Download } from "lucide-react";
import Navigation from "./Navigation";

function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <div style={{ display: 'none' }}>
        <Navigation />
      </div>
      <nav className="flex justify-between items-center px-8 py-6 bg-white">
        <div className="text-3xl font-bold text-coral-500" style={{ color: '#FF6B6B' }}>
          mango
        </div>
        <div className="flex gap-8 text-gray-700">
          <a href="#" className="hover:text-coral-500 transition-colors">About</a>
          <a href="#" className="hover:text-coral-500 transition-colors">Service</a>
          <a href="#" className="hover:text-coral-500 transition-colors">Download</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[700px] bg-gradient-to-br from-white to-gray-50">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/src/assets/backgroud.png)' }}
        ></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-white/30"></div>
        
        <div className="relative z-10 container mx-auto px-10 pt-50">
          <div className="max-w-2xl">
            <h1 className="text-8xl font-bold mb-12" style={{ color: '#FF6D60' }}>
              mango
            </h1>
            <p className="text-3xl font-bold text-white mb-2">
              나도 몰랐던 내 <span className="text-[#FF6D60]">진심</span>을 통한 인연찾기
            </p>
            <p className="text-lg text-white mb-6">
              소비패턴을 분석해 당신의 라이프 스타일과 가치관이 맞는 상대를 찾아드립니다.
              <br />
              더 이상 겉모습만 보고 판단하지 마세요.
            </p>
            
            <button 
              className="text-white px-10 py-3 rounded-full text-lg font-bold flex items-center gap-4 transition-all hover:shadow-lg mb-2"
              style={{ backgroundColor: '#FF6D60' }}
            >
              <Download size={24} />
              Download
            </button>
            <p className="text-sm text-white/50 mb-6">
              * 안드로이드에서만 다운로드 가능합니다.
            </p>
          </div>
        </div>
      </section>

      {/* 나의 소비패턴 분석 Section */}
      <section className="py-20" style={{ backgroundColor: '#FF6D60' }}>
        <div className="container mx-auto px-8">
          <div className="flex items-center justify-center gap-12">
            {/* Left Side - Phone Mockup */}
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <img 
                  src="/src/assets/mypattern.png" 
                  alt="나의 소비패턴 분석"
                  className="w-80 object-cover rounded-[2.5rem] shadow-2xl"
                />
              </div>
            </div>

            {/* Right Side - Another Phone */}
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <img 
                  src="/src/assets/mypattern2.png" 
                  alt="월별 소비 내역"
                  className="w-80 object-cover rounded-[2.5rem] shadow-2xl"
                />
              </div>
            </div>

            {/* Center Text */}
            <div className="text-white text-left max-w-md">
              <div className="bg-yellow-400 text-black px-3 py-2 rounded-full text-sm inline-block font-bold mb-4">
                🤖 AI 소비 분석
              </div>
              <h2 className="text-3xl font-bold mb-4">나의 소비패턴 분석</h2>
              <p className="text-lg opacity-90">
                마이데이터를 AI가 분석하여 핫플형, 뷰티형, 스포츠형 등
                <br />
                당신만의 라이프 스타일 유형을 정확하게 파악합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 카테고리별 스와이프 Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-8">
          <div className="flex items-center gap-8">
            {/* Left Side - Text */}
            <div className="flex-1">
              <div className="bg-yellow-400 text-black px-3 py-2 rounded-full text-sm font-bold inline-block mb-4">
                🩷 스마트 매칭
              </div>
              <h2 className="text-4xl font-bold mb-6 text-gray-800">
                카테고리별 스와이프
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                핫플형, 쇼핑형, 예술가형, 뷰티형 등 관심 유형별로 상대방을 만나보세요.
                <br />
                같은 취향을 가진 사람들과 더 쉽게 연결될 수 있습니다.
              </p>
            </div>

            {/* Right Side - Phone Mockup */}
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <img 
                  src="/src/assets/category.png" 
                  alt="카테고리별 스와이프"
                  className="w-80 object-cover rounded-[2.5rem] shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 채팅 & 소비패턴 궁합 Section */}
      <section className="py-20" style={{ backgroundColor: '#FF6D60' }}>
        <div className="container mx-auto px-8">
          <div className="flex items-center gap-12">
            {/* Left Side - Phone Mockup */}
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <img 
                  src="/src/assets/pattern.png" 
                  alt="소비패턴 분석"
                  className="w-80 object-cover rounded-[2.5rem] shadow-2xl"
                />
              </div>
            </div>

            {/* Center Text */}
            <div className="text-white max-w-md">
              <div className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold inline-block mb-4">
                💭 실시간 소통
              </div>
              <h2 className="text-3xl font-bold mb-4">채팅 & 소비패턴 궁합</h2>
              <p className="text-lg opacity-90">
                매칭이 성사되면 채팅으로 대화를 시작하고,
                <br />
                상대방과의 소비패턴 궁합도 확인할 수 있습니다.
              </p>
            </div>

            {/* Right Side - Another Phone */}
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <img 
                  src="/src/assets/chat.png" 
                  alt="채팅"
                  className="w-80 object-cover rounded-[2.5rem] shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
