import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Worges Editoração | Do original à publicação",
  description: "Serviços editoriais completos, acompanhamento da obra e publicação profissional para autores independentes.",
  other: { "codex-preview": "development" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
