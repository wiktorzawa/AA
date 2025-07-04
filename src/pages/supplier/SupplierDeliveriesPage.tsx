import type { FC } from "react";
import { BlockBreadcrumb } from "@/components/block-breadcrumb";
import { HiTruck } from "react-icons/hi";
import AdvancedDeliveriesTableWithExpandableRows from "../../components/tables/ExpandableDeliveriesTable";

const SupplierDeliveriesPage: FC = () => {
  return (
    <>
      <BlockBreadcrumb>
        <BlockBreadcrumb.Item href="/supplier" icon={HiTruck}>
          Panel Dostawcy
        </BlockBreadcrumb.Item>
        <BlockBreadcrumb.Item>Dostawy</BlockBreadcrumb.Item>
      </BlockBreadcrumb>

      <AdvancedDeliveriesTableWithExpandableRows />
    </>
  );
};

export default SupplierDeliveriesPage;
