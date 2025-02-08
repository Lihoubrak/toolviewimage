import React from "react";
import LayoutGlobal from "../layout/LayoutGlobal";

export default function ListWeb() {
  const websites = [
    {
      name: "GitHub",
      url: "https://github.com",
      description: "Lưu trữ mã nguồn và quản lý dự án.",
    },
    {
      name: "Stack Overflow",
      url: "https://stackoverflow.com",
      description: "Hỏi đáp lập trình, debug code.",
    },
    {
      name: "MDN Web Docs",
      url: "https://developer.mozilla.org",
      description: "Tài liệu chính thức về web (HTML, CSS, JS).",
    },
    {
      name: "W3Schools",
      url: "https://www.w3schools.com",
      description: "Học lập trình từ cơ bản đến nâng cao.",
    },
    {
      name: "FreeCodeCamp",
      url: "https://www.freecodecamp.org",
      description: "Khoá học lập trình miễn phí.",
    },
    {
      name: "LeetCode",
      url: "https://leetcode.com",
      description: "Luyện thuật toán và kỹ năng phỏng vấn.",
    },
    {
      name: "Codeforces",
      url: "https://codeforces.com",
      description: "Thi đấu lập trình competitive programming.",
    },
    {
      name: "HackerRank",
      url: "https://www.hackerrank.com",
      description: "Luyện tập code và phỏng vấn kỹ thuật.",
    },
    {
      name: "GeeksforGeeks",
      url: "https://www.geeksforgeeks.org",
      description: "Tài nguyên lập trình và thuật toán.",
    },
    {
      name: "DevDocs",
      url: "https://devdocs.io",
      description: "Tài liệu lập trình đa ngôn ngữ, dễ tra cứu.",
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
                <p className="text-gray-700 mt-2">{site.description}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </LayoutGlobal>
  );
}
