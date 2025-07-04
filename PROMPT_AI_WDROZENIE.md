# 🤖 **PROMPT DLA MODELU AI - WDROŻENIE ZMIAN FLOWBITE PRO**

## 📋 **KONTEKST PROJEKTU**

Jesteś doświadczonym developerem React + TypeScript pracującym nad projektem **AA** - aplikacją do zarządzania dostawami i inwentaryzacją. Projekt używa następującego stack technologicznego:

### **🛠 STACK TECHNOLOGICZNY:**

- **Frontend**: React 19.1.0 + TypeScript + Vite 6.2.6
- **UI Framework**: Flowbite React 0.11.8 + Flowbite Pro Blocks
- **Styling**: Tailwind CSS v4.1.10 + tailwind-merge 3.3.1
- **Routing**: React Router DOM 7.6.2
- **State Management**: Zustand 5.0.6
- **API**: Axios + TanStack Query 5.81.5
- **Backend**: Node.js + Express + PostgreSQL/AWS RDS

### **🏗 AKTUALNA STRUKTURA PROJEKTU:**

```
AA/
├── src/
│   ├── api/                    # API calls (axios + TanStack Query)
│   ├── components/
│   │   ├── authentication/     # Komponenty autoryzacji
│   │   ├── flowbite-pro/       # Flowbite Pro blocks (NAPRAWIONE)
│   │   ├── navbar/             # Nawigacja górna
│   │   ├── sidebar/            # Boczne menu (Admin/Staff/Supplier)
│   │   ├── tables/             # Tabele z twMerge
│   │   └── common/             # Komponenty wspólne
│   ├── layouts/                # Layout komponenty (Admin/Staff/Supplier)
│   ├── pages/                  # Strony aplikacji
│   │   ├── admin/              # Panel administratora
│   │   ├── staff/              # Panel personelu
│   │   └── supplier/           # Panel dostawców
│   ├── stores/                 # Zustand stores
│   ├── theme/                  # Custom theme Flowbite
│   └── utils/                  # Utility functions
├── backend/                    # Node.js backend
├── INSTRUKCJE_TWORZENIA_BLOKOW_FLOWBITE.md  # ✅ NOWY PRZEWODNIK
└── PROMPT_AI_WDROZENIE.md                   # ✅ TEN PLIK
```

## 🎯 **NAJNOWSZE WDROŻONE FUNKCJONALNOŚCI**

### **✅ 1. INTEGRACJA `twMerge` (KOMPLETNA)**

- Dodana do wszystkich komponentów sidebar (Admin/Staff/Supplier)
- Zaimplementowana w tabeli `tabela-rozwijana-produkty.tsx`
- Konfiguracja VS Code dla IntelliSense
- Prettier i ESLint support

### **✅ 2. POPRAWKI FLOWBITE PRO BLOCKS**

- `globals.css` - aktualizacja do Tailwind CSS v4
- `layout.tsx` - przekształcenie z Next.js na React
- `page.tsx` - integracja z React Router
- Usunięcie konfliktów Next.js vs Vite

### **✅ 3. NOWY SYSTEM STYLOWANIA**

- Kondycjonalne stylowanie na podstawie danych
- Responsywne komponenty z twMerge
- Dark mode support
- Integracja z Flowbite theme

## 🎯 **ZADANIA DO WYKONANIA**

### **PRIORYTET 1: WDROŻENIE `twMerge` W POZOSTAŁYCH KOMPONENTACH**

#### **A. Komponenty do aktualizacji:**

1. `src/components/navbar/DashboardNavbar.tsx`
2. `src/layouts/AdminLayout.tsx`
3. `src/layouts/StaffLayout.tsx`
4. `src/layouts/SupplierLayout.tsx`
5. `src/pages/admin/AdminDashboardPage.tsx`
6. `src/pages/staff/StaffDashboardPage.tsx`
7. `src/pages/supplier/SupplierDashboardPage.tsx`

#### **Wzorzec do zastosowania:**

```typescript
import { twMerge } from "tailwind-merge";

// Kondycjonalne stylowanie
const getComponentClasses = (condition: boolean) => {
  return twMerge(
    "base-classes",
    condition && "conditional-classes",
    props.className
  );
};

// Użycie w JSX
<div className={getComponentClasses(isActive)} />
```

### **PRIORYTET 2: OPTYMALIZACJA KOMPONENTÓW FLOWBITE PRO**

#### **A. Integracja z głównym projektem:**

1. Przenieś przydatne komponenty z `flowbite-pro/` do `components/blocks/`
2. Dostosuj importy do głównej struktury
3. Usuń niepotrzebne pliki Next.js

#### **B. Komponenty do przeniesienia:**

- Advanced tables → `components/tables/`
- Create forms → `components/forms/`
- Dashboard navbars → `components/navbar/`
- Application shells → `layouts/`

### **PRIORYTET 3: UNIFIKACJA STYLOWANIA**

#### **A. Stwórz centralne style:**

```typescript
// src/utils/styleHelpers.ts
export const getStatusClasses = (status: string) => {
  return twMerge(
    "rounded-full px-3 py-1 text-sm font-medium",
    status === "active" && "bg-green-100 text-green-800 dark:bg-green-900/20",
    status === "inactive" && "bg-red-100 text-red-800 dark:bg-red-900/20",
  );
};
```

#### **B. Standardowe wzorce:**

- Button variants z twMerge
- Card components z kondycjonalnym stylowaniem
- Table components z responsive design
- Form components z error states

## 📋 **REGUŁY I NAJLEPSZE PRAKTYKI**

### **🔥 KRYTYCZNE ZASADY:**

1. **ZAWSZE używaj `twMerge` zamiast template literals dla klas CSS**
2. **Przestrzegaj TypeScript strict mode** - brak `any`
3. **Używaj Flowbite React komponentów** zamiast custom HTML
4. **Implementuj dark mode support** dla wszystkich komponentów
5. **Dodawaj proper TypeScript interfaces** dla wszystkich props

### **📐 KONWENCJE STYLOWANIA:**

```typescript
// ✅ DOBRZE
const className = twMerge(
  "base-classes",
  condition && "conditional-classes",
  props.className,
);

// ❌ ŹLE
const className = `base-classes ${condition ? "conditional-classes" : ""} ${props.className}`;
```

### **🎨 WZORCE KOMPONENTÓW:**

```typescript
interface ComponentProps {
  className?: string;
  variant?: "default" | "primary" | "secondary";
  children?: React.ReactNode;
  // ... inne props
}

export const Component: FC<ComponentProps> = ({
  className,
  variant = "default",
  children,
  ...props
}) => {
  const componentClasses = twMerge(
    "base-classes transition-all duration-200",
    variant === "primary" && "primary-classes",
    variant === "secondary" && "secondary-classes",
    className
  );

  return (
    <FlowbiteComponent className={componentClasses} {...props}>
      {children}
    </FlowbiteComponent>
  );
};
```

## 🔍 **WORKFLOW WYKONANIA**

### **KROK 1: ANALIZA I PLANOWANIE**

1. Przejrzyj każdy komponent pod kątem miejsc do dodania `twMerge`
2. Zidentyfikuj powtarzające się wzorce stylowania
3. Zaplanuj strukturę helper functions

### **KROK 2: IMPLEMENTACJA**

1. Dodaj import `twMerge` do komponentu
2. Zamień istniejące template literals na `twMerge`
3. Dodaj kondycjonalne stylowanie gdzie sensowne
4. Sprawdź dark mode compatibility

### **KROK 3: TESTOWANIE**

1. Sprawdź czy komponenty działają poprawnie
2. Przetestuj responsive design
3. Sprawdź dark/light mode
4. Upewnij się że TypeScript nie ma błędów

### **KROK 4: OPTYMALIZACJA**

1. Wydziel powtarzające się wzorce do helpers
2. Skonsoliduj podobne komponenty
3. Udokumentuj nowe wzorce

## 🎯 **PRZYKŁADY IMPLEMENTACJI**

### **Navbar z twMerge:**

```typescript
export const DashboardNavbar: FC<NavbarProps> = ({ isCollapsed, onToggle }) => {
  const navbarClasses = twMerge(
    "fixed top-0 left-0 right-0 z-50 transition-all duration-200",
    "bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700",
    isCollapsed ? "md:ml-16" : "md:ml-64"
  );

  const brandClasses = twMerge(
    "flex items-center space-x-3",
    isCollapsed && "md:justify-center"
  );

  return (
    <Navbar className={navbarClasses}>
      <Navbar.Brand className={brandClasses}>
        {/* Brand content */}
      </Navbar.Brand>
    </Navbar>
  );
};
```

### **Layout z kondycjonalnym stylowaniem:**

```typescript
export const AdminLayout: FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const mainClasses = twMerge(
    "min-h-screen transition-all duration-200",
    "pt-16", // Navbar height
    sidebarOpen ? "md:ml-64" : "md:ml-16"
  );

  const contentClasses = twMerge(
    "p-4 md:p-6",
    "bg-gray-50 dark:bg-gray-900",
    "min-h-[calc(100vh-4rem)]"
  );

  return (
    <div className="relative">
      <DashboardNavbar isCollapsed={!sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <AdminSidebar isOpen={sidebarOpen} />
      <main className={mainClasses}>
        <div className={contentClasses}>
          {children}
        </div>
      </main>
    </div>
  );
};
```

## 🚨 **POTENCJALNE PROBLEMY I ROZWIĄZANIA**

### **Problem 1: Konflikty klas Tailwind**

```typescript
// ❌ Może powodować konflikty
className="p-4 p-6"

// ✅ twMerge rozwiązuje konflikty
className={twMerge("p-4", "p-6")} // Rezultat: "p-6"
```

### **Problem 2: Zagnieżdżone warunki**

```typescript
// ✅ Czytelne zagnieżdżenie z twMerge
const complexClasses = twMerge(
  "base-classes",
  condition1 && "class1",
  condition2 && condition3 && "class2",
  !condition1 && condition2 && "class3",
  props.className,
);
```

### **Problem 3: Performance**

```typescript
// ✅ Używaj useMemo dla skomplikowanych obliczeń
const expensiveClasses = useMemo(() => {
  return twMerge(
    "base",
    complexCondition && "conditional",
    // ... wiele warunków
  );
}, [dependencies]);
```

## 📊 **METRYKI SUKCESU**

Po wdrożeniu zmian projekt powinien mieć:

- ✅ 0 błędów TypeScript
- ✅ 0 ostrzeżeń ESLint dotyczących stylowania
- ✅ Wszystkie komponenty używają `twMerge`
- ✅ Spójny dark mode we wszystkich komponentach
- ✅ Responsywny design na wszystkich ekranach
- ✅ Poprawne hover/focus states

## 🔧 **NARZĘDZIA I KOMENDY**

```bash
# Sprawdzenie błędów
npm run lint

# Formatowanie kodu
npm run format

# Uruchomienie dev serwera
npm run dev

# Build produkcyjny
npm run build

# TypeScript check
npx tsc --noEmit
```

## 🎯 **REZULTAT FINALNY**

Po wykonaniu wszystkich zadań projekt będzie miał:

1. **Spójny system stylowania** z `twMerge` we wszystkich komponentach
2. **Zoptymalizowane komponenty Flowbite Pro** zintegrowane z główną strukturą
3. **Responsywne i dostępne UI** z dark mode support
4. **Czytelny kod** zgodny z best practices TypeScript + React
5. **Wydajną aplikację** gotową do dalszego rozwoju

---

**⚡ ROZPOCZNIJ od komponentów o najwyższym priorytecie i systematycznie przejdź przez całą listę!**
