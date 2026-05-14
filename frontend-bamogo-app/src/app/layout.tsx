import { AuthProvider } from "@/contexte/authContext";
import "./globals.css";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "ETS BAMOGO MADI & FRERES",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">

      <body className="bg-(--background)">

        <AuthProvider>
          {children}
        </AuthProvider>
      </body>

    </html>
  );
}
