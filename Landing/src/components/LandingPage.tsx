import { Download, Heart, MapPin, Users } from "lucide-react";
import Navigation from "./Navigation";

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-red-50">
      <Navigation />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
          {/* Left Section - Hero Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
                새로운 만남을
                <br />
                <span className="text-orange-500">mango</span>에서
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                특별한 사람과의 소중한 인연을 만들어보세요.
                <br />
                mango와 함께 새로운 관계의 시작을 경험하세요.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-pink-100 p-2 rounded-lg">
                  <Heart className="text-pink-500" size={20} />
                </div>
                <span className="text-gray-700 font-medium">진심 어린 매칭</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <MapPin className="text-blue-500" size={20} />
                </div>
                <span className="text-gray-700 font-medium">위치 기반 만남</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Users className="text-green-500" size={20} />
                </div>
                <span className="text-gray-700 font-medium">검증된 프로필</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Download className="text-purple-500" size={20} />
                </div>
                <span className="text-gray-700 font-medium">간편한 사용</span>
              </div>
            </div>

            {/* Download Button */}
            <div>
              <a
                href="/app.apk"
                download="mango.apk"
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-10 py-4 rounded-full text-lg font-bold transition-all transform hover:scale-105 shadow-lg inline-flex items-center gap-3 no-underline"
              >
                <Download size={24} />
                mango 설치하기
              </a>
            </div>
          </div>

          {/* Right Section - Phone Mockup */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Phone Frame */}
              <div className="bg-gray-800 rounded-[3rem] p-2 shadow-2xl">
                <div className="bg-white rounded-[2.5rem] overflow-hidden w-80 h-[640px]">
                  {/* Status Bar */}
                  <div className="bg-white px-6 py-2 flex justify-between items-center text-sm">
                    <span className="font-medium">9:30</span>
                    <div className="w-4 h-4 bg-black rounded-full"></div>
                    <div className="flex gap-1">
                      <div className="w-4 h-3 bg-gray-400 rounded-sm"></div>
                      <div className="w-4 h-3 bg-gray-400 rounded-sm"></div>
                      <div className="w-4 h-3 bg-gray-900 rounded-sm"></div>
                    </div>
                  </div>

                  {/* App Header */}
                  <div className="bg-white px-6 py-4 flex justify-between items-center border-b">
                    <div className="text-2xl font-bold text-orange-500">mango</div>
                    <div className="flex gap-4">
                      <div className="w-6 h-6 bg-gray-300 rounded"></div>
                      <div className="w-6 h-6 bg-gray-300 rounded"></div>
                    </div>
                  </div>

                  {/* Profile Card */}
                  <div className="relative bg-gradient-to-br from-orange-500 to-pink-500 h-[400px] mx-4 my-4 rounded-2xl overflow-hidden shadow-lg">
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                      <div className="text-white">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-yellow-600 text-white px-2 py-1 rounded text-xs">21km</span>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-2xl font-bold">싸피 23</span>
                          <div className="bg-red-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                            <MapPin size={10} />
                            핫플헌터
                          </div>
                        </div>
                        <div className="flex gap-2 text-xs">
                          <span className="bg-white/20 px-2 py-1 rounded"># 카페인중독</span>
                          <span className="bg-white/20 px-2 py-1 rounded"># 직관러</span>
                          <span className="bg-white/20 px-2 py-1 rounded"># 단짠병</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-center gap-8 px-8 py-6">
                    <button className="bg-gray-200 hover:bg-gray-300 w-16 h-16 rounded-full flex items-center justify-center transition-colors">
                      <div className="text-gray-600 text-2xl">✕</div>
                    </button>
                    <button className="bg-red-400 hover:bg-red-500 w-16 h-16 rounded-full flex items-center justify-center transition-colors shadow-lg">
                      <Heart className="text-white" size={24} fill="currentColor" />
                    </button>
                  </div>

                  {/* Bottom Navigation */}
                  <div className="bg-white border-t flex justify-around py-2">
                    <div className="flex flex-col items-center gap-1 text-orange-500">
                      <div className="w-6 h-6 bg-orange-500 rounded"></div>
                      <span className="text-xs font-medium">홈</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-gray-400">
                      <div className="w-6 h-6 bg-gray-300 rounded"></div>
                      <span className="text-xs">카테고리</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-gray-400">
                      <div className="w-6 h-6 bg-gray-300 rounded"></div>
                      <span className="text-xs">좋아요</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-gray-400">
                      <div className="w-6 h-6 bg-gray-300 rounded"></div>
                      <span className="text-xs">채팅</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-gray-400">
                      <div className="w-6 h-6 bg-gray-300 rounded"></div>
                      <span className="text-xs">프로필</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 bg-gray-50 mt-16">
        <div className="container mx-auto px-6 text-center text-gray-600">
          <p>&copy; 2025 mango. SSAFY 13기 A408팀의 특화 프로젝트입니다!!.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
