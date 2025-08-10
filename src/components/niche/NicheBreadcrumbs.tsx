
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface NicheBreadcrumbsProps {
  categoryName: string;
  categorySlug: string;
  categoryEmoji: string;
  subcategoryName: string;
}

export function NicheBreadcrumbs({ 
  categoryName, 
  categorySlug, 
  categoryEmoji, 
  subcategoryName 
}: NicheBreadcrumbsProps) {
  const { t } = useLanguage();
  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">{t('breadcrumbs.home')}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/generate-pins">{t('nav.generatePins')}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild className="flex items-center gap-2">
            <Link to="/generate-pins">
              <span>{categoryEmoji}</span>
              {categoryName}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{subcategoryName}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
