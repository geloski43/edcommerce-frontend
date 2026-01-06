import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { useLocation } from "@tanstack/react-router"; // Import this

interface SubCategory {
  subCategoryId: string;
  name: string;
}

interface DropdownProps {
  subCategories: SubCategory[];
  selectedSubCatId: string | null;
  onSelect: (id: string | null) => void;
}

export function SubCategoryDropdown({
  subCategories,
  selectedSubCatId,
  onSelect,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get current location
  const location = useLocation();
  const isCategoriesPath = location.pathname === "/categories";

  const selectedSubCategory = subCategories.find(
    (c) => c.subCategoryId === selectedSubCatId,
  );

  const filteredSubCategories = subCategories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-60" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-card border px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-tighter transition-all duration-300 group ${
          isOpen
            ? "border-primary ring-4 ring-primary/10 shadow-lg"
            : "border-border hover:border-primary/50"
        }`}
      >
        <span className="truncate">
          {selectedSubCategory ? selectedSubCategory.name : "Select Collection"}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform duration-500 ease-out ${
            isOpen ? "rotate-180 text-primary" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-card border border-border rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top">
          {/* Search Header */}
          <div className="p-3 border-b border-border bg-muted/20 flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-transparent text-[10px] font-bold outline-none placeholder:text-muted-foreground/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button type="button" onClick={() => setSearchTerm("")}>
                <X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>

          <div className="max-h-60 overflow-y-auto no-scrollbar py-2">
            {/* CONDITIONAL RENDERING: Hide if path is /categories */}
            {!isCategoriesPath && (
              <button
                type="button"
                onClick={() => {
                  onSelect(null);
                  setIsOpen(false);
                  setSearchTerm("");
                }}
                className={`w-full text-left px-4 py-3 text-[10px] font-black uppercase transition-all ${
                  !selectedSubCatId
                    ? "text-primary bg-primary/5 border-l-4 border-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground border-l-4 border-transparent"
                }`}
              >
                All Assets
              </button>
            )}

            {filteredSubCategories.map((cat) => (
              <button
                type="button"
                key={cat.subCategoryId}
                onClick={() => {
                  onSelect(cat.subCategoryId);
                  setIsOpen(false);
                  setSearchTerm("");
                }}
                className={`w-full text-left px-4 py-3 text-[10px] font-black uppercase transition-all ${
                  selectedSubCatId === cat.subCategoryId
                    ? "text-primary bg-primary/5 border-l-4 border-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground border-l-4 border-transparent"
                }`}
              >
                {cat.name}
              </button>
            ))}

            {filteredSubCategories.length === 0 && (
              <div className="px-4 py-6 text-center text-[10px] font-bold text-muted-foreground uppercase italic opacity-50">
                Empty search result
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
