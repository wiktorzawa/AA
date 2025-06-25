import type { FC } from "react";
import { AdvancedComparisonTable } from "@/components/blocks/application-ui/advanced-tables/comparison";
import { DefaultAdvancedTable } from "@/components/blocks/application-ui/advanced-tables/default";
import { AdvancedTableWithExpandableRows } from "@/components/blocks/application-ui/advanced-tables/expandable-rows";
import { AdvancedTableWithProducts } from "@/components/blocks/application-ui/advanced-tables/products";
import { AdvancedProjectManagementTableForUserTasks } from "@/components/blocks/application-ui/advanced-tables/project-management";
import { AdvancedTableWithSortableRows } from "@/components/blocks/application-ui/advanced-tables/sortable-rows";
import { AdvancedUserManagementTable } from "@/components/blocks/application-ui/advanced-tables/user-management";
import { BlockBreadcrumb } from "@/components/block-breadcrumb";
import { BlockSection } from "@/components/block-section";

export const AdminTablesPage: FC = () => {
  return (
    <div className="p-4">
      <div className="w-full">
        <BlockBreadcrumb
          title="Advanced Tables"
          description="Zaawansowane komponenty tabel z Flowbite Pro dla panelu administratora"
        />

        <BlockSection
          title="Domyślna tabela zaawansowana"
          description="Przykład tabeli z wyszukiwaniem, filtrami i paginacją dla zarządzania danymi w panelu admin."
          githubLink="https://github.com/themesberg/flowbite-react-blocks"
        >
          <DefaultAdvancedTable />
        </BlockSection>

        <BlockSection
          title="Tabela produktów"
          description="Responsywna tabela do wyświetlania produktów z obrazkami, kategoriami, sprzedażą i ocenami."
          githubLink="https://github.com/themesberg/flowbite-react-blocks"
        >
          <AdvancedTableWithProducts />
        </BlockSection>

        <BlockSection
          title="Tabela z rozwijalnymi wierszami"
          description="Interaktywna tabela umożliwiająca rozwijanie wierszy i wyświetlanie szczegółowych informacji o produktach, galerii zdjęć i dodatkowych danych."
          githubLink="https://github.com/themesberg/flowbite-react-blocks"
        >
          <AdvancedTableWithExpandableRows />
        </BlockSection>

        <BlockSection
          title="Zarządzanie zadaniami projektu"
          description="Tabela do zarządzania zadaniami z checkboxami, filtrami i awatarami użytkowników."
          githubLink="https://github.com/themesberg/flowbite-react-blocks"
        >
          <AdvancedProjectManagementTableForUserTasks />
        </BlockSection>

        <BlockSection
          title="Tabela z sortowalnymi wierszami"
          description="Zaawansowana tabela z sortowalnymi kolumnami, filtrami dropdown i zarządzaniem produktami."
          githubLink="https://github.com/themesberg/flowbite-react-blocks"
        >
          <AdvancedTableWithSortableRows />
        </BlockSection>

        <BlockSection
          title="Tabela zarządzania użytkownikami"
          description="Kompleksowa tabela CRUD do zarządzania użytkownikami z awatarami, rolami, statusami, profilami społecznościowymi i akcjami."
          githubLink="https://github.com/themesberg/flowbite-react-blocks"
        >
          <AdvancedUserManagementTable />
        </BlockSection>

        <BlockSection
          title="Tabela porównawcza"
          description="Tabela do porównywania wielu zestawów danych, takich jak produkty, pokazująca różnice w specyfikacjach na podstawie wierszy i kolumn."
          githubLink="https://github.com/themesberg/flowbite-react-blocks"
        >
          <AdvancedComparisonTable />
        </BlockSection>
      </div>
    </div>
  );
};
