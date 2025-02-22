/* eslint-disable react-hooks/rules-of-hooks */
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { motion } from "framer-motion";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import Logo from "/src/assets/logo-bbws-cc.svg";
import VoiceIcon from "/src/assets/ic-voice.svg";
import TrashIcon from "/src/assets/ic-trash.svg";
import SiJagaCaiIcon from "/src/assets/ic-sijagacai.svg";
import PintuAirIcon from "/src/assets/ic-pintuair.svg";
import MonitoringPeringatanIcon from "/src/assets/ic-monitoring.svg";
import KnowledgeCenterIcon from "/src/assets/ic-knowledge.svg";
import DroneIcon from "/src/assets/ic-drone.svg";
import DataWarehouseIcon from "/src/assets/ic-data-warehouse.svg";
import { UserService } from "@/services/user";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/welcome")({
  validateSearch: z.object({
    redirect: z.string().optional().catch(""),
  }),

  component: () => {
    // const { data: user, isLoading } = useQuery({
    //   queryKey: ["user", "2"],
    //   queryFn: () =>
    //     UserService.getUser({
    //       id: "2",
    //     }),
    //   // enabled: !!2,
    // });

    // console.log("user:", user, isLoading);
    const navigate = useNavigate()
    return (
      <>
        <div className="bg-primary-brand-600">
          <AuroraBackground>
            <div className="h-[80vh] flex items-center justify-center flex-col">
              <div className="mb-4">
                <TextGenerateEffect
                  words={
                    "Mengubah data menjadi keputusan, mewujudkan ketahanan pangan dengan langkah optimal"
                  }
                />
              </div>
              <motion.div
                initial={{ opacity: 0.0, y: 40 }}
                whileInView={{ opacity: 0.8, y: 0 }}
                transition={{
                  delay: 2,
                  duration: 0.8,
                  ease: "easeInOut",
                }}
                className="relative flex flex-col gap-4 items-center justify-center px-4"
              >
                <div className="text-3xl md:text-7xl font-bold text-white text-center mb-4">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FC76FA] to-[#5CB7EB] drop-shadow-lg">
                    AI Command Center
                  </span>
                </div>
                <div className="space-y-2 flex flex-col items-center justify-center">
                  <img src={Logo} alt="Logo" className="w-64 md:w-full" />
                </div>
                <button
                  className="bg-white rounded-2xl w-fit text-black px-4 py-2 hover:bg-gray-200"
                  onClick={() => {
                    navigate({ to: "/login" })
                  }}
                >
                  Masuk ke Dashboard
                </button>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0.0, y: 40 }}
              whileInView={{ opacity: 0.8, y: 0 }}
              transition={{
                delay: 2.2,
                duration: 0.8,
                ease: "easeInOut",
              }}
              className="relative flex flex-col gap-4 items-center justify-center px-4"
            >
              {/* <div className="text-2xl font-bold text-white text-center">
                Fitur
              </div> */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 ">

                <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-8 bg-white">
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    <div className="col-span-1 flex items-center justify-center">
                      <img
                        src={VoiceIcon}
                        alt="AI Assistant"
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                    <div className="col-span-3 flex items-center">
                      <p className="text-base sm:text-xl text-black">
                        Voice Command AI Assistant
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    AI yang mampu berinteraksi melalui suara dan dapat mengakses seluruh sistem informasi irigasi,
                    bendungan, serta infrastruktur sumber daya air di BBWS Citanduy secara real-time
                    untuk mendukung operasional yang efisien.
                  </p>
                </BackgroundGradient>

                <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-8 bg-white">
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    <div className="col-span-1 flex items-center justify-center">
                      <img
                        src={KnowledgeCenterIcon}
                        alt="AI Assistant"
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                    <div className="col-span-3 flex items-center">
                      <p className="text-base sm:text-xl text-black">
                        Knowledge Center
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Pusat Pengetahuan yang dirancang untuk memberikan akses
                    cepat dan akurat ke informasi melalui pencarian pintar, mendukung pengambilan
                    keputusan dan pemecahan masalah secara efisien.
                  </p>
                </BackgroundGradient>

                <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-8 bg-white">
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    <div className="col-span-1 flex items-center justify-center">
                      <img
                        src={DataWarehouseIcon}
                        alt="AI Assistant"
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                    <div className="col-span-3 flex items-center">
                      <p className="text-base sm:text-xl text-black">
                        Data warehouse
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Pusat penyimpanan data terstruktur yang mengintegrasikan informasi
                    dari berbagai sumber, termasuk data historis, untuk analisis
                    dan pengambilan keputusan yang lebih cepat dan akurat.
                  </p>
                </BackgroundGradient>

                <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-8 bg-white">
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    <div className="col-span-1 flex items-center justify-center">
                      <img
                        src={MonitoringPeringatanIcon}
                        alt="AI Assistant"
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                    <div className="col-span-3 flex items-center">
                      <p className="text-base sm:text-xl text-black">
                        Monitoring dan Peringatan
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Sistem yang dirancang untuk memantau kondisi secara real-time
                    dan memberikan peringatan dini terkait potensi masalah,
                    memastikan respons cepat dan pengelolaan yang efektif.
                  </p>
                </BackgroundGradient>

                <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-8 bg-white">
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    <div className="col-span-1 flex items-center justify-center">
                      <img
                        src={TrashIcon}
                        alt="AI Assistant"
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                    <div className="col-span-3 flex items-center">
                      <p className="text-base sm:text-xl text-black">
                        Sistem Deteksi Sampah
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Memantau dan mendeteksi keberadaan sampah di aliran air
                    untuk menjaga kelancaran operasional dan kualitas
                    lingkungan.
                  </p>
                </BackgroundGradient>

                <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-8 bg-white">
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    <div className="col-span-1 flex items-center justify-center">
                      <img
                        src={PintuAirIcon}
                        alt="AI Assistant"
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                    <div className="col-span-3 flex items-center">
                      <p className="text-base sm:text-xl text-black">
                        Deteksi Keamanan Pintu Air
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Sistem deteksi keberadaan orang tak berizin di area pintu
                    air untuk mencegah potensi gangguan.
                  </p>
                </BackgroundGradient>

                <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-8 bg-white">
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    <div className="col-span-1 flex items-center justify-center">
                      <img
                        src={DroneIcon}
                        alt="AI Assistant"
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                    <div className="col-span-3 flex items-center">
                      <p className="text-base sm:text-xl text-black">
                        Autonomous Drone Patrolling System
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Sistem pemantauan dan pengawasan penggunaan air dengan
                    menggunakan teknologi Autonomous Drone Patrolling System
                  </p>
                </BackgroundGradient>

                <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-8 bg-white">
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    <div className="col-span-1 flex items-center justify-center">
                      <img
                        src={SiJagaCaiIcon}
                        alt="AI Assistant"
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                    <div className="col-span-3 flex items-center">
                      <p className="text-base sm:text-xl text-black">
                        SI JAGA CAI
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Sistem pemantauan dan pengawasan penggunaan air dengan
                    menggunakan teknologi Autonomous Drone Patrolling System
                  </p>
                </BackgroundGradient>
              </div>
            </motion.div>

            <footer className="bg-primary-brand-700 text-white py-4 w-full mt-10">
              <div className="container mx-auto text-center">
                <p>
                  &copy; 2024{" "}
                  <a href="https://keenos.id" className="underline">
                    Tim Pengembang
                  </a>{" "}
                  Command Center BBWS Citanduy. All rights reserved.{" "}
                </p>
              </div>
            </footer>
          </AuroraBackground>
        </div>
      </>
    );
  },
});
