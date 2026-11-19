import React from 'react'
import {
  HiChip,
  HiExternalLink,
  HiCode,
  HiAcademicCap,
  HiLightningBolt,
} from 'react-icons/hi'
import { FaGithub } from 'react-icons/fa'
import { BiAtom, BiBookOpen } from 'react-icons/bi'
import { playClickSound } from '../../utils/audio'

export function AboutSection() {
  const experiences = [
    {
      title: '2026 Kayseri MEB Uluslararası Robot Yarışması',
      role: 'Temel Seviye Çizgi İzleyen Robot Ekibi',
      desc: 'Sensör dizisi kalibrasyonu, optik çizgi izleme, motor sürücü devreleri ve C/C++ tabanlı gerçek zamanlı PID kontrol algoritmaları.',
      icon: <HiChip className="text-xl text-sky-400" />,
    },
    {
      title: 'Laboratuvar Dedektifi (3D Bilim Motoru)',
      role: 'Proje Mimarı & Geliştirici',
      desc: 'Tarayıcı üzerinde fizik kurallarına uygun Kimya, Fizik ve Biyoloji simülasyonları geliştiren 3D etkileşimli eğitim platformu.',
      icon: <BiAtom className="text-xl text-emerald-400" />,
    },
    {
      title: 'Yanlış Değil Platformu',
      role: 'İçerik & Sistem Tasarımı',
      desc: 'Toplumda ve derslerde sıkça yapılan kavram yanılgılarını yakalayan, felsefe ve bilim odaklı sade eğitim arayüzü.',
      icon: <BiBookOpen className="text-xl text-blue-400" />,
    },
  ]

  const skills = [
    { category: 'Donanım & Robotik', items: ['Gömülü Sistemler (Embedded)', 'C / C++', 'Sensör Kalibrasyonu & PID', 'Devre Tasarımı & Elektronik'] },
    { category: 'Yazılım & Web', items: ['Python', 'Three.js / WebGL 3D', 'React & Modern Frontend', 'Algoritmik Modelleme'] },
  ]

  return (
    <section className="relative w-full py-20 px-4 sm:px-8 max-w-6xl mx-auto z-20">
      {/* Header */}
      <div className="mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-400 text-xs font-mono mb-3">
          <span>HERONJI.FX // MÜHENDİSLİK &amp; GELİŞTİRME</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-100">
          Hakkımda &amp; Mühendislik Çalışmaları
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-2xl font-normal">
          Donanım, gömülü yazılım ve tarayıcı tabanlı 3D simülasyonlar geliştiren bağımsız bir geliştiriciyim.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Real Engineering Experience */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Deneyim &amp; Projeler
          </h3>

          {experiences.map((exp, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 shrink-0">
                  {exp.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-100 text-base">
                    {exp.title}
                  </h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {exp.role}
                  </p>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {exp.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Skills & Quick Links */}
        <div className="lg:col-span-5 space-y-6">
          {/* Skills Matrix */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Teknik Yetkinlikler
            </h3>

            <div className="space-y-4">
              {skills.map((s, idx) => (
                <div key={idx}>
                  <div className="text-xs font-mono text-slate-300 font-semibold mb-2">
                    {s.category}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {s.items.map((item, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md text-xs bg-slate-800 text-slate-200 border border-slate-700"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real Live Projects Links */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Canlı Platformlar
            </h3>

            <div className="space-y-2">
              <a
                href="https://lab-dedektifi.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playClickSound()}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-800/70 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <BiAtom className="text-base text-emerald-400" />
                  <span>Laboratuvar Dedektifi</span>
                </div>
                <HiExternalLink className="text-slate-400" />
              </a>

              <a
                href="https://yanlisdegil.github.io/Yanlis-Degil/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playClickSound()}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-800/70 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <BiBookOpen className="text-base text-sky-400" />
                  <span>Yanlış Değil Platformu</span>
                </div>
                <HiExternalLink className="text-slate-400" />
              </a>

              <a
                href="https://github.com/YanlisDegil"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playClickSound()}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-800/70 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <FaGithub className="text-base text-slate-300" />
                  <span>GitHub (@YanlisDegil)</span>
                </div>
                <HiExternalLink className="text-slate-400" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer minimal info */}
      <footer className="mt-16 pt-6 border-t border-slate-800/80 text-center text-xs font-mono text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          HERONJI TOPLULUĞU &copy; 2026 // Heronji.fx
        </div>
        <div className="flex items-center gap-5">
          <a
            href="https://github.com/YanlisDegil/Heronji-Main"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-300 transition-colors"
          >
            Kaynak Kodu
          </a>
          <a
            href="https://yanlisdegil.github.io/Yanlis-Degil/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-300 transition-colors"
          >
            Yanlış Değil
          </a>
          <a
            href="https://lab-dedektifi.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-300 transition-colors"
          >
            Laboratuvar Dedektifi
          </a>
        </div>
      </footer>
    </section>
  )
}
