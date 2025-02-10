import React from "react";
import LayoutGlobal from "../layout/LayoutGlobal";

export default function ListWeb() {
  const websites = [
    {
      name: "IMT",
      url: "http://imt.metfone.com.kh/",
    },
    {
      name: "CNOC",
      url: "http://10.79.9.206:9000/",
    },
    {
      name: "Data Security",
      url: "http://datasecurity.metfone.com.kh/",
    },
    {
      name: "NIMS",
      url: "http://100.99.3.4:8082/passportv3/login?appCode=NIMS_V2&service=http%3A%2F%2F10.79.83.193%3A9004%2FNIMS%2FIndex.do",
    },
    {
      name: " Employee Info",
      url: "http://10.30.132.248:8188/ESS/authenticateAction.do?_vt=979af99c5ee09832f619950516ec8d6e",
    },
    {
      name: "VOffice",
      url: "http://voffice.viettel.vn/app-view/",
    },
    {
      name: "IMaster NCE",
      url: "https://10.79.43.115:31943/",
    },
    {
      name: "IP Monitor System",
      url: "https://10.79.25.116/#top",
    },
  ];

  return (
    <LayoutGlobal>
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-black text-center mb-6">
            🌐 Website FBB
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {websites.map((site, index) => (
              <a
                key={index}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-transform transform hover:-translate-y-1"
              >
                <h2 className="text-xl font-semibold text-[#974a06]">
                  {site.name}
                </h2>
              </a>
            ))}
          </div>
        </div>
      </div>
    </LayoutGlobal>
  );
}
