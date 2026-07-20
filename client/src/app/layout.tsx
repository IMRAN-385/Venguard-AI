"use client";

import React, { useState } from "react";
import "./globals.css"; 
import { Providers } from "./providers";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { VanguardCopilotDrawer } from "../components/VanguardCopilotDrawer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [copilotOpen, setCopilotOpen] = useState(false);

  return (
    <html lang="en" className="dark">
      <head>
        <title>Vanguard AI — Autonomous DeepTech Due Diligence & Investment Intelligence Platform</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
            <body className="bg-navy-950 text-slate-100 font-sans antialiased selection:bg-primary/30 selection:text-white min-h-screen flex flex-col">

        <Providers>
          <Navbar onOpenCopilot={() => setCopilotOpen(true)} />
          <main className="flex-1">{children}</main>
          <Footer />
          <VanguardCopilotDrawer isOpen={copilotOpen} onClose={() => setCopilotOpen(false)} />
        </Providers>
      </body>
    </html>
  );
}