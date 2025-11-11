"use client"

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearch } from "./search-context";

export function SearchButton() {
  const { setSearchOpen } = useSearch();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setSearchOpen(true)}
      className="h-9 w-9"
      aria-label="Search posts"
    >
      <Search className="h-4 w-4" />
    </Button>
  );
}
