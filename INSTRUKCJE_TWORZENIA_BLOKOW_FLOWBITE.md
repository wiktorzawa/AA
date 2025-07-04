# 🚀 **Instrukcje Tworzenia Bloków Flowbite Pro**

## 📋 **Przegląd Systemu**

Projekt używa **Flowbite Pro blocks** w architekturze **React + TypeScript + Vite + Tailwind CSS v4**.

### 🔧 **Konfiguracja Środowiska**

```bash
# Główne zależności
npm install flowbite-react react-icons tailwind-merge
npm install @types/react @types/react-dom --save-dev
```

### 📁 **Struktura Katalogów**

```
src/
├── components/
│   ├── flowbite-pro/          # Gotowe bloki Flowbite Pro
│   ├── common/                # Komponenty wspólne
│   └── blocks/                # Twoje custom bloki
├── theme/
│   └── custom-theme.ts        # Konfiguracja theme
└── utils/
    └── twMerge.ts             # Utility do łączenia klas
```

---

## ✨ **Tworzenie Nowego Bloku**

### **Krok 1: Szablon Podstawowy**

```typescript
// src/components/blocks/MojBlok.tsx
import type { FC } from "react";
import { Card, Button, Badge } from "flowbite-react";
import { twMerge } from "tailwind-merge";
import { HiHome, HiUser } from "react-icons/hi";

interface MojBlokProps {
  className?: string;
  title: string;
  description?: string;
  variant?: "default" | "primary" | "secondary";
  children?: React.ReactNode;
}

export const MojBlok: FC<MojBlokProps> = ({
  className,
  title,
  description,
  variant = "default",
  children,
}) => {
  // Logika stylowania z twMerge
  const blockClasses = twMerge(
    "w-full transition-all duration-200",
    variant === "primary" && "border-blue-500 bg-blue-50 dark:bg-blue-900/20",
    variant === "secondary" && "border-gray-300 bg-gray-50 dark:bg-gray-800",
    className
  );

  return (
    <Card className={blockClasses}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          {description && (
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>
        <Badge color="info">Nowy</Badge>
      </div>

      {children && (
        <div className="mt-4 border-t pt-4 dark:border-gray-700">
          {children}
        </div>
      )}

      <div className="flex justify-end space-x-2 mt-4">
        <Button color="gray">
          <HiUser className="mr-2 h-4 w-4" />
          Anuluj
        </Button>
        <Button>
          <HiHome className="mr-2 h-4 w-4" />
          Zapisz
        </Button>
      </div>
    </Card>
  );
};
```

### **Krok 2: Użycie Bloku**

```typescript
// src/pages/admin/AdminDashboardPage.tsx
import { MojBlok } from "@/components/blocks/MojBlok";

export function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <MojBlok
        title="Panel Administratora"
        description="Zarządzaj systemem"
        variant="primary"
      >
        <p>Dodatkowa zawartość bloku</p>
      </MojBlok>
    </div>
  );
}
```

---

## 🎨 **Stylowanie z `twMerge`**

### **Podstawowe Wzorce**

```typescript
// 1. Kondycjonalne stylowanie
const getStatusClasses = (status: string) => {
  return twMerge(
    "rounded-full px-3 py-1 text-sm font-medium",
    status === "active" && "bg-green-100 text-green-800 dark:bg-green-900/20",
    status === "inactive" && "bg-red-100 text-red-800 dark:bg-red-900/20",
    status === "pending" &&
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20",
  );
};

// 2. Responsywne klasy
const responsiveClasses = twMerge(
  "w-full",
  "sm:w-1/2",
  "md:w-1/3",
  "lg:w-1/4",
  "xl:w-1/5",
);

// 3. Hover i focus states
const interactiveClasses = twMerge(
  "transition-all duration-200",
  "hover:bg-gray-50 dark:hover:bg-gray-800",
  "focus:ring-2 focus:ring-blue-500 focus:outline-none",
);
```

### **Zaawansowane Wzorce**

```typescript
// Komponent z dynamicznym stylowaniem
interface DynamicCardProps {
  severity: "low" | "medium" | "high";
  isActive: boolean;
}

const DynamicCard: FC<DynamicCardProps> = ({ severity, isActive }) => {
  const cardClasses = twMerge(
    // Bazowe style
    "p-4 rounded-lg border transition-all duration-200",

    // Style bazujące na severity
    severity === "low" && "border-green-200 bg-green-50 dark:bg-green-900/10",
    severity === "medium" && "border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10",
    severity === "high" && "border-red-200 bg-red-50 dark:bg-red-900/10",

    // Style aktywności
    isActive && "ring-2 ring-blue-500 shadow-lg",
    !isActive && "opacity-75 hover:opacity-100"
  );

  return <div className={cardClasses}>...</div>;
};
```

---

## 📊 **Komponenty Flowbite Pro**

### **Najczęściej Używane**

```typescript
// Tabele
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";

// Formularze
import {
  TextInput,
  Label,
  Textarea,
  Select,
  Button,
  Checkbox,
} from "flowbite-react";

// Layout
import { Card, Modal, Navbar, Sidebar, Badge, Alert } from "flowbite-react";

// Nawigacja
import { Breadcrumb, Pagination, Tabs } from "flowbite-react";
```

### **Przykład Zaawansowanego Bloku**

```typescript
// src/components/blocks/AdvancedDataTable.tsx
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, TextInput, Button, Badge } from "flowbite-react";
import { twMerge } from "tailwind-merge";
import { HiSearch, HiDownload, HiPlus } from "react-icons/hi";

interface DataTableProps<T> {
  data: T[];
  columns: Array<{
    key: keyof T;
    label: string;
    render?: (item: T) => React.ReactNode;
  }>;
  onAdd?: () => void;
  onExport?: () => void;
  searchable?: boolean;
  className?: string;
}

export function AdvancedDataTable<T extends Record<string, any>>({
  data,
  columns,
  onAdd,
  onExport,
  searchable = true,
  className
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = searchable
    ? data.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : data;

  return (
    <div className={twMerge("space-y-4", className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        {searchable && (
          <div className="flex-1 max-w-md">
            <TextInput
              icon={HiSearch}
              placeholder="Szukaj..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}

        <div className="flex space-x-2">
          {onExport && (
            <Button color="gray" onClick={onExport}>
              <HiDownload className="mr-2 h-4 w-4" />
              Eksportuj
            </Button>
          )}
          {onAdd && (
            <Button onClick={onAdd}>
              <HiPlus className="mr-2 h-4 w-4" />
              Dodaj
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableHeadCell key={String(column.key)}>
                  {column.label}
                </TableHeadCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((item, index) => (
              <TableRow
                key={index}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {columns.map((column) => (
                  <TableCell key={String(column.key)}>
                    {column.render ? column.render(item) : String(item[column.key])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Wyświetlono {filteredData.length} z {data.length} rekordów
      </div>
    </div>
  );
}
```

---

## 🛠 **Najlepsze Praktyki**

### **1. Typowanie TypeScript**

```typescript
// Zawsze definiuj interfejsy dla props
interface ComponentProps {
  required: string;
  optional?: number;
  children?: React.ReactNode;
  className?: string;
}

// Używaj generics dla reużywalnych komponentów
interface GenericListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}
```

### **2. Zarządzanie Stylami**

```typescript
// Grupuj style logicznie
const getButtonStyles = (variant: string, size: string) => {
  const base = "transition-all duration-200 font-medium rounded-lg";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return twMerge(base, variants[variant], sizes[size]);
};
```

### **3. Struktura Komponenty**

```typescript
// Zalecana struktura
export const MyComponent: FC<Props> = ({ prop1, prop2, ...rest }) => {
  // 1. Hooks
  const [state, setState] = useState();

  // 2. Computed values
  const computedValue = useMemo(() => {}, []);

  // 3. Event handlers
  const handleClick = useCallback(() => {}, []);

  // 4. Style functions
  const getClasses = () => twMerge(/* ... */);

  // 5. Render
  return (
    <div className={getClasses()}>
      {/* JSX */}
    </div>
  );
};
```

---

## 🔧 **Narzędzia Deweloperskie**

### **VS Code Extensions**

- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- Auto Rename Tag

### **Snippets**

```json
// .vscode/flowbite-block.code-snippets
{
  "Flowbite Block": {
    "prefix": "fblock",
    "body": [
      "import type { FC } from \"react\";",
      "import { Card } from \"flowbite-react\";",
      "import { twMerge } from \"tailwind-merge\";",
      "",
      "interface ${1:ComponentName}Props {",
      "  className?: string;",
      "  ${2:title}: string;",
      "}",
      "",
      "export const ${1:ComponentName}: FC<${1:ComponentName}Props> = ({",
      "  className,",
      "  ${2:title},",
      "}) => {",
      "  return (",
      "    <Card className={twMerge(\"w-full\", className)}>",
      "      <h3 className=\"text-xl font-semibold\">{${2:title}}</h3>",
      "      $0",
      "    </Card>",
      "  );",
      "};"
    ]
  }
}
```

---

## 🚀 **Uruchamianie i Testowanie**

```bash
# Deweloperski serwer
npm run dev

# Build produkcyjny
npm run build

# Linting
npm run lint

# Formatowanie
npm run format
```

---

## 📚 **Zasoby**

- [Flowbite React Documentation](https://flowbite-react.com/)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [tailwind-merge](https://github.com/dcastil/tailwind-merge)

---

**🎯 Pamiętaj**: Zawsze używaj `twMerge` do łączenia klas Tailwind CSS i trzymaj się konwencji TypeScript!
