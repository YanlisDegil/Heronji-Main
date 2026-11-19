import React from 'react'
import {
  HiCode,
  HiLightningBolt,
  HiCube,
  HiGlobeAlt,
  HiExternalLink,
  HiShieldCheck,
  HiTerminal,
} from 'react-icons/hi'
import { FaGithub, FaDiscord } from 'react-icons/fa'
import { BiAtom, BiBrain } from 'react-icons/bi'
import { playClickSound, playHoverSound } from '../../utils/audio'

export function AboutSection() {
  const skills = [
    { name: 'Three.js / WebGL / R3F', level: '95%', desc: '3D Sahne, gölgelendirme, fizik ve procedural animasyonlar' },
    { name: 'Modern Frontend (React 18 / Vite)', level: '98%', desc: 'Bileşen mimarisi, state yönetimi, mikro animasyonlar' },
    { name: 'AI & Ajanik Sistemler (Gemini 2.0 / 3.8)', level: '92%', desc: 'Otonom ajanlar, bağlam yönetimi, yapay zeka entegrasyonu' },
    { name: 'Sistem & Donanım Entegrasyonu', level: '85%', desc: 'WebSocket, gerçek zamanlı telemetri, otonom protokoller' },
    { name: 'Tailwind CSS & Glassmorphism UI', level: '96%', desc: 'Göz alıcı fütüristik arayüzler, modern tasarım dili' },
  ]

  const stats = [
    { value: '5', label: 'Ana Sistem Modülü' },
    { value: '3D', label: 'Gerçek Zamanlı Render Motoru' },
    { value: '118+', label: 'Kimyasal Element Simülasyonu' },
    { value: '%100', label: 'Bağımsız & Otonom Mimari' },
  ]

  return (
    <section className="relative w-full py-24 px-4 sm:px-8 max-w-7xl mx-auto z-20">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-600/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-violet-600/10 blur-[140px] pointer-events-none rounded-full" />

      {/* Section Header */}
      <div className="text-center mb-16 relative">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-xs font-mono mb-4">
          <HiTerminal className="text-sm" />
          <span>SİSTEM DOSYASI // HERONJI.FX GİZLİ PROTOKOL</span>
        </div>
        <h2 className="font-orbitron text-3xl sm:text-5xl font-extrabold tracking-wide text-slate-100 text-glow-cyan">
          HAKKIMDA &amp; TOPLULUK
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto font-sans">
          Geleceğin interaktif web deneyimlerini, 3D bilim simülasyonlarını ve yapay zeka ajanlarını inşa eden geliştirici platformu.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Developer Profile Card */}
        <div className="lg:col-span-5 glass-panel-glow p-6 sm:p-8 rounded-2xl relative overflow-hidden group">
          {/* Top highlight bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-violet-500 to-amber-500" />

          {/* Profile Identity */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-600 to-violet-700 p-0.5 shadow-[0_0_20px_rgba(56,189,248,0.4)]">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <BiBrain className="text-3xl text-cyan-400 animate-pulse-slow" />
              </div>
            </div>
            <div>
              <h3 className="font-orbitron font-bold text-xl text-slate-100">
                Heronji.fx
              </h3>
              <p className="text-xs font-mono text-cyan-400">
                Creative Web Developer &amp; Systems Architect
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-mono text-emerald-400">HERONJI TOPLULUĞU ÇEKİRDEĞİ</span>
              </div>
            </div>
          </div>

          {/* Bio text */}
          <p className="text-sm text-slate-300 leading-relaxed font-sans mb-6">
            Dijital dünyayı sıradan statik sayfaların ötesine taşıyarak; tarayıcı üzerinde 
            canlı çalışan 3D simülasyonlar, karmaşık bilimsel modeller ve otonom sistemler 
            tasarlıyorum. <strong>Heronji Topluluğu</strong>, bilimi, felsefeyi ve yapay zeka 
            ajanlarını tek bir fütüristik çatıda buluşturan bağımsız bir geliştirici ekosistemidir.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {stats.map((s, idx) => (
              <div
                key={idx}
                onMouseEnter={playHoverSound}
                className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-center hover:border-cyan-500/40 transition-colors"
              >
                <div className="font-orbitron font-bold text-xl sm:text-2xl text-cyan-400">
                  {s.value}
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Social Links & Action */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-800/80">
            <a
              href="https://github.com/YanlisDegil"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playClickSound()}
              onMouseEnter={playHoverSound}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-white text-xs font-semibold transition-all hover:border-cyan-500/50"
            >
              <FaGithub className="text-base" />
              <span>GitHub Profili</span>
              <HiExternalLink className="text-slate-400" />
            </a>

            <a
              href="https://lab-dedektifi.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playClickSound()}
              onMouseEnter={playHoverSound}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
            >
              <BiAtom className="text-base" />
              <span>Lab Dedektifi</span>
              <HiExternalLink />
            </a>
          </div>
        </div>

        {/* Right Column: Skills & Community Vision */}
        <div className="lg:col-span-7 space-y-6">
          {/* Skills Matrix Panel */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl relative">
            <div className="flex items-center gap-2.5 mb-6">
              <HiCode className="text-2xl text-cyan-400" />
              <h3 className="font-orbitron font-bold text-lg text-slate-100">
                TEKNOLOJİK YETKİNLİKLER (SKILLS)
              </h3>
            </div>

            <div className="space-y-4">
              {skills.map((skill, idx) => (
                <div key={idx} onMouseEnter={playHoverSound} className="group">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-mono font-medium text-slate-200 group-hover:text-cyan-400 transition-colors">
                      {skill.name}
                    </span>
                    <span className="font-mono text-cyan-400 font-bold">{skill.level}</span>
                  </div>
                  {/* Progress bar container */}
                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 group-hover:from-cyan-400 group-hover:to-violet-400 transition-all duration-700 shadow-[0_0_10px_rgba(56,189,248,0.5)]"
                      style={{ width: skill.level }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans mt-1">
                    {skill.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Heronji Topluluğu Vision Manifesto */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border-l-4 border-l-cyan-400 relative">
            <div className="flex items-center gap-2.5 mb-3">
              <HiShieldCheck className="text-2xl text-cyan-400" />
              <h3 className="font-orbitron font-bold text-lg text-slate-100">
                HERONJI TOPLULUĞU VİZYONU
              </h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed font-sans mb-4">
              "Amacımız, teknolojiyi sadece tüketen değil; yeni nesil görsel simülasyonlar, 
              yapay zeka asistanları (J.A.R.V.I.S., Friday, Ultron) ve bilimsel keşif araçları 
              üreterek geleceğin dijital standartlarını belirleyen bir topluluk olmak."
            </p>
            <div className="flex flex-wrap gap-2">
              {['3D BİLİM', 'ELEŞTİREL DÜŞÜNCE', 'YAPAY ZEKA', 'OTONOMİ', 'AÇIK KAYNAK'].map((tag, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold bg-slate-900/90 text-cyan-300 border border-slate-800"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer minimal info */}
      <footer className="mt-20 pt-8 border-t border-slate-900 text-center text-xs font-mono text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          HERONJI TOPLULUĞU &copy; 2026 // HERONJI.FX
        </div>
        <div className="flex items-center gap-6">
          <a
            href="https://github.com/YanlisDegil/Heronji-Main"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-400 transition-colors"
          >
            Kaynak Kodu
          </a>
          <a
            href="https://lab-dedektifi.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-400 transition-colors"
          >
            Laboratuvar Dedektifi
          </a>
        </div>
      </footer>
    </section>
  )
}
