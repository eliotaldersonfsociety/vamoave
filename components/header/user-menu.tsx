"use client";

import {
  UserButton,
  SignInButton,
  useUser
} from "@clerk/nextjs";
import {
  User as UserIcon,
  LayoutDashboard,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function UserMenu() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname(); // 👈 esto detecta la ruta actual
  const [loading, setLoading] = useState(false);

  const goToDashboard = () => {
    setLoading(true);
    router.push("/dashboards");
  };

  // 👇 Cuando cambia la ruta, detenemos el loading
  useEffect(() => {
    if (pathname === "/dashboards") {
      setLoading(false);
    }
  }, [pathname]);

  if (!isLoaded) {
    return <span className="animate-pulse h-5 w-5 bg-gray-300 rounded-full" />;
  }

  return (
    <div className="flex items-center gap-2">
      {isSignedIn ? (
        <>
          <Button
            variant="secondary"
            size="sm"
            onClick={goToDashboard}
            className="flex items-center gap-1"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Cargando...
              </>
            ) : (
              <>
                <LayoutDashboard className="h-4 w-4" />
                Panel
              </>
            )}
          </Button>
          <UserButton afterSignOutUrl="/" />
        </>
      ) : (
        <SignInButton mode="modal">
          <Button variant="ghost" size="icon" className="relative rounded-full">
            <UserIcon className="h-5 w-5" />
          </Button>
        </SignInButton>
      )}
    </div>
  );
}
