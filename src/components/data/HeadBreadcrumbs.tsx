import { Breadcrumbs, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const HOME_ROUTE = '/';

interface HeadBreadcrumbsProps {
  /** Already-resolved label for the current (leaf) page, e.g. "Vehicle types". */
  title: string;
}

/**
 * List-head breadcrumb trail: `Home / <title>`.
 *
 * Home links back to the landing route; the leaf is plain text. Routes are
 * plural by convention. The Home label is sourced from i18n (`breadcrumbs.home`).
 *
 * @param props.title - Resolved label for the current page (the trail's leaf).
 * @returns A MUI Breadcrumbs trail with a Home link and the current page.
 */
export default function HeadBreadcrumbs({ title }: HeadBreadcrumbsProps) {
  const { t } = useTranslation();
  return (
    <Breadcrumbs aria-label="breadcrumb" data-testid="breadcrumbs-nav">
      <Link component={RouterLink} to={HOME_ROUTE} underline="hover" color="inherit">
        {t('breadcrumbs.home', 'Home')}
      </Link>
      <Typography component="span" color="text.primary">
        {title}
      </Typography>
    </Breadcrumbs>
  );
}
